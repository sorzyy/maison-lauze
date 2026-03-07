import { motion, type Transition, type Variants } from "framer-motion";

interface BreathingTextProps {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  transition?: Transition;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | number;
  repeatDelay?: number;
  className?: string;
  onClick?: () => void;
}

export function BreathingText({
  label,
  fromFontVariationSettings = "'wght' 300, 'opsz' 8",
  toFontVariationSettings = "'wght' 500, 'opsz' 40",
  transition = { duration: 2.5, ease: "easeInOut" },
  staggerDuration = 0.08,
  staggerFrom = "center",
  repeatDelay = 0.5,
  className,
  onClick,
}: BreathingTextProps) {
  const letterVariants: Variants = {
    initial: { fontVariationSettings: fromFontVariationSettings },
    animate: (i: number) => ({
      fontVariationSettings: toFontVariationSettings,
      transition: {
        ...transition,
        repeat: Infinity,
        repeatType: "mirror",
        delay: i * staggerDuration,
        repeatDelay,
      },
    }),
  };

  const getIndex = (index: number, total: number) => {
    if (typeof staggerFrom === "number") return Math.abs(index - staggerFrom);
    switch (staggerFrom) {
      case "first": return index;
      case "last": return total - 1 - index;
      case "center":
      default: return Math.abs(index - Math.floor(total / 2));
    }
  };

  const letters = label.split("");

  return (
    <span className={className} onClick={onClick}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          aria-hidden="true"
          variants={letterVariants}
          initial="initial"
          animate="animate"
          custom={getIndex(i, letters.length)}
        >
          {letter}
        </motion.span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
}
