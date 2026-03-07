import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, X, Menu, ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import { ParallaxImage } from '@/components/ParallaxImage';
import { Magnetic } from '@/components/Magnetic';
import { Loader } from '@/components/Loader';
import { CustomCursor } from '@/components/CustomCursor';
import { Marquee } from '@/components/Marquee';
import { SmoothScroll } from '@/components/SmoothScroll';
import { FilmGrain } from '@/components/FilmGrain';
import { EnhancedTextReveal } from '@/components/EnhancedTextReveal';
import { WineCard } from '@/components/WineCard';
import { Accordion } from '@/components/Accordion';
import { TerroirParallax } from '@/components/TerroirParallax';
import { ProcessSteps } from '@/components/ProcessSteps';
import { Awards } from '@/components/Awards';
import { Newsletter } from '@/components/Newsletter';
import { ScrollProgress } from '@/components/ScrollProgress';
import { Hero21st } from '@/components/Hero21st';
import { useAudio } from '@/context/AudioContext';

gsap.registerPlugin(ScrollTrigger);

// Typography
const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  ui: "'Inter', -apple-system, sans-serif",
};

// Colors - Loire Crépuscule (plus clair/chaud)
const C = {
  bg: '#121418',
  bgElevated: '#1A1E24',
  text: '#F5F0EB',
  textMuted: 'rgba(245,240,235,0.55)',
  accent: '#8B5A6B',
  accentLight: '#D4A574',
  gold: '#B8956B',
};

// Data
const featuredWines = [
  { name: 'Ma Cuvée DOR', cuvee: 'Sables & graviers', appellation: 'AOP Saint-Nicolas-de-Bourgueil', price: '10,80 €', vintage: 2023, image: 'https://assets.evolusite.fr/3/Ma_Cuvée_d_Or_PmEbKNgI6.jpg', badge: 'Accessible', poem: 'Fruits rouges éclatants, légèreté sableuse.' },
  { name: 'Cuvée Estelle', cuvee: 'Sablonneux · fruité', appellation: 'AOP Saint-Nicolas-de-Bourgueil', price: '11,30 €', vintage: 2024, image: 'https://assets.evolusite.fr/3/Estelle-removebg-preview_AgfXXrabx.png', poem: "Fruité, frais, équilibré — l'âme du Saint-Nicolas." },
  { name: 'Les Malgagnes', cuvee: 'Argilo-siliceux', appellation: 'AOP Saint-Nicolas-de-Bourgueil', price: '14,00 €', vintage: 2020, image: 'https://assets.evolusite.fr/3/n6uskwu0wt7roib1nj6qns_j1c2qvoS0.png', badge: 'Coup de cœur', poem: "Fin, complexe, élégant — l'ADN de la famille." },
  { name: 'Les Tuffes', cuvee: 'Argilo-calcaire', appellation: 'AOP Bourgueil', price: '11,30 €', vintage: 2021, image: 'https://assets.evolusite.fr/3/nurx6fwvk2rpgq93bft9s7q_HgtSjCUlH.png', poem: 'Caractère viril, rondeur sur le tuffeau.' },
  { name: 'Caudalies', cuvee: '12–18 mois en fûts', appellation: 'AOP Bourgueil', price: '18,00 €', vintage: 2021, image: 'https://assets.evolusite.fr/3/Caudalies__2__Zn9svhsus.jpg', badge: 'Prestige', poem: 'Vendange manuelle, élevage en barriques.' },
];

const timeline = [
  { year: '1973', title: 'Les débuts', text: 'Lydie & Max Cognard fondent le domaine avec 1 hectare de Cabernet Franc.' },
  { year: '1985', title: 'Expansion', text: 'Construction de la cave climatisée. Le domaine atteint 7 hectares.' },
  { year: '1997', title: 'Transmission', text: 'Estelle rejoint le domaine familial.' },
  { year: '2001', title: 'Nouveau caveau', text: 'Rodolphe rejoint à son tour. Création du caveau de dégustation.' },
  { year: '2013', title: 'Reprise', text: 'La 2e génération prend officiellement les rênes.' },
  { year: '2020', title: 'Certification', text: 'Agriculture Biologique certifiée après 4 ans de conversion.' },
];

const vignerons = [
  { name: 'Estelle Cognard', role: 'Vigneronne', generation: '2ème génération', image: 'https://assets.evolusite.fr/ik-seo/3/estelle-et-rodolphe-maison-cognard.JPG' },
  { name: 'Rodolphe Cognard', role: 'Vinificateur', generation: '2ème génération', image: 'https://assets.evolusite.fr/ik-seo/3/estelle-et-rodolphe-maison-cognard.JPG' },
  { name: 'Flavien Cognard', role: 'Vigneron', generation: '3ème génération', image: 'https://assets.evolusite.fr/ik-seo/3/img_4750_6EbPVDf59/img_4750_6EbPVDf59.jpg' },
];

const faqItems = [
  { question: 'Où puis-je acheter vos vins ?', answer: 'Vous pouvez acheter directement au caveau de dégustation à Saint-Nicolas-de-Bourgueil, sur notre boutique en ligne, ou nous retrouver dans les salons de vin en France.' },
  { question: 'Proposez-vous des visites de cave ?', answer: 'Oui, nous proposons des visites guidées du vignoble et de la cave sur rendez-vous. La dégustation est bien sûr incluse ! Contactez-nous au 02 47 97 76 88.' },
  { question: 'Quelle est la température idéale de service ?', answer: 'Nos vins rouges se servent entre 14°C et 18°C selon les cuvées. Les plus légers (Ma Cuvée DOR, Estelle) vers 14-16°C, les plus structurés (Caudalies) vers 16-18°C.' },
  { question: 'Livrez-vous à l\'international ?', answer: 'Pour le moment, nous livrons uniquement en France métropolitaine. Pour les expéditions à l\'étranger, contactez-nous directement pour étudier les possibilités.' },
  { question: 'Quel est le potentiel de garde de vos vins ?', answer: 'Il varie selon les cuvées : de 3-5 ans pour les plus accessibles (Ma Cuvée DOR) jusqu\'à 10-15 ans pour les cuvées prestige élevées en barriques (Caudalies).' }
];

const QUIZ_QUESTIONS = [
  { question: 'Pour quelle occasion ?', options: [
    { label: "Cadeau d'exception", icon: '🎁', scores: [0,2,2,1,2] },
    { label: 'Dîner romantique', icon: '🕯️', scores: [0,2,1,2,1] },
    { label: 'Apéro entre amis', icon: '🥂', scores: [2,1,0,1,0] },
    { label: 'Dégustation solo', icon: '🍷', scores: [0,1,2,1,2] },
  ]},
  { question: 'Quel style préférez-vous ?', options: [
    { label: 'Rouge puissant', icon: '🌑', scores: [0,1,2,1,2] },
    { label: 'Rouge léger', icon: '🍒', scores: [2,1,0,1,0] },
    { label: 'Rosé/Pétillant', icon: '🌸', scores: [1,1,0,0,0] },
    { label: 'Surprenez-moi', icon: '✨', scores: [1,2,2,2,2] },
  ]},
  { question: 'Votre budget ?', options: [
    { label: 'Moins de 12 €', icon: '💚', scores: [3,2,0,2,0] },
    { label: '12 — 15 €', icon: '💜', scores: [0,1,2,1,0] },
    { label: '15 € et plus', icon: '🌟', scores: [0,0,1,0,3] },
    { label: 'Sans limite', icon: '♾️', scores: [0,1,2,1,2] },
  ]},
  { question: 'Votre terroir ?', options: [
    { label: 'Sables', icon: '🏖️', scores: [2,2,0,0,0] },
    { label: 'Argile', icon: '🪨', scores: [0,0,1,2,2] },
    { label: 'Barrique', icon: '🪣', scores: [0,0,2,0,3] },
    { label: 'Je découvre', icon: '🔭', scores: [1,2,2,1,2] },
  ]},
];

function QuizModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState([0, 0, 0, 0, 0]);
  const [done, setDone] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { playClick } = useAudio();

  useEffect(() => {
    const panel = panelRef.current;
    if (panel) {
      gsap.fromTo(panel, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' });
    }
  }, []);

  const pick = (optScores: number[]) => {
    playClick();
    const next = scores.map((s, i) => s + optScores[i]);
    setScores(next);
    if (step < QUIZ_QUESTIONS.length - 1) setStep(step + 1);
    else setDone(true);
  };

  const recommended = [...featuredWines].map((w, i) => ({ ...w, score: scores[i] })).sort((a, b) => (b as any).score - (a as any).score).slice(0, 3);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(18,20,24,0.95)', backdropFilter: 'blur(20px)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div ref={panelRef} className="relative w-full max-w-xl rounded-2xl overflow-hidden" style={{ background: C.bgElevated, border: '1px solid rgba(139,90,107,0.2)' }}>
        <button className="absolute top-6 right-6 z-10 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all" onClick={() => { playClick(); onClose(); }}>
          <X className="w-5 h-5" />
        </button>

        {!done ? (
          <div className="p-10 md:p-12">
            <div className="flex gap-2 mb-10">
              {QUIZ_QUESTIONS.map((_, i) => (
                <div key={i} className="h-px flex-1" style={{ background: i <= step ? C.accent : 'rgba(245,240,235,0.1)' }} />
              ))}
            </div>
            <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: C.accentLight, fontFamily: F.ui }}>
              Question {step + 1} / {QUIZ_QUESTIONS.length}
            </p>
            <h3 className="text-3xl md:text-4xl font-light mb-10" style={{ fontFamily: F.display, color: C.text }}>
              {QUIZ_QUESTIONS[step].question}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {QUIZ_QUESTIONS[step].options.map((opt, idx) => (
                <Magnetic key={idx} strength={0.1}>
                  <button onClick={() => pick(opt.scores)} className="p-6 rounded-xl text-left transition-all duration-300 hover:bg-white/5 group" style={{ background: 'rgba(245,240,235,0.03)', border: '1px solid rgba(245,240,235,0.08)' }}>
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{opt.icon}</div>
                    <p className="text-sm font-medium" style={{ color: 'rgba(245,240,235,0.8)', fontFamily: F.ui }}>{opt.label}</p>
                  </button>
                </Magnetic>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-10 md:p-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: C.accentLight, fontFamily: F.ui }}>Votre sélection</p>
            <h3 className="text-3xl font-light mb-8" style={{ fontFamily: F.display, color: C.text }}>Notre recommandation</h3>
            <div className="space-y-4 mb-8">
              {recommended.map((wine: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(245,240,235,0.03)', border: '1px solid rgba(245,240,235,0.06)' }}>
                  <img src={wine.image} alt={wine.name} className="w-14 h-20 object-contain" />
                  <div className="flex-1">
                    <p className="text-xs mb-1" style={{ color: C.accentLight, fontFamily: F.ui }}>{wine.appellation}</p>
                    <p className="font-light text-lg" style={{ fontFamily: F.display, color: C.text }}>{wine.name}</p>
                    <p className="text-xs" style={{ color: 'rgba(245,240,235,0.4)' }}>{wine.cuvee}</p>
                  </div>
                  <p className="text-xl font-light" style={{ fontFamily: F.display, color: C.accentLight }}>{wine.price}</p>
                </div>
              ))}
            </div>
            <a href="https://vins-stnicolas-bourgueil-cognard.fr/nos-cuvees" target="_blank" rel="noopener" onClick={playClick} className="block w-full py-4 rounded-xl text-sm tracking-[0.15em] uppercase text-center" style={{ fontFamily: F.ui, background: C.accent, color: C.text }}>
              Commander en ligne
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function AudioToggle() {
  const { isMuted, toggleMute, playClick } = useAudio();
  return (
    <button onClick={() => { playClick(); toggleMute(); }} className="fixed top-6 right-6 z-[300] w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: 'rgba(245,240,235,0.05)', backdropFilter: 'blur(10px)' }}>
      {isMuted ? <VolumeX className="w-4 h-4" style={{ color: C.text }} /> : <Volume2 className="w-4 h-4" style={{ color: C.text }} />}
    </button>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const { playHover, playClick } = useAudio();

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  useEffect(() => {
    if (!loaded) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal-up').forEach((el) => {
        gsap.fromTo(el, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' } });
      });
      gsap.utils.toArray<HTMLElement>('.reveal-line').forEach((el) => {
        gsap.fromTo(el, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
      });
    }, mainRef);
    return () => ctx.revert();
  }, [loaded]);

  return (
    <SmoothScroll>
      <>
        <Loader onDone={() => {}} />
        <CustomCursor />
        <FilmGrain />
        <ScrollProgress />
        <AudioToggle />
        {quizOpen && <QuizModal onClose={() => setQuizOpen(false)} />}

        <button onClick={() => { playClick(); setQuizOpen(true); }} onMouseEnter={playHover} className="fixed bottom-8 right-8 z-[280] w-16 h-16 rounded-full flex items-center justify-center group transition-transform hover:scale-110" style={{ background: C.accent, boxShadow: '0 10px 40px -10px rgba(139,90,107,0.6)' }}>
          <span className="text-2xl">🍷</span>
          <span className="absolute -top-12 right-0 bg-white text-black text-xs px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: F.ui }}>Trouvez votre vin</span>
        </button>

        <div ref={mainRef} className="min-h-screen" style={{ background: C.bg, color: C.text, fontFamily: F.ui }}>
          
          <nav className="fixed top-0 left-0 w-full z-50 px-8 md:px-16 py-6 flex justify-between items-center mix-blend-difference">
            <a href="#" onMouseEnter={playHover} onClick={playClick} className="text-sm tracking-[0.2em] uppercase font-medium" style={{ fontFamily: F.ui }}>Cognard</a>
            <div className="hidden md:flex items-center gap-12">
              {['Histoire', 'Vins', 'Vignerons', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onMouseEnter={playHover} onClick={playClick} className="text-xs tracking-[0.15em] uppercase text-white/60 hover:text-white transition-colors relative group" style={{ fontFamily: F.ui }}>
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>
            <Magnetic strength={0.2}>
              <a href="https://vins-stnicolas-bourgueil-cognard.fr" target="_blank" rel="noopener" onMouseEnter={playHover} onClick={playClick} className="hidden md:flex items-center gap-2 text-xs tracking-[0.1em] uppercase px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all" style={{ fontFamily: F.ui }}>
                Boutique <ArrowUpRight className="w-3 h-3" />
              </a>
            </Magnetic>
            <button className="md:hidden" onClick={() => { playClick(); setMenuOpen(true); }}><Menu className="w-6 h-6" /></button>
          </nav>

          {menuOpen && (
            <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8" style={{ background: C.bg }}>
              <button className="absolute top-6 right-8" onClick={() => { playClick(); setMenuOpen(false); }}><X className="w-6 h-6" /></button>
              {['Histoire', 'Vins', 'Vignerons', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => { playClick(); setMenuOpen(false); }} className="text-4xl font-light" style={{ fontFamily: F.display }}>{item}</a>
              ))}
            </div>
          )}

          <Hero21st />

          <Marquee />

          <section id="histoire" className="py-32 md:py-48 px-6 md:px-16">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
                <div>
                  <div className="reveal-line w-16 h-px mb-8" style={{ background: C.accent }} />
                  <p className="reveal-up text-xs tracking-[0.3em] uppercase mb-6" style={{ color: C.accentLight }}>Notre Histoire</p>
                  <h2 className="text-4xl md:text-6xl font-light leading-[1.1] mb-8" style={{ fontFamily: F.display }}>
                    <EnhancedTextReveal splitBy="words">50 ans de passion familiale</EnhancedTextReveal>
                  </h2>
                  <p className="reveal-up text-lg leading-relaxed mb-8" style={{ color: C.textMuted }}>
                    En 1973, Lydie et Max Cognard plantent leur premier hectare de Cabernet Franc à Saint-Nicolas-de-Bourgueil. Ce cépage unique, ces terres de tuffeau, deviendront l'héritage d'une saga familiale.
                  </p>
                  <div className="reveal-up grid grid-cols-3 gap-8">
                    {[{ num: '50+', label: 'Années' }, { num: '3', label: 'Générations' }, { num: '15', label: 'Hectares' }].map((stat) => (
                      <div key={stat.label}>
                        <p className="text-3xl md:text-4xl font-light mb-1" style={{ fontFamily: F.display, color: C.accentLight }}>{stat.num}</p>
                        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: C.textMuted, fontFamily: F.ui }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="reveal-up">
                  <ParallaxImage src="https://assets.evolusite.fr/ik-seo/3/xwgsun72vacozjglyp9yw_gqH-6nzR1/estelle-et-rodolphe-maison-cognard.JPG" alt="Famille Cognard" className="rounded-2xl aspect-[4/5]" />
                </div>
              </div>

              <div className="mt-32">
                <div className="reveal-line w-full h-px mb-16" style={{ background: 'rgba(245,240,235,0.1)' }} />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                  {timeline.map((item, i) => (
                    <div key={i} className="reveal-up">
                      <p className="text-sm tracking-[0.2em] uppercase mb-2" style={{ color: C.accentLight, fontFamily: F.ui }}>{item.year}</p>
                      <p className="text-lg font-light mb-2" style={{ fontFamily: F.display }}>{item.title}</p>
                      <p className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <TerroirParallax />
          <ProcessSteps />

          <section id="vins" className="py-32 md:py-48 px-6 md:px-16" style={{ background: C.bgElevated }}>
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
                <div>
                  <div className="reveal-line w-16 h-px mb-8" style={{ background: C.accent }} />
                  <p className="reveal-up text-xs tracking-[0.3em] uppercase mb-4" style={{ color: C.accentLight }}>Nos Cuvées</p>
                  <h2 className="text-4xl md:text-6xl font-light" style={{ fontFamily: F.display }}>
                    <EnhancedTextReveal splitBy="words">100% Cabernet Franc</EnhancedTextReveal>
                  </h2>
                </div>
                <p className="reveal-up max-w-sm mt-6 md:mt-0" style={{ color: C.textMuted }}>Cinq cuvées, cinq expressions du même cépage sur des terroirs différents.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredWines.map((wine, i) => (
                  <div key={i} className="reveal-up" onMouseEnter={playHover}>
                    <WineCard wine={wine} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Awards />

          <section id="vignerons" className="py-32 md:py-48 px-6 md:px-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <div className="reveal-line w-16 h-px mx-auto mb-8" style={{ background: C.accent }} />
                <p className="reveal-up text-xs tracking-[0.3em] uppercase mb-4" style={{ color: C.accentLight }}>La Famille</p>
                <h2 className="text-4xl md:text-6xl font-light" style={{ fontFamily: F.display }}>
                  <EnhancedTextReveal splitBy="words">Les vignerons</EnhancedTextReveal>
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {vignerons.map((v, i) => (
                  <div key={i} className="reveal-up group">
                    <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-2xl">
                      <img src={v.image} alt={v.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6">
                        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: C.accentLight, fontFamily: F.ui }}>{v.generation}</p>
                      </div>
                    </div>
                    <h3 className="text-2xl font-light mb-1" style={{ fontFamily: F.display }}>{v.name}</h3>
                    <p className="text-sm" style={{ color: C.textMuted, fontFamily: F.ui }}>{v.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-32 md:py-48 px-6 md:px-16" style={{ background: C.bgElevated }}>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: C.accentLight }}>FAQ</p>
                <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: F.display }}>
                  Questions <em className="italic" style={{ color: C.accentLight }}>fréquentes</em>
                </h2>
              </div>
              <Accordion items={faqItems} />
            </div>
          </section>

          <Newsletter />

          <section className="py-32 md:py-48 px-6 md:px-16 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${C.accent}20, transparent)` }} />
            </div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h2 className="text-4xl md:text-7xl font-light mb-8" style={{ fontFamily: F.display }}>
                <EnhancedTextReveal splitBy="words">Venez déguster au domaine</EnhancedTextReveal>
              </h2>
              <p className="reveal-up text-lg mb-12 max-w-xl mx-auto" style={{ color: C.textMuted }}>
                Caveau de dégustation ouvert toute la semaine. Découvrez nos vins au cœur du vignoble.
              </p>
              <div className="reveal-up flex flex-col sm:flex-row gap-4 justify-center">
                <Magnetic strength={0.15}>
                  <a href="https://vins-stnicolas-bourgueil-cognard.fr" target="_blank" rel="noopener" onMouseEnter={playHover} onClick={playClick} className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase" style={{ fontFamily: F.ui, background: C.accent, color: C.text }}>
                    <ShoppingBag className="w-4 h-4" /> Boutique en ligne
                  </a>
                </Magnetic>
                <Magnetic strength={0.15}>
                  <a href="https://www.instagram.com/vinscognard/" target="_blank" rel="noopener" onMouseEnter={playHover} onClick={playClick} className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase border border-white/20 hover:bg-white/10 transition-all" style={{ fontFamily: F.ui }}>
                    Instagram
                  </a>
                </Magnetic>
              </div>
            </div>
          </section>

          <footer id="contact" className="py-20 px-6 md:px-16 border-t" style={{ background: C.bg, borderColor: 'rgba(245,240,235,0.06)' }}>
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-4 gap-12 mb-16">
                <div className="md:col-span-2">
                  <p className="text-3xl font-light mb-4" style={{ fontFamily: F.display }}>Famille Cognard</p>
                  <p className="text-sm leading-relaxed max-w-sm" style={{ color: C.textMuted }}>
                    1379 route du Carroi Taveau<br />37140 Saint-Nicolas-de-Bourgueil<br />02 47 97 76 88
                  </p>
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: C.accentLight }}>Navigation</p>
                  <div className="space-y-2">
                    {['Histoire', 'Vins', 'Vignerons', 'Contact'].map((item) => (
                      <a key={item} href={`#${item.toLowerCase()}`} onMouseEnter={playHover} onClick={playClick} className="block text-sm hover:text-white transition-colors" style={{ color: C.textMuted }}>{item}</a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: C.accentLight }}>Réseaux</p>
                  <div className="space-y-2">
                    <a href="https://www.instagram.com/vinscognard/" target="_blank" rel="noopener" onMouseEnter={playHover} onClick={playClick} className="block text-sm hover:text-white transition-colors" style={{ color: C.textMuted }}>Instagram</a>
                    <a href="https://www.facebook.com/vinscognard/" target="_blank" rel="noopener" onMouseEnter={playHover} onClick={playClick} className="block text-sm hover:text-white transition-colors" style={{ color: C.textMuted }}>Facebook</a>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'rgba(245,240,235,0.06)' }}>
                <p className="text-xs tracking-widest" style={{ color: 'rgba(245,240,235,0.25)', fontFamily: F.ui }}>© 2026 Famille Cognard · Domaine viticole depuis 1973</p>
                <p className="text-xs" style={{ color: 'rgba(245,240,235,0.2)', fontFamily: F.ui }}>L'abus d'alcool est dangereux pour la santé</p>
              </div>
            </div>
          </footer>
        </div>
      </>
    </SmoothScroll>
  );
}
