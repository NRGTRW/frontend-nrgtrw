import React from 'react';
import { 
  PageConfig, 
  SectionID, 
  SectionProps, 
  REQUIRED_SECTIONS 
} from '../types/landing';
import { 
  registry, 
  isValidSectionID, 
  isValidVariant, 
  validateSectionProps 
} from './registry';

// Component registry for dynamic loading
const componentRegistry: Record<string, React.ComponentType<any>[]> = {};

// Register a component variant
export function registerComponent(
  sectionId: SectionID, 
  variant: number, 
  component: React.ComponentType<any>
): void {
  if (!componentRegistry[sectionId]) {
    componentRegistry[sectionId] = [];
  }
  
  // Ensure array is large enough
  while (componentRegistry[sectionId].length < variant) {
    componentRegistry[sectionId].push(null as any);
  }
  
  componentRegistry[sectionId][variant - 1] = component;
}

// Get a component variant
export function getComponent(
  sectionId: SectionID, 
  variant: number
): React.ComponentType<any> | null {
  const components = componentRegistry[sectionId];
  if (!components || variant < 1 || variant > components.length) {
    return null;
  }
  return components[variant - 1];
}

// Validation error class
export class CompositionError extends Error {
  constructor(
    message: string,
    public section?: SectionID,
    public field?: string
  ) {
    super(message);
    this.name = 'CompositionError';
  }
}

// Validate page configuration
export function validatePageConfig(config: PageConfig): void {
  // Check brand
  if (!config.brand || !config.brand.name) {
    throw new CompositionError('PageConfig must have a brand with a name');
  }
  
  // Check sections array
  if (!Array.isArray(config.sections)) {
    throw new CompositionError('PageConfig must have a sections array');
  }
  
  // Check all required sections are present
  const sectionIds = config.sections.map(s => s.id);
  for (const required of REQUIRED_SECTIONS) {
    if (!sectionIds.includes(required)) {
      throw new CompositionError(
        `Missing required section: ${required}`,
        required
      );
    }
  }
  
  // Check no duplicate sections
  const duplicates = sectionIds.filter((id, index) => sectionIds.indexOf(id) !== index);
  if (duplicates.length > 0) {
    throw new CompositionError(
      `Duplicate sections found: ${duplicates.join(', ')}`,
      duplicates[0] as SectionID
    );
  }
  
  // Validate each section
  for (const section of config.sections) {
    // Check section ID is valid
    if (!isValidSectionID(section.id)) {
      throw new CompositionError(
        `Invalid section ID: ${section.id}`,
        section.id as SectionID
      );
    }
    
    // Check variant is valid
    if (!isValidVariant(section.id, section.variant)) {
      throw new CompositionError(
        `Invalid variant ${section.variant} for section ${section.id}. Must be 1-${getVariantCount(section.id)}`,
        section.id
      );
    }
    
    // Check component exists
    const component = getComponent(section.id, section.variant);
    if (!component) {
      throw new CompositionError(
        `Component not found for ${section.id} variant ${section.variant}`,
        section.id
      );
    }
    
    // Validate props
    try {
      validateSectionProps(section.id, section.props);
    } catch (error) {
      throw new CompositionError(
        `Invalid props for section ${section.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        section.id
      );
    }
  }
}

// Compose a complete page from configuration
export function composePage(config: PageConfig): React.ReactElement {
  // Validate configuration
  validatePageConfig(config);
  
  const sections: React.ReactElement[] = [];
  
  for (const section of config.sections) {
    const Component = getComponent(section.id, section.variant);
    
    if (!Component) {
      throw new CompositionError(
        `Component not found for ${section.id} variant ${section.variant}`,
        section.id
      );
    }
    
    // Validate props for this section
    const validatedProps = validateSectionProps(section.id, section.props);
    
    // Render the component
    sections.push(
      React.createElement(Component, {
        key: section.id,
        ...validatedProps,
        brand: config.brand
      })
    );
  }
  
  return React.createElement('div', { className: 'landing-page' }, ...sections);
}

// Get available variants for a section
export function getAvailableVariants(sectionId: SectionID): number[] {
  const count = registry[sectionId].variants;
  return Array.from({ length: count }, (_, i) => i + 1);
}

// Check if a page configuration is complete
export function isPageComplete(config: PageConfig): { 
  isComplete: boolean; 
  missingSections: SectionID[] 
} {
  const configSectionIds = config.sections.map(s => s.id);
  const missingSections = REQUIRED_SECTIONS.filter(id => !configSectionIds.includes(id));
  
  return {
    isComplete: missingSections.length === 0,
    missingSections
  };
}

// Get component registry status
export function getRegistryStatus(): Record<SectionID, { registered: number; expected: number }> {
  const status: Record<string, { registered: number; expected: number }> = {};
  
  for (const sectionId of Object.keys(registry) as SectionID[]) {
    const registered = componentRegistry[sectionId]?.filter(Boolean).length || 0;
    const expected = registry[sectionId].variants;
    status[sectionId] = { registered, expected };
  }
  
  return status as Record<SectionID, { registered: number; expected: number }>;
}