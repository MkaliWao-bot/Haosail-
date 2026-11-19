import React, { useState } from 'react';
import {
  X, Printer, Download, ShieldCheck, FileText,
  ArrowRight, Check, Copy,
} from 'lucide-react';
import { Product, CartItem } from '../types/machinery';
import { formatKSh } from '../utils/currency';
import { HaoSailLogo } from './HaoSailLogo';
import { KENYAN_COUNTY_HUBS } from '../data/accessoryData';
import { STORE_CONFIG } from '../config/storeConfig';

interface ProformaInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  cartItems?: CartItem[];
  onProceedToCheckout?: () => void;
}

export const ProformaInvoiceModal: React.FC<ProformaInvoiceModalProps> = ({
  isOpen,
  onClose,
  product,
  cartItems = [],
  onProceedToCheckout,
}) => {
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [kraPin, setKraPin] = useState('');
  const [countyId, setCountyId] = useState('nairobi');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Selected items: either passed single product or the current cart
  const items: { product: Product; quantity: number }[] = product
    ? [{ product, quantity: 1 }]
    : cartItems.length > 0
    ? cartItems
    : [];

  const invoiceNumber = `HS-PRF-2026-${Math.floor(1000 + (product ? product.price % 9000 : 4821))}`;
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const validUntilDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const currentCounty = KENYAN_COUNTY_HUBS.find((c) => c.id === countyId) || KENYAN_COUNTY_HUBS[0];

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const deliveryCost = items.length === 0 ? 0 : subtotal > 200000 ? 0 : currentCounty.depotPickupCost;
  const taxableSubtotal = subtotal + deliveryCost;
  const vat16 = Math.round(taxableSubtotal * 0.16);
  const grandTotal = taxableSubtotal + vat16;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFillSample = () => {
    setCompanyName('Equator Precision Millwork Ltd');
    setClientName('David Mwangi');
    setKraPin('P051839201Z');
  };

  const handleClearClient = () => {
    setCompanyName('');
    setClientName('');
    setKraPin('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:static">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0F12]/70 backdrop-blur-sm transition-opacity print:hidden"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#111315] dark:text-[#F3F4F6] shadow-2xl my-auto print:max-h-none print:shadow-none print:border-none print:m-0 print:p-0 print:bg-white print:text-slate-900">
        {/* Top Control Bar (Hidden on print) */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4]/95 dark:bg-[#111318]/95 px-5 py-3 backdrop-blur-sm print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#004B97] dark:text-sky-400" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111315] dark:text-white">
              KRA E-TIMS Proforma Document
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] px-3 py-1.5 text-xs font-medium text-[#111315] dark:text-slate-200 hover:border-[#004B97] dark:hover:border-sky-400 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] px-3 py-1.5 text-xs font-medium text-[#111315] dark:text-slate-200 hover:border-[#004B97] dark:hover:border-sky-400 transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-[#5A606B] dark:text-slate-400" />
              )}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-[#5A606B] dark:text-slate-400 hover:bg-[#E2E4E8] dark:hover:bg-[#262A33] hover:text-[#111315] dark:hover:text-white transition-colors cursor-pointer ml-1"
              aria-label="Close proforma modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Proforma Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Block: Logo & Invoice Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[#E2E4E8] dark:border-[#262A33] pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="dark:hidden print:inline-block">
                  <HaoSailLogo className="h-10" variant="full" inverted={false} />
                </span>
                <span className="hidden dark:inline-block print:hidden">
                  <HaoSailLogo className="h-10" variant="full" inverted={true} />
                </span>
              </div>
              <p className="mt-2.5 text-xs font-semibold text-[#111315] dark:text-white print:text-slate-900">
                {STORE_CONFIG.brandName.toUpperCase()} LIMITED
              </p>
              <p className="text-[11px] text-[#5A606B] dark:text-slate-400 leading-relaxed mt-0.5 print:text-slate-600">
                {STORE_CONFIG.yardAddress}
                <br />
                {STORE_CONFIG.salesPhoneDisplay} · {STORE_CONFIG.salesEmail}
                <br />
                PIN: <span className="font-mono font-semibold text-[#111315] dark:text-white print:text-slate-900">{STORE_CONFIG.companyKraPin}</span> | E-TIMS Reg: ET-NB-49821
              </p>
            </div>

            <div className="sm:text-right bg-[#F6F6F4] dark:bg-[#111318] p-4 rounded-lg border border-[#E2E4E8] dark:border-[#262A33] shrink-0 min-w-56 print:bg-slate-50 print:border-slate-200">
              <span className="inline-block font-mono text-[10px] font-semibold uppercase tracking-widest text-white bg-[#004B97] px-2 py-0.5 rounded">
                PROFORMA INVOICE
              </span>
              <h2 className="font-mono text-base font-bold text-[#111315] dark:text-white mt-2 tabular-nums print:text-slate-900">
                {invoiceNumber}
              </h2>
              <div className="text-[11px] text-[#5A606B] dark:text-slate-400 font-mono mt-1 space-y-0.5 print:text-slate-600">
                <div>
                  Issue Date:{' '}
                  <span className="text-[#111315] dark:text-slate-200 font-semibold print:text-slate-900">
                    {currentDate}
                  </span>
                </div>
                <div>
                  Validity:{' '}
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold print:text-emerald-800">
                    30 Days ({validUntilDate})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bill-To & Delivery Destination Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F6F6F4] dark:bg-[#111318] p-4 rounded-lg border border-[#E2E4E8] dark:border-[#262A33] print:bg-slate-50 print:border-slate-200">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5A606B] dark:text-slate-400">
                  Client / Company Details
                </span>
                <button
                  type="button"
                  onClick={companyName || clientName || kraPin ? handleClearClient : handleFillSample}
                  className="font-mono text-[10px] text-[#004B97] dark:text-sky-400 hover:underline cursor-pointer print:hidden"
                >
                  {companyName || clientName || kraPin ? 'Clear Fields' : 'Fill Sample Company'}
                </button>
              </div>
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter Company or Workshop Name"
                  className="font-semibold text-[#111315] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 w-full bg-white dark:bg-[#15181E] px-2.5 py-1.5 rounded border border-[#E2E4E8] dark:border-[#262A33] focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none print:border-transparent print:bg-transparent print:px-0 print:py-0"
                />
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Attn: Contact Person / Procurement Officer"
                  className="text-[#111315] dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 w-full bg-white dark:bg-[#15181E] px-2.5 py-1.5 rounded border border-[#E2E4E8] dark:border-[#262A33] focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none print:border-transparent print:bg-transparent print:px-0 print:py-0"
                />
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[#5A606B] dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    KRA PIN:
                  </span>
                  <input
                    type="text"
                    value={kraPin}
                    onChange={(e) => setKraPin(e.target.value)}
                    placeholder="P0XXXXXXXXZ"
                    className="font-mono font-semibold text-[#111315] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-[#15181E] px-2.5 py-1 rounded border border-[#E2E4E8] dark:border-[#262A33] focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none w-40 print:border-transparent print:bg-transparent print:px-0"
                  />
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5A606B] dark:text-slate-400 block mb-1.5">
                Designated Delivery Hub
              </span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[#5A606B] dark:text-slate-400">County:</span>
                  <select
                    value={countyId}
                    onChange={(e) => setCountyId(e.target.value)}
                    className="flex-1 rounded font-semibold text-[#111315] dark:text-white bg-white dark:bg-[#15181E] px-2.5 py-1.5 border border-[#E2E4E8] dark:border-[#262A33] focus:border-[#004B97] focus:outline-none cursor-pointer print:border-transparent print:bg-transparent print:px-0"
                  >
                    {KENYAN_COUNTY_HUBS.map((c) => (
                      <option key={c.id} value={c.id} className="dark:bg-[#15181E] text-[#111315] dark:text-white">
                        {c.county} ({c.mainTown} Depot)
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-[#5A606B] dark:text-slate-400">
                  Depot:{' '}
                  <span className="font-medium text-[#111315] dark:text-slate-200 print:text-slate-900">
                    {currentCounty.depotAddress}
                  </span>
                </p>
                <p className="text-[11px] text-[#5A606B] dark:text-slate-400 font-mono">
                  Transit Lead Time: {currentCounty.transitHours}
                </p>
              </div>
            </div>
          </div>

          {/* Itemized Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E2E4E8] dark:border-[#262A33] font-mono text-[11px] text-[#5A606B] dark:text-slate-400">
                  <th className="py-2.5">Item &amp; Machine Specifications</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price (KES)</th>
                  <th className="py-2.5 pl-3 text-right">Total (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E4E8] dark:divide-[#262A33]">
                {items.length > 0 ? (
                  items.map(({ product: itemProduct, quantity }) => {
                    const weightKg = Math.round(itemProduct.specs.weightLbs * 0.453592);
                    return (
                      <tr key={itemProduct.id} className="hover:bg-[#F6F6F4]/50 dark:hover:bg-[#1C2029]/40">
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={itemProduct.image}
                              alt={itemProduct.name}
                              className="h-10 w-10 rounded object-cover border border-[#E2E4E8] dark:border-[#262A33] shrink-0 bg-[#ECECE8] dark:bg-[#1C2029]"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="font-display font-bold text-[#111315] dark:text-white block print:text-slate-900">
                                {itemProduct.name}
                              </span>
                              <span className="text-[11px] text-[#5A606B] dark:text-slate-400 block font-mono tabular-nums">
                                {itemProduct.specs.motor} · {itemProduct.specs.voltage} · Mass: {weightKg} kg
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[#004B97] dark:text-sky-400 font-semibold whitespace-nowrap">
                          {itemProduct.sku}
                        </td>
                        <td className="py-3 px-2 text-center font-mono font-bold text-[#111315] dark:text-white tabular-nums">
                          {quantity}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[#5A606B] dark:text-slate-300 tabular-nums">
                          {formatKSh(itemProduct.price)}
                        </td>
                        <td className="py-3 pl-3 text-right font-mono font-bold text-[#111315] dark:text-white tabular-nums">
                          {formatKSh(itemProduct.price * quantity)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#5A606B] dark:text-slate-400">
                      No machines selected. Add equipment to your cart or open any machine specification sheet to generate a quote.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Ledger Calculation Breakdown & Banking Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-4 border-t border-[#E2E4E8] dark:border-[#262A33]">
            {/* Left Col: Official Banking & Payment Narration */}
            <div className="sm:col-span-7 space-y-3">
              <div className="rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] p-4 text-xs print:bg-slate-50">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#004B97] dark:text-sky-400 block mb-1.5">
                  Settlement &amp; Bank Wire Instructions
                </span>
                <div className="space-y-1 text-[#5A606B] dark:text-slate-300 font-mono text-[11px]">
                  <div>
                    Bank: <strong className="text-[#111315] dark:text-white">{STORE_CONFIG.bankName}</strong>
                  </div>
                  <div>
                    Branch:{' '}
                    <strong className="text-[#111315] dark:text-white">{STORE_CONFIG.bankBranch}</strong>
                  </div>
                  <div>
                    Account: <strong className="text-[#111315] dark:text-white">{STORE_CONFIG.bankAccount}</strong> (KES)
                  </div>
                  <div>
                    Paybill / Lipa na M-Pesa: <strong className="text-[#111315] dark:text-white">{STORE_CONFIG.paybill}</strong>
                  </div>
                  <div>
                    Account Ref: <strong className="text-[#004B97] dark:text-sky-400">{invoiceNumber}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-[#5A606B] dark:text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Includes 5-Year Factory Warranty &amp; In-Transit Freight Insurance.</span>
              </div>
            </div>

            {/* Right Col: Totals */}
            <div className="sm:col-span-5 space-y-2 text-xs">
              <div className="flex justify-between text-[#5A606B] dark:text-slate-400">
                <span>Subtotal (Excl. VAT)</span>
                <span className="font-mono font-semibold text-[#111315] dark:text-white tabular-nums">
                  {formatKSh(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[#5A606B] dark:text-slate-400">
                <span>Delivery ({currentCounty.mainTown} Hub)</span>
                <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {deliveryCost === 0 ? 'FREE' : formatKSh(deliveryCost)}
                </span>
              </div>
              <div className="flex justify-between text-[#5A606B] dark:text-slate-400">
                <span>VAT (16% KRA E-TIMS)</span>
                <span className="font-mono font-semibold text-[#111315] dark:text-white tabular-nums">
                  {formatKSh(vat16)}
                </span>
              </div>
              <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-2.5 flex justify-between text-sm sm:text-base text-[#111315] dark:text-white font-bold">
                <span className="font-display">Total Payable (KES)</span>
                <span className="text-[#004B97] dark:text-sky-400 font-mono tabular-nums">
                  {formatKSh(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#E2E4E8] dark:border-[#262A33] print:hidden">
            <span className="text-[11px] text-[#5A606B] dark:text-slate-400 font-mono">
              Electronic document valid without physical signature under Kenyan Law.
            </span>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handlePrint}
                className="btn-press flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] px-4 py-2.5 text-xs font-semibold text-[#111315] dark:text-slate-200 hover:border-[#004B97] dark:hover:border-sky-400 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Save Official PDF</span>
              </button>

              {onProceedToCheckout && items.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="btn-press btn-nudge flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-md bg-[#004B97] hover:bg-[#003B78] px-5 py-2.5 text-xs font-semibold text-white cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-3.5 w-3.5 btn-arrow" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
