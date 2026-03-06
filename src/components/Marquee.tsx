import { useReducedMotion } from '@/context/ReducedMotionContext';

const items = [
  "Languedoc-Roussillon",
  "Rhône",
  "Bordeaux",
  "Provence",
  "Bourgogne",
  "Loire",
  "Alsace",
  "Sud-Ouest",
  "Maison Lauze",
  "Fondée en 1886",
  "469 Vins",
  "6 Générations",
];

export function Marquee({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...items, ...items, ...items];
  
  // Récupérer la préférence reduced-motion
  const reducedMotion = useReducedMotion();

  // En mode reduced-motion, afficher les éléments sans animation
  if (reducedMotion) {
    return (
      <div className="relative overflow-hidden py-5 border-y border-white/[0.06]">
        <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #000, transparent)" }} />
        <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(-90deg, #000, transparent)" }} />

        <div
          className="flex gap-12 whitespace-nowrap overflow-x-auto scrollbar-hide"
          style={{
            fontFamily: "'Syne', sans-serif",
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-12 text-xs tracking-[0.25em] uppercase text-white/25 flex-shrink-0">
              {item}
              <span className="inline-block w-1 h-1 rounded-full" style={{ background: '#6a1d58' }} />
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden py-5 border-y border-white/[0.06]">
      <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, #000, transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(-90deg, #000, transparent)" }} />

      <div
        className="flex gap-12 whitespace-nowrap"
        style={{
          animation: `marquee${reverse ? "Rev" : ""} 35s linear infinite`,
          willChange: "transform",
          fontFamily: "'Syne', sans-serif",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-12 text-xs tracking-[0.25em] uppercase text-white/25">
            {item}
            <span className="inline-block w-1 h-1 rounded-full" style={{ background: '#6a1d58' }} />
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
        @keyframes marqueeRev { from { transform: translateX(-33.333%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
