import React from 'react';
import {
  X,
  Printer,
  Download,
  FileSpreadsheet,
  Check,
  FileText,
  MessageCircle,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { Product } from '../types/machinery';
import { formatKSh } from '../utils/currency';
import { HaoSailLogo } from './HaoSailLogo';
import { KENYAN_COUNTY_HUBS } from '../data/accessoryData';
import { buildProductWhatsAppUrl } from '../utils/whatsapp';

interface SpecSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  selectedVoltage?: string;
  selectedCountyId?: string;
  onRequestProforma?: (product: Product) => void;
}

export const SpecSheetModal: React.FC<SpecSheetModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedVoltage,
  selectedCountyId = 'nairobi',
  onRequestProforma,
}) => {
  if (!isOpen || !product) return null;

  const weightKg = Math.round(product.specs.weightLbs * 0.453592);
  const effectiveVoltage = selectedVoltage || product.specs.voltage;
  const county =
    KENYAN_COUNTY_HUBS.find((c) => c.id === selectedCountyId) || KENYAN_COUNTY_HUBS[0];
  const docRef = `HS-TDS-${product.sku}`;
  const issueDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const lipaMonthlyFrom =
    product.price > 80000 ? Math.round((product.price * 0.7 * (1 + 0.12 * 2)) / 24) : null;

  const freightLabel =
    product.freightTier === 'heavy-freight'
      ? 'Heavy Flatbed / Forklift Offload'
      : product.freightTier === 'freight-ltl'
      ? 'LTL Tailgate Freight'
      : 'Standard Parcel / Depot Dispatch';

  const specRows: { label: string; value: string }[] = [
    { label: 'Model / SKU', value: product.sku },
    { label: 'Division', value: product.categoryLabel },
    { label: 'Motor / Engine Output', value: product.specs.motor },
    { label: 'Electrical Supply', value: effectiveVoltage },
    { label: 'Rated Amperage / Output', value: product.specs.amperage },
    { label: 'Work Capacity / Envelope', value: product.specs.capacity },
    { label: 'Overall Footprint', value: product.specs.footprint },
    {
      label: 'Net Operating Mass',
      value: `${weightKg.toLocaleString()} kg (${product.specs.weightLbs.toLocaleString()} lbs)`,
    },
    ...(product.specs.rpm ? [{ label: 'Speed / Drive RPM', value: product.specs.rpm }] : []),
    ...(product.specs.arborOrSpindle
      ? [{ label: 'Arbor / Spindle Spec', value: product.specs.arborOrSpindle }]
      : []),
    ...(product.specs.bladeSize
      ? [{ label: 'Tooling / Blade Dimension', value: product.specs.bladeSize }]
      : []),
    ...(product.specs.dustPortSize
      ? [{ label: 'Extraction Port Size', value: product.specs.dustPortSize }]
      : []),
    { label: 'Commercial Warranty', value: `${product.specs.warrantyYears} Years Parts & Labour` },
    { label: 'Logistics Classification', value: freightLabel },
  ];

  const whatsappUrl = buildProductWhatsAppUrl(product, {
    selectedVoltage: effectiveVoltage,
    selectedCountyName: `${county.county} (${county.mainTown})`,
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:static">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0F12]/72 backdrop-blur-sm transition-opacity print:hidden"
        onClick={onClose}
      />

      {/* A4 Spec Sheet Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#111315] dark:text-[#F3F4F6] shadow-2xl my-auto print:max-h-none print:shadow-none print:border-none print:m-0 print:p-0 print:bg-white print:text-slate-900">
        {/* Sticky Top Toolbar (Hidden on print) */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4]/95 dark:bg-[#111318]/95 px-5 py-3 backdrop-blur-sm print:hidden">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-[#004B97] dark:text-sky-400" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111315] dark:text-white">
              Technical Specification Sheet · {product.sku}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-md bg-[#004B97] hover:bg-[#003B78] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-[#5A606B] dark:text-slate-400 hover:bg-[#E2E4E8] dark:hover:bg-[#262A33] hover:text-[#111315] dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close specification sheet"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Datasheet Body */}
        <div className="p-6 sm:p-8 space-y-6 print:p-6">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 border-b border-[#E2E4E8] dark:border-[#262A33] pb-5 print:border-slate-300">
            <div>
              <span className="dark:hidden print:inline-block">
                <HaoSailLogo className="h-9" variant="full" inverted={false} />
              </span>
              <span className="hidden dark:inline-block print:hidden">
                <HaoSailLogo className="h-9" variant="full" inverted={true} />
              </span>
              <p className="mt-2 text-xs font-semibold text-[#111315] dark:text-white print:text-slate-900">
                HAOSAIL INDUSTRIAL KENYA LIMITED · TECHNICAL ENGINEERING DESK
              </p>
              <p className="text-[11px] text-[#5A606B] dark:text-slate-400 mt-0.5 print:text-slate-600">
                Plot 48, Enterprise Road, Industrial Area, Nairobi · +254 700 000 000
              </p>
            </div>

            <div className="sm:text-right bg-[#F6F6F4] dark:bg-[#111318] p-3.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] shrink-0 min-w-52 print:bg-slate-50 print:border-slate-300">
              <span className="inline-block font-mono text-[10px] font-semibold uppercase tracking-widest text-white bg-[#004B97] px-2 py-0.5 rounded">
                TECHNICAL DATASHEET
              </span>
              <div className="font-mono text-sm font-bold text-[#111315] dark:text-white mt-1.5 tabular-nums print:text-slate-900">
                {docRef}
              </div>
              <div className="text-[11px] font-mono text-[#5A606B] dark:text-slate-400 mt-0.5 print:text-slate-600">
                Issued: {issueDate}
              </div>
            </div>
          </div>

          {/* Hero Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
            <div className="sm:col-span-5">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#ECECE8] dark:bg-[#1C2029] print:border-slate-300">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="sm:col-span-7 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#004B97] dark:text-sky-400 font-semibold print:text-[#004B97]">
                  <span>{product.sku}</span>
                  <span>·</span>
                  <span className="text-[#5A606B] dark:text-slate-400 print:text-slate-600">
                    {product.subCategoryLabel || product.categoryLabel}
                  </span>
                </div>
                <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold text-[#111315] dark:text-white tracking-tight print:text-slate-900">
                  {product.name}
                </h2>
                <p className="mt-1.5 text-xs text-[#5A606B] dark:text-slate-300 leading-relaxed print:text-slate-700">
                  {product.description}
                </p>
              </div>

              {/* Price & Nairobi Stock Ledger Strip */}
              <div className="grid grid-cols-2 divide-x divide-[#E2E4E8] dark:divide-[#262A33] rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] p-3 print:bg-slate-50 print:border-slate-300 print:divide-slate-300">
                <div className="pr-3">
                  <span className="block font-mono text-[10px] uppercase text-[#5A606B] dark:text-slate-400 print:text-slate-600">
                    List Price (Excl. 16% VAT)
                  </span>
                  <span className="font-mono text-lg font-bold text-[#111315] dark:text-white tabular-nums print:text-slate-900">
                    {formatKSh(product.price)}
                  </span>
                  {lipaMonthlyFrom && (
                    <span className="block font-mono text-[10px] text-[#004B97] dark:text-sky-400 tabular-nums print:text-[#004B97]">
                      Lipa Pole Pole from {formatKSh(lipaMonthlyFrom)}/mo
                    </span>
                  )}
                </div>
                <div className="pl-3">
                  <span className="block font-mono text-[10px] uppercase text-[#5A606B] dark:text-slate-400 print:text-slate-600">
                    Dispatch Status ({county.mainTown})
                  </span>
                  <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 block mt-0.5 print:text-emerald-800">
                    {product.inStock ? `${product.stockCount} Ready in Nairobi` : 'Factory Allocation'}
                  </span>
                  <span className="block font-mono text-[10px] text-[#5A606B] dark:text-slate-400 print:text-slate-600">
                    Lead Time: {county.transitHours}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Engineering Specifications Grid Table */}
          <div>
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#004B97] dark:text-sky-400 mb-2.5 print:text-[#004B97]">
              01 / Verified Technical Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 border border-[#E2E4E8] dark:border-[#262A33] rounded-md overflow-hidden print:border-slate-300">
              {specRows.map((row, idx) => (
                <div
                  key={row.label}
                  className={`flex items-baseline justify-between gap-4 px-3.5 py-2.5 text-xs border-b border-[#E2E4E8] dark:border-[#262A33] print:border-slate-200 ${
                    idx % 2 === 0 ? 'sm:border-r' : ''
                  } ${idx >= specRows.length - 2 ? 'sm:border-b-0' : ''} last:border-b-0 bg-white dark:bg-[#15181E] print:bg-white`}
                >
                  <span className="text-[#5A606B] dark:text-slate-400 shrink-0 print:text-slate-600">
                    {row.label}
                  </span>
                  <span className="font-mono font-semibold text-[#111315] dark:text-white text-right tabular-nums print:text-slate-900">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Engineering Features & Factory Crate Manifest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
            <div>
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#004B97] dark:text-sky-400 mb-2.5 print:text-[#004B97]">
                02 / Key Engineering Capabilities
              </h3>
              <ul className="space-y-2 text-xs text-[#111315] dark:text-slate-200 print:text-slate-800">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400 shrink-0 mt-0.5 print:text-[#004B97]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#004B97] dark:text-sky-400 mb-2.5 print:text-[#004B97]">
                03 / Standard Crate &amp; Accessories
              </h3>
              <ul className="space-y-2 text-xs text-[#111315] dark:text-slate-200 print:text-slate-800">
                {product.includedItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Package className="h-3.5 w-3.5 text-[#5A606B] dark:text-slate-400 shrink-0 mt-0.5 print:text-slate-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Verification & Interactive Action Bar */}
          <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:border-slate-300">
            <div className="flex items-center gap-2 text-[11px] text-[#5A606B] dark:text-slate-400 font-mono print:text-slate-600">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                KEBS / ISO Workshop Spec · KRA E-TIMS Registered · Enterprise Rd, Nairobi
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 print:hidden">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press inline-flex items-center gap-1.5 rounded-md border border-emerald-600/30 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>WhatsApp Desk</span>
              </a>

              {onRequestProforma && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestProforma(product);
                  }}
                  className="btn-press inline-flex items-center gap-1.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] px-3 py-2 text-xs font-semibold text-[#111315] dark:text-slate-200 hover:border-[#004B97] dark:hover:border-sky-400 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400" />
                  <span>Proforma Quote</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => window.print()}
                className="btn-press inline-flex items-center gap-1.5 rounded-md bg-[#004B97] hover:bg-[#003B78] px-4 py-2 text-xs font-semibold text-white cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Save PDF Spec Sheet</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
