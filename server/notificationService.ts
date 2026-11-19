export type EmailEventType = 'order_confirmed' | 'order_dispatched' | 'order_completed';

export interface NotificationEmailPayload {
  type: EmailEventType;
  toEmail: string;
  recipientName?: string;
  orderReference: string;
  etimsControlNumber?: string;
  countyName?: string;
  totalAmountKes?: number;
  itemsSummary?: string;
}

export interface NotificationResult {
  delivered: boolean;
  provider: 'resend';
  reason?: string;
  messageId?: string;
}

export function isEmailConfigured(): boolean {
  return Boolean((process.env.RESEND_API_KEY || '').trim());
}

function formatKes(value: number): string {
  return `KSh ${Math.round(value).toLocaleString('en-KE')}`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendTransactionalEmail(
  payload: NotificationEmailPayload
): Promise<NotificationResult> {
  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  const toEmail = payload.toEmail.trim();

  if (!toEmail || !toEmail.includes('@')) {
    return {
      delivered: false,
      provider: 'resend',
      reason: 'Missing valid recipient email address.',
    };
  }

  if (!apiKey) {
    return {
      delivered: false,
      provider: 'resend',
      reason: 'RESEND_API_KEY not configured in server environment.',
    };
  }

  const fromEmail =
    (process.env.RESEND_FROM_EMAIL || '').trim() ||
    'HaoSail Kenya Dispatch <orders@haosail.ke>';

  const subjectMap: Record<EmailEventType, string> = {
    order_confirmed: `Order Confirmed — ${payload.orderReference} (HaoSail Kenya)`,
    order_dispatched: `Equipment Dispatched — ${payload.orderReference} (HaoSail Kenya)`,
    order_completed: `Delivery Completed — ${payload.orderReference} (HaoSail Kenya)`,
  };

  const headingMap: Record<EmailEventType, string> = {
    order_confirmed: 'KRA E-TIMS Order Reservation Confirmed',
    order_dispatched: 'Your Machinery Has Left Our Dispatch Yard',
    order_completed: 'Equipment Delivery & Handover Completed',
  };

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111315; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E4E8; border-radius: 8px;">
      <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #004B97; margin-bottom: 6px;">
        HaoSail Industrial Machinery Kenya
      </div>
      <h1 style="font-size: 20px; margin: 0 0 12px 0;">${escapeHtml(headingMap[payload.type])}</h1>
      <p style="font-size: 14px; color: #5A606B; line-height: 1.5;">
        Hello ${escapeHtml(payload.recipientName || 'Workshop Client')},
      </p>
      <div style="background: #F6F6F4; border: 1px solid #E2E4E8; border-radius: 6px; padding: 14px; margin: 16px 0; font-size: 13px;">
        <div><strong>Order Ref:</strong> ${escapeHtml(payload.orderReference)}</div>
        ${payload.etimsControlNumber ? `<div><strong>KRA eTIMS Ref:</strong> ${escapeHtml(payload.etimsControlNumber)}</div>` : ''}
        ${payload.countyName ? `<div><strong>Dispatch Hub:</strong> ${escapeHtml(payload.countyName)}</div>` : ''}
        ${typeof payload.totalAmountKes === 'number' ? `<div><strong>Verified Total (Incl. 16% VAT):</strong> ${formatKes(payload.totalAmountKes)}</div>` : ''}
        ${payload.itemsSummary ? `<div style="margin-top: 8px;"><strong>Equipment:</strong> ${escapeHtml(payload.itemsSummary)}</div>` : ''}
      </div>
      <p style="font-size: 12px; color: #5A606B; margin-top: 16px;">
        Electronic trade confirmation issued by HaoSail Commercial Distribution Center, Nairobi, Kenya.
      </p>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: subjectMap[payload.type],
        html,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok) {
      return {
        delivered: false,
        provider: 'resend',
        reason: data?.message || `Email provider returned HTTP ${res.status}.`,
      };
    }

    return {
      delivered: true,
      provider: 'resend',
      messageId: data.id,
    };
  } catch (err: unknown) {
    return {
      delivered: false,
      provider: 'resend',
      reason: err instanceof Error ? err.message : 'Failed to reach email provider.',
    };
  }
}
