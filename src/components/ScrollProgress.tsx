import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/context/ReducedMotionContext";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  
  // Récupérer la préférence reduced-motion
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (barRef.current) barRef.current.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[9996] bg-transparent">
      <div
        ref={barRef}
        className="h-full"
        style={{
          width: "0%",
          background: "linear-gradient(90deg, #7B1422, #C41E3A)",
          // En mode reduced-motion, pas de transition fluide
          transition: reducedMotion ? "none" : "width 0.1s linear",
        }}
      />
    </div>
  );
}
