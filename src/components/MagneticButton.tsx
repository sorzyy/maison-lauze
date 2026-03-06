import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/context/ReducedMotionContext';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  strength?: number;
  radius?: number;
}

export function MagneticButton({
  children,
  href,
  target,
  rel,
  onClick,
  className = '',
  style = {},
  strength = 0.45,
  radius = 90,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const isActiveRef = useRef(false);
  
  // Récupérer la préférence reduced-motion
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // En mode reduced-motion, désactiver complètement l'effet magnétique
    if (reducedMotion) {
      // S'assurer que l'élément est à sa position d'origine
      gsap.set(el, { x: 0, y: 0 });
      return;
    }

    // Create GSAP quickTo for smooth animation
    const xTo = gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power2.out' });

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        isActiveRef.current = true;
        // Calculate magnetic translation
        const factor = 1 - dist / radius;
        const translateX = dx * factor * strength;
        const translateY = dy * factor * strength;
        
        xTo(translateX);
        yTo(translateY);
      } else if (isActiveRef.current) {
        isActiveRef.current = false;
        // Return to original position with elastic effect
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)',
        });
      }
    };

    const handleMouseLeave = () => {
      if (isActiveRef.current) {
        isActiveRef.current = false;
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [strength, radius, reducedMotion]);

  const baseStyle: CSSProperties = {
    willChange: 'transform',
    ...style,
  };

  if (onClick || !href) {
    return (
      <button
        ref={ref as React.RefObject<HTMLButtonElement>}
        onClick={onClick}
        className={className}
        style={baseStyle}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      target={target}
      rel={rel}
      className={className}
      style={baseStyle}
    >
      {children}
    </a>
  );
}
