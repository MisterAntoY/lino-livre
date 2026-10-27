import { Hono } from 'hono';
import { Bindings } from '../types';

export const pwaApp = new Hono<{ Bindings: Bindings }>();

pwaApp.get('/manifest.webmanifest', async (c) => {
  if (c.env.ASSETS) {
    const res = await c.env.ASSETS.fetch(c.req.raw);
    const newRes = new Response(res.body, res);
    newRes.headers.set('Content-Type', 'application/manifest+json; charset=utf-8');
    newRes.headers.set('Cache-Control', 'public, max-age=86400');
    return newRes;
  }
  return c.text('Not found', 404);
});

pwaApp.get('/manifest.json', async (c) => {
  if (c.env.ASSETS) {
    const res = await c.env.ASSETS.fetch(c.req.raw);
    const newRes = new Response(res.body, res);
    newRes.headers.set('Content-Type', 'application/manifest+json; charset=utf-8');
    newRes.headers.set('Cache-Control', 'public, max-age=86400');
    return newRes;
  }
  return c.text('Not found', 404);
});

pwaApp.get('/sw.js', async (c) => {
  if (c.env.ASSETS) {
    const res = await c.env.ASSETS.fetch(c.req.raw);
    const newRes = new Response(res.body, res);
    newRes.headers.set('Content-Type', 'application/javascript; charset=utf-8');
    newRes.headers.set('Service-Worker-Allowed', '/');
    newRes.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return newRes;
  }
  return c.text('Not found', 404);
});

pwaApp.get('/offline', async (c) => {
  if (c.env.ASSETS) {
    const url = new URL(c.req.url);
    url.pathname = '/offline.html';
    return c.env.ASSETS.fetch(new Request(url.toString(), c.req.raw));
  }
  return c.text('Offline', 503);
});
