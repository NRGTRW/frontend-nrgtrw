import { describe, it, expect } from 'vitest';
import { extract } from '../ai/nlu/extract';

describe('extract() - Natural Language Understanding', () => {
  it('should extract industry from common phrases', () => {
    const testCases = [
      { speech: 'We are a tech startup building AI tools', expected: 'technology' },
      { speech: 'A medical practice management system', expected: 'healthcare' },
      { speech: 'Financial services platform for investment', expected: 'finance' },
      { speech: 'Online learning platform for students', expected: 'education' },
      { speech: 'E-commerce store selling products', expected: 'ecommerce' },
      { speech: 'Boutique gym for busy professionals', expected: 'fitness' },
      { speech: 'Real estate property management', expected: 'realEstate' },
      { speech: 'Restaurant delivery service', expected: 'food' },
      { speech: 'Travel booking platform', expected: 'travel' },
      { speech: 'Business consulting services', expected: 'consulting' }
    ];
    
    testCases.forEach(({ speech, expected }) => {
      const result = extract(speech);
      expect(result.industry).toBe(expected);
    });
  });

  it('should extract tone from descriptive words', () => {
    const testCases = [
      { speech: 'A luxury premium service for elite clients', expected: 'luxury' },
      { speech: 'A fun creative tool for playful users', expected: 'playful' },
      { speech: 'A simple minimal solution for clean design', expected: 'minimal' },
      { speech: 'A bold revolutionary breakthrough technology', expected: 'bold' },
      { speech: 'A professional corporate business solution', expected: 'corporate' }
    ];
    
    testCases.forEach(({ speech, expected }) => {
      const result = extract(speech);
      expect(result.tone).toBe(expected);
    });
  });

  it('should extract audience from target descriptions', () => {
    const testCases = [
      { speech: 'Tools for developers and programmers', expected: 'developers' },
      { speech: 'B2B solution for businesses', expected: 'businesses' },
      { speech: 'Consumer app for individual users', expected: 'consumers' },
      { speech: 'Platform for healthcare professionals', expected: 'healthcare professionals' },
      { speech: 'Service for small businesses and startups', expected: 'small businesses' }
    ];
    
    testCases.forEach(({ speech, expected }) => {
      const result = extract(speech);
      expect(result.audience).toBe(expected);
    });
  });

  it('should extract goals from action words', () => {
    const testCases = [
      { speech: 'Generate leads and signups', expected: 'generate leads' },
      { speech: 'Drive sales and conversions', expected: 'drive sales' },
      { speech: 'Build brand awareness', expected: 'build awareness' },
      { speech: 'Educate users with tutorials', expected: 'educate users' },
      { speech: 'Showcase our portfolio work', expected: 'showcase work' },
      { speech: 'Build a community', expected: 'build community' }
    ];
    
    testCases.forEach(({ speech, expected }) => {
      const result = extract(speech);
      expect(result.goal).toBe(expected);
    });
  });

  it('should extract required sections from mentions', () => {
    const testCases = [
      { 
        speech: 'I need hero, pricing with 3 tiers, and FAQ', 
        expected: ['hero', 'pricing', 'faq'] 
      },
      { 
        speech: 'Include testimonials and contact section', 
        expected: ['testimonials', 'contact'] 
      },
      { 
        speech: 'Show features and about us', 
        expected: ['features', 'about'] 
      },
      { 
        speech: 'Need portfolio and blog sections', 
        expected: ['portfolio', 'blog'] 
      }
    ];
    
    testCases.forEach(({ speech, expected }) => {
      const result = extract(speech);
      expect(result.requiredSections).toEqual(expect.arrayContaining(expected));
    });
  });

  it('should extract forbidden sections from negative phrases', () => {
    const testCases = [
      { 
        speech: 'No pricing or contact section needed', 
        expected: ['pricing', 'contact'] 
      },
      { 
        speech: 'Skip the about and blog sections', 
        expected: ['about', 'blog'] 
      },
      { 
        speech: 'Don\'t need team or portfolio', 
        expected: ['team', 'portfolio'] 
      }
    ];
    
    testCases.forEach(({ speech, expected }) => {
      const result = extract(speech);
      expect(result.forbiddenSections).toEqual(expect.arrayContaining(expected));
    });
  });

  it('should extract brand words from company descriptions', () => {
    const testCases = [
      { 
        speech: 'We are TechCorp building AI solutions', 
        expected: ['TechCorp', 'building', 'AI', 'solutions'] 
      },
      { 
        speech: 'My company HealthTech provides medical software', 
        expected: ['My', 'company', 'HealthTech', 'provides'] 
      },
      { 
        speech: 'StartupXYZ is a fintech platform', 
        expected: ['StartupXYZ', 'fintech', 'platform'] 
      }
    ];
    
    testCases.forEach(({ speech, expected }) => {
      const result = extract(speech);
      expect(result.brandWords).toEqual(expect.arrayContaining(expected));
    });
  });

  it('should handle complex multi-aspect descriptions', () => {
    const speech = 'We are TechCorp, a luxury SaaS platform for developers. We need hero, pricing with 3 tiers, testimonials, and FAQ. Our goal is to generate leads and build awareness. Skip the about section.';
    
    const result = extract(speech);
    
    expect(result.industry).toBe('technology');
    expect(result.tone).toBe('luxury');
    expect(result.audience).toBe('developers');
    expect(result.goal).toBe('generate leads');
    expect(result.requiredSections).toEqual(expect.arrayContaining(['hero', 'pricing', 'testimonials', 'faq']));
    expect(result.forbiddenSections).toEqual(expect.arrayContaining(['about']));
    expect(result.brandWords).toEqual(expect.arrayContaining(['TechCorp']));
  });

  it('should handle edge cases gracefully', () => {
    const edgeCases = [
      '', // Empty string
      'a', // Single character
      'We are a very long description with many words that should still work correctly and extract meaningful information from the text',
      'Special characters: !@#$%^&*()_+-=[]{}|;:,.<>?',
      'Numbers and 123 and symbols @#$'
    ];
    
    edgeCases.forEach(speech => {
      expect(() => {
        const result = extract(speech);
        expect(result).toBeDefined();
        expect(result.requiredSections).toBeInstanceOf(Array);
        expect(result.forbiddenSections).toBeInstanceOf(Array);
        expect(result.brandWords).toBeInstanceOf(Array);
      }).not.toThrow();
    });
  });

  it('should extract numeric section requirements', () => {
    const testCases = [
      { 
        speech: 'I need 3 pricing tiers and 5 features', 
        expected: ['pricing', 'features'] 
      },
      { 
        speech: 'Include 2 testimonials and 4 FAQs', 
        expected: ['testimonials', 'faq'] 
      }
    ];
    
    testCases.forEach(({ speech, expected }) => {
      const result = extract(speech);
      expect(result.requiredSections).toEqual(expect.arrayContaining(expected));
    });
  });
});
