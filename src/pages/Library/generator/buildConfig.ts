import { 
  PageConfig, 
  BrandInfo, 
  ContentSeedInput 
} from '../types/landing';
import { 
  buildDefaultConfig, 
  buildRandomizedConfig
} from './builders';
import { generateContentSeed } from './contentSeed';

// Build a default page configuration
export function buildDefaultPageConfig(brand?: BrandInfo): PageConfig {
  const defaultBrand: BrandInfo = brand || {
    name: "Modern Web Solutions",
    tagline: "Professional web development and design solutions",
    industry: "technology",
    targetAudience: "businesses",
    tone: "corporate"
  };
  
  return buildDefaultConfig(defaultBrand);
}

// Build a randomized page configuration
export function buildRandomizedPageConfig(
  brand?: BrandInfo, 
  seed?: number
): PageConfig {
  const defaultBrand: BrandInfo = brand || {
    name: "Dynamic Solutions",
    tagline: "Innovative solutions for modern challenges",
    industry: "technology", 
    targetAudience: "customers",
    tone: "corporate"
  };
  
  return buildRandomizedConfig(defaultBrand, seed);
}

// Build a page configuration with content seeding
export function buildSeededPageConfig(
  contentInput: ContentSeedInput,
  randomizeVariants: boolean = false,
  seed?: number
): PageConfig {
  // Generate content seed
  const contentSeed = generateContentSeed(contentInput);
  
  // Build complete page with content
  if (randomizeVariants) {
    return buildRandomizedConfig(contentSeed.brand!, seed);
  } else {
    return buildDefaultConfig(contentSeed.brand!);
  }
}

// Build configuration from business description
export function buildConfigFromDescription(
  description: string,
  options: {
    industry?: string;
    targetAudience?: string;
    tone?: "luxury" | "playful" | "minimal" | "corporate" | "bold";
    randomizeVariants?: boolean;
    seed?: number;
  } = {}
): PageConfig {
  const {
    industry = "business",
    targetAudience = "customers", 
    tone = "corporate",
    randomizeVariants = false,
    seed
  } = options;
  
  const contentInput: ContentSeedInput = {
    brandDescription: description,
    industry,
    targetAudience,
    tone
  };
  
  return buildSeededPageConfig(contentInput, randomizeVariants, seed);
}

// Export configuration to JSON file
export function exportConfigToJSON(config: PageConfig, filename: string = "PageConfig.json"): string {
  const jsonString = JSON.stringify(config, null, 2);
  
  // In a real implementation, this would write to file system
  // For now, we'll return the JSON string
  console.log(`Exporting configuration to ${filename}:`);
  console.log(jsonString);
  
  return jsonString;
}

// Import configuration from JSON
export function importConfigFromJSON(jsonString: string): PageConfig {
  try {
    const config = JSON.parse(jsonString);
    
    // Basic validation
    if (!config.brand || !config.sections) {
      throw new Error('Invalid configuration: missing brand or sections');
    }
    
    return config as PageConfig;
  } catch (error) {
    throw new Error(`Failed to import configuration: ${error}`);
  }
}

// Generate multiple configurations for A/B testing
export function generateABTestConfigs(
  baseInput: ContentSeedInput,
  count: number = 3
): PageConfig[] {
  const configs: PageConfig[] = [];
  
  for (let i = 0; i < count; i++) {
    const config = buildSeededPageConfig(baseInput, true, i);
    configs.push(config);
  }
  
  return configs;
}

// Clone configuration with modifications
export function cloneConfigWithModifications(
  baseConfig: PageConfig,
  modifications: {
    brand?: Partial<BrandInfo>;
    sectionVariants?: Record<string, number>;
    sectionProps?: Record<string, Partial<any>>;
  }
): PageConfig {
  const clonedConfig: PageConfig = {
    brand: {
      ...baseConfig.brand,
      ...modifications.brand
    },
    sections: baseConfig.sections.map(section => ({
      ...section,
      variant: modifications.sectionVariants?.[section.id] ?? section.variant,
      props: {
        ...section.props,
        ...modifications.sectionProps?.[section.id]
      }
    }))
  };
  
  return clonedConfig;
}

// Validate configuration completeness
export function validateConfigCompleteness(config: PageConfig): {
  isComplete: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check brand completeness
  if (!config.brand.name) {
    issues.push('Brand name is missing');
  }
  if (!config.brand.industry) {
    suggestions.push('Consider adding industry information');
  }
  if (!config.brand.tone) {
    suggestions.push('Consider specifying brand tone');
  }
  
  // Check sections
  const sectionIds = config.sections.map(s => s.id);
  const requiredSections = [
    'navbar', 'hero', 'socialProof', 'features', 
    'featureSpotlight', 'testimonials', 'metrics', 
    'pricing', 'faq', 'finalCta', 'footer'
  ];
  
  for (const required of requiredSections) {
    if (!sectionIds.includes(required)) {
      issues.push(`Missing required section: ${required}`);
    }
  }
  
  // Check for duplicate sections
  const duplicates = sectionIds.filter((id, index) => sectionIds.indexOf(id) !== index);
  if (duplicates.length > 0) {
    issues.push(`Duplicate sections: ${duplicates.join(', ')}`);
  }
  
  // Check section props completeness
  for (const section of config.sections) {
    if (Object.keys(section.props).length === 0) {
      suggestions.push(`Section ${section.id} has empty props - consider adding content`);
    }
  }
  
  return {
    isComplete: issues.length === 0,
    issues,
    suggestions
  };
}
