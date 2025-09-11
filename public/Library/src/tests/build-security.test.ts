import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Build Security Tests', () => {
  it('should not contain API keys in build artifacts', async () => {
    // This test would run after a build to ensure no secrets leak
    const distPath = path.join(process.cwd(), 'dist');
    
    if (!fs.existsSync(distPath)) {
      console.log('⚠️  No dist folder found - skipping build security test');
      return;
    }
    
    const checkDirectory = (dir: string) => {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          checkDirectory(filePath);
        } else if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.css')) {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Should not contain API keys
          expect(content).not.toContain('sk-');
          expect(content).not.toContain('OPENAI_API_KEY');
          expect(content).not.toContain('VITE_OPENAI_API_KEY');
          
          // Should not contain direct OpenAI API calls
          expect(content).not.toContain('https://api.openai.com');
        }
      }
    };
    
    checkDirectory(distPath);
  });

  it('should have proper environment variable handling', () => {
    // Check that server files use process.env correctly
    const serverFiles = [
      'server/index.ts',
      'server/handlers/aiPlan.ts',
      'server/providers/openai.server.ts',
    ];
    
    for (const file of serverFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Should use process.env for server-side variables
      expect(content).toContain('process.env');
      
      // Should not use import.meta.env (client-side)
      expect(content).not.toContain('import.meta.env');
    }
  });

  it('should have proper client-side environment handling', () => {
    // Check that client files don't use process.env
    const clientFiles = [
      'src/services/aiApi.ts',
      'src/ai/plan/run.ts',
      'src/app/generator/GeneratorPage.tsx',
    ];
    
    for (const file of clientFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Should not use process.env (server-side only)
      expect(content).not.toContain('process.env');
    }
  });
});
