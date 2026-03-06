"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/context/ReducedMotionContext";

// Smooth noise via layered sines — no external dep, Aceternity-identical look
function waveY(x: number, t: number, seed: number): number {
  return (
    Math.sin(x / 600 + t * 1.2 + seed) * 120 +
    Math.sin(x / 300 + t * 0.8 + seed * 2.1) * 60 +
    Math.sin(x / 150 + t * 1.6 + seed * 0.7) * 30
  );
}

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: unknown;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  
  // Récupérer la préférence reduced-motion
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const waveColors = colors ?? [
      "#4a1040", "#6a1d58", "#7d2468", "#3a0a2e", "#551648",
    ];
    const spd = speed === "fast" ? 0.008 : 0.004;
    let t = 0;

    // Spread 5 wave origins across the full canvas height
    const offsets = [0.15, 0.3, 0.5, 0.7, 0.85];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-apply filter after resize resets ctx state
      ctx.filter = `blur(${blur}px)`;
    };
    resize();
    window.addEventListener("resize", resize);

    // En mode reduced-motion, dessiner une seule frame statique
    if (reducedMotion) {
      const w = canvas.width;
      const h = canvas.height;

      // Fill background
      ctx.fillStyle = backgroundFill ?? "#000000";
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, w, h);

      // Draw static waves (t = 0 for static state)
      waveColors.forEach((color, i) => {
        ctx.beginPath();
        ctx.lineWidth = waveWidth ?? 60;
        ctx.strokeStyle = color;
        ctx.globalAlpha = waveOpacity;

        const yCenter = h * offsets[i];
        for (let x = 0; x <= w; x += 4) {
          const y = waveY(x, 0, i * 1.3);
          ctx.lineTo(x, yCenter + y * (h / 900));
        }
        ctx.stroke();
        ctx.closePath();
      });

      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Semi-transparent fill each frame = motion-trail (Aceternity style)
      ctx.fillStyle = backgroundFill ?? "#000000";
      ctx.globalAlpha = waveOpacity;
      ctx.fillRect(0, 0, w, h);

      t += spd;

      waveColors.forEach((color, i) => {
        ctx.beginPath();
        ctx.lineWidth = waveWidth ?? 60;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 1;

        const yCenter = h * offsets[i];
        for (let x = 0; x <= w; x += 4) {
          const y = waveY(x, t, i * 1.3);
          ctx.lineTo(x, yCenter + y * (h / 900)); // scale amplitude with screen h
        }
        ctx.stroke();
        ctx.closePath();
      });

      animRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [blur, speed, waveOpacity, backgroundFill, colors, reducedMotion]);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "relative h-screen w-full flex flex-col items-center justify-center overflow-hidden",
        containerClassName
      )}
      style={{ backgroundColor: "#000" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full"
        style={isSafari ? { filter: `blur(${blur}px)` } : {}}
      />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
