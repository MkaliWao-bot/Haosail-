import { checkRateLimit } from '../server/advisorService';
import {
  OrderVerificationError,
  processAuthoritativeOrder,
  VerifyOrderInput,
} from '../server/orderService';

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

  if (!checkRateLimit(`orders:${clientIp}`)) {
    return res.status(429).json({
      error: 'Too many order requests. Please wait a moment and try again.',
    });
  }

  try {
    const result = await processAuthoritativeOrder(
      (req.body || {}) as VerifyOrderInput,
      req.headers?.authorization
    );
    return res.status(200).json(result);
  } catch (err: unknown) {
    if (err instanceof OrderVerificationError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('Vercel /api/orders error:', err);
    return res.status(500).json({ error: 'Unable to verify order pricing at this time.' });
  }
}
