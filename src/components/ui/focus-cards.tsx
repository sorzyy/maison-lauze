import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface FocusCard {
  title: string;
  subtitle?: string;
  src: string;
  badge?: string;
  price?: string;
  extra?: string;
}

const Card = React.memo(({
  card, index, hovered, setHovered, onClick,
}: {
  card: FocusCard;
  index: number;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  onClick?: () => void;
}) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    onClick={onClick}
    className={cn(
      "rounded-2xl relative overflow-hidden cursor-pointer",
      "transition-all duration-400 ease-out",
      hovered !== null && hovered !== index && "blur-[2px] scale-[0.97] brightness-75"
    )}
    style={{ background: '#0c0202', aspectRatio: '3/4' }}
  >
    <img
      src={card.src}
      alt={card.title}
      className="w-full h-full object-contain p-4 transition-transform duration-500"
      style={{
        transform: hovered === index ? 'scale(1.06)' : 'scale(1)',
        filter: 'drop-shadow(0 12px 28px rgba(122,26,26,0.45))',
      }}
    />
    {/* Badge */}
    {card.badge && (
      <span className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full text-white z-10"
        style={{ background: 'rgba(122,26,26,0.9)', fontFamily: "'Syne', sans-serif" }}>
        {card.badge}
      </span>
    )}
    {/* Hover overlay */}
    <div
      className={cn(
        "absolute inset-0 flex flex-col justify-end p-5 transition-opacity duration-300",
        hovered === index ? "opacity-100" : "opacity-0"
      )}
      style={{ background: 'linear-gradient(to top, rgba(8,1,1,0.96) 55%, rgba(8,1,1,0.4) 80%, transparent)' }}
    >
      <p className="text-xs tracking-[0.15em] uppercase mb-1"
        style={{ color: '#c4402a', fontFamily: "'Syne', sans-serif" }}>{card.subtitle}</p>
      <p className="text-lg font-light text-white"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{card.title}</p>
      {card.price && (
        <p className="text-base font-light mt-1"
          style={{ color: '#c4402a', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{card.price}</p>
      )}
      {card.extra && (
        <p className="text-xs text-white/40 mt-0.5"
          style={{ fontFamily: "'Syne', sans-serif" }}>{card.extra}</p>
      )}
    </div>
  </div>
));

Card.displayName = "FocusCard";

export function FocusCards({ cards, onCardClick }: {
  cards: FocusCard[];
  onCardClick?: (card: FocusCard) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
          onClick={onCardClick ? () => onCardClick(card) : undefined}
        />
      ))}
    </div>
  );
}
