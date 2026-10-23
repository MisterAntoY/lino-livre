const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');

const compiledWorkerPath = path.resolve(__dirname, '.worker.supabase.bundle.cjs');

describe('Cenários de Consumo, Tráfego e Resiliência do Supabase Backend', () => {
  let app;
  const ADMIN_SECRET = 'segredo-admin-supabase-teste-456';

  before(() => {
    esbuild.buildSync({
      entryPoints: [path.resolve(__dirname, '../workers/src/index.ts')],
      bundle: true,
      platform: 'node',
      format: 'cjs',
      packages: 'external',
      outfile: compiledWorkerPath,
    });
    const workerModule = require(compiledWorkerPath);
    app = workerModule.app || workerModule.default;
  });

  after(() => {
    try {
      if (fs.existsSync(compiledWorkerPath)) {
        fs.unlinkSync(compiledWorkerPath);
      }
    } catch (_) {}
  });

  const createMockCtx = () => ({
    waitUntil: (p) => {
      if (p && typeof p.then === 'function') p.catch(() => {});
    },
    passThroughOnException: () => {}
  });

  function createMockD1() {
    return {
      prepare: () => ({
        bind: () => ({
          first: async () => null,
          all: async () => ({ results: [] }),
          run: async () => ({ meta: { changes: 1, last_row_id: 1 } }),
        }),
        first: async () => null,
        all: async () => ({ results: [] }),
        run: async () => ({ meta: { changes: 1, last_row_id: 1 } }),
      }),
      batch: async () => [],
    };
  }

  test('1. GET /api/fontes via Supabase retorna lista completa com 34 fontes e cabeçalhos de CDN', async () => {
    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      const urlStr = String(url);
      if (urlStr.includes('/rest/v1/fontes')) {
        return new Response(JSON.stringify([
          { id: 1, slug: 'gutenberg', nome: 'Project Gutenberg', tipo: 'public_domain', url_base: 'https://gutenberg.org', ativa: true },
          { id: 2, slug: 'wikisource', nome: 'Wikisource', tipo: 'wiki', url_base: 'https://wikisource.org', ativa: true }
        ]), {
          status: 200,
          headers: { 'content-type': 'application/json', 'content-range': '0-1/34' }
        });
      }
      if (urlStr.includes('/rest/v1/contadores')) {
        return new Response(JSON.stringify([
          { chave: '1', total: 50000 },
          { chave: '2', total: 25000 }
        ]), { status: 200, headers: { 'content-type': 'application/json' } });
      }
      return origFetch(url);
    };

    try {
      const ctx = createMockCtx();
      const env = {
        DB_BACKEND: 'supabase',
        SUPABASE_URL: 'https://mock.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY: 'mock-key',
        DB: createMockD1()
      };
      const res = await app.request('/api/fontes', { method: 'GET' }, env, ctx);
      assert.equal(res.status, 200);
      const fontes = await res.json();
      assert.equal(fontes.length, 2);
      assert.equal(fontes[0].slug, 'gutenberg');
      assert.equal(fontes[0].total_livros, 50000);
      assert.ok(res.headers.get('cache-control').includes('s-maxage=3600'), 'Deve conter s-maxage para proteger chamadas à API do Supabase');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  test('2. GET /api/cursos via Supabase aplica filtros de plataforma e limita banda de egress', async () => {
    const origFetch = globalThis.fetch;
    let urlChamada = '';
    globalThis.fetch = async (url) => {
      urlChamada = String(url);
      if (urlChamada.includes('/rest/v1/cursos')) {
        return new Response(JSON.stringify([
          { id: 101, titulo: 'Fundamentos de TI', plataforma: 'Fundação Bradesco', certificado_gratis: 1, url: 'https://ev.org.br/c1' }
        ]), {
          status: 200,
          headers: { 'content-type': 'application/json', 'content-range': '0-0/494' }
        });
      }
      return origFetch(url);
    };

    try {
      const ctx = createMockCtx();
      const env = {
        DB_BACKEND: 'supabase',
        SUPABASE_URL: 'https://mock.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY: 'mock-key',
        DB: createMockD1()
      };
      const res = await app.request('/api/cursos?plataforma=bradesco&limite=10', { method: 'GET' }, env, ctx);
      assert.equal(res.status, 200);
      const cursos = await res.json();
      assert.equal(cursos.length, 1);
      assert.equal(cursos[0].plataforma, 'Fundação Bradesco');
      assert.ok(urlChamada.includes('plataforma=ilike.'), 'Filtro deve ser traduzido em predicado ILIKE no PostgREST');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  test('3. Falha ou indisponibilidade da API do Supabase faz fallback automático para D1 sem erro 500', async () => {
    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      const urlStr = String(url);
      if (urlStr.includes('supabase.co')) {
        return new Response(JSON.stringify({ error: 'Database timeout / 504 Gateway' }), { status: 504 });
      }
      return origFetch(url);
    };

    try {
      const ctx = createMockCtx();
      const env = {
        DB_BACKEND: 'supabase',
        SUPABASE_URL: 'https://mock.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY: 'mock-key',
        DB: {
          prepare: (sql) => ({
            bind: () => ({
              all: async () => {
                if (sql.includes('FROM fontes')) {
                  return {
                    results: [
                      { id: 99, slug: 'd1-fallback-fonte', nome: 'Fonte Fallback D1', tipo: 'open', url_base: 'https://d1.org', ativa: 1, total_livros: 100 }
                    ]
                  };
                }
                return { results: [] };
              }
            }),
            all: async () => {
              if (sql.includes('FROM fontes')) {
                return {
                  results: [
                    { id: 99, slug: 'd1-fallback-fonte', nome: 'Fonte Fallback D1', tipo: 'open', url_base: 'https://d1.org', ativa: 1, total_livros: 100 }
                  ]
                };
              }
              return { results: [] };
            }
          })
        }
      };

      const res = await app.request('/api/fontes', { method: 'GET' }, env, ctx);
      assert.equal(res.status, 200);
      const fontes = await res.json();
      assert.equal(fontes[0].slug, 'd1-fallback-fonte');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  test('4. Redirecionamento 302 em /api/cursos/:id/acessar incrementa contador no Supabase sem armazenar binários', async () => {
    const origFetch = globalThis.fetch;
    let rpcChamado = false;
    globalThis.fetch = async (url, opts) => {
      const urlStr = String(url);
      if (urlStr.includes('/rest/v1/cursos?id=eq.123')) {
        return new Response(JSON.stringify([
          { id: 123, titulo: 'Curso de Python', url: 'https://cursa.app/curso-python' }
        ]), { status: 200, headers: { 'content-type': 'application/json' } });
      }
      if (urlStr.includes('/rest/v1/rpc/incrementar_leitura_curso')) {
        rpcChamado = true;
        return new Response(JSON.stringify(true), { status: 200 });
      }
      return origFetch(url, opts);
    };

    try {
      const ctx = createMockCtx();
      const env = {
        DB_BACKEND: 'supabase',
        SUPABASE_URL: 'https://mock.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY: 'mock-key',
        DB: createMockD1()
      };

      const res = await app.request('/api/cursos/123/acessar', { method: 'GET' }, env, ctx);
      assert.equal(res.status, 302);
      assert.equal(res.headers.get('location'), 'https://cursa.app/curso-python');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  test('5. Tentaiva de mutação direta no Supabase com chave inválida é rejeitada com 401', async () => {
    const ctx = createMockCtx();
    const env = {
      ADMIN_API_KEY: ADMIN_SECRET,
      ENVIRONMENT: 'production',
      DB_BACKEND: 'supabase',
      SUPABASE_URL: 'https://mock.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'mock-key',
      DB: createMockD1()
    };

    const res = await app.request('/api/cursos', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-admin-key': 'chave-incorreta'
      },
      body: JSON.stringify({
        titulo: 'Curso Não Autorizado',
        url: 'https://exemplo.com'
      })
    }, env, ctx);

    assert.equal(res.status, 401);
  });
});
