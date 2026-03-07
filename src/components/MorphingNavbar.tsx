import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useReducedMotionContext } from '@/context/ReducedMotionContext';

gsap.registerPlugin(ScrollTrigger);

const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  ui: "'Syne', sans-serif",
};

const C = {
  primary: '#6a1d58',
  light: '#9b3a86',
  dark: '#3a0a2e',
};

export function MorphingNavbar() {
  const navRef = useRef<HTMLElement>(null);
  const navInnerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { reducedMotion } = useReducedMotionContext();
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const navItems = ['Vins', 'Spiritueux', 'Champagnes', 'Bio', 'Nos Boutiques', 'Notre Histoire'];

  useEffect(() => {
    const nav = navRef.current;
    const navInner = navInnerRef.current;
    if (!nav || !navInner) return;

    // En mode reduced-motion, pas d'animation de morphing
    if (reducedMotion) {
      gsap.set(navInner, {
        width: 'auto',
        maxWidth: 'fit-content',
        borderRadius: '999px',
        backgroundColor: 'rgba(107, 29, 88, 0.85)',
        backdropFilter: 'blur(12px)',
        padding: '0.75rem 1.5rem',
        margin: '0 auto',
      });
      return;
    }

    // Animation de morphing au scroll
    const ctx = gsap.context(() => {
      // Etat initial (pleine largeur, transparent)
      gsap.set(navInner, {
        width: '100%',
        borderRadius: '0px',
        backgroundColor: 'transparent',
        backdropFilter: 'blur(0px)',
        padding: '0.25rem 0rem',
      });

      // Timeline pour le morphing
      scrollTriggerRef.current = ScrollTrigger.create({
        start: 'top -100',
        end: 'top -100',
        onEnter: () => {
          gsap.to(navInner, {
            width: 'auto',
            maxWidth: 'fit-content',
            borderRadius: '999px',
            backgroundColor: 'rgba(107, 29, 88, 0.85)',
            backdropFilter: 'blur(12px)',
            padding: '0.75rem 1.5rem',
            duration: 0.5,
            ease: 'power2.out',
          });
        },
        onLeaveBack: () => {
          gsap.to(navInner, {
            width: '100%',
            borderRadius: '0px',
            backgroundColor: 'transparent',
            backdropFilter: 'blur(0px)',
            padding: '0.25rem 0rem',
            duration: 0.5,
            ease: 'power2.out',
          });
        },
      });
    }, nav);

    return () => {
      ctx.revert();
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [reducedMotion]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-4 flex justify-center items-center pointer-events-none"
        style={{
          background: 'transparent',
        }}
      >
        <div
          ref={navInnerRef}
          className="pointer-events-auto flex items-center justify-between gap-4 md:gap-8 navbar-gradient-border transition-colors"
          style={{
            boxShadow: reducedMotion ? '0 4px 30px rgba(0, 0, 0, 0.3)' : '0 4px 30px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Logo - Texte stylisé */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a 
              href="/" 
              className="text-2xl font-light tracking-[0.08em] text-white hover:text-white/90 transition-colors"
              style={{ fontFamily: F.display }}
            >
              <span className="inline-block relative">
                <span 
                  className="text-3xl font-normal" 
                  style={{ 
                    color: '#c47ab8',
                    textShadow: '0 0 20px rgba(196, 122, 184, 0.5)',
                  }}
                >
                  L
                </span>
                <span className="relative">
                  AUZE
                  <span 
                    className="absolute -bottom-0.5 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c47ab8] to-transparent opacity-60"
                  />
                </span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="relative text-xs tracking-[0.12em] uppercase text-white/70 hover:text-white transition-colors group whitespace-nowrap"
                style={{ fontFamily: F.ui }}
              >
                {item}
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ background: C.light }}
                />
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="https://www.maisonlauze.com"
              target="_blank"
              rel="noopener"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-[0.12em] uppercase border border-white/20 hover:bg-white/10 transition-all"
              style={{ fontFamily: F.ui }}
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Boutique
            </a>
            <button
              className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8"
          style={{
            background: 'rgba(10, 1, 8, 0.97)',
            backdropFilter: reducedMotion ? 'none' : 'blur(20px)',
          }}
        >
          <button
            className="absolute top-5 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            <X className="w-6 h-6" />
          </button>
          {navItems.map((item, i) => (
            <a
              key={item}
              href="#"
              onClick={() => setMenuOpen(false)}
              className="text-4xl font-light text-white/80 hover:text-white transition-colors"
              style={{
                fontFamily: F.display,
                animationDelay: `${i * 0.07}s`,
              }}
            >
              {item}
            </a>
          ))}
          <a
            href="https://www.maisonlauze.com"
            target="_blank"
            rel="noopener"
            className="mt-4 flex items-center gap-2 px-6 py-3 rounded-full text-sm tracking-[0.12em] uppercase border border-white/20 hover:bg-white/10 transition-all"
            style={{ fontFamily: F.ui }}
          >
            <ShoppingBag className="w-4 h-4" /> Boutique
          </a>
        </div>
      )}
    </>
  );
}
