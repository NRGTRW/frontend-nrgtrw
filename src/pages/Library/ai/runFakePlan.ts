#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateFakePlan } from './localFakeModel.js';
import { validateAIPlan } from './planSchema.js';
import { applyAIPlan } from './applyPlan.js';
import { buildDefaultConfig } from '../generator/builders.js';
import { PageConfig } from '../types/landing.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: ts-node ai/runFakePlan.ts [brandDescription.txt]');
    console.error('If no file provided, will use default description.');
    process.exit(1);
  }
  
  const inputFile = args[0];
  let brandDescription: string;
  
  try {
    if (fs.existsSync(inputFile)) {
      brandDescription = fs.readFileSync(inputFile, 'utf8').trim();
      console.log(`📖 Reading brand description from: ${inputFile}`);
    } else {
      brandDescription = inputFile; // Treat as direct input
      console.log('📝 Using provided brand description');
    }
  } catch (error) {
    console.error('❌ Error reading input:', error);
    process.exit(1);
  }
  
  if (!brandDescription) {
    console.error('❌ Brand description cannot be empty');
    process.exit(1);
  }
  
  console.log(`\n🎯 Brand Description: "${brandDescription}"`);
  
  try {
    // Step 1: Generate fake plan
    console.log('\n🤖 Generating AI plan...');
    const aiPlan = generateFakePlan(brandDescription);
    
    // Step 2: Validate plan
    console.log('✅ Validating plan schema...');
    const validatedPlan = validateAIPlan(aiPlan);
    console.log(`   ✓ Brand: ${validatedPlan.brand.name}`);
    console.log(`   ✓ Sections: ${validatedPlan.sections.length}`);
    
    // Step 3: Apply plan to create PageConfig
    console.log('\n🔧 Applying plan to create PageConfig...');
    const baseConfig = buildDefaultConfig(validatedPlan.brand);
    const finalConfig = applyAIPlan(validatedPlan, baseConfig);
    
    // Step 4: Write outputs
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const planFile = `plan-${timestamp}.json`;
    const configFile = 'PageConfig.json';
    
    console.log(`\n💾 Writing outputs...`);
    console.log(`   📄 AI Plan: ${planFile}`);
    console.log(`   📄 Page Config: ${configFile}`);
    
    fs.writeFileSync(planFile, JSON.stringify(validatedPlan, null, 2));
    fs.writeFileSync(configFile, JSON.stringify(finalConfig, null, 2));
    
    // Step 5: Summary
    console.log('\n📊 Summary:');
    console.log(`   🏢 Brand: ${finalConfig.brand.name}`);
    console.log(`   🎨 Tone: ${finalConfig.brand.tone || 'corporate'}`);
    console.log(`   🏭 Industry: ${finalConfig.brand.industry || 'business'}`);
    console.log(`   📋 Sections: ${finalConfig.sections.length}`);
    
    // Show variant distribution
    const variantCounts: Record<string, Record<number, number>> = {};
    finalConfig.sections.forEach(section => {
      if (!variantCounts[section.id]) {
        variantCounts[section.id] = {};
      }
      variantCounts[section.id][section.variant] = (variantCounts[section.id][section.variant] || 0) + 1;
    });
    
    console.log('\n🎲 Variant Distribution:');
    Object.entries(variantCounts).forEach(([sectionId, variants]) => {
      const variantList = Object.entries(variants)
        .map(([variant, count]) => `V${variant}(${count})`)
        .join(', ');
      console.log(`   ${sectionId}: ${variantList}`);
    });
    
    console.log('\n🎉 AI plan generation completed successfully!');
    console.log(`\n📁 Files created:`);
    console.log(`   • ${planFile} - Raw AI plan`);
    console.log(`   • ${configFile} - Final page configuration`);
    console.log(`\n🚀 Next steps:`);
    console.log(`   • Review the generated configuration`);
    console.log(`   • Use the preview system to see the results`);
    console.log(`   • Modify and regenerate as needed`);
    
  } catch (error) {
    console.error('\n❌ Error during plan generation:', error);
    
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
      if (error.stack) {
        console.error(`   Stack: ${error.stack}`);
      }
    }
    
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}
