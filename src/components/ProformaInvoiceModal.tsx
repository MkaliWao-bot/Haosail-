import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  FileText,
  ArrowRight,
  Check,
  Copy,
  Plus,
  Minus,
  Trash2,
  Search,
  MessageCircle,
} from 'lucide-react';
import { Product, CartItem } from '../types/machinery';
import { formatKSh } from '../utils/currency';
import { HaoSailLogo } from './HaoSailLogo';
import { KENYAN_COUNTY_HUBS } from '../data/accessoryData';
import { STORE_CONFIG } from '../config/storeConfig';
import { useAuth } from '../context/AuthContext';
import { downloadQuotationPdf, QuoteDocumentType } from '../utils/quotationPdf';
import { HAOSAIL_WHATSAPP_NUMBER } from '../utils/whatsapp';

interface ProformaInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  initialItems?: { product: Product; quantity: number }[] | null;
  initialDocType?: QuoteDocumentType;
  cartItems?: CartItem[];
  products?: Product[];
  onSyncCartFromQuote?: (items: { product: Product; quantity: number }[]) => void;
  onProceedToCheckout?: () => void;
}

export const ProformaInvoiceModal: React.FC<ProformaInvoiceModalProps> = ({
  isOpen,
  onClose,
  product,
  initialItems = null,
  initialDocType,
  cartItems = [],
  products = [],
  onSyncCartFromQuote,
  onProceedToCheckout,
}) => {
  const { accountProfile, privateInfo, user } = useAuth();

  const [docType, setDocType] = useState<QuoteDocumentType>(initialDocType || 'quotation');
  const [quoteItems, setQuoteItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [kraPin, setKraPin] = useState('');
  const [notes, setNotes] = useState('');
  const [countyId, setCountyId] = useState('nairobi');
  const [deliveryMode, setDeliveryMode] = useState<'depot-pickup' | 'direct-site'>('depot-pickup');
  const [copied, setCopied] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [machineQuery, setMachineQuery] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  // Sync initial items & prefill account details each time modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (initialDocType) {
      setDocType(initialDocType);
    }

    if (initialItems && initialItems.length > 0) {
      setQuoteItems(initialItems);
      setShowPicker(false);
    } else if (product) {
      setQuoteItems([{ product, quantity: 1 }]);
      setShowPicker(false);
    } else if (cartItems.length > 0) {
      setQuoteItems(cartItems.map((ci) => ({ product: ci.product, quantity: ci.quantity })));
      setShowPicker(false);
    } else {
      setQuoteItems([]);
      setShowPicker(true);
    }

    setMachineQuery('');
    setPdfDownloaded(false);

    if (accountProfile || privateInfo || user) {
      setCompanyName((prev) => prev || accountProfile?.workshopName || '');
      setClientName((prev) => prev || accountProfile?.displayName || user?.displayName || '');
      setClientPhone((prev) => prev || privateInfo?.phone || '');
      setClientEmail((prev) => prev || privateInfo?.email || user?.email || '');
      setKraPin((prev) => prev || privateInfo?.kraPin || '');
      if (privateInfo?.preferredCountyId) {
        setCountyId(privateInfo.preferredCountyId);
      }
    }
  }, [isOpen, product, initialItems, initialDocType, cartItems, accountProfile, privateInfo, user]);

  // Deterministic quote reference seeded by items
  const quoteNumber = useMemo(() => {
    const seed = quoteItems.reduce(
      (acc, item, idx) => acc + ((item.product.price + idx * 137) % 8999) * item.quantity,
      0
    );
    const code = String(1000 + (seed % 8999)).padStart(4, '0');
    const prefix =
      docType === 'quotation' ? 'HS-QT' : docType === 'finance-pack' ? 'HS-FIN' : 'HS-PRF';
    return `${prefix}-2026-${code}`;
  }, [quoteItems, docType]);

  const pickerResults = useMemo(() => {
    if (!products.length) return [];
    const q = machineQuery.trim().toLowerCase();
    const filtered = q
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.categoryLabel.toLowerCase().includes(q)
        )
      : products.filter((p) => p.isPopular || p.isNewArrival);
    return (filtered.length > 0 ? filtered : products).slice(0, 8);
  }, [products, machineQuery]);

  if (!isOpen) return null;

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

  const currentCounty =
    KENYAN_COUNTY_HUBS.find((c) => c.id === countyId) || KENYAN_COUNTY_HUBS[0];

  const subtotal = quoteItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const rawDelivery =
    deliveryMode === 'direct-site' ? currentCounty.tailgateCost : currentCounty.depotPickupCost;
  const deliveryCost = quoteItems.length === 0 ? 0 : subtotal > 200000 ? 0 : rawDelivery;
  const taxableSubtotal = subtotal + deliveryCost;
  const vat16 = Math.round(taxableSubtotal * 0.16);
  const grandTotal = taxableSubtotal + vat16;

  const handleAddMachineToQuote = (machine: Product) => {
    setQuoteItems((prev) => {
      const existing = prev.find((i) => i.product.id === machine.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === machine.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product: machine, quantity: 1 }];
    });
    setMachineQuery('');
    setShowPicker(false);
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setQuoteItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setQuoteItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleDownloadPdf = () => {
    if (quoteItems.length === 0) return;
    downloadQuotationPdf({
      docType,
      quoteNumber,
      issueDate: currentDate,
      validUntilDate,
      companyName,
      clientName,
      clientPhone,
      clientEmail,
      kraPin,
      notes,
      county: currentCounty,
      deliveryMode,
      items: quoteItems,
      subtotal,
      deliveryCost,
      vat16,
      grandTotal,
    });
    setPdfDownloaded(true);
    setTimeout(() => setPdfDownloaded(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const buildQuotePlainText = () => {
    const docLabel =
      docType === 'quotation'
        ? 'Official Quotation'
        : docType === 'finance-pack'
          ? 'Bank / SACCO Asset Finance Pack'
          : 'Proforma Invoice';
    const itemLines = quoteItems.map(
      ({ product: p, quantity }, idx) =>
        `${idx + 1}. ${quantity}x ${p.name} (${p.sku}) - ${formatKSh(p.price * quantity)}`
    );
    return [
      `${STORE_CONFIG.brandName} — ${docLabel} (${quoteNumber})`,
      companyName ? `Client: ${companyName}${clientName ? ` (${clientName})` : ''}` : '',
      `Delivery: ${currentCounty.county} (${deliveryMode === 'direct-site' ? 'Direct Site Tailgate' : 'Depot Collection'})`,
      '',
      ...itemLines,
      '',
      `Subtotal (Excl. VAT): ${formatKSh(subtotal)}`,
      `Freight: ${deliveryCost === 0 ? 'FREE' : formatKSh(deliveryCost)}`,
      `VAT (16% KRA E-TIMS): ${formatKSh(vat16)}`,
      `Total Payable: ${formatKSh(grandTotal)}`,
      `Valid Until: ${validUntilDate}`,
    ]
      .filter((line) => line !== undefined)
      .join('\n');
  };

  const handleCopySummary = () => {
    navigator.clipboard?.writeText(buildQuotePlainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappQuoteUrl = `https://wa.me/${HAOSAIL_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildQuotePlainText()
  )}`;

  const handleFillSample = () => {
    setCompanyName('Equator Precision Millwork Ltd');
    setClientName('David Mwangi');
    setClientPhone('+254 712 345 678');
    setKraPin('P051839201Z');
  };

  const handleClearClient = () => {
    setCompanyName('');
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setKraPin('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:static">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0F12]/70 backdrop-blur-sm transition-opacity print:hidden"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#111315] dark:text-[#F3F4F6] shadow-2xl my-auto print:max-h-none print:overflow-visible print:shadow-none print:border-none print:m-0 print:p-0 print:bg-white print:text-slate-900">
        {/* Top Control Bar (Hidden on print) */}
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4]/95 dark:bg-[#111318]/95 px-4 sm:px-5 py-3 backdrop-blur-sm print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-[#004B97] dark:text-sky-400" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111315] dark:text-white hidden sm:inline">
                Quotation Generator
              </span>
            </div>

            {/* Quotation vs Proforma vs Bank / SACCO Finance Pack Toggle */}
            <div className="inline-flex rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-0.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setDocType('quotation')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                  docType === 'quotation'
                    ? 'bg-[#004B97] text-white font-semibold'
                    : 'text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white'
                }`}
              >
                Quotation
              </button>
              <button
                type="button"
                onClick={() => setDocType('proforma')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                  docType === 'proforma'
                    ? 'bg-[#004B97] text-white font-semibold'
                    : 'text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white'
                }`}
              >
                Proforma Invoice
              </button>
              <button
                type="button"
                onClick={() => setDocType('finance-pack')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                  docType === 'finance-pack'
                    ? 'bg-[#004B97] text-white font-semibold'
                    : 'text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white'
                }`}
              >
                Bank / SACCO Pack
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={quoteItems.length === 0}
              className="btn-press flex items-center gap-1.5 rounded-md bg-[#004B97] hover:bg-[#003B78] disabled:opacity-45 disabled:cursor-not-allowed px-3 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              {pdfDownloaded ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>{pdfDownloaded ? 'Quotation PDF Saved' : 'Download PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={quoteItems.length === 0}
              className="flex items-center gap-1.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] disabled:opacity-45 px-2.5 py-1.5 text-xs font-medium text-[#111315] dark:text-slate-200 hover:border-[#004B97] dark:hover:border-sky-400 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              disabled={quoteItems.length === 0}
              className="flex items-center gap-1.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] disabled:opacity-45 px-2.5 py-1.5 text-xs font-medium text-[#111315] dark:text-slate-200 hover:border-[#004B97] dark:hover:border-sky-400 transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-[#5A606B] dark:text-slate-400" />
              )}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-[#5A606B] dark:text-slate-400 hover:bg-[#E2E4E8] dark:hover:bg-[#262A33] hover:text-[#111315] dark:hover:text-white transition-colors cursor-pointer ml-1"
              aria-label="Close quotation modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Quotation Body */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* Header Block: Logo & Quote Metadata */}
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
                PIN:{' '}
                <span className="font-mono font-semibold text-[#111315] dark:text-white print:text-slate-900">
                  {STORE_CONFIG.companyKraPin}
                </span>{' '}
                | E-TIMS Reg: ET-NB-49821
              </p>
            </div>

            <div className="sm:text-right bg-[#F6F6F4] dark:bg-[#111318] p-4 rounded-lg border border-[#E2E4E8] dark:border-[#262A33] shrink-0 min-w-56 print:bg-slate-50 print:border-slate-200">
              <span className="inline-block font-mono text-[10px] font-semibold uppercase tracking-widest text-white bg-[#004B97] px-2.5 py-0.5 rounded">
                {docType === 'quotation'
                  ? 'OFFICIAL QUOTATION'
                  : docType === 'finance-pack'
                    ? 'ASSET FINANCE PACK'
                    : 'PROFORMA INVOICE'}
              </span>
              <h2 className="font-mono text-base font-bold text-[#111315] dark:text-white mt-2 tabular-nums print:text-slate-900">
                {quoteNumber}
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

          {/* Prepared For + Delivery Hub Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F6F6F4] dark:bg-[#111318] p-4 rounded-lg border border-[#E2E4E8] dark:border-[#262A33] print:bg-slate-50 print:border-slate-200">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5A606B] dark:text-slate-400">
                  Prepared For (Client / Company)
                </span>
                <button
                  type="button"
                  onClick={
                    companyName || clientName || kraPin ? handleClearClient : handleFillSample
                  }
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Attn: Contact Name"
                    className="text-[#111315] dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 w-full bg-white dark:bg-[#15181E] px-2.5 py-1.5 rounded border border-[#E2E4E8] dark:border-[#262A33] focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none print:border-transparent print:bg-transparent print:px-0 print:py-0"
                  />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Phone (+254 7XX...)"
                    className="text-[#111315] dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 w-full bg-white dark:bg-[#15181E] px-2.5 py-1.5 rounded border border-[#E2E4E8] dark:border-[#262A33] focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none print:border-transparent print:bg-transparent print:px-0 print:py-0"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#5A606B] dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      KRA PIN:
                    </span>
                    <input
                      type="text"
                      value={kraPin}
                      onChange={(e) => setKraPin(e.target.value)}
                      placeholder="P0XXXXXXXXZ"
                      className="font-mono font-semibold text-[#111315] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-[#15181E] px-2 py-1 rounded border border-[#E2E4E8] dark:border-[#262A33] focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none w-32 print:border-transparent print:bg-transparent print:px-0"
                    />
                  </div>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="Email (optional)"
                    className="flex-1 min-w-[140px] text-[#111315] dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 bg-white dark:bg-[#15181E] px-2.5 py-1 rounded border border-[#E2E4E8] dark:border-[#262A33] focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none print:border-transparent print:bg-transparent print:px-0"
                  />
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5A606B] dark:text-slate-400 block mb-1.5">
                Designated Delivery Hub &amp; Dispatch
              </span>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#5A606B] dark:text-slate-400">County:</span>
                  <select
                    value={countyId}
                    onChange={(e) => setCountyId(e.target.value)}
                    className="flex-1 rounded font-semibold text-[#111315] dark:text-white bg-white dark:bg-[#15181E] px-2.5 py-1.5 border border-[#E2E4E8] dark:border-[#262A33] focus:border-[#004B97] focus:outline-none cursor-pointer print:border-transparent print:bg-transparent print:px-0"
                  >
                    {KENYAN_COUNTY_HUBS.map((c) => (
                      <option
                        key={c.id}
                        value={c.id}
                        className="dark:bg-[#15181E] text-[#111315] dark:text-white"
                      >
                        {c.county} ({c.mainTown} Depot)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 print:hidden">
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('depot-pickup')}
                    className={`flex-1 rounded px-2.5 py-1 text-[11px] font-medium border cursor-pointer transition-colors ${
                      deliveryMode === 'depot-pickup'
                        ? 'border-[#004B97] bg-[#004B97]/10 text-[#004B97] dark:border-sky-400 dark:bg-sky-400/10 dark:text-sky-300 font-semibold'
                        : 'border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#5A606B] dark:text-slate-400'
                    }`}
                  >
                    Depot Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('direct-site')}
                    className={`flex-1 rounded px-2.5 py-1 text-[11px] font-medium border cursor-pointer transition-colors ${
                      deliveryMode === 'direct-site'
                        ? 'border-[#004B97] bg-[#004B97]/10 text-[#004B97] dark:border-sky-400 dark:bg-sky-400/10 dark:text-sky-300 font-semibold'
                        : 'border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#5A606B] dark:text-slate-400'
                    }`}
                  >
                    Direct Site Tailgate
                  </button>
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

          {/* Add Machine to Quotation Bar (Hidden on print) */}
          {products.length > 0 && (
            <div className="print:hidden">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#5A606B] dark:text-slate-400">
                  Quoted Equipment ({quoteItems.reduce((s, i) => s + i.quantity, 0)}{' '}
                  {quoteItems.reduce((s, i) => s + i.quantity, 0) === 1 ? 'unit' : 'units'})
                </span>
                <button
                  type="button"
                  onClick={() => setShowPicker((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#004B97] dark:text-sky-400 hover:underline cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{showPicker ? 'Hide Machine Picker' : 'Add Machine to Quote'}</span>
                </button>
              </div>

              {showPicker && (
                <div className="rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] p-3 space-y-2.5 mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5A606B] dark:text-slate-400" />
                    <input
                      type="text"
                      value={machineQuery}
                      onChange={(e) => setMachineQuery(e.target.value)}
                      placeholder={`Search any of ${products.length} machines by name, SKU, or division (e.g. DW902, Lift, Lathe)...`}
                      className="w-full rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] pl-9 pr-3 py-2 text-xs text-[#111315] dark:text-white placeholder-slate-400 focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {pickerResults.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleAddMachineToQuote(p)}
                        className="flex items-center justify-between gap-2.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-2 text-left hover:border-[#004B97] dark:hover:border-sky-400 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-9 w-9 rounded object-cover shrink-0 bg-[#ECECE8]"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <span className="block text-xs font-semibold text-[#111315] dark:text-white truncate">
                              {p.name}
                            </span>
                            <span className="block font-mono text-[10px] text-[#5A606B] dark:text-slate-400">
                              {p.sku} · {formatKSh(p.price)}
                            </span>
                          </div>
                        </div>
                        <Plus className="h-4 w-4 text-[#004B97] dark:text-sky-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
                  <th className="py-2.5 pl-2 text-right print:hidden" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E4E8] dark:divide-[#262A33]">
                {quoteItems.length > 0 ? (
                  quoteItems.map(({ product: itemProduct, quantity }) => {
                    const weightKg = Math.round(itemProduct.specs.weightLbs * 0.453592);
                    return (
                      <tr
                        key={itemProduct.id}
                        className="hover:bg-[#F6F6F4]/50 dark:hover:bg-[#1C2029]/40"
                      >
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
                                {itemProduct.specs.motor} · {itemProduct.specs.voltage} · Mass:{' '}
                                {weightKg} kg
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[#004B97] dark:text-sky-400 font-semibold whitespace-nowrap">
                          {itemProduct.sku}
                        </td>
                        <td className="py-3 px-2 text-center font-mono font-bold text-[#111315] dark:text-white tabular-nums">
                          <div className="inline-flex items-center gap-1.5 print:hidden">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(itemProduct.id, -1)}
                              className="h-5 w-5 rounded border border-[#E2E4E8] dark:border-[#262A33] flex items-center justify-center hover:border-[#004B97] cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="min-w-[18px] text-center">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(itemProduct.id, 1)}
                              className="h-5 w-5 rounded border border-[#E2E4E8] dark:border-[#262A33] flex items-center justify-center hover:border-[#004B97] cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>
                          <span className="hidden print:inline">{quantity}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[#5A606B] dark:text-slate-300 tabular-nums whitespace-nowrap">
                          {formatKSh(itemProduct.price)}
                        </td>
                        <td className="py-3 pl-3 text-right font-mono font-bold text-[#111315] dark:text-white tabular-nums whitespace-nowrap">
                          {formatKSh(itemProduct.price * quantity)}
                        </td>
                        <td className="py-3 pl-2 text-right print:hidden">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(itemProduct.id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            aria-label={`Remove ${itemProduct.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-[#5A606B] dark:text-slate-400"
                    >
                      Select one or more machines above to generate your itemized quotation PDF.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Optional Quotation Notes */}
          <div className="print:hidden">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional Quotation Note (e.g. LPO reference, voltage configuration, or site delivery instructions)..."
              className="w-full rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] px-3 py-2 text-xs text-[#111315] dark:text-slate-200 placeholder-slate-400 focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
            />
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
                    Bank:{' '}
                    <strong className="text-[#111315] dark:text-white">
                      {STORE_CONFIG.bankName}
                    </strong>
                  </div>
                  <div>
                    Branch:{' '}
                    <strong className="text-[#111315] dark:text-white">
                      {STORE_CONFIG.bankBranch}
                    </strong>
                  </div>
                  <div>
                    Account:{' '}
                    <strong className="text-[#111315] dark:text-white">
                      {STORE_CONFIG.bankAccount}
                    </strong>{' '}
                    (KES)
                  </div>
                  <div>
                    Paybill / Lipa na M-Pesa:{' '}
                    <strong className="text-[#111315] dark:text-white">
                      {STORE_CONFIG.paybill}
                    </strong>
                  </div>
                  <div>
                    Account Ref:{' '}
                    <strong className="text-[#004B97] dark:text-sky-400">{quoteNumber}</strong>
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

              {grandTotal > 80000 && (
                <div className="rounded border border-[#004B97]/20 dark:border-sky-400/25 bg-[#004B97]/5 dark:bg-sky-950/30 px-3 py-2 text-[11px] font-mono text-[#004B97] dark:text-sky-300 tabular-nums">
                  Lipa Pole Pole Option: Reserve with 20% down (
                  <strong>{formatKSh(Math.round(grandTotal * 0.2))}</strong>)
                </div>
              )}
            </div>
          </div>

          {docType === 'finance-pack' && quoteItems.length > 0 && (
            <div className="rounded-lg border border-[#004B97]/30 dark:border-sky-500/35 bg-[#004B97]/[0.04] dark:bg-sky-950/20 p-4 text-xs space-y-2.5 print:bg-slate-50">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#004B97] dark:text-sky-400">
                  Credit Committee / SACCO Asset-Finance Assurance
                </span>
                <span className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400">
                  Equity · KCB · Co-op · SACCO Ready
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px] tabular-nums">
                <div className="rounded border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-3 py-2">
                  <span className="text-[#5A606B] dark:text-slate-400 block">20% Client Deposit / 80% Financed</span>
                  <span className="font-semibold text-[#111315] dark:text-white">
                    {formatKSh(Math.round(grandTotal * 0.2))} down · {formatKSh(grandTotal - Math.round(grandTotal * 0.2))} loan
                  </span>
                </div>
                <div className="rounded border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-3 py-2">
                  <span className="text-[#5A606B] dark:text-slate-400 block">30% Client Deposit / 70% Financed</span>
                  <span className="font-semibold text-[#111315] dark:text-white">
                    {formatKSh(Math.round(grandTotal * 0.3))} down · {formatKSh(grandTotal - Math.round(grandTotal * 0.3))} loan
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[#5A606B] dark:text-slate-300 leading-relaxed">
                Includes brand-new serial-numbered unit verification for bank asset tagging, Kenya 50Hz grid calibration compliance, 5-year commercial warranty, and in-transit freight insurance.
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#E2E4E8] dark:border-[#262A33] print:hidden">
            <span className="text-[11px] text-[#5A606B] dark:text-slate-400 font-mono">
              Electronic document valid for 30 days without physical signature.
            </span>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {quoteItems.length > 0 && (
                <a
                  href={whatsappQuoteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-press flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-md border border-emerald-600/35 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/30 px-3.5 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp Quote</span>
                </a>
              )}

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={quoteItems.length === 0}
                className="btn-press flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] disabled:opacity-45 px-4 py-2.5 text-xs font-semibold text-[#111315] dark:text-slate-200 hover:border-[#004B97] dark:hover:border-sky-400 cursor-pointer"
              >
                {pdfDownloaded ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Download className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400" />
                )}
                <span>{pdfDownloaded ? 'Quotation Saved' : 'Download Quotation PDF'}</span>
              </button>

              {onProceedToCheckout && quoteItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onSyncCartFromQuote?.(quoteItems);
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
