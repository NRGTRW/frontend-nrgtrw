import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  size = 'md',
  showLabel = false 
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        relative overflow-hidden rounded-full
        bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/80
        border border-[hsl(var(--border))] hover:border-[hsl(var(--accent))]/20
        transition-all duration-[var(--normal)] ease-[var(--ease)]
        hover:shadow-[var(--e2)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent))]/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-[var(--normal)]" />
      
      {/* Icons */}
      <div className="relative flex items-center justify-center h-full">
        {/* Sun icon (light theme) */}
        <svg
          className={`
            ${iconSizes[size]} text-[hsl(var(--muted))] transition-all duration-[var(--normal)] ease-[var(--ease)]
            ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

        {/* Moon icon (dark theme) */}
        <svg
          className={`
            ${iconSizes[size]} text-[hsl(var(--muted))] transition-all duration-[var(--normal)] ease-[var(--ease)] absolute
            ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>

      {/* Label */}
      {showLabel && (
        <span className="ml-2 text-sm font-medium text-[hsl(var(--fg))]">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

// Compact version for headers/navbars
export const ThemeToggleCompact: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <ThemeToggle size="sm" className={className} />;
};

// Full version with label
export const ThemeToggleFull: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <ThemeToggle size="md" showLabel className={className} />;
};
