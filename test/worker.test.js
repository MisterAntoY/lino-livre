const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');

// Caminho para o bundle temporário CJS compilado a partir de workers/src/index.ts
const compiledWorkerPath = path.resolve(__dirname, '.worker.test.bundle.cjs');

describe('Testes Automatizados do Cloudflare Worker (Hono + D1)', () => {
  let app;
  const ADMIN_SECRET = 'segredo-admin-teste-worker-xyz';

  before(() => {
    // Compila a aplicação TypeScript do Worker em CommonJS para execução nativa no runner do Node
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

  // Utilitário para simular ExecutionContext do Cloudflare Workers
  const createMockCtx = () => ({
    waitUntil: (p) => {
      if (p && typeof p.then === 'function') {
        p.catch(() => {});
      }
    },
    passThroughOnException: () => {}
  });

  // Utilitário para criar mock da D1 Database
  function createMockD1({
    firstHandler = async () => null,
    allHandler = async () => ({ results: [] }),
    runHandler = async () => ({ meta: { changes: 1, last_row_id: 1 } }),
    batchHandler = async () => []
  } = {}) {
    const prepare = (sql) => {
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
    };
    return {
      prepare,
      batch: async (stmts) => batchHandler(stmts),
    };
  }

  // Helper para requisições no Hono com defaults
  const workerRequest = async (url, options = {}, customEnv = null) => {
    const ctx = createMockCtx();
    const env = customEnv !== null ? customEnv : {
      ADMIN_API_KEY: ADMIN_SECRET,
      ENVIRONMENT: 'production',
      DB: createMockD1()
    };
    return app.request(url, options, env, ctx);
  };

  // =========================================================================
  // CENÁRIO 1: GET /api/livros
  // =========================================================================
  describe('Cenário 1: GET /api/livros (Catálogo e Paginação)', () => {
    test('1.1 - Deve responder 200 com array de livros e metadados de paginação com D1 mockado', async () => {
      const mockLivros = [
        {
          id: 101,
          titulo: 'Dom Casmurro',
          subtitulo: 'Um romance sobre o ciúme e a dúvida',
          autor_id: 1,
          autor_nome: 'Machado de Assis',
          categoria_id: 2,
          categoria_nome: 'Literatura Brasileira',
          idioma: 'pt',
          licenca: 'dominio-publico',
          leituras: 1540
        }
      ];

      const mockLinks = [
        { id: 501, livro_id: 101, formato: 'pdf', url: 'https://exemplo.org/dom_casmurro.pdf' },
        { id: 502, livro_id: 101, formato: 'epub', url: 'https://exemplo.org/dom_casmurro.epub' }
      ];

      const env = {
        ADMIN_API_KEY: ADMIN_SECRET,
        DB: createMockD1({
          firstHandler: async (sql) => {
            if (sql.includes('COUNT(*)')) return { total: 1 };
            if (sql.includes('estatisticas')) return { valor: 1 };
            return null;
          },
          allHandler: async (sql) => {
            if (sql.includes('FROM links_livros')) return { results: mockLinks };
            if (sql.includes('FROM livros')) return { results: mockLivros };
            return { results: [] };
          }
        })
      };

      const res = await workerRequest('/api/livros?pagina=1&limite=24', { method: 'GET' }, env);
      assert.equal(res.status, 200, 'Deveria responder com status 200');

      const data = await res.json();
      assert.equal(data.page, 1, 'Deveria indicar página 1');
      assert.equal(data.limit, 24, 'Deveria indicar limite de 24');
      assert.equal(data.total, 1, 'Total de livros deve ser 1');
      assert.equal(data.total_pages, 1, 'Total de páginas deve ser 1');
      assert.ok(Array.isArray(data.data), 'Campo data deve ser um array');
      assert.equal(data.data.length, 1, 'Deve retornar 1 livro');
      assert.equal(data.data[0].titulo, 'Dom Casmurro');
      assert.equal(data.data[0].autor_nome, 'Machado de Assis');
      assert.ok(Array.isArray(data.data[0].links), 'Livro deve conter array de links associados');
      assert.equal(data.data[0].links.length, 2, 'Livro deve conter 2 links');
    });

    test('1.2 - Deve responder 200 com acervo de fallback quando D1 está indisponível ou falha', async () => {
      // Força indisponibilidade passando DB: null
      const envSemDb = {
        ADMIN_API_KEY: ADMIN_SECRET,
        DB: null
      };

      const res = await workerRequest('/api/livros', { method: 'GET' }, envSemDb);
      assert.equal(res.status, 200, 'Deveria responder 200 mesmo no fallback gracioso');

      const data = await res.json();
      assert.ok(Array.isArray(data.data), 'Fallback deve devolver array em data');
      assert.ok(data.data.length > 0, 'Fallback deve conter obras essenciais consolidadas');
      assert.ok(data.total > 0, 'Fallback deve ter contagem total positiva');
      const titulos = data.data.map(l => l.titulo);
      assert.ok(titulos.some(t => t.includes('Dom Casmurro')), 'Fallback deve conter Dom Casmurro');
    });

    test('1.3 - Deve sanitizar caracteres especiais e operadores FTS5 na busca e retornar 200', async () => {
      let ftsParamPassado = null;
      const env = {
        ADMIN_API_KEY: ADMIN_SECRET,
        DB: createMockD1({
          firstHandler: async (sql, params) => {
            if (sql.includes('livros_fts')) {
              ftsParamPassado = params[0];
              return { total: 0 };
            }
            return { total: 0 };
          },
          allHandler: async (sql, params) => {
            if (sql.includes('livros_fts')) {
              ftsParamPassado = params[0];
            }
            return { results: [] };
          }
        })
      };

      const res = await workerRequest('/api/livros?busca=%28python+AND+test%2A%29', { method: 'GET' }, env);
      assert.equal(res.status, 200, 'Deveria responder 200 sanitizando o FTS5');
      assert.ok(ftsParamPassado && ftsParamPassado.includes('"python"*'), 'Termo deve ser sanitizado em tokens encapsulados');
    });
  });

  // =========================================================================
  // CENÁRIO 2: GET /api/dashboard
  // =========================================================================
  describe('Cenário 2: GET /api/dashboard (Métricas Reais e Degradação 503)', () => {
    test('2.1 - Deve responder 503 sem números fictícios quando D1 falha e não há cache prévio', async () => {
      // Simula falha da base de dados D1 antes de qualquer cache em memória
      const envFalha = {
        ADMIN_API_KEY: ADMIN_SECRET,
        DB: {
          prepare: () => {
            throw new Error('D1_ERROR: rate limit exceeded');
          }
        }
      };

      const res = await workerRequest('/api/dashboard', { method: 'GET' }, envFalha);
      assert.equal(res.status, 503, 'Deveria responder 503 Service Unavailable');

      const data = await res.json();
      assert.ok(data.erro, 'Deve retornar mensagem clara de erro');
      assert.equal(res.headers.get('cache-control'), 'no-store', 'Não deve cachear resposta de erro 503');
    });

    test('2.2 - Deve responder 200 com métricas reais quando D1 está saudável', async () => {
      const statsRows = [
        { chave: 'total_livros', valor: 250 },
        { chave: 'total_leituras', valor: 1200 },
        { chave: 'total_autores', valor: 80 },
        { chave: 'total_categorias', valor: 15 },
        { chave: 'total_cursos', valor: 45 },
        { chave: 'total_fontes', valor: 8 }
      ];

      const contadoresRows = [
        { dimensao: 'formato', chave: 'pdf', total: 180 },
        { dimensao: 'formato', chave: 'epub', total: 70 },
        { dimensao: 'licenca', chave: 'dominio-publico', total: 200 },
        { dimensao: 'idioma', chave: 'pt', total: 250 },
        { dimensao: 'categoria', chave: '1', rotulo: 'Literatura', total: 100 },
        { dimensao: 'fonte', chave: '5', rotulo: 'Gutenberg', total: 150 }
      ];

      const env = {
        ADMIN_API_KEY: ADMIN_SECRET,
        DB: createMockD1({
          allHandler: async (sql) => {
            if (sql.includes('SELECT chave, valor FROM estatisticas')) return { results: statsRows };
            if (sql.includes('SELECT dimensao, chave, rotulo, total FROM contadores')) return { results: contadoresRows };
            if (sql.includes('FROM livros l')) return { results: [] };
            if (sql.includes('FROM fontes WHERE ativa = 1')) return { results: [{ id: 5, slug: 'gutenberg', nome: 'Project Gutenberg', url_base: 'https://gutendex.com' }] };
            return { results: [] };
          }
        })
      };

      const res = await workerRequest('/api/dashboard', { method: 'GET' }, env);
      assert.equal(res.status, 200, 'Deveria responder 200');

      const data = await res.json();
      assert.ok(data.resumo, 'Deveria conter objeto de resumo');
      assert.equal(data.resumo.total_livros, 250, 'total_livros deve refletir o valor real do D1');
      assert.equal(data.resumo.total_leituras, 1200, 'total_leituras deve refletir o valor real do D1');
      assert.equal(data.resumo.total_autores, 80, 'total_autores deve refletir o valor real do D1');
      assert.ok(Array.isArray(data.formatos), 'formatos deve ser array');
      assert.ok(Array.isArray(data.licencas), 'licencas deve ser array');
      assert.ok(Array.isArray(data.idiomas), 'idiomas deve ser array');
    });

    test('2.3 - Deve servir cache em memória (200) com dados prévios se D1 falhar subsequentemente', async () => {
      // D1 falha, mas como 2.2 populou o cache, retorna os dados cacheados (200)
      const envFalhaComCache = {
        ADMIN_API_KEY: ADMIN_SECRET,
        DB: {
          prepare: () => {
            throw new Error('D1_ERROR: rate limit exceeded');
          }
        }
      };

      const res = await workerRequest('/api/dashboard', { method: 'GET' }, envFalhaComCache);
      assert.equal(res.status, 200, 'Deveria responder 200 servindo cache gracioso');

      const data = await res.json();
      assert.equal(data.resumo.total_livros, 250, 'Deve manter métricas reais anteriores em cache');
    });
  });

  // =========================================================================
  // CENÁRIO 3: Rotas Administrativas sem chave de administração (401 Unauthorized)
  // =========================================================================
  describe('Cenário 3: Rotas Administrativas sem x-admin-key (401 Unauthorized)', () => {
    test('3.1 - POST /api/livros sem x-admin-key deve responder 401', async () => {
      const res = await workerRequest('/api/livros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: 'Tentativa de Escrita Sem Chave',
          licenca: 'dominio-publico'
        })
      });
      assert.equal(res.status, 401, 'POST /api/livros sem chave deve responder 401');
      const data = await res.json();
      assert.match(data.erro, /chave administrativa|não autorizado/i);
    });

    test('3.2 - DELETE /api/livros/:id sem x-admin-key deve responder 401', async () => {
      const res = await workerRequest('/api/livros/123', {
        method: 'DELETE'
      });
      assert.equal(res.status, 401, 'DELETE /api/livros/:id sem chave deve responder 401');
      const data = await res.json();
      assert.match(data.erro, /chave administrativa|não autorizado/i);
    });

    test('3.3 - POST /api/import sem x-admin-key deve responder 401', async () => {
      const res = await workerRequest('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fonte: 'gutenberg', query: 'química' })
      });
      assert.equal(res.status, 401, 'POST /api/import sem chave deve responder 401');
      const data = await res.json();
      assert.match(data.erro, /chave administrativa|não autorizado/i);
    });

    test('3.4 - Requisição com chave incorreta em x-admin-key deve responder 401', async () => {
      const res = await workerRequest('/api/livros/123', {
        method: 'DELETE',
        headers: { 'x-admin-key': 'chave-completamente-errada' }
      });
      assert.equal(res.status, 401, 'Chave inválida deve ser rejeitada com 401');
    });

    test('3.5 - Outras rotas administrativas de escrita devem responder 401 sem chave', async () => {
      const resCat = await workerRequest('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: 'Física Moderna' })
      });
      assert.equal(resCat.status, 401, 'POST /api/categorias sem chave deve responder 401');

      const resCurso = await workerRequest('/api/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: 'Curso Rust', url: 'https://exemplo.org' })
      });
      assert.equal(resCurso.status, 401, 'POST /api/cursos sem chave deve responder 401');
    });
  });

  // =========================================================================
  // CENÁRIO 4: Rotas Administrativas com chave correta (Autorização Concedida)
  // =========================================================================
  describe('Cenário 4: Rotas Administrativas com x-admin-key correta (Autorização Concedida)', () => {
    test('4.1 - POST /api/livros com chave correta e dados válidos concede acesso e responde 201', async () => {
      const mockLivroCriado = {
        id: 777,
        titulo: 'História de Angola',
        licenca: 'cc-by',
        ano_publicacao: 1975,
        idioma: 'pt'
      };

      const env = {
        ADMIN_API_KEY: ADMIN_SECRET,
        DB: createMockD1({
          firstHandler: async () => mockLivroCriado,
          runHandler: async () => ({ meta: { changes: 1, last_row_id: 777 } })
        })
      };

      const res = await workerRequest('/api/livros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_SECRET
        },
        body: JSON.stringify({
          titulo: 'História de Angola',
          licenca: 'cc-by',
          ano_publicacao: 1975,
          idioma: 'pt'
        })
      }, env);

      assert.equal(res.status, 201, 'Com chave correta e dados válidos, deve cadastrar e responder 201');
      const data = await res.json();
      assert.equal(data.id, 777);
      assert.equal(data.titulo, 'História de Angola');
    });

    test('4.2 - POST /api/livros com chave correta mas licença inválida responde 400 (não 401)', async () => {
      const env = {
        ADMIN_API_KEY: ADMIN_SECRET,
        DB: createMockD1()
      };

      const res = await workerRequest('/api/livros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_SECRET
        },
        body: JSON.stringify({
          titulo: 'Livro Sem Licença Válida',
          licenca: 'licenca-inventada-proibida'
        })
      }, env);

      assert.equal(res.status, 400, 'Autorização foi aceita, mas validação rejeitou licença com 400');
      const data = await res.json();
      assert.match(data.erro, /Licença inválida/i);
    });

    test('4.3 - DELETE /api/livros/:id com chave correta autoriza e remove livro com 200', async () => {
      const env = {
        ADMIN_API_KEY: ADMIN_SECRET,
        DB: createMockD1({
          runHandler: async () => ({ meta: { changes: 1, last_row_id: 0 } })
        })
      };

      const res = await workerRequest('/api/livros/101', {
        method: 'DELETE',
        headers: { 'x-admin-key': ADMIN_SECRET }
      }, env);

      assert.equal(res.status, 200, 'Deve autorizar e retornar 200 ao remover');
      const data = await res.json();
      assert.match(data.mensagem, /removidos com sucesso/i);
    });

    test('4.4 - POST /api/import com chave correta autoriza e enfileira job com 202', async () => {
      const env = {
        ADMIN_API_KEY: ADMIN_SECRET,
        DB: createMockD1({
          firstHandler: async (sql) => {
            if (sql.includes('FROM fontes')) {
              return { id: 5, slug: 'gutenberg', nome: 'Project Gutenberg', ativa: 1 };
            }
            return null;
          },
          runHandler: async () => ({ meta: { changes: 1, last_row_id: 99 } })
        })
      };

      const res = await workerRequest('/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_SECRET
        },
        body: JSON.stringify({ fonte: 'gutenberg', query: 'astronomia' })
      }, env);

      assert.equal(res.status, 202, 'Deve autorizar importação e retornar 202 Accepted');
      const data = await res.json();
      assert.equal(data.job_id, 99);
      assert.equal(data.status, 'pendente');
    });

    test('4.5 - Suporte a cabeçalho Authorization: Bearer <key> como alternativa a x-admin-key', async () => {
      const env = {
        ADMIN_API_KEY: ADMIN_SECRET,
        DB: createMockD1({
          runHandler: async () => ({ meta: { changes: 1, last_row_id: 0 } })
        })
      };

      const res = await workerRequest('/api/livros/101', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${ADMIN_SECRET}` }
      }, env);

      assert.equal(res.status, 200, 'Bearer token válido deve conceder acesso com 200');
    });

    test('4.6 - POST /api/import aceita fontes da Fase 4 (wikisource, librivox, standardebooks, europeana)', async () => {
      const fontesFase4 = ['wikisource', 'librivox', 'standardebooks', 'europeana'];
      for (const fonteSlug of fontesFase4) {
        const env = {
          ADMIN_API_KEY: ADMIN_SECRET,
          DB: createMockD1({
            firstHandler: async (sql) => {
              if (sql.includes('FROM fontes')) {
                return { id: 8, slug: fonteSlug, nome: `Fonte ${fonteSlug}`, ativa: 1 };
              }
              return null;
            },
            runHandler: async () => ({ meta: { changes: 1, last_row_id: 101 } })
          })
        };

        const res = await workerRequest('/api/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-key': ADMIN_SECRET
          },
          body: JSON.stringify({ fonte: fonteSlug, query: 'literatura' })
        }, env);

        assert.equal(res.status, 202, `Deve aceitar importação da fonte ${fonteSlug}`);
        const data = await res.json();
        assert.equal(data.fonte, fonteSlug);
        assert.equal(data.status, 'pendente');
      }
    });

    test('4.7 - POST /api/livros rejeita links da lista negra de pirataria (ex: libgen, z-library)', async () => {
      const env = {
        ADMIN_API_KEY: ADMIN_SECRET,
        DB: createMockD1()
      };

      const res = await workerRequest('/api/livros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_SECRET
        },
        body: JSON.stringify({
          titulo: 'Livro Ilegal no Worker',
          licenca: 'dominio-publico',
          links: [
            { formato: 'pdf', url: 'https://libgen.is/book/test.pdf' }
          ]
        })
      }, env);

      assert.equal(res.status, 400, 'Worker deve rejeitar link da lista negra com 400');
      const data = await res.json();
      assert.match(data.erro, /lista negra de pirataria/i);
    });
  });

  // =========================================================================
  // CENÁRIO 5: Redirecionamento 302 em Rotas de Acesso (Livros e Cursos)
  // =========================================================================
  describe('Cenário 5: Redirecionamento 302 (Zero Armazenamento Local e Intermediação Legal)', () => {
    test('5.1 - GET /api/livros/:id/ler/:linkId redireciona com HTTP 302 para a URL externa do repositório', async () => {
      const urlExterna = 'https://www.gutenberg.org/files/11/11-pdf.pdf';
      let leituraRegistrada = false;

      const env = {
        ADMIN_API_KEY: ADMIN_SECRET,
        DB: createMockD1({
          firstHandler: async (sql, params) => {
            if (sql.includes('FROM links_livros')) {
              return {
                id: 55,
                livro_id: 11,
                url: urlExterna,
                formato: 'pdf',
                link_externo: 1
              };
            }
            return null;
          },
          runHandler: async (sql) => {
            if (sql.includes('UPDATE livros SET leituras')) {
              leituraRegistrada = true;
            }
            return { meta: { changes: 1 } };
          }
        })
      };

      const res = await workerRequest('/api/livros/11/ler/55', { method: 'GET' }, env);

      assert.equal(res.status, 302, 'Deve retornar status HTTP 302 Redirect');
      assert.equal(res.headers.get('location'), urlExterna, 'Header Location deve apontar para o repositório externo');
      assert.ok(leituraRegistrada, 'Deve ter incrementado contador atômico de leituras em background');
    });

    test('5.2 - GET /api/cursos/:id/acessar redireciona com HTTP 302 para a plataforma educacional externa', async () => {
      const urlPlataforma = 'https://learn.microsoft.com/pt-pt/training/paths/build-first-app/';

      const env = {
        ADMIN_API_KEY: ADMIN_SECRET,
        DB: createMockD1({
          firstHandler: async (sql, params) => {
            if (sql.includes('FROM cursos')) {
              return {
                id: 42,
                titulo: 'Aplicações Web com Cloudflare e TypeScript',
                url: urlPlataforma
              };
            }
            return null;
          }
        })
      };

      const res = await workerRequest('/api/cursos/42/acessar', { method: 'GET' }, env);

      assert.equal(res.status, 302, 'Acesso ao curso deve retornar HTTP 302');
      assert.equal(res.headers.get('location'), urlPlataforma, 'Header Location deve conter o link original da instituição');
    });

    test('5.3 - Se o link do livro ou curso não existir, deve responder 404 (e não 302 ou 500)', async () => {
      const env = {
        ADMIN_API_KEY: ADMIN_SECRET,
        DB: createMockD1({
          firstHandler: async () => null // Nenhum registro encontrado
        })
      };

      const resLivro = await workerRequest('/api/livros/999/ler/888', { method: 'GET' }, env);
      assert.equal(resLivro.status, 404, 'Link inexistente de livro deve retornar 404');

      const resCurso = await workerRequest('/api/cursos/999/acessar', { method: 'GET' }, env);
      assert.equal(resCurso.status, 404, 'Curso inexistente deve retornar 404');
    });

    test('5.4 - GET /api/creditos retorna métricas de compliance e lista de fontes aprovadas', async () => {
      const env = {
        DB: createMockD1({
          firstHandler: async (sql) => {
            if (sql.includes('COUNT(*) AS total FROM livros')) return { total: 104848 };
            return null;
          },
          allHandler: async (sql) => {
            if (sql.includes('FROM fontes')) {
              return { results: [{ id: 1, slug: 'gutenberg', nome: 'Project Gutenberg', tipo: 'api', url_base: 'https://gutenberg.org' }] };
            }
            if (sql.includes('GROUP BY licenca')) {
              return { results: [{ licenca: 'dominio-publico', total: 100000 }] };
            }
            return { results: [] };
          }
        })
      };

      const res = await workerRequest('/api/creditos', { method: 'GET' }, env);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.status, 'ativo');
      assert.equal(data.metricas_compliance.itens_com_licenca_verificada_percentual, 100);
      assert.ok(Array.isArray(data.fontes_proibidas_blacklist));
      assert.ok(data.fontes_proibidas_blacklist.some((f) => f.includes('Z-Library')));
    });
  });

  // =========================================================================
  // CENÁRIO 6: Backend Supabase (DB_BACKEND=supabase)
  // =========================================================================
  describe('Cenário 6: Backend Supabase com recurso à D1 em caso de falha', () => {
    const envSupabase = {
      ADMIN_API_KEY: ADMIN_SECRET,
      ENVIRONMENT: 'production',
      DB_BACKEND: 'supabase',
      SUPABASE_URL: 'https://projeto-teste.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'chave-de-teste',
      DB: createMockD1()
    };

    function comFetchSimulado(handler, fn) {
      const original = globalThis.fetch;
      const chamadas = [];
      globalThis.fetch = async (url, opts = {}) => {
        const u = new URL(String(url));
        chamadas.push({ url: u, metodo: opts.method || 'GET', corpo: opts.body });
        return handler(u, opts);
      };
      return Promise.resolve()
        .then(fn)
        .finally(() => { globalThis.fetch = original; })
        .then((resultado) => ({ resultado, chamadas }));
    }

    const json = (corpo, status = 200, headers = {}) =>
      new Response(JSON.stringify(corpo), {
        status,
        headers: { 'Content-Type': 'application/json', ...headers }
      });

    test('6.1 - GET /api/fontes lê fontes e contadores do Supabase', async () => {
      const { resultado } = await comFetchSimulado((u) => {
        if (u.pathname.endsWith('/rest/v1/fontes')) {
          return json([{ id: 5, slug: 'gutenberg', nome: 'Project Gutenberg', tipo: 'api', url_base: 'https://gutendex.com', ativa: 1 }]);
        }
        if (u.pathname.endsWith('/rest/v1/contadores')) {
          return json([{ chave: '5', total: 42 }]);
        }
        return json({ erro: 'rota inesperada: ' + u.pathname }, 500);
      }, () => workerRequest('/api/fontes', { method: 'GET' }, envSupabase));

      assert.equal(resultado.status, 200);
      const dados = await resultado.json();
      assert.equal(dados.length, 1);
      assert.equal(dados[0].slug, 'gutenberg');
      assert.equal(dados[0].total_livros, 42);
    });

    test('6.2 - GET /api/livros usa buscar_livros/contar_livros e anexa links', async () => {
      const { resultado, chamadas } = await comFetchSimulado((u, opts) => {
        if (u.pathname.endsWith('/rpc/buscar_livros')) {
          return json([{
            id: 1, titulo: 'Dom Casmurro', idioma: 'pt', licenca: 'dominio-publico',
            leituras: 10, autor_nome: 'Machado de Assis', categoria_nome: 'Literatura',
            fonte_slug: 'gutenberg', fonte_nome: 'Project Gutenberg'
          }]);
        }
        if (u.pathname.endsWith('/rpc/contar_livros')) return json(5);
        if (u.pathname.endsWith('/rest/v1/links_livros')) {
          return json([{ livro_id: 1, id: 9, formato: 'epub', url: 'https://exemplo.org/dom.epub', tamanho_bytes: 100, link_externo: 1 }]);
        }
        return json({ erro: 'rota inesperada: ' + u.pathname }, 500);
      }, () => workerRequest('/api/livros?idioma=pt&page=2&limit=2', { method: 'GET' }, envSupabase));

      assert.equal(resultado.status, 200);
      const dados = await resultado.json();
      assert.equal(dados.page, 2);
      assert.equal(dados.total, 5);
      assert.equal(dados.data.length, 1);
      assert.equal(dados.data[0].links.length, 1);
      assert.equal(dados.data[0].links[0].formato, 'epub');

      const rpc = chamadas.find((c) => c.url.pathname.endsWith('/rpc/buscar_livros'));
      assert.ok(rpc, 'deveria chamar buscar_livros');
      const corpo = JSON.parse(rpc.corpo);
      assert.equal(corpo.p_idioma, 'pt');
      assert.equal(corpo.p_limit, 2);
      assert.equal(corpo.p_offset, 2);
    });

    test('6.3 - GET /api/livros/:id/ler/:linkId redireciona 302 e incrementa leitura', async () => {
      const { resultado, chamadas } = await comFetchSimulado((u) => {
        if (u.pathname.endsWith('/rest/v1/links_livros')) {
          return json([{ url: 'https://exemplo.org/livro.pdf', formato: 'pdf' }]);
        }
        if (u.pathname.endsWith('/rpc/incrementar_leitura')) return json(null, 204);
        return json({ erro: 'rota inesperada: ' + u.pathname }, 500);
      }, () => workerRequest('/api/livros/1/ler/9', { method: 'GET' }, envSupabase));

      assert.equal(resultado.status, 302);
      assert.equal(resultado.headers.get('location'), 'https://exemplo.org/livro.pdf');
      assert.ok(
        chamadas.some((c) => c.url.pathname.endsWith('/rpc/incrementar_leitura')),
        'deveria incrementar leituras no Supabase'
      );
    });

    test('6.4 - Falha do Supabase cai para a D1 (fallback)', async () => {
      const envComD1 = {
        ...envSupabase,
        DB: createMockD1({
          allHandler: async (sql) => {
            if (sql.includes('FROM fontes f')) {
              return { results: [{ id: 1, slug: 'd1-fonte', nome: 'Fonte D1', tipo: 'manual', url_base: null, ativa: 1, total_livros: 7 }] };
            }
            return { results: [] };
          }
        })
      };

      const { resultado } = await comFetchSimulado(
        () => json({ message: 'indisponível' }, 503),
        () => workerRequest('/api/fontes', { method: 'GET' }, envComD1)
      );

      assert.equal(resultado.status, 200);
      const dados = await resultado.json();
      assert.equal(dados[0].slug, 'd1-fonte');
      assert.equal(dados[0].total_livros, 7);
    });

    test('6.5 - GET /api/livros/:id devolve 404 quando o Supabase não encontra o livro', async () => {
      const { resultado } = await comFetchSimulado(
        () => json([]),
        () => workerRequest('/api/livros/123', { method: 'GET' }, envSupabase)
      );
      assert.equal(resultado.status, 404);
    });
  });

  // =========================================================================
  // CENÁRIO 7: Fila de Moderação (/api/sugestoes) e Proteção SSRF
  // =========================================================================
  describe('Cenário 7: Fila de Moderação (/api/sugestoes) e Proteção SSRF', () => {
    const envD1 = {
      ADMIN_API_KEY: ADMIN_SECRET,
      DB: createMockD1({
        runHandler: async (sql, bindings) => {
          if (sql.includes('INSERT INTO sugestoes')) {
            return { meta: { last_row_id: 42, changes: 1 } };
          }
          return { meta: { last_row_id: 1, changes: 1 } };
        },
        allHandler: async (sql, bindings) => {
          if (sql.includes('FROM sugestoes')) {
            return {
              results: [
                { id: 42, titulo: 'Livro Sugerido', autor_nome: 'Autor Teste', url_link: 'https://exemplo.org/livro', status: 'pendente' }
              ]
            };
          }
          if (sql.includes('FROM autores')) {
            return {
              results: [
                { id: 1, nome: 'Autor 1', total_livros: 1 },
                { id: 2, nome: 'Autor 2', total_livros: 2 }
              ]
            };
          }
          return { results: [] };
        }
      })
    };

    test('7.1 - POST /api/sugestoes rejeita submissão sem título ou sem URL com 400', async () => {
      const resSemTitulo = await workerRequest('/api/sugestoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url_link: 'https://archive.org/book' })
      }, envD1);
      assert.equal(resSemTitulo.status, 400);

      const resSemUrl = await workerRequest('/api/sugestoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: 'Meu Livro Aberto' })
      }, envD1);
      assert.equal(resSemUrl.status, 400);
    });

    test('7.2 - POST /api/sugestoes rejeita links de domínios proibidos / pirataria com 400', async () => {
      const res = await workerRequest('/api/sugestoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: 'Obra Ilegal',
          url_link: 'http://libgen.is/book/123.pdf'
        })
      }, envD1);
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.ok(data.erro.includes('política de compliance') || data.erro.includes('não autorizada'));
    });

    test('7.3 - POST /api/sugestoes aceita sugestão legítima e enfileira como pendente com 201', async () => {
      const res = await workerRequest('/api/sugestoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: 'O Guarani',
          autor_nome: 'José de Alencar',
          url_link: 'https://pt.wikisource.org/wiki/O_Guarani',
          licenca: 'dominio-publico'
        })
      }, envD1);
      assert.equal(res.status, 201);
      const data = await res.json();
      assert.equal(data.sucesso, true);
      assert.equal(data.id, 42);
    });

    test('7.4 - GET /api/sugestoes rejeita requisições sem chave administrativa com 401', async () => {
      const res = await workerRequest('/api/sugestoes', { method: 'GET' }, envD1);
      assert.equal(res.status, 401);
    });

    test('7.5 - GET /api/sugestoes retorna lista de sugestões com x-admin-key válida', async () => {
      const res = await workerRequest('/api/sugestoes', {
        method: 'GET',
        headers: { 'x-admin-key': ADMIN_SECRET }
      }, envD1);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data));
      assert.equal(data.length, 1);
      assert.equal(data[0].id, 42);
    });

    test('7.6 - GET /api/autores com parâmetro limit aplica paginação e devolve 200', async () => {
      const res = await workerRequest('/api/autores?limit=2', { method: 'GET' }, envD1);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data));
    });
  });

  // =========================================================================
  // CENÁRIO 8: Eficiência da D1 — nenhuma rota deve varrer a tabela de livros
  // =========================================================================
  // Sem estes cuidados, cada cache miss lia ~104.848 linhas (o JOIN de
  // /api/autores, o ORDER BY sem índice e os COUNT/GROUP BY diretos) e
  // esgotava a cota diária de 5 M de linhas lidas do plano gratuito.
  describe('Cenário 8: Eficiência da D1 (sem varreduras completas)', () => {
    const mockComTabelas = (tabelas, allHandler) => {
      const queries = [];
      const db = createMockD1({
        allHandler: async (sql, params) => {
          queries.push({ sql, params });
          if (sql.includes('sqlite_master')) {
            return { results: tabelas.map((name) => ({ name })) };
          }
          return allHandler ? allHandler(sql, params) : { results: [] };
        }
      });
      return { db, queries };
    };

    test('8.1 - GET /api/autores usa a tabela de contagens e não junta a tabela de livros', async () => {
      const { db, queries } = mockComTabelas(
        ['autores', 'livros', 'autor_totais'],
        (sql) => (sql.includes('FROM autores')
          ? { results: [{ id: 1, nome: 'Machado de Assis', total_livros: 3 }] }
          : { results: [] })
      );

      const res = await workerRequest('/api/autores', { method: 'GET' }, { DB: db });
      assert.equal(res.status, 200);

      const sqlAutores = queries.find((q) => q.sql.includes('FROM autores'));
      assert.ok(sqlAutores, 'a consulta de autores deve ter sido executada');
      assert.ok(
        !sqlAutores.sql.includes('LEFT JOIN livros'),
        'não deve juntar a tabela de livros (104.848 linhas)'
      );
      assert.ok(
        sqlAutores.sql.includes('autor_totais'),
        'deve ler a contagem de autor_totais (índice)'
      );
      assert.ok(
        sqlAutores.sql.includes('LIMIT'),
        'deve aplicar limite por omissão (evita devolver ~38 mil autores)'
      );
    });

    test('8.2 - GET /api/autores?nome= faz correspondência exacta (usa o índice)', async () => {
      const { db, queries } = mockComTabelas(
        ['autores', 'livros', 'autor_totais'],
        (sql) => (sql.includes('FROM autores')
          ? { results: [{ id: 7, nome: 'Machado de Assis', total_livros: 3 }] }
          : { results: [] })
      );

      const res = await workerRequest('/api/autores?nome=Machado%20de%20Assis', { method: 'GET' }, { DB: db });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data));

      const sqlAutores = queries.find((q) => q.sql.includes('FROM autores'));
      assert.ok(sqlAutores.sql.includes('COLLATE NOCASE'), 'a busca exacta deve ignorar maiúsculas');
      assert.ok(!sqlAutores.sql.includes('LIKE'), 'a busca exacta não deve usar LIKE');
      assert.deepEqual(sqlAutores.params[0], 'Machado de Assis');
    });

    test('8.3 - GET /api/livros?busca= conta na FTS e não na tabela de livros', async () => {
      const { db, queries } = mockComTabelas(
        ['livros', 'livros_fts', 'estatisticas', 'contadores'],
        (sql) => {
          if (sql.includes('FROM livros_fts') && sql.includes('COUNT')) return { results: [] };
          if (sql.includes('FROM livros l')) return { results: [] };
          return { results: [] };
        }
      );
      const db2 = createMockD1({
        allHandler: async (sql) => {
          queries.push({ sql, params: [] });
          return { results: [] };
        },
        firstHandler: async (sql) => {
          queries.push({ sql, params: [] });
          if (sql.includes('FROM livros_fts')) return { total: 7 };
          return null;
        }
      });

      const res = await workerRequest('/api/livros?busca=dom', { method: 'GET' }, { DB: db2 });
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.total, 7, 'o total deve vir da contagem na FTS');

      const contamTodos = queries.filter((q) =>
        /COUNT\(\*\)/.test(q.sql) && /FROM\s+livros\s+l?\b/i.test(q.sql)
      );
      assert.equal(
        contamTodos.length,
        0,
        'não deve fazer COUNT sobre a tabela de livros: ' + JSON.stringify(contamTodos.map((q) => q.sql))
      );
    });

    test('8.4 - GET /api/creditos usa os agregados e não varre a tabela de livros', async () => {
      const { db, queries } = mockComTabelas(
        ['livros', 'estatisticas', 'contadores', 'fontes'],
        (sql) => {
          if (sql.includes('FROM estatisticas')) {
            return { results: [{ chave: 'total_livros', valor: 104848 }] };
          }
          if (sql.includes('FROM contadores')) {
            return { results: [{ licenca: 'dominio-publico', total: 1000 }] };
          }
          if (sql.includes('FROM fontes')) {
            return { results: [{ id: 1, slug: 'x', nome: 'X', tipo: 'manual', url_base: 'https://x' }] };
          }
          return { results: [] };
        }
      );

      const res = await workerRequest('/api/creditos', { method: 'GET' }, { DB: db });
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.metricas_compliance.total_livros, 104848);

      const varreduras = queries.filter((q) =>
        /COUNT\(\*\)/.test(q.sql) && /FROM\s+livros\b/i.test(q.sql)
      );
      assert.equal(
        varreduras.length,
        0,
        'não deve fazer COUNT/GROUP BY sobre a tabela de livros: ' + JSON.stringify(varreduras.map((q) => q.sql))
      );
    });

    test('8.5 - A migração 0005 declara os índices de performance do acervo', () => {
      const fs = require('node:fs');
      const caminho = require('node:path').join(__dirname, '..', 'migrations', '0005_indices_performance.sql');
      assert.ok(fs.existsSync(caminho), 'a migração 0005 deve existir');
      const sql = fs.readFileSync(caminho, 'utf8');
      const exigidos = [
        'idx_livros_popularidade',
        'idx_livros_idioma_popularidade',
        'idx_livros_fonte_popularidade',
        'idx_livros_categoria_popularidade',
        'idx_livros_autor_popularidade',
        'idx_livros_licenca_popularidade',
        'idx_links_formato_livro',
        'idx_autores_nome',
        'idx_autores_nome_nocase',
        'autor_totais'
      ];
      for (const nome of exigidos) {
        assert.ok(sql.includes(nome), `a migração 0005 deve declarar ${nome}`);
      }
    });
  });
});
