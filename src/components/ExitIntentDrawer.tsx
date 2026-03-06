"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ArrowRight, Wine, X } from "lucide-react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/context/ReducedMotionContext";

// Palette Maison Lauze
const C = {
  primary: "#6a1d58",
  light: "#9b3a86",
  dark: "#3a0a2e",
  accent: "#bfc106",
};

// Fonts
const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  ui: "'Syne', sans-serif",
};

// Quote poétique style Hemingway
const POETIC_QUOTE = {
  title: "Le vin est la poésie de la terre",
  subtitle: "Ne partez pas si vite. Quelque chose de beau vous attend.",
  quote: "Le bon vin est comme un bon roman : il se savoure lentement, laisse une trace durable, et vous donne envie d'y revenir.",
  author: "— Maison Lauze",
  ctaPrimary: "Découvrir notre sélection",
  ctaSecondary: "Rester sur la page",
};

export function ExitIntentDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const hasTriggered = useRef(false);
  const scrollDepth = useRef(0);
  const timeOnSite = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Récupérer la préférence reduced-motion
  const reducedMotion = useReducedMotion();

  // Check if already shown this session
  useEffect(() => {
    const hasShown = sessionStorage.getItem("exitIntentShown");
    if (hasShown === "true") {
      hasTriggered.current = true;
    }
  }, []);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      scrollDepth.current = scrollPercent;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track time on site
  useEffect(() => {
    timerRef.current = setInterval(() => {
      timeOnSite.current += 1;
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle mouse leave (only trigger when leaving towards top)
  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      // Only trigger on desktop
      if (window.innerWidth < 768) return;

      // Only trigger when mouse leaves towards the top
      if (e.clientY > 10) return;

      // Don't show if already shown this session
      if (sessionStorage.getItem("exitIntentShown") === "true") return;

      // Don't show if user has scrolled past 50%
      if (scrollDepth.current > 50) return;

      // Don't show if user has been on site for more than 30 seconds
      if (timeOnSite.current > 30) return;

      // Don't show if already triggered
      if (hasTriggered.current) return;

      // Show the drawer
      hasTriggered.current = true;
      setIsOpen(true);
      sessionStorage.setItem("exitIntentShown", "true");
    },
    []
  );

  // Add mouse leave listener
  useEffect(() => {
    // Small delay to avoid triggering immediately on page load
    const delayTimer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 2000);

    return () => {
      clearTimeout(delayTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseLeave]);

  // Animate content when drawer opens
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const ctx = gsap.context(() => {
        // En mode reduced-motion, pas d'animation d'entrée - apparition instantanée
        if (reducedMotion) {
          gsap.set(".poetic-line", { opacity: 1, y: 0 });
          return;
        }
        
        gsap.fromTo(
          ".poetic-line",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          }
        );
      }, contentRef);

      return () => ctx.revert();
    }
  }, [isOpen, reducedMotion]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handlePrimaryAction = () => {
    window.open("https://www.maisonlauze.com", "_blank");
    setIsOpen(false);
  };

  // Don't render on mobile
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="top">
      <DrawerContent
        className="fixed inset-x-0 top-0 z-50 max-h-[60vh] rounded-b-2xl border-0 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${C.dark} 0%, #0a0008 100%)`,
          // En mode reduced-motion, pas d'animation sur le drawer lui-même
          transition: reducedMotion ? 'none' : undefined,
        }}
      >
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "300px 300px",
            mixBlendMode: "overlay",
          }}
        />

        {/* Decorative gradient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(ellipse 50% 100% at 50% 0%, ${C.primary}, transparent)`,
          }}
        />

        <div ref={contentRef} className="relative z-10">
          <DrawerHeader className="text-center pt-8 pb-6 px-6">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full text-white/30 hover:text-white hover:bg-white/5 transition-all duration-300"
              aria-label="Fermer"
              style={{ transition: reducedMotion ? 'none' : undefined }}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Wine icon */}
            <div className="poetic-line mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-6"
              style={{
                background: `linear-gradient(135deg, ${C.primary}40, ${C.dark}80)`,
                border: `1px solid ${C.primary}60`,
              }}
            >
              <Wine className="w-5 h-5" style={{ color: C.light }} />
            </div>

            {/* Title */}
            <DrawerTitle
              className="poetic-line text-3xl md:text-4xl font-light leading-tight"
              style={{
                fontFamily: F.display,
                color: "#ffffff",
                letterSpacing: "-0.02em",
              }}
            >
              {POETIC_QUOTE.title}
            </DrawerTitle>

            {/* Subtitle */}
            <DrawerDescription
              className="poetic-line mt-3 text-sm md:text-base"
              style={{
                fontFamily: F.ui,
                color: "rgba(196,122,184,0.8)",
                letterSpacing: "0.05em",
              }}
            >
              {POETIC_QUOTE.subtitle}
            </DrawerDescription>
          </DrawerHeader>

          {/* Quote section */}
          <div className="px-6 pb-8 text-center max-w-2xl mx-auto">
            <blockquote className="poetic-line">
              <p
                className="text-lg md:text-xl font-light italic leading-relaxed"
                style={{
                  fontFamily: F.display,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                &ldquo;{POETIC_QUOTE.quote}&rdquo;
              </p>
              <footer
                className="poetic-line mt-3 text-sm"
                style={{
                  fontFamily: F.ui,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {POETIC_QUOTE.author}
              </footer>
            </blockquote>

            {/* CTA buttons */}
            <div className="poetic-line mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handlePrimaryAction}
                className="group flex items-center gap-3 px-8 py-3.5 rounded-full text-sm tracking-[0.1em] uppercase transition-all hover:scale-105"
                style={{
                  fontFamily: F.ui,
                  background: `linear-gradient(135deg, ${C.dark}, ${C.primary})`,
                  boxShadow: `0 8px 30px -6px rgba(107,29,88,0.5)`,
                  transition: reducedMotion ? 'none' : 'all 0.3s ease',
                }}
              >
                {POETIC_QUOTE.ctaPrimary}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                  style={{ transition: reducedMotion ? 'none' : undefined }}
                />
              </button>

              <button
                onClick={handleClose}
                className="px-6 py-3.5 rounded-full text-sm tracking-[0.05em] border transition-all hover:bg-white/5"
                style={{
                  fontFamily: F.ui,
                  borderColor: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.6)",
                  transition: reducedMotion ? 'none' : 'all 0.3s ease',
                }}
              >
                {POETIC_QUOTE.ctaSecondary}
              </button>
            </div>
          </div>

          {/* Bottom decorative line */}
          <div
            className="poetic-line h-px mx-auto mb-0"
            style={{
              width: "40%",
              background: `linear-gradient(90deg, transparent, ${C.primary}60, transparent)`,
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
