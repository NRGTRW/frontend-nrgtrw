import { describe, it, expect } from 'vitest';
import { 
  registry, 
  isValidSectionID, 
  getVariantCount, 
  isValidVariant, 
  validateSectionProps 
} from '../generator/registry';
import { SectionID } from '../types/landing';

describe('registry', () => {
  it('should have all required sections', () => {
    const requiredSections: SectionID[] = [
      'navbar', 'hero', 'socialProof', 'features', 'featureSpotlight',
      'testimonials', 'metrics', 'pricing', 'faq', 'finalCta', 'footer'
    ];
    
    requiredSections.forEach(sectionId => {
      expect(registry[sectionId]).toBeDefined();
      expect(registry[sectionId].variants).toBeGreaterThan(0);
      expect(typeof registry[sectionId].validate).toBe('function');
    });
  });
  
  it('should have consistent variant counts', () => {
    const variantCounts = Object.values(registry).map(section => section.variants);
    const maxVariants = Math.max(...variantCounts);
    const minVariants = Math.min(...variantCounts);
    
    // All sections should have the same number of variants (component parity)
    expect(maxVariants).toBe(minVariants);
    expect(maxVariants).toBe(7); // Target variant count
  });
});

describe('isValidSectionID', () => {
  it('should return true for valid section IDs', () => {
    const validIds: SectionID[] = [
      'navbar', 'hero', 'socialProof', 'features', 'featureSpotlight',
      'testimonials', 'metrics', 'pricing', 'faq', 'finalCta', 'footer'
    ];
    
    validIds.forEach(id => {
      expect(isValidSectionID(id)).toBe(true);
    });
  });
  
  it('should return false for invalid section IDs', () => {
    const invalidIds = ['invalid', 'test', 'random', ''];
    
    invalidIds.forEach(id => {
      expect(isValidSectionID(id)).toBe(false);
    });
  });
});

describe('getVariantCount', () => {
  it('should return correct variant count for each section', () => {
    const sections: SectionID[] = [
      'navbar', 'hero', 'socialProof', 'features', 'featureSpotlight',
      'testimonials', 'metrics', 'pricing', 'faq', 'finalCta', 'footer'
    ];
    
    sections.forEach(sectionId => {
      const count = getVariantCount(sectionId);
      expect(count).toBe(7);
      expect(count).toBe(registry[sectionId].variants);
    });
  });
});

describe('isValidVariant', () => {
  it('should return true for valid variant numbers', () => {
    const sections: SectionID[] = [
      'navbar', 'hero', 'socialProof', 'features', 'featureSpotlight',
      'testimonials', 'metrics', 'pricing', 'faq', 'finalCta', 'footer'
    ];
    
    sections.forEach(sectionId => {
      expect(isValidVariant(sectionId, 1)).toBe(true);
      expect(isValidVariant(sectionId, 7)).toBe(true);
      expect(isValidVariant(sectionId, 4)).toBe(true);
    });
  });
  
  it('should return false for invalid variant numbers', () => {
    const sections: SectionID[] = [
      'navbar', 'hero', 'socialProof', 'features', 'featureSpotlight',
      'testimonials', 'metrics', 'pricing', 'faq', 'finalCta', 'footer'
    ];
    
    sections.forEach(sectionId => {
      expect(isValidVariant(sectionId, 0)).toBe(false);
      expect(isValidVariant(sectionId, -1)).toBe(false);
      expect(isValidVariant(sectionId, 8)).toBe(false);
      expect(isValidVariant(sectionId, 999)).toBe(false);
    });
  });
});

describe('validateSectionProps', () => {
  it('should validate navbar props correctly', () => {
    const validProps = {
      links: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' }
      ],
      cta: { label: 'Get Started', href: '/signup' }
    };
    
    expect(() => validateSectionProps('navbar', validProps)).not.toThrow();
  });
  
  it('should throw error for invalid navbar props', () => {
    const invalidProps = {
      links: [], // Empty links array
      cta: { label: 'Get Started', href: '/signup' }
    };
    
    expect(() => validateSectionProps('navbar', invalidProps)).toThrow();
  });
  
  it('should validate hero props correctly', () => {
    const validProps = {
      headline: 'Welcome to Our Platform',
      subhead: 'Transform your business',
      primaryCta: { label: 'Get Started', href: '/signup' },
      secondaryCta: { label: 'Learn More', href: '/learn' }
    };
    
    expect(() => validateSectionProps('hero', validProps)).not.toThrow();
  });
  
  it('should throw error for invalid hero props', () => {
    const invalidProps = {
      headline: '', // Empty headline
      primaryCta: { label: 'Get Started', href: '/signup' }
    };
    
    expect(() => validateSectionProps('hero', invalidProps)).toThrow();
  });
  
  it('should validate features props correctly', () => {
    const validProps = {
      items: [
        { title: 'Feature 1', body: 'Description 1' },
        { title: 'Feature 2', body: 'Description 2' },
        { title: 'Feature 3', body: 'Description 3' }
      ]
    };
    
    expect(() => validateSectionProps('features', validProps)).not.toThrow();
  });
  
  it('should throw error for too few features', () => {
    const invalidProps = {
      items: [
        { title: 'Feature 1', body: 'Description 1' }
        // Only 1 feature, need at least 3
      ]
    };
    
    expect(() => validateSectionProps('features', invalidProps)).toThrow();
  });
  
  it('should throw error for too many features', () => {
    const invalidProps = {
      items: Array.from({ length: 10 }, (_, i) => ({
        title: `Feature ${i + 1}`,
        body: `Description ${i + 1}`
      }))
      // 10 features, max is 6
    };
    
    expect(() => validateSectionProps('features', invalidProps)).toThrow();
  });
  
  it('should validate pricing props correctly', () => {
    const validProps = {
      plans: [
        {
          name: 'Basic',
          price: '29',
          period: '/mo',
          features: ['Feature 1', 'Feature 2'],
          cta: { label: 'Choose Plan', href: '/pricing' }
        },
        {
          name: 'Pro',
          price: '99',
          period: '/mo',
          features: ['All Basic features', 'Feature 3'],
          cta: { label: 'Choose Plan', href: '/pricing' },
          highlight: true
        }
      ],
      hasToggle: true
    };
    
    expect(() => validateSectionProps('pricing', validProps)).not.toThrow();
  });
  
  it('should throw error for invalid pricing props', () => {
    const invalidProps = {
      plans: [
        {
          name: 'Basic',
          price: '29',
          features: [], // Empty features array
          cta: { label: 'Choose Plan', href: '/pricing' }
        }
      ]
    };
    
    expect(() => validateSectionProps('pricing', invalidProps)).toThrow();
  });
});
