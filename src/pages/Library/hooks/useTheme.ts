import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

/**
 * Hook to manage theme state and persistence
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as Theme;
      if (stored && (stored === 'dark' || stored === 'light')) {
        return stored;
      }
    }
    
    // Fallback to system preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    
    // Default to dark
    return 'dark';
  });

  useEffect(() => {
    // Apply theme to document
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      
      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
      }
      
      return newTheme;
    });
  };

  const setLightTheme = () => {
    setTheme('light');
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', 'light');
    }
  };

  const setDarkTheme = () => {
    setTheme('dark');
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', 'dark');
    }
  };

  return {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
}
