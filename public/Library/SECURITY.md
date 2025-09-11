# Security Implementation

This document outlines the security measures implemented to protect OpenAI API keys and ensure secure AI plan generation.

## API Key Protection

### Server-Side Only
- OpenAI API key is stored in `OPENAI_API_KEY` environment variable (server-side only)
- Never exposed to client-side code or browser bundles
- Server handles all AI API calls internally

### Environment Variables
- `.env.local` contains the API key (gitignored)
- In production, set `OPENAI_API_KEY` in server environment
- Never use `VITE_OPENAI_API_KEY` (exposes to client)

## Client-Server Architecture

### Client Side (`src/services/aiApi.ts`)
- Makes requests to `/api/ai/plan` endpoint
- Implements rate limiting (1 request/second)
- No direct OpenAI API access
- No API key exposure

### Server Side (`server/`)
- Handles all OpenAI API calls
- Validates and sanitizes input
- Implements security guardrails
- Rate limiting and CORS protection

## Security Features

### Input Validation
- User speech limited to 2KB
- HTML sanitization removes dangerous tags
- URL validation (http/https only)
- Array size clamping (features ≤ 6, testimonials ≤ 6, FAQ ≤ 8)

### Rate Limiting
- 1 request per second per client
- Server-side rate limiting middleware
- Client-side request throttling

### CORS Protection
- Configured for localhost development
- Production-ready CORS settings
- No wildcard origins

## Development Setup

1. Create `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   PORT=8787
   ```

2. Start development server:
   ```bash
   npm run dev  # Starts both client and server
   ```

3. Or start individually:
   ```bash
   npm run dev:server  # Server only
   npm start          # Client only
   ```

## Production Deployment

1. Set environment variables on server:
   ```bash
   export OPENAI_API_KEY=sk-your-actual-key
   export PORT=8787
   ```

2. Build and start:
   ```bash
   npm run build:server
   npm run start:server
   ```

## Security Tests

Run security tests to verify implementation:
```bash
npm test src/tests/security.test.ts
npm test src/tests/build-security.test.ts
```

## Verification Checklist

- [ ] No `VITE_OPENAI_API_KEY` in client code
- [ ] No direct OpenAI API calls from client
- [ ] Server handles all AI requests
- [ ] Input validation and sanitization
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] API key never in build artifacts
- [ ] Environment variables properly separated
