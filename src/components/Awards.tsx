import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Star, Trophy } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  ui: "'Inter', -apple-system, sans-serif",
};

const awards = [
  {
    year: '2024',
    title: 'Médaille d\'Or',
    wine: 'Les Malgagnes 2020',
    event: 'Concours Général Agricole, Paris',
    icon: Trophy,
    color: '#b8963e'
  },
  {
    year: '2023',
    title: 'Médaille d\'Or',
    wine: 'Caudalies 2021',
    event: 'Concours des Vins Val de Loire',
    icon: Trophy,
    color: '#b8963e'
  },
  {
    year: '2024',
    title: 'Médaille d\'Argent',
    wine: 'Cuvée Estelle 2023',
    event: 'Concours Général Agricole, Paris',
    icon: Award,
    color: '#c0c0c0'
  },
  {
    year: '2023',
    title: '92 Points',
    wine: 'Caudalies 2021',
    event: 'Revue du Vin de France',
    icon: Star,
    color: '#c4402a'
  },
  {
    year: '2024',
    title: 'Coup de Cœur',
    wine: 'Les Malgagnes 2020',
    event: 'Guide Hachette des Vins',
    icon: Star,
    color: '#c4402a'
  },
  {
    year: '2023',
    title: 'Médaille d\'Argent',
    wine: 'Les Tuffes 2021',
    event: 'Concours Général Agricole, Paris',
    icon: Award,
    color: '#c0c0c0'
  }
];

export function Awards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up
    triggersRef.current.forEach(t => t.kill());
    triggersRef.current = [];

    // Animate cards
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      
      const trigger = ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(card,
            { opacity: 0, y: 50, rotateY: -15 },
            { 
              opacity: 1, 
              y: 0, 
              rotateY: 0,
              duration: 0.8, 
              delay: i * 0.1,
              ease: 'power3.out' 
            }
          );
        },
        once: true
      });
      triggersRef.current.push(trigger);
    });

    return () => {
      triggersRef.current.forEach(t => t.kill());
      triggersRef.current = [];
    };
  }, []);

  return (
    <section ref={containerRef} className="py-32 md:py-48 px-6 md:px-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #c4402a 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#b8963e' }}>
            Reconnaissances
          </p>
          <h2 className="text-4xl md:text-6xl font-light" style={{ fontFamily: F.display }}>
            Des vins <em className="italic" style={{ color: '#b8963e' }}>récompensés</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award, index) => {
            const Icon = award.icon;
            return (
              <div
                key={index}
                ref={el => { if (el) cardsRef.current[index] = el; }}
                className="group relative p-6 rounded-2xl opacity-0"
                style={{ 
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  perspective: '1000px',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Glow effect on hover */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${award.color}15 0%, transparent 70%)`
                  }}
                />

                <div className="relative flex items-start gap-4">
                  <div 
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ 
                      background: `${award.color}15`,
                      border: `1px solid ${award.color}30`
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: award.color }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-medium tracking-[0.1em] uppercase" 
                        style={{ color: award.color, fontFamily: F.ui }}>
                        {award.title}
                      </span>
                      <span className="text-xs text-white/30">{award.year}</span>
                    </div>
                    <h3 className="text-lg font-light mb-1 truncate" style={{ fontFamily: F.display }}>
                      {award.wine}
                    </h3>
                    <p className="text-xs text-white/40" style={{ fontFamily: F.ui }}>
                      {award.event}
                    </p>
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl pointer-events-none">
                  <div className="absolute top-0 right-0 w-px h-12 bg-gradient-to-b from-white/20 to-transparent transform rotate-45 origin-top-right" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
