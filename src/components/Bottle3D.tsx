import { useRef, useState } from 'react';

interface Bottle3DProps {
  image: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Composant Bottle3D - Effet 3D tilt sur les bouteilles de vin
 * 
 * Effets inclus:
 * - Rotation 3D selon la position de la souris (rotateX/Y)
 * - Reflet brillant qui bouge avec la souris
 * - Ombre qui se déplace opposément à la lumière
 * - Animation "flottante" continue
 */
export function Bottle3D({ image, alt, className = '', style }: Bottle3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [shadowOffset, setShadowOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculer la position relative (-1 à 1)
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    // Rotation 3D (max 15 degrés)
    const rotateY = x * 15;
    const rotateX = -y * 15;

    setRotation({ x: rotateX, y: rotateY });

    // Position du reflet (inverse de la souris pour effet réaliste)
    const glareX = 50 + x * 30;
    const glareY = 50 + y * 30;
    setGlarePosition({ x: glareX, y: glareY });

    // Ombre qui bouge opposément à la lumière
    setShadowOffset({ x: -x * 20, y: -y * 20 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });
    setShadowOffset({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Conteneur de la bouteille avec animation flottante */}
      <div
        className="relative transition-transform duration-200 ease-out"
        style={{
          transform: `
            rotateX(${rotation.x}deg) 
            rotateY(${rotation.y}deg) 
            translateZ(20px)
          `,
          transformStyle: 'preserve-3d',
          animation: 'float 4s ease-in-out infinite',
        }}
      >
        {/* Ombre dynamique */}
        <div
          className="absolute inset-0 rounded-2xl transition-all duration-200 ease-out pointer-events-none"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            filter: 'blur(20px)',
            transform: `
              translateX(${shadowOffset.x}px) 
              translateY(${shadowOffset.y + 30}px) 
              translateZ(-50px)
              scale(0.9)
            `,
            opacity: isHovered ? 0.6 : 0.4,
          }}
        />

        {/* Image de la bouteille */}
        <img
          src={image}
          alt={alt}
          className="relative z-10 w-full h-full object-contain rounded-2xl"
          style={{
            transform: 'translateZ(30px)',
          }}
        />

        {/* Reflet brillant dynamique */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-20 transition-all duration-150 ease-out"
          style={{
            background: `
              radial-gradient(
                circle at ${glarePosition.x}% ${glarePosition.y}%,
                rgba(255, 255, 255, 0.4) 0%,
                rgba(255, 255, 255, 0.1) 25%,
                transparent 50%
              )
            `,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Reflet secondaire (bande de lumière) */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-20 transition-all duration-200 ease-out"
          style={{
            background: `
              linear-gradient(
                ${135 + rotation.y * 2}deg,
                transparent 40%,
                rgba(255, 255, 255, 0.15) 48%,
                rgba(255, 255, 255, 0.25) 50%,
                rgba(255, 255, 255, 0.15) 52%,
                transparent 60%
              )
            `,
            opacity: isHovered ? 1 : 0.6,
          }}
        />

        {/* Bordure lumineuse subtile */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-30 transition-opacity duration-300"
          style={{
            boxShadow: `
              inset 0 0 30px rgba(122, 26, 26, 0.2),
              0 0 ${isHovered ? '40px' : '20px'} rgba(122, 26, 26, ${isHovered ? '0.3' : '0.15'})
            `,
            opacity: isHovered ? 1 : 0.5,
          }}
        />
      </div>

      {/* Animation CSS pour l'effet flottant */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg);
          }
          50% {
            transform: translateY(-8px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg);
          }
        }
      `}</style>
    </div>
  );
}

export default Bottle3D;
