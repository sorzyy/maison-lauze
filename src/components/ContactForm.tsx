import { useState } from 'react';
import { Send, Check } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { useAudio } from '@/context/AudioContext';

const C = {
  accent: '#8B3A3A',
  text: '#5C4033',
  bg: '#F5EDE4',
  bgElevated: '#FDF8F3',
  sage: '#7A8B6E',
  textMuted: 'rgba(92,64,51,0.6)',
};

const inputBase = {
  background: 'white',
  border: '1px solid rgba(92,64,51,0.15)',
  color: C.text,
  fontFamily: "'Inter', sans-serif",
  borderRadius: '0.75rem',
  padding: '0.875rem 1rem',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontSize: '0.875rem',
};

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const { playClick } = useAudio();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nom requis';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide';
    if (form.message.trim().length < 10) e.message = 'Message trop court (min. 10 caractères)';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    playClick();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  const field = (id: keyof typeof form, label: string, type = 'text', multiline = false) => (
    <div>
      <label htmlFor={id} className="block text-xs tracking-[0.15em] uppercase mb-2" style={{ color: C.sage, fontFamily: "'Inter', sans-serif" }}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          value={form[id]}
          onChange={e => setForm(prev => ({ ...prev, [id]: e.target.value }))}
          rows={4}
          style={{ ...inputBase, resize: 'none', ...(errors[id] ? { borderColor: C.accent } : {}) }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={form[id]}
          onChange={e => setForm(prev => ({ ...prev, [id]: e.target.value }))}
          style={{ ...inputBase, ...(errors[id] ? { borderColor: C.accent } : {}) }}
        />
      )}
      {errors[id] && <p className="text-xs mt-1" style={{ color: C.accent }}>{errors[id]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5 reveal-up">
      {field('name', 'Votre nom')}
      {field('email', 'Votre email', 'email')}
      {field('message', 'Votre message', 'text', true)}

      <Magnetic strength={0.1}>
        <button
          type="submit"
          className="flex items-center gap-3 px-8 py-4 rounded-full text-sm tracking-[0.1em] uppercase text-white transition-all hover:shadow-lg hover:shadow-[#8B3A3A]/20"
          style={{ background: sent ? C.sage : C.accent, fontFamily: "'Inter', sans-serif" }}
        >
          {sent ? (
            <><Check className="w-4 h-4" /> Message envoyé</>
          ) : (
            <><Send className="w-4 h-4" /> Envoyer</>
          )}
        </button>
      </Magnetic>

      <p className="text-xs" style={{ color: 'rgba(92,64,51,0.4)' }}>
        Nous vous répondons sous 48h.
      </p>
    </form>
  );
}
