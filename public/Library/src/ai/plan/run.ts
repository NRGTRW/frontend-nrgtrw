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
    
    // Skip API calls and use local fake model directly for standalone operation
    console.log('🔧 Using offline mode for standalone operation');
    
    // Use local fake model directly
    const fakePlan = generateFakePlan(userSpeech);
    const defaultConfig = buildDefaultConfig({
      name: 'Your Business',
      tagline: 'Professional solutions for your needs',
      industry: 'Business',
      targetAudience: 'Professionals',
      tone: 'professional'
    });
    
    const pageConfig = applyAIPlan(fakePlan, defaultConfig);
    
    console.log('✅ AI plan generated successfully via offline mode');
    
    return {
      pageConfig,
      warnings: ['Generated using offline mode - standalone operation'],
    };
    
  } catch (error) {
    console.error('❌ Plan generation failed:', error);
    throw new Error(`Failed to generate plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

