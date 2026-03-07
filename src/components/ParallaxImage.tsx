import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  scale?: number;
}

export function ParallaxImage({ 
  src, 
  alt, 
  className = '', 
  speed = 0.5,
  scale = 1.1
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const triggers: ScrollTrigger[] = [];

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const yPercent = (self.progress - 0.5) * speed * 100;
        gsap.set(image, { yPercent });
      }
    });
    
    triggers.push(trigger);

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, [speed]);

  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden ${className}`}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ 
          transform: `scale(${scale})`,
          willChange: 'transform'
        }}
      />
    </div>
  );
}
