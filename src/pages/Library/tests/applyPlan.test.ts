import { describe, it, expect } from 'vitest';
import { applyAIPlan, AIPlanError } from '../ai/applyPlan';
import { buildDefaultConfig } from '../generator/builders';
import { BrandInfo } from '../types/landing';

describe('Apply Plan Tests', () => {
  it('should apply valid AI plan successfully', () => {
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
    expect(result.sections.length).toBe(11); // All required sections
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
    
    expect(result.sections.length).toBe(11); // All required sections added
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
    
    expect(() => applyAIPlan(invalidPlan)).toThrow(AIPlanError);
  });

  it('should apply array length guardrails', () => {
    const aiPlan = {
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
            // 10 features, should be trimmed to 6
          }
        }
      ]
    };
    
    const result = applyAIPlan(aiPlan);
    const featuresSection = result.sections.find(s => s.id === 'features');
    
    expect(featuresSection).toBeDefined();
    if (featuresSection && 'items' in featuresSection.props) {
      const items = (featuresSection.props as any).items;
      expect(items.length).toBeLessThanOrEqual(6);
    }
  });

  it('should sanitize HTML from strings', () => {
    const aiPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'hero',
          variant: 1,
          props: {
            headline: '<script>alert("xss")</script>Clean Headline',
            subhead: 'Normal subheadline',
            primaryCta: { label: 'Get Started', href: '/signup' }
          }
        }
      ]
    };
    
    const result = applyAIPlan(aiPlan);
    const heroSection = result.sections.find(s => s.id === 'hero');
    
    expect(heroSection).toBeDefined();
    if (heroSection && 'headline' in heroSection.props) {
      const headline = (heroSection.props as any).headline;
      // The sanitization should have removed HTML tags
      expect(headline).not.toContain('<script>');
      expect(headline).not.toContain('</script>');
      expect(headline).toContain('Clean Headline');
    }
  });

  it('should validate and sanitize URLs', () => {
    const aiPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'navbar',
          variant: 1,
          props: {
            links: [
              { label: 'Home', href: '/' },
              { label: 'External', href: 'https://example.com' },
              { label: 'Invalid', href: 'javascript:alert("xss")' }
            ]
          }
        }
      ]
    };
    
    const result = applyAIPlan(aiPlan);
    const navbarSection = result.sections.find(s => s.id === 'navbar');
    
    expect(navbarSection).toBeDefined();
    if (navbarSection && 'links' in navbarSection.props) {
      const links = (navbarSection.props as any).links;
      expect(links[0].href).toBe('/'); // Valid relative URL
      expect(links[1].href).toBe('https://example.com'); // Valid absolute URL
      expect(links[2].href).toBe('#'); // Invalid URL replaced with placeholder
    }
  });

  it('should handle missing required props gracefully', () => {
    const aiPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'hero',
          variant: 1,
          props: {
            // Missing required headline and primaryCta
            subhead: 'Test subhead'
          }
        }
      ]
    };
    
    // Should not throw, but use defaults
    const result = applyAIPlan(aiPlan);
    const heroSection = result.sections.find(s => s.id === 'hero');
    
    expect(heroSection).toBeDefined();
    // Should have default props applied
    expect(heroSection?.props).toBeDefined();
  });

  it('should remove duplicate sections', () => {
    const aiPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'navbar',
          variant: 1,
          props: {
            links: [{ label: 'Home', href: '/' }]
          }
        },
        {
          id: 'navbar', // Duplicate
          variant: 2,
          props: {
            links: [{ label: 'About', href: '/about' }]
          }
        }
      ]
    };
    
    const result = applyAIPlan(aiPlan);
    const navbarSections = result.sections.filter(s => s.id === 'navbar');
    
    expect(navbarSections.length).toBe(1); // Only one navbar section
  });

  it('should preserve valid external links', () => {
    const aiPlan = {
      brand: { name: 'Test Company' },
      sections: [
        {
          id: 'footer',
          variant: 1,
          props: {
            columns: [
              {
                title: 'Social',
                links: [
                  { label: 'Twitter', href: 'https://twitter.com/company', external: true },
                  { label: 'LinkedIn', href: 'https://linkedin.com/company/company', external: true }
                ]
              }
            ]
          }
        }
      ]
    };
    
    const result = applyAIPlan(aiPlan);
    const footerSection = result.sections.find(s => s.id === 'footer');
    
    expect(footerSection).toBeDefined();
    if (footerSection && 'columns' in footerSection.props) {
      const columns = (footerSection.props as any).columns;
      expect(columns[0].links[0].href).toBe('https://twitter.com/company');
      expect(columns[0].links[0].external).toBe(true);
    }
  });
});
