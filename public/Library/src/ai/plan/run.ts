// Orchestrator for AI plan generation (client-side)
import { generateAIPlan, AIPlanRequest } from '../../services/aiApi';
import { PageConfig } from '../../types/landing';
import { generateFakePlan } from '../localFakeModel';
import { applyAIPlan } from '../applyPlan';
import { buildDefaultConfig } from '../../generator/builders';

export interface PlanGenerationResult {
  pageConfig: PageConfig;
  warnings: string[];
}

export async function runPlanGeneration(
  userSpeech: string,
  options: {
    creativity?: number;
    specificity?: number;
    keepTone?: boolean;
    brandWords?: string[];
  } = {}
): Promise<PlanGenerationResult> {
  try {
    console.log('🔍 Starting AI plan generation...');
    
    const request: AIPlanRequest = {
      userSpeech,
      creativity: options.creativity,
      specificity: options.specificity,
      keepTone: options.keepTone,
      brandWords: options.brandWords,
    };
    
    try {
      // Try to call the server-side AI endpoint first
      const response = await generateAIPlan(request);
      
      if (!response.success) {
        throw new Error(response.error || 'AI plan generation failed');
      }
      
      console.log('✅ AI plan generated successfully via server');
      
      return {
        pageConfig: response.pageConfig,
        warnings: response.warnings,
      };
      
    } catch (serverError) {
      console.warn('⚠️ Server unavailable, falling back to local fake model:', serverError);
      
      // Fallback to local fake model
      const fakePlan = generateFakePlan(userSpeech);
      const defaultConfig = buildDefaultConfig({
        name: 'Your Business',
        tagline: 'Professional solutions for your needs',
        industry: 'Business',
        targetAudience: 'Professionals',
        tone: 'professional'
      });
      
      const pageConfig = applyAIPlan(fakePlan, defaultConfig);
      
      console.log('✅ AI plan generated successfully via fallback');
      
      return {
        pageConfig,
        warnings: ['Generated using offline mode - server unavailable'],
      };
    }
    
  } catch (error) {
    console.error('❌ Plan generation failed:', error);
    throw new Error(`Failed to generate plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

