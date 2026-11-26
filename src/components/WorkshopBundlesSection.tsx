import React, { useState } from 'react';
import { ArrowRight, FileText, Wrench } from 'lucide-react';
import { Product } from '../types/machinery';
import { WORKSHOP_BUNDLES } from '../data/workshopBundles';
import { formatKSh } from '../utils/currency';

interface WorkshopBundlesSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onLoadBundleToCheckout: (items: { product: Product; quantity: number }[]) => void;
  onOpenBundleFinancePack: (items: { product: Product; quantity: number }[]) => void;
}

export const WorkshopBundlesSection: React.FC<WorkshopBundlesSectionProps> = ({
  products,
  onSelectProduct,
  onLoadBundleToCheckout,
  onOpenBundleFinancePack,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const resolvedBundles = WORKSHOP_BUNDLES.map((bundle) => {
    const machines = bundle.productIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));

    const regularTotal = machines.reduce((sum, m) => sum + m.price, 0);
    const packageSavings = Math.round(regularTotal * (bundle.discountPercent / 100));
    const bundleTotal = regularTotal - packageSavings;
    const lipaDeposit = Math.round(bundleTotal * 0.2);

    return {
      ...bundle,
      machines,
      regularTotal,
      packageSavings,
      bundleTotal,
      lipaDeposit,
    };
  }).filter((b) => b.machines.length > 0);

  if (resolvedBundles.length === 0) return null;

  return (
    <section
      id="workshop-bundles"
      className="border-t border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#0D0F12]"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E2E4E8] dark:border-[#262A33]">
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-[#004B97] dark:text-sky-400 font-medium">
              Turnkey Production &amp; Service Packages
            </span>
            <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold text-[#111315] dark:text-white tracking-tight text-balance">
              Complete Kenyan Workshop Starter Lines
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-[#5A606B] dark:text-slate-400 leading-relaxed">
              Pre-matched machine kits engineered for power compatibility, bay footprint, and single-freight dispatch—with 5% bundle rebate and ready-to-submit Bank / SACCO asset finance packs.
            </p>
          </div>

          <div className="font-mono text-xs text-[#5A606B] dark:text-slate-400 tabular-nums shrink-0">
            5% Package Rebate · 20% Deposit Eligible
          </div>
        </div>

        {/* 3-Column Bundle Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {resolvedBundles.map((bundle) => {
            const quoteItems = bundle.machines.map((m) => ({ product: m, quantity: 1 }));
            return (
              <article
                key={bundle.id}
                className="flex flex-col justify-between rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] overflow-hidden"
              >
                <div className="p-6 space-y-5 flex-1 flex flex-col">
                  {/* Top Editorial Kicker & Title */}
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#5A606B] dark:text-slate-400">
                      <span className="font-semibold text-[#004B97] dark:text-sky-400 tabular-nums">
                        {bundle.index}.
                      </span>
                      <span>{bundle.divisionLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{bundle.machines.length} Machines</span>
                    </div>

                    <h3 className="mt-1.5 font-display text-lg font-bold text-[#111315] dark:text-white tracking-tight text-balance">
                      {bundle.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#5A606B] dark:text-slate-400 leading-relaxed">
                      {bundle.targetBuyer}
                    </p>
                  </div>

                  {/* Site Spec Summary Rows */}
                  <dl className="divide-y divide-[#E2E4E8] dark:divide-[#262A33] border-y border-[#E2E4E8] dark:border-[#262A33] text-[11px]">
                    <div className="py-2 flex items-baseline justify-between gap-3">
                      <dt className="text-[#5A606B] dark:text-slate-400 shrink-0">Grid Supply</dt>
                      <dd className="font-mono font-medium text-[#111315] dark:text-slate-200 text-right truncate">
                        {bundle.powerRequirement}
                      </dd>
                    </div>
                    <div className="py-2 flex items-baseline justify-between gap-3">
                      <dt className="text-[#5A606B] dark:text-slate-400 shrink-0">Floor Space</dt>
                      <dd className="font-mono font-medium text-[#111315] dark:text-slate-200 text-right truncate">
                        {bundle.floorFootprint}
                      </dd>
                    </div>
                  </dl>

                  {/* Included Machines List */}
                  <div className="space-y-2 flex-1">
                    <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-[#5A606B] dark:text-slate-400">
                      Included Equipment (Click to Inspect)
                    </span>
                    <ul className="divide-y divide-[#E2E4E8]/70 dark:divide-[#262A33]/70">
                      {bundle.machines.map((machine) => {
                        const imgBroken = failedImages[machine.id];
                        return (
                          <li key={machine.id} className="py-2 first:pt-1 last:pb-1">
                            <button
                              type="button"
                              onClick={() => onSelectProduct(machine)}
                              className="group w-full flex items-center justify-between gap-3 text-left cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="h-9 w-9 rounded border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#0D0F12] overflow-hidden shrink-0 flex items-center justify-center">
                                  {!imgBroken ? (
                                    <img
                                      src={machine.image}
                                      alt={machine.name}
                                      onError={() =>
                                        setFailedImages((prev) => ({ ...prev, [machine.id]: true }))
                                      }
                                      className="h-full w-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <Wrench className="h-4 w-4 text-[#004B97] dark:text-sky-400" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <span className="block text-xs font-semibold text-[#111315] dark:text-slate-100 group-hover:text-[#004B97] dark:group-hover:text-sky-400 transition-colors truncate">
                                    {machine.name}
                                  </span>
                                  <span className="block font-mono text-[10px] text-[#5A606B] dark:text-slate-400 tabular-nums">
                                    {machine.sku} · {machine.specs.motor}
                                  </span>
                                </div>
                              </div>
                              <span className="font-mono text-[11px] font-semibold text-[#111315] dark:text-slate-200 tabular-nums shrink-0">
                                {formatKSh(machine.price)}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Commissioning Note */}
                  <p className="text-[11px] text-[#5A606B] dark:text-slate-400 pt-1">
                    Includes: <span className="text-[#111315] dark:text-slate-200">{bundle.commissioningPerk}</span>
                  </p>
                </div>

                {/* Footer Pricing & Actions */}
                <div className="border-t border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4]/70 dark:bg-[#111318] p-6 space-y-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <span className="block font-mono text-[10px] text-[#5A606B] dark:text-slate-400">
                        Turnkey Kit Total (Excl. VAT)
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-mono text-xl font-bold text-[#111315] dark:text-white tabular-nums">
                          {formatKSh(bundle.bundleTotal)}
                        </span>
                        <span className="font-mono text-[11px] text-[#5A606B] dark:text-slate-500 line-through tabular-nums">
                          {formatKSh(bundle.regularTotal)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                        Save {formatKSh(bundle.packageSavings)}
                      </span>
                      <span className="block font-mono text-[10px] text-[#004B97] dark:text-sky-400 tabular-nums">
                        20% down: {formatKSh(bundle.lipaDeposit)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => onLoadBundleToCheckout(quoteItems)}
                      className="btn-press btn-nudge flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-[#004B97] hover:bg-[#003B78] px-4 py-2.5 text-xs font-semibold text-white cursor-pointer whitespace-nowrap"
                    >
                      <span>Load Kit to Checkout</span>
                      <ArrowRight className="h-3.5 w-3.5 btn-arrow" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenBundleFinancePack(quoteItems)}
                      className="btn-press inline-flex items-center justify-center gap-1.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] hover:border-[#004B97] dark:hover:border-sky-400 px-3.5 py-2.5 text-xs font-semibold text-[#111315] dark:text-slate-200 cursor-pointer whitespace-nowrap"
                    >
                      <FileText className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400" />
                      <span>Bank / SACCO PDF</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
