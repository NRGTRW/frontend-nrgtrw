import { describe, it, expect } from 'vitest';
import { buildRandomizedConfig } from '../generator/builders';
import { Mulberry32 } from '../generator/prng';

describe('Builders Fairness Tests', () => {
  it('should have uniform distribution across variants for large sample', () => {
    const brand = { name: 'Test Company' };
    const sampleSize = 1000;
    const variantCounts: Record<string, Record<number, number>> = {};
    
    // Initialize variant counts
    const sectionIds = [
      'navbar', 'hero', 'socialProof', 'features', 'featureSpotlight',
      'testimonials', 'metrics', 'pricing', 'faq', 'finalCta', 'footer'
    ];
    
    sectionIds.forEach(sectionId => {
      variantCounts[sectionId] = {};
      for (let i = 1; i <= 7; i++) {
        variantCounts[sectionId][i] = 0;
      }
    });
    
    // Generate many random configurations
    for (let i = 0; i < sampleSize; i++) {
      const config = buildRandomizedConfig(brand, i);
      
      config.sections.forEach(section => {
        variantCounts[section.id][section.variant]++;
      });
    }
    
    // Check distribution for each section
    sectionIds.forEach(sectionId => {
      const counts = variantCounts[sectionId];
      const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
      const expectedPerVariant = total / 7;
      const tolerance = expectedPerVariant * 0.2; // 20% tolerance
      
      for (let variant = 1; variant <= 7; variant++) {
        const actual = counts[variant];
        expect(actual).toBeGreaterThan(expectedPerVariant - tolerance);
        expect(actual).toBeLessThan(expectedPerVariant + tolerance);
      }
    });
  });

  it('should have good distribution across different seeds', () => {
    const brand = { name: 'Test Company' };
    const seeds = Array.from({ length: 100 }, (_, i) => i * 1000);
    const variantCounts: Record<number, number> = {};
    
    // Initialize counts
    for (let i = 1; i <= 7; i++) {
      variantCounts[i] = 0;
    }
    
    // Generate configs with different seeds
    seeds.forEach(seed => {
      const config = buildRandomizedConfig(brand, seed);
      const heroSection = config.sections.find(s => s.id === 'hero');
      if (heroSection) {
        variantCounts[heroSection.variant]++;
      }
    });
    
    // Check that all variants appear
    for (let variant = 1; variant <= 7; variant++) {
      expect(variantCounts[variant]).toBeGreaterThan(0);
    }
    
    // Check distribution is reasonable (not all same variant)
    const maxCount = Math.max(...Object.values(variantCounts));
    const minCount = Math.min(...Object.values(variantCounts));
    expect(maxCount - minCount).toBeLessThan(seeds.length * 0.5); // No variant should dominate
  });

  it('should produce different results for consecutive seeds', () => {
    const brand = { name: 'Test Company' };
    const configs: any[] = [];
    
    // Generate 10 consecutive configs
    for (let i = 0; i < 10; i++) {
      const config = buildRandomizedConfig(brand, i);
      configs.push(config.sections.map(s => ({ id: s.id, variant: s.variant })));
    }
    
    // Check that consecutive configs are different
    for (let i = 0; i < configs.length - 1; i++) {
      expect(configs[i]).not.toEqual(configs[i + 1]);
    }
  });

  it('should have good entropy in variant selection', () => {
    const brand = { name: 'Test Company' };
    const sampleSize = 100;
    const variantSequences: number[][] = [];
    
    // Generate sequences of variants for each section
    for (let i = 0; i < sampleSize; i++) {
      const config = buildRandomizedConfig(brand, i);
      const heroSection = config.sections.find(s => s.id === 'hero');
      if (heroSection) {
        variantSequences.push([heroSection.variant]);
      }
    }
    
    // Check for patterns (should not be too predictable)
    let consecutiveSame = 0;
    let maxConsecutive = 0;
    
    for (let i = 1; i < variantSequences.length; i++) {
      if (variantSequences[i][0] === variantSequences[i - 1][0]) {
        consecutiveSame++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveSame);
      } else {
        consecutiveSame = 0;
      }
    }
    
    // Should not have too many consecutive same variants
    expect(maxConsecutive).toBeLessThan(5);
  });

  it('should maintain consistency with PRNG implementation', () => {
    const brand = { name: 'Test Company' };
    const seed = 12345;
    
    // Generate config using builders
    const config = buildRandomizedConfig(brand, seed);
    
    // Generate same config using direct PRNG
    const rng = new Mulberry32(seed);
    const expectedVariants = config.sections.map(section => {
      return rng.nextInt(7) + 1; // 1-7 range
    });
    
    const actualVariants = config.sections.map(section => section.variant);
    
    // Should match (since we're using the same PRNG)
    expect(actualVariants).toEqual(expectedVariants);
  });

  it('should handle edge case seeds correctly', () => {
    const brand = { name: 'Test Company' };
    const edgeSeeds = [0, 1, -1, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
    
    edgeSeeds.forEach(seed => {
      expect(() => {
        const config = buildRandomizedConfig(brand, seed);
        
        // Should still produce valid config
        expect(config.brand).toBeDefined();
        expect(config.sections).toBeDefined();
        expect(Array.isArray(config.sections)).toBe(true);
        
        // All variants should be in valid range
        config.sections.forEach(section => {
          expect(section.variant).toBeGreaterThanOrEqual(1);
          expect(section.variant).toBeLessThanOrEqual(7);
        });
      }).not.toThrow();
    });
  });
});
