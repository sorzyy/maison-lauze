import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';

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

const awards = [
  { year: '2024', title: 'Médaille d\'Or', desc: 'Concours des Vins de la Vallée de la Loire', wine: 'Les Malgagnes 2020' },
  { year: '2023', title: 'Coup de Cœur', desc: 'Guide Hachette des Vins', wine: 'Cuvée Estelle 2022' },
  { year: '2023', title: 'Médaille d\'Argent', desc: 'Concours Général Agricole', wine: 'Caudalies 2020' },
  { year: '2022', title: 'Sélection', desc: 'Wine Spectator', wine: 'Les Tuffes 2019' },
  { year: '2021', title: 'Médaille de Bronze', desc: 'Concours Mondial du Cabernet', wine: 'Ma Cuvée DOR 2019' },
];

export function Awards() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.awards-title',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const nextAward = () => setActiveIndex((prev) => (prev + 1) % awards.length);
  const prevAward = () => setActiveIndex((prev) => (prev - 1 + awards.length) % awards.length);

  return (
    <section ref={sectionRef} className="py-32 md:py-48 px-6 md:px-16" style={{ background: C.bg }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="awards-title">
              <div className="w-16 h-px mb-8" style={{ background: C.accent }} />
              <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: C.sage }}>Reconnaissances</p>
              <h2 className="text-4xl md:text-6xl font-light leading-[1.1]" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.text }}>
                Nos <em style={{ color: C.accent }}>distinctions</em>
              </h2>
            </div>

            <div className="mt-12 flex gap-4">
              <button onClick={prevAward} className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ border: `1px solid ${C.text}30`, color: C.text }}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextAward} className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ border: `1px solid ${C.text}30`, color: C.text }}>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
              style={{ background: `radial-gradient(circle, ${C.gold}, transparent)` }} />
            
            <div className="relative p-8 md:p-12 rounded-3xl"
              style={{ background: C.bgElevated, border: '1px solid rgba(92,64,51,0.08)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ background: `${C.gold}20` }}>
                <Award className="w-8 h-8" style={{ color: C.gold }} />
              </div>

              <div className="mb-8">
                <span className="text-6xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.gold }}>
                  {awards[activeIndex].year}
                </span>
              </div>

              <h3 className="text-2xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.text }}>
                {awards[activeIndex].title}
              </h3>
              
              <p className="text-lg mb-2" style={{ color: C.textMuted }}>{awards[activeIndex].desc}</p>
              <p className="text-sm tracking-wide uppercase" style={{ color: C.sage }}>{awards[activeIndex].wine}</p>

              <div className="flex gap-2 mt-8">
                {awards.map((_, i) => (
                  <button key={i} onClick={() => setActiveIndex(i)}
                    className="h-1 rounded-full transition-all"
                    style={{ 
                      width: i === activeIndex ? 32 : 8,
                      background: i === activeIndex ? C.accent : `${C.text}20`
                    }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
