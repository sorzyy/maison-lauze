import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Grape, Scissors, Wine, Droplets } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  ui: "'Inter', -apple-system, sans-serif",
};

const steps = [
  {
    icon: Grape,
    title: 'Vendanges',
    description: 'Récolte manuelle ou mécanique selon les parcelles. Une sélection rigoureuse des grappes.',
    month: 'Septembre'
  },
  {
    icon: Scissors,
    title: 'Égrappage',
    description: 'Séparation des baies de la rafle pour une macération optimale et des tanins fins.',
    month: 'Octobre'
  },
  {
    icon: Droplets,
    title: 'Vinification',
    description: 'Macération traditionnelle en cuves inox thermorégulées. Pigeage manuel pour les cuvées prestige.',
    month: 'Oct-Nov'
  },
  {
    icon: Wine,
    title: 'Élevage',
    description: '12 à 18 mois en cuves ou fûts bourguignons selon les cuvées. Suit son cours naturellement.',
    month: 'Année N+1'
  }
];

export function ProcessSteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    // Clean up
    triggersRef.current.forEach(t => t.kill());
    triggersRef.current = [];

    // Animate line
    const lineTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 70%',
      end: 'bottom 70%',
      onUpdate: (self) => {
        gsap.set(line, { scaleY: self.progress });
      }
    });
    triggersRef.current.push(lineTrigger);

    // Animate steps
    const stepElements = container.querySelectorAll('.step-item');
    stepElements.forEach((step, i) => {
      const trigger = ScrollTrigger.create({
        trigger: step,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(step,
            { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-[#0a0505]" />
      
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#c4402a' }}>
            Savoir-Faire
          </p>
          <h2 className="text-4xl md:text-6xl font-light" style={{ fontFamily: F.display }}>
            De la vigne <em className="italic" style={{ color: '#c4402a' }}>au verre</em>
          </h2>
        </div>

        {/* Timeline container */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2">
            <div 
              ref={lineRef}
              className="absolute top-0 left-0 w-full bg-[#c4402a] origin-top"
              style={{ height: '100%', transform: 'scaleY(0)' }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={index}
                  className={`step-item relative flex items-start gap-8 md:gap-0 opacity-0 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 md:w-1/2 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <span className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2 block" style={{ fontFamily: F.ui }}>
                      {step.month}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-light mb-3" style={{ fontFamily: F.display }}>
                      {step.title}
                    </h3>
                    <p className="text-white/50 leading-relaxed max-w-md" style={{ fontFamily: F.ui }}>
                      {step.description}
                    </p>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[#050505] border-2 border-[#c4402a] md:-translate-x-1/2 z-10">
                    <div className="absolute inset-0 rounded-full bg-[#c4402a] animate-ping opacity-20" />
                  </div>

                  {/* Icon */}
                  <div className={`flex-1 md:w-1/2 hidden md:block ${isEven ? 'md:pl-16' : 'md:pr-16 md:text-right'}`}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 ${
                      isEven ? '' : 'md:ml-auto'
                    }`}>
                      <Icon className="w-6 h-6" style={{ color: '#c4402a' }} />
                    </div>
                  </div>

                  {/* Mobile icon */}
                  <div className="md:hidden flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10">
                      <Icon className="w-5 h-5" style={{ color: '#c4402a' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
