import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme, Theme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#1A263F]/80 p-0.5 sm:p-1 rounded-xl border border-slate-205 dark:border-slate-800" id="theme-selector-container">
      <button
        onClick={() => setTheme('light')}
        className={`p-1 sm:p-1.5 rounded-lg transition-all cursor-pointer ${
          theme === 'light'
            ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-xxs'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
        title="Light Mode"
        aria-label="Switch to Light Mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1 sm:p-1.5 rounded-lg transition-all cursor-pointer ${
          theme === 'dark'
            ? 'bg-white dark:bg-slate-700 text-sky-400 shadow-xxs'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
        title="Dark Mode"
        aria-label="Switch to Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-1 sm:p-1.5 rounded-lg transition-all cursor-pointer ${
          theme === 'system'
            ? 'bg-white dark:bg-slate-700 text-sky-500 dark:text-sky-300 shadow-xxs'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
        title="System Preference"
        aria-label="Switch to System Theme"
      >
        <Laptop className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
