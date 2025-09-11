import { describe, it, expect, vi } from 'vitest';
import { runPlanGeneration } from '../ai/plan/run';
import { extract } from '../ai/nlu/extract';
import { buildPrompt } from '../ai/plan/buildPrompt';
import { callModel } from '../ai/providers/openai';
import { parseModelPlan } from '../ai/schema/plan.zod';

// Mock dependencies
vi.mock('../ai/nlu/extract');
vi.mock('../ai/plan/buildPrompt');
vi.mock('../ai/providers/openai');
vi.mock('../ai/schema/plan.zod');

describe('runPlanGeneration - AI Plan Orchestration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully generate a plan from user speech', async () => {
    const userSpeech = 'We are a tech startup building AI tools for developers';
    
    const mockExtracted = {
      industry: 'technology',
      audience: 'developers',
      tone: 'corporate',
      goal: 'generate leads',
      requiredSections: ['hero', 'pricing'],
      forbiddenSections: [],
      brandWords: ['tech', 'startup', 'AI', 'tools']
    };
    
    const mockPrompt = {
      system: 'You MUST output ONLY valid JSON...',
      user: 'Brand summary: We are a tech startup...'
    };
    
    const mockRawResponse = {
      brand: { name: 'TechCorp', industry: 'technology' },
      sections: [
        { id: 'hero', variant: 1, props: { headline: 'AI Tools for Developers' } }
      ]
    };
    
    const mockValidatedPlan = {
      brand: { name: 'TechCorp', industry: 'technology' },
      sections: [
        { id: 'hero', variant: 1, props: { headline: 'AI Tools for Developers' } }
      ]
    };
    
    // Mock the functions
    vi.mocked(extract).mockReturnValue(mockExtracted);
    vi.mocked(buildPrompt).mockReturnValue(mockPrompt);
    vi.mocked(callModel).mockResolvedValue(mockRawResponse);
    vi.mocked(parseModelPlan).mockReturnValue(mockValidatedPlan);
    
    const result = await runPlanGeneration(userSpeech);
    
    expect(extract).toHaveBeenCalledWith(userSpeech);
    expect(buildPrompt).toHaveBeenCalledWith({
      userSpeech,
      extracted: mockExtracted,
      registry: expect.any(Object)
    });
    expect(callModel).toHaveBeenCalledWith([mockPrompt.system, mockPrompt.user], {
      json: true,
      temperature: 0.4
    });
    expect(parseModelPlan).toHaveBeenCalledWith(mockRawResponse);
    
    expect(result.plan).toEqual(mockValidatedPlan);
    expect(result.extracted).toEqual(mockExtracted);
    expect(result.warnings).toBeInstanceOf(Array);
  });

  it('should retry on invalid JSON from model', async () => {
    const userSpeech = 'We are a tech startup';
    
    const mockExtracted = { industry: 'technology', requiredSections: [], forbiddenSections: [], brandWords: [] };
    const mockPrompt = { system: 'You MUST output ONLY valid JSON...', user: 'Brand summary: We are a tech startup' };
    
    // First call returns invalid JSON, second call succeeds
    const invalidResponse = 'This is not valid JSON';
    const validResponse = {
      brand: { name: 'TechCorp' },
      sections: [{ id: 'hero', variant: 1, props: { headline: 'Test' } }]
    };
    
    vi.mocked(extract).mockReturnValue(mockExtracted);
    vi.mocked(buildPrompt).mockReturnValue(mockPrompt);
    vi.mocked(callModel)
      .mockRejectedValueOnce(new Error('Invalid JSON response'))
      .mockResolvedValueOnce(validResponse);
    vi.mocked(parseModelPlan).mockReturnValue(validResponse);
    
    const result = await runPlanGeneration(userSpeech);
    
    expect(callModel).toHaveBeenCalledTimes(2);
    expect(result.plan).toEqual(validResponse);
  });

  it('should handle extraction errors gracefully', async () => {
    const userSpeech = 'We are a tech startup';
    
    vi.mocked(extract).mockImplementation(() => {
      throw new Error('Extraction failed');
    });
    
    await expect(runPlanGeneration(userSpeech)).rejects.toThrow('Failed to generate plan: Extraction failed');
  });

  it('should handle prompt building errors gracefully', async () => {
    const userSpeech = 'We are a tech startup';
    
    const mockExtracted = { industry: 'technology', requiredSections: [], forbiddenSections: [], brandWords: [] };
    
    vi.mocked(extract).mockReturnValue(mockExtracted);
    vi.mocked(buildPrompt).mockImplementation(() => {
      throw new Error('Prompt building failed');
    });
    
    await expect(runPlanGeneration(userSpeech)).rejects.toThrow('Failed to generate plan: Prompt building failed');
  });

  it('should handle model call errors gracefully', async () => {
    const userSpeech = 'We are a tech startup';
    
    const mockExtracted = { industry: 'technology', requiredSections: [], forbiddenSections: [], brandWords: [] };
    const mockPrompt = { system: 'You MUST output ONLY valid JSON...', user: 'Brand summary: We are a tech startup' };
    
    vi.mocked(extract).mockReturnValue(mockExtracted);
    vi.mocked(buildPrompt).mockReturnValue(mockPrompt);
    vi.mocked(callModel).mockRejectedValue(new Error('Model call failed'));
    
    await expect(runPlanGeneration(userSpeech)).rejects.toThrow('Failed to generate plan: Model call failed');
  });

  it('should handle plan validation errors gracefully', async () => {
    const userSpeech = 'We are a tech startup';
    
    const mockExtracted = { industry: 'technology', requiredSections: [], forbiddenSections: [], brandWords: [] };
    const mockPrompt = { system: 'You MUST output ONLY valid JSON...', user: 'Brand summary: We are a tech startup' };
    const mockRawResponse = { invalid: 'plan' };
    
    vi.mocked(extract).mockReturnValue(mockExtracted);
    vi.mocked(buildPrompt).mockReturnValue(mockPrompt);
    vi.mocked(callModel).mockResolvedValue(mockRawResponse);
    vi.mocked(parseModelPlan).mockImplementation(() => {
      throw new Error('Invalid model plan: Brand name is required');
    });
    
    await expect(runPlanGeneration(userSpeech)).rejects.toThrow('Failed to generate plan: Invalid model plan: Brand name is required');
  });

  it('should validate variant bounds and add warnings', async () => {
    const userSpeech = 'We are a tech startup';
    
    const mockExtracted = { industry: 'technology', requiredSections: [], forbiddenSections: [], brandWords: [] };
    const mockPrompt = { system: 'You MUST output ONLY valid JSON...', user: 'Brand summary: We are a tech startup' };
    const mockRawResponse = {
      brand: { name: 'TechCorp' },
      sections: [
        { id: 'hero', variant: 999 }, // Out of bounds
        { id: 'navbar', variant: 1 }
      ]
    };
    const mockValidatedPlan = {
      brand: { name: 'TechCorp' },
      sections: [
        { id: 'hero', variant: 999 },
        { id: 'navbar', variant: 1 }
      ]
    };
    
    vi.mocked(extract).mockReturnValue(mockExtracted);
    vi.mocked(buildPrompt).mockReturnValue(mockPrompt);
    vi.mocked(callModel).mockResolvedValue(mockRawResponse);
    vi.mocked(parseModelPlan).mockReturnValue(mockValidatedPlan);
    
    const result = await runPlanGeneration(userSpeech);
    
    expect(result.warnings).toContain('Section hero variant 999 is out of bounds (1-7)');
  });

  it('should handle empty user speech', async () => {
    const userSpeech = '';
    
    const mockExtracted = { industry: undefined, requiredSections: [], forbiddenSections: [], brandWords: [] };
    const mockPrompt = { system: 'You MUST output ONLY valid JSON...', user: 'Brand summary: ' };
    const mockRawResponse = {
      brand: { name: 'Your Company' },
      sections: [{ id: 'hero', variant: 1, props: { headline: 'Default' } }]
    };
    
    vi.mocked(extract).mockReturnValue(mockExtracted);
    vi.mocked(buildPrompt).mockReturnValue(mockPrompt);
    vi.mocked(callModel).mockResolvedValue(mockRawResponse);
    vi.mocked(parseModelPlan).mockReturnValue(mockRawResponse);
    
    const result = await runPlanGeneration(userSpeech);
    
    expect(result.plan).toEqual(mockRawResponse);
    expect(result.extracted).toEqual(mockExtracted);
  });
});
