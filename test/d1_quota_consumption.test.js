const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');

const compiledWorkerPath = path.resolve(__dirname, '.worker.quota.bundle.cjs');

describe('Cenários de Salvaguarda de Cota da D1 e Mitigação de Consumo', () => {
  let app;
  const ADMIN_SECRET = 'segredo-admin-quota-teste-123';

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
    firstHandler = async () => null,
    allHandler = async () => ({ results: [] }),
    runHandler = async () => ({ meta: { changes: 1, last_row_id: 1 } }),
    batchHandler = async () => []
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
          run: async () => runHandler(sql, boundParams),
        };
        return stmt;
      },
      batch: async (stmts) => batchHandler(stmts),
    };
  }

  const workerRequest = async (url, options = {}, customEnv = null) => {
    const ctx = createMockCtx();
    const env = customEnv !== null ? customEnv : {
      ADMIN_API_KEY: ADMIN_SECRET,
      ENVIRONMENT: 'production',
      DB: createMockD1()
    };
    return app.request(url, options, env, ctx);
  };

  test('1. Guardrail de Paginação Profunda bloqueia página > 50 sem filtro e NÃO executa consultas na D1', async () => {
    let d1FoiConsultada = false;
    const db = createMockD1({
      allHandler: async () => {
        d1FoiConsultada = true;
        return { results: [] };
      },
      firstHandler: async () => {
        d1FoiConsultada = true;
        return null;
      }
    });

    const res = await workerRequest('/api/livros?pagina=51&limite=24', { method: 'GET' }, { DB: db });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.length, 0);
    assert.equal(d1FoiConsultada, false, 'A D1 NÃO deve ser consultada em navegação profunda sem filtro');
    assert.ok(body.aviso.includes('limitada a 50 páginas'));
    assert.ok(res.headers.get('cache-control').includes('s-maxage=86400'));
  });

  test('2. Paginação profunda com busca legítima é permitida via índice FTS5', async () => {
    const queries = [];
    const db = createMockD1({
      allHandler: async (sql) => {
        queries.push(sql);
        return { results: [{ id: 10, titulo: 'Machado Obra' }] };
      },
      firstHandler: async () => ({ total: 1 })
    });

    const res = await workerRequest('/api/livros?busca=Machado&pagina=51&limite=24', { method: 'GET' }, { DB: db });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.length, 1);
    const queryLivros = queries.find(q => q.includes('FROM livros'));
    assert.ok(queryLivros && queryLivros.includes('livros_fts MATCH'), 'Deve consultar a tabela virtual FTS5 indexada');
  });

  test('3. Paginação profunda com categoria temática é permitida via índice B-Tree', async () => {
    const queries = [];
    const db = createMockD1({
      allHandler: async (sql) => {
        queries.push(sql);
        return { results: [{ id: 25, titulo: 'Livro Tecnico' }] };
      },
      firstHandler: async () => ({ total: 10 })
    });

    const res = await workerRequest('/api/livros?categoria_id=3&pagina=55&limite=24', { method: 'GET' }, { DB: db });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.length, 1);
    const queryLivros = queries.find(q => q.includes('FROM livros'));
    assert.ok(queryLivros && queryLivros.includes('l.categoria_id = ?'), 'Deve filtrar por categoria_id indexado');
  });

  test('4. WAF de Borda bloqueia rastreadores agressivos (Bytespider, Ahrefs, PetalBot) em /api/* com HTTP 403', async () => {
    let d1Consultada = false;
    const db = createMockD1({
      allHandler: async () => {
        d1Consultada = true;
        return { results: [] };
      }
    });

    const bots = [
      'Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)',
      'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)',
      'Mozilla/5.0 (compatible; PetalBot;+https://aspiegel.com/petalbot)',
      'SemrushBot/7~bl (+http://www.semrush.com/bot.html)',
      'DotBot/1.2 (+http://www.opensiteexplorer.org/dotbot)'
    ];

    for (const ua of bots) {
      const res = await workerRequest('/api/livros?pagina=1', {
        method: 'GET',
        headers: { 'user-agent': ua }
      }, { DB: db });

      assert.equal(res.status, 403, `User-Agent ${ua} deve receber HTTP 403`);
      const json = await res.json();
      assert.ok(json.erro.includes('WAF'));
    }
    assert.equal(d1Consultada, false, 'Bots agressivos nunca devem alcançar a D1');
  });

  test('5. Clientes anônimos com cabeçalhos Cache-Control: no-cache NÃO furam o cache da dashboard', async () => {
    let chamadasD1 = 0;
    const db = createMockD1({
      allHandler: async (sql) => {
        chamadasD1++;
        if (sql.includes('FROM estatisticas')) return { results: [{ chave: 'total_livros', valor: 997 }] };
        if (sql.includes('FROM contadores')) return { results: [{ dimensao: 'licenca', chave: 'cc0', rotulo: 'cc0', total: 100 }] };
        return { results: [] };
      }
    });

    // 1ª chamada popula o cache
    await workerRequest('/api/dashboard', { method: 'GET' }, {
      ADMIN_API_KEY: ADMIN_SECRET,
      ENVIRONMENT: 'production',
      DB: db
    });

    const chamadasAposPrimeira = chamadasD1;

    // 2ª chamada como anônimo forçando no-cache: deve ignorar no-cache e usar cache em memória
    const res = await workerRequest('/api/dashboard', {
      method: 'GET',
      headers: { 'cache-control': 'no-cache', 'pragma': 'no-cache' }
    }, {
      ADMIN_API_KEY: ADMIN_SECRET,
      ENVIRONMENT: 'production',
      DB: db
    });

    assert.equal(res.status, 200);
    assert.equal(chamadasD1, chamadasAposPrimeira, 'Anônimo com no-cache não deve disparar novas consultas à D1');
  });

  test('6. Administradores autenticados com x-admin-key conseguem atualizar o cache da dashboard via no-cache', async () => {
    let chamadasD1 = 0;
    const db = createMockD1({
      allHandler: async (sql) => {
        chamadasD1++;
        if (sql.includes('FROM estatisticas')) return { results: [{ chave: 'total_livros', valor: 997 }] };
        if (sql.includes('FROM contadores')) return { results: [{ dimensao: 'licenca', chave: 'cc0', rotulo: 'cc0', total: 100 }] };
        return { results: [] };
      }
    });

    // Chamada inicial
    await workerRequest('/api/dashboard', { method: 'GET' }, {
      ADMIN_API_KEY: ADMIN_SECRET,
      ENVIRONMENT: 'production',
      DB: db
    });

    const contagemAntes = chamadasD1;

    // Chamada de admin forçando no-cache: deve reexecutar a D1
    const res = await workerRequest('/api/dashboard', {
      method: 'GET',
      headers: {
        'x-admin-key': ADMIN_SECRET,
        'cache-control': 'no-cache'
      }
    }, {
      ADMIN_API_KEY: ADMIN_SECRET,
      ENVIRONMENT: 'production',
      DB: db
    });

    assert.equal(res.status, 200);
    assert.ok(chamadasD1 > contagemAntes, 'Admin autenticado deve poder forçar refresh da D1');
  });

  test('7. Recálculo inteligente da D1 evita varreduras de 104k linhas quando não houve mutações', async () => {
    let batchesExecutados = 0;
    const db = createMockD1({
      allHandler: async (sql) => {
        if (sql.includes('versao_mutacoes')) {
          return {
            results: [
              { chave: 'total_livros', valor: 104848 },
              { chave: 'atualizado_em_epoch', valor: Math.floor(Date.now() / 1000) },
              { chave: 'versao_mutacoes', valor: 5 },
              { chave: 'versao_calculada', valor: 5 }
            ]
          };
        }
        return { results: [] };
      },
      batchHandler: async () => {
        batchesExecutados++;
        return [];
      }
    });

    // O cron aciona recomputarEstatisticas sem forçar
    const workerModule = require(compiledWorkerPath);
    const scheduledHandler = workerModule.default.scheduled;

    const ctx = createMockCtx();
    await scheduledHandler({}, { DB: db }, ctx);

    assert.equal(batchesExecutados, 0, 'Nenhum batch pesado deve ser executado se versao_mutacoes <= versao_calculada');
  });

  test('8. Recálculo forçado pela rota administrativa executa varredura e atualiza estatísticas', async () => {
    let batchesExecutados = 0;
    const db = createMockD1({
      batchHandler: async (stmts) => {
        batchesExecutados++;
        return [];
      }
    });

    const res = await workerRequest('/api/admin/recalcular-estatisticas?force=true', {
      method: 'POST',
      headers: { 'x-admin-key': ADMIN_SECRET }
    }, {
      ADMIN_API_KEY: ADMIN_SECRET,
      ENVIRONMENT: 'production',
      DB: db
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.sucesso, true);
    assert.ok(batchesExecutados >= 3, 'Deve executar todos os lotes de recálculo quando forçado');
  });

  test('9. POST /api/livros incrementa versao_mutacoes para agendar recálculo futuro', async () => {
    let versaoMutacoesIncrementada = false;
    const db = createMockD1({
      runHandler: async (sql) => {
        if (sql.includes('versao_mutacoes')) {
          versaoMutacoesIncrementada = true;
        }
        return { meta: { changes: 1, last_row_id: 501 } };
      },
      firstHandler: async (sql) => {
        if (sql.includes('SELECT * FROM livros WHERE id = ?')) {
          return { id: 501, titulo: 'Novo Livro Registado' };
        }
        return null;
      }
    });

    const res = await workerRequest('/api/livros', {
      method: 'POST',
      headers: {
        'x-admin-key': ADMIN_SECRET,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        titulo: 'Novo Livro Registado',
        licenca: 'cc-by',
        links: [{ formato: 'pdf', url: 'https://exemplo.com/livro.pdf' }]
      })
    }, {
      ADMIN_API_KEY: ADMIN_SECRET,
      ENVIRONMENT: 'production',
      DB: db
    });

    assert.equal(res.status, 201);
    assert.equal(versaoMutacoesIncrementada, true, 'Deve incrementar versao_mutacoes ao inserir livro');
  });

  test('10. DELETE /api/livros/:id incrementa versao_mutacoes', async () => {
    let versaoMutacoesIncrementada = false;
    const db = createMockD1({
      runHandler: async (sql) => {
        if (sql.includes('versao_mutacoes')) {
          versaoMutacoesIncrementada = true;
        }
        return { meta: { changes: 1, last_row_id: 1 } };
      }
    });

    const res = await workerRequest('/api/livros/123', {
      method: 'DELETE',
      headers: { 'x-admin-key': ADMIN_SECRET }
    }, {
      ADMIN_API_KEY: ADMIN_SECRET,
      ENVIRONMENT: 'production',
      DB: db
    });

    assert.equal(res.status, 200);
    assert.equal(versaoMutacoesIncrementada, true, 'Deve incrementar versao_mutacoes ao remover livro');
  });

  test('11. Injeção de cabeçalhos de borda Cloudflare (s-maxage=3600) em rotas de leitura', async () => {
    const db = createMockD1({
      allHandler: async (sql) => {
        if (sql.includes('FROM estatisticas')) return { results: [{ chave: 'total_livros', valor: 997 }] };
        if (sql.includes('FROM contadores')) return { results: [{ dimensao: 'licenca', chave: 'cc0', rotulo: 'cc0', total: 100 }] };
        return { results: [] };
      }
    });

    const res = await workerRequest('/api/dashboard', { method: 'GET' }, { DB: db });
    assert.equal(res.status, 200);
    const cc = res.headers.get('cache-control');
    assert.ok(cc.includes('s-maxage=3600'), 'Deve incluir diretiva s-maxage para cache global da Cloudflare CDN');
    assert.ok(cc.includes('stale-while-revalidate=86400'));
  });

  test('12. Endpoint de Top 100 utiliza contagem conhecida de 105 sem disparar COUNT(*) na D1', async () => {
    let countStmtExecutado = false;
    const db = createMockD1({
      allHandler: async () => ({
        results: [
          { id: 1, titulo: 'Dom Quixote', fonte_id_externo: 'world-top100-1', leituras: 100 }
        ]
      }),
      firstHandler: async (sql) => {
        if (sql.includes('SELECT COUNT(*)')) {
          countStmtExecutado = true;
          return { total: 105 };
        }
        return null;
      }
    });

    const res = await workerRequest('/api/livros?colecao=top100', { method: 'GET' }, { DB: db });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.total, 105);
    assert.equal(countStmtExecutado, false, 'Top 100 usa constante pré-auditada (105) evitando varredura de contagem');
  });
});
