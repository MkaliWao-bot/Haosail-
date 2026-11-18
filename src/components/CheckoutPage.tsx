import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Printer,
  ShoppingCart,
  Trash2,
  Clock,
  Lock,
  X,
  Plus,
  Minus,
} from 'lucide-react';
import { CartItem, Product, CheckoutPlanPreset } from '../types/machinery';
import { formatKSh } from '../utils/currency';
import { PRODUCTS } from '../data/machineryData';
import {
  KENYAN_COUNTY_HUBS,
  INSTALLATION_SERVICE_OPTIONS,
  ACCESSORIES_BY_CATEGORY,
  AccessoryItem,
} from '../data/accessoryData';
import { accessoryToProduct } from '../utils/accessoryToProduct';

interface CheckoutPageProps {
  cartItems: CartItem[];
  initialPreset?: CheckoutPlanPreset | null;
  initialVoucherCode?: string;
  onVoucherChange?: (code: string) => void;
  onBackToCatalog: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onClearCart: () => void;
}

type DeliveryMode = 'direct-site' | 'depot-pickup';
type SettlementMode = 'full' | 'lipa-pole-pole';
type PaymentMethod = 'mpesa' | 'bank-wire' | 'lpo-credit' | 'depot-pay';
type DepositMethod = 'mpesa' | 'bank-wire';

const DEPOSIT_PERCENTAGES = [20, 30, 40, 50];
const MONTHLY_TENURES = [6, 12, 18, 24];
const WEEKLY_TENURES = [12, 24, 36, 52];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cartItems,
  initialPreset,
  initialVoucherCode = '',
  onVoucherChange,
  onBackToCatalog,
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart,
  onClearCart,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    kraPin: '',
    address: '',
    city: 'Nairobi',
    countyId: initialPreset?.preferredCountyId || 'nairobi',
    deliveryInstructions: '',
    poNumber: '',
    mpesaNumber: '',
  });

  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('direct-site');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [voucherInput, setVoucherInput] = useState<string>(initialVoucherCode);
  const [appliedVoucher, setAppliedVoucher] = useState<string>(
    initialVoucherCode.trim().toUpperCase() === 'FESTIVE26' ? 'FESTIVE26' : ''
  );

  useEffect(() => {
    if (initialVoucherCode) {
      const normalized = initialVoucherCode.trim().toUpperCase();
      setVoucherInput(normalized);
      if (normalized === 'FESTIVE26') {
        setAppliedVoucher('FESTIVE26');
      }
    }
  }, [initialVoucherCode]);

  const handleToggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };
  const [settlementMode, setSettlementMode] = useState<SettlementMode>(
    initialPreset?.settlementMode || 'full'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');

  // Lipa Pole Pole checkout configuration (eligible strictly for orders > KES 80,000)
  const [depositPercent, setDepositPercent] = useState<number>(
    initialPreset?.depositPercent || 30
  );
  const [installmentCadence, setInstallmentCadence] = useState<'monthly' | 'weekly'>(
    initialPreset?.installmentCadence || 'monthly'
  );
  const [loanTenureMonths, setLoanTenureMonths] = useState<number>(
    initialPreset?.loanTenureMonths || 12
  );
  const [loanTenureWeeks, setLoanTenureWeeks] = useState<number>(
    initialPreset?.loanTenureWeeks || 24
  );
  const [financingChannel, setFinancingChannel] = useState<string>(
    initialPreset?.financingChannel || 'M-Pesa Paybill 408282'
  );
  const [depositPaymentMethod, setDepositPaymentMethod] = useState<DepositMethod>('mpesa');

  useEffect(() => {
    if (!initialPreset) return;
    setSettlementMode(initialPreset.settlementMode);
    if (initialPreset.depositPercent) setDepositPercent(initialPreset.depositPercent);
    if (initialPreset.installmentCadence) setInstallmentCadence(initialPreset.installmentCadence);
    if (initialPreset.loanTenureMonths) setLoanTenureMonths(initialPreset.loanTenureMonths);
    if (initialPreset.loanTenureWeeks) setLoanTenureWeeks(initialPreset.loanTenureWeeks);
    if (initialPreset.financingChannel) setFinancingChannel(initialPreset.financingChannel);
    if (initialPreset.preferredCountyId) {
      setFormData((prev) => ({ ...prev, countyId: initialPreset.preferredCountyId! }));
    }
  }, [initialPreset]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderReference, setOrderReference] = useState('');

  // Safaricom Daraja M-Pesa STK Push simulation state
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [mpesaCountdown, setMpesaCountdown] = useState(25);
  const [simulatedPin, setSimulatedPin] = useState('');
  const [mpesaStatus, setMpesaStatus] = useState<'prompting' | 'verifying' | 'success'>('prompting');
  const [mpesaReceiptCode, setMpesaReceiptCode] = useState('');

  const currentCounty =
    KENYAN_COUNTY_HUBS.find((c) => c.id === formData.countyId) || KENYAN_COUNTY_HUBS[0];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalWeightKg = Math.round(
    cartItems.reduce(
      (sum, item) => sum + item.product.specs.weightLbs * 0.453592 * item.quantity,
      0
    )
  );

  const deliveryCost =
    deliveryMode === 'direct-site'
      ? currentCounty.tailgateCost
      : currentCounty.depotPickupCost;

  const servicesCost = selectedServices.reduce((acc, sId) => {
    const srv = INSTALLATION_SERVICE_OPTIONS.find((s) => s.id === sId);
    return acc + (srv ? srv.cost : 0);
  }, 0);

  const voucherDiscount =
    appliedVoucher === 'FESTIVE26'
      ? Math.min(Math.round(subtotal * 0.05), 25000)
      : 0;

  const taxableAmount = Math.max(0, subtotal - voucherDiscount + deliveryCost + servicesCost);
  const vatAmount = Math.round(taxableAmount * 0.16);
  const grandTotal = taxableAmount + vatAmount;

  // Lipa Pole Pole qualification strictly > KES 80,000 equipment subtotal
  const isLipaPolePoleEligible = subtotal > 80000;
  const isLipaPolePoleActive = isLipaPolePoleEligible && settlementMode === 'lipa-pole-pole';

  const depositDueToday = Math.round((grandTotal * depositPercent) / 100);
  const financedBalance = grandTotal - depositDueToday;
  const annualRate = 0.12;
  const monthlyInstallment = Math.round(
    (financedBalance * (1 + annualRate * (loanTenureMonths / 12))) / loanTenureMonths
  );
  const weeklyInstallment = Math.round(
    (financedBalance * (1 + annualRate * (loanTenureWeeks / 52))) / loanTenureWeeks
  );
  const activeInstallment =
    installmentCadence === 'monthly' ? monthlyInstallment : weeklyInstallment;

  const dueTodayAmount = isLipaPolePoleActive ? depositDueToday : grandTotal;
  const requiresMpesaStk = isLipaPolePoleActive
    ? depositPaymentMethod === 'mpesa'
    : paymentMethod === 'mpesa';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const hasWorkshopInput = Boolean(
    formData.fullName || formData.companyName || formData.email || formData.kraPin || formData.address
  );

  const handleFillSampleWorkshop = () => {
    setFormData((prev) => ({
      ...prev,
      fullName: 'David Mwangi',
      companyName: 'Equator Precision Millwork & Garage Ltd',
      email: 'dmwangi@equatorworkshops.co.ke',
      phone: '0722 849 321',
      kraPin: 'P051839201Z',
      address: 'Plot 48, Enterprise Road, Industrial Area',
      mpesaNumber: '0722849321',
    }));
  };

  const handleClearSampleWorkshop = () => {
    setFormData((prev) => ({
      ...prev,
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      kraPin: '',
      address: '',
      mpesaNumber: '',
    }));
  };

  const handleQuickAdd = (machineId: string) => {
    const found = PRODUCTS.find((p) => p.id === machineId);
    if (found) {
      onAddToCart(found, 1);
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (showMpesaModal && mpesaStatus === 'prompting' && mpesaCountdown > 0) {
      timer = setTimeout(() => {
        setMpesaCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [showMpesaModal, mpesaStatus, mpesaCountdown]);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `HS-KE-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderReference(generatedId);

    if (requiresMpesaStk) {
      setShowMpesaModal(true);
      setMpesaStatus('prompting');
      setMpesaCountdown(25);
      setSimulatedPin('1234');
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsOrderPlaced(true);
      }, 900);
    }
  };

  const handleAuthorizeMpesaPin = () => {
    setMpesaStatus('verifying');
    setTimeout(() => {
      const generatedMpesaRef = `QKG${Math.floor(10 + Math.random() * 89)}X${Math.floor(
        100 + Math.random() * 899
      )}KL`;
      setMpesaReceiptCode(generatedMpesaRef);
      setMpesaStatus('success');

      setTimeout(() => {
        setShowMpesaModal(false);
        setIsOrderPlaced(true);
      }, 1100);
    }, 1000);
  };

  const activeSettlementLabel = isLipaPolePoleActive
    ? `Lipa Pole Pole (${depositPercent}% Deposit via ${
        depositPaymentMethod === 'mpesa' ? 'M-Pesa STK Push' : 'RTGS Wire'
      })`
    : paymentMethod === 'mpesa'
    ? 'Lipa na M-Pesa STK Push'
    : paymentMethod === 'bank-wire'
    ? 'RTGS / Bank Wire Transfer'
    : paymentMethod === 'lpo-credit'
    ? 'Corporate LPO / 30-Day Credit'
    : 'Pay on Depot Collection';

  // 1. Order Confirmation Architectural Ledger
  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-[#F6F6F4] dark:bg-[#0D0F12] text-[#111315] dark:text-[#F3F4F6] py-10 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="mx-auto max-w-5xl">
          {/* Top Architectural Confirmation Header */}
          <div className="border-b border-[#E2E4E8] dark:border-[#262A33] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>HaoSail Order &amp; KRA E-TIMS Confirmation</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#111315] dark:text-white tracking-tight mt-2">
                Order Confirmed — {orderReference}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-[#5A606B] dark:text-slate-400 max-w-2xl">
                Reserved for {formData.companyName || formData.fullName || 'Workshop Client'} at our{' '}
                {currentCounty.mainTown} dispatch hub. Documentation queued for{' '}
                <span className="font-medium text-[#111315] dark:text-white">
                  {formData.email || 'your registered email'}
                </span>
                .
              </p>
            </div>

            <div className="font-mono text-xs text-[#5A606B] dark:text-slate-400 sm:text-right shrink-0">
              <div>Hub: {currentCounty.county}</div>
              <div>
                Dispatch:{' '}
                <span className="text-[#111315] dark:text-white font-semibold">
                  {deliveryMode === 'direct-site' ? 'Direct Tailgate' : 'Depot Collection'}
                </span>
              </div>
            </div>
          </div>

          {/* Two-Column Architectural Receipt Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#E2E4E8] dark:border-[#262A33]">
            {/* Left Column: Reserved Equipment Units */}
            <div className="lg:col-span-7 py-6 lg:pr-10 lg:border-r border-[#E2E4E8] dark:border-[#262A33]">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#111315] dark:text-white">
                  01 / Reserved Machinery Units
                </h2>
                <span className="font-mono text-xs text-[#5A606B] dark:text-slate-400 tabular-nums">
                  {totalUnits} {totalUnits === 1 ? 'unit' : 'units'} · {totalWeightKg.toLocaleString()} kg
                </span>
              </div>

              <div className="divide-y divide-[#E2E4E8] dark:divide-[#262A33] border-t border-[#E2E4E8] dark:border-[#262A33]">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="py-4 flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-24 sm:h-24 sm:w-28 rounded-sm object-cover border border-[#E2E4E8] dark:border-[#262A33] shrink-0 bg-[#ECECE8] dark:bg-[#1C2029]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="font-semibold text-[#004B97] dark:text-sky-400">
                          {product.sku}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-[#5A606B] dark:text-slate-400 tabular-nums">
                          Qty {quantity}
                        </span>
                      </div>
                      <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white truncate mt-0.5">
                        {product.name}
                      </h3>
                      <p className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400 mt-0.5 tabular-nums">
                        {formatKSh(product.price)} each
                      </p>
                    </div>
                    <div className="text-right font-mono text-sm font-bold text-[#111315] dark:text-white tabular-nums">
                      {formatKSh(product.price * quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Settlement & Financial Ledger */}
            <div className="lg:col-span-5 py-6 lg:pl-10 border-t lg:border-t-0 border-[#E2E4E8] dark:border-[#262A33] space-y-6">
              <div>
                <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#111315] dark:text-white mb-3">
                  02 / Settlement Record
                </h2>
                <div className="border-y border-[#E2E4E8] dark:border-[#262A33] py-3 space-y-2 text-xs">
                  <div className="flex justify-between gap-3">
                    <span className="text-[#5A606B] dark:text-slate-400">Method</span>
                    <span className="font-semibold text-[#111315] dark:text-white text-right">
                      {activeSettlementLabel}
                    </span>
                  </div>

                  {mpesaReceiptCode && (
                    <div className="flex justify-between gap-3 font-mono">
                      <span className="text-[#5A606B] dark:text-slate-400">M-PESA Ref</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {mpesaReceiptCode}
                      </span>
                    </div>
                  )}

                  {isLipaPolePoleActive && (
                    <>
                      <div className="flex justify-between gap-3 font-mono">
                        <span className="text-[#5A606B] dark:text-slate-400">Partner</span>
                        <span className="font-semibold text-[#111315] dark:text-white">
                          {financingChannel}
                        </span>
                      </div>
                      <div className="flex justify-between gap-3 font-mono">
                        <span className="text-[#5A606B] dark:text-slate-400">Installment Plan</span>
                        <span className="font-semibold text-[#004B97] dark:text-sky-400 tabular-nums">
                          {installmentCadence === 'monthly'
                            ? `${loanTenureMonths} × ${formatKSh(monthlyInstallment)}/mo`
                            : `${loanTenureWeeks} × ${formatKSh(weeklyInstallment)}/wk`}
                        </span>
                      </div>
                    </>
                  )}

                  {!isLipaPolePoleActive && paymentMethod === 'bank-wire' && (
                    <p className="font-mono text-[11px] text-[#5A606B] dark:text-slate-300 pt-1">
                      KCB Bank Kenya · Industrial Area · Acc 1298 4400 9123 · Ref {orderReference}
                    </p>
                  )}

                  {!isLipaPolePoleActive && paymentMethod === 'lpo-credit' && formData.poNumber && (
                    <div className="flex justify-between gap-3 font-mono">
                      <span className="text-[#5A606B] dark:text-slate-400">LPO Number</span>
                      <span className="font-semibold text-[#111315] dark:text-white">
                        {formData.poNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="font-display text-sm font-bold uppercase tracking-wider text-[#111315] dark:text-white mb-3">
                  03 / Financial Ledger
                </h2>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#5A606B] dark:text-slate-400">
                    <span>Machinery Subtotal</span>
                    <span className="font-mono font-medium text-[#111315] dark:text-white tabular-nums">
                      {formatKSh(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#5A606B] dark:text-slate-400">
                    <span>Freight ({currentCounty.mainTown})</span>
                    <span className="font-mono font-medium text-[#111315] dark:text-white tabular-nums">
                      {deliveryCost === 0 ? 'FREE' : formatKSh(deliveryCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#5A606B] dark:text-slate-400">
                    <span>16% VAT (KRA E-TIMS)</span>
                    <span className="font-mono font-medium text-[#111315] dark:text-white tabular-nums">
                      {formatKSh(vatAmount)}
                    </span>
                  </div>

                  <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-3 flex justify-between items-baseline">
                    <span className="font-display text-sm font-bold text-[#111315] dark:text-white">
                      Contract Total (KES)
                    </span>
                    <span className="font-mono text-base font-bold text-[#111315] dark:text-white tabular-nums">
                      {formatKSh(grandTotal)}
                    </span>
                  </div>

                  {isLipaPolePoleActive && (
                    <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-3 space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <span className="font-display text-sm font-bold text-[#004B97] dark:text-sky-400">
                          Deposit ({depositPercent}%) Settled
                        </span>
                        <span className="font-mono text-lg font-bold text-[#004B97] dark:text-sky-400 tabular-nums">
                          {formatKSh(depositDueToday)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] font-mono text-[#5A606B] dark:text-slate-400">
                        <span>Financed Balance</span>
                        <span className="tabular-nums">{formatKSh(financedBalance)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Footer Actions */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="btn-press w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#111315] dark:text-slate-200 hover:border-[#004B97] dark:hover:border-sky-400 cursor-pointer whitespace-nowrap"
            >
              <Printer className="h-4 w-4 text-[#004B97] dark:text-sky-400" />
              <span>Print Tax Proforma (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClearCart();
                onBackToCatalog();
              }}
              className="btn-press btn-nudge-left w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-[#004B97] hover:bg-[#003B78] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="h-4 w-4 btn-arrow" />
              <span>Return to Catalog</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Main Architectural Ledger Checkout
  return (
    <div className="min-h-screen bg-[#F6F6F4] dark:bg-[#0D0F12] text-[#111315] dark:text-[#F3F4F6] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        {/* Top Architectural Header Bounded by Hairline Rule */}
        <div className="border-b border-[#E2E4E8] dark:border-[#262A33] pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={onBackToCatalog}
              className="btn-nudge-left inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#004B97] dark:text-sky-400 hover:underline mb-2.5 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5 btn-arrow" />
              <span>Back to Machinery Catalog</span>
            </button>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#111315] dark:text-white tracking-tight">
              Commercial Procurement Checkout
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-[#5A606B] dark:text-slate-400">
            <span>KRA E-TIMS Compliant</span>
            <span aria-hidden="true">·</span>
            <span>5-Year Factory Warranty</span>
            <span aria-hidden="true">·</span>
            <span>47-County Freight Dispatch</span>
          </div>
        </div>

        {/* Empty Cart State — Hairline Architectural Layout */}
        {cartItems.length === 0 ? (
          <div className="py-12 border-b border-[#E2E4E8] dark:border-[#262A33]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E2E4E8] dark:border-[#262A33]">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#5A606B] dark:text-slate-400">
                  <ShoppingCart className="h-4 w-4 text-[#004B97] dark:text-sky-400" />
                  <span>Equipment Manifest Empty</span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#111315] dark:text-white mt-2">
                  No machinery queued for dispatch
                </h2>
                <p className="text-xs sm:text-sm text-[#5A606B] dark:text-slate-400 mt-1 max-w-xl">
                  Add equipment from our {PRODUCTS.length}-model catalog or select a core workshop machine below to initialize checkout.
                </p>
              </div>

              <button
                type="button"
                onClick={onBackToCatalog}
                className="btn-press btn-nudge-left inline-flex items-center gap-2 rounded-md bg-[#004B97] hover:bg-[#003B78] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white cursor-pointer whitespace-nowrap self-start md:self-auto"
              >
                <ArrowLeft className="h-4 w-4 btn-arrow" />
                <span>Browse All {PRODUCTS.length} Machines</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E4E8] dark:divide-[#262A33] border-b border-[#E2E4E8] dark:border-[#262A33]">
              {[
                { id: 'hs-dc-80k', cat: 'Dust Extraction', name: 'HaoSail DC-2000 Collector', price: 'KSh 80,000' },
                { id: 'hs-tc-210k', cat: 'Tyre Service', name: 'HaoSail TC-950 Tyre Changer', price: 'KSh 210,000' },
                { id: 'hs-sp-40k', cat: 'Workshop Press', name: 'HaoSail SP-20 20T Press', price: 'KSh 40,000' },
                { id: 'hs-ps-575k', cat: 'Panel Saw', name: 'HaoSail PS-3200 Sliding Saw', price: 'KSh 575,000' },
              ].map((quick) => (
                <div
                  key={quick.id}
                  className="py-5 sm:px-5 first:sm:pl-0 last:sm:pr-0 flex flex-col justify-between gap-4"
                >
                  <div>
                    <span className="font-mono text-[10px] font-semibold text-[#004B97] dark:text-sky-400 uppercase tracking-wider">
                      {quick.cat}
                    </span>
                    <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white mt-1 line-clamp-1">
                      {quick.name}
                    </h3>
                    <p className="text-xs font-mono font-semibold text-[#5A606B] dark:text-slate-300 mt-1 tabular-nums">
                      {quick.price}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(quick.id)}
                    className="btn-press inline-flex items-center justify-center gap-1.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] hover:border-[#004B97] dark:hover:border-sky-400 py-2 px-3 text-xs font-semibold text-[#111315] dark:text-white cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400" />
                    <span>Add to Checkout</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Two-Column Architectural Ledger Grid */
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12">
            {/* LEFT COLUMN: Hairline Procurement Sections (7 Cols) */}
            <div className="lg:col-span-7 lg:pr-10 lg:border-r border-[#E2E4E8] dark:border-[#262A33] divide-y divide-[#E2E4E8] dark:divide-[#262A33]">
              {/* Section 01: Buyer & KRA Tax Identity */}
              <section className="py-7">
                <div className="flex items-baseline justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs font-semibold text-[#004B97] dark:text-sky-400">
                        01 /
                      </span>
                      <h2 className="font-display text-base sm:text-lg font-bold text-[#111315] dark:text-white">
                        Buyer &amp; KRA Tax Identity
                      </h2>
                    </div>
                    <p className="text-xs text-[#5A606B] dark:text-slate-400 mt-0.5">
                      Required for factory warranty registration and KRA E-TIMS tax invoicing.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={hasWorkshopInput ? handleClearSampleWorkshop : handleFillSampleWorkshop}
                    className="font-mono text-[11px] font-medium text-[#004B97] dark:text-sky-400 hover:underline cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    {hasWorkshopInput ? 'Clear Fields' : 'Fill Sample Workshop'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1.5">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. David Mwangi"
                      required
                      className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-3 py-2.5 text-[#111315] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1.5">
                      Registered Workshop / Business Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Equator Precision Millwork Ltd"
                      required
                      className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-3 py-2.5 text-[#111315] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1.5">
                      Email for E-TIMS Invoicing *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="procurement@workshop.co.ke"
                      required
                      className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-3 py-2.5 text-[#111315] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1.5">
                      Kenya Revenue Authority (KRA) PIN *
                    </label>
                    <input
                      type="text"
                      name="kraPin"
                      value={formData.kraPin}
                      onChange={handleChange}
                      placeholder="P051839201Z"
                      required
                      className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-3 py-2.5 text-[#111315] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-mono focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Section 02: Regional Freight & Handover */}
              <section className="py-7">
                <div className="mb-5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-semibold text-[#004B97] dark:text-sky-400">
                      02 /
                    </span>
                    <h2 className="font-display text-base sm:text-lg font-bold text-[#111315] dark:text-white">
                      Regional Freight &amp; Handover
                    </h2>
                  </div>
                  <p className="text-xs text-[#5A606B] dark:text-slate-400 mt-0.5">
                    Select regional freight hub dispatch or overhead gantry collection.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1.5">
                      Destination County Hub
                    </label>
                    <select
                      name="countyId"
                      value={formData.countyId}
                      onChange={handleChange}
                      className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-3 py-2.5 text-[#111315] dark:text-white font-semibold focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none cursor-pointer"
                    >
                      {KENYAN_COUNTY_HUBS.map((hub) => (
                        <option key={hub.id} value={hub.id} className="dark:bg-[#15181E]">
                          {hub.county} — {hub.mainTown} Regional Hub ({hub.transitHours})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Segmented Hairline Delivery Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 border border-[#E2E4E8] dark:border-[#262A33] divide-y sm:divide-y-0 sm:divide-x divide-[#E2E4E8] dark:divide-[#262A33] rounded-sm overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('direct-site')}
                      className={`text-left p-4 cursor-pointer flex flex-col justify-between gap-2 border-b-2 ${
                        deliveryMode === 'direct-site'
                          ? 'bg-white dark:bg-[#15181E] border-b-[#004B97] dark:border-b-sky-400'
                          : 'bg-[#F6F6F4]/60 dark:bg-[#111318] border-b-transparent hover:bg-white/70 dark:hover:bg-[#15181E]/60'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-display text-xs font-bold text-[#111315] dark:text-white">
                          Direct Site Delivery
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#004B97] dark:text-sky-400 tabular-nums">
                          {currentCounty.tailgateCost === 0
                            ? 'FREE'
                            : formatKSh(currentCounty.tailgateCost)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5A606B] dark:text-slate-400">
                        Tailgate liftgate offloading direct to your workshop gate ({currentCounty.transitHours}).
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMode('depot-pickup')}
                      className={`text-left p-4 cursor-pointer flex flex-col justify-between gap-2 border-b-2 ${
                        deliveryMode === 'depot-pickup'
                          ? 'bg-white dark:bg-[#15181E] border-b-[#004B97] dark:border-b-sky-400'
                          : 'bg-[#F6F6F4]/60 dark:bg-[#111318] border-b-transparent hover:bg-white/70 dark:hover:bg-[#15181E]/60'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-display text-xs font-bold text-[#111315] dark:text-white">
                          Regional Depot Collection
                        </span>
                        <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                          {currentCounty.depotPickupCost === 0
                            ? 'FREE'
                            : formatKSh(currentCounty.depotPickupCost)}
                        </span>
                      </div>
                      <p
                        className="text-[11px] text-[#5A606B] dark:text-slate-400 truncate"
                        title={currentCounty.depotAddress}
                      >
                        {currentCounty.depotAddress} · Overhead gantry loading.
                      </p>
                    </button>
                  </div>

                  <div>
                    <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1.5">
                      Workshop Physical Address / Road Landmark *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-3 py-2.5 text-[#111315] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                      placeholder="e.g. Plot 48, Enterprise Road, Industrial Area"
                    />
                  </div>

                  {/* Installation Commissioning & Operator Training Add-Ons */}
                  <div className="pt-2">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="font-medium text-[#5A606B] dark:text-slate-300">
                        Optional Factory Commissioning &amp; Anchoring
                      </span>
                      <span className="font-mono text-[10px] text-[#004B97] dark:text-sky-400">
                        {selectedServices.length > 0
                          ? `${selectedServices.length} selected (+${formatKSh(servicesCost)})`
                          : 'On-site technician support'}
                      </span>
                    </div>

                    <div className="border border-[#E2E4E8] dark:border-[#262A33] divide-y divide-[#E2E4E8] dark:divide-[#262A33] rounded-sm bg-white dark:bg-[#15181E]">
                      {INSTALLATION_SERVICE_OPTIONS.map((service) => {
                        const isChecked = selectedServices.includes(service.id);
                        return (
                          <label
                            key={service.id}
                            className={`flex items-start gap-3 p-3.5 cursor-pointer transition-colors ${
                              isChecked
                                ? 'bg-[#004B97]/[0.04] dark:bg-sky-400/[0.06]'
                                : 'hover:bg-[#F6F6F4]/70 dark:hover:bg-[#1C2029]/60'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleService(service.id)}
                              className="mt-0.5 rounded border-slate-300 text-[#004B97] focus:ring-[#004B97] dark:border-slate-600 dark:bg-[#0D0F12] cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between gap-3">
                                <span className="font-display font-bold text-[#111315] dark:text-white">
                                  {service.name}
                                </span>
                                <span className="font-mono font-semibold text-[#004B97] dark:text-sky-400 tabular-nums shrink-0">
                                  +{formatKSh(service.cost)}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#5A606B] dark:text-slate-400 mt-0.5 leading-relaxed">
                                {service.description}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 03: Settlement & Lipa Pole Pole (> KES 80,000) */}
              <section className="py-7">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs font-semibold text-[#004B97] dark:text-sky-400">
                        03 /
                      </span>
                      <h2 className="font-display text-base sm:text-lg font-bold text-[#111315] dark:text-white">
                        Settlement{isLipaPolePoleEligible ? ' & Lipa Pole Pole' : ' Method'}
                      </h2>
                    </div>
                    <p className="text-xs text-[#5A606B] dark:text-slate-400 mt-0.5">
                      {isLipaPolePoleEligible
                        ? 'Pay 100% now or split via Lipa Pole Pole deposit (qualifies above KSh 80,000).'
                        : 'Select M-Pesa STK Push, RTGS Bank Wire, Corporate LPO, or Depot Collection.'}
                    </p>
                  </div>
                </div>

                {/* Settlement Mode Switcher (Unlocked strictly for orders > KES 80,000) */}
                {isLipaPolePoleEligible && (
                  <div className="mb-5 grid grid-cols-2 border border-[#E2E4E8] dark:border-[#262A33] divide-x divide-[#E2E4E8] dark:divide-[#262A33] rounded-sm overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => setSettlementMode('full')}
                      className={`p-3.5 text-left cursor-pointer border-b-2 ${
                        settlementMode === 'full'
                          ? 'bg-white dark:bg-[#15181E] border-b-[#004B97] dark:border-b-sky-400'
                          : 'bg-[#F6F6F4]/60 dark:bg-[#111318] border-b-transparent hover:bg-white/70 dark:hover:bg-[#15181E]/60'
                      }`}
                    >
                      <span className="font-display font-bold text-[#111315] dark:text-white block">
                        Pay in Full
                      </span>
                      <span className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400 tabular-nums">
                        {formatKSh(grandTotal)}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSettlementMode('lipa-pole-pole')}
                      className={`p-3.5 text-left cursor-pointer border-b-2 ${
                        settlementMode === 'lipa-pole-pole'
                          ? 'bg-white dark:bg-[#15181E] border-b-[#004B97] dark:border-b-sky-400'
                          : 'bg-[#F6F6F4]/60 dark:bg-[#111318] border-b-transparent hover:bg-white/70 dark:hover:bg-[#15181E]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display font-bold text-[#111315] dark:text-white">
                          Lipa Pole Pole
                        </span>
                        <span className="font-mono text-[10px] font-semibold text-[#004B97] dark:text-sky-400">
                          {depositPercent}% Deposit
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400 tabular-nums">
                        {formatKSh(depositDueToday)} today · {formatKSh(activeInstallment)}/
                        {installmentCadence === 'monthly' ? 'mo' : 'wk'}
                      </span>
                    </button>
                  </div>
                )}

                {isLipaPolePoleActive ? (
                  /* LIPA POLE POLE CHECKOUT PANEL */
                  <div className="space-y-5 text-xs">
                    {/* Hairline 3-column financing breakdown */}
                    <div className="grid grid-cols-3 divide-x divide-[#E2E4E8] dark:divide-[#262A33] border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] rounded-sm py-3">
                      <div className="px-3.5">
                        <span className="block font-mono text-[10px] uppercase text-[#5A606B] dark:text-slate-400">
                          Deposit ({depositPercent}%)
                        </span>
                        <span className="mt-0.5 block font-mono text-sm font-bold text-[#111315] dark:text-white tabular-nums">
                          {formatKSh(depositDueToday)}
                        </span>
                      </div>
                      <div className="px-3.5">
                        <span className="block font-mono text-[10px] uppercase text-[#5A606B] dark:text-slate-400">
                          Balance
                        </span>
                        <span className="mt-0.5 block font-mono text-sm font-bold text-[#111315] dark:text-white tabular-nums">
                          {formatKSh(financedBalance)}
                        </span>
                      </div>
                      <div className="px-3.5">
                        <span className="block font-mono text-[10px] uppercase text-[#004B97] dark:text-sky-400">
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

                    {/* Deposit Ratio & Tenure Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1.5">
                          Down Payment Ratio
                        </span>
                        <div className="grid grid-cols-4 border border-[#E2E4E8] dark:border-[#262A33] divide-x divide-[#E2E4E8] dark:divide-[#262A33] rounded-sm overflow-hidden">
                          {DEPOSIT_PERCENTAGES.map((pct) => (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => setDepositPercent(pct)}
                              className={`py-2 font-mono text-[11px] font-semibold cursor-pointer ${
                                depositPercent === pct
                                  ? 'bg-[#004B97] text-white'
                                  : 'bg-white dark:bg-[#15181E] text-[#111315] dark:text-slate-300 hover:bg-[#F6F6F4] dark:hover:bg-[#1C2029]'
                              }`}
                            >
                              {pct}%
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-medium text-[#5A606B] dark:text-slate-300">
                            Installment Term
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

                        <div className="grid grid-cols-4 border border-[#E2E4E8] dark:border-[#262A33] divide-x divide-[#E2E4E8] dark:divide-[#262A33] rounded-sm overflow-hidden">
                          {installmentCadence === 'monthly'
                            ? MONTHLY_TENURES.map((m) => (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => setLoanTenureMonths(m)}
                                  className={`py-2 font-mono text-[11px] font-semibold cursor-pointer ${
                                    loanTenureMonths === m
                                      ? 'bg-[#004B97] text-white'
                                      : 'bg-white dark:bg-[#15181E] text-[#111315] dark:text-slate-300 hover:bg-[#F6F6F4] dark:hover:bg-[#1C2029]'
                                  }`}
                                >
                                  {m}m
                                </button>
                              ))
                            : WEEKLY_TENURES.map((w) => (
                                <button
                                  key={w}
                                  type="button"
                                  onClick={() => setLoanTenureWeeks(w)}
                                  className={`py-2 font-mono text-[11px] font-semibold cursor-pointer ${
                                    loanTenureWeeks === w
                                      ? 'bg-[#004B97] text-white'
                                      : 'bg-white dark:bg-[#15181E] text-[#111315] dark:text-slate-300 hover:bg-[#F6F6F4] dark:hover:bg-[#1C2029]'
                                  }`}
                                >
                                  {w}w
                                </button>
                              ))}
                        </div>
                      </div>
                    </div>

                    {/* Financing Partner & Deposit Channel */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1.5">
                          Financing Partner Channel
                        </label>
                        <select
                          value={financingChannel}
                          onChange={(e) => setFinancingChannel(e.target.value)}
                          className="w-full rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-3 py-2.5 text-[#111315] dark:text-white font-medium focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none cursor-pointer"
                        >
                          <option value="M-Pesa Paybill 408282" className="dark:bg-[#15181E]">
                            M-Pesa Paybill 408282
                          </option>
                          <option value="KCB Lipa Pole Pole" className="dark:bg-[#15181E]">
                            KCB Lipa Pole Pole
                          </option>
                          <option value="NCBA Flex Plan" className="dark:bg-[#15181E]">
                            NCBA Flex Plan
                          </option>
                        </select>
                      </div>

                      <div>
                        <span className="block font-medium text-[#5A606B] dark:text-slate-300 mb-1.5">
                          Pay Deposit Today Via
                        </span>
                        <div className="grid grid-cols-2 border border-[#E2E4E8] dark:border-[#262A33] divide-x divide-[#E2E4E8] dark:divide-[#262A33] rounded-sm overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setDepositPaymentMethod('mpesa')}
                            className={`py-2.5 px-2 text-xs font-semibold cursor-pointer ${
                              depositPaymentMethod === 'mpesa'
                                ? 'bg-[#004B97] text-white'
                                : 'bg-white dark:bg-[#15181E] text-[#111315] dark:text-slate-300 hover:bg-[#F6F6F4] dark:hover:bg-[#1C2029]'
                            }`}
                          >
                            M-Pesa STK Push
                          </button>
                          <button
                            type="button"
                            onClick={() => setDepositPaymentMethod('bank-wire')}
                            className={`py-2.5 px-2 text-xs font-semibold cursor-pointer ${
                              depositPaymentMethod === 'bank-wire'
                                ? 'bg-[#004B97] text-white'
                                : 'bg-white dark:bg-[#15181E] text-[#111315] dark:text-slate-300 hover:bg-[#F6F6F4] dark:hover:bg-[#1C2029]'
                            }`}
                          >
                            RTGS Bank Wire
                          </button>
                        </div>
                      </div>
                    </div>

                    {depositPaymentMethod === 'mpesa' && (
                      <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-4">
                        <label className="block font-medium text-[#111315] dark:text-slate-200 mb-1.5">
                          Safaricom Number for {formatKSh(depositDueToday)} Deposit STK Push *
                        </label>
                        <input
                          type="tel"
                          name="mpesaNumber"
                          value={formData.mpesaNumber}
                          onChange={handleChange}
                          required
                          className="w-full sm:w-72 rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-3 py-2 text-[#111315] dark:text-white font-mono font-semibold focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                          placeholder="07XX XXX XXX"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  /* FULL PAYMENT SEGMENTED ARCHITECTURAL GRID */
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 border border-[#E2E4E8] dark:border-[#262A33] rounded-sm overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('mpesa')}
                        className={`text-left p-4 cursor-pointer border-b border-r border-[#E2E4E8] dark:border-[#262A33] ${
                          paymentMethod === 'mpesa'
                            ? 'bg-white dark:bg-[#15181E] ring-1 ring-inset ring-[#004B97] dark:ring-sky-400'
                            : 'bg-[#F6F6F4]/60 dark:bg-[#111318] hover:bg-white/70 dark:hover:bg-[#15181E]/60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-display text-xs font-bold text-[#111315] dark:text-white">
                            Lipa na M-Pesa (STK Push)
                          </span>
                          <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                            Instant
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5A606B] dark:text-slate-400">
                          Automated Safaricom handset prompt via Paybill 408282.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank-wire')}
                        className={`text-left p-4 cursor-pointer border-b border-[#E2E4E8] dark:border-[#262A33] ${
                          paymentMethod === 'bank-wire'
                            ? 'bg-white dark:bg-[#15181E] ring-1 ring-inset ring-[#004B97] dark:ring-sky-400'
                            : 'bg-[#F6F6F4]/60 dark:bg-[#111318] hover:bg-white/70 dark:hover:bg-[#15181E]/60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-display text-xs font-bold text-[#111315] dark:text-white">
                            RTGS / Bank Wire Transfer
                          </span>
                          <span className="font-mono text-[10px] text-[#004B97] dark:text-sky-400 font-semibold">
                            KCB Bank
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5A606B] dark:text-slate-400">
                          Official Industrial Area account with KRA E-TIMS proforma.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('lpo-credit')}
                        className={`text-left p-4 cursor-pointer border-b sm:border-b-0 sm:border-r border-[#E2E4E8] dark:border-[#262A33] ${
                          paymentMethod === 'lpo-credit'
                            ? 'bg-white dark:bg-[#15181E] ring-1 ring-inset ring-[#004B97] dark:ring-sky-400'
                            : 'bg-[#F6F6F4]/60 dark:bg-[#111318] hover:bg-white/70 dark:hover:bg-[#15181E]/60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-display text-xs font-bold text-[#111315] dark:text-white">
                            Corporate LPO / 30-Day Credit
                          </span>
                          <span className="font-mono text-[10px] text-[#5A606B] dark:text-slate-400 font-semibold">
                            B2B / TVET
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5A606B] dark:text-slate-400">
                          For registered contractors, TVET institutes, and corporate firms.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('depot-pay')}
                        className={`text-left p-4 cursor-pointer ${
                          paymentMethod === 'depot-pay'
                            ? 'bg-white dark:bg-[#15181E] ring-1 ring-inset ring-[#004B97] dark:ring-sky-400'
                            : 'bg-[#F6F6F4]/60 dark:bg-[#111318] hover:bg-white/70 dark:hover:bg-[#15181E]/60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-display text-xs font-bold text-[#111315] dark:text-white">
                            Pay on Depot Collection
                          </span>
                          <span className="font-mono text-[10px] text-[#5A606B] dark:text-slate-400 font-semibold">
                            {currentCounty.mainTown}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5A606B] dark:text-slate-400">
                          Inspect machine at our {currentCounty.mainTown} hub prior to dispatch.
                        </p>
                      </button>
                    </div>

                    {paymentMethod === 'mpesa' && (
                      <div className="pt-2">
                        <label className="block font-medium text-[#111315] dark:text-slate-200 mb-1.5">
                          Safaricom Mobile Number for Daraja STK Push *
                        </label>
                        <input
                          type="tel"
                          name="mpesaNumber"
                          value={formData.mpesaNumber}
                          onChange={handleChange}
                          required
                          className="w-full sm:w-72 rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-3 py-2 text-[#111315] dark:text-white font-mono font-semibold focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                          placeholder="07XX XXX XXX"
                        />
                        <p className="text-[11px] text-[#5A606B] dark:text-slate-400 mt-1.5">
                          Submitting sends a simulated Safaricom M-Pesa authorization prompt for{' '}
                          <span className="font-mono font-semibold text-[#111315] dark:text-white tabular-nums">
                            {formatKSh(grandTotal)}
                          </span>
                          .
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'lpo-credit' && (
                      <div className="pt-2">
                        <label className="block font-medium text-[#111315] dark:text-slate-200 mb-1.5">
                          Official LPO Reference Number (Optional)
                        </label>
                        <input
                          type="text"
                          name="poNumber"
                          value={formData.poNumber}
                          onChange={handleChange}
                          className="w-full sm:w-72 rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-3 py-2 text-[#111315] dark:text-white font-mono focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                          placeholder="e.g. LPO-2026-0419"
                        />
                      </div>
                    )}

                    {paymentMethod === 'bank-wire' && (
                      <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-3 font-mono text-[11px] text-[#5A606B] dark:text-slate-400">
                        KCB Bank Kenya · Industrial Area Branch · Acc{' '}
                        <span className="font-semibold text-[#111315] dark:text-white">
                          1298 4400 9123
                        </span>{' '}
                        (KES) · E-TIMS proforma issued upon confirmation.
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN: Sticky Order Manifest & Financial Ledger (5 Cols) */}
            <div className="lg:col-span-5 lg:pl-10 py-7 border-t lg:border-t-0 border-[#E2E4E8] dark:border-[#262A33]">
              <div className="lg:sticky lg:top-20">
                {/* Ledger Rail Header */}
                <div className="flex items-baseline justify-between border-b border-[#E2E4E8] dark:border-[#262A33] pb-3.5 mb-5">
                  <h2 className="font-display text-base font-bold text-[#111315] dark:text-white">
                    Equipment Manifest
                  </h2>
                  <span className="font-mono text-xs font-medium text-[#004B97] dark:text-sky-400 tabular-nums">
                    {totalUnits} {totalUnits === 1 ? 'Unit' : 'Units'} · {totalWeightKg.toLocaleString()} kg
                  </span>
                </div>

                {/* Line Items with Prominent Machinery Photography */}
                <div className="max-h-[420px] overflow-y-auto divide-y divide-[#E2E4E8] dark:divide-[#262A33] pr-1">
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product.id} className="py-4 first:pt-0 flex gap-4 items-center">
                      <div className="h-24 w-32 sm:h-28 sm:w-36 rounded-sm overflow-hidden border border-[#E2E4E8] dark:border-[#262A33] bg-[#ECECE8] dark:bg-[#1C2029] shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-[10px] font-semibold text-[#004B97] dark:text-sky-400 uppercase block">
                          {product.sku}
                        </span>
                        <h3 className="font-display text-xs sm:text-sm font-bold text-[#111315] dark:text-white line-clamp-2 mt-0.5">
                          {product.name}
                        </h3>

                        <div className="flex items-center justify-between gap-2 mt-2.5">
                          <div className="flex items-center border border-[#E2E4E8] dark:border-[#262A33] rounded-sm bg-white dark:bg-[#15181E]">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                              className="px-2 py-1 text-[#5A606B] dark:text-slate-300 hover:text-[#111315] dark:hover:text-white cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-mono font-bold text-[#111315] dark:text-white tabular-nums">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                              className="px-2 py-1 text-[#5A606B] dark:text-slate-300 hover:text-[#111315] dark:hover:text-white cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="font-mono text-sm font-bold text-[#111315] dark:text-white tabular-nums">
                            {formatKSh(product.price * quantity)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer shrink-0"
                        title="Remove machine from order"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Compatible Consumables & Rigging Add-Ons */}
                {(() => {
                  const cartIds = new Set(cartItems.map((i) => i.product.id));
                  const categories = Array.from(new Set(cartItems.map((i) => i.product.category)));
                  const matchedAccessories: AccessoryItem[] = [];
                  for (const cat of categories) {
                    for (const acc of ACCESSORIES_BY_CATEGORY[cat] || []) {
                      if (!cartIds.has(acc.id) && !matchedAccessories.some((a) => a.id === acc.id)) {
                        matchedAccessories.push(acc);
                      }
                      if (matchedAccessories.length >= 3) break;
                    }
                    if (matchedAccessories.length >= 3) break;
                  }
                  if (matchedAccessories.length === 0) return null;

                  return (
                    <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-4 mt-4">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#5A606B] dark:text-slate-400">
                          Compatible Consumables &amp; Anchors
                        </span>
                        <span className="font-mono text-[10px] text-[#004B97] dark:text-sky-400">
                          1-Click Add
                        </span>
                      </div>
                      <div className="space-y-2">
                        {matchedAccessories.map((acc) => (
                          <div
                            key={acc.id}
                            className="flex items-center justify-between gap-2.5 rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-2"
                          >
                            <img
                              src={acc.image}
                              alt={acc.name}
                              className="h-9 w-9 rounded-sm object-cover border border-[#E2E4E8] dark:border-[#262A33] shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-semibold text-[#111315] dark:text-white truncate">
                                {acc.name}
                              </p>
                              <span className="font-mono text-[10px] text-[#5A606B] dark:text-slate-400 tabular-nums">
                                {formatKSh(acc.price)} · {acc.sku}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => onAddToCart(accessoryToProduct(acc), 1)}
                              className="btn-press rounded-sm border border-[#004B97] dark:border-sky-400 px-2.5 py-1 font-mono text-[10px] font-semibold text-[#004B97] dark:text-sky-400 hover:bg-[#004B97] hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                            >
                              + Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Festive Voucher Code Box */}
                <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-4 mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#5A606B] dark:text-slate-400">
                      Year-End / Festive Voucher Code
                    </span>
                    {appliedVoucher === 'FESTIVE26' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedVoucher('');
                          setVoucherInput('');
                          onVoucherChange?.('');
                        }}
                        className="font-mono text-[10px] text-[#004B97] dark:text-sky-400 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setVoucherInput('FESTIVE26');
                          setAppliedVoucher('FESTIVE26');
                          onVoucherChange?.('FESTIVE26');
                        }}
                        className="font-mono text-[10px] text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        Use FESTIVE26 (-5%)
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                      placeholder="Enter voucher (e.g. FESTIVE26)"
                      className="flex-1 rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-2.5 py-1.5 font-mono text-xs text-[#111315] dark:text-white placeholder-slate-400 focus:border-[#004B97] dark:focus:border-sky-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const normalized = voucherInput.trim().toUpperCase();
                        if (normalized === 'FESTIVE26') {
                          setAppliedVoucher('FESTIVE26');
                          onVoucherChange?.('FESTIVE26');
                        } else {
                          setAppliedVoucher('');
                          onVoucherChange?.('');
                        }
                      }}
                      className="btn-press rounded-sm border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#1C2029] hover:border-[#004B97] dark:hover:border-sky-400 px-3 py-1.5 font-mono text-[11px] font-semibold text-[#111315] dark:text-white cursor-pointer whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Hairline Financial Ledger */}
                <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-4 mt-4 space-y-2 text-xs text-[#5A606B] dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Machinery Subtotal</span>
                    <span className="font-mono font-semibold text-[#111315] dark:text-white tabular-nums">
                      {formatKSh(subtotal)}
                    </span>
                  </div>
                  {voucherDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                      <span>Festive Voucher ({appliedVoucher} · 5%)</span>
                      <span className="font-mono font-semibold tabular-nums">
                        −{formatKSh(voucherDiscount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Logistics ({currentCounty.mainTown})</span>
                    <span className="font-mono font-semibold text-[#111315] dark:text-white tabular-nums">
                      {deliveryCost === 0 ? 'FREE' : formatKSh(deliveryCost)}
                    </span>
                  </div>
                  {servicesCost > 0 && (
                    <div className="flex justify-between">
                      <span>Engineering &amp; Commissioning</span>
                      <span className="font-mono font-semibold text-[#111315] dark:text-white tabular-nums">
                        {formatKSh(servicesCost)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>16% VAT (KRA E-TIMS)</span>
                    <span className="font-mono font-semibold text-[#111315] dark:text-white tabular-nums">
                      {formatKSh(vatAmount)}
                    </span>
                  </div>

                  {isLipaPolePoleActive ? (
                    <>
                      <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-3 flex justify-between items-baseline text-[#111315] dark:text-white">
                        <span className="font-medium">Total Contract Value</span>
                        <span className="font-mono text-sm font-semibold tabular-nums">
                          {formatKSh(grandTotal)}
                        </span>
                      </div>

                      <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-3 space-y-1">
                        <div className="flex justify-between items-baseline text-[#111315] dark:text-white">
                          <span className="font-display text-sm font-bold">
                            Due Today ({depositPercent}% Deposit)
                          </span>
                          <span className="text-[#004B97] dark:text-sky-400 font-mono font-bold text-xl tracking-tight tabular-nums">
                            {formatKSh(depositDueToday)}
                          </span>
                        </div>
                        <div className="flex justify-between font-mono text-[11px] text-[#5A606B] dark:text-slate-400 tabular-nums">
                          <span>Balance Schedule ({financingChannel})</span>
                          <span>
                            {installmentCadence === 'monthly'
                              ? `${loanTenureMonths} × ${formatKSh(monthlyInstallment)}/mo`
                              : `${loanTenureWeeks} × ${formatKSh(weeklyInstallment)}/wk`}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-3 flex justify-between items-baseline text-[#111315] dark:text-white">
                      <span className="font-display text-sm font-bold">Total Payable (KES)</span>
                      <span className="text-[#004B97] dark:text-sky-400 font-mono font-bold text-xl tracking-tight tabular-nums">
                        {formatKSh(grandTotal)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Primary Checkout Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-press btn-nudge mt-6 w-full rounded-md bg-[#004B97] hover:bg-[#003B78] py-3.5 px-5 text-xs font-semibold uppercase tracking-wider text-white flex items-center justify-center cursor-pointer disabled:opacity-60 whitespace-nowrap"
                >
                  <span className="kinetic-roll">
                    <span
                      className={`kinetic-face ${
                        isSubmitting
                          ? '-translate-y-full opacity-0'
                          : 'translate-y-0 opacity-100'
                      }`}
                    >
                      <span>
                        {requiresMpesaStk
                          ? `Authorize ${isLipaPolePoleActive ? 'Deposit' : 'M-Pesa'} (${formatKSh(
                              dueTodayAmount
                            )})`
                          : 'Complete Order & Generate Proforma'}
                      </span>
                      <ArrowRight className="h-4 w-4 btn-arrow" />
                    </span>
                    <span
                      aria-hidden={!isSubmitting}
                      className={`kinetic-face absolute inset-0 ${
                        isSubmitting
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-full opacity-0'
                      }`}
                    >
                      <span>Confirming Procurement Order...</span>
                    </span>
                  </span>
                </button>

                <p className="mt-3 text-center font-mono text-[11px] text-[#5A606B] dark:text-slate-400">
                  KRA E-TIMS Invoice · 5-Year Factory Warranty · Transit Insured
                </p>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Interactive Safaricom Daraja M-Pesa STK Push Simulation Modal */}
      {showMpesaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0F12]/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-lg bg-white dark:bg-[#15181E] shadow-2xl border border-[#E2E4E8] dark:border-[#262A33]">
            {/* Safaricom Green Header Strip */}
            <div className="bg-[#00a859] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-sm bg-white text-[#00a859] flex items-center justify-center font-mono font-bold text-xs">
                  M
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm leading-none">
                    Lipa na M-PESA STK Push
                  </h3>
                  <span className="text-[10px] text-emerald-100 font-mono">
                    Paybill 408282 · HaoSail Industrial Kenya
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMpesaModal(false)}
                className="btn-press text-emerald-100 hover:text-white p-1 rounded cursor-pointer"
                aria-label="Close M-Pesa prompt"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {mpesaStatus === 'prompting' && (
                <>
                  <div>
                    <h4 className="font-display font-bold text-[#111315] dark:text-white text-base">
                      Authorize on Handset ({formData.mpesaNumber || '07XX XXX XXX'})
                    </h4>
                    <p className="text-xs text-[#5A606B] dark:text-slate-400 mt-1">
                      Confirm {isLipaPolePoleActive ? `${depositPercent}% Lipa Pole Pole deposit` : 'order settlement'} on your Safaricom SIM toolkit prompt.
                    </p>
                  </div>

                  <div className="border-y border-[#E2E4E8] dark:border-[#262A33] py-3 font-mono text-xs space-y-2">
                    <div className="flex justify-between text-[#5A606B] dark:text-slate-400">
                      <span>Account Ref</span>
                      <span className="font-bold text-[#111315] dark:text-white">
                        {orderReference}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#5A606B] dark:text-slate-400">
                      <span>Amount Due</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                        {formatKSh(dueTodayAmount)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#E2E4E8] dark:border-[#262A33]">
                      <label className="block text-[11px] text-[#5A606B] dark:text-slate-400 mb-1.5">
                        Enter Simulated M-PESA PIN
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={simulatedPin}
                        onChange={(e) => setSimulatedPin(e.target.value)}
                        className="w-full text-center text-lg tracking-widest font-mono font-bold bg-[#F6F6F4] dark:bg-[#0D0F12] rounded-sm border border-[#E2E4E8] dark:border-[#262A33] p-2 text-[#111315] dark:text-white focus:border-[#00a859] focus:outline-none"
                        placeholder="••••"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#5A606B] dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      <span>
                        Timeout in <strong className="font-mono tabular-nums">{mpesaCountdown}s</strong>
                      </span>
                    </span>
                    <span className="font-mono text-[11px]">Daraja Sandbox</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAuthorizeMpesaPin}
                    className="btn-press btn-nudge w-full py-3 rounded-md bg-[#00a859] hover:bg-[#008f4c] text-white font-semibold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span>Authorize {formatKSh(dueTodayAmount)}</span>
                    <ArrowRight className="h-3.5 w-3.5 btn-arrow" />
                  </button>
                </>
              )}

              {mpesaStatus === 'verifying' && (
                <div className="py-10 text-center space-y-2">
                  <div className="mx-auto h-8 w-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
                  <h4 className="font-display font-bold text-[#111315] dark:text-white text-sm pt-2">
                    Verifying with Safaricom Daraja...
                  </h4>
                  <p className="text-xs text-[#5A606B] dark:text-slate-400 font-mono">
                    Confirming M-Pesa callback for {formatKSh(dueTodayAmount)}
                  </p>
                </div>
              )}

              {mpesaStatus === 'success' && (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-display font-bold text-[#111315] dark:text-white text-base">
                    Payment Verified
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono">
                    M-Pesa Ref: {mpesaReceiptCode}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
