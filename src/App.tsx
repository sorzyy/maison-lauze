import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, ShoppingBag, Star, Leaf, Clock, ArrowRight, X, Menu, ChevronRight, Sparkles, Zap } from 'lucide-react';
import { WavyBackground } from '@/components/ui/wavy-background';
import { Loader } from '@/components/Loader';
import { ChampagneBubbles } from '@/components/ChampagneBubbles';
import { CustomCursor } from '@/components/CustomCursor';
import { ScrollProgress } from '@/components/ScrollProgress';
import { Marquee } from '@/components/Marquee';
import { QuizModal } from '@/components/quiz/QuizModal';
import { MagneticButton } from '@/components/MagneticButton';
import { ExitIntentDrawer } from '@/components/ExitIntentDrawer';
import { Timeline } from '@/components/ui/timeline';
import { ParallaxImage } from '@/components/ParallaxImage';
import { useReducedMotionContext } from '@/context/ReducedMotionContext';

gsap.registerPlugin(ScrollTrigger);

const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  ui: "'Syne', sans-serif",
};

// Maison Lauze plum palette
const C = {
  primary: '#6a1d58',
  light: '#9b3a86',
  dark: '#3a0a2e',
  accent: '#bfc106',
};

const TufeauTexture = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: '300px 300px',
      mixBlendMode: 'overlay',
    }} />
);

function StatCounter({ value, suffix = '', label, reducedMotion }: { value: number; suffix?: string; label: string; reducedMotion: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    // En mode reduced-motion, afficher directement la valeur finale sans animation
    if (reducedMotion) {
      el.textContent = value.toLocaleString('fr-FR') + suffix;
      return;
    }
    
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !hasRun.current) {
        hasRun.current = true;
        const start = performance.now();
        const dur = 1800;
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(ease * value).toLocaleString('fr-FR') + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, suffix, reducedMotion]);
  return (
    <div className="text-center p-6 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-4xl font-light mb-1" style={{ fontFamily: F.display, color: C.light }}>
        <span ref={ref}>0</span>
      </p>
      <p className="text-xs tracking-[0.2em] uppercase text-white/40" style={{ fontFamily: F.ui }}>{label}</p>
    </div>
  );
}

function TiltCard({ children, className, style, reducedMotion }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; reducedMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return; // Désactiver l'effet tilt en mode reduced-motion
    const card = ref.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
  };
  const onLeave = () => { 
    if (ref.current) ref.current.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)'; 
  };
  return (
    <div ref={ref} className={className} style={{ ...style, transition: reducedMotion ? 'none' : 'transform 0.4s cubic-bezier(0.23,1,0.32,1)', transformStyle: 'preserve-3d' }}
      onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}



// ── Timeline data ─────────────────────────────────────────────────────────────
const timeline = [
  { year: '1886', title: 'Louis Lauze', text: 'Ouvre une auberge relais pour les diligences à Saint-Privat-de-Vallongue. Le vin en vrac livré par charrette.' },
  { year: '1906', title: 'Élie Lauze', text: 'Développement de l\'embouteillage. Naissance de "La Pétillante", la limonade de la maison.' },
  { year: '1942', title: 'Aimé Lauze', text: 'Reprise de l\'affaire. Diversification : vente de charbon et produits agricoles en parallèle du vin.' },
  { year: '1972', title: 'Michel Lauze', text: 'Le vin embouteillé prend un nom : "Le Tantussou", en hommage au surnom du fondateur.' },
  { year: '1997', title: 'Gilles Lauze', text: 'Création de Lauze Boissons, spécialisée dans les vins fins. Ouverture du site de vente en ligne en 2004.' },
  { year: '2007', title: 'Clément & Ysaline', text: 'La 6ème génération entre en scène. Ouverture du Comptoir des Vignes à Mende.' },
];

// ── Seasonal hero copy ────────────────────────────────────────────────────────
const SEASONAL: Record<number, string> = {
  0:  "Les caves se réchauffent — les premières cuvées de l'année s'éveillent.",
  1:  "Février en Lozère — le silence des vignes avant l'éveil du printemps.",
  2:  "La vigne se réveille — les premières tailles commencent en Cévennes.",
  3:  "Avril en fleurs — les bourgeons de Cabernet percent sous le soleil du Languedoc.",
  4:  "La floraison approche — chaque grappe commence son voyage vers votre verre.",
  5:  "Juin éclatant — les raisins gonflent dans les vignobles du Pic Saint-Loup.",
  6:  "L'été s'installe — la véraison colore les grappes en rouge profond.",
  7:  "Août ardent — les vendanges approchent dans les terroirs du Languedoc.",
  8:  "Les vendanges ! — nos vignerons récoltent les raisins sous le soleil cévenol.",
  9:  "L'automne des caves — les vins nouveaux entrent en fermentation.",
  10: "Novembre en Lozère — les vins s'élèvent dans nos caves troglodytes.",
  11: "Notre cave est au repos. Nos vins, en pleine maturité — prêts à vous enchanter.",
};
const seasonalCopy = SEASONAL[new Date().getMonth()];

// ── Featured wines ─────────────────────────────────────────────────────────────
const featuredWines = [
  {
    name: 'Domaine de Gournier',
    cuvee: 'IGP Cévennes',
    type: 'Rouge',
    region: 'Languedoc-Roussillon',
    price: '4,90 €',
    grapes: 'Merlot · Cabernet · Syrah',
    vintage: 2022,
    image: 'https://www.maisonlauze.com/376-large_default/domaine-de-gournier-igp-cevennes-vin-rouge-75-cl-.jpg',
    badge: 'Vin local',
    poem: 'Fruits rouges éclatants, une touche de garrigue — comme une balade en Cévennes après l\'orage.',
  },
  {
    name: 'Château des Estanilles',
    cuvee: 'Cuvée Vallongue',
    type: 'Rouge BIO',
    region: 'AOP Faugères',
    price: '12,60 €',
    grapes: 'Grenache · Syrah · Mourvèdre',
    vintage: 2020,
    image: 'https://placehold.co/280x380/1a0a14/ffffff?text=Estanilles',
    badge: '🌿 Bio',
    poem: 'Velours de fruits noirs et d\'épices douces — la minéralité du schiste de Faugères en finale.',
  },
  {
    name: 'Domaine de l\'Hortus',
    cuvee: 'Grande Cuvée',
    type: 'Rouge',
    region: 'Pic Saint-Loup',
    price: '27,20 €',
    grapes: 'Syrah · Grenache · Mourvèdre',
    vintage: 2019,
    image: 'https://placehold.co/280x380/1a0a14/ffffff?text=Hortus',
    badge: 'Coup de cœur',
    poem: 'Puissance maîtrisée, tanins nobles — le Pic Saint-Loup dans toute sa majesté sombre.',
  },
  {
    name: 'Château de Lancyre',
    cuvee: 'Vieilles Vignes',
    type: 'Rouge',
    region: 'Pic Saint-Loup',
    price: '15,50 €',
    grapes: 'Syrah · Grenache',
    vintage: 2021,
    image: 'https://placehold.co/280x380/1a0a14/ffffff?text=Lancyre',
    badge: '',
    poem: 'Élégance naturelle, bouquet de violette et de laurier — une vigne qui a vu le temps passer.',
  },
  {
    name: 'Domaine d\'Aupilhac',
    cuvee: 'Cuvée Montpeyroux',
    type: 'Rouge BIO',
    region: 'AOP Languedoc',
    price: '20,00 €',
    grapes: 'Mourvèdre · Grenache · Cinsault',
    vintage: 2020,
    image: 'https://placehold.co/280x380/1a0a14/ffffff?text=Aupilhac',
    badge: '🌿 Bio',
    poem: 'Terroir vivant, sans compromis — garrigue, olive noire et soleil brûlant en un seul verre.',
  },
];

// ── Stores ─────────────────────────────────────────────────────────────────────
const stores = [
  {
    name: 'Le Bouchon Cévenol',
    location: 'Florac',
    address: '16 Esplanade Marceau Farelle, 48400 Florac',
    phone: '04 66 45 08 41',
    hours: 'Mar–Sam : 9h30–12h30 / 15h–19h · Dim : 9h30–13h',
    caviste: 'Manon',
    image: 'https://www.maisonlauze.com/img/cms/Le%20Bouchon%20Cevenol%20Florac.jpg',
  },
  {
    name: 'Comptoir des Vignes',
    location: 'Mende',
    address: '22 bis av. des Gorges du Tarn, 48000 Mende',
    phone: '04 66 48 53 04',
    hours: 'Mar–Sam : 9h30–12h30 / 15h–19h',
    caviste: 'Clément & Ysaline Lauze',
    image: 'https://www.maisonlauze.com/img/cms/Comptoir%20des%20vignes%20Mende%20-%20devanture.jpg',
  },
];

// ── Regions ─────────────────────────────────────────────────────────────────────
const regions = [
  { name: 'Languedoc-Roussillon', count: '180+', icon: '🍇' },
  { name: 'Rhône', count: '60+', icon: '🌊' },
  { name: 'Bordeaux', count: '55+', icon: '🏰' },
  { name: 'Provence', count: '40+', icon: '☀️' },
  { name: 'Bourgogne', count: '35+', icon: '🌿' },
  { name: 'Loire', count: '30+', icon: '🌸' },
  { name: 'Alsace', count: '20+', icon: '🏔️' },
  { name: 'Sud-Ouest', count: '25+', icon: '🌾' },
];

// ── App ────────────────────────────────────────────────────────────────────────
// ── Scroll chapters ────────────────────────────────────────────────────────────
const chapters = [
  {
    image: 'https://www.maisonlauze.com/img/cms/vins.jpg',
    left: 'Six',
    right: 'générations.',
    subtitle: "d'amour du vin depuis 1886",
    label: '01',
  },
  {
    image: 'https://www.maisonlauze.com/img/cms/champagne.jpg',
    left: '469',
    right: 'cuvées.',
    subtitle: 'Languedoc · Rhône · Bordeaux · Provence · Bourgogne',
    label: '02',
  },
  {
    image: 'https://www.maisonlauze.com/img/cms/PHOTO%20CAMION.png',
    left: 'Deux',
    right: 'boutiques.',
    subtitle: 'Florac & Mende · Lozère · Au cœur des Cévennes',
    label: '03',
  },
];

// ── Reduced Motion Toggle Component ────────────────────────────────────────────
function ReducedMotionToggle() {
  const { reducedMotion, toggleReducedMotion } = useReducedMotionContext();
  
  return (
    <button
      onClick={toggleReducedMotion}
      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-[0.1em] uppercase transition-all hover:bg-white/10"
      style={{
        fontFamily: F.ui,
        background: reducedMotion ? 'rgba(107,29,88,0.3)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${reducedMotion ? 'rgba(107,29,88,0.6)' : 'rgba(255,255,255,0.1)'}`,
        color: reducedMotion ? '#c47ab8' : 'rgba(255,255,255,0.6)',
        transition: 'all 0.3s ease',
      }}
      aria-pressed={reducedMotion}
      aria-label={reducedMotion ? 'Activer les animations' : 'Réduire les animations'}
      title={reducedMotion ? 'Activer les animations' : 'Réduire les animations'}
    >
      <Zap className="w-3.5 h-3.5" style={{ fill: reducedMotion ? '#c47ab8' : 'none' }} />
      {reducedMotion ? 'Animations réduites' : 'Réduire les animations'}
    </button>
  );
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollStageRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);
  
  // Récupérer la préférence reduced-motion
  const { reducedMotion } = useReducedMotionContext();

  useEffect(() => {
    if (!loaded) return;
    const ctx = gsap.context(() => {
      // En mode reduced-motion, utiliser gsap.set() pour afficher directement sans animation
      if (reducedMotion) {
        // Révéler immédiatement tous les éléments sans animation
        gsap.utils.toArray<HTMLElement>('.reveal-clip').forEach((el) => {
          gsap.set(el, { clipPath: 'inset(0 0 0% 0)', opacity: 1 });
        });
        gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
          gsap.set(el, { opacity: 1, y: 0 });
        });
        
        // Pas de parallaxe en mode reduced-motion
        gsap.set('.hero-parallax', { yPercent: 0 });
        
        // Panels de chapitres visibles sans animation
        const panels = gsap.utils.toArray<HTMLElement>('.ch-panel');
        panels.forEach((p) => gsap.set(p, { opacity: 1, yPercent: 0 }));
        
        return;
      }

      // Animations normales
      gsap.utils.toArray<HTMLElement>('.reveal-clip').forEach((el) => {
        gsap.fromTo(el,
          { clipPath: 'inset(0 0 100% 0)', opacity: 1 },
          { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%' } }
        );
      });
      gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: Number(el.dataset.delay ?? 0), scrollTrigger: { trigger: el, start: 'top 85%' } }
        );
      });

      // ── Depth layers parallax for "Notre Histoire" section ───────────────
      const historySection = document.getElementById('histoire');
      const historyTitle = document.querySelector('.history-title');
      
      if (historySection && historyTitle) {
        // Title moves faster (parallax speed = 0.6)
        gsap.to(historyTitle, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: historySection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
      gsap.to('.hero-parallax', {
        yPercent: 18, ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true },
      });

      // ── Scroll-pinned chapters ─────────────────────────────────────────
      const panels = gsap.utils.toArray<HTMLElement>('.ch-panel');
      panels.forEach((p, i) => gsap.set(p, { opacity: i === 0 ? 1 : 0, yPercent: i === 0 ? 0 : 12 }));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollStageRef.current,
          pin: true,
          start: 'top top',
          end: `+=${(panels.length - 1) * 100}vh`,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      panels.forEach((panel, i) => {
        if (i === panels.length - 1) return;
        const next = panels[i + 1];
        tl.to(panel.querySelectorAll('.ch-t'), { opacity: 0, y: -28, duration: 0.3, stagger: 0.05, ease: 'power2.in' }, i)
          .to(panel.querySelector('.ch-img'), { opacity: 0, scale: 0.9, duration: 0.35, ease: 'power2.in' }, i)
          .to(panel, { opacity: 0, duration: 0.1 }, i + 0.38)
          .fromTo(next, { opacity: 0, yPercent: 12 }, { opacity: 1, yPercent: 0, duration: 0.1 }, i + 0.4)
          .fromTo(next.querySelector('.ch-img'), { opacity: 0, scale: 0.88, y: 35 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }, i + 0.44)
          .fromTo(next.querySelectorAll('.ch-t'), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out' }, i + 0.48);
      });
    }, containerRef);
    return () => ctx.revert();
  }, [loaded, reducedMotion]);

  return (
    <>
      <Loader onDone={handleLoaded} />
      <CustomCursor />
      <ScrollProgress />
      <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} wines={featuredWines} />
      <ExitIntentDrawer />

      <div ref={containerRef} className="min-h-screen bg-black text-white overflow-x-hidden"
        style={{ fontFamily: F.ui, opacity: loaded ? 1 : 0, transition: reducedMotion ? 'none' : 'opacity 0.4s ease' }}>

        {/* ── Navigation ────────────────────────────────────────────────────── */}
        <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-10 py-5 flex justify-between items-center"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 100%)' }}>
          <div className="flex items-center gap-3">
            <img src="https://www.maisonlauze.com/img/maison-lauze-logo-1594800185.jpg"
              alt="Maison Lauze" className="h-8 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Vins', 'Spiritueux', 'Champagnes', 'Bio', 'Nos Boutiques', 'Notre Histoire'].map((item) => (
              <a key={item} href="#"
                className="relative text-xs tracking-[0.15em] uppercase text-white/55 hover:text-white transition-colors group"
                style={{ fontFamily: F.ui }}>
                {item}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                  style={{ background: C.light }} />
              </a>
            ))}
            <a href="https://www.maisonlauze.com" target="_blank" rel="noopener"
              className="flex items-center gap-2 px-5 py-2 rounded-full text-xs tracking-[0.15em] uppercase border border-white/20 hover:bg-white/10 transition-all"
              style={{ fontFamily: F.ui }}>
              <ShoppingBag className="w-3.5 h-3.5" /> Boutique
            </a>
          </div>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8"
            style={{ background: 'rgba(10,1,8,0.97)', backdropFilter: reducedMotion ? 'none' : 'blur(20px)' }}>
            <button className="absolute top-5 right-6" onClick={() => setMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
            {['Vins', 'Spiritueux', 'Champagnes', 'Bio', 'Nos Boutiques', 'Notre Histoire'].map((item, i) => (
              <a key={item} href="#" onClick={() => setMenuOpen(false)}
                className="text-4xl font-light text-white/80 hover:text-white transition-colors"
                style={{ fontFamily: F.display, animationDelay: `${i * 0.07}s` }}>
                {item}
              </a>
            ))}
          </div>
        )}

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <WavyBackground
          containerClassName="hero-section"
          className="w-full text-center px-6"
          blur={16}
          speed="slow"
          waveOpacity={0.48}
          colors={['#3a0a2e', '#6a1d58', '#7d2468', '#4a1040', '#551648']}
          backgroundFill="#000000"
        >
          {/* Champagne bubbles effect - positioned between wave background and content */}
          <ChampagneBubbles />
          
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.12]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '256px 256px',
            }} />

          <div className="hero-parallax relative z-10 flex flex-col items-center gap-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs tracking-[0.25em] uppercase mb-2"
              style={{ fontFamily: F.ui, borderColor: 'rgba(107,29,88,0.7)', background: 'rgba(58,10,46,0.4)', color: '#c47ab8' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.light }} />
              Fondée en 1886 · Lozère, France
            </div>

            <h1 className="text-[clamp(3.5rem,12vw,9rem)] font-light leading-[0.88]"
              style={{ fontFamily: F.display, letterSpacing: '-0.02em', textShadow: `0 0 80px rgba(107,29,88,0.4)` }}>
              MAISON
              <em className="block not-italic" style={{ color: '#c47ab8' }}>Lauze</em>
            </h1>

            <p className="text-white/40 text-xs md:text-sm tracking-[0.3em] uppercase mt-3" style={{ fontFamily: F.ui }}>
              Vins · Champagnes · Spiritueux · Depuis 1886
            </p>

            {/* Seasonal copy */}
            <p className="text-white/55 text-sm md:text-base max-w-md mx-auto leading-[1.7]"
              style={{ fontFamily: F.display, fontStyle: 'italic' }}>
              {seasonalCopy}
            </p>

            <div className="mt-10 flex items-center gap-6">
              <MagneticButton
                href="https://www.maisonlauze.com"
                target="_blank"
                rel="noopener"
                className="magnetic-button group flex items-center gap-3 px-7 py-3.5 rounded-full text-sm tracking-[0.1em] uppercase"
                data-cursor="magnetic"
                style={{ fontFamily: F.ui, background: `linear-gradient(135deg, ${C.dark}, ${C.primary})`, boxShadow: `0 8px 30px -6px rgba(107,29,88,0.6)` }}
              >
                Découvrir la sélection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                  style={{ transition: reducedMotion ? 'none' : undefined }}
                />
              </MagneticButton>
              <MagneticButton
                onClick={() => setQuizOpen(true)}
                className="magnetic-button group flex items-center gap-2 px-5 py-3 rounded-full text-xs tracking-[0.15em] uppercase border border-white/20 hover:bg-white/5 hover:border-white/40 transition-all"
                data-cursor="magnetic"
                style={{ fontFamily: F.ui }}
                strength={0.35}
              >
                <Star className="w-3.5 h-3.5" />
                Le Quiz Caviste
              </MagneticButton>
            </div>

            <div className="mt-12 flex flex-col items-center gap-2 text-white/20">
              <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
            </div>
          </div>
        </WavyBackground>

        {/* ── MARQUEE 1 ──────────────────────────────────────────────────────── */}
        <Marquee />

        {/* ── SECTION: Scroll-pinned chapters ──────────────────────────────── */}
        <div ref={scrollStageRef} className="relative h-screen overflow-hidden" style={{ background: '#04000a' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 55% 50% at 50% 50%, rgba(107,29,88,0.16) 0%, transparent 70%)` }} />
          <TufeauTexture />

          {chapters.map((ch, idx) => (
            <div key={idx} className="ch-panel absolute inset-0 flex flex-col items-center justify-center">
              <div className="ch-t absolute top-24 right-8 md:right-16 flex items-center gap-3">
                <span className="text-white/20 text-xs tracking-widest" style={{ fontFamily: F.ui }}>{ch.label} / 0{chapters.length}</span>
                <div className="w-10 h-px bg-white/10" />
              </div>

              <div className="flex items-center gap-8 md:gap-20 px-6 flex-wrap justify-center">
                <span className="ch-t text-[clamp(3rem,8vw,6rem)] font-light text-white/80"
                  style={{ fontFamily: F.display, letterSpacing: '-0.02em' }}>
                  {ch.left}
                </span>

                <div className="ch-img relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-2xl z-10 pointer-events-none mix-blend-multiply"
                    style={{ background: `linear-gradient(160deg, rgba(107,29,88,0.3), transparent 60%)` }} />
                  <div className="absolute inset-0 rounded-2xl z-10 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <img src={ch.image} alt={ch.right}
                    className="w-56 md:w-80 h-40 md:h-56 object-cover rounded-2xl"
                    style={{ boxShadow: `0 30px 80px -10px rgba(107,29,88,0.55), 0 10px 30px -5px rgba(0,0,0,0.9)` }} />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {chapters.map((_, i) => (
                      <div key={i} className="h-0.5 rounded-full"
                        style={{ width: i === idx ? '24px' : '6px', background: i === idx ? C.primary : 'rgba(255,255,255,0.15)' }} />
                    ))}
                  </div>
                </div>

                <em className="ch-t not-italic text-[clamp(3rem,8vw,6rem)] font-light"
                  style={{ fontFamily: F.display, letterSpacing: '-0.02em', color: '#c47ab8', fontStyle: 'italic' }}>
                  {ch.right}
                </em>
              </div>

              <p className="ch-t absolute bottom-20 left-1/2 -translate-x-1/2 text-center text-white/35 text-xs md:text-sm tracking-[0.22em] uppercase whitespace-nowrap"
                style={{ fontFamily: F.ui }}>
                {ch.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* ── SECTION: Chiffres clés ─────────────────────────────────────────── */}
        <section className="relative py-20 px-6 bg-[#040002] overflow-hidden">
          <TufeauTexture />
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCounter value={1886} label="année de fondation" reducedMotion={reducedMotion} />
            <StatCounter value={6} label="générations" reducedMotion={reducedMotion} />
            <StatCounter value={469} label="vins en catalogue" reducedMotion={reducedMotion} />
            <StatCounter value={130} suffix="+" label="ans d'histoire" reducedMotion={reducedMotion} />
          </div>
        </section>

        {/* ── SECTION: Notre Histoire ────────────────────────────────────────── */}
        <section id="histoire" className="relative py-28 px-6 bg-neutral-950 overflow-hidden">
          <TufeauTexture />
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-20 space-y-4">
              <div className="reveal-up flex items-center justify-center gap-3">
                <Clock className="w-5 h-5" style={{ color: C.light }} />
                <span className="text-xs tracking-[0.25em] uppercase" style={{ fontFamily: F.ui, color: C.light }}>Notre Héritage</span>
              </div>
              <h2 className="history-title reveal-up text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.05]"
                style={{ fontFamily: F.display, letterSpacing: '-0.02em' }} data-delay="0.1">
                Six générations<br /><em style={{ color: '#c47ab8' }}>au service du vin</em>
              </h2>
              <p className="reveal-up text-white/50 max-w-2xl mx-auto text-lg leading-[1.8]" data-delay="0.15">
                En 1885, Louis Lauze ouvre une auberge relais pour les diligences à Saint-Privat-de-Vallongue, Lozère.
                Ce qu'il appelle "Tantusse" devient le berceau d'une saga familiale de plus de 130 ans.
              </p>
            </div>

            {/* Family photo with parallax */}
            <div className="reveal-clip mb-20 rounded-2xl overflow-hidden max-w-4xl mx-auto">
              <ParallaxImage
                src="https://www.maisonlauze.com/img/cms/PHOTO%20GENERATION%202.jpeg"
                alt="6 générations Maison Lauze"
                className="w-full h-72 md:h-96 rounded-2xl"
                speed={0.3}
              />
            </div>

            {/* Timeline vertical animated */}
            <Timeline data={timeline.map(item => ({
              title: item.year,
              content: (
                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-white/90" style={{ fontFamily: F.ui }}>
                    {item.title}
                  </h4>
                  <p className="text-sm text-white/60 leading-relaxed" style={{ fontFamily: F.ui }}>
                    {item.text}
                  </p>
                </div>
              ),
            }))} />
          </div>
        </section>

        {/* ── SECTION: Nos Vins (featured) ───────────────────────────────────── */}
        <section className="relative py-28 px-6 bg-black overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-3">
                <div className="reveal-up flex items-center gap-3">
                  <Star className="w-5 h-5" style={{ color: C.light }} />
                  <span className="text-xs tracking-[0.25em] uppercase" style={{ fontFamily: F.ui, color: C.light }}>Sélection</span>
                </div>
                <h2 className="reveal-up text-[clamp(2.5rem,5vw,4.5rem)] font-light"
                  style={{ fontFamily: F.display, letterSpacing: '-0.02em' }} data-delay="0.1">
                  Nos coups de cœur
                </h2>
              </div>
              <a href="https://www.maisonlauze.com/12-vins" target="_blank" rel="noopener"
                className="reveal-up flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group"
                style={{ fontFamily: F.ui }}>
                Voir les 469 vins <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                  style={{ transition: reducedMotion ? 'none' : undefined }}
                />
              </a>
            </div>

            {/* Horizontal scroll wine cards */}
            <div className="flex gap-5 overflow-x-auto pb-4" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
              {featuredWines.map((wine, i) => {
                const age = new Date().getFullYear() - wine.vintage;
                return (
                  <TiltCard key={i}
                    className="wine-card flex-shrink-0 w-64 rounded-2xl overflow-hidden group cursor-pointer"
                    data-cursor="wine"
                    reducedMotion={reducedMotion}
                    style={{ scrollSnapAlign: 'start', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {/* Image + hover poem overlay */}
                    <div className="relative h-64 overflow-hidden">
                      <img src={wine.image} alt={wine.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        style={{ transition: reducedMotion ? 'none' : undefined }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {/* Poem overlay — clip-path curtain wipe on hover */}
                      <div
                        className="absolute inset-0 flex items-end p-4 z-20"
                        style={{
                          background: 'linear-gradient(to top, rgba(10,0,8,0.95) 60%, rgba(10,0,8,0.6))',
                          clipPath: 'inset(100% 0 0 0)',
                          transition: reducedMotion ? 'none' : 'clip-path 0.5s cubic-bezier(0.76,0,0.24,1)',
                        }}
                        onMouseEnter={e => !reducedMotion && (e.currentTarget.style.clipPath = 'inset(0% 0 0 0)')}
                        onMouseLeave={e => e.currentTarget.style.clipPath = 'inset(100% 0 0 0)'}
                      >
                        <p className="text-white/90 text-sm leading-[1.65]"
                          style={{ fontFamily: F.display, fontStyle: 'italic' }}>
                          "{wine.poem}"
                        </p>
                      </div>

                      {wine.badge && (
                        <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full z-10"
                          style={{ fontFamily: F.ui, background: wine.badge.includes('Bio') ? 'rgba(80,120,0,0.85)' : `rgba(107,29,88,0.85)`, color: '#fff' }}>
                          {wine.badge}
                        </span>
                      )}
                      <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-md bg-black/50 text-white/70 z-10"
                        style={{ fontFamily: F.ui }}>
                        {wine.type}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      {/* Millésime clock */}
                      <p className="text-xs mb-2 italic" style={{ fontFamily: F.display, color: 'rgba(196,122,184,0.7)' }}>
                        Millésime {wine.vintage} — {age} {age > 1 ? 'ans' : 'an'} de patience
                      </p>
                      <p className="text-xs tracking-[0.15em] uppercase mb-1" style={{ fontFamily: F.ui, color: C.light }}>{wine.region}</p>
                      <p className="text-lg font-light mb-0.5" style={{ fontFamily: F.display }}>{wine.name}</p>
                      <p className="text-sm text-white/50 mb-3" style={{ fontFamily: F.ui }}>{wine.cuvee}</p>
                      <p className="text-xs text-white/30 mb-4" style={{ fontFamily: F.ui }}>{wine.grapes}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-light" style={{ fontFamily: F.display, color: '#c47ab8' }}>{wine.price}</span>
                        <MagneticButton
                          href="https://www.maisonlauze.com"
                          target="_blank"
                          rel="noopener"
                          className="magnetic-button p-2 rounded-full hover:scale-110 transition-transform"
                          data-cursor="magnetic"
                          style={{ background: `rgba(107,29,88,0.4)` }}
                          strength={0.6}
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </MagneticButton>
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── MARQUEE 2 ─────────────────────────────────────────────────────── */}
        <Marquee reverse />

        {/* ── SECTION: Nos Régions ────────────────────────────────────────── */}
        <section className="relative py-28 px-6 bg-neutral-950 overflow-hidden">
          <TufeauTexture />
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <div className="reveal-up flex items-center justify-center gap-3">
                <MapPin className="w-5 h-5" style={{ color: C.light }} />
                <span className="text-xs tracking-[0.25em] uppercase" style={{ fontFamily: F.ui, color: C.light }}>Nos Régions</span>
              </div>
              <h2 className="reveal-up text-[clamp(2.5rem,5vw,4.5rem)] font-light"
                style={{ fontFamily: F.display, letterSpacing: '-0.02em' }} data-delay="0.1">
                La France entière<br /><em style={{ color: '#c47ab8' }}>dans vos verres</em>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {regions.map((r, i) => (
                <TiltCard key={i}
                  className="reveal-up p-6 rounded-2xl text-center group cursor-pointer"
                  reducedMotion={reducedMotion}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', transition: reducedMotion ? 'none' : 'border-color 0.3s' } as React.CSSProperties}>
                  <div className="text-3xl mb-3">{r.icon}</div>
                  <p className="text-sm font-medium text-white/80 mb-1" style={{ fontFamily: F.ui }}>{r.name}</p>
                  <p className="text-xs" style={{ color: C.light, fontFamily: F.ui }}>{r.count} vins</p>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION: Bio & Nature ──────────────────────────────────────── */}
        <section className="relative py-28 px-6 bg-[#040002] overflow-hidden">
          <TufeauTexture />
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="reveal-clip flex-1 rounded-2xl overflow-hidden">
                <img src="https://www.maisonlauze.com/img/cms/bio.jpg"
                  alt="Vins Bio Maison Lauze"
                  className="w-full h-80 md:h-[450px] object-cover" />
              </div>
              <div className="flex-1 space-y-6">
                <div className="reveal-up flex items-center gap-3">
                  <Leaf className="w-5 h-5" style={{ color: '#7aab2e' }} />
                  <span className="text-xs tracking-[0.25em] uppercase" style={{ fontFamily: F.ui, color: '#7aab2e' }}>Agriculture Biologique</span>
                </div>
                <h2 className="reveal-up text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.05]"
                  style={{ fontFamily: F.display, letterSpacing: '-0.02em' }} data-delay="0.1">
                  Engagés pour<br /><em style={{ color: '#a8c73a' }}>la nature</em>
                </h2>
                <p className="reveal-up text-white/60 text-lg leading-[1.8]" data-delay="0.15">
                  Maison Lauze propose une large sélection de vins certifiés Agriculture Biologique.
                  Des domaines engagés, des vignobles respectueux, des vins qui racontent un terroir
                  préservé — parce que la qualité commence dans les vignes.
                </p>
                <div className="reveal-up space-y-3" data-delay="0.2">
                  {[
                    'Certification AB Agriculture Biologique',
                    'Domaines en conversion biologique',
                    'Vins nature sans intrants',
                    'Sélection curative élargie chaque saison',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-white/60">
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#7aab2e' }} />
                      {item}
                    </div>
                  ))}
                </div>
                <a href="https://www.maisonlauze.com/35-bio" target="_blank" rel="noopener"
                  className="reveal-up inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full text-sm tracking-[0.1em] uppercase group"
                  style={{ fontFamily: F.ui, background: 'rgba(100,160,30,0.2)', border: '1px solid rgba(100,160,30,0.4)' }} data-delay="0.25">
                  Voir la sélection Bio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                    style={{ transition: reducedMotion ? 'none' : undefined }}
                  />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION: Nos Boutiques ─────────────────────────────────────────── */}
        <section className="relative py-28 px-6 bg-neutral-950 overflow-hidden">
          <TufeauTexture />
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <div className="reveal-up flex items-center justify-center gap-3">
                <MapPin className="w-5 h-5" style={{ color: C.light }} />
                <span className="text-xs tracking-[0.25em] uppercase" style={{ fontFamily: F.ui, color: C.light }}>En Lozère</span>
              </div>
              <h2 className="reveal-up text-[clamp(2.5rem,5vw,4.5rem)] font-light"
                style={{ fontFamily: F.display, letterSpacing: '-0.02em' }} data-delay="0.1">
                Nos <em style={{ color: '#c47ab8' }}>boutiques</em>
              </h2>
              <p className="reveal-up text-white/50 max-w-xl mx-auto text-lg leading-[1.8]" data-delay="0.15">
                Deux caves à l'âme cévenole, tenues avec passion.
                Venez à la rencontre de nos cavistes pour une dégustation et des conseils sur mesure.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {stores.map((store, i) => (
                <TiltCard key={i}
                  className="rounded-2xl overflow-hidden group cursor-pointer"
                  reducedMotion={reducedMotion}
                  style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img src={store.image} alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      style={{ transition: reducedMotion ? 'none' : undefined }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 opacity-30 mix-blend-multiply"
                      style={{ background: `linear-gradient(160deg, ${C.primary}, transparent)` }} />
                    <div className="absolute bottom-4 left-5">
                      <p className="text-xl font-light" style={{ fontFamily: F.display }}>{store.name}</p>
                      <p className="text-xs tracking-[0.2em] uppercase text-white/60" style={{ fontFamily: F.ui }}>{store.location}</p>
                    </div>
                  </div>
                  {/* Details */}
                  <div className="p-6 space-y-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-sm text-white/55 flex items-start gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.light }} />
                      {store.address}
                    </p>
                    <p className="text-sm text-white/55 flex items-start gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.light }} />
                      {store.hours}
                    </p>
                    <p className="text-sm text-white/55">
                      <span className="text-white/30" style={{ fontFamily: F.ui }}>Caviste : </span>
                      {store.caviste}
                    </p>
                    <p className="text-sm font-medium" style={{ color: C.light, fontFamily: F.ui }}>
                      ☎ {store.phone}
                    </p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* ── MARQUEE 3 ─────────────────────────────────────────────────────── */}
        <Marquee />

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="relative py-32 px-6 overflow-hidden flex items-center justify-center min-h-[70vh]">
          {/* Background: dark plum radial */}
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(107,29,88,0.3) 0%, transparent 70%)`,
          }} />
          <TufeauTexture />

          <div className="relative z-10 text-center max-w-3xl space-y-7">
            <div className="reveal-up w-14 h-14 mx-auto rounded-full flex items-center justify-center"
              style={{ background: `rgba(107,29,88,0.3)`, border: `1px solid rgba(107,29,88,0.6)` }}>
              <ShoppingBag className="w-6 h-6" style={{ color: '#c47ab8' }} />
            </div>
            <h2 className="reveal-up text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.0]"
              style={{ fontFamily: F.display, letterSpacing: '-0.02em' }} data-delay="0.1">
              Plus de <em style={{ color: '#c47ab8' }}>469 vins</em><br />
              vous attendent
            </h2>
            <p className="reveal-up text-white/55 text-lg leading-[1.8]" data-delay="0.15">
              Languedoc, Rhône, Bordeaux, Provence, Bourgogne, Alsace, Loire…
              Chaque bouteille est choisie avec passion par 6 générations de cavistes.
            </p>
            <div className="reveal-up flex flex-col sm:flex-row gap-4 justify-center pt-2" data-delay="0.2">
              <MagneticButton
                href="https://www.maisonlauze.com"
                target="_blank"
                rel="noopener"
                className="magnetic-button group px-8 py-4 rounded-full text-sm tracking-[0.1em] uppercase flex items-center justify-center gap-3"
                data-cursor="magnetic"
                style={{ fontFamily: F.ui, background: `linear-gradient(135deg, ${C.dark}, ${C.primary})`, boxShadow: `0 8px 30px -6px rgba(107,29,88,0.6)` }}
              >
                Visiter la boutique
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                  style={{ transition: reducedMotion ? 'none' : undefined }}
                />
              </MagneticButton>
              <MagneticButton
                onClick={() => setQuizOpen(true)}
                className="magnetic-button group px-8 py-4 rounded-full text-sm tracking-[0.1em] uppercase border border-white/20 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                data-cursor="magnetic"
                style={{ fontFamily: F.ui }}
              >
                <Sparkles className="w-4 h-4" style={{ color: C.light }} />
                Trouver mon vin
              </MagneticButton>
            </div>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <footer className="relative bg-black py-14 px-6 border-t overflow-hidden"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <TufeauTexture />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
              {/* Logo */}
              <div className="flex flex-col gap-4 max-w-xs">
                <img src="https://www.maisonlauze.com/img/maison-lauze-logo-1594800185.jpg"
                  alt="Maison Lauze" className="h-10 object-contain object-left"
                  style={{ filter: 'brightness(0) invert(1)' }} />
                <p className="text-sm text-white/40 leading-[1.7]">
                  La Rivière, 48240 Saint-Privat-de-Vallongue<br />
                  contact@maisonlauze.com · 04 66 48 53 04
                </p>
                <div className="flex gap-3">
                  <a href="https://www.facebook.com/maisonlauze" target="_blank" rel="noopener"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors text-xs"
                    style={{ border: '1px solid rgba(255,255,255,0.15)' }}>f</a>
                  <a href="https://www.instagram.com/maisonlauze/" target="_blank" rel="noopener"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors text-xs"
                    style={{ border: '1px solid rgba(255,255,255,0.15)' }}>ig</a>
                </div>
              </div>
              {/* Links */}
              <div className="grid grid-cols-2 gap-x-16 gap-y-3">
                {['Vins', 'Champagnes', 'Spiritueux', 'Bières', 'Épicerie fine', 'Bio', 'Notre Histoire', 'Nos Boutiques', 'Contact'].map((item) => (
                  <a key={item} href="#"
                    className="text-xs tracking-[0.12em] uppercase text-white/35 hover:text-white transition-colors"
                    style={{ fontFamily: F.ui }}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-xs text-white/25 tracking-widest" style={{ fontFamily: F.ui }}>
                © 2025 Maison Lauze · LAUZE BOISSONS SAS · Fondée en 1886
              </p>
              <div className="flex items-center gap-4">
                {/* Toggle réduire les animations */}
                <ReducedMotionToggle />
                <p className="text-xs text-white/20" style={{ fontFamily: F.ui }}>
                  L'abus d'alcool est dangereux pour la santé
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
