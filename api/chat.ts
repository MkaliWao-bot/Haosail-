import {
  AdvisorApiError,
  checkRateLimit,
  generateAdvisorReply,
  validateMessages,
} from '../server/advisorService';

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

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: 'Too many Technical Desk requests. Please wait a minute before trying again.',
    });
  }

  const body = (req.body && typeof req.body === 'object' ? req.body : {}) as {
    messages?: unknown;
    model?: unknown;
  };

  const validated = validateMessages(body.messages);
  if (!validated.ok) {
    return res.status(400).json({ error: validated.error });
  }

  try {
    const result = await generateAdvisorReply(validated.contents, body.model);
    return res.status(200).json({ reply: result.reply, model: result.modelUsed });
  } catch (err: unknown) {
    if (err instanceof AdvisorApiError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('Vercel /api/chat error:', err);
    return res.status(500).json({ error: 'Error processing request with Gemini advisor.' });
  }
}
