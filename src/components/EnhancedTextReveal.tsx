import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface EnhancedTextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  splitBy?: 'chars' | 'words';
}

export function EnhancedTextReveal({ 
  children, 
  className = '', 
  delay = 0, 
  stagger = 0.03,
  splitBy = 'chars'
}: EnhancedTextRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasAnimated.current) return;

    const items = el.querySelectorAll('.reveal-item');
    
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        
        gsap.fromTo(items,
          { 
            y: '120%', 
            opacity: 0,
            rotateX: -80,
            scale: 0.8
          },
          { 
            y: '0%', 
            opacity: 1,
            rotateX: 0,
            scale: 1,
            duration: 1.4,
            stagger: stagger,
            ease: 'power4.out',
            delay: delay
          }
        );
      }
    });

    return () => {
      trigger.kill();
    };
  }, [delay, stagger]);

  const content = splitBy === 'words' 
    ? children.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <span className="reveal-item inline-block" style={{ transformOrigin: 'center bottom' }}>
            {word}
          </span>
        </span>
      ))
    : children.split('').map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span className="reveal-item inline-block" style={{ transformOrigin: 'center bottom' }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ));

  return (
    <span ref={containerRef} className={className} style={{ perspective: '1000px' }}>
      {content}
    </span>
  );
}
