import { Context } from 'hono';
import { z } from 'zod';
import { callModel } from '../providers/openai.server.ts';
import { extract } from '../../src/ai/nlu/extract.ts';
import { buildPrompt } from '../../src/ai/plan/buildPrompt.ts';
import { parseModelPlan } from '../../src/ai/schema/plan.zod.ts';
import { applyAIPlan } from '../../src/ai/applyPlan.ts';
import { buildDefaultConfig } from '../../src/generator/builders.ts';
import { registry } from '../../src/generator/registry.ts';

// Request validation schema
const AiPlanRequestSchema = z.object({
  userSpeech: z.string().min(1).max(2048), // 2KB limit
  creativity: z.number().min(0).max(1).optional(),
  specificity: z.number().min(0).max(1).optional(),
  keepTone: z.boolean().optional(),
  brandWords: z.array(z.string()).optional(),
});

// HTML sanitization
const HTML_REGEX = /<[^>]*>/g;

function sanitizeText(text: string): string {
  return text.replace(HTML_REGEX, '').trim();
}

export async function aiPlanHandler(c: Context) {
  try {
    // Parse and validate request
    const body = await c.req.json();
    const validatedRequest = AiPlanRequestSchema.parse(body);
    
    // Sanitize user speech
    const sanitizedSpeech = sanitizeText(validatedRequest.userSpeech);
    
    if (!sanitizedSpeech) {
      return c.json({ error: 'Invalid or empty user speech' }, 400);
    }

    console.log('🤖 Processing AI plan request...');
    
    // Extract structured info from natural language
    const extracted = extract(sanitizedSpeech);
    console.log('📝 Extracted info:', extracted);
    
    // Build prompt for AI
    const promptParts = buildPrompt({
      userSpeech: sanitizedSpeech,
      extracted,
      registry,
    });
    
    // Call OpenAI API
    const plan = await callModel(promptParts, {
      json: true,
      temperature: validatedRequest.creativity || 0.4,
    });
    
    console.log('✅ AI plan generated');
    
    // Apply plan to default config
    const defaultConfig = buildDefaultConfig({
      name: extracted.brandWords[0] || 'Your Company',
      tagline: extracted.goal,
      industry: extracted.industry,
      targetAudience: extracted.audience,
      tone: extracted.tone,
    });
    
    const pageConfig = applyAIPlan(plan, defaultConfig);
    
    console.log('🎯 Page config ready');
    
    return c.json({
      success: true,
      pageConfig,
      warnings: [], // applyAIPlan logs warnings to console
    });
    
  } catch (error) {
    console.error('❌ AI plan handler error:', error);
    
    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Invalid request format',
        details: error.errors,
      }, 400);
    }
    
    if (error instanceof Error) {
      return c.json({
        error: 'AI processing failed',
        message: error.message,
      }, 500);
    }
    
    return c.json({
      error: 'Unknown error occurred',
    }, 500);
  }
}
