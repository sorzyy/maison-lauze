import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  ui: "'Inter', -apple-system, sans-serif",
};

const layers = [
  {
    name: 'Sables & Graviers',
    description: 'Légèreté, fruits frais, tanins souples',
    depth: 0.2,
    image: 'https://assets.evolusite.fr/ik-seo/3/img_3314_K6JZq7j9n/img_3314_K6JZq7j9n.jpg',
    stats: { hectares: '8 ha', appellation: 'Saint-Nicolas' }
  },
  {
    name: 'Argilo-Calcaire',
    description: 'Structure, caractère, finale minérale',
    depth: 0.5,
    image: 'https://assets.evolusite.fr/ik-seo/3/img_3682_OFTONgDC4/img_3682_OFTONgDC4.jpg',
    stats: { hectares: '4 ha', appellation: 'Bourgueil' }
  },
  {
    name: 'Alluvions',
    description: 'Supplesse, fraîcheur, finesse aromatique',
    depth: 0.8,
    image: 'https://assets.evolusite.fr/ik-seo/3/img_4750_6EbPVDf59/img_4750_6EbPVDf59.jpg',
    stats: { hectares: '3 ha', appellation: 'Saint-Nicolas' }
  }
];

export function TerroirParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up previous triggers
    triggersRef.current.forEach(t => t.kill());
    triggersRef.current = [];

    const layers = container.querySelectorAll('.parallax-layer');
    layers.forEach((layer) => {
      const trigger = ScrollTrigger.create({
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const speed = parseFloat((layer as HTMLElement).dataset.speed || '0.5');
          const yPos = (self.progress - 0.5) * 200 * speed;
          gsap.set(layer, { y: yPos });
        }
      });
      triggersRef.current.push(trigger);
    });

    return () => {
      triggersRef.current.forEach(t => t.kill());
      triggersRef.current = [];
    };
  }, []);

  return (
    <div ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0505] to-[#050505]" />
      
      {/* Parallax layers */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-16">
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#c4402a' }}>
            Le Vignoble
          </p>
          <h2 className="text-4xl md:text-6xl font-light" style={{ fontFamily: F.display }}>
            Trois terroirs, <em className="italic" style={{ color: '#c4402a' }}>trois âmes</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {layers.map((layer, idx) => (
            <div key={idx} className="relative group">
              <div 
                className="parallax-layer relative aspect-[4/5] rounded-2xl overflow-hidden"
                data-speed={layer.depth}
                style={{ 
                  transform: 'translateZ(0)',
                  willChange: 'transform'
                }}
              >
                <img 
                  src={layer.image} 
                  alt={layer.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm"
                        style={{ fontFamily: F.ui }}>
                        {layer.stats.hectares}
                      </span>
                      <span className="text-xs tracking-[0.2em] uppercase text-white/60"
                        style={{ fontFamily: F.ui }}>
                        {layer.stats.appellation}
                      </span>
                    </div>
                    <h3 className="text-2xl font-light mb-2" style={{ fontFamily: F.display }}>
                      {layer.name}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed" style={{ fontFamily: F.ui }}>
                      {layer.description}
                    </p>
                  </div>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-[#c4402a]/50 transition-colors duration-500 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '15', label: 'Hectares de vignes' },
            { value: '3', label: 'Types de sols' },
            { value: '100%', label: 'Cabernet Franc' },
            { value: '2020', label: 'Certification AB' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl md:text-5xl font-light mb-2" style={{ fontFamily: F.display, color: '#c4402a' }}>
                {stat.value}
              </p>
              <p className="text-xs tracking-[0.2em] uppercase text-white/40" style={{ fontFamily: F.ui }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
