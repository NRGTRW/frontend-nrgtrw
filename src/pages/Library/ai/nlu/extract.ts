// Natural Language Understanding - Extract structured data from user speech
// No AI involved, just keyword-based heuristics

export interface ExtractedInfo {
  industry?: string;
  audience?: string;
  tone?: 'luxury' | 'playful' | 'minimal' | 'corporate' | 'bold';
  goal?: string;
  requiredSections: string[];
  forbiddenSections: string[];
  brandWords: string[];
  numberHints: Record<string, number>; // e.g., { 'pricing': 3, 'faq': 5 }
  sectionIntents: Record<string, string[]>; // e.g., { 'pricing': ['comparison table'] }
}

// Industry keywords mapping (expanded)
const INDUSTRY_KEYWORDS = {
  technology: ['tech', 'software', 'app', 'digital', 'ai', 'data', 'platform', 'developers', 'startup', 'saas', 'api', 'cloud', 'coding', 'programming', 'devops', 'cybersecurity', 'blockchain', 'machine learning', 'automation', 'software development'],
  healthcare: ['health', 'medical', 'patient', 'doctor', 'clinic', 'healthcare', 'hospital', 'therapy', 'wellness', 'pharmaceutical', 'telemedicine', 'mental health', 'dental', 'veterinary', 'nursing', 'medical device'],
  finance: ['finance', 'bank', 'money', 'investment', 'financial', 'trading', 'crypto', 'fintech', 'payment', 'insurance', 'accounting', 'tax', 'wealth management', 'credit', 'loan', 'mortgage', 'forex', 'stocks'],
  education: ['education', 'school', 'student', 'learn', 'teach', 'learning', 'online', 'course', 'training', 'university', 'college', 'tutoring', 'e-learning', 'academic', 'research', 'scholarship', 'curriculum'],
  ecommerce: ['shop', 'store', 'sell', 'commerce', 'retail', 'ecommerce', 'marketplace', 'product', 'inventory', 'shopping', 'boutique', 'fashion', 'electronics', 'books', 'gifts', 'dropshipping'],
  fitness: ['gym', 'fitness', 'workout', 'exercise', 'health', 'training', 'sport', 'wellness', 'yoga', 'pilates', 'crossfit', 'personal trainer', 'nutrition', 'weight loss', 'muscle building'],
  realEstate: ['real estate', 'property', 'house', 'home', 'apartment', 'rental', 'mortgage', 'realtor', 'broker', 'commercial property', 'land', 'construction', 'renovation'],
  food: ['restaurant', 'food', 'cafe', 'catering', 'delivery', 'dining', 'kitchen', 'chef', 'cooking', 'recipe', 'bakery', 'bar', 'pub', 'fast food', 'fine dining'],
  travel: ['travel', 'tourism', 'hotel', 'vacation', 'booking', 'trip', 'destination', 'airline', 'cruise', 'adventure', 'sightseeing', 'travel agency', 'accommodation'],
  consulting: ['consulting', 'consultant', 'advisory', 'strategy', 'business', 'professional services', 'management', 'coaching', 'mentoring', 'expertise', 'specialist'],
  marketing: ['marketing', 'advertising', 'brand', 'social media', 'seo', 'content', 'campaign', 'promotion', 'pr', 'influencer', 'digital marketing', 'email marketing'],
  legal: ['law', 'legal', 'attorney', 'lawyer', 'court', 'litigation', 'contract', 'compliance', 'intellectual property', 'corporate law', 'criminal defense'],
  nonprofit: ['nonprofit', 'charity', 'foundation', 'volunteer', 'donation', 'cause', 'community', 'social impact', 'ngo', 'philanthropy']
};

// Tone keywords mapping
const TONE_KEYWORDS = {
  luxury: ['luxury', 'premium', 'exclusive', 'elite', 'high-end', 'sophisticated', 'upscale'],
  playful: ['fun', 'creative', 'playful', 'colorful', 'energetic', 'vibrant', 'quirky', 'casual'],
  minimal: ['simple', 'clean', 'minimal', 'essential', 'streamlined', 'focused', 'uncluttered'],
  corporate: ['professional', 'corporate', 'business', 'enterprise', 'formal', 'serious', 'reliable'],
  bold: ['bold', 'revolutionary', 'breakthrough', 'innovative', 'cutting-edge', 'aggressive', 'dramatic']
};

// Audience keywords mapping (expanded)
const AUDIENCE_KEYWORDS = {
  'developers': ['developers', 'programmers', 'engineers', 'coders', 'tech teams', 'software engineers', 'frontend', 'backend', 'full stack', 'devops engineers', 'data scientists'],
  'businesses': ['businesses', 'companies', 'enterprises', 'organizations', 'b2b', 'corporations', 'firms', 'agencies', 'institutions'],
  'consumers': ['consumers', 'customers', 'users', 'individuals', 'b2c', 'shoppers', 'buyers', 'clients', 'end users'],
  'professionals': ['professionals', 'executives', 'managers', 'leaders', 'experts', 'consultants', 'specialists', 'directors', 'ceos', 'cfo', 'cto'],
  'students': ['students', 'learners', 'academics', 'researchers', 'educators', 'teachers', 'professors', 'scholars', 'graduates'],
  'healthcare professionals': ['doctors', 'nurses', 'healthcare workers', 'medical professionals', 'physicians', 'surgeons', 'therapists', 'dentists', 'veterinarians'],
  'small businesses': ['small business', 'startups', 'entrepreneurs', 'smes', 'local business', 'family business', 'mom and pop', 'independent business'],
  'parents': ['parents', 'mothers', 'fathers', 'families', 'moms', 'dads', 'guardians', 'caregivers'],
  'seniors': ['seniors', 'elderly', 'retirees', 'senior citizens', 'aging adults', 'golden years'],
  'millennials': ['millennials', 'gen y', 'young adults', 'twenty somethings', 'thirty somethings'],
  'gen z': ['gen z', 'generation z', 'teens', 'teenagers', 'young people', 'digital natives'],
  'fitness enthusiasts': ['fitness enthusiasts', 'gym goers', 'athletes', 'runners', 'cyclists', 'yogis', 'bodybuilders'],
  'food lovers': ['food lovers', 'foodies', 'chefs', 'cooks', 'culinary enthusiasts', 'restaurant goers'],
  'travelers': ['travelers', 'tourists', 'vacationers', 'adventurers', 'explorers', 'backpackers', 'business travelers']
};

// Section keywords mapping (expanded)
const SECTION_KEYWORDS = {
  hero: ['hero', 'headline', 'main banner', 'above the fold', 'landing', 'intro', 'welcome'],
  pricing: ['pricing', 'plans', 'cost', 'price', 'subscription', 'tiers', 'packages', 'rates', 'billing', 'comparison table'],
  features: ['features', 'benefits', 'capabilities', 'what we offer', 'advantages', 'highlights', 'key features'],
  testimonials: ['testimonials', 'reviews', 'feedback', 'customer stories', 'success stories', 'case studies', 'client reviews'],
  faq: ['faq', 'questions', 'help', 'support', 'frequently asked', 'common questions', 'q&a'],
  contact: ['contact', 'get in touch', 'reach out', 'contact us', 'get in contact'],
  about: ['about', 'our story', 'who we are', 'company', 'mission', 'vision', 'values'],
  portfolio: ['portfolio', 'work', 'projects', 'case studies', 'gallery', 'showcase', 'examples'],
  blog: ['blog', 'news', 'articles', 'insights', 'updates', 'posts', 'content'],
  team: ['team', 'staff', 'people', 'leadership', 'employees', 'founders', 'about us'],
  socialProof: ['logos', 'clients', 'trusted by', 'partners', 'customers', 'brands'],
  metrics: ['stats', 'numbers', 'metrics', 'results', 'achievements', 'kpis', 'data'],
  finalCta: ['cta', 'call to action', 'get started', 'sign up', 'try now', 'contact us']
};

// Goal keywords mapping
const GOAL_KEYWORDS = {
  'generate leads': ['leads', 'lead generation', 'signups', 'registrations', 'inquiries'],
  'drive sales': ['sales', 'revenue', 'conversions', 'purchases', 'checkout'],
  'build awareness': ['awareness', 'brand', 'visibility', 'recognition', 'marketing'],
  'educate users': ['education', 'training', 'learning', 'tutorials', 'documentation'],
  'showcase work': ['portfolio', 'showcase', 'gallery', 'examples', 'case studies'],
  'build community': ['community', 'social', 'networking', 'engagement', 'membership']
};

export function extract(userSpeech: string): ExtractedInfo {
  const text = userSpeech.toLowerCase();
  const words = text.split(/\s+/);
  
  // Extract industry
  const industry = extractIndustry(text, words);
  
  // Extract audience
  const audience = extractAudience(text, words);
  
  // Extract tone
  const tone = extractTone(text, words);
  
  // Extract goal
  const goal = extractGoal(text, words);
  
  // Extract required sections
  const requiredSections = extractRequiredSections(text, words);
  
  // Extract forbidden sections (negative keywords)
  const forbiddenSections = extractForbiddenSections(text, words);
  
  // Extract brand words (first few words that look like company name)
  const brandWords = extractBrandWords(userSpeech);
  
  // Extract number hints (e.g., "3 pricing tiers", "5 FAQs")
  const numberHints = extractNumberHints(text, words);
  
  // Extract section intents (e.g., "comparison table", "testimonials")
  const sectionIntents = extractSectionIntents(text, words);
  
  return {
    industry,
    audience,
    tone,
    goal,
    requiredSections,
    forbiddenSections,
    brandWords,
    numberHints,
    sectionIntents
  };
}

function extractIndustry(text: string, words: string[]): string | undefined {
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return industry;
    }
  }
  return undefined;
}

function extractAudience(text: string, words: string[]): string | undefined {
  for (const [audience, keywords] of Object.entries(AUDIENCE_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return audience;
    }
  }
  return undefined;
}

function extractTone(text: string, words: string[]): ExtractedInfo['tone'] {
  for (const [tone, keywords] of Object.entries(TONE_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return tone as ExtractedInfo['tone'];
    }
  }
  return undefined;
}

function extractGoal(text: string, words: string[]): string | undefined {
  for (const [goal, keywords] of Object.entries(GOAL_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return goal;
    }
  }
  return undefined;
}

function extractRequiredSections(text: string, words: string[]): string[] {
  const sections: string[] = [];
  
  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      sections.push(section);
    }
  }
  
  // Look for explicit section mentions with numbers
  const numberSectionPattern = /(\d+)\s+(pricing|tiers?|plans?|features?|testimonials?|faqs?)/gi;
  const matches = text.match(numberSectionPattern);
  if (matches) {
    matches.forEach(match => {
      const section = match.replace(/\d+\s+/, '').toLowerCase();
      if (section.includes('pricing') || section.includes('tier') || section.includes('plan')) {
        sections.push('pricing');
      } else if (section.includes('feature')) {
        sections.push('features');
      } else if (section.includes('testimonial')) {
        sections.push('testimonials');
      } else if (section.includes('faq')) {
        sections.push('faq');
      }
    });
  }
  
  return [...new Set(sections)]; // Remove duplicates
}

function extractForbiddenSections(text: string, words: string[]): string[] {
  const forbidden: string[] = [];
  
  // Look for negative keywords
  const negativePatterns = [
    /no\s+(pricing|contact|about|blog|team)/gi,
    /without\s+(pricing|contact|about|blog|team)/gi,
    /don't\s+need\s+(pricing|contact|about|blog|team)/gi,
    /skip\s+(pricing|contact|about|blog|team)/gi
  ];
  
  negativePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const section = match.replace(/(no|without|don't need|skip)\s+/i, '').toLowerCase();
        forbidden.push(section);
      });
    }
  });
  
  return [...new Set(forbidden)];
}

function extractBrandWords(speech: string): string[] {
  // Extract first few words that look like a company name
  const words = speech.split(/\s+/).slice(0, 4);
  return words.filter(word => 
    word.length > 1 && 
    !['we', 'are', 'a', 'an', 'the', 'our', 'my', 'company', 'business'].includes(word.toLowerCase())
  );
}

function extractNumberHints(text: string, words: string[]): Record<string, number> {
  const hints: Record<string, number> = {};
  
  // Look for patterns like "3 pricing tiers", "5 FAQs", "2 testimonials"
  const numberSectionPattern = /(\d+)\s+(pricing|tiers?|plans?|features?|testimonials?|faqs?|reviews?|sections?|items?)/gi;
  const matches = text.match(numberSectionPattern);
  
  if (matches) {
    matches.forEach(match => {
      const numberMatch = match.match(/(\d+)/);
      const sectionMatch = match.match(/(pricing|tiers?|plans?|features?|testimonials?|faqs?|reviews?|sections?|items?)/i);
      
      if (numberMatch && sectionMatch) {
        const number = parseInt(numberMatch[1]);
        const section = sectionMatch[1].toLowerCase();
        
        // Map to section names
        if (section.includes('pricing') || section.includes('tier') || section.includes('plan')) {
          hints.pricing = number;
        } else if (section.includes('feature')) {
          hints.features = number;
        } else if (section.includes('testimonial') || section.includes('review')) {
          hints.testimonials = number;
        } else if (section.includes('faq')) {
          hints.faq = number;
        }
      }
    });
  }
  
  return hints;
}

function extractSectionIntents(text: string, words: string[]): Record<string, string[]> {
  const intents: Record<string, string[]> = {};
  
  // Section-specific intent keywords
  const intentKeywords = {
    pricing: ['comparison table', 'pricing table', 'feature comparison', 'plan comparison', 'tier comparison'],
    testimonials: ['customer stories', 'success stories', 'case studies', 'client reviews', 'user feedback'],
    features: ['feature list', 'capability list', 'benefit list', 'key features', 'main features'],
    faq: ['common questions', 'frequently asked', 'help section', 'support section', 'q&a'],
    hero: ['main banner', 'landing section', 'intro section', 'welcome section'],
    contact: ['contact form', 'get in touch', 'reach out', 'contact us'],
    about: ['company story', 'our mission', 'about us', 'who we are'],
    team: ['team section', 'our team', 'staff', 'leadership', 'founders']
  };
  
  // Check for intent keywords
  for (const [section, keywords] of Object.entries(intentKeywords)) {
    const foundIntents = keywords.filter(keyword => text.includes(keyword));
    if (foundIntents.length > 0) {
      intents[section] = foundIntents;
    }
  }
  
  return intents;
}
