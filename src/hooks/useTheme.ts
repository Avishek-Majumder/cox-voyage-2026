import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('cox-voyage-theme');
    if (saved === 'dark' || saved === 'light' || saved === 'system') {
      return saved as Theme;
    }
    // Also check standard fallback keys just in case
    const oldSaved = localStorage.getItem('squad_trip_theme');
    if (oldSaved === 'dark' || oldSaved === 'light') {
      return oldSaved as Theme;
    }
    return 'system';
  });

  useEffect(() => {
    const updateTheme = () => {
      const root = document.documentElement;
      let actualTheme: 'light' | 'dark' = 'light';

      if (theme === 'system') {
        actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        actualTheme = theme;
      }

      if (actualTheme === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    updateTheme();
    localStorage.setItem('cox-voyage-theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => updateTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  return { theme, setTheme };
}
