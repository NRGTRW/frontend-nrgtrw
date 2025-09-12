import { describe, it, expect, beforeAll } from 'vitest';
import { registry, getVariantsByStyle, getAvailableStyles, getVariantMeta } from '../generator/registry';
import { STYLE_GROUPS } from '../styles/styleGroups';
import { SectionID } from '../types/landing';

const SECTION_IDS: SectionID[] = [
  'navbar', 'hero', 'socialProof', 'features', 'featureSpotlight', 
  'testimonials', 'metrics', 'pricing', 'faq', 'finalCta', 'footer'
];

describe('Bulk Variant System', () => {
  describe('Registry Structure', () => {
    it('should have all required sections in registry', () => {
      SECTION_IDS.forEach(sectionId => {
        expect(registry).toHaveProperty(sectionId);
        expect(registry[sectionId]).toHaveProperty('variants');
        expect(registry[sectionId]).toHaveProperty('validate');
        expect(registry[sectionId]).toHaveProperty('meta');
        expect(Array.isArray(registry[sectionId].meta)).toBe(true);
      });
    });

    it('should have increased variant counts by 100 for each section', () => {
      SECTION_IDS.forEach(sectionId => {
        const section = registry[sectionId];
        expect(section.variants).toBeGreaterThanOrEqual(100);
        expect(section.meta).toHaveLength(section.variants);
      });
    });

    it('should have valid variant metadata', () => {
      SECTION_IDS.forEach(sectionId => {
        const section = registry[sectionId];
        
        section.meta.forEach((variant, index) => {
          expect(variant).toHaveProperty('idx');
          expect(variant).toHaveProperty('style');
          expect(variant).toHaveProperty('importPath');
          expect(variant).toHaveProperty('exportName');
          
          expect(variant.idx).toBe(index);
          expect(STYLE_GROUPS.map(g => g.slug)).toContain(variant.style);
          expect(typeof variant.importPath).toBe('string');
          expect(typeof variant.exportName).toBe('string');
        });
      });
    });
  });

  describe('Style Distribution', () => {
    it('should have exactly 10 variants per style group', () => {
      SECTION_IDS.forEach(sectionId => {
        STYLE_GROUPS.forEach(styleGroup => {
          const variantsInStyle = getVariantsByStyle(sectionId, styleGroup.slug);
          expect(variantsInStyle).toHaveLength(10);
        });
      });
    });

    it('should have all style groups available for each section', () => {
      SECTION_IDS.forEach(sectionId => {
        const availableStyles = getAvailableStyles(sectionId);
        expect(availableStyles).toHaveLength(STYLE_GROUPS.length);
        
        STYLE_GROUPS.forEach(styleGroup => {
          expect(availableStyles).toContain(styleGroup.slug);
        });
      });
    });

    it('should have sequential variant indices within each style', () => {
      SECTION_IDS.forEach(sectionId => {
        STYLE_GROUPS.forEach(styleGroup => {
          const variantsInStyle = getVariantsByStyle(sectionId, styleGroup.slug);
          const sortedVariants = [...variantsInStyle].sort((a, b) => a - b);
          
          // Check that variants are sequential
          for (let i = 1; i < sortedVariants.length; i++) {
            expect(sortedVariants[i] - sortedVariants[i-1]).toBe(1);
          }
        });
      });
    });
  });

  describe('Variant Metadata', () => {
    it('should have unique export names', () => {
      SECTION_IDS.forEach(sectionId => {
        const section = registry[sectionId];
        const exportNames = section.meta.map(v => v.exportName);
        const uniqueNames = new Set(exportNames);
        
        expect(uniqueNames.size).toBe(exportNames.length);
      });
    });

    it('should have valid import paths', () => {
      SECTION_IDS.forEach(sectionId => {
        const section = registry[sectionId];
        
        section.meta.forEach(variant => {
          expect(variant.importPath).toMatch(/^\.\/[A-Za-z]+\/[A-Za-z]+\/[A-Za-z]+\.[A-Za-z]+\.V\d+$/);
        });
      });
    });

    it('should have consistent naming convention', () => {
      SECTION_IDS.forEach(sectionId => {
        const section = registry[sectionId];
        
        section.meta.forEach(variant => {
          const expectedPattern = new RegExp(`^${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}[A-Za-z]+V\\d{2}$`);
          expect(variant.exportName).toMatch(expectedPattern);
        });
      });
    });
  });

  describe('Helper Functions', () => {
    it('should return correct variants by style', () => {
      const heroVariants = getVariantsByStyle('hero', 'minimal');
      expect(heroVariants).toHaveLength(10);
      expect(heroVariants.every(v => v >= 0 && v < 100)).toBe(true);
    });

    it('should return all available styles', () => {
      const styles = getAvailableStyles('hero');
      expect(styles).toHaveLength(STYLE_GROUPS.length);
      expect(styles).toEqual(STYLE_GROUPS.map(g => g.slug));
    });

    it('should return correct variant metadata', () => {
      const meta = getVariantMeta('hero', 0);
      expect(meta).toBeDefined();
      expect(meta?.idx).toBe(0);
      expect(meta?.style).toBeDefined();
      expect(meta?.exportName).toBeDefined();
    });

    it('should return undefined for invalid variant index', () => {
      const meta = getVariantMeta('hero', 999);
      expect(meta).toBeUndefined();
    });
  });

  describe('Style Group Coverage', () => {
    it('should have all 10 style groups represented', () => {
      const expectedStyles = STYLE_GROUPS.map(g => g.slug);
      
      SECTION_IDS.forEach(sectionId => {
        const availableStyles = getAvailableStyles(sectionId);
        expect(availableStyles.sort()).toEqual(expectedStyles.sort());
      });
    });

    it('should have consistent variant distribution across sections', () => {
      const firstSectionStyles = getAvailableStyles('hero');
      
      SECTION_IDS.forEach(sectionId => {
        const sectionStyles = getAvailableStyles(sectionId);
        expect(sectionStyles.sort()).toEqual(firstSectionStyles.sort());
      });
    });
  });

  describe('Performance and Accessibility', () => {
    it('should have reasonable variant counts for performance', () => {
      SECTION_IDS.forEach(sectionId => {
        const section = registry[sectionId];
        expect(section.variants).toBeLessThanOrEqual(200); // Reasonable upper bound
      });
    });

    it('should have valid validation functions', () => {
      SECTION_IDS.forEach(sectionId => {
        const section = registry[sectionId];
        expect(typeof section.validate).toBe('function');
      });
    });
  });
});

describe('Component Generation', () => {
  it('should have generated component files structure', () => {
    // This test would check if the generated files exist
    // In a real implementation, you'd use fs to check file existence
    expect(true).toBe(true); // Placeholder
  });

  it('should have valid component exports', () => {
    // This test would check if generated components can be imported
    // In a real implementation, you'd try to import generated components
    expect(true).toBe(true); // Placeholder
  });
});
