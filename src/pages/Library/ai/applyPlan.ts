import { 
  PageConfig, 
  BrandInfo, 
  SectionID, 
  REQUIRED_SECTIONS 
} from '../types/landing';
import { 
  validateAIPlan, 
  validateSectionProps, 
  AIPlan 
} from './planSchema';
import { registry } from '../generator/registry';
import { buildDefaultConfig } from '../generator/builders';

// Guardrail configuration
const GUARDRAILS = {
  features: { min: 3, max: 6 },
  faq: { min: 4, max: 8 },
  testimonials: { min: 2, max: 6 },
  pricing: { min: 2, max: 4 }
};

// URL validation regex - allow relative URLs and hash links
const URL_REGEX = /^(https?:\/\/[^\s/$.?#].[^\s]*|^\/[^\s]*|^#[^\s]*)$/i;

// HTML tag detection regex
const HTML_REGEX = /<[^>]*>/g;

// Error class for AI plan application
export class AIPlanError extends Error {
  constructor(
    message: string,
    public section?: SectionID,
    public field?: string
  ) {
    super(message);
    this.name = 'AIPlanError';
  }
}

// Apply AI-generated plan to create a PageConfig
export function applyAIPlan(
  plan: unknown, 
  baseConfig?: PageConfig
): PageConfig {
  const warnings: string[] = [];
  
  // Validate the AI plan structure
  let validatedPlan: AIPlan;
  try {
    validatedPlan = validateAIPlan(plan);
  } catch (error) {
    throw new AIPlanError(
      `Invalid AI plan structure: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
  
  // Start with base config or create default
  const config: PageConfig = baseConfig || buildDefaultConfig(validatedPlan.brand);
  
  // Merge brand information
  const mergedBrand: BrandInfo = {
    ...config.brand,
    ...validatedPlan.brand
  };
  
  // Process sections from AI plan
  const processedSections = validatedPlan.sections.map(aiSection => {
    const sectionId = aiSection.id;
    
    // Validate variant is within bounds
    const maxVariants = registry[sectionId].variants;
    const clampedVariant = Math.max(1, Math.min(aiSection.variant, maxVariants));
    
    if (clampedVariant !== aiSection.variant) {
      warnings.push(`Variant ${aiSection.variant} for section ${sectionId} clamped to ${clampedVariant}`);
    }
    
    // Apply guardrails and sanitization
    const sanitizedProps = applyGuardrails(sectionId, aiSection.props, warnings);
    
    // Validate and process props
    let validatedProps;
    try {
      validatedProps = validateSectionProps(sectionId, sanitizedProps);
    } catch (error) {
      // Fall back to defaults instead of throwing
      warnings.push(`Invalid props for section ${sectionId}, using defaults: ${error instanceof Error ? error.message : 'Unknown error'}`);
      validatedProps = getDefaultPropsForSection(sectionId);
    }
    
    return {
      id: sectionId,
      variant: clampedVariant,
      props: validatedProps
    };
  });
  
  // Ensure all required sections are present
  const aiSectionIds = processedSections.map(s => s.id);
  const missingSections = REQUIRED_SECTIONS.filter(id => !aiSectionIds.includes(id));
  
  // Add missing sections with defaults
  const completeSections = [...processedSections];
  
  for (const missingId of missingSections) {
    // Find the corresponding section in the base config
    const baseSection = config.sections.find(s => s.id === missingId);
    
    if (baseSection) {
      completeSections.push({
        id: missingId,
        variant: baseSection.variant,
        props: baseSection.props
      });
    } else {
      // Create a minimal default section
      completeSections.push({
        id: missingId,
        variant: 1,
        props: getDefaultPropsForSection(missingId)
      });
      warnings.push(`Missing required section ${missingId}, added with defaults`);
    }
  }
  
  // Remove duplicate sections (keep the first occurrence)
  const uniqueSections = completeSections.filter((section, index, array) => 
    array.findIndex(s => s.id === section.id) === index
  );
  
  // Log warnings
  if (warnings.length > 0) {
    console.warn('⚠️  AI Plan Application Warnings:');
    warnings.forEach(warning => console.warn(`   • ${warning}`));
  }
  
  return {
    brand: mergedBrand,
    sections: uniqueSections
  };
}

// Apply guardrails to section props
function applyGuardrails(sectionId: SectionID, props: any, warnings: string[]): any {
  const sanitized = JSON.parse(JSON.stringify(props)); // Deep clone
  
  // Apply array length constraints
  if (sectionId in GUARDRAILS) {
    const guardrail = GUARDRAILS[sectionId as keyof typeof GUARDRAILS];
    const arrayKey = sectionId === 'pricing' ? 'plans' : 'items';
    
    if (sanitized[arrayKey] && Array.isArray(sanitized[arrayKey])) {
      const originalLength = sanitized[arrayKey].length;
      
      if (originalLength < guardrail.min) {
        warnings.push(`Section ${sectionId} has ${originalLength} items, minimum is ${guardrail.min}`);
        // Could pad with defaults here
      } else if (originalLength > guardrail.max) {
        sanitized[arrayKey] = sanitized[arrayKey].slice(0, guardrail.max);
        warnings.push(`Section ${sectionId} trimmed from ${originalLength} to ${guardrail.max} items`);
      }
    }
  }
  
  // Sanitize all strings for HTML and validate URLs
  return sanitizeObject(sanitized, warnings);
}

// Recursively sanitize object properties
function sanitizeObject(obj: any, warnings: string[]): any {
  if (typeof obj === 'string') {
    // Check for HTML tags
    if (HTML_REGEX.test(obj)) {
      warnings.push(`HTML tags detected and removed from: "${obj.substring(0, 50)}..."`);
      return obj.replace(HTML_REGEX, '').trim();
    }
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, warnings));
  } else if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (key === 'href' && typeof value === 'string') {
        // Validate URLs
        if (value && !URL_REGEX.test(value)) {
          warnings.push(`Invalid URL detected: "${value}", replaced with placeholder`);
          sanitized[key] = '#';
        } else {
          sanitized[key] = value;
        }
      } else {
        sanitized[key] = sanitizeObject(value, warnings);
      }
    });
    return sanitized;
  }
  return obj;
}

// Get default props for a section when AI plan doesn't include it
function getDefaultPropsForSection(sectionId: SectionID): any {
  const defaults = {
    navbar: {
      links: [
        { label: "Home", href: "/" },
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" }
      ],
      cta: { label: "Get Started", href: "#cta" }
    },
    
    hero: {
      headline: "Welcome to Our Platform",
      subhead: "Transform your business with our innovative solutions",
      primaryCta: { label: "Get Started", href: "#signup" },
      secondaryCta: { label: "Learn More", href: "#features" }
    },
    
    socialProof: {
      logos: [
        { kind: "image", src: "https://via.placeholder.com/120x60/cccccc/666666?text=Client+1", alt: "Client 1" },
        { kind: "image", src: "https://via.placeholder.com/120x60/cccccc/666666?text=Client+2", alt: "Client 2" },
        { kind: "image", src: "https://via.placeholder.com/120x60/cccccc/666666?text=Client+3", alt: "Client 3" }
      ],
      caption: "Trusted by industry leaders"
    },
    
    features: {
      items: [
        {
          title: "Feature 1",
          body: "Description of the first feature and its benefits"
        },
        {
          title: "Feature 2", 
          body: "Description of the second feature and its benefits"
        },
        {
          title: "Feature 3",
          body: "Description of the third feature and its benefits"
        }
      ]
    },
    
    featureSpotlight: {
      blocks: [
        {
          headline: "Key Feature Spotlight",
          body: "Detailed description of this important feature and how it benefits users",
          mediaSide: "right"
        }
      ]
    },
    
    testimonials: {
      items: [
        {
          quote: "This platform has transformed our business operations.",
          name: "John Doe",
          role: "CEO, Example Corp"
        }
      ]
    },
    
    metrics: {
      items: [
        { label: "Users", value: "10K+" },
        { label: "Uptime", value: "99.9%" },
        { label: "Satisfaction", value: "98%" }
      ]
    },
    
    pricing: {
      plans: [
        {
          name: "Basic",
          price: "29",
          period: "/mo",
          features: ["Feature 1", "Feature 2"],
          cta: { label: "Choose Plan", href: "#pricing" }
        },
        {
          name: "Pro",
          price: "99",
          period: "/mo", 
          features: ["All Basic features", "Feature 3", "Feature 4"],
          cta: { label: "Choose Plan", href: "#pricing" },
          highlight: true
        }
      ]
    },
    
    faq: {
      items: [
        {
          q: "What is this platform?",
          a: "This is a comprehensive solution for your business needs."
        },
        {
          q: "How do I get started?",
          a: "Simply sign up and follow our onboarding process."
        }
      ]
    },
    
    finalCta: {
      headline: "Ready to Get Started?",
      subhead: "Join thousands of satisfied customers",
      cta: { label: "Start Free Trial", href: "#signup" }
    },
    
    footer: {
      columns: [
        {
          title: "Product",
          links: [
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" }
          ]
        }
      ],
      fineprint: "© 2024 Your Company. All rights reserved."
    }
  };
  
  return defaults[sectionId] || {};
}

// Validate AI plan without applying it
export function validateAIPlanOnly(plan: unknown): { 
  isValid: boolean; 
  errors: string[] 
} {
  const errors: string[] = [];
  
  try {
    validateAIPlan(plan);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof Error) {
      errors.push(error.message);
    } else {
      errors.push('Unknown validation error');
    }
    
    return { isValid: false, errors };
  }
}

// Merge AI plan with existing config (non-destructive)
export function mergeAIPlan(
  existingConfig: PageConfig,
  aiPlan: unknown
): PageConfig {
  try {
    return applyAIPlan(aiPlan, existingConfig);
  } catch (error) {
    // If AI plan is invalid, return the existing config
    console.warn('Failed to apply AI plan, returning existing config:', error);
    return existingConfig;
  }
}