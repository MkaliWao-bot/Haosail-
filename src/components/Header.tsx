import React from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import { Product } from '../types/machinery';
import { HaoSailLogo } from './HaoSailLogo';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onOpenAuth?: () => void;
  onOpenComparison?: () => void;
  onOpenAdvisor?: () => void;
  onOpenProforma?: () => void;
  cartCount: number;
  compareList?: Product[];
  onNavigateCategory: (cat: string) => void;
  onReturnHome?: () => void;
  onGoToCheckout?: () => void;
  currentView?: 'catalog' | 'checkout';
  activeCategory?: string;
}

const NAV_LINKS = [
  { id: 'woodworking', label: 'Woodworking' },
  { id: 'auto-maintenance', label: 'Auto Service' },
  { id: 'welding-metalworking', label: 'Welding & Metal' },
  { id: 'construction-concrete', label: 'Construction' },
  { id: 'workshop-tools', label: 'Workshop & Lifting' },
];

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenCart,
  onOpenAuth,
  cartCount,
  onNavigateCategory,
  onReturnHome,
  activeCategory,
}) => {
  const { isDarkMode } = useTheme();
  const { user, isAdmin, accountProfile } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#15181E]/95 backdrop-blur-md border-b border-[#E2E4E8] dark:border-[#262A33] transition-colors duration-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single Brand Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (onReturnHome) {
              onReturnHome();
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center shrink-0 transition-opacity hover:opacity-85 cursor-pointer"
          aria-label="Return to HaoSail Homepage"
        >
          <HaoSailLogo className="h-9 sm:h-10" variant="full" inverted={isDarkMode} />
        </a>

        {/* Zone 2: Clean Single-Line Category Text Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium text-[#5A606B] dark:text-slate-300">
          {NAV_LINKS.map((link) => {
            const isActive = activeCategory === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigateCategory(link.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer hover:text-[#111315] dark:hover:text-white ${
                  isActive ? 'text-[#004B97] dark:text-white font-semibold' : ''
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-[2px] bg-[#004B97] dark:bg-sky-400 transition-opacity duration-150 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Compact Search, Cart & Account Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="btn-press flex items-center gap-2 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#0D0F12] px-3 py-1.5 text-xs text-[#5A606B] dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-[#111315] dark:hover:text-white cursor-pointer whitespace-nowrap shrink-0"
            aria-label="Search catalog"
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Search catalog</span>
            <kbd className="hidden md:inline-block font-mono text-[10px] text-slate-400 dark:text-slate-500 pl-1">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="btn-press relative flex items-center justify-center gap-2 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] hover:border-[#004B97] dark:hover:border-sky-400 text-[#111315] dark:text-white px-3 py-1.5 text-xs font-medium cursor-pointer whitespace-nowrap shrink-0"
            aria-label="Shopping Cart"
            title="Shopping Cart"
          >
            <ShoppingCart className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400" />
            <span className="font-mono tabular-nums font-semibold">{cartCount}</span>
          </button>

          {onOpenAuth && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="btn-press flex items-center gap-2 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] hover:border-[#004B97] dark:hover:border-sky-400 text-[#111315] dark:text-white px-2.5 py-1.5 text-xs font-medium cursor-pointer whitespace-nowrap shrink-0"
              aria-label={user ? 'Workshop Account' : 'Sign In'}
              title={user ? accountProfile?.displayName || user.email || 'Workshop Account' : 'Sign In / Create Account'}
            >
              {user && (accountProfile?.photoUrl || user.photoURL) ? (
                <img
                  src={accountProfile?.photoUrl || user.photoURL || ''}
                  alt={accountProfile?.displayName || 'Account avatar'}
                  referrerPolicy="no-referrer"
                  className="h-4 w-4 rounded-full object-cover shrink-0"
                />
              ) : (
                <User className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400 shrink-0" />
              )}
              <span className="hidden sm:inline max-w-[110px] truncate">
                {user
                  ? (accountProfile?.displayName || user.displayName || 'Account').split(' ')[0]
                  : 'Sign In'}
              </span>
              {user && isAdmin && (
                <span className="hidden md:inline font-mono text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300">
                  Admin
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
