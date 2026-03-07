import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotionContext } from '@/context/ReducedMotionContext';

gsap.registerPlugin(ScrollTrigger);

interface RevealOnScrollProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Composant RevealOnScroll
 * 
 * Effet de révélation au scroll avec clip-path qui se retire.
 * Direction 'up' (par défaut) : masque se retire de bas en haut
 * Direction 'down' : masque se retire de haut en bas  
 * Direction 'left' : masque se retire de droite à gauche
 * Direction 'right' : masque se retire de gauche à droite
 * 
 * Exemple d'utilisation:
 * <RevealOnScroll direction="up" delay={0.2}>
 *   <img src="..." alt="..." />
 * </RevealOnScroll>
 */
export function RevealOnScroll({
  children,
  direction = 'up',
  delay = 0,
  duration = 1,
  className = '',
}: RevealOnScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useReducedMotionContext();

  // Déterminer les valeurs clip-path selon la direction
  const getClipPath = () => {
    switch (direction) {
      case 'up':
        return {
          from: 'inset(100% 0 0 0)',    // Masqué en bas
          to: 'inset(0 0 0 0)',          // Révélé complet
        };
      case 'down':
        return {
          from: 'inset(0 0 100% 0)',    // Masqué en haut
          to: 'inset(0 0 0 0)',          // Révélé complet
        };
      case 'left':
        return {
          from: 'inset(0 100% 0 0)',    // Masqué à droite
          to: 'inset(0 0 0 0)',          // Révélé complet
        };
      case 'right':
        return {
          from: 'inset(0 0 0 100%)',    // Masqué à gauche
          to: 'inset(0 0 0 0)',          // Révélé complet
        };
      default:
        return {
          from: 'inset(100% 0 0 0)',
          to: 'inset(0 0 0 0)',
        };
    }
  };

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const clipPaths = getClipPath();

    // Mode réduit : afficher directement sans animation
    if (reducedMotion) {
      gsap.set(element, {
        clipPath: clipPaths.to,
        opacity: 1,
      });
      return;
    }

    // Animation normale avec GSAP
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(element, {
        clipPath: clipPaths.from,
        opacity: 1,
      });

      // Animate on scroll
      gsap.to(element, {
        clipPath: clipPaths.to,
        duration: duration,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none none',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [direction, delay, duration, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`reveal-scroll ${className}`}
      style={{ opacity: 0 }} // Commencer invisible pour éviter le flash
    >
      {children}
    </div>
  );
}

/**
 * Variante "rideau" horizontale
 * Effet de rideau qui s'ouvre depuis le centre
 */
export function RevealCurtain({
  children,
  delay = 0,
  duration = 1,
  className = '',
}: Omit<RevealOnScrollProps, 'direction'>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useReducedMotionContext();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    if (reducedMotion) {
      gsap.set(element, {
        clipPath: 'inset(0 0% 0 0%)',
        opacity: 1,
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Rideau fermé (masqué sur les côtés)
      gsap.set(element, {
        clipPath: 'inset(0 50% 0 50%)',
        opacity: 1,
      });

      // Rideau qui s'ouvre
      gsap.to(element, {
        clipPath: 'inset(0 0% 0 0%)',
        duration: duration,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [delay, duration, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`reveal-curtain ${className}`}
      style={{ opacity: 0 }}
    >
      {children}
    </div>
  );
}

export default RevealOnScroll;
