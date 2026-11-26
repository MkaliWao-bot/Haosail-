import React from 'react';
import { Search, X } from 'lucide-react';
import { Product, FilterState, Category } from '../types/machinery';
import { CATEGORIES_CONFIG } from '../data/machineryData';
import { ProductCard } from './ProductCard';

interface CatalogSectionProps {
  products: Product[];
  filterState: FilterState;
  onFilterChange: (update: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow?: (product: Product, quantity?: number) => void;
  onToggleCompare: (product: Product) => void;
  compareList: Product[];
  onOpenComparison?: () => void;
  onOpenAdvisor?: (product?: Product) => void;
  onRequestProforma?: (product: Product) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  filterState,
  onFilterChange,
  onResetFilters,
  onOpenDetails,
  onAddToCart,
  onBuyNow,
  onToggleCompare,
  compareList,
  onOpenComparison: _onOpenComparison,
  onRequestProforma,
}) => {
  const currentCategoryConfig =
    CATEGORIES_CONFIG.find((c) => c.id === filterState.category) || CATEGORIES_CONFIG[0];

  const filteredProducts = products.filter((item) => {
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase().trim();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        (item.subCategoryLabel && item.subCategoryLabel.toLowerCase().includes(q)) ||
        item.specs.motor.toLowerCase().includes(q) ||
        item.specs.voltage.toLowerCase().includes(q) ||
        item.specs.capacity.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filterState.category !== 'all' && item.category !== filterState.category) {
      return false;
    }

    if (
      filterState.subCategory &&
      filterState.subCategory !== 'all' &&
      !filterState.subCategory.startsWith('all-') &&
      item.subCategory !== filterState.subCategory
    ) {
      return false;
    }

    if (filterState.powerSource !== 'all') {
      if (filterState.powerSource === 'engine-manual') {
        if (item.powerSource !== 'all' && item.powerSource !== 'cordless-18v') return false;
      } else if (item.powerSource !== filterState.powerSource) {
        return false;
      }
    }

    if (filterState.minHorsepower > 0) {
      const hpMatch = item.specs.motor.match(/(\d+(\.\d+)?)\s*HP/i);
      const kwMatch = item.specs.motor.match(/(\d+(\.\d+)?)\s*kW/i);
      let calculatedHp = 0;
      if (hpMatch) {
        calculatedHp = parseFloat(hpMatch[1]);
      } else if (kwMatch) {
        calculatedHp = parseFloat(kwMatch[1]) * 1.34102;
      }
      if (calculatedHp < filterState.minHorsepower) return false;
    }

    if (filterState.inStockOnly && !item.inStock) {
      return false;
    }

    if (filterState.freeFreightOnly && !item.isFreeFreight) {
      return false;
    }

    if (filterState.lipaPolePoleOnly && item.price <= 80000) {
      return false;
    }

    if (filterState.dealsOnly) {
      const pct = item.originalPrice
        ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
        : 0;
      if (pct < 15) return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filterState.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'weight-desc':
        return b.specs.weightLbs - a.specs.weightLbs;
      case 'power-desc': {
        const getHp = (item: Product) => {
          const hpMatch = item.specs.motor.match(/(\d+(\.\d+)?)\s*HP/i);
          const kwMatch = item.specs.motor.match(/(\d+(\.\d+)?)\s*kW/i);
          if (hpMatch) return parseFloat(hpMatch[1]);
          if (kwMatch) return parseFloat(kwMatch[1]) * 1.34;
          return 0;
        };
        return getHp(b) - getHp(a);
      }
      case 'rating-desc':
        return b.rating - a.rating;
      case 'featured':
      default:
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return 0;
    }
  });

  const hasSubCategoryFilter =
    Boolean(filterState.subCategory) &&
    filterState.subCategory !== 'all' &&
    !filterState.subCategory?.startsWith('all-');

  const hasActiveFilters =
    filterState.category !== 'all' ||
    hasSubCategoryFilter ||
    filterState.powerSource !== 'all' ||
    Boolean(filterState.searchQuery.trim()) ||
    Boolean(filterState.lipaPolePoleOnly) ||
    Boolean(filterState.dealsOnly) ||
    filterState.sortBy !== 'featured';

  return (
    <section id="catalog" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E2E4E8] dark:border-[#262A33] pb-5">
        <div>
          <span className="font-mono text-xs text-[#004B97] dark:text-sky-400 font-medium">
            Equipment Catalog
          </span>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#111315] dark:text-white tracking-tight">
            {currentCategoryConfig.label}
          </h2>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#5A606B] dark:text-slate-400 tabular-nums">
          <span>
            Showing{' '}
            <span className="font-semibold text-[#111315] dark:text-white">
              {sortedProducts.length}
            </span>{' '}
            of <span>{products.length}</span> machines
          </span>
          {hasActiveFilters && (
            <>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={onResetFilters}
                className="text-[#004B97] dark:text-sky-400 hover:underline font-medium cursor-pointer whitespace-nowrap"
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* Compact Single-Row Architectural Filter & Sort Toolbar */}
      <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#E2E4E8] dark:border-[#262A33] pb-4">
        {/* Division Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          {CATEGORIES_CONFIG.map((cat) => {
            const isSelected = filterState.category === cat.id;
            const liveCount =
              cat.id === 'all'
                ? products.length
                : products.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  onFilterChange({ category: cat.id as Category, subCategory: 'all' })
                }
                className={`btn-press inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#004B97] text-white'
                    : 'bg-white dark:bg-[#15181E] border border-[#E2E4E8] dark:border-[#262A33] text-[#5A606B] dark:text-slate-300 hover:border-[#004B97] dark:hover:border-sky-400 hover:text-[#111315] dark:hover:text-white'
                }`}
              >
                <span>{cat.shortLabel}</span>
                <span
                  className={`font-mono text-[10px] tabular-nums ${
                    isSelected ? 'text-sky-200' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {liveCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Inline Quick-Search, Supply Voltage, Lipa Filter & Sort Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <div className="relative flex-1 min-w-[160px] sm:w-48 sm:flex-none">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5A606B] dark:text-slate-400" />
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Filter model or SKU..."
              aria-label="Filter machinery catalog"
              className="w-full rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] pl-8 pr-7 py-1.5 text-xs text-[#111315] dark:text-white placeholder:text-slate-400 focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
            />
            {filterState.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: '' })}
                aria-label="Clear search query"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#111315] dark:hover:text-white cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <select
            value={filterState.powerSource}
            onChange={(e) =>
              onFilterChange({
                powerSource: e.target.value as FilterState['powerSource'],
              })
            }
            aria-label="Filter by electrical supply"
            className="rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-2.5 py-1.5 text-xs font-medium text-[#111315] dark:text-slate-200 focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none cursor-pointer"
          >
            <option value="all">Power: All Supply</option>
            <option value="corded-230v">230V Single-Phase</option>
            <option value="3-phase-400v">400V 3-Phase</option>
            <option value="engine-manual">Diesel / Manual / Cordless</option>
          </select>

          <button
            type="button"
            onClick={() =>
              onFilterChange({ dealsOnly: !filterState.dealsOnly })
            }
            aria-pressed={Boolean(filterState.dealsOnly)}
            className={`btn-press inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              filterState.dealsOnly
                ? 'border-amber-600 bg-amber-500/15 text-amber-800 dark:border-amber-400 dark:bg-amber-400/15 dark:text-amber-300 font-semibold'
                : 'border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#5A606B] dark:text-slate-300 hover:border-amber-600 dark:hover:border-amber-400'
            }`}
          >
            <span>Festive Clearance</span>
            <span className="font-mono text-[10px] opacity-80">15%+</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onFilterChange({ lipaPolePoleOnly: !filterState.lipaPolePoleOnly })
            }
            aria-pressed={Boolean(filterState.lipaPolePoleOnly)}
            className={`btn-press inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              filterState.lipaPolePoleOnly
                ? 'border-[#004B97] bg-[#004B97]/10 text-[#004B97] dark:border-sky-400 dark:bg-sky-400/15 dark:text-sky-300 font-semibold'
                : 'border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#5A606B] dark:text-slate-300 hover:border-[#004B97] dark:hover:border-sky-400'
            }`}
          >
            <span>Lipa Pole Pole</span>
            <span className="font-mono text-[10px] opacity-80">&gt;80k</span>
          </button>

          <select
            value={filterState.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as FilterState['sortBy'],
              })
            }
            aria-label="Sort catalog"
            className="rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-2.5 py-1.5 text-xs font-medium text-[#111315] dark:text-slate-200 focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none cursor-pointer"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="weight-desc">Mass: Heavy First</option>
          </select>
        </div>
      </div>

      {/* Sub-Category Architectural Drilldown Strip */}
      {currentCategoryConfig.subCategories && currentCategoryConfig.subCategories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-[#E2E4E8] dark:border-[#262A33]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#5A606B] dark:text-slate-500 mr-1 shrink-0">
            Sub-Type:
          </span>
          {currentCategoryConfig.subCategories.map((sub) => {
            const isAllSub = sub.id.startsWith('all-');
            const isActiveSub = isAllSub
              ? !filterState.subCategory ||
                filterState.subCategory === 'all' ||
                filterState.subCategory.startsWith('all-')
              : filterState.subCategory === sub.id;

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() =>
                  onFilterChange({ subCategory: isAllSub ? 'all' : sub.id })
                }
                className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isActiveSub
                    ? 'bg-[#111315] text-white dark:bg-white dark:text-[#111315]'
                    : 'bg-[#F6F6F4] dark:bg-[#111318] text-[#5A606B] dark:text-slate-300 border border-[#E2E4E8] dark:border-[#262A33] hover:border-[#004B97] dark:hover:border-sky-400 hover:text-[#111315] dark:hover:text-white'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* View Output: Product Grid */}
      {sortedProducts.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenDetails}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onToggleCompare={onToggleCompare}
              isCompared={compareList.some((p) => p.id === product.id)}
              onRequestProforma={onRequestProforma}
            />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-lg border border-dashed border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-12 text-center">
          <h3 className="font-display text-base font-bold text-[#111315] dark:text-white">
            No machinery matched your active criteria
          </h3>
          <p className="mt-1 text-xs text-[#5A606B] dark:text-slate-400 max-w-md mx-auto">
            Reset active search or category filters to view all {products.length} machines.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="btn-press mt-4 rounded-md bg-[#004B97] px-4 py-2 text-xs font-semibold text-white hover:bg-[#003B78] transition-colors cursor-pointer"
          >
            Clear Active Filters
          </button>
        </div>
      )}
    </section>
  );
};
