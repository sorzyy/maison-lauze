import { useState, useRef } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

const F = {
  ui: "'Inter', -apple-system, sans-serif",
};

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function AccordionItem({ question, answer, isOpen, onClick }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { playHover, playClick } = useAudio();

  const handleClick = () => {
    playClick();
    onClick();
  };

  return (
    <div 
      className="border-b transition-colors duration-300"
      style={{ borderColor: isOpen ? 'rgba(122,26,26,0.5)' : 'rgba(255,255,255,0.1)' }}
      onMouseEnter={playHover}
    >
      <button
        onClick={handleClick}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-light pr-8 transition-transform duration-300 group-hover:translate-x-2"
          style={{ fontFamily: F.ui }}>
          {question}
        </span>
        <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-[#7a1a1a] rotate-0' : 'bg-white/5 group-hover:bg-white/10'
        }`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <div 
        ref={contentRef}
        className="overflow-hidden transition-all duration-500 ease-out"
        style={{ 
          maxHeight: isOpen ? '300px' : '0px',
          opacity: isOpen ? 1 : 0
        }}
      >
        <p className="pb-6 text-white/60 leading-relaxed pr-12" style={{ fontFamily: F.ui }}>
          {answer}
        </p>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: { question: string; answer: string }[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
