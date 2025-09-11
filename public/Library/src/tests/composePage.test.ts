import { describe, it, expect, beforeEach } from 'vitest';
import { 
  composePage, 
  validatePageConfig, 
  isPageComplete,
  getRegistryStatus,
  registerComponent 
} from '../generator/composePage';
import { buildDefaultConfig, buildRandomizedConfig } from '../generator/builders';
import { PageConfig, BrandInfo, SectionID } from '../types/landing';

// Mock components for testing
const MockComponent = ({ children, ...props }: any) => 
  React.createElement('div', { 'data-testid': 'mock-component', ...props }, children);

// Register mock components for testing
beforeEach(() => {
  // Clear any existing registrations
  const sections: SectionID[] = [
    'navbar', 'hero', 'socialProof', 'features', 'featureSpotlight',
    'testimonials', 'metrics', 'pricing', 'faq', 'finalCta', 'footer'
  ];
  
  sections.forEach(sectionId => {
    for (let i = 1; i <= 7; i++) {
      registerComponent(sectionId, i, MockComponent);
    }
  });
});

describe('composePage', () => {
  it('should compose a complete page with valid config', () => {
    const brand: BrandInfo = {
      name: 'Test Company',
      tagline: 'Test tagline'
    };
    
    const config = buildDefaultConfig(brand);
    const result = composePage(config);
    
    expect(result).toBeDefined();
    expect(result.type).toBe('div');
    expect(result.props.className).toBe('landing-page');
  });
  
  it('should throw error for missing required sections', () => {
    const config: PageConfig = {
      brand: { name: 'Test Company' },
      sections: [
        { id: 'navbar', variant: 1, props: { links: [] } },
        { id: 'hero', variant: 1, props: { headline: 'Test', primaryCta: { label: 'Test', href: '#' } } }
        // Missing other required sections
      ]
    };
    
    expect(() => composePage(config)).toThrow('Missing required section');
  });
  
  it('should throw error for invalid variant numbers', () => {
    const brand: BrandInfo = { name: 'Test Company' };
    const config = buildDefaultConfig(brand);
    
    // Set an invalid variant
    config.sections[0].variant = 999;
    
    expect(() => composePage(config)).toThrow('Invalid variant');
  });
  
  it('should throw error for duplicate sections', () => {
    const config: PageConfig = {
      brand: { name: 'Test Company' },
      sections: [
        { id: 'navbar', variant: 1, props: { links: [] } },
        { id: 'navbar', variant: 2, props: { links: [] } }, // Duplicate
        { id: 'hero', variant: 1, props: { headline: 'Test', primaryCta: { label: 'Test', href: '#' } } }
        // ... other sections would be needed for complete test
      ]
    };
    
    expect(() => composePage(config)).toThrow('Duplicate sections found');
  });
});

describe('validatePageConfig', () => {
  it('should validate a complete and correct config', () => {
    const brand: BrandInfo = { name: 'Test Company' };
    const config = buildDefaultConfig(brand);
    
    expect(() => validatePageConfig(config)).not.toThrow();
  });
  
  it('should throw error for missing brand name', () => {
    const config: PageConfig = {
      brand: { name: '' }, // Empty name
      sections: []
    };
    
    expect(() => validatePageConfig(config)).toThrow('brand with a name');
  });
  
  it('should throw error for non-array sections', () => {
    const config = {
      brand: { name: 'Test Company' },
      sections: 'not an array'
    } as any;
    
    expect(() => validatePageConfig(config)).toThrow('sections array');
  });
});

describe('isPageComplete', () => {
  it('should return true for complete page', () => {
    const brand: BrandInfo = { name: 'Test Company' };
    const config = buildDefaultConfig(brand);
    
    const result = isPageComplete(config);
    expect(result.isComplete).toBe(true);
    expect(result.missingSections).toHaveLength(0);
  });
  
  it('should return false for incomplete page', () => {
    const config: PageConfig = {
      brand: { name: 'Test Company' },
      sections: [
        { id: 'navbar', variant: 1, props: { links: [] } }
        // Missing other sections
      ]
    };
    
    const result = isPageComplete(config);
    expect(result.isComplete).toBe(false);
    expect(result.missingSections.length).toBeGreaterThan(0);
  });
});

describe('getRegistryStatus', () => {
  it('should return registry status for all sections', () => {
    const status = getRegistryStatus();
    
    expect(status).toBeDefined();
    expect(Object.keys(status)).toHaveLength(11); // All required sections
    
    // Check that each section has expected structure
    Object.values(status).forEach(sectionStatus => {
      expect(sectionStatus).toHaveProperty('registered');
      expect(sectionStatus).toHaveProperty('expected');
      expect(typeof sectionStatus.registered).toBe('number');
      expect(typeof sectionStatus.expected).toBe('number');
    });
  });
});

describe('buildDefaultConfig', () => {
  it('should build a complete default configuration', () => {
    const brand: BrandInfo = { name: 'Test Company' };
    const config = buildDefaultConfig(brand);
    
    expect(config.brand.name).toBe('Test Company');
    expect(config.sections).toHaveLength(11); // All required sections
    expect(config.sections.every(s => s.variant >= 1)).toBe(true);
  });
  
  it('should merge provided brand info with defaults', () => {
    const brand: BrandInfo = {
      name: 'Custom Company',
      tagline: 'Custom tagline',
      industry: 'technology'
    };
    
    const config = buildDefaultConfig(brand);
    
    expect(config.brand.name).toBe('Custom Company');
    expect(config.brand.tagline).toBe('Custom tagline');
    expect(config.brand.industry).toBe('technology');
  });
});

describe('buildRandomizedConfig', () => {
  it('should build a randomized configuration with different variants', () => {
    const brand: BrandInfo = { name: 'Test Company' };
    const config1 = buildRandomizedConfig(brand, 12345);
    const config2 = buildRandomizedConfig(brand, 67890);
    
    // Should have different variants (very likely with different seeds)
    const variants1 = config1.sections.map(s => s.variant);
    const variants2 = config2.sections.map(s => s.variant);
    
    expect(variants1).not.toEqual(variants2);
  });
  
  it('should produce deterministic results with same seed', () => {
    const brand: BrandInfo = { name: 'Test Company' };
    const config1 = buildRandomizedConfig(brand, 12345);
    const config2 = buildRandomizedConfig(brand, 12345);
    
    expect(config1.sections.map(s => s.variant)).toEqual(config2.sections.map(s => s.variant));
  });
  
  it('should maintain valid variant numbers', () => {
    const brand: BrandInfo = { name: 'Test Company' };
    const config = buildRandomizedConfig(brand);
    
    config.sections.forEach(section => {
      expect(section.variant).toBeGreaterThanOrEqual(1);
      expect(section.variant).toBeLessThanOrEqual(7); // Max variants
    });
  });
});
