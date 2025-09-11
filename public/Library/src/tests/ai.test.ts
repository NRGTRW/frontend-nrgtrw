import { describe, it, expect } from 'vitest';
import { 
  validateAIPlan, 
  validateSectionProps, 
  AIPlanSchema 
} from '../ai/planSchema';
import { 
  applyAIPlan, 
  validateAIPlanOnly, 
  mergeAIPlan 
} from '../ai/applyPlan';
import { buildDefaultConfig } from '../generator/builders';
import { BrandInfo } from '../types/landing';

describe('AI Plan Schema Validation', () => {
  it('should validate a complete AI plan', () => {
    const validPlan = {
      brand: {
        name: 'Test Company',
        tagline: 'Test tagline',
        industry: 'technology',
        tone: 'corporate'
      },
      sections: [
        {
          id: 'navbar',
          variant: 1,
          props: {
            links: [
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' }
            ],
            cta: { label: 'Get Started', href: '/signup' }
          }
        },
        {
          id: 'hero',
          variant: 2,
          props: {
            headline: 'Welcome to Our Platform',
            subhead: 'Transform your business',
            primaryCta: { label: 'Get Started', href: '/signup' }
          }
        }
      ]
    };
    
    expect(() => validateAIPlan(validPlan)).not.toThrow();
  });
  
  it('should throw error for missing brand name', () => {
    const invalidPlan = {
      brand: {
        tagline: 'Test tagline'
        // Missing name
      },
      sections: []
    };
    
    expect(() => validateAIPlan(invalidPlan)).toThrow('Brand name is required');
  });
  
  it('should throw error for invalid section ID', () => {
    const invalidPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'invalidSection',
          variant: 1,
          props: {}
        }
      ]
    };
    
    expect(() => validateAIPlan(invalidPlan)).toThrow();
  });
  
  it('should throw error for invalid variant number', () => {
    const invalidPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'navbar',
          variant: 0, // Invalid variant
          props: {}
        }
      ]
    };
    
    expect(() => validateAIPlan(invalidPlan)).toThrow('Variant must be at least 1');
  });
  
  it('should validate brand tone enum correctly', () => {
    const validTones = ['luxury', 'playful', 'minimal', 'corporate', 'bold'];
    
    validTones.forEach(tone => {
      const plan = {
        brand: { name: 'Test Company', tone },
        sections: []
      };
      
      expect(() => validateAIPlan(plan)).not.toThrow();
    });
  });
  
  it('should throw error for invalid brand tone', () => {
    const invalidPlan = {
      brand: { 
        name: 'Test Company',
        tone: 'invalidTone'
      },
      sections: []
    };
    
    expect(() => validateAIPlan(invalidPlan)).toThrow();
  });
});

describe('AI Plan Application', () => {
  it('should apply a valid AI plan successfully', () => {
    const aiPlan = {
      brand: {
        name: 'AI Generated Company',
        tagline: 'AI-powered solutions',
        industry: 'technology',
        tone: 'corporate'
      },
      sections: [
        {
          id: 'navbar',
          variant: 1,
          props: {
            links: [
              { label: 'Home', href: '/' },
              { label: 'Features', href: '/features' }
            ],
            cta: { label: 'Get Started', href: '/signup' }
          }
        },
        {
          id: 'hero',
          variant: 2,
          props: {
            headline: 'AI-Powered Platform',
            subhead: 'Revolutionary technology for modern businesses',
            primaryCta: { label: 'Start Free Trial', href: '/trial' }
          }
        }
      ]
    };
    
    const result = applyAIPlan(aiPlan);
    
    expect(result.brand.name).toBe('AI Generated Company');
    expect(result.brand.tagline).toBe('AI-powered solutions');
    expect(result.brand.industry).toBe('technology');
    expect(result.brand.tone).toBe('corporate');
    expect(result.sections).toHaveLength(11); // All required sections
  });
  
  it('should clamp variant numbers to valid range', () => {
    const aiPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'navbar',
          variant: 999, // Out of range
          props: {
            links: [{ label: 'Home', href: '/' }]
          }
        }
      ]
    };
    
    const result = applyAIPlan(aiPlan);
    const navbarSection = result.sections.find(s => s.id === 'navbar');
    
    expect(navbarSection?.variant).toBe(7); // Clamped to max
  });
  
  it('should add missing sections with defaults', () => {
    const aiPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'navbar',
          variant: 1,
          props: {
            links: [{ label: 'Home', href: '/' }]
          }
        }
        // Missing other required sections
      ]
    };
    
    const result = applyAIPlan(aiPlan);
    
    expect(result.sections).toHaveLength(11); // All required sections added
    expect(result.sections.map(s => s.id)).toContain('hero');
    expect(result.sections.map(s => s.id)).toContain('footer');
  });
  
  it('should merge with base config', () => {
    const baseBrand: BrandInfo = {
      name: 'Base Company',
      tagline: 'Base tagline',
      industry: 'finance'
    };
    
    const baseConfig = buildDefaultConfig(baseBrand);
    
    const aiPlan = {
      brand: {
        name: 'AI Company',
        tone: 'playful'
        // Other fields should be preserved from base
      },
      sections: [
        {
          id: 'navbar',
          variant: 1,
          props: {
            links: [{ label: 'Home', href: '/' }]
          }
        }
      ]
    };
    
    const result = applyAIPlan(aiPlan, baseConfig);
    
    expect(result.brand.name).toBe('AI Company');
    expect(result.brand.tagline).toBe('Base tagline'); // Preserved from base
    expect(result.brand.industry).toBe('finance'); // Preserved from base
    expect(result.brand.tone).toBe('playful'); // From AI plan
  });
  
  it('should handle invalid AI plan gracefully', () => {
    const invalidPlan = {
      brand: {
        name: '' // Invalid empty name
      },
      sections: []
    };
    
    expect(() => applyAIPlan(invalidPlan)).toThrow();
  });
});

describe('AI Plan Validation Only', () => {
  it('should return valid for correct plan', () => {
    const validPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'navbar',
          variant: 1,
          props: {}
        }
      ]
    };
    
    const result = validateAIPlanOnly(validPlan);
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  it('should return invalid with errors for incorrect plan', () => {
    const invalidPlan = {
      brand: { name: '' }, // Invalid
      sections: []
    };
    
    const result = validateAIPlanOnly(invalidPlan);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe('Merge AI Plan', () => {
  it('should merge AI plan with existing config', () => {
    const baseBrand: BrandInfo = { name: 'Base Company' };
    const baseConfig = buildDefaultConfig(baseBrand);
    
    const aiPlan = {
      brand: { name: 'Merged Company' },
      sections: [
        {
          id: 'navbar',
          variant: 1,
          props: {
            links: [{ label: 'Home', href: '/' }]
          }
        }
      ]
    };
    
    const result = mergeAIPlan(baseConfig, aiPlan);
    
    expect(result.brand.name).toBe('Merged Company');
    expect(result.sections).toHaveLength(11);
  });
  
  it('should return base config if AI plan is invalid', () => {
    const baseBrand: BrandInfo = { name: 'Base Company' };
    const baseConfig = buildDefaultConfig(baseBrand);
    
    const invalidPlan = {
      brand: { name: '' }, // Invalid
      sections: []
    };
    
    const result = mergeAIPlan(baseConfig, invalidPlan);
    
    // Should return the original base config
    expect(result.brand.name).toBe('Base Company');
  });
});
