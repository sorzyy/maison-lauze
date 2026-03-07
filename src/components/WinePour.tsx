import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useReducedMotionContext } from '@/context/ReducedMotionContext';

interface WinePourProps {
  isActive: boolean;
  onComplete?: () => void;
  color?: string;
  size?: number;
}

export function WinePour({
  isActive,
  onComplete,
  color = '#6a1d58',
  size = 120,
}: WinePourProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<SVGPathElement>(null);
  const liquidRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGRectElement>(null);
  const bubblesRef = useRef<SVGGElement>(null);
  const { reducedMotion } = useReducedMotionContext();
  const [isAnimating, setIsAnimating] = useState(false);

  const runAnimation = useCallback(() => {
    if (!containerRef.current || isAnimating) return;
    
    const stream = streamRef.current;
    const liquid = liquidRef.current;
    const fill = fillRef.current;
    const bubbles = bubblesRef.current;
    
    if (!stream || !liquid || !fill || !bubbles) return;

    setIsAnimating(true);

    // Reset elements
    gsap.set([stream, liquid], { opacity: 0 });
    gsap.set(fill, { scaleY: 0, transformOrigin: 'bottom' });
    gsap.set(bubbles.children, { opacity: 0, y: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        onComplete?.();
      },
    });

    if (reducedMotion) {
      // Reduced motion version: just fade in the full glass
      tl.to(fill, { scaleY: 1, duration: 0.3, ease: 'power1.out' })
        .to([stream, liquid], { opacity: 0, duration: 0.1 }, 0.2)
        .to(containerRef.current, { opacity: 0, duration: 0.3, delay: 0.5 });
      return;
    }

    // Full pour animation
    tl
      // Stream starts flowing
      .to(stream, {
        opacity: 1,
        duration: 0.1,
        ease: 'power1.out',
      })
      // Liquid enters glass
      .to(
        liquid,
        {
          opacity: 1,
          duration: 0.2,
          ease: 'power1.out',
        },
        0.1
      )
      // Glass fills up
      .to(
        fill,
        {
          scaleY: 1,
          duration: 1.2,
          ease: 'power2.out',
        },
        0.2
      )
      // Bubbles rise
      .to(
        bubbles.children,
        {
          opacity: 1,
          y: -30,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power1.out',
        },
        0.5
      )
      // Stream fades out
      .to([stream, liquid], {
        opacity: 0,
        duration: 0.3,
        ease: 'power1.in',
      })
      // Animation container fades out
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        delay: 0.3,
      });
  }, [isAnimating, onComplete, reducedMotion]);

  useEffect(() => {
    if (isActive) {
      runAnimation();
    } else {
      // Reset when inactive
      if (containerRef.current) {
        gsap.set(containerRef.current, { opacity: 1 });
      }
    }
  }, [isActive, runAnimation]);

  const glassWidth = size * 0.5;
  const glassHeight = size * 0.7;
  const glassX = (size - glassWidth) / 2;
  const glassY = size * 0.25;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none"
      style={{
        width: size,
        height: size,
        position: 'relative',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Wine gradient */}
          <linearGradient id="wineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="50%" stopColor="#7d2468" />
            <stop offset="100%" stopColor="#3a0a2e" />
          </linearGradient>
          
          {/* Stream gradient */}
          <linearGradient id="streamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>

          {/* Glass clip path */}
          <clipPath id="glassClip">
            <path
              d={`M ${glassX} ${glassY} 
                  L ${glassX + glassWidth} ${glassY} 
                  L ${glassX + glassWidth - 8} ${glassY + glassHeight - 15} 
                  Q ${glassX + glassWidth / 2} ${glassY + glassHeight} ${glassX + 8} ${glassY + glassHeight - 15} 
                  Z`}
            />
          </clipPath>
        </defs>

        {/* Wine stream (falling from top) */}
        <path
          ref={streamRef}
          d={`M ${size / 2 - 3} 0 
              L ${size / 2 + 3} 0 
              L ${size / 2 + 2} ${glassY + 5} 
              L ${size / 2 - 2} ${glassY + 5} 
              Z`}
          fill="url(#streamGradient)"
          opacity={0}
          style={{ filter: 'blur(0.5px)' }}
        />

        {/* Liquid flowing into glass (curve) */}
        <path
          ref={liquidRef}
          d={`M ${size / 2 - 2} ${glassY + 5}
              Q ${size / 2} ${glassY + 20} ${size / 2 + 5} ${glassY + 35}
              L ${size / 2 - 5} ${glassY + 35}
              Q ${size / 2 - 2} ${glassY + 20} ${size / 2 + 2} ${glassY + 5}
              Z`}
          fill={color}
          opacity={0}
          style={{ filter: 'blur(1px)' }}
        />

        {/* Glass outline */}
        <path
          d={`M ${glassX} ${glassY} 
              L ${glassX + glassWidth} ${glassY} 
              L ${glassX + glassWidth - 8} ${glassY + glassHeight - 15} 
              Q ${glassX + glassWidth / 2} ${glassY + glassHeight} ${glassX + 8} ${glassY + glassHeight - 15} 
              Z`}
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="2"
          fill="none"
        />

        {/* Glass stem */}
        <line
          x1={size / 2}
          y1={glassY + glassHeight}
          x2={size / 2}
          y2={size - 5}
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="3"
        />
        <ellipse
          cx={size / 2}
          cy={size - 5}
          rx={glassWidth / 3}
          ry={4}
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="2"
          fill="none"
        />

        {/* Glass fill */}
        <g clipPath="url(#glassClip)">
          <rect
            ref={fillRef}
            x={glassX}
            y={glassY}
            width={glassWidth}
            height={glassHeight}
            fill="url(#wineGradient)"
            transform="scale(1, 0)"
            transform-origin={`${glassX + glassWidth / 2} ${glassY + glassHeight}`}
            style={{
              transformBox: 'fill-box',
            }}
          />
        </g>

        {/* Glass reflection */}
        <path
          d={`M ${glassX + glassWidth - 6} ${glassY + 10} 
              L ${glassX + glassWidth - 10} ${glassY + glassHeight - 25}`}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Bubbles */}
        <g ref={bubblesRef}>
          {[...Array(5)].map((_, i) => (
            <circle
              key={i}
              cx={glassX + 10 + i * 10}
              cy={glassY + glassHeight - 20 - i * 8}
              r={2 + i * 0.5}
              fill="rgba(255, 255, 255, 0.3)"
              opacity={0}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

// Hook to manage the pour animation
export function useWinePour() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const pour = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const reset = useCallback(() => {
    setActiveId(null);
  }, []);

  const isPouring = useCallback(
    (id: string) => activeId === id,
    [activeId]
  );

  return { pour, reset, isPouring, activeId };
}
