import { describe, it, expect } from 'vitest';
import { generateFakePlan } from '../ai/localFakeModel';
import { validateAIPlan } from '../ai/planSchema';

describe('AI Fake Model - Deterministic Behavior', () => {
  it('should generate identical plans for the same input', () => {
    const description = 'A tech startup building AI tools for developers';
    
    // Generate first plan
    const plan1 = generateFakePlan(description);
    
    // Generate second plan with same input
    const plan2 = generateFakePlan(description);
    
    // Should be identical
    expect(plan1.brand.name).toBe(plan2.brand.name);
    expect(plan1.brand.industry).toBe(plan2.brand.industry);
    expect(plan1.brand.tone).toBe(plan2.brand.tone);
    expect(plan1.sections.length).toBe(plan2.sections.length);
    
    // Check section variants are identical
    plan1.sections.forEach((section1, index) => {
      const section2 = plan2.sections[index];
      expect(section1.id).toBe(section2.id);
      expect(section1.variant).toBe(section2.variant);
    });
  });

  it('should generate different plans for different inputs', () => {
    const description1 = 'A tech startup building AI tools';
    const description2 = 'A luxury fashion brand for high-end clients';
    
    const plan1 = generateFakePlan(description1);
    const plan2 = generateFakePlan(description2);
    
    // Should be different
    expect(plan1.brand.name).not.toBe(plan2.brand.name);
    expect(plan1.brand.tone).not.toBe(plan2.brand.tone);
  });

  it('should extract industry correctly from descriptions', () => {
    const testCases = [
      { description: 'A software company building mobile apps', expected: 'technology' },
      { description: 'A medical practice management system', expected: 'healthcare' },
      { description: 'A financial services platform', expected: 'finance' },
      { description: 'An online learning platform for students', expected: 'education' },
      { description: 'An e-commerce store selling products', expected: 'ecommerce' }
    ];
    
    testCases.forEach(({ description, expected }) => {
      const plan = generateFakePlan(description);
      expect(plan.brand.industry).toBe(expected);
    });
  });

  it('should extract tone correctly from descriptions', () => {
    const testCases = [
      { description: 'A luxury premium service for elite clients', expected: 'luxury' },
      { description: 'A fun creative tool for playful users', expected: 'playful' },
      { description: 'A simple minimal solution for clean design', expected: 'minimal' },
      { description: 'A bold revolutionary breakthrough technology', expected: 'bold' },
      { description: 'A professional corporate business solution', expected: 'corporate' }
    ];
    
    testCases.forEach(({ description, expected }) => {
      const plan = generateFakePlan(description);
      expect(plan.brand.tone).toBe(expected);
    });
  });

  it('should generate valid AI plans', () => {
    const description = 'A tech startup building innovative solutions';
    const plan = generateFakePlan(description);
    
    // Should pass schema validation
    expect(() => validateAIPlan(plan)).not.toThrow();
    
    // Check basic structure
    expect(plan.brand).toBeDefined();
    expect(plan.brand.name).toBeTruthy();
    expect(plan.sections).toBeDefined();
    expect(Array.isArray(plan.sections)).toBe(true);
    expect(plan.sections.length).toBeGreaterThan(0);
  });

  it('should generate all required sections', () => {
    const description = 'A comprehensive business solution';
    const plan = generateFakePlan(description);
    
    const requiredSections = [
      'navbar', 'hero', 'socialProof', 'features', 'featureSpotlight',
      'testimonials', 'metrics', 'pricing', 'faq', 'finalCta', 'footer'
    ];
    
    const sectionIds = plan.sections.map(s => s.id);
    
    requiredSections.forEach(required => {
      expect(sectionIds).toContain(required);
    });
    
    // Should have no duplicates
    const uniqueIds = new Set(sectionIds);
    expect(uniqueIds.size).toBe(sectionIds.length);
  });

  it('should generate valid variants for all sections', () => {
    const description = 'A test business description';
    const plan = generateFakePlan(description);
    
    plan.sections.forEach(section => {
      expect(section.variant).toBeGreaterThanOrEqual(1);
      expect(section.variant).toBeLessThanOrEqual(7);
      expect(Number.isInteger(section.variant)).toBe(true);
    });
  });

  it('should generate industry-appropriate content', () => {
    const healthcareDescription = 'A medical practice management system for doctors';
    const plan = generateFakePlan(healthcareDescription);
    
    expect(plan.brand.industry).toBe('healthcare');
    expect(plan.brand.targetAudience).toBe('healthcare professionals');
    
    // Check that testimonials are healthcare-appropriate
    const testimonialsSection = plan.sections.find(s => s.id === 'testimonials');
    expect(testimonialsSection).toBeDefined();
    
    if (testimonialsSection && 'items' in testimonialsSection.props) {
      const items = (testimonialsSection.props as any).items;
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].name).toContain('Dr.');
    }
  });

  it('should handle edge cases gracefully', () => {
    const edgeCases = [
      '', // Empty string
      'a', // Single character
      'A very long description with many words that should still work correctly and generate a valid plan',
      'Special characters: !@#$%^&*()_+-=[]{}|;:,.<>?',
      'Numbers and 123 and symbols @#$'
    ];
    
    edgeCases.forEach(description => {
      expect(() => {
        const plan = generateFakePlan(description);
        validateAIPlan(plan);
      }).not.toThrow();
    });
  });

  it('should maintain consistency across multiple generations', () => {
    const description = 'A consistent test description';
    const plans = Array.from({ length: 5 }, () => generateFakePlan(description));
    
    // All plans should be identical
    const firstPlan = plans[0];
    plans.slice(1).forEach(plan => {
      expect(plan.brand.name).toBe(firstPlan.brand.name);
      expect(plan.brand.industry).toBe(firstPlan.brand.industry);
      expect(plan.brand.tone).toBe(firstPlan.brand.tone);
      expect(plan.sections.length).toBe(firstPlan.sections.length);
    });
  });
});
