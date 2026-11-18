import React, { useState } from 'react';
import { ShoppingBag, Check, FileText, Wrench } from 'lucide-react';
import { Product } from '../types/machinery';
import { formatKSh } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow?: (product: Product, quantity?: number) => void;
  onToggleCompare: (product: Product) => void;
  isCompared: boolean;
  onRequestProforma?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onAddToCart,
  onToggleCompare,
  isCompared,
  onRequestProforma,
}) => {
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const isLipaEligible = product.price > 80000;
  const lipaEntryDeposit = Math.round(product.price * 0.2);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  const handleProforma = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRequestProforma) {
      onRequestProforma(product);
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompare(product);
  };

  return (
    <article
      onClick={() => onOpenDetails(product)}
      className="group flex flex-col justify-between overflow-hidden rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] hover:border-[#004B97] dark:hover:border-sky-400 transition-colors duration-150 cursor-pointer text-left"
    >
      {/* 1. Unobstructed 4:3 Machine & Workshop Visual */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECECE8] dark:bg-[#1C2029] border-b border-[#E2E4E8] dark:border-[#262A33]">
        {!imgFailed ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#ECECE8] to-[#E2E4E8] dark:from-[#1C2029] dark:to-[#111318] p-4 text-center">
            <Wrench className="h-6 w-6 text-[#004B97] dark:text-sky-400" />
            <span className="font-mono text-[11px] font-semibold text-[#111315] dark:text-white">
              {product.sku}
            </span>
            <span className="text-[11px] text-[#5A606B] dark:text-slate-400 line-clamp-1">
              {product.name}
            </span>
          </div>
        )}
      </div>

      {/* 2. Architectural Typographic Body */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Top Metadata & Quiet Text Compare Action */}
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
            <span className="font-semibold text-[#004B97] dark:text-sky-400 truncate">
              {product.sku}
            </span>

            <button
              type="button"
              onClick={handleCompare}
              aria-pressed={isCompared}
              className={`inline-flex items-center gap-1 font-mono text-[11px] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isCompared
                  ? 'font-semibold text-[#004B97] dark:text-sky-400'
                  : 'text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white'
              }`}
            >
              {isCompared ? (
                <>
                  <Check className="h-3 w-3 stroke-[2.5]" />
                  <span>Comparing</span>
                </>
              ) : (
                <span>+ Compare</span>
              )}
            </button>
          </div>

          {/* 2-Line Aligned Title */}
          <h3 className="mt-2 font-display text-[15px] font-bold leading-snug text-[#111315] dark:text-white group-hover:text-[#004B97] dark:group-hover:text-sky-400 transition-colors line-clamp-2 min-h-[2.625rem]">
            {product.name}
          </h3>

          {/* Clean Unboxed Stock & Freight Cue */}
          <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-[#5A606B] dark:text-slate-400 tabular-nums">
            <span
              className={
                product.inStock
                  ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                  : 'text-[#5A606B] dark:text-slate-400'
              }
            >
              {product.inStock ? `In Stock (${product.stockCount})` : 'Special Order'}
            </span>
            {product.isFreeFreight && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate">Free Delivery</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. Divided Tabular Price & Lipa Pole Pole Ledger */}
      <div className="grid grid-cols-2 divide-x divide-[#E2E4E8] dark:divide-[#262A33] border-t border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4]/60 dark:bg-[#111318]/65">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-1 text-[11px] text-[#5A606B] dark:text-slate-400">
            <span>Cash Price</span>
            {product.originalPrice &&
              product.originalPrice > product.price &&
              Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) >= 15 && (
                <span className="font-mono text-[10px] font-semibold text-amber-700 dark:text-amber-400 tabular-nums">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-baseline gap-1.5">
            <span className="font-mono text-[15px] font-bold text-[#111315] dark:text-white tabular-nums tracking-tight">
              {formatKSh(product.price)}
            </span>
            {product.originalPrice &&
              product.originalPrice > product.price &&
              Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) >= 15 && (
                <span className="font-mono text-[11px] text-[#5A606B] dark:text-slate-500 line-through tabular-nums">
                  {formatKSh(product.originalPrice)}
                </span>
              )}
          </div>
        </div>

        <div className="px-4 py-3">
          <div className="text-[11px] text-[#5A606B] dark:text-slate-400 truncate">
            {isLipaEligible ? 'Lipa 20% Down' : 'Settlement'}
          </div>
          <div
            className={`mt-0.5 font-mono text-[14px] font-semibold tabular-nums truncate ${
              isLipaEligible
                ? 'text-[#004B97] dark:text-sky-400'
                : 'text-[#5A606B] dark:text-slate-400'
            }`}
          >
            {isLipaEligible ? formatKSh(lipaEntryDeposit) : 'Full Cash'}
          </div>
        </div>
      </div>

      {/* 4. Flush Architectural Action Bar */}
      <div className="flex items-stretch divide-x divide-[#E2E4E8] dark:divide-[#262A33] border-t border-[#E2E4E8] dark:border-[#262A33]">
        <button
          type="button"
          onClick={handleAdd}
          className="btn-press flex flex-1 items-center justify-center bg-[#004B97] hover:bg-[#003B78] px-4 py-2.5 text-xs font-semibold text-white cursor-pointer whitespace-nowrap"
        >
          <span className="kinetic-roll">
            <span
              className={`kinetic-face ${
                isAddedRecently
                  ? '-translate-y-full opacity-0'
                  : 'translate-y-0 opacity-100'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
              <span>Add to Cart</span>
            </span>
            <span
              aria-hidden={!isAddedRecently}
              className={`kinetic-face absolute inset-0 ${
                isAddedRecently
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-full opacity-0'
              }`}
            >
              <Check className="h-3.5 w-3.5 stroke-[2.5] shrink-0" />
              <span>Added</span>
            </span>
          </span>
        </button>

        {onRequestProforma && (
          <button
            type="button"
            onClick={handleProforma}
            title="Generate E-TIMS Proforma Quote"
            className="btn-press inline-flex items-center justify-center gap-1.5 bg-white dark:bg-[#15181E] px-4 py-2.5 text-xs font-medium text-[#111315] dark:text-slate-200 hover:bg-[#F6F6F4] dark:hover:bg-[#1C2029] hover:text-[#004B97] dark:hover:text-sky-400 cursor-pointer whitespace-nowrap shrink-0"
          >
            <FileText className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400" />
            <span>Quote</span>
          </button>
        )}
      </div>
    </article>
  );
};
