import React from 'react';
import { PageConfig, SectionID, SectionProps } from '../types/landing';
import { registry } from './registry';

// Compose a complete landing page from PageConfig
export function composePage(config: PageConfig, showWarnings: boolean = false): { page: JSX.Element; warnings: string[] } {
  const warnings: string[] = [];
  
  try {
    // Validate config
    validatePageConfig(config);
    
    // Get all components
    const sections = config.sections.map(section => {
      try {
        const { component, props } = getSectionPreview(section.id, section.variant, section.props, config.brand);
        return React.createElement(component, { key: section.id, ...props });
      } catch (error) {
        const warning = `Failed to render section ${section.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        warnings.push(warning);
        
        if (showWarnings) {
          return React.createElement('div', { 
            key: section.id, 
            className: 'p-4 bg-red-100 border border-red-300 rounded' 
          }, `Error in ${section.id}: ${warning}`);
        }
        
        return null;
      }
    }).filter(Boolean);
    
    const page = React.createElement('div', { className: 'landing-page' }, sections);
    
    return { page, warnings };
    
  } catch (error) {
    const errorMessage = `Failed to compose page: ${error instanceof Error ? error.message : 'Unknown error'}`;
    warnings.push(errorMessage);
    
    if (showWarnings) {
      const errorPage = React.createElement('div', { 
        className: 'p-8 bg-red-100 border border-red-300 rounded' 
      }, `Page composition error: ${errorMessage}`);
      return { page: errorPage, warnings };
    }
    
    throw error; // Re-throw in test/CI environments
  }
}

// Get a preview of a specific section
export function getSectionPreview(sectionId: SectionID, variant: number, props: SectionProps, brand: any): { component: any; props: any } {
  const Component = getComponent(sectionId, variant);

  if (!Component) {
    throw new Error(`Component not found for section ${sectionId} variant ${variant}`);
  }

  const validatedProps = validateSectionProps(sectionId, props);

  return {
    component: Component,
    props: { ...validatedProps, brand }
  };
}

// Get component for a section and variant
function getComponent(sectionId: SectionID, variant: number): any {
  const sectionRegistry = registry[sectionId];
  
  if (!sectionRegistry) {
    throw new Error(`Unknown section: ${sectionId}`);
  }
  
  if (variant < 1 || variant > sectionRegistry.variants) {
    throw new Error(`Invalid variant ${variant} for section ${sectionId}. Available: 1-${sectionRegistry.variants}`);
  }
  
  return sectionRegistry.getComponent(variant);
}

// Validate section props (placeholder - would use actual validation)
function validateSectionProps(sectionId: SectionID, props: SectionProps): SectionProps {
  // In a real implementation, this would validate props against the section's schema
  return props;
}

// Validate that PageConfig has all required sections
export function validatePageConfig(config: PageConfig): void {
  if (!config.brand || !config.brand.name) {
    throw new Error('PageConfig must have a brand with a name');
  }
  
  if (!config.sections || !Array.isArray(config.sections)) {
    throw new Error('PageConfig must have a sections array');
  }
  
  const sectionIds = config.sections.map(s => s.id);
  const requiredSections = ['navbar', 'hero', 'socialProof', 'features', 'featureSpotlight', 'testimonials', 'metrics', 'pricing', 'faq', 'finalCta', 'footer'];
  
  for (const required of requiredSections) {
    if (!sectionIds.includes(required as SectionID)) {
      throw new Error(`Missing required section: ${required}`);
    }
  }
  
  // Check for duplicates
  const uniqueIds = new Set(sectionIds);
  if (uniqueIds.size !== sectionIds.length) {
    throw new Error('Duplicate sections found in PageConfig');
  }
}

// Get registry status for debugging
export function getRegistryStatus(): Record<string, any> {
  const status: Record<string, any> = {};
  
  Object.entries(registry).forEach(([sectionId, sectionInfo]) => {
    status[sectionId] = {
      variants: sectionInfo.variants,
      hasComponent: typeof sectionInfo.getComponent === 'function'
    };
  });
  
  return status;
}
