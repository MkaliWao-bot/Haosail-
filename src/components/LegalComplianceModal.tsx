import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, FileText, CreditCard, Lock } from 'lucide-react';
import { STORE_CONFIG } from '../config/storeConfig';

export type LegalTab = 'terms' | 'warranty' | 'credit' | 'privacy';

interface LegalComplianceModalProps {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
}

export const LegalComplianceModal: React.FC<LegalComplianceModalProps> = ({
  isOpen,
  initialTab = 'terms',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const tabs: { id: LegalTab; label: string; icon: React.ReactNode }[] = [
    { id: 'terms', label: 'Terms of Sale', icon: <FileText className="h-3.5 w-3.5" /> },
    { id: 'warranty', label: '5-Year Warranty', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    { id: 'credit', label: 'Lipa Pole Pole & LPO', icon: <CreditCard className="h-3.5 w-3.5" /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <Lock className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto print:hidden">
      <div
        className="fixed inset-0 bg-[#0D0F12]/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#111315] dark:text-[#F3F4F6] shadow-2xl my-auto">
        <div className="flex items-center justify-between border-b border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] px-6 py-4">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#004B97] dark:text-sky-400 block">
              {STORE_CONFIG.brandName} · Commercial Compliance
            </span>
            <h2 className="font-display text-base font-bold text-[#111315] dark:text-white tracking-tight">
              Commercial Terms, Factory Warranty &amp; Data Protection
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close legal compliance modal"
            className="rounded-md p-1.5 text-[#5A606B] dark:text-slate-400 hover:bg-[#E2E4E8] dark:hover:bg-[#262A33] hover:text-[#111315] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex border-b border-[#E2E4E8] dark:border-[#262A33] px-6 gap-5 text-xs font-semibold overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'border-[#004B97] text-[#004B97] dark:border-sky-400 dark:text-sky-400'
                  : 'border-transparent text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5 text-xs leading-relaxed text-[#5A606B] dark:text-slate-300">
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white mb-1.5">
                  01. Pricing, 16% VAT &amp; KRA eTIMS Compliance
                </h3>
                <p>
                  All catalog equipment prices are quoted in Kenyan Shillings (KES) excluding Value Added Tax unless explicitly labelled otherwise. At checkout and on every official proforma invoice, 16% Kenya Revenue Authority (KRA) VAT is calculated transparently on the taxable subtotal and issued under company PIN <span className="font-mono font-semibold text-[#111315] dark:text-white">{STORE_CONFIG.companyKraPin}</span> with a verifiable eTIMS control reference.
                </p>
              </div>
              <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-4">
                <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white mb-1.5">
                  02. Dispatch, Pre-Shipment Testing &amp; County Freight
                </h3>
                <p>
                  Every industrial machine undergoes power-on calibration (230V single-phase or 400V three-phase 50Hz verification) at <span className="font-semibold text-[#111315] dark:text-white">{STORE_CONFIG.yardAddress}</span> prior to loading. Freight to Nairobi hubs is complimentary above KSh 200,000, while regional county transit across all 47 counties is insured in transit until signed yard or workshop handover.
                </p>
              </div>
              <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-4">
                <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white mb-1.5">
                  03. Settlement &amp; Proforma Validity
                </h3>
                <p>
                  Printed and PDF KRA eTIMS proforma invoices remain valid for 30 calendar days from issuance. Bank wire transfers settle to <span className="font-mono text-[#111315] dark:text-white">{STORE_CONFIG.bankName} ({STORE_CONFIG.bankBranch}), Acc {STORE_CONFIG.bankAccount}</span> or via Lipa na M-Pesa Paybill <span className="font-mono text-[#111315] dark:text-white">{STORE_CONFIG.paybill}</span> quoting your unique order reference.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white mb-1.5">
                  01. 5-Year Commercial Structural &amp; Gearbox Warranty
                </h3>
                <p>
                  HaoSail Industrial Kenya warrants structural cast-iron frames, hydraulic cylinders, main drive spindles, and primary gearboxes for 60 months (5 years) from invoice handover against manufacturing or metallurgical defects under normal commercial operation.
                </p>
              </div>
              <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-4">
                <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white mb-1.5">
                  02. Electrical Motors, Sealing Kits &amp; Exclusions
                </h3>
                <p>
                  Industrial motors, inverters, contactors, and hydraulic power packs carry a 24-month replacement warranty when operated behind proper surge protection and correct phase supply. Routine wear consumables (saw blades, belts, sandpaper, TIG nozzles, hydraulic oil) and damage from un-grounded generators are excluded.
                </p>
              </div>
              <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-4">
                <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white mb-1.5">
                  03. On-Site Nairobi &amp; Regional Technician Dispatch
                </h3>
                <p>
                  Warranty claims are triaged within 24 business hours via <span className="font-mono text-[#111315] dark:text-white">{STORE_CONFIG.salesPhoneDisplay}</span> or <span className="font-mono text-[#111315] dark:text-white">{STORE_CONFIG.salesEmail}</span>, with spare assemblies stocked at our Industrial Area Nairobi depot.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'credit' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white mb-1.5">
                  01. Lipa Pole Pole Equipment Financing (&gt; KSh 80,000)
                </h3>
                <p>
                  Workshop owners and contractors procuring equipment orders exceeding KSh 80,000 may select a 20%, 30%, 40%, or 50% down payment settled via M-Pesa Paybill <span className="font-mono text-[#111315] dark:text-white">{STORE_CONFIG.paybill}</span> or RTGS wire, with the financed balance scheduled over 6–24 monthly or 12–52 weekly installments at a transparent 12% per annum flat administrative schedule.
                </p>
              </div>
              <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-4">
                <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white mb-1.5">
                  02. Release &amp; Ownership Covenant
                </h3>
                <p>
                  Machinery is released for workshop installation upon verification of the initial deposit and execution of the credit schedule alongside National ID / Certificate of Incorporation and KRA PIN verification. Title transfers in full upon completion of final installment.
                </p>
              </div>
              <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-4">
                <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white mb-1.5">
                  03. Corporate LPO &amp; TVET Institutional Credit
                </h3>
                <p>
                  Registered Kenyan limited companies, county governments, and accredited TVET polytechnics may submit official Local Purchase Orders (LPOs) for 30-day net commercial settlement subject to credit desk verification.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white mb-1.5">
                  01. Kenya Data Protection Act Compliance
                </h3>
                <p>
                  HaoSail Industrial Kenya collects contact names, business names, Safaricom numbers, delivery coordinates, and KRA PIN numbers strictly for tax invoicing (eTIMS), equipment warranty registration, and county freight coordination in accordance with the Data Protection Act, 2019 (Kenya).
                </p>
              </div>
              <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-4">
                <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white mb-1.5">
                  02. Strict Per-Account Isolation &amp; Storage
                </h3>
                <p>
                  Private customer tax and contact fields are stored under isolated, UID-bound security rules accessible only to the verified account holder and authorized dispatch staff. Browsing the catalog and generating guest proforma quotes requires zero account creation.
                </p>
              </div>
              <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-4">
                <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white mb-1.5">
                  03. Data Access &amp; Deletion Requests
                </h3>
                <p>
                  You may edit your workshop profile inside the Account Portal at any time or request record export or deletion via <span className="font-mono text-[#111315] dark:text-white">{STORE_CONFIG.salesEmail}</span>.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] px-6 py-3.5 text-[11px] font-mono text-[#5A606B] dark:text-slate-400">
          <span>Questions? {STORE_CONFIG.salesPhoneDisplay} · {STORE_CONFIG.salesEmail}</span>
          <button
            type="button"
            onClick={onClose}
            className="btn-press rounded-md bg-[#004B97] hover:bg-[#003B78] px-4 py-1.5 text-xs font-sans font-semibold text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
