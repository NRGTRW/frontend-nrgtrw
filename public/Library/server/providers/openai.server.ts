import { AIPlan } from '../../src/types/landing.ts';

// OpenAI API configuration (server-only)
interface OpenAIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  maxRetries: number;
}

// Default configuration
const DEFAULT_CONFIG: OpenAIConfig = {
  apiKey: process.env.OPENAI_API_KEY || '',
  model: 'gpt-4o-mini',
  temperature: 0.4,
  maxTokens: 4000,
  maxRetries: 2
};

// OpenAI API response structure
interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
  };
}

// Error class for OpenAI API errors
export class OpenAIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'OpenAIError';
  }
}

// Call OpenAI API with structured JSON output (server-only)
export async function callModel(
  promptParts: string[],
  options: {
    json?: boolean;
    temperature?: number;
    config?: Partial<OpenAIConfig>;
  } = {}
): Promise<AIPlan> {
  const config = { 
    ...DEFAULT_CONFIG, 
    ...options.config,
    temperature: options.temperature || DEFAULT_CONFIG.temperature
  };
  
  if (!config.apiKey) {
    // Fallback to fake model for development
    console.warn('⚠️  OpenAI API key not configured. Using fake model for development.');
    const { generateFakePlan } = await import('../../src/ai/localFakeModel.ts');
    return generateFakePlan(promptParts.join('\n\n'));
  }
  
  const systemPrompt = promptParts[0] || '';
  const userPrompt = promptParts.slice(1).join('\n\n');
  
  const messages = [
    {
      role: 'system' as const,
      content: systemPrompt
    },
    {
      role: 'user' as const,
      content: userPrompt
    }
  ];
  
  const requestBody = {
    model: config.model,
    messages,
    temperature: config.temperature,
    max_tokens: config.maxTokens,
    response_format: { type: 'json_object' as const } // Always enforce JSON mode
  };
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt + 1}/${config.maxRetries + 1}...`);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new OpenAIError(
          errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.error?.code
        );
      }
      
      const data: OpenAIResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new OpenAIError('No response choices returned from OpenAI API');
      }
      
      const content = data.choices[0].message.content;
      
      if (!content) {
        throw new OpenAIError('Empty response content from OpenAI API');
      }
      
      // Parse JSON response
      let parsedResponse: AIPlan;
      try {
        parsedResponse = JSON.parse(content);
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }
      
      // Log usage if available
      if (data.usage) {
        console.log(`📊 Tokens used: ${data.usage.total_tokens}`);
      }
      
      console.log('✅ Successfully generated AI plan');
      return parsedResponse;
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < config.maxRetries) {
        console.log(`⚠️  Attempt ${attempt + 1} failed: ${lastError.message}`);
        
        // Add a final chance message for the last retry
        if (attempt === config.maxRetries - 1) {
          console.log(`🔄 Final attempt - adding retry message...`);
          messages.push({
            role: 'system' as const,
            content: 'Return valid JSON only. No prose, no commentary, no explanations.'
          });
        }
        
        console.log(`🔄 Retrying in ${(attempt + 1) * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 1000));
      } else {
        console.log(`❌ All ${config.maxRetries + 1} attempts failed`);
      }
    }
  }
  
  throw lastError || new Error('All retry attempts failed');
}

// Validate API key format
export function validateApiKey(apiKey: string): boolean {
  return apiKey.startsWith('sk-') && apiKey.length > 20;
}

// Test API connection
export async function testConnection(config?: Partial<OpenAIConfig>): Promise<boolean> {
  try {
    const testConfig = { ...DEFAULT_CONFIG, ...config };
    
    if (!testConfig.apiKey) {
      throw new Error('API key not provided');
    }
    
    if (!validateApiKey(testConfig.apiKey)) {
      throw new Error('Invalid API key format');
    }
    
    // Make a simple test request
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${testConfig.apiKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ API connection test failed:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}
