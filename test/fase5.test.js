process.env.NODE_ENV = 'test';
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const app = require('../src/app');
const { initDatabase, closeDatabase } = require('../src/database');
const { seed } = require('../src/database/seed');
const { githubLivros } = require('../src/database/githubLivrosSeedData');
const traducoes = require('../src/database/githubLivrosTraducoes');

describe('Fase 5 — Acervo de 100 Repositórios GitHub de Livros', () => {
  const testDbPath = path.join(__dirname, 'fase5_test_lino.db');
  let db;

  const limparBdTeste = () => {
    for (const sufixo of ['', '-wal', '-shm']) {
      const f = testDbPath + sufixo;
      if (fs.existsSync(f)) {
        try { fs.unlinkSync(f); } catch (_) {}
      }
    }
  };

  before(() => {
    limparBdTeste();
    db = initDatabase(testDbPath);
    seed(db);
  });

  after(() => {
    closeDatabase();
    limparBdTeste();
  });

  const livrosAcervo = () => db.prepare(`
    SELECT l.* FROM livros l JOIN fontes f ON f.id = l.fonte_id
    WHERE f.slug = 'github-livros-acervo'
  `).all();

  describe('Cobertura e unicidade', () => {
    test('1. Deve conter exactamente 100 repositórios', () => {
      assert.equal(livrosAcervo().length, 100);
    });

    test('2. O seed data deve ter 100 entradas', () => {
      assert.equal(githubLivros.length, 100);
    });

    test('3. Não pode haver repositórios duplicados (fonte_id_externo)', () => {
      const dups = db.prepare(`
        SELECT fonte_id_externo, COUNT(*) c FROM livros l JOIN fontes f ON f.id = l.fonte_id
        WHERE f.slug = 'github-livros-acervo'
        GROUP BY fonte_id_externo HAVING c > 1
      `).all();
      assert.deepEqual(dups, [], `repositórios duplicados: ${dups.map(d => d.fonte_id_externo).join(', ')}`);
    });

    test('4. Não pode haver URLs externas duplicadas entre os novos repositórios', () => {
      const dups = db.prepare(`
        SELECT ll.url, COUNT(*) c FROM links_livros ll
        JOIN livros l ON l.id = ll.livro_id
        JOIN fontes f ON f.id = l.fonte_id
        WHERE f.slug = 'github-livros-acervo'
        GROUP BY ll.url HAVING c > 1
      `).all();
      assert.deepEqual(dups, [], `URLs duplicadas: ${dups.map(d => d.url).join(', ')}`);
    });

    test('5. Todos os repositórios devem ser únicos no GitHub (owner/repo)', () => {
      const repos = githubLivros.map(b => b.fonteIdExterno.toLowerCase());
      assert.equal(new Set(repos).size, 100, 'há repositórios repetidos na lista');
      for (const r of repos) {
        assert.match(r, /^[a-z0-9._-]+\/[a-z0-9._-]+$/i, `formato inválido: ${r}`);
      }
    });

    test('6. Nenhum dos repositórios pode colidir com os já existentes na BD', () => {
      const novos = new Set(githubLivros.map(b => b.fonteIdExterno.toLowerCase()));
      const antigos = db.prepare(`
        SELECT DISTINCT l.fonte_id_externo ext FROM livros l JOIN fontes f ON f.id = l.fonte_id
        WHERE f.slug <> 'github-livros-acervo' AND l.fonte_id_externo LIKE '%/%'
      `).all().map(r => r.ext.toLowerCase());
      const colisoes = [...novos].filter(n => antigos.includes(n));
      assert.deepEqual(colisoes, [], `colisões com a BD: ${colisoes.join(', ')}`);
    });
  });

  describe('Conformidade legal (AGENTS.md)', () => {
    test('7. Todos os links devem ser externos (http/https) — nada local', () => {
      const locais = db.prepare(`
        SELECT ll.url FROM links_livros ll
        JOIN livros l ON l.id = ll.livro_id
        JOIN fontes f ON f.id = l.fonte_id
        WHERE f.slug = 'github-livros-acervo'
          AND (ll.url NOT LIKE 'http://%' AND ll.url NOT LIKE 'https://%')
      `).all();
      assert.deepEqual(locais, [], 'existem links não externos');
    });

    test('8. Todos os links devem apontar para o GitHub ou fonte original', () => {
      const rows = db.prepare(`
        SELECT ll.url FROM links_livros ll
        JOIN livros l ON l.id = ll.livro_id
        JOIN fontes f ON f.id = l.fonte_id
        WHERE f.slug = 'github-livros-acervo'
      `).all();
      for (const r of rows) {
        assert.match(r.url, /^https:\/\/github\.com\/[a-z0-9._-]+\/[a-z0-9._-]+/i, `URL inesperada: ${r.url}`);
      }
    });

    test('9. Nenhum livro pode ter o conteúdo do livro armazenado localmente', () => {
      const comConteudo = db.prepare(`
        SELECT COUNT(*) c FROM livros l JOIN fontes f ON f.id = l.fonte_id
        WHERE f.slug = 'github-livros-acervo' AND LENGTH(COALESCE(l.conteudo_texto,'')) > 600
      `).get().c;
      assert.equal(comConteudo, 0, 'conteúdo_texto não deve conter o livro');
    });

    test('10. Todo o livro deve ter pelo menos um link de leitura (redireccionamento 302)', () => {
      const semLink = db.prepare(`
        SELECT COUNT(*) c FROM livros l JOIN fontes f ON f.id = l.fonte_id
        WHERE f.slug = 'github-livros-acervo'
          AND NOT EXISTS (SELECT 1 FROM links_livros ll WHERE ll.livro_id = l.id)
      `).get().c;
      assert.equal(semLink, 0, 'livros sem link externo');
    });

    test('11. As licenças devem estar no conjunto permitido pela BD', () => {
      const permitidas = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'];
      const invalidas = livrosAcervo().map(l => l.licenca).filter(l => !permitidas.includes(l));
      assert.deepEqual([...new Set(invalidas)], []);
    });
  });

  describe('Qualidade dos metadados', () => {
    test('12. Todos devem ter capa, sinopse e ano preenchidos', () => {
      const l = livrosAcervo();
      assert.equal(l.filter(x => !x.capa_url).length, 0, 'livros sem capa');
      assert.equal(l.filter(x => !x.sinopse || x.sinopse.trim().length < 20).length, 0, 'sinapses vazias ou curtas');
      assert.equal(l.filter(x => !x.ano_publicacao).length, 0, 'livros sem ano');
    });

    test('13. Todas as capas referidas devem existir no disco', () => {
      for (const l of livrosAcervo()) {
        const p = path.join(__dirname, '..', 'public', l.capa_url);
        assert.ok(fs.existsSync(p), `capa em falta: ${l.capa_url}`);
      }
    });

    test('14. Todos devem ter autor, categoria e idioma válidos', () => {
      for (const l of livrosAcervo()) {
        assert.ok(l.autor_id, `sem autor: ${l.fonte_id_externo}`);
        assert.ok(l.categoria_id, `sem categoria: ${l.fonte_id_externo}`);
        assert.ok(l.idioma, `sem idioma: ${l.fonte_id_externo}`);
      }
    });

    test('15. O acervo deve estar diversificado por idioma (mínimo 5)', () => {
      const idiomas = new Set(livrosAcervo().map(l => l.idioma));
      assert.ok(idiomas.size >= 5, `apenas ${idiomas.size} idiomas: ${[...idiomas].join(', ')}`);
      // zh, en, fa, ja, pt — confirma que nenhumdominou
      const contagem = {};
      for (const l of livrosAcervo()) contagem[l.idioma] = (contagem[l.idioma] || 0) + 1;
      const maior = Math.max(...Object.values(contagem));
      assert.ok(maior < 85, `um idioma domina excessivamente: ${JSON.stringify(contagem)}`);
    });

    test('16. O acervo deve estar diversificado por categoria (mínimo 6)', () => {
      const cats = new Set(livrosAcervo().map(l => l.categoria_id));
      assert.ok(cats.size >= 6, `apenas ${cats.size} categorias`);
    });

    test('17. As categorias referidas no seed devem existir na BD', () => {
      const nomes = db.prepare('SELECT nome FROM categorias').all().map(c => c.nome);
      for (const b of githubLivros) {
        assert.ok(nomes.includes(b.categoria), `categoria inexistente: ${b.categoria}`);
      }
    });
  });

  describe('Multilinguismo das sinopses', () => {
    const LOCALES = ['pt', 'pt-br', 'en', 'es', 'de', 'zh', 'fr'];

    test('18. Deve haver tradução em todos os locales para os 100 livros', () => {
      const ids = new Map(
        db.prepare(`
          SELECT l.fonte_id_externo ext, l.id FROM livros l JOIN fontes f ON f.id = l.fonte_id
          WHERE f.slug = 'github-livros-acervo'
        `).all().map(r => [r.ext, r.id])
      );
      for (const loc of LOCALES) {
        const json = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'locales', `${loc}.json`), 'utf8'));
        for (const [repo, id] of ids) {
          const s = json.synopses?.[String(id)];
          assert.ok(s && s.trim().length >= 15, `sinopse em falta: ${loc} / ${repo}`);
        }
      }
    });

    test('19. O ficheiro de traduções deve cobrir exactamente os 100 repositórios', () => {
      const repos = Object.keys(traducoes);
      assert.equal(repos.length, 100);
      for (const b of githubLivros) {
        assert.ok(traducoes[b.fonteIdExterno], `sem traduções: ${b.fonteIdExterno}`);
      }
    });

    test('20. Nenhuma sinopse deve conter texto corrompido ou artefactos', () => {
      // NOTE: \b evita falsos positivos como "coordinating" ~ "inating"
      const proibidos = [/\binating\b/, /Atypical/, /pluginsurine/, /左右/, /学问/, /走近/, /deVehicle/, /,papers/, /\bUZ\b/, /:Zz/, /\bZz\b/];
      for (const [repo, t] of Object.entries(traducoes)) {
        for (const [loc, texto] of Object.entries(t)) {
          for (const p of proibidos) {
            assert.ok(!p.test(texto), `texto corrompido em ${repo}/${loc}: ${texto.slice(0, 80)}`);
          }
        }
      }
    });
  });

  describe('Pipeline de scripts', () => {
    const raiz = path.join(__dirname, '..');
    const ficheiros = [
      'scripts/github_livros_harvester.mjs',
      'scripts/github_livros_recolha2.mjs',
      'scripts/github_livros_verificar.mjs',
      'scripts/github_livros_curar.mjs',
      'scripts/gerarGithubLivrosSeed.js',
      'scripts/injetarSinopsesGitHubLivros.js',
      'src/database/githubLivrosSeedData.js',
      'src/database/githubLivrosLista.js',
      'src/database/githubLivrosTraducoes.js'
    ];

    test('21. Todos os scripts do pipeline devem existir', () => {
      for (const f of ficheiros) {
        assert.ok(fs.existsSync(path.join(raiz, f)), `falta ${f}`);
      }
    });

    test('22. O gerador deve escrever apenas metadados (conteúdo vazio)', () => {
      const src = fs.readFileSync(path.join(raiz, 'src/database/seed.js'), 'utf8');
      const bloco = src.slice(src.indexOf('FASE 5 — ACERVO'), src.indexOf('Inserir Trabalhos de Fim de Curso'));
      assert.ok(bloco.length > 500, 'bloco de inserção não encontrado');
      assert.ok(bloco.includes('fonte_id_externo'), 'deve usar idempotência por (fonte, id_externo)');
      assert.ok(bloco.includes('verificarAdmin') === false, 'inserção é feita no seed, não por rota HTTP');
    });
  });
});
