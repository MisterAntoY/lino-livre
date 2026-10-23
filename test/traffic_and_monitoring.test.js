const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');
const { D1_LIMITES_FREE_TIER, auditarSalvaguardasTrafego } = require('../scripts/diagnostico_consumo_trafego.js');

const compiledWorkerPath = path.resolve(__dirname, '.worker.traffic.bundle.cjs');

describe('Cenários de Tráfego Concorrente, Diagnóstico e Monitorização de Cotas', () => {
  let app;
  const ADMIN_SECRET = 'segredo-admin-traffic-789';

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

  function createMockD1({
    allHandler = async () => ({ results: [] }),
    firstHandler = async () => null,
  } = {}) {
    return {
      prepare: (sql) => {
        let boundParams = [];
        const stmt = {
          bind: (...params) => {
            boundParams = params;
            return stmt;
          },
          first: async (col) => firstHandler(sql, boundParams, col),
          all: async () => allHandler(sql, boundParams),
          run: async () => ({ meta: { changes: 1, last_row_id: 1 } }),
        };
        return stmt;
      },
      batch: async () => [],
    };
  }

  test('1. Simulação de 50 requisições simultâneas em /api/dashboard reutiliza o cache sem multiplicar consultas na D1', async () => {
    let consultasD1 = 0;
    const db = createMockD1({
      allHandler: async (sql) => {
        consultasD1++;
        if (sql.includes('FROM estatisticas')) return { results: [{ chave: 'total_livros', valor: 997 }] };
        if (sql.includes('FROM contadores')) return { results: [{ dimensao: 'licenca', chave: 'cc0', rotulo: 'cc0', total: 100 }] };
        return { results: [] };
      }
    });

    const ctx = createMockCtx();
    const env = {
      ADMIN_API_KEY: ADMIN_SECRET,
      ENVIRONMENT: 'production',
      DB: db
    };

    // 50 requisições concorrentes disparadas simultaneamente
    const promessas = Array.from({ length: 50 }, () =>
      app.request('/api/dashboard', { method: 'GET' }, env, ctx)
    );

    const respostas = await Promise.all(promessas);

    for (const res of respostas) {
      assert.equal(res.status, 200);
      assert.ok(res.headers.get('cache-control').includes('s-maxage=3600'));
    }

    // A primeira salva no cache em memória; as subsequentes não geram novas varreduras na D1
    assert.ok(consultasD1 < 10, `50 requisições geraram apenas ${consultasD1} leituras na D1 (muito abaixo de 50x4=200)`);
  });

  test('2. Limites da cota diária D1 Free Tier são monitorizados e calculados corretamente', () => {
    assert.equal(D1_LIMITES_FREE_TIER.rows_read_diario, 5_000_000);
    assert.equal(D1_LIMITES_FREE_TIER.rows_written_diario, 100_000);

    const leiturasExemplo = 969_078;
    const escritasExemplo = 75_995;

    const pctLeitura = (leiturasExemplo / D1_LIMITES_FREE_TIER.rows_read_diario) * 100;
    const pctEscrita = (escritasExemplo / D1_LIMITES_FREE_TIER.rows_written_diario) * 100;

    assert.equal(pctLeitura.toFixed(2), '19.38');
    assert.equal(pctEscrita.toFixed(2), '76.00');
    assert.ok(pctLeitura < 100, 'Consumo deve estar dentro da cota diária');
  });

  test('3. Função auditarSalvaguardasTrafego é exportada e executa sem erros', () => {
    assert.equal(typeof auditarSalvaguardasTrafego, 'function');
    assert.doesNotThrow(() => {
      auditarSalvaguardasTrafego();
    });
  });

  test('4. Requisição para /api/livros com parâmetros inválidos (não-numéricos) é tratada com segurança e sem erros 500', async () => {
    const db = createMockD1({
      allHandler: async () => ({ results: [] }),
      firstHandler: async () => ({ total: 0 })
    });
    const ctx = createMockCtx();
    const env = { DB: db };

    const res = await app.request('/api/livros?pagina=abc&limite=xyz', { method: 'GET' }, env, ctx);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.page, 1, 'Página deve cair para padrão 1');
    assert.equal(body.limit, 24, 'Limite deve cair para padrão 24');
  });

  test('5. Tratamento de cabeçalhos de segurança estritos (CSP, X-Frame-Options, X-Content-Type-Options)', async () => {
    const ctx = createMockCtx();
    const env = { DB: createMockD1() };

    const res = await app.request('/api/categorias', { method: 'GET' }, env, ctx);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(res.headers.get('x-frame-options'), 'DENY');
    assert.ok(res.headers.get('content-security-policy'));
  });
});
