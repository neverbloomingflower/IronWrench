import { ANTHROPIC_API_KEY } from '../theme';

const API_URL = 'https://api.anthropic.com/v1/messages';

export interface DiagnosisResult {
  diagnosis: string;
  severity: 'minor' | 'moderate' | 'serious';
  likelyCause: string;
  estimatedCost: string;
  diyFriendly: boolean;
  nextSteps: string[];
}

export interface BuildRecommendation {
  summary: string;
  partsList: { part: string; vendor: string; approxPrice: string }[];
  installOrder: string[];
  tips: string[];
  totalEstimate: string;
}

const MECHANIC_SYSTEM_PROMPT = `You are an expert motorcycle mechanic with 30+ years of experience specializing in custom cruisers, choppers, and bobbers — particularly Harley-Davidson, Honda Shadow, Yamaha V-Star, and similar V-twin platforms. You have deep knowledge of:
- Air-cooled and liquid-cooled cruiser engines (Evolution, Twin Cam, Shovelhead, Panhead, Knucklehead)
- Common failure modes and sounds for each engine family
- Custom build techniques for hardtails, bobbers, and choppers
- Parts sourcing, vendor recommendations, and realistic pricing
- DIY vs shop work assessment

When diagnosing, be direct and practical — talk like a real shop mechanic, not a manual. Give a clear diagnosis, identify the most likely cause, and provide actionable next steps. Always include an estimated repair cost range in USD.

Respond ONLY with valid JSON matching this exact structure (no markdown, no extra text):
{
  "diagnosis": "2-3 sentence explanation of what's wrong",
  "severity": "minor" | "moderate" | "serious",
  "likelyCause": "The single most likely cause in one phrase",
  "estimatedCost": "$X–$Y parts + labor",
  "diyFriendly": true | false,
  "nextSteps": ["step 1", "step 2", "step 3"]
}`;

const BUILD_SYSTEM_PROMPT = `You are a master custom motorcycle builder with expertise in choppers, bobbers, and brat-style builds. You help riders plan their builds with realistic parts lists, vendor recommendations, and installation guidance.

Respond ONLY with valid JSON matching this exact structure (no markdown, no extra text):
{
  "summary": "2-3 sentence overview of this build",
  "partsList": [
    { "part": "Part name", "vendor": "Best vendor to buy from", "approxPrice": "$X" }
  ],
  "installOrder": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "totalEstimate": "$X,XXX–$X,XXX total including labor"
}`;

export async function diagnoseProblem(description: string): Promise<DiagnosisResult> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: MECHANIC_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Motorcycle problem: ${description}` }],
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  try {
    return JSON.parse(text) as DiagnosisResult;
  } catch {
    return {
      diagnosis: text,
      severity: 'moderate',
      likelyCause: 'See diagnosis above',
      estimatedCost: 'Varies',
      diyFriendly: false,
      nextSteps: ['Consult a qualified mechanic'],
    };
  }
}

export async function getBuildRecommendations(
  bike: string,
  style: string,
  mods: string[]
): Promise<BuildRecommendation> {
  const prompt = `Build plan request:
Bike: ${bike}
Style: ${style}
Selected mods: ${mods.join(', ')}

Create a detailed parts list with vendors, installation order, and pro tips for this build.`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: BUILD_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  try {
    return JSON.parse(text) as BuildRecommendation;
  } catch {
    return {
      summary: 'Build plan generated. See details below.',
      partsList: mods.map(m => ({ part: m, vendor: 'Check local dealers', approxPrice: 'Varies' })),
      installOrder: ['Consult a professional builder for installation order'],
      tips: ['Document everything', 'Source parts before starting', 'Budget 20% extra for surprises'],
      totalEstimate: 'Contact local shops for quotes',
    };
  }
}
