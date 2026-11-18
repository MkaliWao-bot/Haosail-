import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 p-0.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#004b97] dark:focus:ring-cyan-400 select-none ${className}`}
      role="switch"
      aria-checked={isDarkMode}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Track Background Static Icons */}
      <span className="absolute left-1.5 flex items-center justify-center text-amber-500 pointer-events-none">
        <Sun className="h-3 w-3" />
      </span>
      <span className="absolute right-1.5 flex items-center justify-center text-cyan-400 pointer-events-none">
        <Moon className="h-3 w-3" />
      </span>

      {/* Sliding Thumb Indicator with Active Icon */}
      <span
        className={`${
          isDarkMode 
            ? 'translate-x-6 bg-[#004b97] text-cyan-300 shadow-sm' 
            : 'translate-x-0 bg-white text-amber-500 shadow-xs'
        } pointer-events-none relative z-10 flex h-6 w-6 transform items-center justify-center rounded-full transition-transform duration-200 ease-in-out border border-slate-200/60 dark:border-cyan-500/30`}
      >
        {isDarkMode ? (
          <Moon className="h-3.5 w-3.5 fill-current" />
        ) : (
          <Sun className="h-3.5 w-3.5 fill-current" />
        )}
      </span>
    </button>
  );
};
