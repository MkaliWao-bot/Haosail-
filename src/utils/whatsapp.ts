import { CartItem, Product } from '../types/machinery';
import { formatKSh } from './currency';
import { STORE_CONFIG } from '../config/storeConfig';

export const HAOSAIL_WHATSAPP_NUMBER = STORE_CONFIG.whatsappNumber;

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
    `Please confirm yard availability and KRA E-TIMS proforma.`,
  ];

  return `https://wa.me/${HAOSAIL_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function buildCartWhatsAppUrl(
  cartItems: CartItem[],
  options?: {
    countyName?: string;
    totalAmount?: number;
  }
): string {
  const itemLines = cartItems.map(
    ({ product, quantity }, idx) =>
      `${idx + 1}. ${quantity}x ${product.name} (${product.sku}) — ${formatKSh(
        product.price * quantity
      )}`
  );

  const lines = [
    `Hello HaoSail Machinery Desk, I am requesting an equipment quote for my workshop:`,
    ...itemLines,
    options?.countyName ? `Delivery County Hub: ${options.countyName}` : '',
    options?.totalAmount ? `Estimated Subtotal: ${formatKSh(options.totalAmount)}` : '',
    `Please share E-TIMS Proforma and dispatch timeline.`,
  ].filter(Boolean);

  return `https://wa.me/${HAOSAIL_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function buildProductVideoInspectionUrl(
  product: Product,
  options?: {
    selectedVoltage?: string;
    selectedYard?: 'Nairobi Enterprise Rd' | 'Mombasa Changamwe';
  }
): string {
  const yard = options?.selectedYard || 'Nairobi Enterprise Rd';
  const voltage = options?.selectedVoltage || product.specs.voltage.split('/')[0].trim();

  const lines = [
    `Hello HaoSail Yard Team, I would like to book a 10-minute Live WhatsApp Video Inspection:`,
    `Machine: ${product.name}`,
    `SKU: ${product.sku}`,
    `Power Spec: ${voltage}`,
    `Preferred Yard: ${yard}`,
    `Please confirm a time slot to power-test the unit and verify the serial nameplate on video.`,
  ];

  return `https://wa.me/${HAOSAIL_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}
