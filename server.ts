import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  AdvisorApiError,
  checkRateLimit,
  generateAdvisorReply,
  isGeminiConfigured,
  validateMessages,
} from './server/advisorService';
import {
  OrderVerificationError,
  processAuthoritativeOrder,
  verifyFirebaseIdToken,
  VerifyOrderInput,
} from './server/orderService';
import {
  EmailEventType,
  isEmailConfigured,
  sendTransactionalEmail,
} from './server/notificationService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '64kb' }));

// Health check route for runtime & monitoring
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'haosail-machinery-api',
    geminiConfigured: isGeminiConfigured(),
    emailConfigured: isEmailConfigured(),
    timestamp: new Date().toISOString(),
  });
});

// Multi-turn Gemini chat endpoint for HaoSail Technical Desk
app.post('/api/chat', async (req, res) => {
  const clientIp = req.ip || 'express-client';
  if (!checkRateLimit(`chat:${clientIp}`)) {
    return res.status(429).json({
      error: 'Too many Technical Desk requests. Please wait a minute before trying again.',
    });
  }

  const validated = validateMessages(req.body?.messages);
  if (!validated.ok) {
    return res.status(400).json({ error: validated.error });
  }

  try {
    const result = await generateAdvisorReply(validated.contents, req.body?.model);
    return res.json({ reply: result.reply, model: result.modelUsed });
  } catch (err: unknown) {
    if (err instanceof AdvisorApiError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('Gemini chat error:', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Error processing request with Gemini advisor',
    });
  }
});

// Authoritative server-side order pricing, live stock validation, eTIMS & receipt email
app.post('/api/orders', async (req, res) => {
  const clientIp = req.ip || 'express-client';
  if (!checkRateLimit(`orders:${clientIp}`)) {
    return res.status(429).json({
      error: 'Too many order requests. Please wait a moment and try again.',
    });
  }

  try {
    const result = await processAuthoritativeOrder(
      (req.body || {}) as VerifyOrderInput,
      req.headers.authorization
    );
    return res.json(result);
  } catch (err: unknown) {
    if (err instanceof OrderVerificationError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('Express /api/orders error:', err);
    return res.status(500).json({ error: 'Unable to verify order pricing at this time.' });
  }
});

// Authenticated dispatch email notifications
app.post('/api/notify', async (req, res) => {
  const clientIp = req.ip || 'express-client';
  if (!checkRateLimit(`notify:${clientIp}`)) {
    return res.status(429).json({ error: 'Rate limit reached.' });
  }

  const verifiedAuth = await verifyFirebaseIdToken(req.headers.authorization);
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

  return res.json(result);
});

// Mount Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HaoSail Machinery full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
