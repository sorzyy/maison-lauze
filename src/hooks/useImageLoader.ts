import { useState, useEffect, useCallback, useRef } from "react";

interface UseImageLoaderReturn {
  /** L'image est chargée avec succès */
  loaded: boolean;
  /** Une erreur s'est produite lors du chargement */
  error: boolean;
  /** Fonction pour réessayer le chargement */
  retry: () => void;
  /** Référence à assigner à l'élément img */
  imageRef: React.RefObject<HTMLImageElement | null>;
}

interface UseImageLoaderOptions {
  /** URL de l'image à charger (optionnel si l'image est déjà dans le DOM) */
  src?: string;
  /** Déclencher le chargement immédiatement */
  immediate?: boolean;
}

/**
 * Hook pour suivre le chargement d'images
 * Utilise Image.onload / onerror pour détecter l'état de chargement
 * 
 * @example
 * // Usage avec une image existante dans le DOM
 * function MyComponent() {
 *   const { loaded, error, retry, imageRef } = useImageLoader();
 *   
 *   return (
 *     <div>
 *       {!loaded && <Skeleton />}
 *       <img 
 *         ref={imageRef}
 *         src="/wine.jpg" 
 *         className={cn("transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
 *       />
 *     </div>
 *   );
 * }
 * 
 * @example
 * // Usage avec préchargement
 * function MyComponent() {
 *   const { loaded } = useImageLoader({ src: "https://example.com/wine.jpg" });
 *   
 *   return loaded ? <img src="https://example.com/wine.jpg" /> : <Skeleton />;
 * }
 */
export function useImageLoader(
  options: UseImageLoaderOptions = {}
): UseImageLoaderReturn {
  const { src, immediate = true } = options;
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const attemptRef = useRef(0);

  const reset = useCallback(() => {
    setLoaded(false);
    setError(false);
    attemptRef.current += 1;
  }, []);

  const retry = useCallback(() => {
    reset();
    // Force le rechargement en ajoutant un paramètre cache-buster
    if (imageRef.current && imageRef.current.src) {
      const currentSrc = imageRef.current.src;
      const cacheBuster = `?_retry=${Date.now()}`;
      const baseSrc = currentSrc.split("?")[0];
      imageRef.current.src = baseSrc + cacheBuster;
    }
  }, [reset]);

  useEffect(() => {
    if (!immediate) return;

    const currentAttempt = attemptRef.current;

    // Si une src est fournie, créer une Image pour précharger
    if (src) {
      const img = new Image();
      
      img.onload = () => {
        if (currentAttempt === attemptRef.current) {
          setLoaded(true);
          setError(false);
        }
      };
      
      img.onerror = () => {
        if (currentAttempt === attemptRef.current) {
          setError(true);
          setLoaded(false);
        }
      };

      img.src = src;

      // Si l'image est déjà en cache, onload peut ne pas se déclencher
      if (img.complete) {
        setLoaded(true);
      }

      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }

    // Si pas de src, on utilise la ref sur un élément img existant
    const imgElement = imageRef.current;
    if (imgElement) {
      const handleLoad = () => {
        if (currentAttempt === attemptRef.current) {
          setLoaded(true);
          setError(false);
        }
      };

      const handleError = () => {
        if (currentAttempt === attemptRef.current) {
          setError(true);
          setLoaded(false);
        }
      };

      imgElement.addEventListener("load", handleLoad);
      imgElement.addEventListener("error", handleError);

      // Vérifier si l'image est déjà chargée
      if (imgElement.complete && imgElement.naturalWidth > 0) {
        setLoaded(true);
      }

      return () => {
        imgElement.removeEventListener("load", handleLoad);
        imgElement.removeEventListener("error", handleError);
      };
    }
  }, [src, immediate]);

  return { loaded, error, retry, imageRef };
}

/**
 * Hook pour précharger plusieurs images
 * 
 * @example
 * const { allLoaded, progress } = useImagesPreloader([
 *   'https://example.com/wine1.jpg',
 *   'https://example.com/wine2.jpg',
 * ]);
 */
export function useImagesPreloader(
  srcs: string[]
): { allLoaded: boolean; progress: number } {
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    if (srcs.length === 0) return;

    let mounted = true;
    setLoadedCount(0);

    srcs.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        if (mounted) {
          setLoadedCount((prev) => prev + 1);
        }
      };
      img.onerror = () => {
        // Même en cas d'erreur, on considère que le chargement est terminé
        if (mounted) {
          setLoadedCount((prev) => prev + 1);
        }
      };
      img.src = src;
      
      // Si déjà en cache
      if (img.complete && img.naturalWidth > 0) {
        if (mounted) {
          setLoadedCount((prev) => prev + 1);
        }
      }
    });

    return () => {
      mounted = false;
    };
  }, [srcs.join(",")]);

  const progress = srcs.length > 0 ? loadedCount / srcs.length : 1;
  const allLoaded = loadedCount >= srcs.length;

  return { allLoaded, progress };
}

export default useImageLoader;
