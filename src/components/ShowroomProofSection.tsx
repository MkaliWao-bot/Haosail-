import React from 'react';
import { ArrowRight } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';

interface ShowroomProofSectionProps {
  onOpenProforma: () => void;
  onOpenAdvisor: () => void;
}

export const ShowroomProofSection: React.FC<ShowroomProofSectionProps> = ({
  onOpenProforma,
  onOpenAdvisor,
}) => {
  return (
    <section className="border-t border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#E2E4E8] dark:border-[#262A33]">
          <div>
            <span className="font-mono text-xs text-[#004B97] dark:text-sky-400 font-medium">
              Commercial Procurement &amp; Commissioning
            </span>
            <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold text-[#111315] dark:text-white tracking-tight">
              Inspected on Kenyan Floor Yards Before Dispatch
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onOpenProforma}
              className="btn-press btn-nudge inline-flex items-center gap-2 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#0D0F12] px-4 py-2 text-xs font-semibold text-[#111315] dark:text-white hover:border-[#004B97] dark:hover:border-sky-400 cursor-pointer whitespace-nowrap"
            >
              <span>Request E-TIMS Proforma</span>
              <ArrowRight className="h-3.5 w-3.5 btn-arrow text-[#004B97] dark:text-sky-400" />
            </button>

            <button
              type="button"
              onClick={onOpenAdvisor}
              className="text-xs font-medium text-[#004B97] dark:text-sky-400 hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
            >
              Consult Workshop Engineer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E2E4E8] dark:divide-[#262A33]">
          <div className="py-6 md:py-7 md:pr-8 space-y-2">
            <div className="font-mono text-xs text-[#004B97] dark:text-sky-400 tabular-nums">
              01. Nairobi &amp; Mombasa Yards
            </div>
            <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white">
              Live Power-On Inspection
            </h3>
            <p className="text-xs text-[#5A606B] dark:text-slate-400 leading-relaxed">
              Test spindle runout, hydraulic pressure holds, and panel alignment in person at Plot 48 Enterprise Rd (Nairobi) or our Changamwe depot (Mombasa) prior to loading.
            </p>
          </div>

          <div className="py-6 md:py-7 md:px-8 space-y-2">
            <div className="font-mono text-xs text-[#004B97] dark:text-sky-400 tabular-nums">
              02. KRA E-TIMS &amp; Flexible Deposit
            </div>
            <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white">
              Verified Tax &amp; Lipa Pole Pole Papers
            </h3>
            <p className="text-xs text-[#5A606B] dark:text-slate-400 leading-relaxed">
              Every machine above KSh 80,000 supports 20%–50% deposit via M-Pesa Paybill {STORE_CONFIG.paybill} alongside official KRA E-TIMS proformas for SACCO and commercial bank financing.
            </p>
          </div>

          <div className="py-6 md:py-7 md:pl-8 space-y-2">
            <div className="font-mono text-xs text-[#004B97] dark:text-sky-400 tabular-nums">
              03. 47-County Freight &amp; 50Hz Calibration
            </div>
            <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white">
              Tailgate &amp; Crane Delivery
            </h3>
            <p className="text-xs text-[#5A606B] dark:text-slate-400 leading-relaxed">
              Free freight above KSh 200,000 across Nairobi hubs, with factory 230V single-phase or 400V three-phase 50Hz wiring verified before county dispatch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
