#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SECTION_CONFIGS = {
  navbar: { name: 'Navbar' },
  hero: { name: 'Hero' },
  socialProof: { name: 'SocialProof' },
  features: { name: 'Features' },
  featureSpotlight: { name: 'FeatureSpotlight' },
  testimonials: { name: 'Testimonials' },
  metrics: { name: 'Metrics' },
  pricing: { name: 'Pricing' },
  faq: { name: 'FAQ' },
  finalCta: { name: 'FinalCta' },
  footer: { name: 'Footer' }
};

function loadVariantMetadata() {
  const metadata = {};
  
  Object.keys(SECTION_CONFIGS).forEach(sectionId => {
    const sectionConfig = SECTION_CONFIGS[sectionId];
    const manifestPath = path.join(__dirname, '../src/components', sectionConfig.name, 'manifest.json');
    
    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        metadata[sectionId] = manifest.meta || [];
        console.log(`✅ Loaded ${metadata[sectionId].length} variants for ${sectionId}`);
      } catch (error) {
        console.error(`❌ Error loading manifest for ${sectionId}:`, error.message);
        metadata[sectionId] = [];
      }
    } else {
      console.log(`⚠️  No manifest found for ${sectionId}, using empty metadata`);
      metadata[sectionId] = [];
    }
  });
  
  return metadata;
}

function generateRegistryUpdate(metadata) {
  const registryPath = path.join(__dirname, '../src/generator/registry.ts');
  
  if (!fs.existsSync(registryPath)) {
    console.error('Registry file not found');
    return;
  }
  
  let registryContent = fs.readFileSync(registryPath, 'utf-8');
  
  // Update each section's meta array
  Object.keys(metadata).forEach(sectionId => {
    const metaArray = metadata[sectionId];
    const metaString = JSON.stringify(metaArray, null, 4);
    
    // Replace the meta array for this section
    const metaRegex = new RegExp(`(${sectionId}:\\s*{[^}]*meta:\\s*)\\[[^\\]]*\\]`, 'g');
    registryContent = registryContent.replace(metaRegex, `$1${metaString}`);
  });
  
  fs.writeFileSync(registryPath, registryContent);
  console.log('✅ Updated registry with variant metadata');
}

function main() {
  console.log('Loading variant metadata...');
  const metadata = loadVariantMetadata();
  
  console.log('Updating registry...');
  generateRegistryUpdate(metadata);
  
  console.log('🎉 Registry updated successfully!');
}

if (process.argv[1] && process.argv[1].endsWith('loadVariantMetadata.js')) {
  main();
}

export { loadVariantMetadata };
