// Client-side API service for AI plan generation
import { PageConfig } from '../types/landing';

export interface AIPlanRequest {
  userSpeech: string;
  creativity?: number;
  specificity?: number;
  keepTone?: boolean;
  brandWords?: string[];
}

export interface AIPlanResponse {
  success: boolean;
  pageConfig: PageConfig;
  warnings: string[];
  error?: string;
  message?: string;
}

// Rate limiting state
let lastRequestTime = 0;
const RATE_LIMIT_MS = 1000; // 1 second

// Call the server-side AI plan endpoint
export async function generateAIPlan(request: AIPlanRequest): Promise<AIPlanResponse> {
  // Rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_MS) {
    const waitTime = RATE_LIMIT_MS - timeSinceLastRequest;
    console.log(`⏳ Rate limiting: waiting ${waitTime}ms...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
  
  try {
    console.log('🤖 Sending AI plan request to server...');
    
    const response = await fetch('/api/ai/plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data: AIPlanResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'AI plan generation failed');
    }
    
    console.log('✅ AI plan generated successfully');
    return data;
    
  } catch (error) {
    console.error('❌ AI plan request failed:', error);
    
    // Return a structured error response
    return {
      success: false,
      pageConfig: {} as PageConfig,
      warnings: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Test server connection
export async function testServerConnection(): Promise<boolean> {
  try {
    const response = await fetch('/health', {
      method: 'GET',
    });
    
    return response.ok;
  } catch (error) {
    console.error('❌ Server connection test failed:', error);
    return false;
  }
}
