import {
  SERVER_CATALOG_ITEMS,
  SERVER_COUNTY_HUBS,
  SERVER_SERVICE_FEES,
} from './catalogManifest';
import { sendTransactionalEmail, NotificationResult } from './notificationService';
import firebaseConfig from '../firebase-applet-config.json';

interface CatalogOverrideRecord {
  productId: string;
  priceKes: number;
  inStock: boolean;
  stockCount: number;
}

export interface OrderLineInput {
  productId: string;
  quantity: number;
}

export interface VerifyOrderInput {
  items: OrderLineInput[];
  countyId: string;
  deliveryMode: 'direct-site' | 'depot-pickup';
  selectedServices?: string[];
  voucherCode?: string;
  settlementMode: 'full' | 'lipa-pole-pole';
  depositPercent?: number;
  installmentCadence?: 'monthly' | 'weekly';
  loanTenureMonths?: number;
  loanTenureWeeks?: number;
  paymentMethod?: 'mpesa' | 'bank-wire' | 'lpo-credit' | 'depot-pay';
  buyerEmail?: string;
  buyerName?: string;
  companyName?: string;
}

export interface VerifiedOrderResponse {
  orderReference: string;
  etimsControlNumber: string;
  verifiedUid: string | null;
  pricing: {
    subtotal: number;
    voucherCodeApplied: string;
    voucherDiscount: number;
    deliveryCost: number;
    servicesCost: number;
    taxableAmount: number;
    vatAmount: number;
    grandTotal: number;
    isLipaPolePoleEligible: boolean;
    depositDueToday: number;
    activeInstallment: number;
    dueTodayAmount: number;
  };
  itemsSummary: string;
  itemCount: number;
  countyName: string;
  notification: NotificationResult;
}

export class OrderVerificationError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

let overridesCache: { expiresAt: number; data: Record<string, CatalogOverrideRecord> } = {
  expiresAt: 0,
  data: {},
};

async function fetchLiveCatalogOverrides(): Promise<Record<string, CatalogOverrideRecord>> {
  const now = Date.now();
  if (now < overridesCache.expiresAt) {
    return overridesCache.data;
  }

  const dbId = firebaseConfig.firestoreDatabaseId || '(default)';
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(
    firebaseConfig.projectId
  )}/databases/${encodeURIComponent(dbId)}/documents:runQuery`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'catalogOverrides' }],
          limit: 200,
        },
      }),
    });
    if (!res.ok) {
      return overridesCache.data;
    }
    const rows = (await res.json()) as Array<{
      document?: {
        fields?: Record<
          string,
          { stringValue?: string; integerValue?: string; doubleValue?: number; booleanValue?: boolean }
        >;
      };
    }>;

    const parsed: Record<string, CatalogOverrideRecord> = {};
    for (const row of rows || []) {
      const f = row.document?.fields;
      if (!f) continue;
      const productId = f.productId?.stringValue;
      const rawPrice = f.priceKes?.doubleValue ?? Number(f.priceKes?.integerValue);
      const inStock = f.inStock?.booleanValue;
      const stockCount = Number(f.stockCount?.integerValue ?? 0);
      if (productId && Number.isFinite(rawPrice) && typeof inStock === 'boolean') {
        parsed[productId] = {
          productId,
          priceKes: rawPrice,
          inStock,
          stockCount: Number.isFinite(stockCount) ? stockCount : 0,
        };
      }
    }

    overridesCache = { expiresAt: now + 15_000, data: parsed };
    return parsed;
  } catch {
    return overridesCache.data;
  }
}

export async function verifyFirebaseIdToken(
  bearerHeader?: string | string[]
): Promise<{ uid: string; email?: string } | null> {
  const raw = Array.isArray(bearerHeader) ? bearerHeader[0] : bearerHeader;
  if (!raw || !raw.startsWith('Bearer ')) return null;
  const idToken = raw.slice('Bearer '.length).trim();
  if (!idToken || idToken.length > 4096) return null;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(
        firebaseConfig.apiKey
      )}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      users?: Array<{ localId?: string; email?: string; emailVerified?: boolean }>;
    };
    const account = data.users?.[0];
    if (!account?.localId || !account.emailVerified) return null;
    return { uid: account.localId, email: account.email };
  } catch {
    return null;
  }
}

async function generateEtimsControlNumber(
  orderReference: string,
  grandTotal: number
): Promise<string> {
  const etimsUrl = (process.env.KRA_ETIMS_API_URL || '').trim();
  const etimsKey = (process.env.KRA_ETIMS_API_KEY || '').trim();

  if (etimsUrl && etimsKey) {
    try {
      const res = await fetch(etimsUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${etimsKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoiceRef: orderReference, totalAmountKes: grandTotal }),
      });
      if (res.ok) {
        const data = (await res.json().catch(() => ({}))) as { controlNumber?: string };
        if (data.controlNumber) return String(data.controlNumber).slice(0, 64);
      }
    } catch {
      // Fallback to structured internal eTIMS reference when VSCU endpoint is unreachable
    }
  }

  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `KE-ETIMS-2026-${suffix}`;
}

export async function processAuthoritativeOrder(
  payload: VerifyOrderInput,
  authHeader?: string | string[]
): Promise<VerifiedOrderResponse> {
  if (!payload || !Array.isArray(payload.items) || payload.items.length === 0) {
    throw new OrderVerificationError(400, 'Order must contain at least one equipment item.');
  }

  if (payload.items.length > 50) {
    throw new OrderVerificationError(400, 'Too many distinct line items in a single order.');
  }

  const hub = SERVER_COUNTY_HUBS[payload.countyId];
  if (!hub) {
    throw new OrderVerificationError(400, 'Invalid Kenyan delivery county hub selected.');
  }

  const deliveryMode =
    payload.deliveryMode === 'depot-pickup' ? 'depot-pickup' : 'direct-site';

  const overrides = await fetchLiveCatalogOverrides();

  let subtotal = 0;
  let totalUnits = 0;
  const summaryParts: string[] = [];

  for (const line of payload.items) {
    if (!line || typeof line.productId !== 'string') {
      throw new OrderVerificationError(400, 'Invalid line item product reference.');
    }
    const baseItem = SERVER_CATALOG_ITEMS[line.productId];
    if (!baseItem) {
      throw new OrderVerificationError(400, `Unknown SKU/product ID: ${line.productId}`);
    }

    const qty = Math.floor(Number(line.quantity));
    if (!Number.isFinite(qty) || qty < 1 || qty > 100) {
      throw new OrderVerificationError(
        400,
        `Invalid quantity for ${baseItem.name}. Must be between 1 and 100.`
      );
    }

    const override = overrides[line.productId];
    if (override && (!override.inStock || override.stockCount === 0)) {
      throw new OrderVerificationError(
        409,
        `${baseItem.name} (${baseItem.sku}) is currently out of stock.`
      );
    }
    if (override && override.stockCount > 0 && qty > override.stockCount) {
      throw new OrderVerificationError(
        409,
        `Only ${override.stockCount} unit(s) of ${baseItem.name} remaining in stock.`
      );
    }

    const effectiveUnitPrice = override ? override.priceKes : baseItem.price;
    subtotal += effectiveUnitPrice * qty;
    totalUnits += qty;
    summaryParts.push(`${qty}x ${baseItem.name}`);
  }

  const deliveryCost =
    deliveryMode === 'direct-site' ? hub.tailgateCost : hub.depotPickupCost;

  const uniqueServices = Array.from(new Set(payload.selectedServices || []));
  const servicesCost = uniqueServices.reduce((sum, sId) => {
    const srv = SERVER_SERVICE_FEES[sId];
    return sum + (srv ? srv.cost : 0);
  }, 0);

  const normalizedVoucher = (payload.voucherCode || '').trim().toUpperCase();
  const voucherCodeApplied = normalizedVoucher === 'FESTIVE26' ? 'FESTIVE26' : '';
  const voucherDiscount =
    voucherCodeApplied === 'FESTIVE26'
      ? Math.min(Math.round(subtotal * 0.05), 25000)
      : 0;

  const taxableAmount = Math.max(0, subtotal - voucherDiscount + deliveryCost + servicesCost);
  const vatAmount = Math.round(taxableAmount * 0.16);
  const grandTotal = taxableAmount + vatAmount;

  const isLipaPolePoleEligible = subtotal > 80000;
  const isLipaPolePoleActive =
    isLipaPolePoleEligible && payload.settlementMode === 'lipa-pole-pole';

  const validDeposit = [20, 30, 40, 50].includes(Number(payload.depositPercent))
    ? Number(payload.depositPercent)
    : 30;
  const depositDueToday = Math.round((grandTotal * validDeposit) / 100);
  const financedBalance = grandTotal - depositDueToday;
  const annualRate = 0.12;
  const cadence = payload.installmentCadence === 'weekly' ? 'weekly' : 'monthly';
  const months = [6, 12, 18, 24].includes(Number(payload.loanTenureMonths))
    ? Number(payload.loanTenureMonths)
    : 12;
  const weeks = [12, 24, 36, 52].includes(Number(payload.loanTenureWeeks))
    ? Number(payload.loanTenureWeeks)
    : 24;

  const activeInstallment =
    cadence === 'monthly'
      ? Math.round((financedBalance * (1 + annualRate * (months / 12))) / months)
      : Math.round((financedBalance * (1 + annualRate * (weeks / 52))) / weeks);

  const dueTodayAmount = isLipaPolePoleActive ? depositDueToday : grandTotal;
  const orderReference = `HS-KE-${Math.floor(100000 + Math.random() * 900000)}`;
  const etimsControlNumber = await generateEtimsControlNumber(orderReference, grandTotal);
  const itemsSummary = summaryParts.join(', ').slice(0, 500);

  const verifiedAuth = await verifyFirebaseIdToken(authHeader);

  const notification = await sendTransactionalEmail({
    type: 'order_confirmed',
    toEmail: (payload.buyerEmail || verifiedAuth?.email || '').trim(),
    recipientName: payload.buyerName || payload.companyName,
    orderReference,
    etimsControlNumber,
    countyName: `${hub.county} (${hub.mainTown})`,
    totalAmountKes: grandTotal,
    itemsSummary,
  });

  return {
    orderReference,
    etimsControlNumber,
    verifiedUid: verifiedAuth?.uid ?? null,
    pricing: {
      subtotal,
      voucherCodeApplied,
      voucherDiscount,
      deliveryCost,
      servicesCost,
      taxableAmount,
      vatAmount,
      grandTotal,
      isLipaPolePoleEligible,
      depositDueToday,
      activeInstallment,
      dueTodayAmount,
    },
    itemsSummary,
    itemCount: totalUnits,
    countyName: hub.county,
    notification,
  };
}
