import React, { useState } from 'react';
import { X, CheckCircle2, Truck, ShieldCheck, Printer, Building2, CreditCard, FileText } from 'lucide-react';
import { CartItem } from '../types/machinery';
import { formatKSh } from '../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [facilityType, setFacilityType] = useState<'commercial-dock' | 'residential-liftgate'>('residential-liftgate');
  const [formData, setFormData] = useState({
    companyName: 'Apex Woodcraft Studios',
    contactName: 'Brian Kibet',
    email: 'brian@apexwoodcraft.co.ke',
    phone: '+254 712 345 678',
    address: 'Enterprise Road, Industrial Area',
    city: 'Nairobi',
    state: 'Nairobi',
    zip: '00100',
    poNumber: 'HS-2026-084',
    paymentMethod: 'invoice',
  });

  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalWeightLbs = cartItems.reduce(
    (sum, item) => sum + item.product.specs.weightLbs * item.quantity,
    0
  );
  const estimatedTax = Math.round(subtotal * 0.16);
  const total = subtotal + estimatedTax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `HS-${randomNum}-KE`;
    setOrderId(newOrderId);
    setStep('confirmation');
    onOrderCompleted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={() => { if (step !== 'confirmation') onClose(); }} 
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#004b97]" />
            <h2 className="font-display text-lg font-bold text-slate-900">
              {step === 'confirmation' ? 'Order Confirmed & Freight Queued' : 'Commercial Freight Order & Quotation'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'confirmation' ? (
            /* Order Confirmation View */
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#004b97]">
                  Official HaoSail Commercial Order Booked
                </span>
                <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                  Reference: {orderId}
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  A commercial confirmation receipt and freight tracking notice has been dispatched to{' '}
                  <strong className="text-slate-900">{formData.email}</strong>.
                </p>
              </div>

              {/* Freight Status Stepper */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                  <span>Shipment Mass: <strong className="text-slate-900">{totalWeightLbs} lbs</strong></span>
                  <span>Carrier: <strong className="text-[#004b97]">HaoSail Direct Logistics</strong></span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="rounded-lg border border-[#004b97] bg-blue-50 p-2 text-[#004b97]">
                    <div className="font-bold">1. Queued</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">Depot Inventory Reserved</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500">
                    <div className="font-bold">2. Palletizing</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Heavy Timber Crating</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500">
                    <div className="font-bold">3. In Transit</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Hydraulic Liftgate Truck</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Commercial Bill of Lading</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-[#004b97] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#003366] shadow-xs"
                >
                  Return to Machinery Catalog
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Stepper Tabs */}
              <div className="flex border-b border-slate-200 pb-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className={`flex items-center gap-2 ${step === 'shipping' ? 'text-[#004b97] font-bold' : 'text-slate-400'}`}
                >
                  <Truck className="h-4 w-4" />
                  <span>1. Delivery Destination & Facility</span>
                </button>
                <span className="mx-4 text-slate-300">/</span>
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className={`flex items-center gap-2 ${step === 'payment' ? 'text-[#004b97] font-bold' : 'text-slate-400'}`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>2. Payment / Corporate Invoicing</span>
                </button>
              </div>

              {step === 'shipping' ? (
                <div className="space-y-4">
                  {/* Facility Selection */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Receiving Facility Capabilities
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setFacilityType('residential-liftgate')}
                        className={`rounded-xl border p-3 cursor-pointer transition-colors ${
                          facilityType === 'residential-liftgate'
                            ? 'border-[#004b97] bg-blue-50/70'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <p className="font-bold text-xs text-slate-900">Standard Delivery + Liftgate</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Hydraulic tail-lift lowering machine crate to ground level.
                        </p>
                      </div>

                      <div
                        onClick={() => setFacilityType('commercial-dock')}
                        className={`rounded-xl border p-3 cursor-pointer transition-colors ${
                          facilityType === 'commercial-dock'
                            ? 'border-[#004b97] bg-blue-50/70'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <p className="font-bold text-xs text-slate-900">Commercial Loading Dock / Forklift</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Recipient has dedicated elevated dock or heavy forklift on site.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">Company / Business Name</label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-[#004b97] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">Authorized Receiving Contact</label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-[#004b97] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">Email for Freight Tracking</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-[#004b97] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">Receiving Site Phone</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-[#004b97] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-600 mb-1 font-semibold">Commercial Delivery Address</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-[#004b97] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">City</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-[#004b97] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 focus:border-[#004b97] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep('payment')}
                      className="rounded-xl bg-[#004b97] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#003366] shadow-xs"
                    >
                      Continue to Payment & Invoicing
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Payment Options */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
                      Payment or Billing Method
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setFormData({ ...formData, paymentMethod: 'invoice' })}
                        className={`rounded-xl border p-3 cursor-pointer transition-colors ${
                          formData.paymentMethod === 'invoice'
                            ? 'border-[#004b97] bg-blue-50/70'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#004b97]" />
                          <p className="font-bold text-xs text-slate-900">Commercial Pro-Forma Invoice (KRA e-TIMS)</p>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Official tax invoice with Net 30 terms and corporate PO verification.
                        </p>
                      </div>

                      <div
                        onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                        className={`rounded-xl border p-3 cursor-pointer transition-colors ${
                          formData.paymentMethod === 'card'
                            ? 'border-[#004b97] bg-blue-50/70'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-[#004b97]" />
                          <p className="font-bold text-xs text-slate-900">M-PESA Paybill / RTGS Bank Wire / Card</p>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Direct instant settlement via M-PESA Paybill, NCBA/KCB/Equity bank wire.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Purchase order number input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Purchase Order (PO) / Tax ID Number
                    </label>
                    <input
                      type="text"
                      value={formData.poNumber}
                      onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-[#004b97] focus:outline-none"
                    />
                  </div>

                  {/* Order Total Summary */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-normal">
                    <div className="flex justify-between text-slate-600">
                      <span>Machinery Subtotal:</span>
                      <span className="text-slate-900 font-semibold">{formatKSh(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 mt-1">
                      <span>Factory Freight Delivery:</span>
                      <span className="text-emerald-700 font-semibold">Complimentary (Over KSh 200,000)</span>
                    </div>
                    <div className="flex justify-between text-slate-600 mt-1">
                      <span>Estimated VAT (16% KRA):</span>
                      <span className="text-slate-900 font-normal">{formatKSh(estimatedTax)}</span>
                    </div>
                    <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between text-sm text-slate-900">
                      <span className="font-bold">Total Due (KES):</span>
                      <span className="text-[#004b97] font-semibold tracking-tight">{formatKSh(total)}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="text-xs font-normal text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      ← Back to Shipping
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#004b97] px-6 py-2.5 text-xs font-normal text-white hover:bg-[#003366] shadow-xs cursor-pointer"
                    >
                      Submit Commercial Order & Book Freight
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
