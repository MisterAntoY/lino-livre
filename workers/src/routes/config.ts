import { Hono } from 'hono';
import { Bindings } from '../types';

export const configRouter = new Hono<{ Bindings: Bindings }>();

configRouter.get('/api/config', (c) => {
  c.header('Cache-Control', 'public, max-age=300');
  return c.json({ turnstile_site_key: c.env.TURNSTILE_SITE_KEY || null });
});
