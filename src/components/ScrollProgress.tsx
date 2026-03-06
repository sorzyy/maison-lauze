import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/context/ReducedMotionContext";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  // Récupérer la préférence reduced-motion
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[9996] bg-transparent">
      <div
        ref={barRef}
        className="h-full w-full"
        style={{
          transform: "scaleX(0)",
          transformOrigin: "left center",
          background: "linear-gradient(90deg, #7B1422, #C41E3A)",
          willChange: "transform",
          // En mode reduced-motion, pas de transition fluide
          transition: reducedMotion ? "none" : "transform 0.1s linear",
        }}
      />
    </div>
  );
}
