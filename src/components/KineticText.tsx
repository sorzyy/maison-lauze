import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface KineticTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  triggerOnScroll?: boolean;
  id?: string;
}

export function KineticText({
  text,
  className = '',
  delay = 0,
  staggerDelay = 0.04,
  triggerOnScroll = true,
  id,
}: KineticTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      container.style.opacity = '1';
      return;
    }

    const chars = container.querySelectorAll('.kinetic-char');
    
    gsap.set(chars, { 
      opacity: 0, 
      y: 20, 
      rotateX: -90,
      transformOrigin: 'center bottom'
    });

    const tl = gsap.timeline({
      delay,
      scrollTrigger: triggerOnScroll ? {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none none',
        onEnter: (self) => triggersRef.current.push(self),
      } : undefined,
    });

    tl.to(chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.6,
      stagger: staggerDelay,
      ease: 'back.out(1.7)',
    });

    return () => {
      triggersRef.current.forEach(st => st.kill());
      triggersRef.current = [];
    };
  }, [delay, staggerDelay, triggerOnScroll]);

  return (
    <span ref={containerRef} className={`inline-block ${className}`} id={id} style={{ perspective: '1000px' }}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="kinetic-char inline-block"
          style={{ 
            display: char === ' ' ? 'inline' : 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
