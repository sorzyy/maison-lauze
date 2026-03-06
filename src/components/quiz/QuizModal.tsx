import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { X, Star, Sparkles } from 'lucide-react';
import { useReducedMotion } from '@/context/ReducedMotionContext';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface Wine {
  name: string;
  cuvee: string;
  type: string;
  region: string;
  price: string;
  grapes: string;
  vintage: number;
  image: string;
  badge?: string;
  poem: string;
}

interface QuizOption {
  label: string;
  icon: string;
  scores: number[];
}

interface QuizQuestion {
  question: string;
  sub: string;
  options: QuizOption[];
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  wines: Wine[];
}

// ── Design Tokens ──────────────────────────────────────────────────────────────
const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  ui: "'Syne', sans-serif",
};

const C = {
  primary: '#6a1d58',
  light: '#9b3a86',
  dark: '#3a0a2e',
  accent: '#bfc106',
};

// ── Quiz Data ──────────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Pour quelle occasion ?',
    sub: 'Votre caviste vous guide',
    options: [
      { label: "Cadeau d'exception", icon: '🎁', scores: [0, 2, 2, 1, 2] },
      { label: 'Dîner romantique', icon: '🕯️', scores: [0, 2, 1, 2, 1] },
      { label: 'Apéro entre amis', icon: '🥂', scores: [2, 1, 0, 1, 0] },
      { label: 'Dégustation solo', icon: '🍷', scores: [0, 1, 2, 1, 2] },
    ],
  },
  {
    question: 'Quel style préférez-vous ?',
    sub: 'Le cépage de votre âme',
    options: [
      { label: 'Rouge puissant', icon: '🌑', scores: [0, 1, 2, 1, 2] },
      { label: 'Rouge léger & fruité', icon: '🍒', scores: [2, 1, 0, 1, 0] },
      { label: 'Blanc ou rosé', icon: '🌿', scores: [1, 1, 0, 1, 0] },
      { label: 'Surprenez-moi', icon: '✨', scores: [1, 2, 2, 2, 2] },
    ],
  },
  {
    question: 'Votre budget par bouteille ?',
    sub: 'Chaque centime bien dépensé',
    options: [
      { label: 'Moins de 10 €', icon: '💚', scores: [3, 0, 0, 0, 0] },
      { label: '10 — 20 €', icon: '💜', scores: [0, 2, 0, 2, 1] },
      { label: '20 € et plus', icon: '🌟', scores: [0, 0, 3, 0, 3] },
      { label: 'Sans limite', icon: '♾️', scores: [0, 1, 2, 1, 2] },
    ],
  },
  {
    question: 'Votre terroir de cœur ?',
    sub: 'La géographie du goût',
    options: [
      { label: 'Languedoc local', icon: '🏔️', scores: [2, 2, 0, 0, 1] },
      { label: 'Pic Saint-Loup', icon: '⛰️', scores: [0, 0, 2, 2, 0] },
      { label: 'Grande France', icon: '🗺️', scores: [1, 1, 1, 1, 1] },
      { label: 'Je découvre', icon: '🔭', scores: [1, 2, 2, 1, 2] },
    ],
  },
];

// ── Progress Bar Component ─────────────────────────────────────────────────────
function ProgressBar({ step, total, reducedMotion }: { step: number; total: number; reducedMotion: boolean }) {
  return (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-0.5 flex-1 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: i < step ? '100%' : i === step ? '100%' : '0%',
              background: i <= step ? `linear-gradient(90deg, ${C.primary}, ${C.light})` : 'transparent',
              transition: reducedMotion ? 'none' : `all 0.5s ease-out ${i === step ? '0.1s' : '0s'}`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Quiz Option Button ─────────────────────────────────────────────────────────
function QuizOptionButton({
  option,
  onClick,
  index,
  reducedMotion,
}: {
  option: QuizOption;
  onClick: () => void;
  index: number;
  reducedMotion: boolean;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      buttonRef.current.style.borderColor = 'rgba(107,29,88,0.7)';
      buttonRef.current.style.background = 'rgba(107,29,88,0.15)';
      buttonRef.current.style.transform = 'translateY(-2px)';
    }
  };

  const handleMouseLeave = () => {
    if (buttonRef.current) {
      buttonRef.current.style.borderColor = 'rgba(255,255,255,0.08)';
      buttonRef.current.style.background = 'rgba(255,255,255,0.04)';
      buttonRef.current.style.transform = 'translateY(0)';
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="p-4 rounded-2xl text-left transition-all active:scale-95"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: reducedMotion ? 'none' : 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        animationDelay: `${index * 0.05}s`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="text-2xl mb-2">{option.icon}</div>
      <p className="text-sm text-white/80 font-medium leading-snug" style={{ fontFamily: F.ui }}>
        {option.label}
      </p>
    </button>
  );
}

// ── Wine Result Card ───────────────────────────────────────────────────────────
function WineResultCard({
  wine,
  index,
  isTopPick,
  reducedMotion,
}: {
  wine: Wine & { score: number };
  index: number;
  isTopPick: boolean;
  reducedMotion: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      cardRef.current.style.borderColor = 'rgba(107,29,88,0.6)';
      cardRef.current.style.background = 'rgba(107,29,88,0.08)';
      cardRef.current.style.transform = 'translateY(-2px)';
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.borderColor = 'rgba(255,255,255,0.07)';
      cardRef.current.style.background = 'rgba(255,255,255,0.04)';
      cardRef.current.style.transform = 'translateY(0)';
    }
  };

  return (
    <a
      ref={cardRef}
      href="https://www.maisonlauze.com"
      target="_blank"
      rel="noopener noreferrer"
      className="wine-result-card flex items-center gap-4 p-4 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: reducedMotion ? 'none' : 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        animationDelay: `${index * 0.1}s`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        <img
          src={wine.image}
          alt={wine.name}
          className="w-12 h-16 object-cover rounded-xl flex-shrink-0"
        />
        {isTopPick && (
          <div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: C.primary }}
          >
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-0.5" style={{ fontFamily: F.ui, color: C.light }}>
          {wine.region}
        </p>
        <p className="font-light text-sm truncate" style={{ fontFamily: F.display }}>
          {wine.name}
        </p>
        <p className="text-xs text-white/40" style={{ fontFamily: F.ui }}>
          {wine.cuvee}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xl font-light" style={{ fontFamily: F.display, color: '#c47ab8' }}>
          {wine.price}
        </p>
        {isTopPick && (
          <p className="text-xs mt-0.5" style={{ color: C.light, fontFamily: F.ui }}>
            ★ Coup de cœur
          </p>
        )}
      </div>
    </a>
  );
}

// ── Quiz Modal Component ───────────────────────────────────────────────────────
export function QuizModal({ isOpen, onClose, wines }: QuizModalProps) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Récupérer la préférence reduced-motion
  const reducedMotion = useReducedMotion();

  // Initialize scores based on wines count
  useEffect(() => {
    if (wines.length > 0) {
      setScores(new Array(wines.length).fill(0));
    }
  }, [wines]);

  // GSAP entrance animation when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // En mode reduced-motion, apparition instantanée
        gsap.set(overlayRef.current, { opacity: 1 });
        gsap.set(modalRef.current, { opacity: 1, scale: 1, y: 0 });
        if (contentRef.current) {
          gsap.set(contentRef.current.children, { opacity: 1, y: 0 });
        }
        return;
      }

      // Animate overlay
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );

      // Animate modal
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 }
      );

      // Animate content
      gsap.fromTo(
        contentRef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.2 }
      );
    });

    return () => ctx.revert();
  }, [isOpen, reducedMotion]);

  // GSAP transition between steps
  useEffect(() => {
    if (!contentRef.current || done) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // En mode reduced-motion, transition instantanée
        gsap.set(contentRef.current, { opacity: 1, x: 0 });
        return;
      }

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, [step, done, reducedMotion]);

  // GSAP animation for results
  useEffect(() => {
    if (!done || !resultsRef.current) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // En mode reduced-motion, apparition instantanée
        gsap.set(resultsRef.current, { opacity: 1, y: 0 });
        const cards = resultsRef.current?.querySelectorAll('.wine-result-card');
        if (cards) {
          gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        }
        return;
      }

      // Animate results container
      gsap.fromTo(
        resultsRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );

      // Animate result cards with stagger
      const cards = resultsRef.current?.querySelectorAll('.wine-result-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
        );
      }
    });

    return () => ctx.revert();
  }, [done, reducedMotion]);

  const handleOptionClick = (optScores: number[]) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // En mode reduced-motion, transition instantanée
        const next = scores.map((s, i) => s + optScores[i]);
        setScores(next);

        if (step < QUIZ_QUESTIONS.length - 1) {
          setStep(step + 1);
        } else {
          setDone(true);
        }
        setIsAnimating(false);
        return;
      }

      // Animate out current content
      gsap.to(contentRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          const next = scores.map((s, i) => s + optScores[i]);
          setScores(next);

          if (step < QUIZ_QUESTIONS.length - 1) {
            setStep(step + 1);
          } else {
            setDone(true);
          }
          setIsAnimating(false);
        },
      });
    });

    return () => ctx.revert();
  };

  const handleReset = () => {
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // En mode reduced-motion, transition instantanée
        setStep(0);
        setScores(new Array(wines.length).fill(0));
        setDone(false);
        return;
      }

      gsap.to(resultsRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setStep(0);
          setScores(new Array(wines.length).fill(0));
          setDone(false);
        },
      });
    });

    return () => ctx.revert();
  };

  const handleClose = () => {
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // En mode reduced-motion, fermeture instantanée
        onClose();
        setTimeout(() => {
          setStep(0);
          setScores(new Array(wines.length).fill(0));
          setDone(false);
        }, 100);
        return;
      }

      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        y: 10,
        duration: 0.3,
        ease: 'power2.in',
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          onClose();
          // Reset state after closing
          setTimeout(() => {
            setStep(0);
            setScores(new Array(wines.length).fill(0));
            setDone(false);
          }, 100);
        },
      });
    });

    return () => ctx.revert();
  };

  if (!isOpen) return null;

  const recommended = [...wines]
    .map((w, i) => ({ ...w, score: scores[i] || 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: reducedMotion ? 'none' : 'blur(24px)' }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0d0010, #050008)',
          border: '1px solid rgba(107,29,88,0.45)',
          boxShadow: '0 40px 120px -20px rgba(107,29,88,0.5)',
        }}
      >
        {/* Decorative gradient orb */}
        <div
          className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${C.primary} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-48 h-48 rounded-full opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${C.light} 0%, transparent 70%)` }}
        />

        {/* Close button */}
        <button
          className="absolute top-5 right-5 z-20 p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
          onClick={handleClose}
          style={{ transition: reducedMotion ? 'none' : 'all 0.3s ease' }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Quiz Content */}
        {!done ? (
          <div ref={contentRef} className="relative z-10 p-8 md:p-10">
            <ProgressBar step={step} total={QUIZ_QUESTIONS.length} reducedMotion={reducedMotion} />

            <p
              className="text-xs tracking-[0.25em] uppercase mb-1"
              style={{ fontFamily: F.ui, color: C.light }}
            >
              La Cave de Lauze · {step + 1} / {QUIZ_QUESTIONS.length}
            </p>
            <p className="text-xs text-white/25 mb-6" style={{ fontFamily: F.ui }}>
              {QUIZ_QUESTIONS[step].sub}
            </p>

            <h3
              className="text-3xl md:text-4xl font-light mb-8 leading-[1.1]"
              style={{ fontFamily: F.display }}
            >
              {QUIZ_QUESTIONS[step].question}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {QUIZ_QUESTIONS[step].options.map((opt, i) => (
                <QuizOptionButton
                  key={i}
                  option={opt}
                  index={i}
                  onClick={() => handleOptionClick(opt.scores)}
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Results Content */
          <div ref={resultsRef} className="relative z-10 p-8 md:p-10">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-5"
              style={{ background: 'rgba(107,29,88,0.3)', border: '1px solid rgba(107,29,88,0.6)' }}
            >
              <Star className="w-5 h-5" style={{ color: '#c47ab8' }} />
            </div>

            <p
              className="text-xs tracking-[0.25em] uppercase mb-1"
              style={{ fontFamily: F.ui, color: C.light }}
            >
              Votre sélection personnalisée
            </p>
            <h3 className="text-3xl font-light mb-1" style={{ fontFamily: F.display }}>
              Votre cave idéale
            </h3>
            <p className="text-sm text-white/35 mb-7" style={{ fontFamily: F.ui }}>
              Nos cavistes ont choisi pour vous
            </p>

            <div className="space-y-3 mb-7">
              {recommended.map((wine, i) => (
                <WineResultCard 
                  key={i} 
                  wine={wine} 
                  index={i} 
                  isTopPick={i === 0} 
                  reducedMotion={reducedMotion}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <a
                href="https://www.maisonlauze.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-full text-sm tracking-[0.1em] uppercase text-center hover:opacity-90"
                style={{
                  fontFamily: F.ui,
                  background: `linear-gradient(135deg, ${C.dark}, ${C.primary})`,
                  boxShadow: `0 4px 20px -4px rgba(107,29,88,0.5)`,
                  transition: reducedMotion ? 'none' : 'all 0.3s ease',
                }}
                onClick={handleClose}
              >
                Commander
              </a>
              <button
                onClick={handleReset}
                className="px-5 py-3 rounded-full text-sm tracking-[0.1em] uppercase border border-white/20 hover:bg-white/5 hover:border-white/30"
                style={{ 
                  fontFamily: F.ui,
                  transition: reducedMotion ? 'none' : 'all 0.3s ease',
                }}
              >
                Refaire
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizModal;
