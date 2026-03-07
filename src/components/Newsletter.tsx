import { useState } from 'react';
import { Send, Check } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  ui: "'Inter', -apple-system, sans-serif",
};

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { playClick, playHover } = useAudio();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    playClick();
    setIsSubmitted(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  return (
    <section className="py-32 px-6 md:px-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0505] via-[#050505] to-[#0a0505]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#c4402a' }}>
          Newsletter
        </p>
        <h2 className="text-3xl md:text-5xl font-light mb-6" style={{ fontFamily: F.display }}>
          Restez informés de nos <em className="italic" style={{ color: '#c4402a' }}>actualités</em>
        </h2>
        <p className="text-white/50 mb-12 max-w-lg mx-auto" style={{ fontFamily: F.ui }}>
          Recevez nos dernières nouvelles, les dates de salons et les nouveaux millésimes directement dans votre boîte mail.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
          <div 
            className={`relative flex items-center transition-all duration-300 rounded-full overflow-hidden ${
              isFocused ? 'ring-2 ring-[#c4402a]/50' : ''
            }`}
            style={{ 
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                playHover();
              }}
              onBlur={() => setIsFocused(false)}
              placeholder="Votre email"
              className="flex-1 px-6 py-4 bg-transparent text-sm outline-none placeholder:text-white/30"
              style={{ fontFamily: F.ui }}
              disabled={isSubmitted}
            />
            <button
              type="submit"
              onMouseEnter={playHover}
              onClick={() => email && playClick()}
              disabled={isSubmitted || !email}
              className={`px-6 py-2 mr-2 rounded-full text-sm tracking-[0.1em] uppercase transition-all duration-300 flex items-center gap-2 ${
                isSubmitted 
                  ? 'bg-green-600' 
                  : 'bg-[#7a1a1a] hover:bg-[#c4402a] disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
              style={{ fontFamily: F.ui }}
            >
              {isSubmitted ? (
                <>
                  <Check className="w-4 h-4" /> Inscrit
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> S'inscrire
                </>
              )}
            </button>
          </div>
          
          {isSubmitted && (
            <p className="mt-4 text-sm text-green-400" style={{ fontFamily: F.ui }}>
              Merci pour votre inscription !
            </p>
          )}
        </form>

        <p className="mt-6 text-xs text-white/30" style={{ fontFamily: F.ui }}>
          Pas de spam, promis. Vous pouvez vous désinscrire à tout moment.
        </p>
      </div>
    </section>
  );
}
