import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/context/ReducedMotionContext';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}

export function ParallaxImage({
  src,
  alt,
  className = '',
  speed = 0.5,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Récupérer la préférence reduced-motion
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    // En mode reduced-motion, afficher l'image statique centrée sans effet parallaxe
    if (reducedMotion) {
      gsap.set(image, {
        yPercent: 0,
        scale: 1,
      });
      return;
    }

    // Parallax effect with scale
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    tl.fromTo(
      image,
      {
        yPercent: 20 * speed,
        scale: 1.0,
      },
      {
        yPercent: -20 * speed,
        scale: 1.1,
        ease: 'none',
      }
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) {
          st.kill();
        }
      });
    };
  }, [speed, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        border: '1px solid rgba(107, 29, 88, 0.3)',
      }}
    >
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 80% at 50% 50%,
              transparent 40%,
              rgba(10, 1, 8, 0.4) 100%
            )
          `,
          mixBlendMode: 'multiply',
        }}
      />
      {/* Edge vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 60px 20px rgba(10, 1, 8, 0.5)',
        }}
      />
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover will-change-transform"
        style={reducedMotion ? { objectPosition: 'center center' } : undefined}
      />
    </div>
  );
}
