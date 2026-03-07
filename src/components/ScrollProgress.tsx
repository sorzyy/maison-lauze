import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const C = {
  accent: '#8B3A3A',
  sage: '#7A8B6E',
  text: '#5C4033',
};

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[400] origin-left"
        style={{
          scaleX,
          background: `linear-gradient(90deg, ${C.accent} 0%, ${C.sage} 100%)`,
        }}
      />

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 20,
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
        transition={{ duration: 0.3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Retour en haut"
        className="fixed bottom-8 left-8 z-50 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        style={{
          background: `rgba(92,64,51,0.12)`,
          backdropFilter: 'blur(12px)',
          border: `1px solid rgba(92,64,51,0.2)`,
          color: C.text,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </motion.button>
    </>
  );
}
