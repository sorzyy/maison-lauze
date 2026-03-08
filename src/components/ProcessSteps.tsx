import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Wine, Hand, Sun, Timer } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const C = {
  accent: '#8B3A3A',
  text: '#5C4033',
  bg: '#F5EDE4',
  sage: '#7A8B6E',
  gold: '#B8956B',
  bgElevated: '#FDF8F3',
  textMuted: 'rgba(92,64,51,0.6)',
};

const steps = [
  { icon: Sun, title: 'Vendanges', desc: 'Cueillette manuelle à maturité optimale', color: C.gold },
  { icon: Hand, title: 'Pressurage', desc: 'Égrappage délicat et vinification traditionnelle', color: C.sage },
  { icon: Timer, title: 'Élevage', desc: '12 à 18 mois en barriques pour certaines cuvées', color: C.accent },
  { icon: Wine, title: 'Mise en bouteille', desc: 'Conditionnement sur place au domaine', color: C.text },
];

export function ProcessSteps() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 md:py-48 px-6 md:px-16" style={{ background: C.bg }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <div className="w-16 h-px mx-auto mb-8" style={{ background: C.accent }} />
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: C.sage }}>Vinification</p>
          <h2 className="text-4xl md:text-6xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.text }}>
            De la vigne <em style={{ color: C.accent }}>au verre</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={el => { cardsRef.current[i] = el; }}
              className="group relative p-8 rounded-2xl transition-all duration-500 hover:shadow-xl"
              style={{ 
                background: C.bgElevated || '#FDF8F3',
                border: '1px solid rgba(92,64,51,0.08)'
              }}
            >
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{ background: `${step.color}15` }}
              >
                <step.icon className="w-6 h-6" style={{ color: step.color }} />
              </div>
              
              <div 
                className="text-5xl font-light mb-4 opacity-20 transition-opacity group-hover:opacity-40"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: step.color }}
              >
                0{i + 1}
              </div>
              
              <h3 className="text-xl font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.text }}>
                {step.title}
              </h3>
              
              <p className="text-sm leading-relaxed" style={{ color: C.textMuted }}>
                {step.desc}
              </p>

              <div 
                className="absolute bottom-0 left-0 h-1 rounded-b-2xl transition-all duration-500 w-0 group-hover:w-full"
                style={{ background: step.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
