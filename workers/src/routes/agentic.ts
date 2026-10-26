import { Hono } from 'hono';
import { Bindings } from '../types';

export const agenticRouter = new Hono<{ Bindings: Bindings }>();

// ==================== AGENTIC WEB & DISCOVERY (llms.txt & ai-catalog.json) ====================
agenticRouter.get('/llms.txt', async (c) => {
  if (c.env.ASSETS) {
    const res = await c.env.ASSETS.fetch(c.req.raw);
    const newRes = new Response(res.body, res);
    newRes.headers.set('Content-Type', 'text/markdown; charset=utf-8');
    newRes.headers.set('Cache-Control', 'public, max-age=86400');
    return newRes;
  }
  return c.text('# LinoDigital — Lino Livre | Conhecimento Aberto para Todos\n\n> LinoDigital é a marca institucional de tecnologia e conhecimento livre. O Lino Livre é a sua biblioteca digital pública de livros em domínio público e cursos livres gratuitos.', 200, {
    'Content-Type': 'text/markdown; charset=utf-8',
    'Cache-Control': 'public, max-age=86400'
  });
});

agenticRouter.get('/llms-full.txt', async (c) => {
  if (c.env.ASSETS) {
    const res = await c.env.ASSETS.fetch(c.req.raw);
    const newRes = new Response(res.body, res);
    newRes.headers.set('Content-Type', 'text/markdown; charset=utf-8');
    newRes.headers.set('Cache-Control', 'public, max-age=86400');
    return newRes;
  }
  return c.text('# LinoDigital — Lino Livre | Documentação Técnica Completa para Modelos de Linguagem\n\nAPI REST: GET /api/livros, GET /api/cursos, GET /api/busca/federada, GET /api/dashboard.', 200, {
    'Content-Type': 'text/markdown; charset=utf-8',
    'Cache-Control': 'public, max-age=86400'
  });
});

export const servirAiCatalogWorker = async (c: any) => {
  if (c.env.ASSETS) {
    const res = await c.env.ASSETS.fetch(c.req.raw);
    const newRes = new Response(res.body, res);
    newRes.headers.set('Content-Type', 'application/json; charset=utf-8');
    newRes.headers.set('Cache-Control', 'public, max-age=86400');
    return newRes;
  }
  return c.json({
    specVersion: '1.0.0',
    name: 'LinoDigital',
    description: 'LinoDigital é a marca institucional de tecnologia e conhecimento livre. O Lino Livre é a sua biblioteca digital pública e comunitária de indexação e busca educacional de livros digitais em domínio público e cursos abertos.',
    url: 'https://linolivre.org',
    documentationUrl: 'https://linolivre.org/llms.txt',
    entries: [
      {
        identifier: 'urn:linolivre:tools:buscar_livros',
        displayName: 'Buscar Livros Digitais Abertos',
        url: 'https://linolivre.org/api/livros'
      },
      {
        identifier: 'urn:linolivre:tools:buscar_cursos',
        displayName: 'Buscar Cursos Gratuitos',
        url: 'https://linolivre.org/api/cursos'
      }
    ]
  }, 200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=86400'
  });
};

agenticRouter.get('/.well-known/ai-catalog.json', servirAiCatalogWorker);
agenticRouter.get('/ai-catalog.json', servirAiCatalogWorker);

export const SECURITY_TXT = [
  'Contact: mailto:bv6alblu6@mozmail.com',
  'Expires: 2027-10-23T00:00:00.000Z',
  'Preferred-Languages: pt, en',
  'Canonical: https://lino-livre.linolivre.workers.dev/.well-known/security.txt',
  'Policy: https://lino-livre.linolivre.workers.dev/legal',
  ''
].join('\n');

agenticRouter.get('/.well-known/security.txt', async (c) => {
  if (c.env.ASSETS) {
    try {
      const res = await c.env.ASSETS.fetch(c.req.raw);
      if (res.ok) {
        const newRes = new Response(res.body, res);
        newRes.headers.set('Content-Type', 'text/plain; charset=utf-8');
        newRes.headers.set('Cache-Control', 'public, max-age=86400');
        return newRes;
      }
    } catch { /* usa o conteúdo embutido */ }
  }
  return c.text(SECURITY_TXT, 200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=86400'
  });
});
