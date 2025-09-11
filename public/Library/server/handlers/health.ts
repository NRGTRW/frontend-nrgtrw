import { Context } from 'hono';

export async function healthHandler(c: Context) {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
