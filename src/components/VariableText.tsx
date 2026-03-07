import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface VariableTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  style?: React.CSSProperties;
  weightStart?: number;
  weightEnd?: number;
  spacingStart?: number;
  spacingEnd?: number;
  scaleStart?: number;
  scaleEnd?: number;
  breathe?: boolean;
  breatheDuration?: number;
  triggerStart?: string;
  triggerEnd?: string;
}

export function VariableText({
  children,
  as: Component = 'h2',
  className = '',
  style = {},
  weightStart = 300,
  weightEnd = 500,
  spacingStart = 0.02,
  spacingEnd = -0.02,
  scaleStart = 1,
  scaleEnd = 1.02,
  breathe = true,
  breatheDuration = 4,
  triggerStart = 'top 80%',
  triggerEnd = 'bottom 20%',
}: VariableTextProps) {
  const elementRef = useRef<HTMLElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Animation de scroll : font-weight, letter-spacing et scale
    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: triggerStart,
      end: triggerEnd,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Interpolation des valeurs
        const weight = weightStart + (weightEnd - weightStart) * progress;
        const spacing = spacingStart + (spacingEnd - spacingStart) * progress;
        const scale = scaleStart + (scaleEnd - scaleStart) * progress;
        
        // Application des styles
        gsap.set(element, {
          fontWeight: weight,
          letterSpacing: `${spacing}em`,
          scale: scale,
        });
      },
    });
    
    triggersRef.current.push(scrollTrigger);

    // Effet de "respiration" continu (scale subtil)
    let breatheTween: gsap.core.Tween | null = null;
    if (breathe) {
      breatheTween = gsap.to(element, {
        scale: scaleEnd * 1.01,
        duration: breatheDuration / 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        paused: true,
      });

      // Démarre la respiration quand l'élément est visible
      const breatheTrigger = ScrollTrigger.create({
        trigger: element,
        start: 'top 90%',
        end: 'bottom 10%',
        onEnter: () => breatheTween?.play(),
        onLeave: () => breatheTween?.pause(),
        onEnterBack: () => breatheTween?.play(),
        onLeaveBack: () => breatheTween?.pause(),
      });
      
      triggersRef.current.push(breatheTrigger);
    }

    return () => {
      // Nettoie tous les triggers
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
      if (breatheTween) {
        breatheTween.kill();
      }
    };
  }, [weightStart, weightEnd, spacingStart, spacingEnd, scaleStart, scaleEnd, breathe, breatheDuration, triggerStart, triggerEnd]);

  return (
    <Component
      ref={elementRef as React.RefObject<HTMLHeadingElement>}
      className={className}
      style={{
        ...style,
        willChange: 'font-weight, letter-spacing, transform',
        fontWeight: weightStart,
        letterSpacing: `${spacingStart}em`,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </Component>
  );
}

// Hook personnalisé pour animer n'importe quel élément de titre
export function useVariableText<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const weight = 300 + 200 * progress;
        const spacing = 0.02 - 0.04 * progress;
        const scale = 1 + 0.02 * progress;
        
        gsap.set(element, {
          fontWeight: weight,
          letterSpacing: `${spacing}em`,
          scale: scale,
        });
      },
    });
    
    triggersRef.current.push(scrollTrigger);

    // Animation de respiration
    const breatheTween = gsap.to(element, {
      scale: 1.01,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      paused: true,
    });

    const breatheTrigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      end: 'bottom 10%',
      onEnter: () => breatheTween.play(),
      onLeave: () => breatheTween.pause(),
      onEnterBack: () => breatheTween.play(),
      onLeaveBack: () => breatheTween.pause(),
    });
    
    triggersRef.current.push(breatheTrigger);

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
      breatheTween.kill();
    };
  }, []);

  return ref;
}
