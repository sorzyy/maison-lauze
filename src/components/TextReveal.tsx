import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export function TextReveal({ 
  children, 
  className = '', 
  delay = 0, 
  stagger = 0.02,
  as: Component = 'span'
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasAnimated.current) return;

    const chars = el.querySelectorAll('.char');
    
    const triggers: ScrollTrigger[] = [];
    
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        
        gsap.fromTo(chars,
          { 
            y: 100, 
            opacity: 0,
            rotateX: -90
          },
          { 
            y: 0, 
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            stagger: stagger,
            ease: 'power4.out',
            delay: delay
          }
        );
      }
    });
    
    triggers.push(trigger);

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, [delay, stagger]);

  const words = children.split(' ');

  return (
    <Component
      ref={containerRef as any}
      className={`inline-block overflow-hidden ${className}`}
      style={{ perspective: '1000px' }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split('').map((char, charIndex) => (
            <span
              key={charIndex}
              className="char inline-block"
              style={{ 
                transformOrigin: 'center bottom',
                opacity: 0
              }}
            >
              {char}
            </span>
          ))}
          {wordIndex < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Component>
  );
}
