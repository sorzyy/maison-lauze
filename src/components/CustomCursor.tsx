import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/context/ReducedMotionContext';

type CursorState = 'default' | 'button' | 'wine' | 'link' | 'magnetic' | 'arrow';

interface CursorConfig {
  width: number;
  height: number;
  borderRadius: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  scale: number;
  mixBlendMode: 'normal' | 'difference' | 'exclusion';
  skewX: number;
  skewY: number;
  rotate: number;
}

const CURSOR_CONFIGS: Record<CursorState, CursorConfig> = {
  default: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: 'rgba(107, 29, 88, 0.8)',
    borderColor: 'rgba(196, 64, 42, 0.6)',
    borderWidth: 1,
    scale: 1,
    mixBlendMode: 'normal',
    skewX: 0,
    skewY: 0,
    rotate: 0,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: 'rgba(107, 29, 88, 0.15)',
    borderColor: '#6a1d58',
    borderWidth: 1,
    scale: 1,
    mixBlendMode: 'normal',
    skewX: 0,
    skewY: 0,
    rotate: 0,
  },
  wine: {
    width: 28,
    height: 52,
    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
    backgroundColor: 'rgba(107, 29, 88, 0.12)',
    borderColor: '#6a1d58',
    borderWidth: 1,
    scale: 1,
    mixBlendMode: 'normal',
    skewX: 0,
    skewY: 0,
    rotate: 0,
  },
  link: {
    width: 80,
    height: 3,
    borderRadius: '2px',
    backgroundColor: '#c4402a',
    borderColor: '#c4402a',
    borderWidth: 0,
    scale: 1,
    mixBlendMode: 'normal',
    skewX: 0,
    skewY: 0,
    rotate: 0,
  },
  magnetic: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    backgroundColor: 'rgba(107, 29, 88, 0.08)',
    borderColor: '#6a1d58',
    borderWidth: 1,
    scale: 1,
    mixBlendMode: 'difference',
    skewX: 0,
    skewY: 0,
    rotate: 0,
  },
  arrow: {
    width: 48,
    height: 16,
    borderRadius: '8px',
    backgroundColor: 'rgba(196, 64, 42, 0.9)',
    borderColor: 'transparent',
    borderWidth: 0,
    scale: 1,
    mixBlendMode: 'normal',
    skewX: -20,
    skewY: 0,
    rotate: 0,
  },
};

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const stateRef = useRef<CursorState>('default');
  const mousePos = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  // const velocityRef = useRef({ x: 0, y: 0 });
  const isMovingRef = useRef(false);
  const moveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Références pour les animations quickTo
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);
  const skewXTo = useRef<gsap.QuickToFunc | null>(null);
  const skewYTo = useRef<gsap.QuickToFunc | null>(null);
  const scaleTo = useRef<gsap.QuickToFunc | null>(null);
  const rotateTo = useRef<gsap.QuickToFunc | null>(null);
  
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

  // Animation de respiration au repos
  useEffect(() => {
    if (isTouchDevice || !cursorRef.current || reducedMotion) return;

    const breathingTween = gsap.to(cursorRef.current, {
      scale: 1.15,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      paused: true,
    });

    // Démarrer la respiration après une période d'inactivité
    const startBreathing = () => {
      breathingTween.play();
    };

    const stopBreathing = () => {
      breathingTween.pause();
      gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
    };

    // Exposer pour utilisation dans les handlers
    (cursorRef.current as HTMLElement & { startBreathing?: () => void; stopBreathing?: () => void }).startBreathing = startBreathing;
    (cursorRef.current as HTMLElement & { startBreathing?: () => void; stopBreathing?: () => void }).stopBreathing = stopBreathing;

    return () => {
      breathingTween.kill();
    };
  }, [isTouchDevice, reducedMotion]);

  // Initialisation des animations GSAP
  useEffect(() => {
    if (isTouchDevice || !cursorRef.current) return;

    // Créer les fonctions quickTo pour un suivi fluide
    const duration = reducedMotion ? 0 : 0.08;
    const ease = reducedMotion ? 'none' : 'power2.out';

    xTo.current = gsap.quickTo(cursorRef.current, 'x', { duration, ease });
    yTo.current = gsap.quickTo(cursorRef.current, 'y', { duration, ease });
    skewXTo.current = gsap.quickTo(cursorRef.current, 'skewX', { duration: 0.15, ease: 'power2.out' });
    skewYTo.current = gsap.quickTo(cursorRef.current, 'skewY', { duration: 0.15, ease: 'power2.out' });
    scaleTo.current = gsap.quickTo(cursorRef.current, 'scale', { duration: 0.2, ease: 'power2.out' });
    rotateTo.current = gsap.quickTo(cursorRef.current, 'rotate', { duration: 0.15, ease: 'power2.out' });

    return () => {
      xTo.current = null;
      yTo.current = null;
      skewXTo.current = null;
      skewYTo.current = null;
      scaleTo.current = null;
      rotateTo.current = null;
    };
  }, [isTouchDevice, reducedMotion]);

  // Calculer la vélocité et appliquer l'effet d'étirement
  const updateStretch = useCallback(() => {
    if (!cursorRef.current || reducedMotion) return;

    const velocityX = mousePos.current.x - mousePos.current.prevX;
    const velocityY = mousePos.current.y - mousePos.current.prevY;
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

    // Limiter la vélocité pour éviter des distorsions excessives
    const maxSkew = 25;
    const skewX = gsap.utils.clamp(-maxSkew, maxSkew, velocityY * 0.5);
    const skewY = gsap.utils.clamp(-maxSkew, maxSkew, velocityX * 0.5);

    // Calculer l'angle de rotation basé sur la direction
    const angle = Math.atan2(velocityY, velocityX) * (180 / Math.PI);

    if (skewXTo.current && skewYTo.current && rotateTo.current) {
      // Appliquer l'étirement uniquement si on bouge assez vite
      if (speed > 2) {
        skewXTo.current(skewX);
        skewYTo.current(skewY);
        rotateTo.current(angle * 0.1); // Rotation subtile
        
        // Étirement proportionnel à la vitesse
        const stretchScale = Math.min(1 + speed * 0.01, 1.4);
        if (scaleTo.current) {
          scaleTo.current(stretchScale);
        }
      } else {
        // Retour à la forme normale
        skewXTo.current(0);
        skewYTo.current(0);
        rotateTo.current(0);
        if (scaleTo.current) {
          scaleTo.current(1);
        }
      }
    }

    // Mettre à jour les positions précédentes
    mousePos.current.prevX = mousePos.current.x;
    mousePos.current.prevY = mousePos.current.y;
  }, [reducedMotion]);

  // Mettre à jour l'apparence du curseur selon l'état
  const updateCursorAppearance = useCallback((state: CursorState) => {
    if (!cursorRef.current || state === stateRef.current) return;
    
    stateRef.current = state;
    const config = CURSOR_CONFIGS[state];

    // Arrêter la respiration pendant les interactions
    const cursorEl = cursorRef.current as HTMLElement & { stopBreathing?: () => void; startBreathing?: () => void };
    if (cursorEl.stopBreathing) cursorEl.stopBreathing();

    // En mode reduced-motion, pas d'animation de morphing (duration = 0)
    const duration = reducedMotion ? 0 : 0.35;
    const ease = reducedMotion ? 'none' : 'elastic.out(1, 0.5)';

    gsap.to(cursorRef.current, {
      width: config.width,
      height: config.height,
      borderRadius: config.borderRadius,
      backgroundColor: config.backgroundColor,
      borderColor: config.borderColor,
      borderWidth: config.borderWidth,
      skewX: config.skewX,
      skewY: config.skewY,
      rotate: config.rotate,
      scale: config.scale,
      mixBlendMode: config.mixBlendMode,
      duration,
      ease,
      onComplete: () => {
        // Redémarrer la respiration si on revient à l'état par défaut
        if (state === 'default' && cursorEl.startBreathing) {
          setTimeout(() => cursorEl.startBreathing?.(), 500);
        }
      }
    });

    // Animation du curseur interne (effet liquide)
    if (cursorInnerRef.current) {
      gsap.to(cursorInnerRef.current, {
        scale: state === 'default' ? 1 : 0.6,
        opacity: state === 'default' ? 1 : 0,
        duration: reducedMotion ? 0 : 0.2,
      });
    }
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
        scale: 0.3,
        opacity: 0.8,
        borderRadius: '50%',
      },
      {
        scale: 3,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }
    );
  }, [reducedMotion]);

  // Détecter le type d'élément
  const detectCursorType = useCallback((target: Element): CursorState => {
    // Vérifier les attributs data-cursor en premier
    const dataCursor = target.getAttribute('data-cursor');
    if (dataCursor && ['button', 'wine', 'link', 'magnetic', 'arrow'].includes(dataCursor)) {
      return dataCursor as CursorState;
    }

    // Vérifier si c'est un lien externe (flèche)
    const isExternalLink = target.closest('a[target="_blank"]');
    if (isExternalLink) return 'arrow';

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
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      
      // Mettre à jour la position du curseur
      if (xTo.current && yTo.current) {
        const config = CURSOR_CONFIGS[stateRef.current];
        xTo.current(e.clientX - config.width / 2);
        yTo.current(e.clientY - config.height / 2);
      }

      // Gérer l'état de mouvement
      isMovingRef.current = true;
      
      // Mettre à jour le stretch
      updateStretch();

      // Réinitialiser le timeout de repos
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
      
      moveTimeoutRef.current = setTimeout(() => {
        isMovingRef.current = false;
        // Redémarrer la respiration après un moment d'inactivité
        if (stateRef.current === 'default') {
          const cursorEl = cursorRef.current as HTMLElement & { startBreathing?: () => void };
          if (cursorEl?.startBreathing) {
            cursorEl.startBreathing();
          }
        }
      }, 150);

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
      
      // Effet de pression sur le curseur
      if (cursorRef.current && !reducedMotion) {
        gsap.to(cursorRef.current, {
          scale: 0.8,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
        });
      }
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
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, [isTouchDevice, isVisible, detectCursorType, updateCursorAppearance, createRipple, updateStretch, reducedMotion]);

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
      {/* SVG Filter pour effet "gooey" liquide */}
      <svg className="fixed top-0 left-0 w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Curseur principal avec effet liquide */}
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
          filter: stateRef.current === 'default' ? 'url(#gooey)' : 'none',
        }}
      >
        {/* Curseur interne pour effet de profondeur */}
        <div
          ref={cursorInnerRef}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 50%)',
            transform: 'scale(0.5)',
            opacity: 0,
          }}
        />
        
        {/* Indicateur de direction pour l'état flèche */}
        {stateRef.current === 'arrow' && (
          <div
            className="absolute right-1 top-1/2 -translate-y-1/2"
            style={{
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderLeft: '10px solid white',
            }}
          />
        )}
      </div>

      {/* Effet de ripple avec blur */}
      <div
        ref={rippleRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '2px solid rgba(196, 64, 42, 0.6)',
          opacity: 0,
          willChange: 'transform, opacity',
          filter: 'blur(2px)',
        }}
      />

      {/* Trail liquide (plusieurs points qui suivent) */}
      {!reducedMotion && Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="fixed top-0 left-0 pointer-events-none z-[9997]"
          style={{
            width: 6 - i * 1.5,
            height: 6 - i * 1.5,
            borderRadius: '50%',
            backgroundColor: `rgba(196, 64, 42, ${0.3 - i * 0.1})`,
            opacity: isVisible ? 1 : 0,
            willChange: 'transform',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(1px)',
          }}
          ref={(el) => {
            if (!el) return;
            // Créer une animation de suivi retardé pour chaque point
            gsap.quickTo(el, 'x', { duration: 0.15 + i * 0.05, ease: 'power2.out' });
            gsap.quickTo(el, 'y', { duration: 0.15 + i * 0.05, ease: 'power2.out' });
          }}
        />
      ))}
    </>
  );
}

export default CustomCursor;
