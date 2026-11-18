import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Package, ArrowRight } from 'lucide-react';
import { Product } from '../types/machinery';
import { POPULAR_SEARCH_TERMS } from '../data/machineryData';
import { formatKSh } from '../utils/currency';

interface SearchCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onApplyCategoryFilter: (category: string) => void;
}

export const SearchCommandModal: React.FC<SearchCommandModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.specs.motor.toLowerCase().includes(q) ||
          p.specs.voltage.toLowerCase().includes(q)
        );
      })
    : products.slice(0, 6);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelectProduct(filtered[selectedIndex]);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 lg:p-8 pt-16 sm:pt-24">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0F12]/65 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] shadow-2xl">
        {/* Search input bar */}
        <div className="flex items-center border-b border-[#E2E4E8] dark:border-[#262A33] px-4 py-3 bg-white dark:bg-[#15181E]">
          <Search className="h-4 w-4 text-[#004B97] dark:text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search HaoSail machinery by SKU, model, motor output, or voltage..."
            className="flex-1 bg-transparent px-3 text-sm text-[#111315] dark:text-white placeholder-[#5A606B] dark:placeholder-slate-500 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="rounded border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#0D0F12] px-1.5 py-0.5 font-mono text-[10px] text-[#5A606B] dark:text-slate-400">
              ESC
            </kbd>
          )}
        </div>

        {/* Quick Suggestions */}
        {!query && (
          <div className="flex flex-wrap items-center gap-1.5 border-b border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] px-4 py-2.5 text-xs">
            <span className="font-mono text-[11px] font-medium text-[#5A606B] dark:text-slate-400 mr-1">
              Quick Filter:
            </span>
            {POPULAR_SEARCH_TERMS.slice(0, 6).map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="rounded border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-2 py-0.5 text-[11px] text-[#111315] dark:text-slate-300 hover:border-[#004B97] dark:hover:border-sky-400 hover:text-[#004B97] dark:hover:text-sky-300 transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        )}

        {/* Result List */}
        <div className="max-h-96 overflow-y-auto p-2 bg-white dark:bg-[#15181E]">
          {filtered.length > 0 ? (
            <div className="space-y-1">
              {filtered.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectProduct(item);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between rounded-md p-2.5 cursor-pointer transition-colors border ${
                      isSelected
                        ? 'bg-[#004B97]/8 border-[#004B97]/30 text-[#111315] dark:bg-[#1C2029] dark:border-[#262A33] dark:text-white'
                        : 'border-transparent hover:bg-[#F6F6F4] text-[#5A606B] dark:text-slate-300 dark:hover:bg-[#1C2029]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-11 w-11 shrink-0 rounded object-cover bg-[#ECECE8] dark:bg-[#1C2029] border border-[#E2E4E8] dark:border-[#262A33]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-[#004B97] dark:text-sky-400">
                            {item.sku}
                          </span>
                          <span className="text-[11px] text-slate-400">·</span>
                          <span className="text-[11px] font-medium text-[#5A606B] dark:text-slate-400 truncate">
                            {item.categoryLabel}
                          </span>
                        </div>
                        <p className="truncate font-display text-xs font-bold text-[#111315] dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-[11px] font-mono text-[#5A606B] dark:text-slate-400 truncate">
                          {item.specs.motor} · {item.specs.voltage}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="font-mono text-xs font-semibold text-[#111315] dark:text-white tabular-nums">
                        {formatKSh(item.price)}
                      </span>
                      {isSelected && (
                        <ArrowRight className="h-4 w-4 text-[#004B97] dark:text-sky-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center text-xs text-[#5A606B] dark:text-slate-400">
              <Package className="mx-auto h-7 w-7 text-slate-400 dark:text-slate-500 mb-2" />
              <p className="font-display font-bold text-[#111315] dark:text-white">
                No machinery matching &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-[#5A606B] dark:text-slate-400">
                Try searching by SKU, motor rating, or machine category.
              </p>
            </div>
          )}
        </div>

        {/* Keyboard shortcut footer */}
        <div className="flex items-center justify-between border-t border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] px-4 py-2.5 text-[11px] text-[#5A606B] dark:text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Open Spec Sheet</span>
            <span>ESC Close</span>
          </div>
          <span className="font-sans text-[#111315] dark:text-slate-300 font-medium">
            HaoSail Industrial Catalog
          </span>
        </div>
      </div>
    </div>
  );
};
