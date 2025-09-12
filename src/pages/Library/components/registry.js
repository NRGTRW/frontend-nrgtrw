// Component registry for landing page system
import { registerComponent } from '../generator/composePage';

// Import all component variants
import { SocialProofVariants } from './SocialProof';
import { FeaturesVariants } from './Features';
import { FeatureSpotlightVariants } from './FeatureSpotlight';
import { TestimonialsVariants } from './Testimonials';
import { MetricsVariants } from './Metrics';
import { FAQVariants } from './FAQ';
import { FinalCTAVariants } from './FinalCTA';

// Import existing components
import { HeaderLayouts } from '../layouts';
import { FooterLayouts } from '../layouts';

// Register all components
export function registerAllComponents() {
  // Register SocialProof variants
  SocialProofVariants.forEach((component, index) => {
    registerComponent('socialProof', index + 1, component);
  });

  // Register Features variants
  FeaturesVariants.forEach((component, index) => {
    registerComponent('features', index + 1, component);
  });

  // Register FeatureSpotlight variants
  FeatureSpotlightVariants.forEach((component, index) => {
    registerComponent('featureSpotlight', index + 1, component);
  });

  // Register Testimonials variants
  TestimonialsVariants.forEach((component, index) => {
    registerComponent('testimonials', index + 1, component);
  });

  // Register Metrics variants
  MetricsVariants.forEach((component, index) => {
    registerComponent('metrics', index + 1, component);
  });

  // Register FAQ variants
  FAQVariants.forEach((component, index) => {
    registerComponent('faq', index + 1, component);
  });

  // Register FinalCTA variants
  FinalCTAVariants.forEach((component, index) => {
    registerComponent('finalCta', index + 1, component);
  });

  // Register existing components
  HeaderLayouts.forEach((component, index) => {
    registerComponent('navbar', index + 1, component);
  });

  FooterLayouts.forEach((component, index) => {
    registerComponent('footer', index + 1, component);
  });

  // TODO: Register Hero and Pricing components when they are extracted from existing layouts
  console.log('All components registered successfully');
}

// Auto-register on import (disabled temporarily to avoid import errors)
// registerAllComponents();
