import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  PageConfig, 
  BrandInfo, 
  SectionID, 
  SectionProps 
} from '../types/landing';
import { 
  buildDefaultConfig, 
  buildRandomizedConfig, 
  buildConfigWithVariants 
} from '../generator/builders';

interface PreviewState {
  // Current configuration
  config: PageConfig;
  
  // UI state
  selectedSection: SectionID | null;
  isGenerating: boolean;
  error: string | null;
  
  // Actions
  setConfig: (config: PageConfig) => void;
  updateBrand: (brand: Partial<BrandInfo>) => void;
  updateSectionVariant: (sectionId: SectionID, variant: number) => void;
  updateSectionProps: (sectionId: SectionID, props: SectionProps) => void;
  setSelectedSection: (sectionId: SectionID | null) => void;
  generateRandomConfig: (seed?: number) => void;
  generateDefaultConfig: () => void;
  duplicateSectionAsVariant: (sectionId: SectionID) => void;
  setError: (error: string | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  
  // Utility actions
  exportConfig: () => string;
  importConfig: (configJson: string) => void;
  resetToDefaults: () => void;
}

const defaultBrand: BrandInfo = {
  name: "Modern Web Solutions",
  tagline: "Professional web development and design solutions",
  industry: "technology",
  targetAudience: "businesses",
  tone: "corporate"
};

const defaultConfig = buildDefaultConfig(defaultBrand);

export const usePreviewStore = create<PreviewState>()(
  devtools(
    (set, get) => ({
      // Initial state
      config: defaultConfig,
      selectedSection: null,
      isGenerating: false,
      error: null,
      
      // Actions
      setConfig: (config: PageConfig) => {
        set({ config, error: null });
      },
      
      updateBrand: (brandUpdate: Partial<BrandInfo>) => {
        const { config } = get();
        set({
          config: {
            ...config,
            brand: { ...config.brand, ...brandUpdate }
          }
        });
      },
      
      updateSectionVariant: (sectionId: SectionID, variant: number) => {
        const { config } = get();
        const updatedSections = config.sections.map(section =>
          section.id === sectionId
            ? { ...section, variant }
            : section
        );
        
        set({
          config: {
            ...config,
            sections: updatedSections
          }
        });
      },
      
      updateSectionProps: (sectionId: SectionID, props: SectionProps) => {
        const { config } = get();
        const updatedSections = config.sections.map(section =>
          section.id === sectionId
            ? { ...section, props }
            : section
        );
        
        set({
          config: {
            ...config,
            sections: updatedSections
          }
        });
      },
      
      setSelectedSection: (sectionId: SectionID | null) => {
        set({ selectedSection: sectionId });
      },
      
      generateRandomConfig: (seed?: number) => {
        const { config } = get();
        set({ isGenerating: true, error: null });
        
        try {
          const newConfig = buildRandomizedConfig(config.brand, seed);
          set({ config: newConfig, isGenerating: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to generate random config',
            isGenerating: false 
          });
        }
      },
      
      generateDefaultConfig: () => {
        const { config } = get();
        set({ isGenerating: true, error: null });
        
        try {
          const newConfig = buildDefaultConfig(config.brand);
          set({ config: newConfig, isGenerating: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to generate default config',
            isGenerating: false 
          });
        }
      },
      
      duplicateSectionAsVariant: (sectionId: SectionID) => {
        const { config } = get();
        const section = config.sections.find(s => s.id === sectionId);
        
        if (!section) {
          set({ error: `Section ${sectionId} not found` });
          return;
        }
        
        // This would typically create a new variant file
        // For now, we'll just show a message
        set({ error: `Duplicating ${sectionId} as new variant - feature coming soon!` });
      },
      
      setError: (error: string | null) => {
        set({ error });
      },
      
      setIsGenerating: (isGenerating: boolean) => {
        set({ isGenerating });
      },
      
      // Utility actions
      exportConfig: () => {
        const { config } = get();
        return JSON.stringify(config, null, 2);
      },
      
      importConfig: (configJson: string) => {
        try {
          const config = JSON.parse(configJson) as PageConfig;
          set({ config, error: null });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Invalid JSON configuration' 
          });
        }
      },
      
      resetToDefaults: () => {
        set({ 
          config: buildDefaultConfig(defaultBrand),
          selectedSection: null,
          error: null 
        });
      }
    }),
    {
      name: 'preview-store',
      partialize: (state) => ({
        config: state.config,
        selectedSection: state.selectedSection
      })
    }
  )
);

// Selectors for common use cases
export const useConfig = () => usePreviewStore(state => state.config);
export const useBrand = () => usePreviewStore(state => state.config.brand);
export const useSections = () => usePreviewStore(state => state.config.sections);
export const useSelectedSection = () => usePreviewStore(state => state.selectedSection);
export const useIsGenerating = () => usePreviewStore(state => state.isGenerating);
export const useError = () => usePreviewStore(state => state.error);
