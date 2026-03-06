import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'maison-lauze-reduced-motion';

/**
 * Hook pour détecter et gérer la préférence reduced-motion
 * Combine la détection système (prefers-reduced-motion) avec une préférence utilisateur stockée
 */
export function useReducedMotion(): boolean {
  // Vérifier si l'utilisateur a une préférence stockée
  const getStoredPreference = (): boolean | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {
      // localStorage non disponible (mode privé, etc.)
    }
    return null;
  };

  // Vérifier la préférence système
  const getSystemPreference = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  // Initialiser avec la préférence stockée ou système
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    const stored = getStoredPreference();
    return stored !== null ? stored : getSystemPreference();
  });

  // Écouter les changements de préférence système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Ne mettre à jour que si l'utilisateur n'a pas de préférence stockée
      const stored = getStoredPreference();
      if (stored === null) {
        setReducedMotion(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}

/**
 * Hook pour obtenir et définir la préférence reduced-motion (inclut le setter)
 */
export function useReducedMotionWithSetter(): [boolean, (value: boolean) => void] {
  const reducedMotion = useReducedMotion();
  const [localValue, setLocalValue] = useState<boolean>(reducedMotion);

  // Synchroniser avec le hook parent
  useEffect(() => {
    setLocalValue(reducedMotion);
  }, [reducedMotion]);

  const setReducedMotionPreference = useCallback((value: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
      setLocalValue(value);
      // Dispatcher un événement personnalisé pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('reducedMotionChange', { detail: value }));
    } catch {
      // localStorage non disponible
      setLocalValue(value);
    }
  }, []);

  return [localValue, setReducedMotionPreference];
}

/**
 * Écouter les changements de préférence reduced-motion (pour les composants qui ne peuvent pas utiliser le contexte)
 */
export function useReducedMotionListener(callback: (reduced: boolean) => void): void {
  useEffect(() => {
    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      callback(customEvent.detail);
    };

    window.addEventListener('reducedMotionChange', handleChange);
    return () => window.removeEventListener('reducedMotionChange', handleChange);
  }, [callback]);
}
