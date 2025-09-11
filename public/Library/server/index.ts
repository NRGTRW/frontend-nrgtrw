import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { aiPlanHandler } from './handlers/aiPlan';
import { healthHandler } from './handlers/health';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Simple rate limiting middleware
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

app.use('/api/*', async (c, next) => {
  const clientId = c.req.header('x-forwarded-for') || 'anonymous';
  const now = Date.now();
  const windowMs = 1000; // 1 second
  const limit = 1;
  
  const clientData = rateLimitMap.get(clientId);
  
  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + windowMs });
    await next();
  } else if (clientData.count < limit) {
    clientData.count++;
    await next();
  } else {
    return c.json({ error: 'Rate limit exceeded' }, 429);
  }
});

// Routes
app.get('/health', healthHandler);
app.post('/api/ai/plan', aiPlanHandler);

// Error handling
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

const port = process.env.PORT || 8787;

console.log(`🚀 Server starting on port ${port}`);

// For development, we'll use a simple approach
if (import.meta.main) {
  // This will be handled by tsx
  console.log(`✅ Server ready on http://localhost:${port}`);
}
