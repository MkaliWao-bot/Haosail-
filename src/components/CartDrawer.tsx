import React, { useState } from 'react';
import {
  X,
  Trash2,
  Truck,
  ShieldCheck,
  ArrowRight,
  ShoppingCart,
  Plus,
  Minus,
  MessageCircle,
  Wrench,
  FileText,
} from 'lucide-react';
import { CartItem, Product } from '../types/machinery';
import { formatKSh } from '../utils/currency';
import { ACCESSORIES_BY_CATEGORY, AccessoryItem } from '../data/accessoryData';
import { accessoryToProduct } from '../utils/accessoryToProduct';
import { buildCartWhatsAppUrl } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onClearCart?: () => void;
  onProceedToCheckout: () => void;
  onOpenProforma?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart,
  onClearCart,
  onProceedToCheckout,
  onOpenProforma,
}) => {
  const [liftgateRequired, setLiftgateRequired] = useState(true);

  if (!isOpen) return null;

  // Totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalWeightKg = Math.round(
    cartItems.reduce(
      (sum, item) => sum + item.product.specs.weightLbs * 0.453592 * item.quantity,
      0
    )
  );

  const hasHeavyMachine = cartItems.some(
    (item) => item.product.freightTier === 'heavy-freight' || item.product.freightTier === 'freight-ltl'
  );

  const freightCost = subtotal > 200000 ? 0 : hasHeavyMachine ? 25000 : 8500;
  const estimatedTax = Math.round(subtotal * 0.16);
  const total = subtotal + freightCost + estimatedTax;
  const totalUnits = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  // Match up to 2 compatible consumables not already in cart
  const cartIds = new Set(cartItems.map((i) => i.product.id));
  const cartCategories = Array.from(new Set(cartItems.map((i) => i.product.category)));
  const recommendedAccessories: AccessoryItem[] = [];
  for (const cat of cartCategories) {
    for (const acc of ACCESSORIES_BY_CATEGORY[cat] || []) {
      if (!cartIds.has(acc.id) && !recommendedAccessories.some((r) => r.id === acc.id)) {
        recommendedAccessories.push(acc);
      }
      if (recommendedAccessories.length >= 2) break;
    }
    if (recommendedAccessories.length >= 2) break;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0F12]/65 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#111315] dark:text-[#F3F4F6] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="h-4 w-4 text-[#004B97] dark:text-sky-400" />
            <h2 className="font-display text-base font-bold text-[#111315] dark:text-white tracking-tight">
              Shopping Cart
            </h2>
            <span className="font-mono text-xs text-[#5A606B] dark:text-slate-400 tabular-nums">
              ({totalUnits} {totalUnits === 1 ? 'item' : 'items'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && onClearCart && (
              <button
                type="button"
                onClick={onClearCart}
                className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer px-1.5 py-1"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-[#5A606B] dark:text-slate-400 hover:bg-[#E2E4E8] dark:hover:bg-[#262A33] hover:text-[#111315] dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close shopping cart"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Itemized List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#F6F6F4]/50 dark:bg-[#0D0F12]/40">
          {cartItems.length === 0 ? (
            <div className="py-20 px-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#5A606B] dark:text-slate-400">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <p className="mt-4 font-display text-sm font-bold text-[#111315] dark:text-white">
                Your shopping cart is empty
              </p>
              <p className="mt-1.5 text-xs text-[#5A606B] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Select machines from the catalog to build an order or generate a KRA E-TIMS proforma quote.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 inline-flex items-center justify-center rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-4 py-2 text-xs font-semibold text-[#111315] dark:text-white hover:border-[#004B97] dark:hover:border-sky-400 transition-colors cursor-pointer"
              >
                Browse Equipment Catalog
              </button>
            </div>
          ) : (
            cartItems.map(({ product, quantity }) => {
              const unitWeightKg = Math.round(product.specs.weightLbs * 0.453592);
              return (
                <div
                  key={product.id}
                  className="flex gap-3 rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-3"
                >
                  {/* Thumbnail */}
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#ECECE8] dark:bg-[#1C2029]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] text-[#004B97] dark:text-sky-400 font-semibold block truncate">
                            {product.sku}
                          </span>
                          <h4
                            className="font-display text-xs font-bold text-[#111315] dark:text-white truncate"
                            title={product.name}
                          >
                            {product.name}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <p className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400 mt-0.5 tabular-nums">
                        {unitWeightKg} kg each · {product.specs.voltage.split('/')[0]}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#E2E4E8] dark:border-[#262A33] pt-2 mt-2">
                      {/* Stepper */}
                      <div className="flex items-center rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#0D0F12] font-mono text-xs">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-[#5A606B] dark:text-slate-300 hover:text-[#111315] dark:hover:text-white transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-[#111315] dark:text-white tabular-nums font-semibold">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="px-2 py-1 text-[#5A606B] dark:text-slate-300 hover:text-[#111315] dark:hover:text-white transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="font-mono text-sm font-semibold text-[#111315] dark:text-white tabular-nums">
                        {formatKSh(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Compatible Consumables Quick Add-Ons */}
          {cartItems.length > 0 && onAddToCart && recommendedAccessories.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#5A606B] dark:text-slate-400 mb-2">
                <Wrench className="h-3 w-3 text-[#004B97] dark:text-sky-400" />
                <span>Recommended Consumables</span>
              </div>
              <div className="space-y-2">
                {recommendedAccessories.map((acc) => (
                  <div
                    key={acc.id}
                    className="flex items-center justify-between gap-2.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-2"
                  >
                    <img
                      src={acc.image}
                      alt={acc.name}
                      className="h-10 w-10 rounded object-cover border border-[#E2E4E8] dark:border-[#262A33] shrink-0"
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
                      className="btn-press rounded border border-[#004B97] dark:border-sky-400 px-2 py-1 font-mono text-[10px] font-semibold text-[#004B97] dark:text-sky-400 hover:bg-[#004B97] hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] p-5 space-y-4">
            {/* LTL Freight Weight Summary */}
            <div className="rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-3 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="text-[#5A606B] dark:text-slate-300 flex items-center gap-1.5 font-medium">
                  <Truck className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400" />
                  Total Shipment Mass
                </span>
                <span className="text-[#111315] dark:text-white font-semibold tabular-nums">
                  {totalWeightKg.toLocaleString()} kg
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-[#5A606B] dark:text-slate-400">
                <span>Freight Classification</span>
                <span className="text-[#004B97] dark:text-sky-400 font-mono font-medium">
                  LTL Heavy Machinery
                </span>
              </div>

              {hasHeavyMachine && (
                <label className="mt-2.5 flex items-center gap-2 pt-2 border-t border-[#E2E4E8] dark:border-[#262A33] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={liftgateRequired}
                    onChange={(e) => setLiftgateRequired(e.target.checked)}
                    className="rounded border-slate-300 text-[#004B97] focus:ring-[#004B97] dark:border-slate-600 dark:bg-[#0D0F12] cursor-pointer"
                  />
                  <span className="text-[11px] text-[#5A606B] dark:text-slate-300">
                    Hydraulic Tailgate Offloading (Included)
                  </span>
                </label>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#5A606B] dark:text-slate-300">
              <div className="flex justify-between">
                <span>Machinery Subtotal</span>
                <span className="font-mono text-[#111315] dark:text-white font-semibold tabular-nums">
                  {formatKSh(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Freight Delivery</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold tabular-nums">
                  {freightCost === 0 ? 'FREE (> KSh 200,000)' : formatKSh(freightCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated VAT (16% KRA)</span>
                <span className="font-mono font-semibold text-[#111315] dark:text-white tabular-nums">
                  {formatKSh(estimatedTax)}
                </span>
              </div>
              <div className="border-t border-[#E2E4E8] dark:border-[#262A33] pt-2.5 flex items-baseline justify-between text-[#111315] dark:text-white">
                <span className="font-display text-sm font-bold">Total Due (KES)</span>
                <span className="font-mono text-base font-bold text-[#004B97] dark:text-sky-400 tabular-nums">
                  {formatKSh(total)}
                </span>
              </div>

              {subtotal > 80000 && (
                <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-[#004B97] dark:text-sky-400 tabular-nums">
                  <span>Lipa Pole Pole Option (20% down)</span>
                  <span className="font-semibold">From {formatKSh(Math.round(total * 0.2))}</span>
                </div>
              )}
            </div>

            {/* Checkout Action + WhatsApp Quick Quote */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="btn-press btn-nudge flex w-full items-center justify-center gap-2 rounded-md bg-[#004B97] hover:bg-[#003B78] py-3 text-xs font-semibold uppercase tracking-wider text-white cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-3.5 w-3.5 btn-arrow" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {onOpenProforma && (
                  <button
                    type="button"
                    onClick={onOpenProforma}
                    className="btn-press flex w-full items-center justify-center gap-1.5 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#1C2029] hover:border-[#004B97] dark:hover:border-sky-400 py-2.5 text-xs font-semibold text-[#111315] dark:text-slate-200 cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5 text-[#004B97] dark:text-sky-400" />
                    <span>Get Quotation PDF</span>
                  </button>
                )}

                <a
                  href={buildCartWhatsAppUrl(cartItems, { totalAmount: total })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn-press flex w-full items-center justify-center gap-1.5 rounded-md border border-emerald-600/35 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/30 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-colors ${
                    !onOpenProforma ? 'sm:col-span-2' : ''
                  }`}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp Quote</span>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[#5A606B] dark:text-slate-400 font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>In-Transit Freight Insurance Included</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
