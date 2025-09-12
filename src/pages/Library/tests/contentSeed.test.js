// Unit tests for content seeding functionality
import { describe, it, expect } from 'vitest';
import { generateContentSeed } from '../generator/contentSeed.js';

describe('contentSeed', () => {
  describe('generateContentSeed', () => {
    it('should generate content for all required sections', () => {
      const input = {
        brandDescription: 'Test Company',
        industry: 'technology',
        targetAudience: 'businesses',
        tone: 'corporate'
      };
      
      const result = generateContentSeed(input);
      
      expect(result).toHaveProperty('brand');
      expect(result).toHaveProperty('sections');
      expect(result.brand).toHaveProperty('name');
      expect(result.brand).toHaveProperty('industry');
      expect(result.brand).toHaveProperty('targetAudience');
      expect(result.brand).toHaveProperty('tone');
    });

    it('should generate coherent brand information', () => {
      const input = {
        brandDescription: 'AI-powered analytics platform',
        industry: 'technology',
        targetAudience: 'data scientists',
        tone: 'corporate'
      };
      
      const result = generateContentSeed(input);
      
      expect(result.brand.name).toContain('Solutions');
      expect(result.brand.industry).toBe('technology');
      expect(result.brand.targetAudience).toBe('data scientists');
      expect(result.brand.tone).toBe('corporate');
    });

    it('should generate all required sections', () => {
      const input = {
        brandDescription: 'Test Company',
        industry: 'technology',
        targetAudience: 'businesses',
        tone: 'corporate'
      };
      
      const result = generateContentSeed(input);
      const sectionIds = result.sections.map(s => s.id);
      
      const requiredSections = [
        'navbar', 'hero', 'socialProof', 'features', 
        'featureSpotlight', 'testimonials', 'metrics', 
        'pricing', 'faq', 'finalCta', 'footer'
      ];
      
      requiredSections.forEach(section => {
        expect(sectionIds).toContain(section);
      });
    });

    it('should generate appropriate content for different tones', () => {
      const corporateInput = {
        brandDescription: 'Test Company',
        industry: 'technology',
        targetAudience: 'businesses',
        tone: 'corporate'
      };
      
      const luxuryInput = {
        brandDescription: 'Test Company',
        industry: 'technology',
        targetAudience: 'businesses',
        tone: 'luxury'
      };
      
      const corporateResult = generateContentSeed(corporateInput);
      const luxuryResult = generateContentSeed(luxuryInput);
      
      expect(corporateResult.brand.tone).toBe('corporate');
      expect(luxuryResult.brand.tone).toBe('luxury');
      
      // Content should be different based on tone
      expect(corporateResult.sections[1].props.headline).not.toBe(
        luxuryResult.sections[1].props.headline
      );
    });

    it('should generate appropriate content for different industries', () => {
      const techInput = {
        brandDescription: 'Test Company',
        industry: 'technology',
        targetAudience: 'businesses',
        tone: 'corporate'
      };
      
      const healthcareInput = {
        brandDescription: 'Test Company',
        industry: 'healthcare',
        targetAudience: 'businesses',
        tone: 'corporate'
      };
      
      const techResult = generateContentSeed(techInput);
      const healthcareResult = generateContentSeed(healthcareInput);
      
      expect(techResult.brand.industry).toBe('technology');
      expect(healthcareResult.brand.industry).toBe('healthcare');
    });

    it('should generate valid props for each section', () => {
      const input = {
        brandDescription: 'Test Company',
        industry: 'technology',
        targetAudience: 'businesses',
        tone: 'corporate'
      };
      
      const result = generateContentSeed(input);
      
      result.sections.forEach(section => {
        expect(section).toHaveProperty('id');
        expect(section).toHaveProperty('variant');
        expect(section).toHaveProperty('props');
        expect(section.variant).toBe(1);
        expect(typeof section.props).toBe('object');
      });
    });

    it('should generate appropriate array lengths for sections', () => {
      const input = {
        brandDescription: 'Test Company',
        industry: 'technology',
        targetAudience: 'businesses',
        tone: 'corporate'
      };
      
      const result = generateContentSeed(input);
      
      // Check features section
      const featuresSection = result.sections.find(s => s.id === 'features');
      expect(featuresSection.props.items.length).toBeGreaterThanOrEqual(3);
      expect(featuresSection.props.items.length).toBeLessThanOrEqual(6);
      
      // Check testimonials section
      const testimonialsSection = result.sections.find(s => s.id === 'testimonials');
      expect(testimonialsSection.props.items.length).toBeGreaterThanOrEqual(2);
      expect(testimonialsSection.props.items.length).toBeLessThanOrEqual(4);
      
      // Check FAQ section
      const faqSection = result.sections.find(s => s.id === 'faq');
      expect(faqSection.props.items.length).toBeGreaterThanOrEqual(4);
      expect(faqSection.props.items.length).toBeLessThanOrEqual(8);
    });

    it('should handle missing optional parameters', () => {
      const minimalInput = {
        brandDescription: 'Test Company'
      };
      
      const result = generateContentSeed(minimalInput);
      
      expect(result).toHaveProperty('brand');
      expect(result).toHaveProperty('sections');
      expect(result.brand.name).toBeDefined();
      expect(result.sections.length).toBeGreaterThan(0);
    });
  });
});
