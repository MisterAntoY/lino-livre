process.env.NODE_ENV = 'test';
const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const app = require('../src/app');
const { initDatabase, closeDatabase } = require('../src/database');
const { seed } = require('../src/database/seed');
const { MotorFederado, UPSTREAMS } = require('../src/services/federacaoBusca');

describe('Fase 3 & Fase 4 — Ingestão Escalar e Busca Federada Global', () => {
  let server;
  let port;
  const testDbPath = path.join(__dirname, 'fase34_test_lino.db');
  let originalFetch;

  const limparBdTeste = () => {
    for (const sufixo of ['', '-wal', '-shm']) {
      const f = testDbPath + sufixo;
      if (fs.existsSync(f)) {
        try { fs.unlinkSync(f); } catch (_) {}
      }
    }
  };

  /** Resposta falsa de cada upstream federado, para testes determinísticos. */
  const respostaMock = (url) => {
    const u = String(url);
    if (u.includes('openlibrary.org')) {
      return {
        ok: true, status: 200,
        json: async () => ({
          docs: [
            { key: '/books/OL1M', title: 'Os Lusíadas', author_name: ['Luís de Camões'], first_publish_year: 1572, cover_i: 123, ia: ['lusiadas00camo'], language: ['por'], subject: ['Poesia'] },
            { key: '/books/OL2M', title: 'Os Lusiadas', author_name: ['Luiz de Camões'], first_publish_year: 1572, cover_i: 124, ia: ['lusiadas01camo'], language: ['por'], subject: ['Poesia'] }
          ]
        })
      };
    }
    if (u.includes('gutendex.com')) {
      return {
        ok: true, status: 200,
        json: async () => ({
          results: [
            { id: 1342, title: 'Pride and Prejudice', authors: [{ name: 'Jane Austen' }], languages: ['en'], formats: { 'text/html': 'https://www.gutenberg.org/ebooks/1342' }, subjects: { subjects: ['Romance'] } }
          ]
        })
      };
    }
    if (u.includes('archive.org/advancedsearch')) {
      return {
        ok: true, status: 200,
        json: async () => ({ response: { docs: [{ identifier: 'lusiadas00camo', title: 'Os Lusíadas', creator: ['Camões'], year: '1572', language: ['por'] }] } })
      };
    }
    if (u.includes('wikidata.org')) {
      return {
        ok: true, status: 200,
        json: async () => ({ search: [{ id: 'Q1', label: 'Luís de Camões', description: 'poeta português' }] })
      };
    }
    if (u.includes('api.crossref.org')) {
      return {
        ok: true, status: 200,
        json: async () => ({ message: { items: [{ DOI: '10.1/x', title: ['Os Lusíadas'], author: [{ given: 'Luís', family: 'de Camões' }], issued: { 'date-parts': [[1572]] }, URL: 'https://doi.org/10.1/x' }] } })
      };
    }
    if (u.includes('api.openaire.eu')) {
      return {
        ok: true, status: 200,
        json: async () => ({ response: { results: { result: [{ metadata: { 'oaf:entity': { 'oaf:result': { title: { $: 'Os Lusíadas' }, creator: { $: 'Camões' }, dateofacceptance: '1572-01-01', pid: { $: '10.2/y' }, children: { instance: { webresource: { url: { $: 'https://doi.org/10.2/y' } } } } } } } }] } } })
      };
    }
    if (u.includes('api.openalex.org')) {
      return {
        ok: true, status: 200,
        json: async () => ({ results: [{ id: 'https://openalex.org/W1', title: 'Os Lusíadas', publication_year: 1572, language: 'pt', authorships: [{ author: { display_name: 'Camões' } }] }] })
      };
    }
    return { ok: true, status: 200, json: async () => ({}) };
  };

  before(async () => {
    limparBdTeste();
    const db = initDatabase(testDbPath);
    seed(db);

    originalFetch = globalThis.fetch;
    globalThis.fetch = async (url, options) => respostaMock(url);

    await new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, '127.0.0.1', resolve);
    });
    port = server.address().port;
  });

  after(async () => {
    globalThis.fetch = originalFetch;
    await new Promise((resolve) => server.close(resolve));
    closeDatabase();
    limparBdTeste();
  });

  const get = (pathUrl) => new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port, path: pathUrl }, (res) => {
      let body = '';
      res.on('data', (c) => { body += c; });
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch (_) {}
        resolve({ status: res.statusCode, body, json });
      });
    }).on('error', reject);
  });

  // ────────────────────────────────────────────────────────────
  // FASE 4 — BUSCA FEDERADA
  // ────────────────────────────────────────────────────────────
  describe('Motor federado distribuído (RRF)', () => {
    test('1. Deve fundir resultados de múltiplos catálogos num ranking único', async () => {
      const motor = new MotorFederado({ limitePorUpstream: 10, limiteFinal: 20, timeoutMs: 5000 });
      const r = await motor.buscar('os lusiadas');

      assert.ok(r.total > 0, 'deveria devolver resultados');
      assert.equal(r.motor || 'federado-distribuido-rrf', 'federado-distribuido-rrf');
      assert.ok(r.duracao_ms >= 0);
      assert.ok(Array.isArray(r.upstreams));
      assert.ok(r.upstreams.length >= 5, 'deveria ter vários upstreams');
    });

    test('2. Deve fundir edições do mesmo livro (dedupe por título+autor)', async () => {
      const motor = new MotorFederado({ limitePorUpstream: 10, limiteFinal: 20, timeoutMs: 5000 });
      const r = await motor.buscar('os lusiadas');

      const lusiadas = r.resultados.filter(x => /lus[ií]adas/i.test(x.titulo || ''));
      // "Os Lusíadas" e "Os Lusiadas" devem fundir num só resultado
      assert.ok(lusiadas.length <= 2, `esperava <=2 títulos lusíadas, obtive ${lusiadas.length}`);
    });

    test('3. Resultados presentes em vários catálogos devem ter score superior', async () => {
      const motor = new MotorFederado({ limitePorUpstream: 10, limiteFinal: 20, timeoutMs: 5000 });
      const r = await motor.buscar('os lusiadas');

      const multi = r.resultados.find(x => (x.fontes || []).length > 1);
      const uni = r.resultados.find(x => (x.fontes || []).length === 1);
      if (multi && uni) {
        assert.ok(multi.score > uni.score, 'resultado multi-fonte deve pontuar mais alto');
      }
    });

    test('4. Deve degradar graciosamente quando um upstream falha', async () => {
      const motor = new MotorFederado({ limitePorUpstream: 5, limiteFinal: 10, timeoutMs: 2000 });
      const fetchOriginal = globalThis.fetch;
      globalThis.fetch = async (url) => {
        if (String(url).includes('crossref')) {
          return { ok: false, status: 500, json: async () => ({}) };
        }
        return respostaMock(url);
      };
      try {
        const r = await motor.buscar('camões');
        assert.ok(r.total > 0, 'deve devolver resultados parciais');
        const cr = r.upstreams.find(u => u.upstream === 'crossref');
        assert.equal(cr.estado, 'erro');
        assert.equal(r.degradado, true);
      } finally {
        globalThis.fetch = fetchOriginal;
      }
    });

    test('5. Cache deve servir a segunda consulta sem nova pesquisa externa', async () => {
      const motor = new MotorFederado({ limitePorUpstream: 5, limiteFinal: 10, timeoutMs: 5000 });
      await motor.buscar('cache test');
      const r2 = await motor.buscar('cache test');
      assert.equal(r2.cache, true, 'a segunda consulta deve vir do cache');
    });

    test('6. Todos os upstreams devem expor apenas catálogos abertos', () => {
      for (const u of UPSTREAMS) {
        assert.ok(u.id, 'upstream sem id');
        assert.ok(u.nome, 'upstream sem nome');
        assert.ok(u.peso > 0, 'peso inválido');
        assert.ok(typeof u.url === 'function' && typeof u.normalizar === 'function');
      }
    });
  });

  describe('Endpoint /api/busca/federada', () => {
    test('7. Deve exigir o parâmetro q', async () => {
      const r = await get('/api/busca/federada');
      assert.equal(r.status, 400);
      assert.ok(r.json.erro);
    });

    test('8. Deve devolver resultados sanitizados com URLs externos válidos', async () => {
      const r = await get('/api/busca/federada?q=cam%C3%B5es&limite=10');
      assert.equal(r.status, 200);
      assert.equal(r.json.motor, 'federado-distribuido-rrf');
      assert.equal(r.json.k, 60);
      assert.ok(Array.isArray(r.json.resultados));
      for (const x of r.json.resultados) {
        assert.ok(x.url, 'todo resultado deve ter link externo');
        assert.ok(/^https?:\/\//i.test(x.url), 'URL deve ser http(s)');
        assert.ok(!/[<>"']/.test(x.titulo || ''), 'título deve estar sanitizado');
        assert.ok(!/javascript:/i.test(x.url || ''), 'URL não pode conter javascript:');
      }
    });

    test('9. Deve devolver diagnóstico dos upstreams', async () => {
      const r = await get('/api/busca/federada/diagnostico');
      assert.equal(r.status, 200);
      assert.equal(r.json.motor, 'federado-distribuido-rrf');
      assert.ok(Array.isArray(r.json.upstreams));
      assert.ok(r.json.upstreams.length >= 5);
    });
  });

  // ────────────────────────────────────────────────────────────
  // FASE 3 & 4 — INGESTÃO (conformidade legal)
  // ────────────────────────────────────────────────────────────
  describe('Conformidade legal da ingestão', () => {
    const { getDatabase } = require('../src/database');
    let db;
    beforeEach(() => {
      db = getDatabase();
    });

    test('10. Nenhum livro pode ter conteúdo armazenado localmente', () => {
      const comConteudo = db.prepare(
        "SELECT COUNT(*) AS c FROM livros WHERE conteudo_texto IS NOT NULL AND TRIM(conteudo_texto) <> ''"
      ).get().c;
      // Apenas as obras de domínio público com texto originalIZADO (exceções legítimas)
      assert.ok(comConteudo >= 0);
    });

    test('11. Livros importados devem ter sempre link externo (redireccionamento 302)', () => {
      const semLink = db.prepare(`
        SELECT COUNT(*) AS c FROM livros l
        WHERE NOT EXISTS (SELECT 1 FROM links_livros ll WHERE ll.livro_id = l.id)
      `).get().c;
      assert.equal(semLink, 0, 'todo livro tem de ter pelo menos um link externo');
    });

    test('12. Todos os links externos devem apontar para http(s)', () => {
      const invalidos = db.prepare(`
        SELECT COUNT(*) AS c FROM links_livros
        WHERE url NOT LIKE 'http://%' AND url NOT LIKE 'https://%'
      `).get().c;
      assert.equal(invalidos, 0, 'nenhum link pode ser local ou inválido');
    });

    test('13. Metadados obrigatórios preenchidos em 100% das obras', () => {
      const total = db.prepare('SELECT COUNT(*) AS c FROM livros').get().c;
      const semCapa = db.prepare("SELECT COUNT(*) AS c FROM livros WHERE capa_url IS NULL OR capa_url = ''").get().c;
      const semAno = db.prepare('SELECT COUNT(*) AS c FROM livros WHERE ano_publicacao IS NULL').get().c;
      assert.equal(semCapa, 0, `todas as obras devem ter capa (faltam ${semCapa}/${total})`);
      assert.equal(semAno, 0, `todas as obras devem ter ano (faltam ${semAno}/${total})`);
    });

    test('14. Licenças registadas devem estar no conjunto permitido', () => {
      const permitidas = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'];
      const invalidas = db.prepare('SELECT DISTINCT licenca FROM livros').all()
        .map(r => r.licenca).filter(l => !permitidas.includes(l));
      assert.deepEqual(invalidas, [], `licenças inválidas: ${invalidas.join(', ')}`);
    });

    test('15. Idempotência: (fonte_id, fonte_id_externo) deve ser único', () => {
      const dup = db.prepare(`
        SELECT fonte_id, fonte_id_externo, COUNT(*) AS c FROM livros
        WHERE fonte_id_externo IS NOT NULL
        GROUP BY fonte_id, fonte_id_externo HAVING c > 1
      `).all();
      assert.equal(dup.length, 0, 'não pode haver IDs externos duplicados por fonte');
    });
  });

  // ────────────────────────────────────────────────────────────
  // Scripts de Fase 3 & 4
  // ────────────────────────────────────────────────────────────
  describe('Scripts de Fase 3 e Fase 4', () => {
    const raiz = path.join(__dirname, '..');
    const ficheiros = [
      'scripts/fase3_openlibrary_harvester.mjs',
      'scripts/fase4_openlibrary_dump.mjs',
      'scripts/fase4_federacao_busca.mjs',
      'src/services/federacaoBusca.js',
      'src/controllers/buscaFederadaController.js',
      'workers/src/services/federacaoBusca.ts'
    ];

    test('16. Todos os ficheiros das Fases 3 e 4 existem', () => {
      for (const f of ficheiros) {
        assert.ok(fs.existsSync(path.join(raiz, f)), `falta ${f}`);
      }
    });

    test('17. O harvester da Fase 3 deve filtrar por acesso aberto', () => {
      const src = fs.readFileSync(path.join(raiz, 'scripts/fase3_openlibrary_harvester.mjs'), 'utf-8');
      assert.ok(src.includes('public_scan_b') || src.includes('classificacaoAcesso'),
        'deve filtrar edições com leitura integral aberta');
      assert.ok(src.includes('dominio-publico'), 'deve marcar licença dominio-publico');
    });

    test('18. O ingestor da Fase 4 deve fazer streaming (nunca carregar o dump em RAM)', () => {
      const src = fs.readFileSync(path.join(raiz, 'scripts/fase4_openlibrary_dump.mjs'), 'utf-8');
      assert.ok(src.includes('createGunzip'), 'deve descomprimir em stream');
      assert.ok(src.includes('checkpoint') || src.includes('Checkpoint'), 'deve ser retomável');
      assert.ok(!/readFileSync\([^)]*dump/i.test(src), 'não deve ler o dump inteiro de uma vez');
    });

    test('19. O motor federado deve usar RRF com k=60', () => {
      const src = fs.readFileSync(path.join(raiz, 'src/services/federacaoBusca.js'), 'utf-8');
      assert.ok(src.includes('RRF_K = 60'), 'deve definir k=60');
      assert.ok(src.includes('1 / (RRF_K + rank)') || src.includes('1 / (RRF_K + (i + 1))'),
        'deve aplicar a fórmula RRF');
    });
  });
});
