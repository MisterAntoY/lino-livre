process.env.NODE_ENV = 'test';
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const app = require('../src/app');
const { initDatabase, closeDatabase } = require('../src/database');

describe('Blindagem HTTPS e Prevenção de Conteúdo Misto (Lighthouse Audit)', () => {
  let server;
  let port;
  const testDbPath = path.join(__dirname, 'https_test.db');

  const limparBd = () => {
    for (const sufixo of ['', '-wal', '-shm']) {
      const f = testDbPath + sufixo;
      if (fs.existsSync(f)) {
        try { fs.unlinkSync(f); } catch (_) {}
      }
    }
  };

  before(async () => {
    limparBd();
    const db = initDatabase(testDbPath);

    // Inserir dados de teste com URLs inseguras e seguras
    db.exec(`
      INSERT OR IGNORE INTO categorias (id, nome, descricao) VALUES (1, 'Ficção', 'Cat teste');
      INSERT OR IGNORE INTO autores (id, nome) VALUES (1, 'Autor Teste');
      INSERT OR IGNORE INTO fontes (id, slug, nome, tipo, url_base) VALUES (1, 'fonte-teste', 'Fonte Teste', 'manual', 'https://example.com');

      -- Livro 1 com capa insegura africanstorybook
      INSERT OR IGNORE INTO livros (id, titulo, idioma, licenca, capa_url, autor_id, categoria_id, fonte_id, leituras)
      VALUES (1, 'Livro Inseguro ASP', 'pt', 'dominio-publico', 'http://africanstorybook.org/illustrations/covers/18187.png', 1, 1, 1, 50);

      -- Livro 2 com capa HTTP normal
      INSERT OR IGNORE INTO livros (id, titulo, idioma, licenca, capa_url, autor_id, categoria_id, fonte_id, leituras)
      VALUES (2, 'Livro HTTP Normal', 'pt', 'dominio-publico', 'http://example.com/capa.jpg', 1, 1, 1, 40);

      -- Links com HTTP
      INSERT OR IGNORE INTO links_livros (id, livro_id, formato, url, link_externo)
      VALUES (1, 1, 'html', 'http://africanstorybook.org/reader.php?id=18187', 1);
      INSERT OR IGNORE INTO links_livros (id, livro_id, formato, url, link_externo)
      VALUES (2, 2, 'html', 'http://example.com/leitura.html', 1);
    `);

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    port = server.address().port;
  });

  after(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
    closeDatabase();
    limparBd();
  });

  const pedir = (caminho, opts = {}) => {
    return fetch(`http://127.0.0.1:${port}${caminho}`, {
      redirect: 'manual',
      ...opts
    });
  };

  test('1. Meta tag CSP em index.html contém upgrade-insecure-requests', () => {
    const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf-8');
    assert.match(html, /<meta http-equiv="Content-Security-Policy" content="[^"]*upgrade-insecure-requests;?[^"]*"/);
  });

  test('2. public/_headers contém upgrade-insecure-requests na Content-Security-Policy', () => {
    const headers = fs.readFileSync(path.join(__dirname, '../public/_headers'), 'utf-8');
    assert.match(headers, /Content-Security-Policy:.*upgrade-insecure-requests/);
  });

  test('3. workers/src/index.ts e src/app.js declaram upgrade-insecure-requests no CSP', () => {
    const workerTs = fs.readFileSync(path.join(__dirname, '../workers/src/index.ts'), 'utf-8');
    const expressApp = fs.readFileSync(path.join(__dirname, '../src/app.js'), 'utf-8');
    assert.match(workerTs, /upgrade-insecure-requests/);
    assert.match(expressApp, /upgrade-insecure-requests/);
  });

  test('4. GET /api/livros sanitiza capa_url removendo africanstorybook e elevando HTTP para HTTPS', async () => {
    const res = await pedir('/api/livros');
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.ok(Array.isArray(json.data));

    for (const livro of json.data) {
      if (livro.capa_url) {
        assert.ok(!livro.capa_url.toLowerCase().includes('africanstorybook.org'), 'Não deve conter africanstorybook na capa');
        assert.ok(!livro.capa_url.startsWith('http://'), `Capa não pode ser HTTP: ${livro.capa_url}`);
      }
      if (livro.links) {
        for (const lnk of livro.links) {
          assert.ok(!lnk.url.startsWith('http://'), `Link de leitura não pode ser HTTP: ${lnk.url}`);
        }
      }
    }
  });

  test('5. GET /api/livros/destaques sanitiza capas e links', async () => {
    const res = await pedir('/api/livros/destaques');
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.ok(Array.isArray(json.data));

    for (const livro of json.data) {
      if (livro.capa_url) {
        assert.ok(!livro.capa_url.toLowerCase().includes('africanstorybook.org'));
        assert.ok(!livro.capa_url.startsWith('http://'));
      }
    }
  });

  test('6. GET /api/livros/:id sanitiza capa e links na resposta', async () => {
    const res = await pedir('/api/livros/1');
    assert.equal(res.status, 200);
    const livro = await res.json();
    assert.equal(livro.capa_url, null, 'Capa africanstorybook deve ser anulada');
    assert.ok(livro.links.length > 0);
    assert.ok(livro.links[0].url.startsWith('https://'), 'Link deve ser atualizado para https');
  });

  test('7. Redirecionamento 302 em /api/livros/:id/ler/:linkId força HTTPS de destino', async () => {
    const res = await pedir('/api/livros/2/ler/2');
    assert.equal(res.status, 302);
    const destino = res.headers.get('location') || '';
    assert.ok(destino.startsWith('https://'), `Redirecionamento deve ser HTTPS: ${destino}`);
  });

  test('8. Proxy /api/capas redireciona 302 para fallback local quando solicitado com africanstorybook', async () => {
    const res = await pedir('/api/capas?u=' + encodeURIComponent('http://africanstorybook.org/illustrations/covers/18187.png'));
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('location'), '/capas/dom_casmurro.jpg');
  });

  test('9. public/js/app.js capaProxyUrl e sanitizeUrl tratam URLs com integridade', () => {
    const appJs = fs.readFileSync(path.join(__dirname, '../public/js/app.js'), 'utf-8');
    assert.match(appJs, /africanstorybook\.org/);
    assert.match(appJs, /parsed\.protocol\s*===\s*'http:'/);
  });
});
