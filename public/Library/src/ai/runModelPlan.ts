#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { callModel } from './providers/openai.js';
import { validateAIPlan } from './planSchema.js';
import { applyAIPlan } from './applyPlan.js';
import { buildDefaultConfig } from '../generator/builders.js';
import { PageConfig } from '../types/landing.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load prompt templates
function loadPromptTemplate(filename: string): string {
  const templatePath = path.join(__dirname, 'prompts', filename);
  try {
    return fs.readFileSync(templatePath, 'utf8');
  } catch (error) {
    console.error(`❌ Error loading prompt template ${filename}:`, error);
    process.exit(1);
  }
}

// Parse command line arguments
function parseArgs(args: string[]): {
  description: string;
  inputFile?: string;
  outputFile?: string;
  verbose: boolean;
} {
  let description = '';
  let inputFile: string | undefined;
  let outputFile: string | undefined;
  let verbose = false;
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--desc':
      case '-d':
        if (i + 1 < args.length) {
          inputFile = args[i + 1];
          i++; // Skip next argument
        } else {
          console.error('❌ --desc requires a file path');
          process.exit(1);
        }
        break;
        
      case '--output':
      case '-o':
        if (i + 1 < args.length) {
          outputFile = args[i + 1];
          i++; // Skip next argument
        } else {
          console.error('❌ --output requires a file path');
          process.exit(1);
        }
        break;
        
      case '--verbose':
      case '-v':
        verbose = true;
        break;
        
      case '--help':
      case '-h':
        console.log(`
Usage: ts-node ai/runModelPlan.ts [options] [description]

Options:
  -d, --desc <file>     Read brand description from file
  -o, --output <file>   Output file path (default: PageConfig.json)
  -v, --verbose         Enable verbose logging
  -h, --help           Show this help message

Examples:
  ts-node ai/runModelPlan.ts "A tech startup building AI tools"
  ts-node ai/runModelPlan.ts --desc brandDescription.txt
  ts-node ai/runModelPlan.ts --desc brandDescription.txt --output my-config.json
        `);
        process.exit(0);
        break;
        
      default:
        if (!arg.startsWith('-')) {
          description = arg;
        }
        break;
    }
  }
  
  return { description, inputFile, outputFile, verbose };
}

// Load feedback from file
function loadFeedback(): string {
  const feedbackPath = path.join(__dirname, 'feedback.json');
  try {
    if (fs.existsSync(feedbackPath)) {
      const feedback = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
      if (feedback.notes && feedback.notes.length > 0) {
        return `\n\n## Previous Feedback\n${feedback.notes.map((note: any) => `- ${note.sectionId}: ${note.note}`).join('\n')}`;
      }
    }
  } catch (error) {
    console.log('⚠️  Could not load feedback file:', error);
  }
  return '';
}

// Save telemetry data
function saveTelemetry(config: PageConfig, aiPlan: any, warnings: string[]) {
  const timestamp = new Date().toISOString();
  const telemetryPath = path.join(__dirname, 'logs');
  
  // Create logs directory if it doesn't exist
  if (!fs.existsSync(telemetryPath)) {
    fs.mkdirSync(telemetryPath, { recursive: true });
  }
  
  const telemetryData = {
    timestamp,
    brandHash: config.brand.name.length, // Simple hash
    invalidPropsCount: warnings.length,
    clampedVariantsCount: 0, // Would be calculated from warnings
    sectionCoverage: config.sections.length,
    warnings,
    aiPlan: {
      brand: aiPlan.brand,
      sectionsCount: aiPlan.sections.length
    }
  };
  
  const telemetryFile = path.join(telemetryPath, `${timestamp.replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(telemetryFile, JSON.stringify(telemetryData, null, 2));
  
  console.log(`📊 Telemetry saved to: ${telemetryFile}`);
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const { description, inputFile, outputFile, verbose } = parseArgs(args);
  
  // Get brand description
  let brandDescription: string;
  
  if (inputFile) {
    try {
      brandDescription = fs.readFileSync(inputFile, 'utf8').trim();
      console.log(`📖 Reading brand description from: ${inputFile}`);
    } catch (error) {
      console.error(`❌ Error reading file ${inputFile}:`, error);
      process.exit(1);
    }
  } else if (description) {
    brandDescription = description;
    console.log('📝 Using provided brand description');
  } else {
    console.error('❌ No brand description provided. Use --desc <file> or provide as argument.');
    console.error('   Run with --help for usage information.');
    process.exit(1);
  }
  
  if (!brandDescription) {
    console.error('❌ Brand description cannot be empty');
    process.exit(1);
  }
  
  console.log(`\n🎯 Brand Description: "${brandDescription}"`);
  
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable not set');
    console.error('   Please set your OpenAI API key: export OPENAI_API_KEY=your_key_here');
    process.exit(1);
  }
  
  try {
    // Load prompt templates
    console.log('\n📋 Loading prompt templates...');
    const systemPrompt = loadPromptTemplate('planSystem.md');
    const userPromptTemplate = loadPromptTemplate('planUser.md');
    
    // Load feedback if available
    const feedbackSection = loadFeedback();
    
    // Build user prompt
    const userPrompt = userPromptTemplate
      .replace('{{brandDescription}}', brandDescription)
      .replace('{{brandName}}', 'Your Company') // Could be extracted from description
      .replace('{{industry}}', 'business')
      .replace('{{targetAudience}}', 'customers')
      .replace('{{tone}}', 'corporate')
      .replace('{{feedbackSection}}', feedbackSection);
    
    if (verbose) {
      console.log('\n📝 System Prompt:');
      console.log(systemPrompt);
      console.log('\n📝 User Prompt:');
      console.log(userPrompt);
    }
    
    // Call AI model
    console.log('\n🤖 Calling OpenAI API...');
    const aiPlan = await callModel([systemPrompt, userPrompt], {
      structuredJSON: true
    });
    
    // Validate plan
    console.log('✅ Validating AI plan...');
    const validatedPlan = validateAIPlan(aiPlan);
    console.log(`   ✓ Brand: ${validatedPlan.brand.name}`);
    console.log(`   ✓ Sections: ${validatedPlan.sections.length}`);
    
    // Apply plan to create PageConfig
    console.log('\n🔧 Applying plan to create PageConfig...');
    const baseConfig = buildDefaultConfig(validatedPlan.brand);
    const finalConfig = applyAIPlan(validatedPlan, baseConfig);
    
    // Collect warnings (this would be enhanced in a real implementation)
    const warnings: string[] = [];
    
    // Write outputs
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const planFile = `plan-${timestamp}.json`;
    const configFile = outputFile || 'PageConfig.json';
    
    console.log(`\n💾 Writing outputs...`);
    console.log(`   📄 AI Plan: ${planFile}`);
    console.log(`   📄 Page Config: ${configFile}`);
    
    fs.writeFileSync(planFile, JSON.stringify(validatedPlan, null, 2));
    fs.writeFileSync(configFile, JSON.stringify(finalConfig, null, 2));
    
    // Save telemetry
    saveTelemetry(finalConfig, validatedPlan, warnings);
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`   🏢 Brand: ${finalConfig.brand.name}`);
    console.log(`   🎨 Tone: ${finalConfig.brand.tone || 'corporate'}`);
    console.log(`   🏭 Industry: ${finalConfig.brand.industry || 'business'}`);
    console.log(`   📋 Sections: ${finalConfig.sections.length}`);
    
    if (warnings.length > 0) {
      console.log(`   ⚠️  Warnings: ${warnings.length}`);
      warnings.forEach(warning => console.log(`      • ${warning}`));
    }
    
    console.log('\n🎉 AI plan generation completed successfully!');
    console.log(`\n📁 Files created:`);
    console.log(`   • ${planFile} - Raw AI plan`);
    console.log(`   • ${configFile} - Final page configuration`);
    console.log(`\n🚀 Next steps:`);
    console.log(`   • Review the generated configuration`);
    console.log(`   • Use the preview system to see the results`);
    console.log(`   • Provide feedback using the preview system`);
    console.log(`   • Modify and regenerate as needed`);
    
  } catch (error) {
    console.error('\n❌ Error during plan generation:', error);
    
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
      if (error.stack && verbose) {
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
