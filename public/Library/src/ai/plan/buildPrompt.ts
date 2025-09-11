import { ExtractedInfo } from '../nlu/extract';
import { registry } from '../../generator/registry';

export interface PromptParts {
  system: string;
  user: string;
}

export interface BuildPromptOptions {
  userSpeech: string;
  extracted: ExtractedInfo;
  registry: typeof registry;
}

export function buildPrompt({ userSpeech, extracted, registry }: BuildPromptOptions): PromptParts {
  // Load system prompt
  const systemPrompt = `You MUST output ONLY valid JSON that conforms to the provided schema. No prose, no commentary.`;

  // Build user prompt from extracted information
  const userPrompt = buildUserPrompt(userSpeech, extracted, registry);

  return {
    system: systemPrompt,
    user: userPrompt
  };
}

function buildUserPrompt(userSpeech: string, extracted: ExtractedInfo, registry: typeof registry): string {
  const parts: string[] = [];

  // Company summary (natural language)
  parts.push(`Company summary: ${userSpeech}`);

  // Audience and tone hints (natural language)
  const audienceToneHints = [];
  if (extracted.audience) {
    audienceToneHints.push(`targeting ${extracted.audience}`);
  }
  if (extracted.tone) {
    audienceToneHints.push(`with a ${extracted.tone} tone`);
  }
  if (extracted.industry) {
    audienceToneHints.push(`in the ${extracted.industry} industry`);
  }
  
  if (audienceToneHints.length > 0) {
    parts.push(`Audience & tone hints: ${audienceToneHints.join(', ')}`);
  }

  // Goal (natural language)
  if (extracted.goal) {
    parts.push(`Primary goal: ${extracted.goal}`);
  }

  // Must include sections (natural language)
  const mustInclude = [];
  if (extracted.requiredSections.length > 0) {
    mustInclude.push(...extracted.requiredSections.map(section => section.replace(/([A-Z])/g, ' $1').trim()));
  }
  
  // Add number hints as natural language
  Object.entries(extracted.numberHints).forEach(([section, count]) => {
    const sectionName = section.replace(/([A-Z])/g, ' $1').trim();
    mustInclude.push(`${count} ${sectionName} items`);
  });
  
  if (mustInclude.length > 0) {
    parts.push(`Must include sections: ${mustInclude.join(', ')}`);
  }

  // Avoid sections (natural language)
  if (extracted.forbiddenSections.length > 0) {
    const avoidSections = extracted.forbiddenSections.map(section => section.replace(/([A-Z])/g, ' $1').trim());
    parts.push(`Avoid including: ${avoidSections.join(', ')}`);
  }

  // Section intents (natural language)
  Object.entries(extracted.sectionIntents).forEach(([section, intents]) => {
    const sectionName = section.replace(/([A-Z])/g, ' $1').trim();
    parts.push(`For ${sectionName}: include ${intents.join(', ')}`);
  });

  // Brand name suggestions (natural language)
  if (extracted.brandWords.length > 0) {
    parts.push(`Brand name suggestions: ${extracted.brandWords.join(' ')}`);
  }

  // Constraints (natural language)
  parts.push(`Constraints:`);
  parts.push(`- Keep copy concise and benefit-driven`);
  parts.push(`- Avoid HTML tags in any text content`);
  parts.push(`- Use only valid URLs (http/https or relative paths starting with /)`);
  parts.push(`- Include all required sections: navbar, hero, social proof, features, feature spotlight, testimonials, metrics, pricing, FAQ, final call-to-action, footer`);
  parts.push(`- Choose appropriate variants for each section (1-7 available per section)`);
  parts.push(`- Output structured data only per the provided schema`);

  return parts.join('\n');
}
