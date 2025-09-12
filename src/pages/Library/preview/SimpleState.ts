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

// Simple state management without zustand
let currentConfig: PageConfig = buildDefaultConfig({
  name: "Modern Web Solutions",
  tagline: "Professional web development and design solutions",
  industry: "technology",
  targetAudience: "businesses",
  tone: "corporate"
});

let currentSelectedSection: SectionID | null = null;
let currentIsGenerating: boolean = false;
let currentError: string | null = null;

// Simple state getters
export const getConfig = () => currentConfig;
export const getBrand = () => currentConfig.brand;
export const getSections = () => currentConfig.sections;
export const getSelectedSection = () => currentSelectedSection;
export const getIsGenerating = () => currentIsGenerating;
export const getError = () => currentError;

// Simple state setters
export const setConfig = (config: PageConfig) => {
  currentConfig = config;
};

export const updateBrand = (brandUpdate: Partial<BrandInfo>) => {
  currentConfig = {
    ...currentConfig,
    brand: { ...currentConfig.brand, ...brandUpdate }
  };
};

export const updateSectionVariant = (sectionId: SectionID, variant: number) => {
  const updatedSections = currentConfig.sections.map(section =>
    section.id === sectionId
      ? { ...section, variant }
      : section
  );
  
  currentConfig = {
    ...currentConfig,
    sections: updatedSections
  };
};

export const updateSectionProps = (sectionId: SectionID, props: SectionProps) => {
  const updatedSections = currentConfig.sections.map(section =>
    section.id === sectionId
      ? { ...section, props }
      : section
  );
  
  currentConfig = {
    ...currentConfig,
    sections: updatedSections
  };
};

export const setSelectedSection = (sectionId: SectionID | null) => {
  currentSelectedSection = sectionId;
};

export const generateRandomConfig = (seed?: number) => {
  currentIsGenerating = true;
  currentError = null;
  
  try {
    const newConfig = buildRandomizedConfig(currentConfig.brand, seed);
    currentConfig = newConfig;
    currentIsGenerating = false;
  } catch (error) {
    currentError = error instanceof Error ? error.message : 'Failed to generate random config';
    currentIsGenerating = false;
  }
};

export const generateDefaultConfig = () => {
  currentIsGenerating = true;
  currentError = null;
  
  try {
    const newConfig = buildDefaultConfig(currentConfig.brand);
    currentConfig = newConfig;
    currentIsGenerating = false;
  } catch (error) {
    currentError = error instanceof Error ? error.message : 'Failed to generate default config';
    currentIsGenerating = false;
  }
};

export const resetToDefaults = () => {
  currentConfig = buildDefaultConfig({
    name: "Modern Web Solutions",
    tagline: "Professional web development and design solutions",
    industry: "technology",
    targetAudience: "businesses",
    tone: "corporate"
  });
  currentSelectedSection = null;
  currentError = null;
};

export const exportConfig = () => {
  return JSON.stringify(currentConfig, null, 2);
};

export const setError = (error: string | null) => {
  currentError = error;
};

export const setIsGenerating = (isGenerating: boolean) => {
  currentIsGenerating = isGenerating;
};
