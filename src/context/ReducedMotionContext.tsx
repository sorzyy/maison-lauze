import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface ReducedMotionContextType {
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
  toggleReducedMotion: () => void;
}

const STORAGE_KEY = 'maison-lauze-reduced-motion';

const ReducedMotionContext = createContext<ReducedMotionContextType | undefined>(undefined);

interface ReducedMotionProviderProps {
  children: ReactNode;
}

export function ReducedMotionProvider({ children }: ReducedMotionProviderProps) {
  // Initialiser depuis localStorage ou prefers-reduced-motion
  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {
      // localStorage non disponible
    }
    
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Écouter les changements de préférence système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Ne mettre à jour que si l'utilisateur n'a pas de préférence stockée
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === null) {
          setReducedMotionState(e.matches);
        }
      } catch {
        setReducedMotionState(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Écouter les changements depuis d'autres composants
  useEffect(() => {
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setReducedMotionState(customEvent.detail);
    };

    window.addEventListener('reducedMotionChange', handleCustomChange);
    return () => window.removeEventListener('reducedMotionChange', handleCustomChange);
  }, []);

  const setReducedMotion = useCallback((value: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // localStorage non disponible
    }
    setReducedMotionState(value);
    // Dispatcher un événement pour synchroniser les autres instances
    window.dispatchEvent(new CustomEvent('reducedMotionChange', { detail: value }));
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setReducedMotion(!reducedMotion);
  }, [reducedMotion, setReducedMotion]);

  return (
    <ReducedMotionContext.Provider value={{ reducedMotion, setReducedMotion, toggleReducedMotion }}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotionContext(): ReducedMotionContextType {
  const context = useContext(ReducedMotionContext);
  if (context === undefined) {
    throw new Error('useReducedMotionContext must be used within a ReducedMotionProvider');
  }
  return context;
}

// Hook simple pour récupérer juste la valeur
export function useReducedMotion(): boolean {
  const context = useContext(ReducedMotionContext);
  if (context === undefined) {
    throw new Error('useReducedMotion must be used within a ReducedMotionProvider');
  }
  return context.reducedMotion;
}
