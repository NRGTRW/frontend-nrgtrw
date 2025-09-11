import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getState,
  generateRandomConfig,
  resetToDefaults,
  setSeed,
  getCurrentSeed
} from '../preview/EnhancedState';

describe('Preview State - Deterministic Behavior', () => {
  beforeEach(() => {
    resetToDefaults();
  });

  it('should generate identical configs for the same seed', () => {
    const seed = 12345;
    
    // Generate first config
    generateRandomConfig(seed);
    const config1 = getState().config;
    const sections1 = config1.sections.map(s => ({ id: s.id, variant: s.variant }));
    
    // Reset and generate second config with same seed
    resetToDefaults();
    generateRandomConfig(seed);
    const config2 = getState().config;
    const sections2 = config2.sections.map(s => ({ id: s.id, variant: s.variant }));
    
    // Should be identical
    expect(sections1).toEqual(sections2);
    expect(config1.brand.name).toBe(config2.brand.name);
  });

  it('should generate different configs for different seeds', () => {
    const seed1 = 12345;
    const seed2 = 67890;
    
    // Generate config with first seed
    generateRandomConfig(seed1);
    const config1 = getState().config;
    const sections1 = config1.sections.map(s => ({ id: s.id, variant: s.variant }));
    
    // Generate config with second seed
    generateRandomConfig(seed2);
    const config2 = getState().config;
    const sections2 = config2.sections.map(s => ({ id: s.id, variant: s.variant }));
    
    // Should be different
    expect(sections1).not.toEqual(sections2);
  });

  it('should maintain seed state correctly', () => {
    const seed = 99999;
    setSeed(seed);
    
    expect(getCurrentSeed()).toBe(seed);
    
    generateRandomConfig();
    expect(getCurrentSeed()).toBe(seed);
  });

  it('should generate valid configurations', () => {
    const seed = 12345;
    generateRandomConfig(seed);
    
    const config = getState().config;
    
    // Check basic structure
    expect(config.brand).toBeDefined();
    expect(config.brand.name).toBeTruthy();
    expect(config.sections).toBeDefined();
    expect(Array.isArray(config.sections)).toBe(true);
    
    // Check all required sections are present
    const sectionIds = config.sections.map(s => s.id);
    const requiredSections = [
      'navbar', 'hero', 'socialProof', 'features', 'featureSpotlight',
      'testimonials', 'metrics', 'pricing', 'faq', 'finalCta', 'footer'
    ];
    
    requiredSections.forEach(required => {
      expect(sectionIds).toContain(required);
    });
    
    // Check no duplicate sections
    const uniqueIds = new Set(sectionIds);
    expect(uniqueIds.size).toBe(sectionIds.length);
    
    // Check all variants are valid (1-7)
    config.sections.forEach(section => {
      expect(section.variant).toBeGreaterThanOrEqual(1);
      expect(section.variant).toBeLessThanOrEqual(7);
    });
  });

  it('should handle multiple rapid generations', () => {
    const seeds = [111, 222, 333, 444, 555];
    const configs: any[] = [];
    
    seeds.forEach(seed => {
      generateRandomConfig(seed);
      configs.push({
        seed,
        sections: getState().config.sections.map(s => ({ id: s.id, variant: s.variant }))
      });
    });
    
    // All configs should be different
    for (let i = 0; i < configs.length; i++) {
      for (let j = i + 1; j < configs.length; j++) {
        expect(configs[i].sections).not.toEqual(configs[j].sections);
      }
    }
  });

  it('should preserve brand information across generations', () => {
    const customBrand = {
      name: 'Custom Company',
      tagline: 'Custom tagline',
      industry: 'technology',
      tone: 'corporate' as const
    };
    
    // Set custom brand
    resetToDefaults();
    const state = getState();
    state.config.brand = { ...state.config.brand, ...customBrand };
    
    // Generate random config
    generateRandomConfig(12345);
    const newConfig = getState().config;
    
    // Brand should be preserved
    expect(newConfig.brand.name).toBe(customBrand.name);
    expect(newConfig.brand.tagline).toBe(customBrand.tagline);
    expect(newConfig.brand.industry).toBe(customBrand.industry);
    expect(newConfig.brand.tone).toBe(customBrand.tone);
  });
});
