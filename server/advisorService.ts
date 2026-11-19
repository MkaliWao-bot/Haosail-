import { GoogleGenAI } from '@google/genai';

export interface AdvisorMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

const ALLOWED_MODELS = ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'] as const;
type AllowedModel = (typeof ALLOWED_MODELS)[number];

const MAX_MESSAGES = 24;
const MAX_CONTENT_CHARS = 4000;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 30;

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

const TECHNICAL_DESK_INSTRUCTION =
  'You are the Chief Machinery Engineer at the HaoSail Technical Desk in Nairobi, Kenya. ' +
  "You specialize in HaoSail's 68-model industrial equipment catalog across five divisions: " +
  'Woodworking (Sliding Table Panel Saw HS-PS3200-SLD, CNC Router HS-CNC1325-PRO, Wide-Belt Sander HS-WB630-SND, Hinge Borer HS-HB21-BOR, 5-in-1 Joinery Center HS-ML393-5IN1, Dust Collector HS-DC2000-BLU), ' +
  'Auto Maintenance & Garage (Two Post Lift HS-2PL4000-CLR, Four Post Lift HS-4PL5000-AUT, Scissor Lift HS-HSL350C-LFT, A/C Station HS-AC600-R134, Diagnostic Scanner HS-OBD90-PRO, 3D Wheel Alignment HS-3DA900-CAM, Tyre Changer HS-TC950-BLU), ' +
  'Welding & Metalworking (Inverter Arc Welder HS-ZX7315-ARC, CO2/MIG Welder HS-NBC300-MIG, Diesel Welding Generator HS-DGW220-ARC, Metal Lathe HS-CQ6236-LTH, Drill Press HS-Z4116-DRL, Pipe Bender HS-SWG3-BND), ' +
  'Construction & Concrete (Walk-Behind Road Cutter HS-HQ450-CUT, Double Drum Road Roller HS-RR800-DRM, Hydraulic Concrete Mixer HS-CM400-HYD, Power Trowel HS-PT36-CON), and ' +
  'Workshop, Warehouse & Power Tools (3T Diesel Forklift HS-CPCD30-FRK, Semi-Electric Stacker HS-CTD1530-STK, Diesel Water Pump HS-DP80-PMP, Silent Compressor HS-OFS50-AIR, Soundproof Diesel Generator HS-SG20-CAN). ' +
  'Assist engineers, contractors, and workshop owners with machine sizing, 230V 1-phase vs 400V 3-phase wiring & breaker sizing, ' +
  'concrete slab requirements for vehicle lifts, dust ducting airflow, and workshop planning. ' +
  'Quote prices and budgets in Kenyan Shillings (KSh / KES). Keep answers concise, engineering-backed, and practical.';

export function checkRateLimit(clientKey: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(clientKey);
  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(clientKey, { count: 1, resetAt: now + RATE_WINDOW_MS });
    if (rateBuckets.size > 500) {
      for (const [k, v] of rateBuckets.entries()) {
        if (now >= v.resetAt) rateBuckets.delete(k);
      }
    }
    return true;
  }
  if (bucket.count >= RATE_MAX_REQUESTS) {
    return false;
  }
  bucket.count += 1;
  return true;
}

export function isGeminiConfigured(): boolean {
  const key = (process.env.GEMINI_API_KEY || '').trim();
  return Boolean(key && key !== 'MY_GEMINI_API_KEY');
}

export function validateMessages(rawMessages: unknown): {
  ok: true;
  contents: AdvisorMessage[];
} | {
  ok: false;
  error: string;
} {
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return { ok: false, error: 'Messages array is required and cannot be empty.' };
  }

  const trimmed = rawMessages.slice(-MAX_MESSAGES);
  const contents: AdvisorMessage[] = [];

  for (const item of trimmed) {
    if (!item || typeof item !== 'object') continue;
    const rawRole = (item as { role?: unknown }).role;
    const rawContent = (item as { content?: unknown }).content;
    if (typeof rawContent !== 'string') continue;
    const text = rawContent.trim().slice(0, MAX_CONTENT_CHARS);
    if (!text) continue;

    contents.push({
      role: rawRole === 'assistant' || rawRole === 'model' ? 'model' : 'user',
      parts: [{ text }],
    });
  }

  if (contents.length === 0) {
    return { ok: false, error: 'At least one non-empty message is required.' };
  }

  return { ok: true, contents };
}

function resolveAllowedModel(requestedModel?: unknown): AllowedModel {
  if (
    typeof requestedModel === 'string' &&
    (ALLOWED_MODELS as readonly string[]).includes(requestedModel)
  ) {
    return requestedModel as AllowedModel;
  }
  return 'gemini-4-hydrogen';
}

export class AdvisorApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function generateAdvisorReply(
  contents: AdvisorMessage[],
  requestedModel?: unknown
): Promise<{ reply: string; modelUsed: AllowedModel }> {
  if (!isGeminiConfigured()) {
    throw new AdvisorApiError(
      503,
      'Technical Desk AI service is not configured yet (missing GEMINI_API_KEY in server secrets).'
    );
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const primary = resolveAllowedModel(requestedModel);
  const modelsToTry = Array.from(new Set<AllowedModel>([primary, 'gemini-4-hydrogen', 'gemini-3.1-flash-lite']));

  let lastError: unknown = null;

  for (const targetModel of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: targetModel,
        contents,
        config: {
          systemInstruction: TECHNICAL_DESK_INSTRUCTION,
        },
      });

      const reply = (response.text ?? '').trim();
      if (reply) {
        return { reply, modelUsed: targetModel };
      }
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED') || msg.includes('403')) {
        throw new AdvisorApiError(
          403,
          'Gemini API key was rejected. Check GEMINI_API_KEY in Settings > Secrets.'
        );
      }
      if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429')) {
        throw new AdvisorApiError(
          429,
          'Technical Desk AI quota temporarily reached. Please retry shortly.'
        );
      }
      console.warn(`Advisor model ${targetModel} attempt failed:`, msg);
    }
  }

  const fallbackMessage =
    lastError instanceof Error
      ? lastError.message
      : 'Unable to generate a response from Gemini Technical Desk.';
  throw new AdvisorApiError(502, fallbackMessage);
}
