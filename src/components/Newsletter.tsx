import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { useAudio } from '@/context/AudioContext';

gsap.registerPlugin(ScrollTrigger);

const C = {
  accent: '#8B3A3A',
  text: '#5C4033',
  bg: '#F5EDE4',
  bgElevated: '#FDF8F3',
  sage: '#7A8B6E',
  textMuted: 'rgba(92,64,51,0.6)',
};

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { playHover, playClick } = useAudio();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.newsletter-content',
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

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!isValid) {
      setError('Adresse email invalide');
      return;
    }
    setError('');
    playClick();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail('');
  };

  return (
    <section ref={sectionRef} className="py-32 md:py-48 px-6 md:px-16" style={{ background: C.bgElevated }}>
      <div className="newsletter-content max-w-4xl mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
          style={{ background: `${C.sage}15` }}>
          <Mail className="w-10 h-10" style={{ color: C.sage }} />
        </div>

        <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: C.sage }}>Newsletter</p>
        
        <h2 className="text-4xl md:text-6xl font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.text }}>
          Restons <em style={{ color: C.accent }}>en contact</em>
        </h2>
        
        <p className="text-lg mb-12 max-w-md mx-auto" style={{ color: C.textMuted }}>
          Recevez nos actualités, invitations aux dégustations et offres exclusives.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <div className="flex-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-6 py-4 rounded-full text-base outline-none transition-all"
              style={{ 
                background: C.bg,
                border: '1px solid rgba(92,64,51,0.15)',
                color: C.text,
                fontFamily: "'Inter', sans-serif"
              }}
            />
          </div>
          {error && (
            <p className="text-xs mt-2 ml-2" style={{ color: '#8B3A3A' }}>{error}</p>
          )}
          
          <Magnetic strength={0.15}>
            <button
              type="submit"
              onMouseEnter={playHover}
              className="px-8 py-4 rounded-full text-sm tracking-[0.1em] uppercase text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg"
              style={{ 
                background: C.accent,
                fontFamily: "'Inter', sans-serif"
              }}
            >
              {subscribed ? (
                <>
                  <Check className="w-4 h-4" /> Inscrit
                </>
              ) : (
                <>
                  S'inscrire <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </Magnetic>
        </form>

        <p className="text-xs mt-6" style={{ color: 'rgba(92,64,51,0.4)' }}>
          Pas de spam, juste le meilleur du vignoble. Désinscription possible à tout moment.
        </p>
      </div>
    </section>
  );
}
