import { CartItem, Product } from '../types/machinery';
import { formatKSh } from './currency';

export const HAOSAIL_WHATSAPP_NUMBER = '254700000000';

export function buildProductWhatsAppUrl(
  product: Product,
  options?: {
    quantity?: number;
    selectedVoltage?: string;
    selectedCountyName?: string;
  }
): string {
  const qty = options?.quantity || 1;
  const voltage = options?.selectedVoltage || product.specs.voltage.split('/')[0].trim();
  const hub = options?.selectedCountyName || 'Nairobi Yard';
  const weightKg = Math.round(product.specs.weightLbs * 0.453592);

  const lines = [
    `Hello HaoSail Machinery Desk, I would like a quick quote:`,
    `Machine: ${product.name}`,
    `SKU: ${product.sku}`,
    `Quantity: ${qty} unit${qty > 1 ? 's' : ''}`,
    `Power Spec: ${voltage}`,
    `Unit Price: ${formatKSh(product.price)} (${weightKg} kg)`,
    `Delivery Hub: ${hub}`,
  ];

  if (product.price > 80000) {
    lines.push(`Lipa Pole Pole Inquiry: Eligible (from 20% deposit)`);
  }

  return `https://wa.me/${HAOSAIL_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function buildCartWhatsAppUrl(
  cartItems: CartItem[],
  estimatedTotal: number
): string {
  const itemLines = cartItems.map(
    ({ product, quantity }) =>
      `- ${quantity}x ${product.name} [${product.sku}] (${formatKSh(product.price * quantity)})`
  );

  const totalWeightKg = Math.round(
    cartItems.reduce(
      (sum, item) => sum + item.product.specs.weightLbs * 0.453592 * item.quantity,
      0
    )
  );

  const lines = [
    `Hello HaoSail Machinery Desk, please confirm stock & proforma for my cart:`,
    ...itemLines,
    `Total Mass: ${totalWeightKg.toLocaleString()} kg`,
    `Estimated Total (incl. VAT & Freight): ${formatKSh(estimatedTotal)}`,
  ];

  return `https://wa.me/${HAOSAIL_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}
