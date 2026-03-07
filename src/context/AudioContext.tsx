import React, { createContext, useContext, useCallback, useRef, useState, useEffect } from 'react';

interface AudioContextType {
  playHover: () => void;
  playClick: () => void;
  playScroll: () => void;
  toggleMute: () => void;
  isMuted: boolean;
}

const AudioCtx = createContext<AudioContextType | null>(null);

// Single shared AudioContext instance — browsers limit to ~6 simultaneous contexts
let sharedAudioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  try {
    if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
      sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (sharedAudioContext.state === 'suspended') {
      sharedAudioContext.resume();
    }
    return sharedAudioContext;
  } catch {
    return null;
  }
};

const playTone = (frequency: number, gain: number, duration: number) => {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, ctx.currentTime + duration);
    gainNode.gain.setValueAtTime(gain, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio errors silently
  }
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('audio-muted') === 'true';
    }
    return false;
  });

  const lastScrollSound = useRef(0);

  useEffect(() => {
    localStorage.setItem('audio-muted', isMuted.toString());
  }, [isMuted]);

  const playHover = useCallback(() => {
    if (isMuted) return;
    playTone(200, 0.03, 0.05);
  }, [isMuted]);

  const playClick = useCallback(() => {
    if (isMuted) return;
    playTone(800, 0.1, 0.1);
  }, [isMuted]);

  const playScroll = useCallback(() => {
    if (isMuted) return;
    const now = Date.now();
    if (now - lastScrollSound.current < 100) return;
    lastScrollSound.current = now;
    playTone(100, 0.02, 0.03);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return (
    <AudioCtx.Provider value={{ playHover, playClick, playScroll, toggleMute, isMuted }}>
      {children}
    </AudioCtx.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioCtx);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};
