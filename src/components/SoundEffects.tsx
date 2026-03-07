import { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function SoundEffects() {
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      setIsVisible(true);
    }
  }, []);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playClink = useCallback(() => {
    if (isMuted || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }, [isMuted]);

  const toggleMute = () => {
    if (isMuted) {
      initAudio();
    }
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const handleClick = () => playClink();
    const buttons = document.querySelectorAll('button, .wine-card');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', handleClick);
    });

    return () => {
      buttons.forEach(btn => {
        btn.removeEventListener('click', handleClick);
      });
    };
  }, [playClink]);

  if (!isVisible) return null;

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full transition-all duration-300 hover:scale-110"
      style={{
        background: 'rgba(107, 29, 88, 0.3)',
        border: '1px solid rgba(107, 29, 88, 0.5)',
        backdropFilter: 'blur(10px)',
      }}
      aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-white/60" />
      ) : (
        <Volume2 className="w-5 h-5" style={{ color: '#c47ab8' }} />
      )}
    </button>
  );
}
