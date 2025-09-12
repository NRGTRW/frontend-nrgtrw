import { 
  PageConfig, 
  BrandInfo, 
  SectionID, 
  SectionProps 
} from '../types/landing';
import { 
  buildDefaultConfig, 
  buildRandomizedConfig
} from '../generator/builders';
import { Mulberry32, generateSeed, hashString } from '../generator/prng';

// Enhanced state management with seed tracking and validation
interface EnhancedState {
  config: PageConfig;
  selectedSection: SectionID | null;
  isGenerating: boolean;
  error: string | null;
  currentSeed: number;
  validationErrors: Record<string, string[]>;
  showOutlines: boolean;
  showMissingContent: boolean;
}

// Global state
let state: EnhancedState = {
  config: buildDefaultConfig({
    name: "Modern Web Solutions",
    tagline: "Professional web development and design solutions",
    industry: "technology",
    targetAudience: "businesses",
    tone: "corporate"
  }),
  selectedSection: null,
  isGenerating: false,
  error: null,
  currentSeed: generateSeed(),
  validationErrors: {},
  showOutlines: false,
  showMissingContent: true
};

// State change listeners
const listeners = new Set<() => void>();

// Subscribe to state changes
export const subscribe = (callback: () => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

// Notify all listeners of state changes
const notify = () => {
  listeners.forEach(callback => callback());
};

// State getters
export const getState = (): EnhancedState => ({ ...state });
export const getConfig = (): PageConfig => state.config;
export const getBrand = (): BrandInfo => state.config.brand;
export const getSections = (): PageConfig['sections'] => state.config.sections;
export const getSelectedSection = (): SectionID | null => state.selectedSection;
export const getIsGenerating = (): boolean => state.isGenerating;
export const getError = (): string | null => state.error;
export const getCurrentSeed = (): number => state.currentSeed;
export const getValidationErrors = (): Record<string, string[]> => state.validationErrors;
export const getShowOutlines = (): boolean => state.showOutlines;
export const getShowMissingContent = (): boolean => state.showMissingContent;

// Validation helpers
const validateConfig = (config: PageConfig): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};
  
  // Check brand
  if (!config.brand.name || config.brand.name.trim() === '') {
    errors.brand = ['Brand name is required'];
  }
  
  // Check sections
  config.sections.forEach((section, index) => {
    const sectionErrors: string[] = [];
    
    // Check for empty props
    if (Object.keys(section.props).length === 0) {
      sectionErrors.push('Section has no props');
    }
    
    // Check for empty strings in props
    const checkForEmptyStrings = (obj: any, path: string = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'string' && value.trim() === '') {
          sectionErrors.push(`Empty string at ${currentPath}`);
        } else if (Array.isArray(value) && value.length === 0) {
          sectionErrors.push(`Empty array at ${currentPath}`);
        } else if (typeof value === 'object' && value !== null) {
          checkForEmptyStrings(value, currentPath);
        }
      }
    };
    
    checkForEmptyStrings(section.props);
    
    if (sectionErrors.length > 0) {
      errors[`section_${index}`] = sectionErrors;
    }
  });
  
  return errors;
};

// State setters
export const setConfig = (config: PageConfig) => {
  state.config = config;
  state.validationErrors = validateConfig(config);
  notify();
};

export const updateBrand = (brandUpdate: Partial<BrandInfo>) => {
  state.config = {
    ...state.config,
    brand: { ...state.config.brand, ...brandUpdate }
  };
  state.validationErrors = validateConfig(state.config);
  notify();
};

export const updateSectionVariant = (sectionId: SectionID, variant: number) => {
  const updatedSections = state.config.sections.map(section =>
    section.id === sectionId
      ? { ...section, variant }
      : section
  );
  
  state.config = {
    ...state.config,
    sections: updatedSections
  };
  state.validationErrors = validateConfig(state.config);
  notify();
};

export const updateSectionProps = (sectionId: SectionID, props: SectionProps) => {
  const updatedSections = state.config.sections.map(section =>
    section.id === sectionId
      ? { ...section, props }
      : section
  );
  
  state.config = {
    ...state.config,
    sections: updatedSections
  };
  state.validationErrors = validateConfig(state.config);
  notify();
};

export const setSelectedSection = (sectionId: SectionID | null) => {
  state.selectedSection = sectionId;
  notify();
};

export const generateRandomConfig = (seed?: number) => {
  state.isGenerating = true;
  state.error = null;
  
  try {
    const actualSeed = seed || state.currentSeed || generateSeed();
    state.currentSeed = actualSeed;
    const newConfig = buildRandomizedConfig(state.config.brand, actualSeed);
    state.config = newConfig;
    state.validationErrors = validateConfig(newConfig);
    state.isGenerating = false;
    notify();
  } catch (error) {
    state.error = error instanceof Error ? error.message : 'Failed to generate random config';
    state.isGenerating = false;
    notify();
  }
};

export const generateDefaultConfig = () => {
  state.isGenerating = true;
  state.error = null;
  
  try {
    const newConfig = buildDefaultConfig(state.config.brand);
    state.config = newConfig;
    state.validationErrors = validateConfig(newConfig);
    state.isGenerating = false;
    notify();
  } catch (error) {
    state.error = error instanceof Error ? error.message : 'Failed to generate default config';
    state.isGenerating = false;
    notify();
  }
};

export const resetToDefaults = () => {
  state.config = buildDefaultConfig({
    name: "Modern Web Solutions",
    tagline: "Professional web development and design solutions",
    industry: "technology",
    targetAudience: "businesses",
    tone: "corporate"
  });
  state.selectedSection = null;
  state.error = null;
  state.currentSeed = generateSeed();
  state.validationErrors = validateConfig(state.config);
  notify();
};

export const exportConfig = (): string => {
  return JSON.stringify(state.config, null, 2);
};

export const importConfig = (configJson: string) => {
  try {
    const config = JSON.parse(configJson) as PageConfig;
    state.config = config;
    state.validationErrors = validateConfig(config);
    state.error = null;
    notify();
  } catch (error) {
    state.error = error instanceof Error ? error.message : 'Invalid JSON configuration';
    notify();
  }
};

export const setError = (error: string | null) => {
  state.error = error;
  notify();
};

export const setIsGenerating = (isGenerating: boolean) => {
  state.isGenerating = isGenerating;
  notify();
};

export const setShowOutlines = (show: boolean) => {
  state.showOutlines = show;
  notify();
};

export const setShowMissingContent = (show: boolean) => {
  state.showMissingContent = show;
  notify();
};

export const setSeed = (seed: number) => {
  state.currentSeed = seed;
  notify();
};

// Utility functions
export const copySeed = () => {
  navigator.clipboard.writeText(state.currentSeed.toString());
};

export const downloadConfig = () => {
  const configJson = exportConfig();
  const blob = new Blob([configJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'landing-page-config.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const cycleVariant = (sectionId: SectionID, direction: 'up' | 'down' = 'up') => {
  const section = state.config.sections.find(s => s.id === sectionId);
  if (!section) return;
  
  const maxVariants = 7; // registry[sectionId].variants;
  const currentVariant = section.variant;
  let newVariant: number;
  
  if (direction === 'up') {
    newVariant = currentVariant >= maxVariants ? 1 : currentVariant + 1;
  } else {
    newVariant = currentVariant <= 1 ? maxVariants : currentVariant - 1;
  }
  
  updateSectionVariant(sectionId, newVariant);
};
