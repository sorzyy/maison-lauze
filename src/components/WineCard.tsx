import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ShoppingBag, Star } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { useAudio } from '@/context/AudioContext';

interface Wine {
  name: string;
  cuvee: string;
  appellation: string;
  price: string;
  vintage: number;
  image: string;
  badge?: string;
  poem?: string;
}

const C = {
  accent: '#8B3A3A',
  accentLight: '#D4A574',
  text: '#5C4033',
  bg: '#F5EDE4',
  bgElevated: '#FDF8F3',
  sage: '#7A8B6E',
  textMuted: 'rgba(92,64,51,0.6)',
};

export function WineCard({ wine }: { wine: Wine }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { playHover, playClick } = useAudio();

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{ 
        perspective: '1000px',
        background: C.bgElevated,
        border: '1px solid rgba(92,64,51,0.1)'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { setIsHovered(true); playHover(); }}
      onMouseLeave={handleMouseLeave}
    >
      {/* Badge */}
      {wine.badge && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-3 py-1.5 rounded-full"
          style={{ background: C.accent }}>
          <Star className="w-3 h-3 text-white fill-white" />
          <span className="text-xs tracking-wide text-white" style={{ fontFamily: "'Inter', sans-serif" }}>{wine.badge}</span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-80 overflow-hidden" style={{ background: `linear-gradient(135deg, ${C.bg}, ${C.bgElevated})` }}>
        <img
          src={wine.image}
          alt={wine.name}
          className="w-full h-full object-contain p-6 transition-transform duration-500"
          style={{ 
            transform: isHovered ? 'scale(1.1) translateY(-10px)' : 'scale(1)'
          }}
        />
        
        {/* Hover Overlay */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'linear-gradient(to top, rgba(139,58,58,0.9), transparent)' }}>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-sm leading-relaxed text-white/90 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {wine.poem}
            </p>
            <Magnetic strength={0.2}>
              <a 
                href="https://vins-stnicolas-bourgueil-cognard.fr" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={playClick}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-wide uppercase"
                style={{ background: 'white', color: C.accent, fontFamily: "'Inter', sans-serif" }}
              >
                <ShoppingBag className="w-3 h-3" />
                Commander
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-xs tracking-[0.15em] uppercase mb-2" style={{ color: C.sage }}>{wine.appellation}</p>
        <h3 className="text-2xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.text }}>{wine.name}</h3>
        <p className="text-sm mb-4" style={{ color: C.textMuted }}>{wine.cuvee}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.accent }}>{wine.price}</span>
          <span className="text-xs px-2 py-1 rounded" style={{ background: `${C.sage}20`, color: C.sage }}>{wine.vintage}</span>
        </div>
      </div>
    </div>
  );
}
