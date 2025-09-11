import { describe, it, expect } from 'vitest';
import { parseModelPlan } from '../ai/schema/plan.zod';

describe('parseModelPlan - Schema Validation', () => {
  it('should accept valid model plans', () => {
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
    
    expect(() => parseModelPlan(validPlan)).not.toThrow();
  });

  it('should reject plans with missing brand name', () => {
    const invalidPlan = {
      brand: {
        tagline: 'Test tagline'
        // Missing name
      },
      sections: []
    };
    
    expect(() => parseModelPlan(invalidPlan)).toThrow('Brand name is required');
  });

  it('should reject plans with invalid section IDs', () => {
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
    
    expect(() => parseModelPlan(invalidPlan)).toThrow();
  });

  it('should reject plans with invalid variant numbers', () => {
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
    
    expect(() => parseModelPlan(invalidPlan)).toThrow('Variant must be at least 1');
  });

  it('should reject plans with invalid brand tone', () => {
    const invalidPlan = {
      brand: { 
        name: 'Test Company',
        tone: 'invalidTone'
      },
      sections: []
    };
    
    expect(() => parseModelPlan(invalidPlan)).toThrow();
  });

  it('should reject plans with dangerous URLs', () => {
    const invalidPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'navbar',
          variant: 1,
          props: {
            links: [
              { label: 'Home', href: 'javascript:alert("xss")' }, // Dangerous URL
              { label: 'About', href: '/about' }
            ]
          }
        }
      ]
    };
    
    expect(() => parseModelPlan(invalidPlan)).toThrow('Invalid URL format');
  });

  it('should accept plans with valid URL formats', () => {
    const validPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'navbar',
          variant: 1,
          props: {
            links: [
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'External', href: 'https://example.com', external: true }
            ]
          }
        }
      ]
    };
    
    expect(() => parseModelPlan(validPlan)).not.toThrow();
  });

  it('should reject plans with too few features', () => {
    const invalidPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'features',
          variant: 1,
          props: {
            items: [
              { title: 'Feature 1', body: 'Description 1' }
              // Only 1 feature, minimum is 3
            ]
          }
        }
      ]
    };
    
    expect(() => parseModelPlan(invalidPlan)).toThrow('At least 3 features are required');
  });

  it('should reject plans with too many features', () => {
    const invalidPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'features',
          variant: 1,
          props: {
            items: Array.from({ length: 10 }, (_, i) => ({
              title: `Feature ${i + 1}`,
              body: `Description ${i + 1}`
            }))
            // 10 features, maximum is 6
          }
        }
      ]
    };
    
    expect(() => parseModelPlan(invalidPlan)).toThrow('Maximum 6 features allowed');
  });

  it('should handle complex nested structures', () => {
    const complexPlan = {
      brand: {
        name: 'Complex Company',
        tagline: 'Complex tagline',
        industry: 'technology',
        targetAudience: 'developers',
        tone: 'corporate',
        logoUrl: 'https://example.com/logo.png',
        primaryColor: '#0066cc'
      },
      sections: [
        {
          id: 'hero',
          variant: 3,
          props: {
            headline: 'Complex Headline',
            subhead: 'Complex subheadline with detailed information',
            primaryCta: { label: 'Primary Action', href: '/primary' },
            secondaryCta: { label: 'Secondary Action', href: '/secondary' },
            media: {
              kind: 'image',
              src: 'https://example.com/hero-image.jpg',
              alt: 'Complex hero image'
            }
          }
        },
        {
          id: 'featureSpotlight',
          variant: 2,
          props: {
            blocks: [
              {
                headline: 'Complex Feature',
                body: 'Detailed description of the complex feature with multiple benefits',
                media: {
                  kind: 'video',
                  src: 'https://example.com/feature-video.mp4',
                  alt: 'Feature demonstration video'
                },
                cta: { label: 'Learn More', href: '/feature' },
                mediaSide: 'right'
              }
            ]
          }
        }
      ]
    };
    
    expect(() => parseModelPlan(complexPlan)).not.toThrow();
  });
});
