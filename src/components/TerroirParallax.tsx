import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const C = {
  accent: '#8B3A3A',
  text: '#5C4033',
  bg: '#F5EDE4',
  bgElevated: '#FDF8F3',
  sage: '#7A8B6E',
  gold: '#B8956B',
  textMuted: 'rgba(92,64,51,0.6)',
};

const terroirs = [
  {
    name: 'Les Graviers',
    type: 'Sables & graviers',
    char: 'Rouges légers, fruités, soyeux',
  },
  {
    name: 'Les Tuffes',
    type: 'Argilo-calcaire',
    char: 'Vins de garde, minéraux, complexes',
  },
  {
    name: 'Les Argiles',
    type: 'Argilo-siliceux',
    char: 'Élégance et structure aromatique',
  },
];

export function TerroirParallax({ images }: { images: string[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      layersRef.current.forEach((layer, i) => {
        if (!layer) return;
        gsap.fromTo(layer,
          { y: 100 + i * 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: layer,
              start: 'top 85%',
              end: 'top 20%',
              scrub: 1,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-40 px-6 md:px-16" style={{ background: C.bgElevated }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start mb-16 md:mb-24">
          <div>
            <div className="w-16 h-px mb-8" style={{ background: C.accent }} />
            <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: C.sage, fontFamily: "'Inter', sans-serif" }}>Le Terroir</p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-[1.1] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.text }}>
              Trois terroirs,<br />
              <em style={{ color: C.accent }}>une âme</em>
            </h2>
          </div>
          <p className="text-base md:text-lg leading-relaxed md:pt-32" style={{ color: C.textMuted }}>
            Nos vignobles s'étendent sur les coteaux de Saint-Nicolas-de-Bourgueil 
            et Bourgueil. Les sols variés — sables, graviers, argiles et tuffeau — 
            confèrent à chaque parcelle sa personnalité unique.
          </p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {terroirs.map((terroir, i) => (
            <div
              key={i}
              ref={el => { layersRef.current[i] = el; }}
              className="group relative h-[40vh] md:h-[55vh] rounded-2xl overflow-hidden"
            >
              <img loading="lazy" decoding="async"
                src={images[i] || images[0]}
                alt={terroir.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: 'brightness(0.85) sepia(0.1)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#5C4033]/80 via-[#5C4033]/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: C.gold }}>
                      {terroir.type}
                    </p>
                    <h3 className="text-2xl md:text-4xl lg:text-5xl font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: 'white' }}>
                      {terroir.name}
                    </h3>
                    <p className="text-base md:text-lg" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {terroir.char}
                    </p>
                  </div>
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center"
                    style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)' }}>
                    <span className="text-xl md:text-2xl">🍇</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
