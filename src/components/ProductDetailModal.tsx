import React, { useEffect, useState } from 'react';
import {
  X,
  Check,
  GitCompare,
  MessageSquare,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  MessageCircle,
  ArrowRight,
  ShoppingBag,
  Wrench,
} from 'lucide-react';
import { Product, CheckoutPlanPreset } from '../types/machinery';
import { formatKSh } from '../utils/currency';
import { KENYAN_COUNTY_HUBS } from '../data/accessoryData';
import { STORE_CONFIG } from '../config/storeConfig';
import { buildProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  onBuyNow?: (
    product: Product,
    quantity: number,
    options?: {
      selectedVoltage?: string;
      selectedDeliveryTier?: string;
      clearExistingCart?: boolean;
      financingPreset?: CheckoutPlanPreset;
    }
  ) => void;
  onToggleCompare: (product: Product) => void;
  isCompared: boolean;
  onOpenAdvisor?: (product?: Product) => void;
  onRequestProforma?: (product: Product) => void;
  onOpenSpecSheet?: (
    product: Product,
    selectedVoltage?: string,
    selectedCountyId?: string
  ) => void;
}

const DEPOSIT_OPTIONS = [20, 30, 40, 50];

const FREIGHT_LABEL_MAP: Record<Product['freightTier'], string> = {
  'standard-ground': 'Standard Courier / Van Dispatch',
  'freight-ltl': 'Commercial LTL Crate Freight',
  'heavy-freight': 'Heavy Low-Loader / Tailgate Freight',
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleCompare,
  isCompared,
  onOpenAdvisor,
  onRequestProforma,
  onOpenSpecSheet,
}) => {
  const isLipaPolePoleEligible = Boolean(product && product.price > 80000);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'lipa-pole-pole' | 'specs' | 'features'>(() =>
    product && product.price > 80000 ? 'lipa-pole-pole' : 'specs'
  );
  const [imgFailed, setImgFailed] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Configuration selections
  const [selectedVoltage, setSelectedVoltage] = useState<string>(() => {
    return product ? product.specs.voltage.split('/')[0].trim() : '230V';
  });
  const [selectedCountyId, setSelectedCountyId] = useState<string>('nairobi');

  // Lipa Pole Pole state (eligible strictly for machines > KES 80,000)
  const [depositPercent, setDepositPercent] = useState<number>(30);
  const [installmentCadence, setInstallmentCadence] = useState<'monthly' | 'weekly'>('monthly');
  const [loanTenureMonths, setLoanTenureMonths] = useState<number>(12);
  const [loanTenureWeeks, setLoanTenureWeeks] = useState<number>(24);
  const [selectedChannel, setSelectedChannel] = useState<string>(
    `M-Pesa Paybill ${STORE_CONFIG.paybill}`
  );
  const [planSubmitted, setPlanSubmitted] = useState<boolean>(false);
  const [showPlanForm, setShowPlanForm] = useState<boolean>(false);
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantPhone, setApplicantPhone] = useState<string>('');
  const [applicantCompany, setApplicantCompany] = useState<string>('');

  const [isLaunchingCheckout, setIsLaunchingCheckout] = useState<boolean>(false);

  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  if (!product) return null;

  const currentCounty =
    KENYAN_COUNTY_HUBS.find((c) => c.id === selectedCountyId) || KENYAN_COUNTY_HUBS[0];

  const savingsPct =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const weightKg = Math.max(1, Math.round(product.specs.weightLbs * 0.453592));

  const handleAddToCartAction = () => {
    if (!onAddToCart) return;
    onAddToCart(product, quantity);
    setIsAddedToCart(true);
    window.setTimeout(() => setIsAddedToCart(false), 1600);
  };

  const handleDirectBuyNow = () => {
    if (!onBuyNow || isLaunchingCheckout) return;
    setIsLaunchingCheckout(true);
    const shouldUseLipa = isLipaPolePoleEligible && activeTab === 'lipa-pole-pole';
    const financingPreset: CheckoutPlanPreset = {
      settlementMode: shouldUseLipa ? 'lipa-pole-pole' : 'full',
      depositPercent,
      installmentCadence,
      loanTenureMonths,
      loanTenureWeeks,
      financingChannel: selectedChannel,
      preferredCountyId: currentCounty.id,
    };
    window.setTimeout(() => {
      onBuyNow(product, quantity, {
        selectedVoltage,
        selectedDeliveryTier: currentCounty.id,
        clearExistingCart: false,
        financingPreset,
      });
    }, 180);
  };

  // Lipa Pole Pole installment calculation (12% p.a. simple reducing schedule)
  const totalOrderPrice = product.price * quantity;
  const depositAmount = Math.round((totalOrderPrice * depositPercent) / 100);
  const balancePrincipal = totalOrderPrice - depositAmount;
  const annualRate = 0.12;

  const monthlyInstallment = Math.round(
    (balancePrincipal * (1 + annualRate * (loanTenureMonths / 12))) / loanTenureMonths
  );
  const weeklyInstallment = Math.round(
    (balancePrincipal * (1 + annualRate * (loanTenureWeeks / 52))) / loanTenureWeeks
  );
  const activeInstallment =
    installmentCadence === 'monthly' ? monthlyInstallment : weeklyInstallment;

  const previewMonthlyFrom = Math.round((product.price * 0.7 * (1 + annualRate * 2)) / 24);

  const specRows: Array<{ label: string; value: string }> = [
    { label: 'Motor / Power Unit', value: product.specs.motor },
    { label: 'Input Voltage / Phase', value: product.specs.voltage },
    { label: 'Current / Breaker Rating', value: product.specs.amperage },
    { label: 'Working Capacity', value: product.specs.capacity },
    { label: 'Footprint / Dimensions', value: product.specs.footprint },
    { label: 'Net Shipping Mass', value: `${weightKg.toLocaleString()} kg (${product.specs.weightLbs.toLocaleString()} lbs)` },
    ...(product.specs.rpm ? [{ label: 'Operating Speed', value: product.specs.rpm }] : []),
    ...(product.specs.bladeSize ? [{ label: 'Blade / Tooling Size', value: product.specs.bladeSize }] : []),
    ...(product.specs.arborOrSpindle ? [{ label: 'Arbor / Spindle', value: product.specs.arborOrSpindle }] : []),
    ...(product.specs.dustPortSize ? [{ label: 'Extraction Port', value: product.specs.dustPortSize }] : []),
    { label: 'Logistics Class', value: FREIGHT_LABEL_MAP[product.freightTier] },
    { label: 'Commercial Warranty', value: `${product.specs.warrantyYears} Years Parts & Yard Support` },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0F12]/78 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Spacious Architectural Product View Container */}
      <div className="relative z-10 flex flex-col w-full max-w-6xl max-h-[94vh] overflow-hidden rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#111315] dark:text-[#F3F4F6] shadow-2xl">
        {/* Sticky Top Breadcrumb & Close Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] px-5 sm:px-7 py-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#5A606B] dark:text-slate-400 truncate">
            <span>Catalog</span>
            <span aria-hidden="true">/</span>
            <span className="truncate">{product.categoryLabel}</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[#004B97] dark:text-sky-400">{product.sku}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] text-[#5A606B] dark:text-slate-300 hover:text-[#111315] dark:hover:text-white hover:border-[#004B97] dark:hover:border-sky-400 transition-colors cursor-pointer shrink-0"
            aria-label="Close product view"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Internally Scrollable Product Workspace */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Gallery & Commercial Service Ledger */}
            <div className="lg:col-span-5 bg-[#F6F6F4] dark:bg-[#111318] border-b lg:border-b-0 lg:border-r border-[#E2E4E8] dark:border-[#262A33] p-5 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#ECECE8] dark:bg-[#1C2029]">
                  {!imgFailed ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={() => setImgFailed(true)}
                      className="h-full w-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#ECECE8] to-[#E2E4E8] dark:from-[#1C2029] dark:to-[#111318] p-6 text-center">
                      <Wrench className="h-8 w-8 text-[#004B97] dark:text-sky-400" />
                      <span className="font-mono text-xs font-semibold text-[#111315] dark:text-white">
                        {product.sku}
                      </span>
                      <span className="text-xs text-[#5A606B] dark:text-slate-400">
                        {product.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Unboxed Key Specifications Summary Ledger */}
                <dl className="mt-5 divide-y divide-[#E2E4E8] dark:divide-[#262A33] border-y border-[#E2E4E8] dark:border-[#262A33] text-xs">
                  <div className="py-2.5 flex items-baseline justify-between gap-4">
                    <dt className="text-[#5A606B] dark:text-slate-400">Yard Stock</dt>
                    <dd
                      className={`font-mono font-semibold tabular-nums ${
                        product.inStock
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {product.inStock ? `${product.stockCount} Ready in Nairobi` : 'Special Order (14d)'}
                    </dd>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-4">
                    <dt className="text-[#5A606B] dark:text-slate-400">Motor / Drive</dt>
                    <dd className="font-mono font-medium text-[#111315] dark:text-white text-right truncate">
                      {product.specs.motor}
                    </dd>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-4">
                    <dt className="text-[#5A606B] dark:text-slate-400">Shipping Weight</dt>
                    <dd className="font-mono font-medium text-[#111315] dark:text-white tabular-nums">
                      {weightKg.toLocaleString()} kg
                    </dd>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-4">
                    <dt className="text-[#5A606B] dark:text-slate-400">Freight &amp; Delivery</dt>
                    <dd className="font-medium text-[#111315] dark:text-white text-right">
                      {product.isFreeFreight ? 'Free Regional Delivery' : FREIGHT_LABEL_MAP[product.freightTier]}
                    </dd>
                  </div>
                  <div className="py-2.5 flex items-baseline justify-between gap-4">
                    <dt className="text-[#5A606B] dark:text-slate-400">Dispatch ETA</dt>
                    <dd className="font-medium text-[#111315] dark:text-white text-right">
                      {currentCounty.mainTown} · {currentCounty.transitHours}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Secondary Utility Links */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-2 text-xs">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {onOpenAdvisor && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAdvisor(product);
                      }}
                      className="inline-flex items-center gap-1.5 font-medium text-[#5A606B] dark:text-slate-400 hover:text-[#004B97] dark:hover:text-sky-400 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Ask Technical Desk</span>
                    </button>
                  )}

                  <a
                    href={buildProductWhatsAppUrl(product, {
                      quantity,
                      selectedVoltage,
                      selectedCountyName: `${currentCounty.county} (${currentCounty.mainTown})`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400 hover:underline transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp Quote</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleCompare(product)}
                  className={`inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    isCompared
                      ? 'text-[#004B97] dark:text-sky-400'
                      : 'text-[#5A606B] dark:text-slate-400 hover:text-[#111315] dark:hover:text-white'
                  }`}
                >
                  <GitCompare className="h-3.5 w-3.5" />
                  <span>{isCompared ? 'Added to Compare' : 'Compare Machine'}</span>
                </button>
              </div>
            </div>

            {/* Right Contiguous Purchase & Engineering Module */}
            <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between">
              <div>
                {/* Quiet Metadata Eyebrow */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#5A606B] dark:text-slate-400">
                  <span className="font-semibold text-[#004B97] dark:text-sky-400">{product.sku}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.categoryLabel}</span>
                  {product.subCategoryLabel && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{product.subCategoryLabel}</span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span>{product.specs.warrantyYears}-Yr Warranty</span>
                </div>

                {/* Title & Subtitle */}
                <h2 className="mt-2 font-display text-2xl sm:text-[28px] font-bold text-[#111315] dark:text-white tracking-tight leading-tight text-balance">
                  {product.name}
                </h2>
                <p className="mt-1.5 text-sm text-[#5A606B] dark:text-slate-300 leading-relaxed">
                  {product.subtitle}
                </p>

                {/* Price Baseline */}
                <div className="mt-5 pb-5 border-b border-[#E2E4E8] dark:border-[#262A33] flex flex-wrap items-baseline justify-between gap-3">
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <span className="font-mono text-3xl font-semibold text-[#111315] dark:text-white tracking-tight tabular-nums">
                      {formatKSh(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <>
                        <span className="font-mono text-sm text-[#5A606B] dark:text-slate-500 line-through tabular-nums">
                          {formatKSh(product.originalPrice)}
                        </span>
                        {savingsPct >= 5 && (
                          <span className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-400 tabular-nums">
                            Save {savingsPct}%
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {isLipaPolePoleEligible && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('lipa-pole-pole')}
                      className="font-mono text-xs font-medium text-[#004B97] dark:text-sky-400 hover:underline cursor-pointer tabular-nums"
                    >
                      Lipa Pole Pole from {formatKSh(previewMonthlyFrom)}/mo
                    </button>
                  )}
                </div>

                {/* Configuration Selectors */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-medium text-[#5A606B] dark:text-slate-400 mb-1">
                      Voltage / Phase
                    </label>
                    <select
                      value={selectedVoltage}
                      onChange={(e) => setSelectedVoltage(e.target.value)}
                      className="w-full rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-xs text-[#111315] dark:text-slate-200 font-medium focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none cursor-pointer"
                    >
                      <option value={product.specs.voltage}>
                        {product.specs.voltage} (Standard)
                      </option>
                      {product.specs.voltage.includes('230V') && (
                        <option value="400V / 3-Phase Industrial (Optional)">
                          400V / 3-Phase Industrial
                        </option>
                      )}
                      {product.specs.voltage.includes('3-Phase') && (
                        <option value="415V / 3-Phase 50Hz Standard">
                          415V / 3-Phase 50Hz Kenya Grid
                        </option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#5A606B] dark:text-slate-400 mb-1">
                      Delivery Hub
                    </label>
                    <select
                      value={selectedCountyId}
                      onChange={(e) => setSelectedCountyId(e.target.value)}
                      className="w-full rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-3 py-2 text-xs text-[#111315] dark:text-slate-200 font-medium focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none cursor-pointer"
                    >
                      {KENYAN_COUNTY_HUBS.map((c) => (
                        <option key={c.id} value={c.id} className="dark:bg-[#15181E]">
                          {c.county} ({c.mainTown})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contiguous Purchase & Document Action Row */}
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#0D0F12]">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2.5 text-[#5A606B] dark:text-slate-300 hover:text-[#111315] dark:hover:text-white font-semibold cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-2.5 font-mono text-xs font-semibold text-[#111315] dark:text-white min-w-[28px] text-center tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2.5 text-[#5A606B] dark:text-slate-300 hover:text-[#111315] dark:hover:text-white font-semibold cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {onAddToCart && (
                    <button
                      type="button"
                      onClick={handleAddToCartAction}
                      className="btn-press flex items-center justify-center rounded-md border border-[#004B97] dark:border-sky-400 bg-white dark:bg-[#1C2029] hover:bg-[#F6F6F4] dark:hover:bg-[#222733] px-4 py-2.5 text-xs font-semibold text-[#004B97] dark:text-sky-400 cursor-pointer whitespace-nowrap"
                    >
                      <span className="kinetic-roll w-24">
                        <span
                          className={`kinetic-face ${
                            isAddedToCart ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                          }`}
                        >
                          <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
                          <span>Add to Cart</span>
                        </span>
                        <span
                          aria-hidden={!isAddedToCart}
                          className={`kinetic-face absolute inset-0 ${
                            isAddedToCart ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[2.5] shrink-0" />
                          <span>Added</span>
                        </span>
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleDirectBuyNow}
                    disabled={isLaunchingCheckout}
                    className="btn-press btn-nudge flex flex-1 min-w-[130px] items-center justify-center rounded-md bg-[#004B97] hover:bg-[#003B78] px-5 py-2.5 text-xs font-semibold text-white cursor-pointer whitespace-nowrap disabled:opacity-90"
                  >
                    <span className="kinetic-roll">
                      <span
                        className={`kinetic-face ${
                          isLaunchingCheckout
                            ? '-translate-y-full opacity-0'
                            : 'translate-y-0 opacity-100'
                        }`}
                      >
                        <span>Buy Now</span>
                        <ArrowRight className="h-3.5 w-3.5 btn-arrow" />
                      </span>
                      <span
                        aria-hidden={!isLaunchingCheckout}
                        className={`kinetic-face absolute inset-0 ${
                          isLaunchingCheckout
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-full opacity-0'
                        }`}
                      >
                        <span>Opening Checkout</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </span>
                  </button>

                  {onRequestProforma && (
                    <button
                      type="button"
                      onClick={() => onRequestProforma(product)}
                      title="Generate Official Quotation & Proforma PDF"
                      className="btn-press flex items-center gap-1.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] hover:border-[#004B97] dark:hover:border-sky-400 px-3 py-2.5 text-xs font-medium text-[#111315] dark:text-slate-200 cursor-pointer whitespace-nowrap"
                    >
                      <FileText className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400" />
                      <span>Get Quote</span>
                    </button>
                  )}

                  {onOpenSpecSheet && (
                    <button
                      type="button"
                      onClick={() => onOpenSpecSheet(product, selectedVoltage, selectedCountyId)}
                      title="Open Printable Technical Datasheet (PDF)"
                      className="btn-press flex items-center gap-1.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] hover:border-[#004B97] dark:hover:border-sky-400 px-3 py-2.5 text-xs font-medium text-[#111315] dark:text-slate-200 cursor-pointer whitespace-nowrap"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400" />
                      <span>Spec Sheet</span>
                    </button>
                  )}
                </div>

                {/* 3-Tab Engineering & Financing Explorer */}
                <div className="mt-7">
                  <div className="flex border-b border-[#E2E4E8] dark:border-[#262A33] gap-6 text-xs font-semibold overflow-x-auto">
                    {isLipaPolePoleEligible && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('lipa-pole-pole')}
                        className={`pb-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                          activeTab === 'lipa-pole-pole'
                            ? 'border-b-2 border-[#004B97] text-[#004B97] dark:border-sky-400 dark:text-sky-400'
                            : 'text-[#5A606B] hover:text-[#111315] dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        Lipa Pole Pole
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveTab('specs')}
                      className={`pb-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                        activeTab === 'specs'
                          ? 'border-b-2 border-[#004B97] text-[#004B97] dark:border-sky-400 dark:text-sky-400'
                          : 'text-[#5A606B] hover:text-[#111315] dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      Technical Specs
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('features')}
                      className={`pb-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                        activeTab === 'features'
                          ? 'border-b-2 border-[#004B97] text-[#004B97] dark:border-sky-400 dark:text-sky-400'
                          : 'text-[#5A606B] hover:text-[#111315] dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      Features &amp; Overview
                    </button>
                  </div>

                  {/* Lipa Pole Pole Calculator Panel */}
                  {isLipaPolePoleEligible && activeTab === 'lipa-pole-pole' && (
                    <div className="mt-4 space-y-5 text-xs">
                      <div className="grid grid-cols-3 divide-x divide-[#E2E4E8] dark:divide-[#262A33] border border-[#E2E4E8] dark:border-[#262A33] rounded-md bg-[#F6F6F4] dark:bg-[#111318] py-3">
                        <div className="px-3">
                          <span className="block text-[10px] font-mono uppercase text-[#5A606B] dark:text-slate-400">
                            Deposit ({depositPercent}%)
                          </span>
                          <span className="mt-0.5 block font-mono text-sm font-bold text-[#111315] dark:text-white tabular-nums">
                            {formatKSh(depositAmount)}
                          </span>
                        </div>
                        <div className="px-3">
                          <span className="block text-[10px] font-mono uppercase text-[#5A606B] dark:text-slate-400">
                            Balance
                          </span>
                          <span className="mt-0.5 block font-mono text-sm font-bold text-[#111315] dark:text-white tabular-nums">
                            {formatKSh(balancePrincipal)}
                          </span>
                        </div>
                        <div className="px-3">
                          <span className="block text-[10px] font-mono uppercase text-[#004B97] dark:text-sky-400">
                            {installmentCadence === 'monthly' ? 'Monthly' : 'Weekly'}
                          </span>
                          <span className="mt-0.5 block font-mono text-sm font-bold text-[#004B97] dark:text-sky-300 tabular-nums">
                            {formatKSh(activeInstallment)}
                            <span className="text-[11px] font-normal">
                              /{installmentCadence === 'monthly' ? 'mo' : 'wk'}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="block text-[11px] font-medium text-[#5A606B] dark:text-slate-400 mb-1.5">
                            Down Payment
                          </span>
                          <div className="grid grid-cols-4 gap-1.5">
                            {DEPOSIT_OPTIONS.map((pct) => (
                              <button
                                key={pct}
                                type="button"
                                onClick={() => setDepositPercent(pct)}
                                className={`py-1.5 rounded-md font-mono text-[11px] font-semibold border transition-colors cursor-pointer ${
                                  depositPercent === pct
                                    ? 'border-[#004B97] bg-[#004B97] text-white'
                                    : 'border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] text-[#111315] dark:text-slate-300 hover:border-[#004B97]'
                                }`}
                              >
                                {pct}%
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-medium text-[#5A606B] dark:text-slate-400">
                              Repayment Term
                            </span>
                            <div className="flex items-center gap-2 text-[11px]">
                              <button
                                type="button"
                                onClick={() => setInstallmentCadence('monthly')}
                                className={`cursor-pointer font-medium ${
                                  installmentCadence === 'monthly'
                                    ? 'text-[#004B97] dark:text-sky-400 underline'
                                    : 'text-[#5A606B] dark:text-slate-400'
                                }`}
                              >
                                Monthly
                              </button>
                              <span className="text-[#E2E4E8] dark:text-[#262A33]">|</span>
                              <button
                                type="button"
                                onClick={() => setInstallmentCadence('weekly')}
                                className={`cursor-pointer font-medium ${
                                  installmentCadence === 'weekly'
                                    ? 'text-[#004B97] dark:text-sky-400 underline'
                                    : 'text-[#5A606B] dark:text-slate-400'
                                }`}
                              >
                                Weekly
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-1.5">
                            {installmentCadence === 'monthly'
                              ? [6, 12, 18, 24].map((m) => (
                                  <button
                                    key={m}
                                    type="button"
                                    onClick={() => setLoanTenureMonths(m)}
                                    className={`py-1.5 rounded-md font-mono text-[11px] font-semibold border transition-colors cursor-pointer ${
                                      loanTenureMonths === m
                                        ? 'border-[#004B97] bg-[#004B97] text-white'
                                        : 'border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] text-[#111315] dark:text-slate-300 hover:border-[#004B97]'
                                    }`}
                                  >
                                    {m}m
                                  </button>
                                ))
                              : [12, 24, 36, 52].map((w) => (
                                  <button
                                    key={w}
                                    type="button"
                                    onClick={() => setLoanTenureWeeks(w)}
                                    className={`py-1.5 rounded-md font-mono text-[11px] font-semibold border transition-colors cursor-pointer ${
                                      loanTenureWeeks === w
                                        ? 'border-[#004B97] bg-[#004B97] text-white'
                                        : 'border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] text-[#111315] dark:text-slate-300 hover:border-[#004B97]'
                                    }`}
                                  >
                                    {w}w
                                  </button>
                                ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-[#5A606B] dark:text-slate-400">Channel:</span>
                          <select
                            value={selectedChannel}
                            onChange={(e) => setSelectedChannel(e.target.value)}
                            className="rounded border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] px-2 py-1 text-[11px] font-medium text-[#111315] dark:text-slate-200 focus:border-[#004B97] focus:outline-none cursor-pointer"
                          >
                            <option value={`M-Pesa Paybill ${STORE_CONFIG.paybill}`}>
                              M-Pesa Paybill {STORE_CONFIG.paybill}
                            </option>
                            <option value="KCB Lipa Pole Pole">KCB Lipa Pole Pole</option>
                            <option value="NCBA Flex Plan">NCBA Flex Plan</option>
                          </select>
                        </div>

                        {!showPlanForm && !planSubmitted && (
                          <button
                            type="button"
                            onClick={() => setShowPlanForm(true)}
                            className="rounded-md border border-[#004B97] dark:border-sky-400 px-3.5 py-1.5 text-xs font-semibold text-[#004B97] dark:text-sky-400 hover:bg-[#004B97] hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Reserve Lipa Pole Pole Plan
                          </button>
                        )}
                      </div>

                      {showPlanForm && !planSubmitted && (
                        <div className="p-3.5 bg-[#F6F6F4] dark:bg-[#111318] rounded-md border border-[#E2E4E8] dark:border-[#262A33] space-y-2.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={applicantName}
                              onChange={(e) => setApplicantName(e.target.value)}
                              className="rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] text-[#111315] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-2.5 py-1.5 text-xs focus:border-[#004B97] focus:outline-none"
                            />
                            <input
                              type="tel"
                              placeholder="M-Pesa Phone (07XX...)"
                              value={applicantPhone}
                              onChange={(e) => setApplicantPhone(e.target.value)}
                              className="rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] text-[#111315] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-2.5 py-1.5 text-xs font-mono focus:border-[#004B97] focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="Business / Workshop Name"
                              value={applicantCompany}
                              onChange={(e) => setApplicantCompany(e.target.value)}
                              className="flex-1 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#0D0F12] text-[#111315] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-2.5 py-1.5 text-xs focus:border-[#004B97] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setPlanSubmitted(true);
                                setShowPlanForm(false);
                              }}
                              className="rounded-md bg-[#004B97] hover:bg-[#003B78] px-4 py-1.5 text-xs font-semibold text-white cursor-pointer transition-colors whitespace-nowrap"
                            >
                              Confirm Plan
                            </button>
                          </div>
                        </div>
                      )}

                      {planSubmitted && (
                        <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>
                            Lipa Pole Pole request logged via <strong>{selectedChannel}</strong> (
                            {formatKSh(activeInstallment)}/{installmentCadence === 'monthly' ? 'mo' : 'wk'}).
                            Deposit instructions will be sent to {applicantPhone || 'your contact'}.
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Full Engineering Technical Specifications & Included Items */}
                  {activeTab === 'specs' && (
                    <div className="mt-4 space-y-5 text-xs">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 border border-[#E2E4E8] dark:border-[#262A33] rounded-md divide-y sm:divide-y-0 divide-[#E2E4E8] dark:divide-[#262A33] overflow-hidden">
                        {specRows.map((row) => (
                          <div
                            key={row.label}
                            className="flex flex-col gap-0.5 px-3.5 py-2.5 border-b border-[#E2E4E8] dark:border-[#262A33] sm:odd:border-r bg-white dark:bg-[#111318]"
                          >
                            <dt className="text-[10px] font-mono uppercase tracking-wider text-[#5A606B] dark:text-slate-400">
                              {row.label}
                            </dt>
                            <dd className="font-mono text-xs font-semibold text-[#111315] dark:text-white tabular-nums">
                              {row.value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      {product.includedItems && product.includedItems.length > 0 && (
                        <div>
                          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#5A606B] dark:text-slate-400 mb-2">
                            Standard Crate Inclusions
                          </h3>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#111315] dark:text-slate-200">
                            {product.includedItems.map((inc, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span>{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Features & Commercial Overview Panel */}
                  {activeTab === 'features' && (
                    <div className="mt-4 space-y-3.5 text-xs">
                      <p className="text-[#5A606B] dark:text-slate-300 leading-relaxed">
                        {product.description}
                      </p>
                      <ul className="space-y-2 text-[#111315] dark:text-slate-200">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
