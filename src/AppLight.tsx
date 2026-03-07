import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

gsap.registerPlugin(ScrollTrigger);

// TYPOGRAPHY - Style différent : élégant + géométrique
const F = {
  display: "'Playfair Display', Georgia, serif",
  ui: "'Space Grotesk', sans-serif",
};

// COLORS - Thème Clair Nature
const C = {
  bg: '#F5F0E8',           // Cream
  bgDark: '#EDE8E0',       // Darker cream
  text: '#1A1A1A',         // Charcoal
  textMuted: '#6B6B6B',    // Warm gray
  accent: '#2D5016',       // Forest Green (nature/bio)
  accentLight: '#4A7C23',  // Lighter green
  gold: '#C9A227',         // Antique gold
  cream: '#FAF8F5',        // Pure cream
};

// Data
const wines = [
  { name: 'Les Malgagnes', year: '2020', price: '14€', type: 'Rouge', desc: 'Complexe et élégant', color: '#7a1a1a' },
  { name: 'Caudalies', year: '2021', price: '18€', type: 'Barrique', desc: 'Prestige', color: '#4a0f0f' },
  { name: 'Cuvée Estelle', year: '2023', price: '11€', type: 'Fruité', desc: 'Frais et léger', color: '#9b2828' },
  { name: 'Les Tuffes', year: '2021', price: '11€', type: 'Structuré', desc: 'Caractère', color: '#5c1818' },
  { name: 'Ma Cuvée DOR', year: '2023', price: '10€', type: 'Léger', desc: 'Quotidien', color: '#c4402a' },
];

const highlights = [
  { num: '50', label: 'Années', suffix: '+' },
  { num: '3', label: 'Générations', suffix: '' },
  { num: '15', label: 'Hectares', suffix: '' },
  { num: '100', label: 'Bio', suffix: '%' },
];

// Custom Cursor Light
function CustomCursorLight() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Dot follows instantly
      gsap.set(dot, { x: mouseX, y: mouseY });
    };

    const animate = () => {
      // Cursor follows with lag
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      gsap.set(cursor, { x: cursorX, y: cursorY });
      requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, { scale: 1.5, borderColor: C.accent, duration: 0.3 });
      gsap.to(dot, { scale: 0.5, backgroundColor: C.accent, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { scale: 1, borderColor: C.text, duration: 0.3 });
      gsap.to(dot, { scale: 1, backgroundColor: C.text, duration: 0.3 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animate();

    // Add hover detection
    const interactiveElements = document.querySelectorAll('a, button, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef}
        className="fixed w-10 h-10 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
        style={{ border: '1px solid ' + C.text }}
      />
      <div 
        ref={cursorDotRef}
        className="fixed w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ backgroundColor: C.text }}
      />
    </>
  );
}

// Magnetic Button Light
function MagneticLight({ children, className = '', style, onClick }: { children: React.ReactNode, className?: string, style?: React.CSSProperties, onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { playHover } = useAudio();

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(el, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)'
    });
  };

  return (
    <button
      ref={ref}
      className={className}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={playHover}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Horizontal Text Reveal
function TextRevealHorizontal({ children, className = '' }: { children: string, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const chars = el.querySelectorAll('.char');
    
    gsap.fromTo(chars, 
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.02,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      }
    );
  }, []);

  return (
    <div ref={ref} className={className}>
      {children.split('').map((char, i) => (
        <span key={i} className="char inline-block" style={{ opacity: 0 }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}

// Wine Card Light - Style différent
function WineCardLight({ wine, index }: { wine: typeof wines[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={cardRef}
      className="group relative p-6 rounded-2xl transition-all duration-500 cursor-pointer"
      style={{
        background: isHovered ? C.cream : 'transparent',
        border: `1px solid ${isHovered ? C.accent : 'rgba(45,80,22,0.1)'}`,
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Numéro */}
      <span 
        className="absolute -top-4 -left-2 text-6xl font-light opacity-10"
        style={{ fontFamily: F.display, color: C.accent }}
      >
        0{index + 1}
      </span>

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: C.textMuted, fontFamily: F.ui }}>
              {wine.year}
            </p>
            <h3 className="text-2xl font-medium" style={{ fontFamily: F.display }}>
              {wine.name}
            </h3>
          </div>
          <span 
            className="text-lg font-light"
            style={{ fontFamily: F.display, color: C.accent }}
          >
            {wine.price}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span 
            className="w-3 h-3 rounded-full"
            style={{ background: wine.color }}
          />
          <span className="text-sm" style={{ color: C.textMuted, fontFamily: F.ui }}>
            {wine.type}
          </span>
        </div>

        <p className="text-sm mb-6" style={{ color: C.textMuted, fontFamily: F.ui }}>
          {wine.desc}
        </p>

        <button
          className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase transition-all duration-300 group/btn"
          style={{ 
            color: isHovered ? C.accent : C.textMuted,
            fontFamily: F.ui 
          }}
        >
          Découvrir 
          <ArrowUpRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
        </button>
      </div>
    </div>
  );
}

// Section Hero asymétrique
function HeroAsymmetric() {
  const { playClick } = useAudio();

  return (
    <section className="min-h-screen relative overflow-hidden" style={{ background: C.bg }}>
      {/* Grid de fond */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${C.accent} 1px, transparent 1px), linear-gradient(90deg, ${C.accent} 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
        <div className="grid md:grid-cols-12 gap-8 items-end min-h-[70vh]">
          {/* Gauche - Gros titre */}
          <div className="md:col-span-7">
            <p 
              className="text-xs tracking-[0.4em] uppercase mb-6"
              style={{ color: C.accent, fontFamily: F.ui }}
            >
              Domaine Viticole · Val de Loire
            </p>
            
            <h1 
              className="text-[clamp(3rem,8vw,7rem)] leading-[0.95] mb-8"
              style={{ fontFamily: F.display, fontWeight: 500 }}
            >
              <TextRevealHorizontal>
                Famille
              </TextRevealHorizontal>
              <span className="block italic" style={{ color: C.accent }}>
                <TextRevealHorizontal>
                  Cognard
                </TextRevealHorizontal>
              </span>
            </h1>

            <p 
              className="text-lg max-w-md mb-10 leading-relaxed"
              style={{ color: C.textMuted, fontFamily: F.ui }}
            >
              Trois générations de vignerons passionnés. 
              Cabernet Franc en Agriculture Biologique depuis 1973.
            </p>

            <div className="flex gap-4">
              <MagneticLight
                className="px-8 py-4 rounded-full text-sm tracking-[0.1em] uppercase text-white transition-all hover:shadow-lg"
                style={{ background: C.accent, fontFamily: F.ui }}
                onClick={playClick}
              >
                Nos Vins
              </MagneticLight>
              
              <MagneticLight
                className="px-8 py-4 rounded-full text-sm tracking-[0.1em] uppercase border transition-all hover:bg-black hover:text-white"
                style={{ borderColor: C.text, fontFamily: F.ui }}
                onClick={playClick}
              >
                Le Domaine
              </MagneticLight>
            </div>
          </div>

          {/* Droite - Stats verticales */}
          <div className="md:col-span-5 flex md:justify-end">
            <div className="grid grid-cols-2 gap-8">
              {highlights.map((item, i) => (
                <div key={i} className="text-right">
                  <p 
                    className="text-4xl md:text-5xl font-light mb-1"
                    style={{ fontFamily: F.display, color: C.accent }}
                  >
                    {item.num}{item.suffix}
                  </p>
                  <p 
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{ color: C.textMuted, fontFamily: F.ui }}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image hero overlap */}
        <div className="relative mt-16 md:mt-0 md:absolute md:bottom-12 md:right-12 md:w-[45%]">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://assets.evolusite.fr/ik-seo/3/img_3314_K6JZq7j9n/img_3314_K6JZq7j9n.jpg"
              alt="Vignes"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Badge flottant */}
          <div 
            className="absolute -bottom-6 -left-6 px-6 py-4 rounded-xl shadow-lg"
            style={{ background: C.gold }}
          >
            <p className="text-xs tracking-[0.2em] uppercase text-white" style={{ fontFamily: F.ui }}>
              Certifié AB
            </p>
            <p className="text-white font-medium" style={{ fontFamily: F.display }}>
              Agriculture Bio
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section Vins - Masonry Grid
function WinesMasonry() {
  const { playHover } = useAudio();

  return (
    <section className="py-32 px-6 md:px-12" style={{ background: C.cream }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <p 
              className="text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: C.accent, fontFamily: F.ui }}
            >
              Nos Cuvées
            </p>
            <h2 
              className="text-4xl md:text-6xl font-medium"
              style={{ fontFamily: F.display }}
            >
              Le Cabernet <em className="italic" style={{ color: C.accent }}>Franc</em>
            </h2>
          </div>
          <p 
            className="max-w-sm"
            style={{ color: C.textMuted, fontFamily: F.ui }}
          >
            Cinq expressions d'un même cépage, cinq personnalités distinctes.
          </p>
        </div>

        {/* Grid asymétrique */}
        <div className="grid md:grid-cols-3 gap-6">
          {wines.map((wine, i) => (
            <div 
              key={i} 
              className={`${i === 0 || i === 3 ? 'md:col-span-2' : ''}`}
              onMouseEnter={playHover}
            >
              <WineCardLight wine={wine} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section Terroir - Cards horizontales
function TerroirHorizontal() {
  const containerRef = useRef<HTMLDivElement>(null);

  const terroirs = [
    {
      title: 'Sables & Graviers',
      desc: 'Légèreté et fruits rouges frais',
      hectares: '8 ha',
      icon: '🏖️'
    },
    {
      title: 'Argilo-Calcaire',
      desc: 'Structure et finale minérale',
      hectares: '4 ha',
      icon: '🪨'
    },
    {
      title: 'Alluvions',
      desc: 'Fraîcheur et finesse',
      hectares: '3 ha',
      icon: '🌊'
    }
  ];

  return (
    <section ref={containerRef} className="py-32 overflow-hidden" style={{ background: C.bg }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <p 
            className="text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: C.accent, fontFamily: F.ui }}
          >
            Le Vignoble
          </p>
          <h2 
            className="text-4xl md:text-5xl font-medium"
            style={{ fontFamily: F.display }}
          >
            Trois terroirs, <em className="italic" style={{ color: C.accent }}>trois âmes</em>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {terroirs.map((t, i) => (
            <div
              key={i}
              className="flex-1 group p-8 rounded-2xl transition-all duration-500 hover:flex-[1.5] cursor-pointer"
              style={{
                background: C.cream,
                border: '1px solid rgba(45,80,22,0.1)'
              }}
            >
              <span className="text-4xl mb-4 block">{t.icon}</span>
              <p 
                className="text-xs tracking-[0.2em] uppercase mb-2"
                style={{ color: C.accent, fontFamily: F.ui }}
              >
                {t.hectares}
              </p>
              <h3 
                className="text-2xl font-medium mb-3"
                style={{ fontFamily: F.display }}
              >
                {t.title}
              </h3>
              <p style={{ color: C.textMuted, fontFamily: F.ui }}>
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section Histoire - Timeline vertical
function HistoireTimeline() {
  const steps = [
    { year: '1973', title: 'La fondation', desc: 'Lydie & Max plantent le premier hectare' },
    { year: '1985', title: 'Expansion', desc: 'Construction de la cave climatisée' },
    { year: '1997', title: 'Transmission', desc: 'Estelle rejoint le domaine' },
    { year: '2020', title: 'Certification', desc: 'Agriculture Biologique AB' },
  ];

  return (
    <section className="py-32 px-6 md:px-12" style={{ background: C.bgDark }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <p 
            className="text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: C.accent, fontFamily: F.ui }}
          >
            Notre Histoire
          </p>
          <h2 
            className="text-4xl md:text-5xl font-medium"
            style={{ fontFamily: F.display }}
          >
            Une histoire de <em className="italic" style={{ color: C.accent }}>famille</em>
          </h2>
        </div>

        <div className="relative">
          {/* Ligne centrale */}
          <div 
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
            style={{ background: 'rgba(45,80,22,0.2)' }}
          />

          {steps.map((step, i) => (
            <div 
              key={i}
              className={`relative flex items-center gap-8 mb-16 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                <span 
                  className="text-5xl md:text-6xl font-light opacity-20"
                  style={{ fontFamily: F.display, color: C.accent }}
                >
                  {step.year}
                </span>
              </div>

              {/* Point */}
              <div 
                className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full md:-translate-x-1/2"
                style={{ background: C.accent }}
              />

              <div className={`flex-1 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                <h3 
                  className="text-xl font-medium mb-2"
                  style={{ fontFamily: F.display }}
                >
                  {step.title}
                </h3>
                <p style={{ color: C.textMuted, fontFamily: F.ui }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section
function ContactSection() {
  const { playHover } = useAudio();

  return (
    <section className="py-32 px-6 md:px-12" style={{ background: C.accent }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p 
              className="text-xs tracking-[0.3em] uppercase mb-4 text-white/60"
              style={{ fontFamily: F.ui }}
            >
              Contact
            </p>
            <h2 
              className="text-4xl md:text-6xl font-medium text-white mb-8"
              style={{ fontFamily: F.display }}
            >
              Venez nous <em className="italic">rencontrer</em>
            </h2>
            <p 
              className="text-white/70 mb-8 max-w-md"
              style={{ fontFamily: F.ui }}
            >
              Le caveau est ouvert toute la semaine pour déguster nos vins 
              et découvrir le vignoble.
            </p>

            <div className="space-y-4">
              {[
                { icon: MapPin, text: '1379 route du Carroi Taveau, 37140 Saint-Nicolas-de-Bourgueil' },
                { icon: Phone, text: '02 47 97 76 88' },
                { icon: Mail, text: 'vins.cognard@orange.fr' },
                { icon: Clock, text: 'Lun-Sam: 9h-12h / 14h-18h' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-white/80">
                  <item.icon className="w-4 h-4 text-white/60" />
                  <span style={{ fontFamily: F.ui }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div 
            className="p-8 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <h3 
              className="text-2xl font-medium text-white mb-6"
              style={{ fontFamily: F.display }}
            >
              Envoyer un message
            </h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Votre nom"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
                style={{ fontFamily: F.ui }}
              />
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
                style={{ fontFamily: F.ui }}
              />
              <textarea
                placeholder="Votre message"
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors resize-none"
                style={{ fontFamily: F.ui }}
              />
              <button
                type="submit"
                onMouseEnter={playHover}
                className="w-full py-4 rounded-lg text-sm tracking-[0.1em] uppercase font-medium transition-all hover:bg-white hover:text-[#2D5016]"
                style={{ background: C.gold, color: 'white', fontFamily: F.ui }}
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// Navigation flottante bottom
function BottomNav() {
  const [active, setActive] = useState('');
  const { playClick } = useAudio();

  const items = [
    { label: 'Accueil', href: '#' },
    { label: 'Vins', href: '#vins' },
    { label: 'Terroir', href: '#terroir' },
    { label: 'Histoire', href: '#histoire' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden md:block">
      <div 
        className="flex items-center gap-1 px-2 py-2 rounded-full shadow-xl"
        style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
      >
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => { playClick(); setActive(item.label); }}
            className={`px-5 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase transition-all ${
              active === item.label 
                ? 'text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={{ 
              fontFamily: F.ui,
              background: active === item.label ? C.accent : 'transparent'
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

// Footer Light
function FooterLight() {
  return (
    <footer className="py-12 px-6 md:px-12 border-t" style={{ background: C.bg, borderColor: 'rgba(45,80,22,0.1)' }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p 
          className="text-2xl font-medium"
          style={{ fontFamily: F.display }}
        >
          Famille Cognard
        </p>
        <p 
          className="text-sm"
          style={{ color: C.textMuted, fontFamily: F.ui }}
        >
          © 2026 · Agriculture Biologique · Val de Loire
        </p>
        <div className="flex gap-6">
          {['Instagram', 'Facebook'].map((social) => (
            <a
              key={social}
              href="#"
              className="text-sm hover:text-[#2D5016] transition-colors"
              style={{ color: C.textMuted, fontFamily: F.ui }}
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// App Principal
export default function AppLight() {
  useEffect(() => {
    // Reveal animations au scroll
    gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          }
        }
      );
    });
  }, []);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.ui }}>
      <CustomCursorLight />
      <BottomNav />
      
      <HeroAsymmetric />
      <WinesMasonry />
      <TerroirHorizontal />
      <HistoireTimeline />
      <ContactSection />
      <FooterLight />
    </div>
  );
}
