import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/context/ReducedMotionContext";

export function Loader({ onDone }: { onDone: () => void }) {
  const lineRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"line" | "reveal" | "done">("line");
  
  // Récupérer la préférence reduced-motion
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // En mode reduced-motion, passer immédiatement à done sans animation
    if (reducedMotion) {
      setPhase("done");
      onDone();
      return;
    }

    // Phase 1: draw the line (600ms)
    const t1 = setTimeout(() => setPhase("reveal"), 900);
    // Phase 2: overlay slides up (500ms)
    const t2 = setTimeout(() => {
      setPhase("done");
      onDone();
    }, 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone, reducedMotion]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
      style={{
        transform: phase === "reveal" ? "translateY(-100%)" : "translateY(0)",
        transition: phase === "reveal" ? "transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
      }}
    >
      {/* Logo mark */}
      <div
        className="mb-10 text-white/20 tracking-[0.4em] uppercase text-xs"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Saint-Nicolas-de-Bourgueil
      </div>

      {/* Line animation */}
      <div className="relative h-px w-48 bg-white/10 overflow-hidden">
        <div
          ref={lineRef}
          className="absolute inset-y-0 left-0 bg-rose-600"
          style={{
            width: "100%",
            transform: "scaleX(0)",
            transformOrigin: "left",
            animation: "lineGrow 0.7s cubic-bezier(0.76, 0, 0.24, 1) 0.1s forwards",
          }}
        />
      </div>

      <style>{`
        @keyframes lineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
