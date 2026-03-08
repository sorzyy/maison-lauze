import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const C = {
  accent: '#8B3A3A',
  text: '#5C4033',
  bg: '#F5EDE4',
  sage: '#7A8B6E',
  gold: '#B8956B',
  accentLight: '#D4A574',
};

const marqueeContent = ['★ AOP Saint-Nicolas-de-Bourgueil', '★ AOP Bourgueil', '★ 100% Cabernet Franc', '★ Agriculture Biologique'];

export function Marquee() {
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!track1Ref.current || !track2Ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(track1Ref.current, {
        xPercent: -50,
        ease: 'none',
        duration: 30,
        repeat: -1,
      });
      gsap.to(track2Ref.current, {
        xPercent: 50,
        ease: 'none',
        duration: 25,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="py-8 overflow-hidden" style={{ background: C.bg }}>
      {/* Track 1 - Left */}
      <div className="overflow-hidden mb-4">
        <div ref={track1Ref} className="flex whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              {marqueeContent.map((item, j) => (
                <span key={j} className="mx-8 text-2xl md:text-3xl font-light tracking-wide"
                  style={{ 
                    fontFamily: "'Cormorant Garamond', serif",
                    color: j % 2 === 0 ? C.sage : 'rgba(92,64,51,0.4)'
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Track 2 - Right */}
      <div className="overflow-hidden">
        <div ref={track2Ref} className="flex whitespace-nowrap translate-x-[-50%]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              {marqueeContent.map((item, j) => (
                <span key={j} className="mx-8 text-xl md:text-2xl tracking-[0.2em] uppercase"
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    color: j % 2 === 0 ? C.text : C.accentLight
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
