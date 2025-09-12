// Unit tests for composePage functionality
import { describe, it, expect, beforeEach } from 'vitest';
import { 
  buildDefaultConfig, 
  buildRandomizedConfig, 
  validateVariantParity,
  getAllVariantCounts,
  isPageComplete 
} from '../generator/composePage.js';
import { validatePageConfig } from '../utils/validation.js';

describe('composePage', () => {
  const mockBrand = {
    name: 'Test Brand',
    industry: 'technology',
    targetAudience: 'businesses',
    tone: 'corporate'
  };

  describe('buildDefaultConfig', () => {
    it('should create a complete page configuration', () => {
      const config = buildDefaultConfig(mockBrand);
      
      expect(config).toHaveProperty('brand');
      expect(config).toHaveProperty('sections');
      expect(config.brand).toEqual(mockBrand);
      expect(Array.isArray(config.sections)).toBe(true);
    });

    it('should include all required sections', () => {
      const config = buildDefaultConfig(mockBrand);
      const sectionIds = config.sections.map(s => s.id);
      
      const requiredSections = [
        'navbar', 'hero', 'socialProof', 'features', 
        'featureSpotlight', 'testimonials', 'metrics', 
        'pricing', 'faq', 'finalCta', 'footer'
      ];
      
      requiredSections.forEach(section => {
        expect(sectionIds).toContain(section);
      });
    });

    it('should have valid variant numbers', () => {
      const config = buildDefaultConfig(mockBrand);
      
      config.sections.forEach(section => {
        expect(section.variant).toBeGreaterThan(0);
        expect(section.variant).toBeLessThanOrEqual(7);
      });
    });
  });

  describe('buildRandomizedConfig', () => {
    it('should create a complete page configuration', () => {
      const config = buildRandomizedConfig(mockBrand);
      
      expect(config).toHaveProperty('brand');
      expect(config).toHaveProperty('sections');
      expect(config.brand).toEqual(mockBrand);
    });

    it('should be deterministic with same seed', () => {
      const config1 = buildRandomizedConfig(mockBrand, 123);
      const config2 = buildRandomizedConfig(mockBrand, 123);
      
      expect(config1.sections).toEqual(config2.sections);
    });

    it('should be different with different seeds', () => {
      const config1 = buildRandomizedConfig(mockBrand, 123);
      const config2 = buildRandomizedConfig(mockBrand, 456);
      
      // At least some sections should have different variants
      const different = config1.sections.some((section, index) => 
        section.variant !== config2.sections[index].variant
      );
      expect(different).toBe(true);
    });
  });

  describe('validateVariantParity', () => {
    it('should check variant parity across all sections', () => {
      const result = validateVariantParity();
      
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('maxCount');
      expect(result).toHaveProperty('counts');
      expect(typeof result.isValid).toBe('boolean');
      expect(typeof result.maxCount).toBe('number');
      expect(typeof result.counts).toBe('object');
    });
  });

  describe('getAllVariantCounts', () => {
    it('should return variant counts for all sections', () => {
      const counts = getAllVariantCounts();
      
      expect(typeof counts).toBe('object');
      expect(counts).toHaveProperty('navbar');
      expect(counts).toHaveProperty('hero');
      expect(counts).toHaveProperty('socialProof');
      expect(counts).toHaveProperty('features');
      expect(counts).toHaveProperty('featureSpotlight');
      expect(counts).toHaveProperty('testimonials');
      expect(counts).toHaveProperty('metrics');
      expect(counts).toHaveProperty('pricing');
      expect(counts).toHaveProperty('faq');
      expect(counts).toHaveProperty('finalCta');
      expect(counts).toHaveProperty('footer');
    });
  });

  describe('isPageComplete', () => {
    it('should identify complete pages', () => {
      const config = buildDefaultConfig(mockBrand);
      const result = isPageComplete(config);
      
      expect(result).toHaveProperty('isComplete');
      expect(result).toHaveProperty('missingSections');
      expect(result.isComplete).toBe(true);
      expect(result.missingSections).toEqual([]);
    });

    it('should identify incomplete pages', () => {
      const incompleteConfig = {
        brand: mockBrand,
        sections: [
          { id: 'navbar', variant: 1, props: {} },
          { id: 'hero', variant: 1, props: {} }
        ]
      };
      
      const result = isPageComplete(incompleteConfig);
      
      expect(result.isComplete).toBe(false);
      expect(result.missingSections.length).toBeGreaterThan(0);
    });
  });
});

describe('validation', () => {
  describe('validatePageConfig', () => {
    it('should validate complete configurations', () => {
      const config = buildDefaultConfig({
        name: 'Test Brand',
        industry: 'technology',
        targetAudience: 'businesses',
        tone: 'corporate'
      });
      
      expect(() => validatePageConfig(config)).not.toThrow();
    });

    it('should reject configurations with missing sections', () => {
      const incompleteConfig = {
        brand: { name: 'Test Brand' },
        sections: [
          { id: 'navbar', variant: 1, props: {} }
        ]
      };
      
      expect(() => validatePageConfig(incompleteConfig)).toThrow();
    });
  });
});
