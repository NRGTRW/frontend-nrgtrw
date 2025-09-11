#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STYLE_GROUPS = [
  { name: "Minimal", slug: "minimal" },
  { name: "Luxury", slug: "luxury" },
  { name: "Playful", slug: "playful" },
  { name: "Corporate", slug: "corporate" },
  { name: "Brutalist", slug: "brutalist" },
  { name: "Glass", slug: "glass" },
  { name: "Gradient", slug: "gradient" },
  { name: "Monochrome", slug: "mono" },
  { name: "Editorial", slug: "editorial" },
  { name: "Neumorphic", slug: "neumorphic" },
];

const SECTION_CONFIGS = {
  navbar: {
    name: 'Navbar',
    defaultTitle: 'Brand Name',
    defaultSubtitle: '',
    defaultDescription: '',
    defaultCtaText: 'Get Started',
    propsType: 'NavbarProps'
  },
  hero: {
    name: 'Hero',
    defaultTitle: 'Transform Your Business',
    defaultSubtitle: 'Revolutionary solutions for modern challenges',
    defaultDescription: 'Discover innovative approaches that drive growth and success in today\'s competitive landscape.',
    defaultCtaText: 'Start Your Journey',
    propsType: 'HeroProps'
  },
  socialProof: {
    name: 'SocialProof',
    defaultTitle: 'Trusted by Industry Leaders',
    defaultSubtitle: '',
    defaultDescription: 'Join thousands of satisfied customers who have transformed their business with our solutions.',
    defaultCtaText: 'See Success Stories',
    propsType: 'SocialProofProps'
  },
  features: {
    name: 'Features',
    defaultTitle: 'Powerful Features',
    defaultSubtitle: 'Everything you need to succeed',
    defaultDescription: 'Comprehensive tools and capabilities designed to accelerate your growth and maximize efficiency.',
    defaultCtaText: 'Explore Features',
    propsType: 'FeaturesProps'
  },
  featureSpotlight: {
    name: 'FeatureSpotlight',
    defaultTitle: 'Advanced Capabilities',
    defaultSubtitle: 'Cutting-edge technology',
    defaultDescription: 'Experience the next generation of innovation with our advanced feature set.',
    defaultCtaText: 'Learn More',
    propsType: 'FeatureSpotlightProps'
  },
  testimonials: {
    name: 'Testimonials',
    defaultTitle: 'What Our Customers Say',
    defaultSubtitle: 'Real results from real people',
    defaultDescription: 'Hear from satisfied customers who have achieved remarkable success with our platform.',
    defaultCtaText: 'Read All Reviews',
    propsType: 'TestimonialsProps'
  },
  metrics: {
    name: 'Metrics',
    defaultTitle: 'Proven Results',
    defaultSubtitle: 'Numbers that speak for themselves',
    defaultDescription: 'Our platform delivers measurable outcomes that drive business growth and success.',
    defaultCtaText: 'View Full Report',
    propsType: 'MetricsProps'
  },
  pricing: {
    name: 'Pricing',
    defaultTitle: 'Simple, Transparent Pricing',
    defaultSubtitle: 'Choose the plan that fits your needs',
    defaultDescription: 'Flexible pricing options designed to scale with your business growth.',
    defaultCtaText: 'Get Started',
    propsType: 'PricingProps'
  },
  faq: {
    name: 'FAQ',
    defaultTitle: 'Frequently Asked Questions',
    defaultSubtitle: 'Everything you need to know',
    defaultDescription: 'Find answers to common questions about our platform, features, and services.',
    defaultCtaText: 'Contact Support',
    propsType: 'FAQProps'
  },
  finalCta: {
    name: 'FinalCta',
    defaultTitle: 'Ready to Get Started?',
    defaultSubtitle: 'Join thousands of satisfied customers',
    defaultDescription: 'Take the first step towards transforming your business today.',
    defaultCtaText: 'Start Now',
    propsType: 'FinalCtaProps'
  },
  footer: {
    name: 'Footer',
    defaultTitle: 'Stay Connected',
    defaultSubtitle: '',
    defaultDescription: 'Follow us for updates, insights, and exclusive content.',
    defaultCtaText: 'Subscribe',
    propsType: 'FooterProps'
  }
};

// Variation knobs for generating distinct variants
const LAYOUT_OPTIONS = ['center', 'split', 'left', 'right', 'top'];
const DENSITY_OPTIONS = ['compact', 'regular', 'roomy'];
const ORNAMENT_OPTIONS = ['minimal', 'moderate', 'rich'];
const CTA_STYLE_OPTIONS = ['solid', 'outline', 'ghost'];
const TYPOGRAPHY_OPTIONS = ['small', 'medium', 'large'];
const MOTION_OPTIONS = ['none', 'fade', 'slide'];

function generateVariationKnobs(variantNumber) {
  return {
    layout: LAYOUT_OPTIONS[variantNumber % LAYOUT_OPTIONS.length],
    density: DENSITY_OPTIONS[variantNumber % DENSITY_OPTIONS.length],
    ornament: ORNAMENT_OPTIONS[variantNumber % ORNAMENT_OPTIONS.length],
    ctaStyle: CTA_STYLE_OPTIONS[variantNumber % CTA_STYLE_OPTIONS.length],
    typography: TYPOGRAPHY_OPTIONS[variantNumber % TYPOGRAPHY_OPTIONS.length],
    motion: MOTION_OPTIONS[variantNumber % MOTION_OPTIONS.length]
  };
}

function loadTemplate() {
  const templatePath = path.join(__dirname, 'templates', 'SectionVariant.tpl');
  return fs.readFileSync(templatePath, 'utf-8');
}

function generateComponentContent(config, sectionConfig) {
  const template = loadTemplate();
  const knobs = generateVariationKnobs(config.variantNumber);
  const styleName = STYLE_GROUPS.find(g => g.slug === config.styleSlug)?.name || 'Minimal';
  const componentName = `${sectionConfig.name}${styleName}V${config.variantNumber.toString().padStart(2, '0')}`;
  
  return template
    .replace(/<%= propsType %>/g, sectionConfig.propsType)
    .replace(/<%= componentName %>/g, componentName)
    .replace(/<%= styleSlug %>/g, config.styleSlug)
    .replace(/<%= defaultTitle %>/g, sectionConfig.defaultTitle)
    .replace(/<%= defaultSubtitle %>/g, sectionConfig.defaultSubtitle)
    .replace(/<%= defaultDescription %>/g, sectionConfig.defaultDescription)
    .replace(/<%= defaultCtaText %>/g, sectionConfig.defaultCtaText)
    .replace(/<%= layout %>/g, knobs.layout)
    .replace(/<%= density %>/g, knobs.density)
    .replace(/<%= ornament %>/g, knobs.ornament)
    .replace(/<%= ctaStyle %>/g, knobs.ctaStyle)
    .replace(/<%= typography %>/g, knobs.typography)
    .replace(/<%= motion %>/g, knobs.motion);
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateVariantsForSection(sectionId, perStyle = 10) {
  console.log(`Starting generation for section: ${sectionId}`);
  const sectionConfig = SECTION_CONFIGS[sectionId];
  if (!sectionConfig) {
    console.error(`Unknown section: ${sectionId}`);
    process.exit(1);
  }

  console.log(`Generating ${perStyle} variants per style for ${sectionId}...`);

  const sectionDir = path.join(__dirname, '../../src/components', sectionConfig.name);
  console.log(`Section directory: ${sectionDir}`);
  const exports = [];
  const imports = [];
  const meta = [];

  // Generate variants for each style
  for (const styleGroup of STYLE_GROUPS) {
    const styleDir = path.join(sectionDir, styleGroup.name);
    ensureDirectoryExists(styleDir);

    for (let i = 1; i <= perStyle; i++) {
      const config = {
        sectionId,
        perStyle,
        styleSlug: styleGroup.slug,
        variantNumber: i
      };

      const componentName = `${sectionConfig.name}${styleGroup.name}V${i.toString().padStart(2, '0')}`;
      const fileName = `${sectionConfig.name}.${styleGroup.name}.V${i.toString().padStart(2, '0')}.tsx`;
      const filePath = path.join(styleDir, fileName);

      const content = generateComponentContent(config, sectionConfig);
      fs.writeFileSync(filePath, content);

      // Track for registry
      const importPath = `./${styleGroup.name}/${fileName.replace('.tsx', '')}`;
      imports.push(`import ${componentName} from '${importPath}';`);
      exports.push(`  ${componentName},`);
      
      meta.push({
        idx: (STYLE_GROUPS.indexOf(styleGroup) * perStyle) + i - 1,
        style: styleGroup.slug,
        importPath,
        exportName: componentName
      });

      console.log(`  Generated ${fileName}`);
    }
  }

  // Create index file for the section
  const indexContent = `${imports.join('\n')}\n\nexport {\n${exports.join('\n')}\n};`;
  fs.writeFileSync(path.join(sectionDir, 'index.ts'), indexContent);

  // Create manifest
  const manifest = {
    styleGroups: STYLE_GROUPS.map(g => g.slug),
    perStyleCount: perStyle,
    totalVariants: STYLE_GROUPS.length * perStyle,
    meta
  };
  fs.writeFileSync(path.join(sectionDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`✅ Generated ${STYLE_GROUPS.length * perStyle} variants for ${sectionId}`);
  return manifest;
}

// CLI handling
function main() {
  console.log('Script started');
  const args = process.argv.slice(2);
  console.log('Args:', args);
  const sectionId = args[0];
  const perStyleArg = args.find(arg => arg.startsWith('--per-style'));
  const perStyle = perStyleArg ? parseInt(perStyleArg.split('=')[1]) || 10 : 10;

  if (!sectionId) {
    console.log('Usage: npm run variants:bulk <sectionId> [--per-style=10]');
    console.log('Available sections:', Object.keys(SECTION_CONFIGS).join(', '));
    process.exit(1);
  }

  if (!SECTION_CONFIGS[sectionId]) {
    console.error(`Unknown section: ${sectionId}`);
    console.log('Available sections:', Object.keys(SECTION_CONFIGS).join(', '));
    process.exit(1);
  }

  try {
    const manifest = generateVariantsForSection(sectionId, perStyle);
    console.log(`🎉 Successfully generated ${manifest.totalVariants} variants for ${sectionId}`);
  } catch (error) {
    console.error('Error generating variants:', error);
    process.exit(1);
  }
}

// Check if this script is being run directly
if (process.argv[1] && process.argv[1].endsWith('bulkAddVariants.js')) {
  main();
}

export { generateVariantsForSection, SECTION_CONFIGS };
