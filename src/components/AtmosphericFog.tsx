import { useEffect, useState } from 'react';

interface AtmosphericFogProps {
  /** Position verticale de la brume ('top', 'bottom', ou valeur custom) */
  position?: 'top' | 'bottom' | string;
  /** Intensité de la brume (0.1 - 0.3 recommandé) */
  intensity?: number;
  /** Couleur de la brume (default: blanc/lavender) */
  color?: string;
  /** Hauteur de la zone de brume */
  height?: string;
  /** Classe CSS additionnelle */
  className?: string;
  /** Inverser la direction de l'animation */
  reverse?: boolean;
}

/**
 * Composant AtmosphericFog - Effet de brume atmosphérique animée
 * 
 * Crée un effet de "cave humide" avec des couches de brume SVG/CSS
 * qui se déplacent horizontalement de façon infinie.
 * 
 * Usage recommandé:
 * - En bas de la hero section
 * - Entre les sections pour créer de la profondeur
 * - Sur les bords des images de vignes/cave
 */
export function AtmosphericFog({
  position = 'bottom',
  intensity = 0.15,
  color = '255, 255, 255',
  height = '200px',
  className = '',
  reverse = false,
}: AtmosphericFogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const positionClass = position === 'top' 
    ? 'top-0' 
    : position === 'bottom' 
    ? 'bottom-0' 
    : '';

  const positionStyle = position !== 'top' && position !== 'bottom' 
    ? { [position]: '0' } 
    : {};

  if (!mounted) return null;

  return (
    <div
      className={`absolute left-0 right-0 pointer-events-none overflow-hidden z-10 ${positionClass} ${className}`}
      style={{
        height,
        ...positionStyle,
      }}
    >
      {/* Couche 1: Brume de fond (la plus large et lente) */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              to ${position === 'top' ? 'bottom' : 'top'},
              transparent 0%,
              rgba(${color}, ${intensity * 0.5}) 30%,
              rgba(${color}, ${intensity}) 60%,
              rgba(${color}, ${intensity * 0.3}) 100%
            )
          `,
        }}
      />

      {/* Couche 2: Vagues SVG animées */}
      <svg
        className="absolute w-[200%] h-full"
        style={{
          animation: `fogDrift${reverse ? 'Reverse' : ''} 25s linear infinite`,
          opacity: intensity * 1.5,
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1440 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`fogGradient1-${position}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={`rgb(${color})`} stopOpacity="0" />
            <stop offset="50%" stopColor={`rgb(${color})`} stopOpacity={intensity * 2} />
            <stop offset="100%" stopColor={`rgb(${color})`} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#fogGradient1-${position})`}
          d="M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100 C1150,150 1350,50 1440,100 L1440,200 L0,200 Z"
        />
      </svg>

      {/* Couche 3: Vagues secondaires (plus rapides, opposées) */}
      <svg
        className="absolute w-[200%] h-full"
        style={{
          animation: `fogDrift${reverse ? '' : 'Reverse'} 18s linear infinite`,
          opacity: intensity * 1.2,
        }}
        preserveAspectRatio="none"
        viewBox="0 0 1440 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`fogGradient2-${position}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={`rgb(${color})`} stopOpacity="0" />
            <stop offset="40%" stopColor={`rgb(${color})`} stopOpacity={intensity * 1.5} />
            <stop offset="100%" stopColor={`rgb(${color})`} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#fogGradient2-${position})`}
          d="M0,120 C200,80 400,160 600,120 C800,80 1000,160 1200,120 C1350,90 1400,130 1440,120 L1440,200 L0,200 Z"
        />
      </svg>

      {/* Couche 4: Particules de brume subtiles (CSS-based) */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 50% at 20% ${position === 'top' ? '100%' : '0%'},
              rgba(${color}, ${intensity * 0.8}),
              transparent 50%
            ),
            radial-gradient(
              ellipse 60% 40% at 70% ${position === 'top' ? '90%' : '10%'},
              rgba(${color}, ${intensity * 0.6}),
              transparent 40%
            ),
            radial-gradient(
              ellipse 50% 60% at 90% ${position === 'top' ? '80%' : '20%'},
              rgba(${color}, ${intensity * 0.4}),
              transparent 45%
            )
          `,
          animation: `fogPulse 8s ease-in-out infinite`,
        }}
      />

      {/* Couche 5: Effet de grain subtil pour texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Animations CSS */}
      <style>{`
        @keyframes fogDrift {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        @keyframes fogDriftReverse {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes fogPulse {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Variante pour placer entre deux sections
 */
export function FogSeparator({ 
  intensity = 0.12,
  className = '' 
}: Omit<AtmosphericFogProps, 'position' | 'height'>) {
  return (
    <div className={`relative h-32 ${className}`}>
      <AtmosphericFog 
        position="top" 
        height="100%" 
        intensity={intensity}
        reverse
      />
      <AtmosphericFog 
        position="bottom" 
        height="100%" 
        intensity={intensity}
      />
    </div>
  );
}

export default AtmosphericFog;
