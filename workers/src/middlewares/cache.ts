import { MiddlewareHandler } from 'hono';
import { Bindings } from '../types';

/**
 * Cache de borda para rotas públicas.
 * Utiliza o Cache API da Cloudflare (`caches.default`) para responder diretamente
 * a partir do colo sem invocar o handler nem efetuar leituras na D1.
 */
export const cacheDeBorda: MiddlewareHandler<{ Bindings: Bindings }> = async (c, next) => {
  if (c.req.method !== 'GET') return await next();
  const cache = typeof caches !== 'undefined' ? (caches as any).default : null;
  if (!cache) return await next();
  const key = new Request(c.req.url, { method: 'GET' });
  const hit = await cache.match(key);
  if (hit) return hit;
  await next();
  if (c.res.status === 200) {
    c.executionCtx.waitUntil(cache.put(key, c.res.clone()));
  }
};
