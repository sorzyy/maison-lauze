import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Plus, Minus } from 'lucide-react';

interface AccordionItem {
  question: string;
  answer: string;
}

const C = {
  accent: '#8B3A3A',
  text: '#5C4033',
  bg: '#F5EDE4',
  bgElevated: '#FDF8F3',
  textMuted: 'rgba(92,64,51,0.6)',
};

function AccordionItemComponent({ item, isOpen, onClick }: { item: AccordionItem; isOpen: boolean; onClick: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!contentRef.current || !answerRef.current) return;

    if (isOpen) {
      const height = answerRef.current.offsetHeight;
      gsap.to(contentRef.current, {
        height,
        duration: 0.4,
        ease: 'power2.out',
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }
  }, [isOpen]);

  return (
    <div
      className="border-b transition-colors"
      style={{ borderColor: isOpen ? `${C.accent}30` : 'rgba(92,64,51,0.1)' }}
    >
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span
          className="text-lg md:text-xl font-light pr-8 transition-colors"
          style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            color: isOpen ? C.accent : C.text
          }}
        >
          {item.question}
        </span>
        <span
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ 
            background: isOpen ? C.accent : 'rgba(92,64,51,0.05)',
            color: isOpen ? 'white' : C.text
          }}
        >
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      
      <div ref={contentRef} className="overflow-hidden" style={{ height: 0 }}>
        <p
          ref={answerRef}
          className="pb-6 leading-relaxed"
          style={{ color: C.textMuted }}
        >
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-0">
      {items.map((item, index) => (
        <AccordionItemComponent
          key={index}
          item={item}
          isOpen={openIndex === index}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
}
