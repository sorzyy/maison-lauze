import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/context/ReducedMotionContext';

type CursorState = 'default' | 'button' | 'wine' | 'link' | 'magnetic';

interface CursorConfig {
  width: number;
  height: number;
  borderRadius: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  scale: number;
  mixBlendMode: 'normal' | 'difference' | 'exclusion';
}

const CURSOR_CONFIGS: Record<CursorState, CursorConfig> = {
  default: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'transparent',
    borderColor: '#6a1d58',
    borderWidth: 2,
    scale: 1,
    mixBlendMode: 'normal',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: 'rgba(107, 29, 88, 0.2)',
    borderColor: '#6a1d58',
    borderWidth: 1,
    scale: 1,
    mixBlendMode: 'normal',
  },
  wine: {
    width: 24,
    height: 48,
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    backgroundColor: 'rgba(107, 29, 88, 0.15)',
    borderColor: '#6a1d58',
    borderWidth: 1,
    scale: 1,
    mixBlendMode: 'normal',
  },
  link: {
    width: 60,
    height: 4,
    borderRadius: '2px',
    backgroundColor: '#6a1d58',
    borderColor: '#6a1d58',
    borderWidth: 0,
    scale: 1,
    mixBlendMode: 'normal',
  },
  magnetic: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    backgroundColor: 'rgba(107, 29, 88, 0.1)',
    borderColor: '#6a1d58',
    borderWidth: 1,
    scale: 1,
    mixBlendMode: 'difference',
  },
};

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const stateRef = useRef<CursorState>('default');
  const mousePos = useRef({ x: 0, y: 0 });
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  
  // Récupérer la préférence reduced-motion
  const reducedMotion = useReducedMotion();

  // Détection des appareils tactiles
  useEffect(() => {
    const checkTouch = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(isTouch);
    };
    checkTouch();
  }, []);

  // Initialisation des animations GSAP
  useEffect(() => {
    if (isTouchDevice || !cursorRef.current) return;

    // Créer les fonctions quickTo pour un suivi fluide
    // En mode reduced-motion, le suivi est instantané (duration = 0)
    xTo.current = gsap.quickTo(cursorRef.current, 'x', {
      duration: reducedMotion ? 0 : 0.15,
      ease: reducedMotion ? 'none' : 'power3.out',
    });
    yTo.current = gsap.quickTo(cursorRef.current, 'y', {
      duration: reducedMotion ? 0 : 0.15,
      ease: reducedMotion ? 'none' : 'power3.out',
    });

    return () => {
      xTo.current = null;
      yTo.current = null;
    };
  }, [isTouchDevice, reducedMotion]);

  // Mettre à jour l'apparence du curseur selon l'état
  const updateCursorAppearance = useCallback((state: CursorState) => {
    if (!cursorRef.current || state === stateRef.current) return;
    
    stateRef.current = state;
    const config = CURSOR_CONFIGS[state];

    // En mode reduced-motion, pas d'animation de morphing (duration = 0)
    gsap.to(cursorRef.current, {
      width: config.width,
      height: config.height,
      borderRadius: config.borderRadius,
      backgroundColor: config.backgroundColor,
      borderColor: config.borderColor,
      borderWidth: config.borderWidth,
      scale: config.scale,
      mixBlendMode: config.mixBlendMode,
      duration: reducedMotion ? 0 : 0.3,
      ease: reducedMotion ? 'none' : 'power2.out',
    });
  }, [reducedMotion]);

  // Effet de ripple au clic
  const createRipple = useCallback((x: number, y: number) => {
    if (!rippleRef.current) return;

    const ripple = rippleRef.current;
    
    // En mode reduced-motion, pas d'animation ripple
    if (reducedMotion) return;
    
    gsap.fromTo(
      ripple,
      {
        x: x - 20,
        y: y - 20,
        scale: 0.5,
        opacity: 0.6,
      },
      {
        scale: 2.5,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      }
    );
  }, [reducedMotion]);

  // Détecter le type d'élément
  const detectCursorType = useCallback((target: Element): CursorState => {
    // Vérifier les attributs data-cursor en premier
    const dataCursor = target.getAttribute('data-cursor');
    if (dataCursor && ['button', 'wine', 'link', 'magnetic'].includes(dataCursor)) {
      return dataCursor as CursorState;
    }

    // Vérifier les classes spécifiques
    if (target.closest('.magnetic-button') || target.closest('[data-cursor="magnetic"]')) {
      return 'magnetic';
    }
    if (target.closest('.wine-card') || target.closest('[data-cursor="wine"]')) {
      return 'wine';
    }

    // Vérifier les éléments interactifs natifs
    const interactiveElement = target.closest('a, button, [role="button"], input, textarea, select');
    if (interactiveElement) {
      // Déterminer si c'est un lien texte ou un bouton
      const tagName = interactiveElement.tagName.toLowerCase();
      const isTextLink = tagName === 'a' && interactiveElement.textContent && interactiveElement.textContent.trim().length > 0;
      
      if (isTextLink && !interactiveElement.querySelector('svg, img')) {
        return 'link';
      }
      return 'button';
    }

    return 'default';
  }, []);

  // Gestionnaires d'événements
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      if (xTo.current && yTo.current) {
        const config = CURSOR_CONFIGS[stateRef.current];
        xTo.current(e.clientX - config.width / 2);
        yTo.current(e.clientY - config.height / 2);
      }

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleElementEnter = (e: MouseEvent) => {
      const target = e.target as Element;
      const cursorType = detectCursorType(target);
      updateCursorAppearance(cursorType);
    };

    const handleElementLeave = () => {
      updateCursorAppearance('default');
    };

    const handleClick = (e: MouseEvent) => {
      createRipple(e.clientX, e.clientY);
    };

    // Ajouter les écouteurs globaux
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('click', handleClick);

    // Ajouter les écouteurs sur les éléments interactifs
    const addInteractiveListeners = () => {
      const selectors = [
        'a',
        'button',
        '[role="button"]',
        '.wine-card',
        '.magnetic-button',
        '[data-cursor]',
        'input',
        'textarea',
        'select',
      ];

      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          el.addEventListener('mouseenter', handleElementEnter as EventListener);
          el.addEventListener('mouseleave', handleElementLeave);
        });
      });
    };

    addInteractiveListeners();

    // Observer les mutations du DOM pour ajouter les écouteurs aux nouveaux éléments
    const observer = new MutationObserver(() => {
      addInteractiveListeners();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('click', handleClick);
      observer.disconnect();
    };
  }, [isTouchDevice, isVisible, detectCursorType, updateCursorAppearance, createRipple]);

  // Masquer le curseur natif sur desktop
  useEffect(() => {
    if (isTouchDevice) return;

    const style = document.createElement('style');
    style.textContent = `
      * { cursor: none !important; }
      @media (pointer: coarse) {
        * { cursor: auto !important; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isTouchDevice]);

  // Ne pas rendre sur les appareils tactiles
  if (isTouchDevice) return null;

  const defaultConfig = CURSOR_CONFIGS.default;

  return (
    <>
      {/* Curseur principal */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: defaultConfig.width,
          height: defaultConfig.height,
          borderRadius: defaultConfig.borderRadius,
          backgroundColor: defaultConfig.backgroundColor,
          border: `${defaultConfig.borderWidth}px solid ${defaultConfig.borderColor}`,
          mixBlendMode: defaultConfig.mixBlendMode,
          opacity: isVisible ? 1 : 0,
          willChange: 'transform, width, height, border-radius, background-color',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Effet de ripple */}
      <div
        ref={rippleRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(107, 29, 88, 0.5)',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
      />
    </>
  );
}
