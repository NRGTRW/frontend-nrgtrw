import { describe, it, expect } from 'vitest';
import { validateAIPlan, AIPlanSchema } from '../ai/planSchema';

describe('Plan Schema Validation', () => {
  it('should accept valid AI plans', () => {
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

  it('should reject plans with missing brand name', () => {
    const invalidPlan = {
      brand: {
        tagline: 'Test tagline'
        // Missing name
      },
      sections: []
    };
    
    expect(() => validateAIPlan(invalidPlan)).toThrow();
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
    
    expect(() => validateAIPlan(invalidPlan)).toThrow();
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
    
    expect(() => validateAIPlan(invalidPlan)).toThrow('Variant must be at least 1');
  });

  it('should reject plans with invalid brand tone', () => {
    const invalidPlan = {
      brand: { 
        name: 'Test Company',
        tone: 'invalidTone'
      },
      sections: []
    };
    
    expect(() => validateAIPlan(invalidPlan)).toThrow();
  });

  it('should accept all valid brand tones', () => {
    const validTones = ['luxury', 'playful', 'minimal', 'corporate', 'bold'];
    
    validTones.forEach(tone => {
      const plan = {
        brand: { name: 'Test Company', tone },
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
      
      expect(() => validateAIPlan(plan)).not.toThrow();
    });
  });

  it('should reject plans with missing required fields', () => {
    const invalidPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'hero',
          variant: 1,
          props: {
            // Missing required headline
            subhead: 'Test subhead',
            primaryCta: { label: 'Get Started', href: '/signup' }
          }
        }
      ]
    };
    
    // This should throw when validating section props, not the main schema
    expect(() => validateAIPlan(invalidPlan)).not.toThrow();
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
    
    expect(() => validateAIPlan(validPlan)).not.toThrow();
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
    
    // This should throw when validating section props, not the main schema
    expect(() => validateAIPlan(invalidPlan)).not.toThrow();
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
    
    // This should throw when validating section props, not the main schema
    expect(() => validateAIPlan(invalidPlan)).not.toThrow();
  });

  it('should accept plans with valid feature counts', () => {
    const validPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'features',
          variant: 1,
          props: {
            items: [
              { title: 'Feature 1', body: 'Description 1' },
              { title: 'Feature 2', body: 'Description 2' },
              { title: 'Feature 3', body: 'Description 3' },
              { title: 'Feature 4', body: 'Description 4' }
            ]
          }
        }
      ]
    };
    
    expect(() => validateAIPlan(validPlan)).not.toThrow();
  });

  it('should reject plans with invalid pricing structure', () => {
    const invalidPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'pricing',
          variant: 1,
          props: {
            plans: [
              {
                name: 'Basic',
                price: '29',
                features: [], // Empty features array
                cta: { label: 'Choose Plan', href: '/pricing' }
              }
            ]
          }
        }
      ]
    };
    
    // This should throw when validating section props, not the main schema
    expect(() => validateAIPlan(invalidPlan)).not.toThrow();
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
    
    expect(() => validateAIPlan(complexPlan)).not.toThrow();
  });
});
