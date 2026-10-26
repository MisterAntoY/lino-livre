const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');

const compiledWorkerPath = path.resolve(__dirname, '.worker.fallback.bundle.cjs');

describe('Automação de Fallback Bidirecional entre Cloudflare D1 e Supabase', () => {
  let app;
  let edgeLoadBalancer;

  const envHibrido = {
    ENVIRONMENT: 'production',
    DB_BACKEND: 'd1',
    SUPABASE_URL: 'https://projeto-mock.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'secret-key-mock'
  };

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
    edgeLoadBalancer = workerModule._obterLoadBalancer ? workerModule._obterLoadBalancer() : null;
  });

  after(() => {
    try {
      if (fs.existsSync(compiledWorkerPath)) fs.unlinkSync(compiledWorkerPath);
    } catch (_) {}
  });

  beforeEach(() => {
    if (edgeLoadBalancer) edgeLoadBalancer.reset();
  });

  function createMockD1(options = {}) {
    const { allHandler, firstHandler } = options;
    return {
      prepare: (query) => {
        const boundParams = [];
        const statement = {
          bind: (...params) => {
            boundParams.push(...params);
            return statement;
          },
          first: async () => {
            if (firstHandler) return firstHandler(query, boundParams);
            return null;
          },
          all: async () => {
            if (allHandler) return allHandler(query, boundParams);
            return { results: [] };
          },
          run: async () => ({ meta: { changes: 1, last_row_id: 1 } })
        };
        return statement;
      }
    };
  }

  function comFetchSimulado(handler, fn) {
    const original = globalThis.fetch;
    globalThis.fetch = async (url, opts = {}) => {
      const u = new URL(String(url));
      return handler(u, opts);
    };
    return Promise.resolve()
      .then(fn)
      .finally(() => {
        globalThis.fetch = original;
      });
  }

  const json = (corpo, status = 200, headers = {}) =>
    new Response(JSON.stringify(corpo), {
      status,
      headers: { 'Content-Type': 'application/json', ...headers }
    });

  test('1. GET /api/categorias com falha na D1 ativa fallback automático para Supabase', async () => {
    const env = {
      ...envHibrido,
      DB: createMockD1({
        allHandler: async () => {
          throw new Error('D1 connection timeout');
        }
      })
    };

    const res = await comFetchSimulado((u) => {
      if (u.pathname.endsWith('/rest/v1/categorias')) {
        return json([{ id: 1, nome: 'Literatura', descricao: 'Obras literárias' }]);
      }
      if (u.pathname.endsWith('/rest/v1/contadores')) {
        return json([{ chave: '1', total: 10 }]);
      }
      return json({ erro: 'não encontrado' }, 404);
    }, () => app.fetch(new Request('http://localhost/api/categorias'), env));

    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-data-backend'), 'supabase');
    assert.equal(res.headers.get('x-data-status'), 'degraded');
    const dados = await res.json();
    assert.equal(dados.length, 1);
    assert.equal(dados[0].nome, 'Literatura');
  });

  test('2. GET /api/categorias com falha no Supabase (DB_BACKEND=supabase) ativa fallback para D1', async () => {
    const env = {
      ...envHibrido,
      DB_BACKEND: 'supabase',
      DB: createMockD1({
        allHandler: async () => ({
          results: [{ id: 2, nome: 'História D1', descricao: 'Fontes D1', total_livros: 50 }]
        })
      })
    };

    const res = await comFetchSimulado(
      () => json({ message: 'Supabase indisponível' }, 503),
      () => app.fetch(new Request('http://localhost/api/categorias'), env)
    );

    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-data-backend'), 'd1');
    assert.equal(res.headers.get('x-data-status'), 'degraded');
    const dados = await res.json();
    assert.equal(dados.length, 1);
    assert.equal(dados[0].nome, 'História D1');
  });

  test('3. GET /api/fontes com falha na D1 ativa fallback automático para Supabase', async () => {
    const env = {
      ...envHibrido,
      DB: createMockD1({
        allHandler: async () => {
          throw new Error('D1 read failure');
        }
      })
    };

    const res = await comFetchSimulado((u) => {
      if (u.pathname.endsWith('/rest/v1/fontes')) {
        return json([{ id: 5, slug: 'gutenberg', nome: 'Gutenberg Supa', tipo: 'api', url_base: 'https://gutendex.com', ativa: 1 }]);
      }
      if (u.pathname.endsWith('/rest/v1/contadores')) {
        return json([{ chave: '5', total: 78000 }]);
      }
      return json({ erro: 'não encontrado' }, 404);
    }, () => app.fetch(new Request('http://localhost/api/fontes'), env));

    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-data-backend'), 'supabase');
    assert.equal(res.headers.get('x-data-status'), 'degraded');
    const dados = await res.json();
    assert.equal(dados[0].nome, 'Gutenberg Supa');
  });

  test('4. GET /api/cursos com falha na D1 ativa fallback automático para Supabase', async () => {
    const env = {
      ...envHibrido,
      DB: createMockD1({
        allHandler: async () => {
          throw new Error("Your account has exceeded D1's free tier daily row read limit [code: 7500]");
        }
      })
    };

    const res = await comFetchSimulado((u) => {
      if (u.pathname.endsWith('/rest/v1/cursos')) {
        return json([{ id: 10, titulo: 'Curso Supabase', plataforma: 'Cursa', tipo: 'curso', area: 'Tecnologia' }]);
      }
      return json({ erro: 'não encontrado' }, 404);
    }, () => app.fetch(new Request('http://localhost/api/cursos'), env));

    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-data-backend'), 'supabase');
    assert.equal(res.headers.get('x-data-status'), 'degraded');
    const dados = await res.json();
    assert.equal(dados[0].titulo, 'Curso Supabase');
  });

  test('5. GET /api/autores com falha na D1 ativa fallback automático para Supabase', async () => {
    const env = {
      ...envHibrido,
      DB: createMockD1({
        allHandler: async () => {
          throw new Error('D1 internal error');
        }
      })
    };

    const res = await comFetchSimulado((u) => {
      if (u.pathname.endsWith('/rest/v1/autores')) {
        return json([{ id: 1, nome: 'Machado de Assis Supa', bio: 'Clássico', nacionalidade: 'Brasileira' }]);
      }
      return json({ erro: 'não encontrado' }, 404);
    }, () => app.fetch(new Request('http://localhost/api/autores'), env));

    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-data-backend'), 'supabase');
    assert.equal(res.headers.get('x-data-status'), 'degraded');
    const dados = await res.json();
    assert.equal(dados[0].nome, 'Machado de Assis Supa');
  });

  test('6. Circuit Breaker abre imediatamente ao detectar erro de cota da D1 (código 7500)', () => {
    edgeLoadBalancer.reset();
    assert.equal(edgeLoadBalancer.getState('d1'), 'CLOSED');

    edgeLoadBalancer.recordFailure('d1', new Error("Your account has exceeded D1's free tier daily row read limit [code: 7500]"));
    assert.equal(edgeLoadBalancer.getState('d1'), 'OPEN');

    const routing = edgeLoadBalancer.pickBackend(true);
    assert.equal(routing.primary, 'supabase', 'Com circuito D1 aberto, primário deve ser Supabase');
    assert.equal(routing.fallback, 'd1');
  });
});
