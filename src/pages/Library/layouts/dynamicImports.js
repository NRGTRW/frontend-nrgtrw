// Dynamic imports for generated variants
import { STYLE_GROUPS } from '../styles/styleGroups';

// Helper function to dynamically import variants
async function loadVariantsForSection(sectionName) {
  const variants = [];
  
  try {
    // Load the index file which exports all variants
    const sectionIndex = await import(`../components/${sectionName}/index.ts`);
    
    // Get all exported components
    const exportedComponents = Object.values(sectionIndex);
    variants.push(...exportedComponents);
    
    console.log(`✅ Loaded ${exportedComponents.length} variants for ${sectionName}`);
  } catch (error) {
    console.warn(`⚠️  Could not load variants for ${sectionName}:`, error.message);
  }
  
  return variants;
}

// Load all variants for each section
export async function loadAllVariants() {
  const sections = ['Hero', 'Navbar', 'Features'];
  const allVariants = {};
  
  for (const section of sections) {
    allVariants[section.toLowerCase()] = await loadVariantsForSection(section);
  }
  
  return allVariants;
}

// Fallback to original components if dynamic loading fails
export const fallbackComponents = {
  hero: [],
  navbar: [],
  features: []
};

// Export function to get variants with fallback
export function getVariantsForSection(sectionName) {
  // This will be populated by the dynamic loader
  return fallbackComponents[sectionName.toLowerCase()] || [];
}
