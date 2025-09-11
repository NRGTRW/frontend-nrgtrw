import { 
  SectionID, 
  SectionProps, 
  NavbarProps, 
  HeroProps, 
  SocialProofProps, 
  FeaturesProps, 
  FeatureSpotlightProps, 
  TestimonialsProps, 
  MetricsProps, 
  PricingProps, 
  FaqProps, 
  FinalCtaProps, 
  FooterProps
} from '../types/landing';

// Validation error class
export class ValidationError extends Error {
  section: SectionID;
  field?: string;
  
  constructor({ section, field, message }: { section: SectionID; field?: string; message: string }) {
    super(message);
    this.name = 'ValidationError';
    this.section = section;
    this.field = field;
  }
}

// Validation functions for each section type
export function validateNavbarProps(props: unknown): NavbarProps {
  const p = props as NavbarProps;
  if (!p.links || !Array.isArray(p.links)) {
    throw new ValidationError({
      section: 'navbar',
      field: 'links',
      message: 'Navbar must have links array'
    });
  }
  if (p.links.length === 0) {
    throw new ValidationError({
      section: 'navbar',
      field: 'links',
      message: 'Navbar must have at least one link'
    });
  }
  return p;
}

export function validateHeroProps(props: unknown): HeroProps {
  const p = props as HeroProps;
  if (!p.headline || typeof p.headline !== 'string') {
    throw new ValidationError({
      section: 'hero',
      field: 'headline',
      message: 'Hero must have headline string'
    });
  }
  if (!p.primaryCta || !p.primaryCta.label || !p.primaryCta.href) {
    throw new ValidationError({
      section: 'hero',
      field: 'primaryCta',
      message: 'Hero must have primaryCta with label and href'
    });
  }
  return p;
}

export function validateSocialProofProps(props: unknown): SocialProofProps {
  const p = props as SocialProofProps;
  if (!p.logos || !Array.isArray(p.logos)) {
    throw new ValidationError({
      section: 'socialProof',
      field: 'logos',
      message: 'SocialProof must have logos array'
    });
  }
  if (p.logos.length === 0) {
    throw new ValidationError({
      section: 'socialProof',
      field: 'logos',
      message: 'SocialProof must have at least one logo'
    });
  }
  return p;
}

export function validateFeaturesProps(props: unknown): FeaturesProps {
  const p = props as FeaturesProps;
  if (!p.items || !Array.isArray(p.items)) {
    throw new ValidationError({
      section: 'features',
      field: 'items',
      message: 'Features must have items array'
    });
  }
  if (p.items.length < 3 || p.items.length > 6) {
    throw new ValidationError({
      section: 'features',
      field: 'items',
      message: 'Features must have 3-6 items'
    });
  }
  return p;
}

export function validateFeatureSpotlightProps(props: unknown): FeatureSpotlightProps {
  const p = props as FeatureSpotlightProps;
  if (!p.blocks || !Array.isArray(p.blocks)) {
    throw new ValidationError({
      section: 'featureSpotlight',
      field: 'blocks',
      message: 'FeatureSpotlight must have blocks array'
    });
  }
  if (p.blocks.length < 2 || p.blocks.length > 3) {
    throw new ValidationError({
      section: 'featureSpotlight',
      field: 'blocks',
      message: 'FeatureSpotlight must have 2-3 blocks'
    });
  }
  return p;
}

export function validateTestimonialsProps(props: unknown): TestimonialsProps {
  const p = props as TestimonialsProps;
  if (!p.items || !Array.isArray(p.items)) {
    throw new ValidationError({
      section: 'testimonials',
      field: 'items',
      message: 'Testimonials must have items array'
    });
  }
  if (p.items.length < 2 || p.items.length > 4) {
    throw new ValidationError({
      section: 'testimonials',
      field: 'items',
      message: 'Testimonials must have 2-4 items'
    });
  }
  return p;
}

export function validateMetricsProps(props: unknown): MetricsProps {
  const p = props as MetricsProps;
  if (!p.items || !Array.isArray(p.items)) {
    throw new ValidationError({
      section: 'metrics',
      field: 'items',
      message: 'Metrics must have items array'
    });
  }
  if (p.items.length < 3 || p.items.length > 6) {
    throw new ValidationError({
      section: 'metrics',
      field: 'items',
      message: 'Metrics must have 3-6 items'
    });
  }
  return p;
}

export function validatePricingProps(props: unknown): PricingProps {
  const p = props as PricingProps;
  if (!p.plans || !Array.isArray(p.plans)) {
    throw new ValidationError({
      section: 'pricing',
      field: 'plans',
      message: 'Pricing must have plans array'
    });
  }
  if (p.plans.length < 2 || p.plans.length > 4) {
    throw new ValidationError({
      section: 'pricing',
      field: 'plans',
      message: 'Pricing must have 2-4 plans'
    });
  }
  return p;
}

export function validateFaqProps(props: unknown): FaqProps {
  const p = props as FaqProps;
  if (!p.items || !Array.isArray(p.items)) {
    throw new ValidationError({
      section: 'faq',
      field: 'items',
      message: 'FAQ must have items array'
    });
  }
  if (p.items.length < 4 || p.items.length > 8) {
    throw new ValidationError({
      section: 'faq',
      field: 'items',
      message: 'FAQ must have 4-8 items'
    });
  }
  return p;
}

export function validateFinalCtaProps(props: unknown): FinalCtaProps {
  const p = props as FinalCtaProps;
  if (!p.headline || typeof p.headline !== 'string') {
    throw new ValidationError({
      section: 'finalCta',
      field: 'headline',
      message: 'FinalCTA must have headline string'
    });
  }
  if (!p.cta || !p.cta.label || !p.cta.href) {
    throw new ValidationError({
      section: 'finalCta',
      field: 'cta',
      message: 'FinalCTA must have cta with label and href'
    });
  }
  return p;
}

export function validateFooterProps(props: unknown): FooterProps {
  const p = props as FooterProps;
  if (!p.columns || !Array.isArray(p.columns)) {
    throw new ValidationError({
      section: 'footer',
      field: 'columns',
      message: 'Footer must have columns array'
    });
  }
  if (p.columns.length === 0) {
    throw new ValidationError({
      section: 'footer',
      field: 'columns',
      message: 'Footer must have at least one column'
    });
  }
  return p;
}

// Main validation function
export function validateSectionProps(sectionId: SectionID, props: unknown): SectionProps {
  switch (sectionId) {
    case 'navbar':
      return validateNavbarProps(props);
    case 'hero':
      return validateHeroProps(props);
    case 'socialProof':
      return validateSocialProofProps(props);
    case 'features':
      return validateFeaturesProps(props);
    case 'featureSpotlight':
      return validateFeatureSpotlightProps(props);
    case 'testimonials':
      return validateTestimonialsProps(props);
    case 'metrics':
      return validateMetricsProps(props);
    case 'pricing':
      return validatePricingProps(props);
    case 'faq':
      return validateFaqProps(props);
    case 'finalCta':
      return validateFinalCtaProps(props);
    case 'footer':
      return validateFooterProps(props);
    default:
      throw new ValidationError({
        section: sectionId as SectionID,
        message: `Unknown section type: ${sectionId}`
      });
  }
}

// Required sections for complete landing page
export const REQUIRED_SECTIONS: SectionID[] = [
  'navbar',
  'hero', 
  'socialProof',
  'features',
  'featureSpotlight',
  'testimonials',
  'metrics',
  'pricing',
  'faq',
  'finalCta',
  'footer'
];

// Validate complete page configuration
export function validatePageConfig(config: { sections: { id: SectionID; props: unknown }[] }): void {
  const sectionIds = config.sections.map(s => s.id);
  
  // Check all required sections are present
  for (const required of REQUIRED_SECTIONS) {
    if (!sectionIds.includes(required)) {
      throw new ValidationError({
        section: required,
        message: `Missing required section: ${required}`
      });
    }
  }
  
  // Check no duplicate sections
  const duplicates = sectionIds.filter((id, index) => sectionIds.indexOf(id) !== index);
  if (duplicates.length > 0) {
    throw new ValidationError({
      section: duplicates[0] as SectionID,
      message: `Duplicate section found: ${duplicates[0]}`
    });
  }
  
  // Validate each section's props
  for (const section of config.sections) {
    validateSectionProps(section.id, section.props);
  }
}
