import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotionContext } from '@/context/ReducedMotionContext';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  label?: string;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  formatNumber?: boolean;
  staggerDelay?: number;
}

/**
 * Composant AnimatedCounter
 * 
 * Compteur animé qui défile comme une roulette de 0 jusqu'à la valeur finale.
 * Déclenché automatiquement au scroll quand l'élément entre dans la viewport.
 * 
 * Props:
 * - end: valeur finale du compteur (obligatoire)
 * - duration: durée de l'animation en secondes (défaut: 2)
 * - suffix: suffixe à afficher après le nombre (ex: "+", "%", "€")
 * - prefix: préfixe à afficher avant le nombre (ex: "~", ">")
 * - label: texte descriptif sous le compteur
 * - formatNumber: formater avec séparateurs de milliers (défaut: true)
 * 
 * Exemple d'utilisation:
 * <AnimatedCounter end={1886} duration={2.5} label="année de fondation" />
 * <AnimatedCounter end={469} suffix="+" label="vins en catalogue" />
 */
export function AnimatedCounter({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  label,
  className = '',
  labelClassName = '',
  valueClassName = '',
  formatNumber = true,
}: AnimatedCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const { reducedMotion } = useReducedMotionContext();
  const [displayValue, setDisplayValue] = useState(0);

  // Formater le nombre avec séparateurs de milliers
  const formatValue = (val: number): string => {
    if (!formatNumber) return val.toString();
    return val.toLocaleString('fr-FR');
  };

  useEffect(() => {
    const element = containerRef.current;
    const valueEl = valueRef.current;
    if (!element || !valueEl) return;

    // Mode réduit : afficher directement la valeur finale
    if (reducedMotion) {
      setDisplayValue(end);
      return;
    }

    const ctx = gsap.context(() => {
      // Créer un objet pour l'animation
      const counter = { value: 0 };

      // Configuration du scroll trigger
      ScrollTrigger.create({
          trigger: element,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            if (hasAnimated.current) return;
            hasAnimated.current = true;

            // Animation du compteur avec effet "roulette"
            gsap.to(counter, {
              value: end,
              duration: duration,
              ease: 'power3.out',
              onUpdate: () => {
                setDisplayValue(Math.round(counter.value));
              },
            });

            // Animation d'entrée du conteneur
            gsap.fromTo(
              element,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
              }
            );
          },
        });
    }, containerRef);

    return () => ctx.revert();
  }, [end, duration, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`text-center p-6 rounded-2xl ${className}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        opacity: reducedMotion ? 1 : 0,
      }}
    >
      <p
        className={`text-4xl font-light mb-1 ${valueClassName}`}
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: '#9b3a86',
        }}
      >
        <span ref={valueRef}>
          {prefix}
          {formatValue(displayValue)}
          {suffix}
        </span>
      </p>
      {label && (
        <p
          className={`text-xs tracking-[0.2em] uppercase text-white/40 ${labelClassName}`}
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {label}
        </p>
      )}
    </div>
  );
}

/**
 * Variante avec effet de roulette verticale (chiffres qui défilent)
 * Plus visuelle pour les grands nombres
 */
export function AnimatedCounterRoulette({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  label,
  className = '',
}: AnimatedCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const digitsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const { reducedMotion } = useReducedMotionContext();

  // Convertir le nombre en tableau de chiffres
  const digits = end.toString().split('');

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    if (reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;

          // Animer chaque colonne de chiffres
          const columns = element.querySelectorAll('.digit-column');
          columns.forEach((col, index) => {
            const finalDigit = parseInt(digits[index]);
            gsap.fromTo(
              col,
              { y: '-90%' },
              {
                y: `-${finalDigit * 10}%`,
                duration: duration,
                delay: index * 0.1,
                ease: 'power3.out',
              }
            );
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [end, duration, digits, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`text-center p-6 rounded-2xl ${className}`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center justify-center gap-1 mb-1">
        {prefix && (
          <span
            className="text-4xl font-light"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: '#9b3a86',
            }}
          >
            {prefix}
          </span>
        )}
        <div
          ref={digitsRef}
          className="flex overflow-hidden h-[1em]"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '2.25rem',
            lineHeight: '1',
            color: '#9b3a86',
          }}
        >
          {digits.map((_, index) => (
            <div
              key={index}
              className="digit-column relative"
              style={{
                width: '0.6em',
                height: '100%',
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div
                  key={num}
                  className="h-[1em] flex items-center justify-center"
                >
                  {num}
                </div>
              ))}
            </div>
          ))}
        </div>
        {suffix && (
          <span
            className="text-4xl font-light"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: '#9b3a86',
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      {label && (
        <p
          className="text-xs tracking-[0.2em] uppercase text-white/40"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {label}
        </p>
      )}
    </div>
  );
}

/**
 * Grid de compteurs animés
 * Pour afficher plusieurs statistiques côte à côte
 */
interface CounterGridProps {
  counters: Array<{
    end: number;
    suffix?: string;
    prefix?: string;
    label: string;
  }>;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function AnimatedCounterGrid({
  counters,
  className = '',
  columns = 4,
}: CounterGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {counters.map((counter, index) => (
        <AnimatedCounter
          key={index}
          end={counter.end}
          suffix={counter.suffix}
          prefix={counter.prefix}
          label={counter.label}
        />
      ))}
    </div>
  );
}

export default AnimatedCounter;
