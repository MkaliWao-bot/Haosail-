import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Sun, Moon, Monitor } from 'lucide-react';
import { HaoSailLogo } from './HaoSailLogo';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { STORE_CONFIG } from '../config/storeConfig';
import { LegalTab } from './LegalComplianceModal';

import { Product, Category } from '../types/machinery';

interface FooterProps {
  products?: Product[];
  onNavigateCategory: (category: string) => void;
  onOpenAdvisor?: () => void;
  onReturnHome?: () => void;
  onOpenLegal?: (tab: LegalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({
  products,
  onNavigateCategory,
  onOpenAdvisor,
  onReturnHome,
  onOpenLegal,
}) => {
  const { theme, setTheme } = useTheme();
  const countFor = (cat: Category, fallback: number) =>
    products && products.length > 0
      ? products.filter((p) => p.category === cat).length
      : fallback;
  const totalCount = products && products.length > 0 ? products.length : 68;
  const themeOptions: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Light', icon: <Sun className="h-3 w-3" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="h-3 w-3" /> },
    { id: 'system', label: 'Auto', icon: <Monitor className="h-3 w-3" /> },
  ];

  return (
    <footer className="border-t border-[#262A33] bg-[#0D0F12] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1: Wordmark & Statement */}
          <div className="space-y-3">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  if (onReturnHome) {
                    onReturnHome();
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                aria-label="Return to HaoSail Homepage"
                className="inline-flex items-center transition-opacity hover:opacity-85 cursor-pointer"
              >
                <HaoSailLogo className="h-9" variant="full" inverted={true} />
              </button>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Commercial-grade woodworking machinery, hydraulic automotive lifts, construction compactors, and silent diesel power. Factory-calibrated precision equipment for East African workshops.
            </p>
            <div className="text-[11px] text-slate-300 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>ISO 9001:2015 &amp; CE Certified Equipment</span>
            </div>
          </div>

          {/* Col 2: Machinery Categories */}
          <div>
            <h4 className="font-display text-xs font-semibold tracking-wide text-white">
              Machinery Catalog
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCategory('woodworking')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Woodworking Machinery ({countFor('woodworking', 15)})
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCategory('auto-maintenance')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Auto Service &amp; Lifts ({countFor('auto-maintenance', 21)})
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCategory('welding-metalworking')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Welding &amp; Metalworking ({countFor('welding-metalworking', 8)})
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCategory('construction-concrete')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Construction &amp; Concrete ({countFor('construction-concrete', 8)})
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCategory('workshop-tools')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Workshop, Forklifts &amp; Pumps ({countFor('workshop-tools', 16)})
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCategory('all')}
                  className="text-sky-400 hover:text-white transition-colors font-medium cursor-pointer"
                >
                  View All Equipment ({totalCount})
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Technical Resources */}
          <div>
            <h4 className="font-display text-xs font-semibold tracking-wide text-white">
              Technical Resources
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              {onOpenAdvisor && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenAdvisor}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Machinery Specification Desk
                  </button>
                </li>
              )}
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('warranty')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  5-Year Factory Warranty
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('credit')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Lipa Pole Pole &amp; Commercial LPO Terms
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Sale &amp; KRA eTIMS
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy &amp; Data Protection
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Commercial Sales & Support */}
          <div>
            <h4 className="font-display text-xs font-semibold tracking-wide text-white">
              Direct Technical Sales
            </h4>
            <ul className="mt-3 space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <a
                  href={STORE_CONFIG.salesPhoneHref}
                  className="hover:text-white transition-colors font-mono tabular-nums"
                >
                  {STORE_CONFIG.salesPhoneDisplay} (Mon–Sat 8am–6pm)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <a
                  href={`mailto:${STORE_CONFIG.salesEmail}`}
                  className="hover:text-white transition-colors"
                >
                  {STORE_CONFIG.salesEmail}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.yardAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom sub-footer */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#262A33] pt-7 sm:flex-row text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {STORE_CONFIG.brandName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onOpenLegal?.('terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => onOpenLegal?.('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <span aria-hidden="true">·</span>
            <span>{STORE_CONFIG.domain}</span>

            <div
              role="group"
              aria-label="Color theme"
              className="inline-flex items-center rounded-md border border-[#262A33] bg-[#15181E] p-0.5"
            >
              {themeOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTheme(opt.id)}
                  className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-mono transition-colors cursor-pointer whitespace-nowrap ${
                    theme === opt.id
                      ? 'bg-[#004B97] text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
