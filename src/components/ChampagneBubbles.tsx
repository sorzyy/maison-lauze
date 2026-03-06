import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/context/ReducedMotionContext';

interface Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  wobbleOffset: number;
  wobbleSpeed: number;
  wobbleAmplitude: number;
}

export function ChampagneBubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animationRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  
  // Récupérer la préférence reduced-motion
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // En mode reduced-motion, ne pas afficher les bulles animées
    if (reducedMotion) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration
    const BUBBLE_COUNT = 20; // 15-25 bulles
    const MIN_SIZE = 2;
    const MAX_SIZE = 8;
    const MIN_SPEED = 20; // pixels per second
    const MAX_SPEED = 60;

    // Resize canvas to match window
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize bubbles
    const initBubbles = () => {
      bubblesRef.current = [];
      for (let i = 0; i < BUBBLE_COUNT; i++) {
        bubblesRef.current.push(createBubble(true));
      }
    };

    // Create a single bubble
    function createBubble(randomY = false): Bubble {
      const w = canvas?.width ?? window.innerWidth;
      const h = canvas?.height ?? window.innerHeight;
      
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : h + Math.random() * 100,
        size: MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE),
        speed: MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED),
        opacity: 0.1 + Math.random() * 0.2, // 0.1 - 0.3
        wobbleOffset: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.5 + Math.random() * 1.5, // cycles per second
        wobbleAmplitude: 5 + Math.random() * 15, // pixels
      };
    }

    // Draw a bubble with 3D effect
    const drawBubble = (bubble: Bubble) => {
      if (!ctx) return;

      const { x, y, size, opacity } = bubble;

      // Create radial gradient for 3D sphere effect
      const gradient = ctx.createRadialGradient(
        x - size * 0.3, // highlight offset
        y - size * 0.3,
        0,
        x,
        y,
        size
      );

      // White center highlight
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 1.5})`);
      // Main body
      gradient.addColorStop(0.3, `rgba(255, 255, 255, ${opacity})`);
      // Edge fade
      gradient.addColorStop(0.8, `rgba(255, 255, 255, ${opacity * 0.5})`);
      // Transparent edge
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Subtle specular highlight
      ctx.beginPath();
      ctx.arc(x - size * 0.35, y - size * 0.35, size * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
      ctx.fill();
    };

    // Animation loop
    let lastTime = performance.now();
    
    const animate = () => {
      if (!ctx || !canvas) return;

      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000; // seconds
      lastTime = currentTime;

      // Skip frame if tab is hidden
      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const w = canvas.width;
      const h = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      // Update and draw each bubble
      bubblesRef.current.forEach((bubble) => {
        // Update position
        bubble.y -= bubble.speed * deltaTime;
        
        // Horizontal wobble
        const wobbleX = Math.sin(
          (currentTime / 1000) * bubble.wobbleSpeed * Math.PI * 2 + bubble.wobbleOffset
        ) * bubble.wobbleAmplitude;

        // Fade out near the top
        const fadeStart = h * 0.15;
        let drawOpacity = bubble.opacity;
        if (bubble.y < fadeStart) {
          drawOpacity = bubble.opacity * (bubble.y / fadeStart);
        }

        // Draw the bubble with current position and opacity
        const bubbleToDraw = { ...bubble, x: bubble.x + wobbleX, opacity: drawOpacity };
        drawBubble(bubbleToDraw);

        // Reset bubble if it goes off screen
        if (bubble.y < -bubble.size * 2) {
          Object.assign(bubble, createBubble(false));
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Visibility handling
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
      if (isVisibleRef.current) {
        lastTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initialize and start
    initBubbles();
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [reducedMotion]);

  // En mode reduced-motion, ne pas rendre le canvas
  if (reducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 5,
        opacity: 0.6,
      }}
    />
  );
}
