import React, { useState } from 'react';
import { X, Trash2, ShoppingCart, GitCompare, Check } from 'lucide-react';
import { Product } from '../types/machinery';
import { formatKSh } from '../utils/currency';

interface SpecComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareList: Product[];
  onRemoveItem: (productId: string) => void;
  onClearAll: () => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const SpecComparisonModal: React.FC<SpecComparisonModalProps> = ({
  isOpen,
  onClose,
  compareList,
  onRemoveItem,
  onClearAll,
  onAddToCart,
  onSelectProduct,
}) => {
  const [recentAddedId, setRecentAddedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickAdd = (product: Product) => {
    onAddToCart(product);
    setRecentAddedId(product.id);
    window.setTimeout(() => {
      setRecentAddedId((prev) => (prev === product.id ? null : prev));
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0F12]/65 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#111315] dark:text-[#F3F4F6] shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <GitCompare className="h-4 w-4 text-[#004B97] dark:text-sky-400" />
            <h2 className="font-display text-base sm:text-lg font-bold text-[#111315] dark:text-white tracking-tight">
              Side-by-Side Technical Spec Comparison
            </h2>
            <span className="font-mono text-xs text-[#5A606B] dark:text-slate-400 tabular-nums">
              ({compareList.length} selected)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-mono text-[#5A606B] dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-[#5A606B] dark:text-slate-400 hover:bg-[#E2E4E8] dark:hover:bg-[#262A33] hover:text-[#111315] dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close comparison"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Table / Matrix */}
        <div className="p-6 overflow-x-auto max-h-[75vh]">
          {compareList.length === 0 ? (
            <div className="py-16 text-center text-[#5A606B] dark:text-slate-400">
              <GitCompare className="mx-auto h-9 w-9 text-slate-300 dark:text-slate-600" />
              <p className="mt-3 font-display text-base font-bold text-[#111315] dark:text-white">
                No machinery selected for comparison
              </p>
              <p className="mt-1 text-xs text-[#5A606B] dark:text-slate-400 max-w-md mx-auto">
                Select the Compare toggle on up to four equipment cards in the catalog to evaluate specifications side-by-side.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[650px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E4E8] dark:border-[#262A33]">
                  <th className="w-48 pb-4 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5A606B] dark:text-slate-400 align-bottom">
                    Model / Parameter
                  </th>
                  {compareList.map((product) => (
                    <th key={product.id} className="pb-4 pr-4 font-normal align-top">
                      <div className="relative rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] p-3">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remove from comparison"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-24 w-full rounded object-cover bg-white dark:bg-[#15181E] border border-[#E2E4E8] dark:border-[#262A33] mb-2.5 cursor-pointer"
                          referrerPolicy="no-referrer"
                          onClick={() => {
                            onSelectProduct(product);
                            onClose();
                          }}
                        />
                        <span className="font-mono text-[10px] text-[#004B97] dark:text-sky-400 font-semibold block">
                          {product.sku}
                        </span>
                        <h4
                          className="font-display text-xs font-bold text-[#111315] dark:text-white truncate hover:text-[#004B97] dark:hover:text-sky-400 cursor-pointer mt-0.5"
                          onClick={() => {
                            onSelectProduct(product);
                            onClose();
                          }}
                          title={product.name}
                        >
                          {product.name}
                        </h4>
                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <span className="font-mono text-xs sm:text-sm font-bold text-[#111315] dark:text-white tabular-nums">
                            {formatKSh(product.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(product)}
                            className="btn-press flex items-center justify-center rounded bg-[#004B97] hover:bg-[#003B78] px-2.5 py-1 text-[11px] font-semibold text-white cursor-pointer min-w-[68px]"
                          >
                            <span className="kinetic-roll h-4">
                              <span
                                className={`kinetic-face ${
                                  recentAddedId === product.id
                                    ? '-translate-y-full opacity-0'
                                    : 'translate-y-0 opacity-100'
                                }`}
                              >
                                <ShoppingCart className="h-3 w-3 shrink-0" />
                                <span>Add</span>
                              </span>
                              <span
                                aria-hidden={recentAddedId !== product.id}
                                className={`kinetic-face absolute inset-0 ${
                                  recentAddedId === product.id
                                    ? 'translate-y-0 opacity-100'
                                    : 'translate-y-full opacity-0'
                                }`}
                              >
                                <Check className="h-3 w-3 stroke-[2.5] shrink-0" />
                                <span>Added</span>
                              </span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2E4E8] dark:divide-[#262A33] font-mono text-xs">
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#5A606B] dark:text-slate-400">
                    Category
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-2.5 pr-4 text-[#111315] dark:text-white font-sans font-medium">
                      {p.categoryLabel}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#5A606B] dark:text-slate-400">
                    Motor Rating
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-2.5 pr-4 text-[#111315] dark:text-white font-semibold">
                      {p.specs.motor}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#5A606B] dark:text-slate-400">
                    Voltage / Power
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-2.5 pr-4 text-[#111315] dark:text-slate-200">
                      {p.specs.voltage}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#5A606B] dark:text-slate-400">
                    Full Load Amps
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-2.5 pr-4 text-[#111315] dark:text-slate-200 tabular-nums">
                      {p.specs.amperage}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#5A606B] dark:text-slate-400">
                    Capacity
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-2.5 pr-4 text-[#111315] dark:text-slate-200 font-sans">
                      {p.specs.capacity}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#5A606B] dark:text-slate-400">
                    Mass / Net Weight
                  </td>
                  {compareList.map((p) => {
                    const kg = Math.round(p.specs.weightLbs * 0.453592);
                    return (
                      <td key={p.id} className="py-2.5 pr-4 text-[#111315] dark:text-white font-semibold tabular-nums">
                        {kg} kg <span className="text-[#5A606B] dark:text-slate-400 font-normal">({p.specs.weightLbs} lbs)</span>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#5A606B] dark:text-slate-400">
                    Machine Footprint
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-2.5 pr-4 text-[#5A606B] dark:text-slate-300">
                      {p.specs.footprint}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#5A606B] dark:text-slate-400">
                    Operating Speed / RPM
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-2.5 pr-4 text-[#111315] dark:text-slate-200">
                      {p.specs.rpm || 'Constant Industrial Speed'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#5A606B] dark:text-slate-400">
                    Tooling / Spindle Interface
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-2.5 pr-4 text-[#5A606B] dark:text-slate-300">
                      {p.specs.arborOrSpindle || 'Standard Tooling Hub'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#5A606B] dark:text-slate-400">
                    Dust Extraction / Port
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-2.5 pr-4 text-[#5A606B] dark:text-slate-300">
                      {p.specs.dustPortSize || 'Factory Sealed / Ambient'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#5A606B] dark:text-slate-400">
                    Standard Included Package
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-2.5 pr-4 text-[#5A606B] dark:text-slate-300 font-sans">
                      {p.includedItems ? `${p.includedItems.length} Accessories Included` : 'Standard Package'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 font-sans font-semibold text-[#5A606B] dark:text-slate-400">
                    Factory Warranty
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-2.5 pr-4 font-semibold text-emerald-700 dark:text-emerald-400">
                      {p.specs.warrantyYears} Years Commercial
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
