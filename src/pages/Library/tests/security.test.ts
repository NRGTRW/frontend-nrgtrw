import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Security Tests', () => {
  it('should not expose OPENAI_API_KEY in client bundle', async () => {
    // This test ensures that the API key is never included in client-side code
    const clientFiles = [
      'src/services/aiApi.ts',
      'src/ai/plan/run.ts',
      'src/app/generator/GeneratorPage.tsx',
    ];
    
    for (const file of clientFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Should not contain any direct API key references
      expect(content).not.toContain('OPENAI_API_KEY');
      expect(content).not.toContain('VITE_OPENAI_API_KEY');
      expect(content).not.toContain('sk-');
      
      // Should not contain direct OpenAI API calls
      expect(content).not.toContain('https://api.openai.com');
      expect(content).not.toContain('Bearer');
    }
  });

  it('should use server endpoint for AI calls', () => {
    const aiApiContent = fs.readFileSync('src/services/aiApi.ts', 'utf8');
    
    // Should use the server endpoint
    expect(aiApiContent).toContain('/api/ai/plan');
    expect(aiApiContent).toContain('fetch(');
    
    // Should not contain direct OpenAI API calls
    expect(aiApiContent).not.toContain('https://api.openai.com');
  });

  it('should have proper rate limiting', () => {
    const aiApiContent = fs.readFileSync('src/services/aiApi.ts', 'utf8');
    
    // Should implement rate limiting
    expect(aiApiContent).toContain('RATE_LIMIT_MS');
    expect(aiApiContent).toContain('lastRequestTime');
  });

  it('should validate input sizes', () => {
    const serverHandlerContent = fs.readFileSync('server/handlers/aiPlan.ts', 'utf8');
    
    // Should have input size validation
    expect(serverHandlerContent).toContain('max(2048)'); // 2KB limit
    expect(serverHandlerContent).toContain('sanitizeText');
  });

  it('should sanitize HTML in user input', () => {
    const serverHandlerContent = fs.readFileSync('server/handlers/aiPlan.ts', 'utf8');
    
    // Should have HTML sanitization
    expect(serverHandlerContent).toContain('HTML_REGEX');
    expect(serverHandlerContent).toContain('sanitizeText');
  });

  it('should have proper CORS configuration', () => {
    const serverContent = fs.readFileSync('server/index.ts', 'utf8');
    
    // Should have CORS configured
    expect(serverContent).toContain('cors');
    expect(serverContent).toContain('localhost:5173');
  });

  it('should have rate limiting middleware', () => {
    const serverContent = fs.readFileSync('server/index.ts', 'utf8');
    
    // Should have rate limiting
    expect(serverContent).toContain('rateLimiter');
    expect(serverContent).toContain('windowMs: 1000');
  });
});
