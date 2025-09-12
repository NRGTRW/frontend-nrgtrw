// Centralized UI strings for consistent messaging

export const UI_STRINGS = {
  // Main labels
  labels: {
    describeBusiness: "Describe your business and what your landing page should include…",
    generateDraft: "Generate draft",
    explainMyPage: "Explain my page",
    nudgeAI: "Nudge AI",
    regenerate: "Regenerate",
    improve: "Improve",
    reroll: "Re-roll",
    lock: "Lock",
    duplicateAsNewVariant: "Duplicate as new variant"
  },

  // Tooltips
  tooltips: {
    generateDraft: "Turn your description into a complete page.",
    explainMyPage: "See why each section and headline was chosen.",
    nudgeAI: "Add a quick note to steer the next generation.",
    keepToneConsistent: "Maintain the same brand voice across all sections.",
    brandWordsToKeep: "Key terms that should appear in your content.",
    creativity: "How creative and unique the content should be.",
    specificity: "How specific and detailed the content should be."
  },

  // Progress substatus messages
  progress: {
    checkingInputs: "Checking inputs…",
    writingHeadlines: "Writing headlines and section copy…",
    mergingPlan: "Merging plan and choosing variants…",
    buildingPage: "Building your page…",
    runningChecks: "Running final checks…",
    done: "Done."
  },

  // Status messages
  status: {
    validating: "Validating your description…",
    planning: "Generating AI plan…",
    composing: "Building page configuration…",
    rendering: "Rendering components…",
    qa: "Quality checking…",
    ready: "Ready!",
    error: "Error occurred"
  },

  // Empty states
  emptyStates: {
    noPage: {
      title: "No page yet",
      body: "Describe your business to generate a draft.",
      cta: "Generate draft"
    },
    noDescription: {
      title: "Start with your vision",
      body: "Tell us about your business and what you want your landing page to achieve.",
      placeholder: "We're a boutique gym for busy professionals… I need hero, pricing with 3 tiers…"
    }
  },

  // AI controls
  aiControls: {
    keepToneConsistent: "Keep tone consistent",
    brandWordsToKeep: "Brand words to keep",
    creativity: "Creativity",
    specificity: "Specificity",
    low: "Low",
    high: "High"
  },

  // Feedback messages
  feedback: {
    success: "✅ Landing page generated successfully!",
    warnings: "Warnings:",
    errors: "Errors:",
    noWarnings: "No issues found.",
    generationComplete: "Your landing page is ready to view!"
  },

  // Help text
  help: {
    describeBusiness: "Be specific about your industry, target audience, and what sections you need. Mention any particular tone or style preferences.",
    brandWords: "Add keywords that should appear in your content, separated by commas.",
    creativity: "Higher creativity means more unique and innovative content. Lower creativity means more conventional and safe content.",
    specificity: "Higher specificity means more detailed and specific content. Lower specificity means more general and broad content."
  }
} as const;

// Helper function to get nested string values
export function getUIString(path: string): string {
  const keys = path.split('.');
  let value: any = UI_STRINGS;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      console.warn(`UI string not found: ${path}`);
      return path;
    }
  }
  
  return value;
}
