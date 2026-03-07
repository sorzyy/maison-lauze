import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ShoppingBag } from 'lucide-react';

const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  ui: "'Inter', -apple-system, sans-serif",
};

const C = {
  accent: '#7a1a1a',
  accentLight: '#c4402a',
};

interface Wine {
  name: string;
  cuvee: string;
  appellation: string;
  price: string;
  vintage: number;
  image: string;
  badge?: string;
  poem: string;
}

interface WineCardProps {
  wine: Wine;
}

export function WineCard({ wine }: WineCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.5,
      ease: 'power2.out'
    });

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: x * 20,
        y: y * 20,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.5)'
    });

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.5)'
      });
    }

    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className="group cursor-pointer"
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="relative aspect-[3/4] mb-6 overflow-hidden rounded-2xl transition-all duration-500"
        style={{ 
          background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          transformStyle: 'preserve-3d',
          boxShadow: isHovered 
            ? '0 25px 50px -12px rgba(122,26,26,0.4), 0 0 0 1px rgba(122,26,26,0.3)' 
            : '0 10px 30px -15px rgba(0,0,0,0.5)'
        }}
      >
        {/* Background glow on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(122,26,26,0.15) 0%, transparent 70%)'
          }}
        />
        
        <img 
          ref={imageRef}
          src={wine.image} 
          alt={wine.name}
          className="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-700"
          style={{ 
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
            transform: `translateZ(50px)`
          }}
        />
        
        {wine.badge && (
          <span 
            className="absolute top-4 left-4 text-xs px-4 py-2 rounded-full z-10 transition-transform duration-500"
            style={{ 
              background: C.accent, 
              fontFamily: F.ui,
              transform: isHovered ? 'translateZ(80px)' : 'translateZ(30px)'
            }}
          >
            {wine.badge}
          </span>
        )}

        {/* Hover overlay with poem */}
        <div 
          className="absolute inset-0 flex flex-col justify-end p-6 transition-all duration-500"
          style={{
            background: isHovered 
              ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)' 
              : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)',
            opacity: isHovered ? 1 : 0.7,
            transform: `translateZ(40px)`
          }}
        >
          <p 
            className="text-sm italic text-white/90 mb-4 transition-all duration-500"
            style={{ 
              fontFamily: F.display,
              transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
              opacity: isHovered ? 1 : 0
            }}
          >
            "{wine.poem}"
          </p>
          
          <a
            href="https://vins-stnicolas-bourgueil-cognard.fr/nos-cuvees"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase px-4 py-3 rounded-full w-fit transition-all duration-300 hover:scale-105"
            style={{ 
              background: C.accent,
              fontFamily: F.ui,
              transform: isHovered ? 'translateY(0) translateZ(60px)' : 'translateY(20px) translateZ(40px)',
              opacity: isHovered ? 1 : 0
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ShoppingBag className="w-3 h-3" /> Commander
          </a>
        </div>

        {/* Vintage badge */}
        <div 
          className="absolute top-4 right-4 text-xs px-3 py-1.5 rounded-md transition-all duration-500"
          style={{ 
            background: 'rgba(0,0,0,0.6)', 
            backdropFilter: 'blur(10px)',
            fontFamily: F.ui,
            transform: isHovered ? 'translateZ(60px)' : 'translateZ(30px)'
          }}
        >
          {wine.vintage}
        </div>
      </div>

      <div style={{ transform: 'translateZ(30px)' }}>
        <p 
          className="text-xs tracking-[0.2em] uppercase mb-2 transition-colors duration-300"
          style={{ 
            color: isHovered ? C.accentLight : 'rgba(196,64,42,0.7)', 
            fontFamily: F.ui 
          }}
        >
          {wine.appellation}
        </p>
        <h3 
          className="text-2xl font-light mb-1 transition-transform duration-500"
          style={{ 
            fontFamily: F.display,
            transform: isHovered ? 'translateX(5px)' : 'translateX(0)'
          }}
        >
          {wine.name}
        </h3>
        <p className="text-sm text-white/40 mb-3">{wine.cuvee}</p>
        <p 
          className="text-xl font-light transition-all duration-300"
          style={{ 
            fontFamily: F.display, 
            color: C.accentLight,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transformOrigin: 'left center'
          }}
        >
          {wine.price}
        </p>
      </div>
    </div>
  );
}
