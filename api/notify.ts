import { checkRateLimit } from '../server/advisorService';
import { sendTransactionalEmail, EmailEventType } from '../server/notificationService';
import { verifyFirebaseIdToken } from '../server/orderService';

interface ServerlessRequest {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
}

interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  json: (body: unknown) => void;
}

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const forwarded = req.headers?.['x-forwarded-for'];
  const clientIp = Array.isArray(forwarded)
    ? forwarded[0]
    : typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : 'vercel-client';

  if (!checkRateLimit(`notify:${clientIp}`)) {
    return res.status(429).json({ error: 'Rate limit reached.' });
  }

  const verifiedAuth = await verifyFirebaseIdToken(req.headers?.authorization);
  if (!verifiedAuth) {
    return res.status(401).json({ error: 'Valid Firebase ID token required.' });
  }

  const body = (req.body && typeof req.body === 'object' ? req.body : {}) as {
    type?: EmailEventType;
    toEmail?: string;
    recipientName?: string;
    orderReference?: string;
    etimsControlNumber?: string;
    countyName?: string;
    totalAmountKes?: number;
    itemsSummary?: string;
  };

  if (!body.type || !body.orderReference || !body.toEmail) {
    return res.status(400).json({ error: 'type, orderReference, and toEmail are required.' });
  }

  const result = await sendTransactionalEmail({
    type: body.type,
    toEmail: body.toEmail,
    recipientName: body.recipientName,
    orderReference: body.orderReference,
    etimsControlNumber: body.etimsControlNumber,
    countyName: body.countyName,
    totalAmountKes: body.totalAmountKes,
    itemsSummary: body.itemsSummary,
  });

  return res.status(200).json(result);
}
