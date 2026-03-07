import { useRef, useState, type ReactNode, type CSSProperties, type MouseEvent } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-br from-[#7a1a1a] to-[#3a0a0a]',
          'text-white',
          'border border-[#9b2828]/50',
          'shadow-[0_8px_30px_-6px_rgba(122,26,26,0.6)]',
          'hover:shadow-[0_12px_40px_-8px_rgba(122,26,26,0.8)]',
        ],
        secondary: [
          'bg-transparent',
          'text-white/90',
          'border border-white/20',
          'hover:border-[#c4402a]/60',
          'hover:bg-white/5',
        ],
        ghost: [
          'bg-transparent',
          'text-white/70',
          'border border-transparent',
          'hover:text-white',
          'hover:bg-white/5',
        ],
      },
      size: {
        sm: 'h-9 px-4 text-xs tracking-[0.12em] uppercase',
        md: 'h-12 px-6 text-sm tracking-[0.1em] uppercase',
        lg: 'h-14 px-8 text-sm tracking-[0.1em] uppercase',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// Animation keyframes injectées via style
const buttonStyles = `
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 0.6;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes borderGlow {
    0%, 100% {
      box-shadow: 0 0 5px rgba(196, 64, 42, 0.3), 0 0 10px rgba(196, 64, 42, 0.2);
    }
    50% {
      box-shadow: 0 0 15px rgba(196, 64, 42, 0.6), 0 0 25px rgba(196, 64, 42, 0.4);
    }
  }
  
  @keyframes press {
    0% { transform: scale(1); }
    50% { transform: scale(0.95); }
    100% { transform: scale(1.02); }
  }
  
  .premium-btn-ripple {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 70%);
    pointer-events: none;
    animation: ripple 0.8s ease-out forwards;
  }
  
  .premium-btn-glow {
    animation: borderGlow 2s ease-in-out infinite;
  }
  
  .premium-btn-pressed {
    animation: press 0.3s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }
`;

interface PremiumButtonProps
  extends VariantProps<typeof buttonVariants>,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  children: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  style?: CSSProperties;
  glowOnHover?: boolean;
  magnetic?: boolean;
}

export function PremiumButton({
  children,
  href,
  target,
  rel,
  className,
  variant = 'primary',
  size = 'md',
  style = {},
  glowOnHover = true,
  magnetic = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  ...props
}: PremiumButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  
  // Génère un ID unique pour chaque ripple
  const rippleIdRef = useRef(0);

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    setIsHovered(true);
    onMouseEnter?.(e as MouseEvent<HTMLButtonElement>);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    setIsHovered(false);
    onMouseLeave?.(e as MouseEvent<HTMLButtonElement>);
  };

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
    onMouseMove?.(e as MouseEvent<HTMLButtonElement>);
  };

  const createRipple = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = { id: rippleIdRef.current++, x, y, size };
    setRipples((prev) => [...prev, newRipple]);
    
    // Nettoie le ripple après l'animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    createRipple(e);
    
    // Effet de pression
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 300);
    
    onClick?.(e as MouseEvent<HTMLButtonElement>);
  };

  // Style pour la lumière qui suit la souris
  const lightGradientStyle: CSSProperties = {
    '--mouse-x': `${mousePos.x}%`,
    '--mouse-y': `${mousePos.y}%`,
    background: isHovered
      ? `radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(196, 64, 42, 0.25) 0%, transparent 50%), ${
          variant === 'primary' 
            ? 'linear-gradient(135deg, #7a1a1a, #3a0a0a)'
            : 'transparent'
        }`
      : undefined,
  } as CSSProperties;

  const combinedStyle: CSSProperties = {
    ...style,
    ...lightGradientStyle,
    willChange: 'transform',
  };

  const content = (
    <>
      {/* Style injecté */}
      <style>{buttonStyles}</style>
      
      {/* Effet de lumière radiale au hover */}
      {isHovered && variant === 'primary' && (
        <span 
          className="absolute inset-0 rounded-full pointer-events-none opacity-60"
          style={{
            background: `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)`,
          }}
        />
      )}
      
      {/* Ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="premium-btn-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
      
      {/* Contenu avec effet de levée */}
      <span 
        className={cn(
          'relative z-10 flex items-center gap-2 transition-transform duration-300',
          isHovered && 'translate-y-[-2px]'
        )}
      >
        {children}
      </span>
    </>
  );

  const baseClassName = cn(
    buttonVariants({ variant, size }),
    isHovered && glowOnHover && variant === 'primary' && 'premium-btn-glow',
    isPressed && 'premium-btn-pressed',
    className
  );

  if (href) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        className={baseClassName}
        style={combinedStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      className={baseClassName}
      style={combinedStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      {...props}
    >
      {content}
    </button>
  );
}

export { buttonVariants };
