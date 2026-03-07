import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{
        background: isLight ? 'rgba(106, 29, 88, 0.1)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${isLight ? 'rgba(106, 29, 88, 0.3)' : 'rgba(255,255,255,0.1)'}`,
      }}
      aria-label={isLight ? 'Passer en mode sombre' : 'Passer en mode clair'}
      title={isLight ? 'Mode sombre' : 'Mode clair'}
    >
      <div
        className="relative transition-transform duration-500"
        style={{
          transform: isLight ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        {isLight ? (
          <Sun 
            className="w-4 h-4 transition-colors duration-300" 
            style={{ color: '#6a1d58' }} 
          />
        ) : (
          <Moon 
            className="w-4 h-4 transition-colors duration-300" 
            style={{ color: '#c47ab8' }} 
          />
        )}
      </div>
      
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isLight 
            ? 'radial-gradient(circle, rgba(106,29,88,0.2) 0%, transparent 70%)' 
            : 'radial-gradient(circle, rgba(196,122,184,0.2) 0%, transparent 70%)',
        }}
      />
    </button>
  );
}
