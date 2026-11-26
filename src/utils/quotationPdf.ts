import { jsPDF } from 'jspdf';
import { Product } from '../types/machinery';
import { CountyHub } from '../data/accessoryData';
import { STORE_CONFIG } from '../config/storeConfig';
import { formatKSh } from './currency';

export type QuoteDocumentType = 'quotation' | 'proforma';

export interface QuotationPdfPayload {
  docType: QuoteDocumentType;
  quoteNumber: string;
  issueDate: string;
  validUntilDate: string;
  companyName: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  kraPin: string;
  notes?: string;
  county: CountyHub;
  deliveryMode: 'depot-pickup' | 'direct-site';
  items: { product: Product; quantity: number }[];
  subtotal: number;
  deliveryCost: number;
  vat16: number;
  grandTotal: number;
}

export function downloadQuotationPdf(payload: QuotationPdfPayload): string {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const isQuotation = payload.docType === 'quotation';
  const docTitle = isQuotation ? 'OFFICIAL QUOTATION' : 'PROFORMA INVOICE';

  // Top Royal Blue Header Band
  doc.setFillColor(0, 75, 151);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(`${STORE_CONFIG.brandName.toUpperCase()} LIMITED`, margin, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(STORE_CONFIG.yardAddress, margin, 16.5);
  doc.text(
    `Tel: ${STORE_CONFIG.salesPhoneDisplay}  |  Email: ${STORE_CONFIG.salesEmail}  |  KRA PIN: ${STORE_CONFIG.companyKraPin}  |  E-TIMS: ET-NB-49821`,
    margin,
    21.5
  );

  // Document Badge Box on Right
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth - margin - 58, 5, 58, 18, 1.5, 1.5, 'F');
  doc.setTextColor(0, 75, 151);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(docTitle, pageWidth - margin - 29, 11.5, { align: 'center' });
  doc.setTextColor(17, 19, 21);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(payload.quoteNumber, pageWidth - margin - 29, 17, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(90, 96, 107);
  doc.text(`Issued: ${payload.issueDate}  |  Valid: ${payload.validUntilDate}`, pageWidth - margin - 29, 21.2, {
    align: 'center',
  });

  let y = 35;

  // Prepared For + Delivery Hub Boxes
  const colGap = 5;
  const boxW = (contentWidth - colGap) / 2;
  const boxH = 31;

  doc.setFillColor(246, 246, 244);
  doc.setDrawColor(226, 228, 232);
  doc.roundedRect(margin, y, boxW, boxH, 1.5, 1.5, 'FD');
  doc.roundedRect(margin + boxW + colGap, y, boxW, boxH, 1.5, 1.5, 'FD');

  // Left Box: Client Details
  doc.setTextColor(0, 75, 151);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('PREPARED FOR (CLIENT / WORKSHOP)', margin + 4, y + 5.5);

  doc.setTextColor(17, 19, 21);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(payload.companyName.trim() || 'Valued Commercial Workshop', margin + 4, y + 11.5, {
    maxWidth: boxW - 8,
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(55, 65, 81);
  doc.text(
    `Attn: ${payload.clientName.trim() || 'Procurement / Workshop Manager'}`,
    margin + 4,
    y + 16.5,
    { maxWidth: boxW - 8 }
  );
  const contactParts = [
    payload.clientPhone?.trim() ? `Tel: ${payload.clientPhone.trim()}` : '',
    payload.clientEmail?.trim() ? payload.clientEmail.trim() : '',
  ].filter(Boolean);
  doc.text(contactParts.join('  |  ') || 'Direct Workshop Quotation Request', margin + 4, y + 21.5, {
    maxWidth: boxW - 8,
  });
  doc.text(`Client KRA PIN: ${payload.kraPin.trim() || 'On Request / Cash Sale'}`, margin + 4, y + 26.5);

  // Right Box: Delivery & Validity
  const rightX = margin + boxW + colGap;
  doc.setTextColor(0, 75, 151);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('DISPATCH & DELIVERY HUB', rightX + 4, y + 5.5);

  doc.setTextColor(17, 19, 21);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`${payload.county.county} (${payload.county.mainTown})`, rightX + 4, y + 11.5, {
    maxWidth: boxW - 8,
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(55, 65, 81);
  doc.text(
    `Method: ${
      payload.deliveryMode === 'direct-site' ? 'Direct Site Tailgate Delivery' : 'County Depot Collection'
    }`,
    rightX + 4,
    y + 16.5
  );
  const depotLines = doc.splitTextToSize(`Hub: ${payload.county.depotAddress}`, boxW - 8);
  doc.text(depotLines.slice(0, 2), rightX + 4, y + 21.2);
  doc.text(`Est. Lead Time: ${payload.county.transitHours}`, rightX + 4, y + 28.2);

  y += boxH + 7;

  // Table Header
  const drawTableHeader = (topY: number) => {
    doc.setFillColor(17, 19, 21);
    doc.rect(margin, topY, contentWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.text('#', margin + 3, topY + 5.3);
    doc.text('EQUIPMENT & SPECIFICATION', margin + 10, topY + 5.3);
    doc.text('SKU', margin + 105, topY + 5.3);
    doc.text('QTY', margin + 132, topY + 5.3, { align: 'center' });
    doc.text('UNIT (KES)', margin + 157, topY + 5.3, { align: 'right' });
    doc.text('TOTAL (KES)', margin + contentWidth - 3, topY + 5.3, { align: 'right' });
    return topY + 8;
  };

  y = drawTableHeader(y);

  // Item Rows
  payload.items.forEach(({ product, quantity }, idx) => {
    const weightKg = Math.round(product.specs.weightLbs * 0.453592);
    const nameLines = doc.splitTextToSize(product.name, 90);
    const specLine = `${product.specs.motor} | ${product.specs.voltage} | ${weightKg} kg`;
    const specLines = doc.splitTextToSize(specLine, 90);
    const rowHeight = Math.max(12, nameLines.length * 4.2 + specLines.length * 3.6 + 4.5);

    if (y + rowHeight > pageHeight - 62) {
      doc.addPage();
      y = 16;
      y = drawTableHeader(y);
    }

    if (idx % 2 === 1) {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, y, contentWidth, rowHeight, 'F');
    }

    doc.setDrawColor(226, 228, 232);
    doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    doc.setTextColor(90, 96, 107);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(String(idx + 1), margin + 3, y + 5.5);

    doc.setTextColor(17, 19, 21);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(nameLines, margin + 10, y + 5.3);

    doc.setTextColor(90, 96, 107);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.4);
    doc.text(specLines, margin + 10, y + 5.3 + nameLines.length * 4.2 + 0.5);

    doc.setTextColor(0, 75, 151);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.text(product.sku, margin + 105, y + 5.5);

    doc.setTextColor(17, 19, 21);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(String(quantity), margin + 132, y + 5.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.text(formatKSh(product.price), margin + 157, y + 5.5, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.text(formatKSh(product.price * quantity), margin + contentWidth - 3, y + 5.5, { align: 'right' });

    y += rowHeight;
  });

  y += 6;

  // Ensure enough room for Summary + Footer
  if (y > pageHeight - 78) {
    doc.addPage();
    y = 18;
  }

  // Left: Banking & Settlement Box
  const leftSummaryW = 104;
  const rightSummaryX = margin + leftSummaryW + 6;
  const rightSummaryW = contentWidth - leftSummaryW - 6;

  doc.setFillColor(246, 246, 244);
  doc.setDrawColor(226, 228, 232);
  doc.roundedRect(margin, y, leftSummaryW, 38, 1.5, 1.5, 'FD');

  doc.setTextColor(0, 75, 151);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('SETTLEMENT & PAYMENT INSTRUCTIONS', margin + 4, y + 5.5);

  doc.setTextColor(55, 65, 81);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.text(`Bank: ${STORE_CONFIG.bankName} (${STORE_CONFIG.bankBranch})`, margin + 4, y + 11);
  doc.text(`Account No: ${STORE_CONFIG.bankAccount} (KES)`, margin + 4, y + 15.8);
  doc.text(`M-Pesa Paybill: ${STORE_CONFIG.paybill}  |  Account Ref: ${payload.quoteNumber}`, margin + 4, y + 20.6);

  if (payload.grandTotal > 80000) {
    const lipaDown = Math.round(payload.grandTotal * 0.2);
    doc.setTextColor(0, 75, 151);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Lipa Pole Pole Option: Reserve with 20% deposit (${formatKSh(lipaDown)}), balance over 3-6 months.`,
      margin + 4,
      y + 26.5,
      { maxWidth: leftSummaryW - 8 }
    );
  } else {
    doc.text('Includes 5-Year Factory Warranty & In-Transit Freight Insurance.', margin + 4, y + 26.5);
  }

  if (payload.notes?.trim()) {
    doc.setTextColor(90, 96, 107);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.3);
    doc.text(`Note: ${payload.notes.trim()}`, margin + 4, y + 34, { maxWidth: leftSummaryW - 8 });
  }

  // Right: Totals Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 228, 232);
  doc.roundedRect(rightSummaryX, y, rightSummaryW, 38, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 96, 107);
  doc.text('Subtotal (Excl. VAT)', rightSummaryX + 4, y + 7);
  doc.setTextColor(17, 19, 21);
  doc.setFont('helvetica', 'bold');
  doc.text(formatKSh(payload.subtotal), rightSummaryX + rightSummaryW - 4, y + 7, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90, 96, 107);
  doc.text(`Freight (${payload.county.mainTown})`, rightSummaryX + 4, y + 13.5);
  doc.setTextColor(payload.deliveryCost === 0 ? 5 : 17, payload.deliveryCost === 0 ? 122 : 19, payload.deliveryCost === 0 ? 85 : 21);
  doc.setFont('helvetica', 'bold');
  doc.text(
    payload.deliveryCost === 0 ? 'FREE' : formatKSh(payload.deliveryCost),
    rightSummaryX + rightSummaryW - 4,
    y + 13.5,
    { align: 'right' }
  );

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(90, 96, 107);
  doc.text('VAT (16% KRA E-TIMS)', rightSummaryX + 4, y + 20);
  doc.setTextColor(17, 19, 21);
  doc.setFont('helvetica', 'bold');
  doc.text(formatKSh(payload.vat16), rightSummaryX + rightSummaryW - 4, y + 20, { align: 'right' });

  doc.setDrawColor(0, 75, 151);
  doc.line(rightSummaryX + 4, y + 24.5, rightSummaryX + rightSummaryW - 4, y + 24.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(17, 19, 21);
  doc.text('Total Payable', rightSummaryX + 4, y + 32.5);
  doc.setFontSize(11);
  doc.setTextColor(0, 75, 151);
  doc.text(formatKSh(payload.grandTotal), rightSummaryX + rightSummaryW - 4, y + 32.5, {
    align: 'right',
  });

  // Footer Disclaimer
  doc.setDrawColor(226, 228, 232);
  doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(107, 114, 128);
  doc.text(
    `Validity: 30 calendar days from ${payload.issueDate}. Prices in Kenyan Shillings (KES). Electronic ${docTitle.toLowerCase()} valid without physical signature.`,
    margin,
    pageHeight - 12.5
  );
  doc.text(
    `${STORE_CONFIG.brandName} | ${STORE_CONFIG.domain}`,
    pageWidth - margin,
    pageHeight - 12.5,
    { align: 'right' }
  );

  const prefix = isQuotation ? 'HaoSail-Quotation' : 'HaoSail-Proforma';
  const filename = `${prefix}-${payload.quoteNumber}.pdf`;
  doc.save(filename);
  return filename;
}
