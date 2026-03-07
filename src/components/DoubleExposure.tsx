import { useState, useRef } from 'react';

interface DoubleExposureProps {
  primaryImage: string;
  secondaryImage: string;
  alt: string;
  className?: string;
}

/**
 * Composant Double Exposure
 * 
 * Crée un effet de double exposition au survol :
 * - L'image principale (vin) devient légèrement transparente
 * - L'image secondaire (vignoble/vigne) apparaît en blend mode overlay
 * - Transition fluide de 0.6s
 */
export function DoubleExposure({
  primaryImage,
  secondaryImage,
  alt,
  className = '',
}: DoubleExposureProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image principale (vin) */}
      <img
        src={primaryImage}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          opacity: isHovered ? 0.7 : 1,
          transition: 'opacity 0.6s ease-out',
        }}
      />

      {/* Image secondaire (vignoble/vigne) avec blend mode */}
      <img
        src={secondaryImage}
        alt={`${alt} - vineyard overlay`}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          mixBlendMode: 'overlay',
          opacity: isHovered ? 0.85 : 0,
          transform: isHovered ? 'scale(1.05)' : 'scale(1.1)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
      />

      {/* Couche de soft-light pour un effet plus subtil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isHovered
            ? 'linear-gradient(135deg, rgba(106, 29, 88, 0.15) 0%, transparent 60%)'
            : 'transparent',
          transition: 'background 0.6s ease-out',
        }}
      />
    </div>
  );
}
