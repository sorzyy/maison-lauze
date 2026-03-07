import { useState, useRef, useCallback, type ReactNode } from 'react';

interface DynamicGlassProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
  borderGradient?: boolean;
}

/**
 * Composant Dynamic Glass (Verre dépoli dynamique)
 * 
 * Glassmorphism avancé avec effet "spotlight" :
 * - Backdrop blur de 20px
 * - Bordure subtile avec gradient
 * - Effet de dégradé radial qui suit la souris
 * - Intensité configurable (0 à 1)
 */
export function DynamicGlass({
  children,
  intensity = 0.5,
  className = '',
  borderGradient = true,
}: DynamicGlassProps) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setMousePosition({ x, y });
    },
    []
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Recentre le spotlight quand la souris quitte
    setMousePosition({ x: 50, y: 50 });
  }, []);

  // Calcul de l'intensité du blur et de l'opacité
  const blurAmount = 16 + intensity * 12; // 16px à 28px
  const bgOpacity = 0.03 + intensity * 0.07; // 0.03 à 0.10

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
        background: `rgba(255, 255, 255, ${bgOpacity})`,
        borderRadius: '1rem',
        overflow: 'hidden',
      }}
    >
      {/* Bordure avec gradient subtil */}
      {borderGradient && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[1rem]"
          style={{
            padding: '1px',
            background: `linear-gradient(
              135deg,
              rgba(155, 58, 134, ${0.2 + intensity * 0.3}) 0%,
              rgba(255, 255, 255, 0.05) 50%,
              rgba(106, 29, 88, ${0.2 + intensity * 0.3}) 100%
            )`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
          }}
        />
      )}

      {/* Effet spotlight radial qui suit la souris */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(
            circle 180px at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(155, 58, 134, ${0.15 + intensity * 0.15}) 0%,
            rgba(106, 29, 88, ${0.08 + intensity * 0.08}) 40%,
            transparent 70%
          )`,
          opacity: isHovered ? 1 : 0.3,
          transition: isHovered
            ? 'background 0.15s ease-out, opacity 0.3s ease'
            : 'background 0.6s ease-out, opacity 0.6s ease',
        }}
      />

      {/* Reflet lumineux supplémentaire au survol */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isHovered
            ? `radial-gradient(
                circle 120px at ${mousePosition.x}% ${mousePosition.y}%,
                rgba(255, 255, 255, ${0.08 + intensity * 0.07}) 0%,
                transparent 60%
              )`
            : 'transparent',
          transition: 'background 0.4s ease-out',
        }}
      />

      {/* Contenu */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Variante premium avec effet glass plus prononcé
 * Pour les sections importantes et modals
 */
export function DynamicGlassPremium({
  children,
  className = '',
}: Omit<DynamicGlassProps, 'intensity'>) {
  return (
    <DynamicGlass intensity={0.8} borderGradient={true} className={className}>
      {children}
    </DynamicGlass>
  );
}

/**
 * Variante subtile pour les cartes légères
 */
export function DynamicGlassSubtle({
  children,
  className = '',
}: Omit<DynamicGlassProps, 'intensity'>) {
  return (
    <DynamicGlass intensity={0.3} borderGradient={true} className={className}>
      {children}
    </DynamicGlass>
  );
}
