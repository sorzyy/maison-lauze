"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/context/ReducedMotionContext";

// Palette Maison Lauze
const C = {
  primary: '#6a1d58',
  light: '#9b3a86',
  dark: '#3a0a2e',
  accent: '#bfc106',
};

const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  ui: "'Syne', sans-serif",
};

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  
  // Récupérer la préférence reduced-motion
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-transparent font-sans md:px-10"
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-4xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-32 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div 
                className="h-10 absolute left-3 md:left-3 w-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(58,10,46,0.8)', border: `1px solid ${C.primary}` }}
              >
                <div 
                  className="h-3 w-3 rounded-full p-2" 
                  style={{ background: C.light }}
                />
              </div>
              <h3 
                className="hidden md:block text-xl md:pl-20 md:text-4xl font-light"
                style={{ fontFamily: F.display, color: C.light }}
              >
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 
                className="md:hidden block text-2xl mb-4 text-left font-light"
                style={{ fontFamily: F.display, color: C.light }}
              >
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{ height: height + "px" }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-800 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          {reducedMotion ? (
            // En mode reduced-motion, barre de progression statique complète
            <div
              className="absolute inset-x-0 top-0 w-[2px] h-full bg-gradient-to-t from-purple-500 via-pink-500 to-transparent from-[0%] via-[10%] rounded-full"
            />
          ) : (
            // Animation normale avec Framer Motion
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-pink-500 to-transparent from-[0%] via-[10%] rounded-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};
