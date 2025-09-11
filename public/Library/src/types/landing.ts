// Core types for landing page generation system
export type BrandTone = "luxury" | "playful" | "minimal" | "corporate" | "bold";

export interface BrandInfo {
  name: string;
  tagline?: string;
  logoUrl?: string;
  primaryColor?: string;
  industry?: string;
  targetAudience?: string;
  tone?: BrandTone;
}

export type SectionID = 
  | "navbar" 
  | "hero" 
  | "socialProof" 
  | "features" 
  | "featureSpotlight" 
  | "testimonials" 
  | "metrics" 
  | "pricing" 
  | "faq" 
  | "finalCta" 
  | "footer";

// Common types
export interface Link {
  label: string;
  href: string;
  external?: boolean;
}

export interface Media {
  kind: "image" | "video" | "icon";
  src: string;
  alt?: string;
}

// Section-specific prop types
export interface NavbarProps {
  links: Link[];
  cta?: Link;
}

export interface HeroProps {
  headline: string;
  subhead?: string;
  primaryCta: Link;
  secondaryCta?: Link;
  media?: Media;
}

export interface SocialProofProps {
  logos: Media[];
  caption?: string;
}

export interface FeaturesProps {
  items: {
    icon?: Media;
    title: string;
    body: string;
  }[];
}

export interface FeatureSpotlightProps {
  blocks: {
    headline: string;
    body: string;
    media?: Media;
    cta?: Link;
    mediaSide?: "left" | "right";
  }[];
}

export interface TestimonialsProps {
  items: {
    quote: string;
    name: string;
    role?: string;
    avatar?: Media;
  }[];
}

export interface MetricsProps {
  items: {
    label: string;
    value: string;
  }[];
}

export interface PricingProps {
  plans: {
    name: string;
    price: string;
    period?: "/mo" | "/yr";
    features: string[];
    cta: Link;
    highlight?: boolean;
  }[];
  hasToggle?: boolean;
}

export interface FaqProps {
  items: {
    q: string;
    a: string;
  }[];
}

export interface FinalCtaProps {
  headline: string;
  subhead?: string;
  cta: Link;
}

export interface FooterProps {
  columns: {
    title: string;
    links: Link[];
  }[];
  socials?: Link[];
  fineprint?: string;
}

// Union type for all section props
export type SectionProps = 
  | NavbarProps 
  | HeroProps 
  | SocialProofProps 
  | FeaturesProps 
  | FeatureSpotlightProps 
  | TestimonialsProps 
  | MetricsProps 
  | PricingProps 
  | FaqProps 
  | FinalCtaProps 
  | FooterProps;

// Main page configuration
export interface PageConfig {
  brand: BrandInfo;
  sections: {
    id: SectionID;
    variant: number;
    props: SectionProps;
  }[];
}

// AI plan schema for future LLM integration
export interface AIPlan {
  brand: BrandInfo;
  sections: {
    id: SectionID;
    variant: number;
    props: Record<string, unknown>;
  }[];
}

// Component registry type for dynamic loading
export interface ComponentRegistry {
  [key: string]: React.ComponentType<any>[];
}

// Validation error type
export interface ValidationError {
  section: SectionID;
  field?: string;
  message: string;
}

// Content seeding input type
export interface ContentSeedInput {
  brandDescription: string;
  industry?: string;
  targetAudience?: string;
  tone?: BrandTone;
}

// Required sections for complete landing page
export const REQUIRED_SECTIONS: readonly SectionID[] = [
  "navbar",
  "hero", 
  "socialProof",
  "features",
  "featureSpotlight",
  "testimonials",
  "metrics",
  "pricing",
  "faq",
  "finalCta",
  "footer"
] as const;