import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/context/ReducedMotionContext';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxLayer {
  /** Vitesse de déplacement de la couche (0.2 = lent, 1.0 = normal, 1.5 = rapide) */
  speed: number;
  /** Contenu de la couche */
  content: ReactNode;
  /** Classe CSS additionnelle */
  className?: string;
  /** Style CSS additionnel */
  style?: React.CSSProperties;
}

interface DepthParallaxProps {
  /** Contenu principal (couche centrale, speed = 1.0) */
  children: ReactNode;
  /** Couches supplémentaires avec leurs vitesses */
  layers?: ParallaxLayer[];
  /** Hauteur de la section */
  className?: string;
  /** Style de conteneur */
  style?: React.CSSProperties;
}

/**
 * Composant de parallaxe multi-couches pour effet de profondeur immersif
 * 
 * @example
 * <DepthParallax
 *   layers={[
 *     { speed: 0.2, content: <BackgroundLayer />, className: "z-0" },
 *     { speed: 1.5, content: <ForegroundLayer />, className: "z-20" },
 *   ]}
 * >
 *   <Content />
 * </DepthParallax>
 */
export function DepthParallax({
  children,
  layers = [],
  className = '',
  style = {},
}: DepthParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      // Nettoyer les anciens triggers
      triggersRef.current.forEach(st => st.kill());
      triggersRef.current = [];

      // Créer un ScrollTrigger pour chaque couche
      layers.forEach((layer, index) => {
        const layerEl = containerRef.current?.querySelector(`[data-parallax-layer="${index}"]`);
        if (!layerEl) return;

        // Calculer le déplacement en fonction de la vitesse
        // speed < 1 = bouge moins vite que le scroll (effet éloigné)
        // speed > 1 = bouge plus vite que le scroll (effet proche)
        const speed = layer.speed;
        const yPercent = (1 - speed) * 50; // Déplacement vertical en pourcentage

        const st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;
            // Appliquer le déplacement calculé
            gsap.set(layerEl, {
              y: `${(progress - 0.5) * yPercent * 2}%`,
            });
          },
        });

        triggersRef.current.push(st);
      });

      // Couche principale (children) - effet subtil de profondeur
      const mainContent = containerRef.current?.querySelector('[data-parallax-main]');
      if (mainContent) {
        const st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;
            // Déplacement très subtil pour la couche principale
            gsap.set(mainContent, {
              y: `${(progress - 0.5) * 5}%`,
            });
          },
        });
        triggersRef.current.push(st);
      }
    }, containerRef);

    return () => {
      triggersRef.current.forEach(st => st.kill());
      triggersRef.current = [];
      ctx.revert();
    };
  }, [layers, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {/* Couches d'arrière-plan (speed < 1) */}
      {layers
        .filter((layer) => layer.speed < 1)
        .map((layer, index) => (
          <div
            key={`bg-${index}`}
            data-parallax-layer={layers.indexOf(layer)}
            className={`absolute inset-0 pointer-events-none ${layer.className || ''}`}
            style={{
              willChange: 'transform',
              transform: 'translateZ(-50px) scale(1.05)',
              ...layer.style,
            }}
          >
            {layer.content}
          </div>
        ))}

      {/* Couche principale (contenu central) */}
      <div
        data-parallax-main
        className="relative z-10"
        style={{
          willChange: reducedMotion ? 'auto' : 'transform',
          transform: 'translateZ(0)',
        }}
      >
        {children}
      </div>

      {/* Couches de premier plan (speed > 1) */}
      {layers
        .filter((layer) => layer.speed >= 1)
        .map((layer, index) => (
          <div
            key={`fg-${index}`}
            data-parallax-layer={layers.indexOf(layer)}
            className={`absolute inset-0 pointer-events-none ${layer.className || ''}`}
            style={{
              willChange: 'transform',
              transform: 'translateZ(50px) scale(0.95)',
              ...layer.style,
            }}
          >
            {layer.content}
          </div>
        ))}
    </div>
  );
}

/**
 * Configuration prédéfinie pour effet "cave profonde"
 * 
 * Exemple d'utilisation dans la Hero section :
 * - Couche arrière : vignes/gradient subtil (speed: 0.2)
 * - Couche milieu : contenu principal (speed: 1.0)  
 * - Couche avant : particules/poussière de lumière (speed: 1.5)
 */
export const DEEP_CAVE_LAYERS: ParallaxLayer[] = [
  {
    speed: 0.2,
    content: (
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(122, 26, 26, 0.4) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 30% 20%, rgba(90, 20, 20, 0.3) 0%, transparent 50%)
          `,
        }}
      />
    ),
    className: 'z-0',
  },
  {
    speed: 0.3,
    content: (
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '400px 400px',
          mixBlendMode: 'overlay',
        }}
      />
    ),
    className: 'z-5',
  },
  {
    speed: 1.5,
    content: <FloatingParticles />,
    className: 'z-20',
  },
];

/**
 * Particules flottantes pour effet de premier plan
 */
function FloatingParticles() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!particlesRef.current) return;

    const particles = particlesRef.current.querySelectorAll('.particle');
    
    particles.forEach((particle, i) => {
      gsap.to(particle, {
        y: '-=30',
        x: `+=${Math.random() * 20 - 10}`,
        opacity: Math.random() * 0.5 + 0.2,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.3,
      });
    });
  }, []);

  return (
    <div ref={particlesRef} className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="particle absolute rounded-full"
          style={{
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: 'rgba(196, 64, 42, 0.6)',
            boxShadow: '0 0 10px rgba(196, 64, 42, 0.4)',
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
}

export default DepthParallax;
