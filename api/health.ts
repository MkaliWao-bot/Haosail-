import { isGeminiConfigured } from '../server/advisorService';

interface ServerlessRequest {
  method?: string;
}

interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  json: (body: unknown) => void;
}

export default function handler(req: ServerlessRequest, res: ServerlessResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  return res.status(200).json({
    status: 'ok',
    service: 'haosail-machinery-api',
    geminiConfigured: isGeminiConfigured(),
    timestamp: new Date().toISOString(),
  });
}
