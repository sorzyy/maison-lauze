import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const C = {
  accent: '#8B3A3A',
  text: '#5C4033',
  bg: '#F5EDE4',
  sage: '#7A8B6E',
};

export function Loader({ onDone }: { onDone: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const tl = gsap.timeline();
      tl.to(textRef.current, { opacity: 0, y: -20, duration: 0.5 })
        .to(loaderRef.current, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: onDone,
        });
    }
  }, [progress, onDone]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[500] flex items-center justify-center"
      style={{ background: C.bg, clipPath: 'inset(0 0 0% 0)' }}
    >
      <div className="text-center">
        <span ref={textRef} className="block text-4xl md:text-6xl font-light mb-4" 
          style={{ fontFamily: "'Cormorant Garamond', serif", color: C.text }}>
          Cognard
        </span>
        <div className="w-48 h-px mx-auto overflow-hidden" style={{ background: `${C.text}20` }}>
          <div 
            className="h-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%`, background: C.accent }}
          />
        </div>
        <span className="block text-xs tracking-[0.3em] uppercase mt-4" 
          style={{ color: C.sage, fontFamily: "'Inter', sans-serif" }}>
          Chargement...
        </span>
      </div>
    </div>
  );
}
