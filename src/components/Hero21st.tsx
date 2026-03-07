import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Play } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { useAudio } from '@/context/AudioContext';

const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  ui: "'Inter', -apple-system, sans-serif",
};

const C = {
  accent: '#8B3A3A',
  accentLight: '#D4A574',
  sage: '#7A8B6E',
  text: '#5C4033',
  textMuted: 'rgba(92,64,51,0.75)',
  bg: '#F5EDE4',
};

// Détection mobile
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export function Hero21st() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { playHover, playClick } = useAudio();

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });
      
      tl.fromTo('.hero-badge', 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      )
      .fromTo('.hero-title-line', 
        { y: 100, opacity: 0, rotateX: -40 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.15, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo('.hero-desc', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo('.hero-buttons', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: C.bg }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {/* Image de fallback (mobile ou pendant chargement) */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${videoLoaded && !mobile ? 'opacity-0' : 'opacity-100'}`}>
          <img loading="lazy" decoding="async" 
            src="https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?w=1920&q=80"
            alt="Vignoble"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.85) sepia(0.15) saturate(1.1)' }}
          />
        </div>
        
        {/* Vidéo YouTube (desktop uniquement) */}
        {!mobile && (
          <div className={`absolute inset-0 transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <iframe
              src="https://www.youtube.com/embed/T_PUCNo-bQM?autoplay=1&mute=1&loop=1&playlist=T_PUCNo-bQM&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
              allow="autoplay; fullscreen"
              className="absolute w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ 
                pointerEvents: 'none',
                filter: 'brightness(0.7) sepia(0.15) saturate(1.2)'
              }}
              onLoad={() => setVideoLoaded(true)}
            />
          </div>
        )}

        {/* Gradients chauds */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5EDE4]/95 via-[#F5EDE4]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5EDE4]/90 via-transparent to-[#F5EDE4]/40" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
        <div className="max-w-3xl">
          
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ 
              background: 'rgba(122, 139, 110, 0.2)',
              border: '1px solid rgba(122, 139, 110, 0.4)'
            }}>
            <span className="text-lg">✦</span>
            <span className="text-xs tracking-[0.15em] uppercase font-medium" style={{ color: C.sage, fontFamily: F.ui }}>
              Agriculture Biologique Certifiée
            </span>
          </div>

          <h1 className="mb-8" style={{ fontFamily: F.display, perspective: '1000px' }}>
            <span 
              className="hero-title-line block text-[clamp(2.5rem,10vw,7rem)] font-light leading-[0.9] tracking-[-0.02em]"
              style={{ color: C.sage }}
            >
              Famille
            </span>
            <span 
              className="hero-title-line block text-[clamp(2.5rem,10vw,7rem)] font-light leading-[0.9] tracking-[-0.02em]"
              style={{ color: C.text }}
            >
              Cognard
            </span>
            <span 
              className="hero-title-line block text-[clamp(1.8rem,6vw,4rem)] font-light italic leading-[1.1] mt-2"
              style={{ color: C.accent }}
            >
              Vins de Loire
            </span>
          </h1>

          <p 
            className="hero-desc text-base md:text-xl leading-relaxed mb-10 max-w-xl"
            style={{ color: C.textMuted, fontFamily: F.ui }}
          >
            Trois générations de vignerons passionnés cultivent le Cabernet Franc 
            sur les terroirs uniques de Saint-Nicolas-de-Bourgueil et Bourgueil. 
            Une agriculture biologique respectueuse de la terre et du vivant.
          </p>

          <div className="hero-buttons flex flex-wrap gap-4">
            <Magnetic strength={0.15}>
              <a 
                href="#vins"
                onMouseEnter={playHover}
                onClick={playClick}
                className="group inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full text-sm tracking-[0.1em] uppercase text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#8B3A3A]/30"
                style={{ 
                  background: `linear-gradient(135deg, ${C.accent}, #A04040)`,
                  fontFamily: F.ui
                }}
              >
                Découvrir nos vins
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Magnetic>

            <Magnetic strength={0.15}>
              <a 
                href="#histoire"
                onMouseEnter={playHover}
                onClick={playClick}
                className="group inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full text-sm tracking-[0.1em] uppercase transition-all duration-300 hover:bg-[#5C4033] hover:text-white"
                style={{ 
                  border: '2px solid rgba(92,64,51,0.4)',
                  color: C.text,
                  fontFamily: F.ui
                }}
              >
                <Play className="w-4 h-4" />
                Notre histoire
              </a>
            </Magnetic>
          </div>

          <div className="absolute bottom-12 left-6 md:left-12 flex items-center gap-4" style={{ color: 'rgba(92,64,51,0.5)' }}>
            <div className="w-px h-12 bg-gradient-to-b from-[#5C4033]/40 to-transparent" />
            <span className="text-xs tracking-[0.3em] uppercase font-medium" style={{ fontFamily: F.ui }}>
              Scroll
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 hidden md:block">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: '20s' }}>
            <defs>
              <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
            </defs>
            <text fill="rgba(92,64,51,0.35)" fontSize="8" fontFamily={F.ui} letterSpacing="2">
              <textPath xlinkHref="#circle">
                DOMAINE VITICOLE · AGRICULTURE BIO · VAL DE LOIRE ·
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full" style={{ background: C.sage }} />
          </div>
        </div>
      </div>
    </section>
  );
}
