/**
 * Testes Unitários TDD — Leitura (/ler) e Baixar PDF + Integridade do Acervo
 * ==========================================================================
 * Aplicando a teoria do TDD (Red -> Green -> Refactor), esta suíte automatiza:
 *
 * 1. LEITURA — GET /api/livros/:id/ler/:linkId
 *    - 302 para a fonte externa com incremento atômico de leituras
 *    - Upgrade http:// -> https:// no destino do redirecionamento
 *    - 404 seguro para IDs não numéricos (anti-SQLi) e inexistentes
 *    - 404 para IDOR cross-resource (linkId de outro livro)
 *    - JSON de leitura local quando o link é web interno (url vazia)
 *    - 400 (política, não 500 interno) quando o link viola a lista negra
 *      antipirataria (libgen, z-library, sci-hub, annas-archive, ...)
 *
 * 2. BAIXAR PDF — fluxo idêntico ao "Ler", mas com enfoque no link formato=pdf:
 *    - Todas as cartas do catálogo com badge PDF expõem um link pdf válido
 *    - Amostra determinística de links PDF responde 302 com destino https
 *      exterior permitido (sem SSRF, sem domínios piratas)
 *    - Zero esquemas perigosos (javascript:, data:, vbscript:)
 *
 * 3. INTEGRIDADE DO ACERVO (imagens, títulos e descrições):
 *    - 100% das capas locais existem com assinatura de imagem válida
 *      (PNG/JPG/GIF/WEBP/SVG) e não têm 0 bytes
 *    - 100% das capas externas pertencem à allowlist do proxy /api/capas
 *      (garante que nenhuma capa quebra em produção por host não autorizado)
 *    - Todos os livros têm título e sinopse sem placeholders/mojibake
 *    - Zero duplicatas (titulo + autor)
 */

process.env.NODE_ENV = 'test';
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');

const app = require('../src/app');
const { initDatabase, getDatabase, closeDatabase } = require('../src/database');
const { seed } = require('../src/database/seed');
const { hostCapaPermitido } = require('../src/controllers/capasController');
const { DOMINIOS_PROIBIDOS, hostInterno } = require('../src/utils/urlValidator');

describe('Suíte TDD — Ler e Baixar PDF + Integridade de Imagens, Títulos e Descrições', () => {
  let server;
  let port;
  const testDbPath = path.join(__dirname, 'ler_baixar_pdf_test_lino.db');

  let livroLocalWeb = null;     // livro com leitura web local (url vazia)
  let livroPdfHttp = null;      // livro com link PDF em http:// (teste de upgrade)
  let livroPdfProibido = null;  // livro com link PDF de domínio pirata
  let acervoSemeado = null;     // snapshot do acervo REAL (sem fixtures de teste)

  const limparBdTeste = () => {
    for (const sufixo of ['', '-wal', '-shm']) {
      const f = testDbPath + sufixo;
      if (fs.existsSync(f)) {
        try { fs.unlinkSync(f); } catch (_) {}
      }
    }
  };

  before(async () => {
    limparBdTeste();
    const db = initDatabase(testDbPath);
    seed(db);

    // Snapshot do acervo REAL capturado ANTES das fixtures (seed limpo)
    acervoSemeado = db.prepare('SELECT id, titulo, sinopse, capa_url FROM livros ORDER BY id ASC').all();

    // ------------------------------------------------------------ Fixture 1:
    // livro com leitura web local (link sem url -> JSON com conteudo_texto)
    const resLocal = db.prepare(`
      INSERT INTO livros (titulo, idioma, licenca, conteudo_texto, ano_publicacao)
      VALUES ('Obra Teste Leitura Local Web', 'pt', 'dominio-publico', 'Texto integral de teste para a leitura web local do Lino Livre. Obra em dominio publico universal.', 2024)
    `).run();
    const idLocal = Number(resLocal.lastInsertRowid);
    db.prepare(`INSERT INTO links_livros (livro_id, formato, url, tamanho_bytes, link_externo) VALUES (?, 'html', '', 0, 0)`)
      .run(idLocal);
    livroLocalWeb = { id: idLocal };

    // ------------------------------------------------------------ Fixture 2:
    // livro com link PDF em http:// (o backend deve fazer upgrade para https)
    const resHttp = db.prepare(`
      INSERT INTO livros (titulo, idioma, licenca, ano_publicacao)
      VALUES ('Obra Teste PDF HTTP Upgrade', 'pt', 'dominio-publico', 2024)
    `).run();
    const idHttp = Number(resHttp.lastInsertRowid);
    db.prepare(`INSERT INTO links_livros (livro_id, formato, url, tamanho_bytes, link_externo) VALUES (?, 'pdf', 'http://example.com/obra-teste.pdf', 0, 1)`)
      .run(idHttp);
    livroPdfHttp = { id: idHttp };

    // ------------------------------------------------------------ Fixture 3:
    // livro cujo link PDF viola a política antipirataria (lista negra)
    const resPirata = db.prepare(`
      INSERT INTO livros (titulo, idioma, licenca, ano_publicacao)
      VALUES ('Obra Teste Link Proibido Pirataria', 'pt', 'dominio-publico', 2024)
    `).run();
    const idPirata = Number(resPirata.lastInsertRowid);
    db.prepare(`INSERT INTO links_livros (livro_id, formato, url, tamanho_bytes, link_externo) VALUES (?, 'pdf', 'https://libgen.is/obra-teste.pdf', 0, 1)`)
      .run(idPirata);
    livroPdfProibido = { id: idPirata };

    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        port = server.address().port;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      if (server.closeAllConnections) server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
    }
    closeDatabase();
    limparBdTeste();
  });

  const apiFetch = async (urlPath, options = {}) => {
    const url = `http://127.0.0.1:${port}${urlPath}`;
    const headers = { ...(options.headers || {}) };
    let body = options.body;
    if (body && typeof body === 'object') {
      body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }
    const res = await fetch(url, {
      ...options,
      headers,
      body,
      redirect: options.redirect || 'manual'
    });
    let data;
    const cType = res.headers.get('content-type') || '';
    if (cType.includes('application/json')) {
      data = await res.json().catch(() => null);
    } else {
      data = await res.text();
    }
    return { status: res.status, headers: res.headers, body: data };
  };

  const linkDoLivro = (livroId, formato = null) => {
    const db = getDatabase();
    if (formato) {
      return db.prepare('SELECT id, livro_id, formato, url FROM links_livros WHERE livro_id = ? AND formato = ? LIMIT 1').get(livroId, formato);
    }
    return db.prepare('SELECT id, livro_id, formato, url FROM links_livros WHERE livro_id = ? LIMIT 1').get(livroId);
  };

  const normalizarHttps = (url) => (typeof url === 'string' && url.startsWith('http://') ? 'https://' + url.slice(7) : url);

  const ehPirata = (url) => (DOMINIOS_PROIBIDOS.some((d) => String(url).toLowerCase().includes(d.toLowerCase())));

  // =========================================================================
  // 1. LEITURA — GET /api/livros/:id/ler/:linkId
  // =========================================================================
  describe('1. Leitura — GET /api/livros/:id/ler/:linkId (proxy 302 inteligente)', () => {

    test('1.1 — Link válido responde 302 e Location = destino externo validado', async () => {
      const db = getDatabase();
      const link = db.prepare(`
        SELECT ll.id, ll.livro_id, ll.url FROM links_livros ll
        JOIN livros l ON l.id = ll.livro_id
        WHERE ll.url LIKE 'http%' ORDER BY ll.id ASC LIMIT 1
      `).get();
      assert.ok(link, 'O acervo semeado deve ter pelo menos um link externo');

      const res = await apiFetch(`/api/livros/${link.livro_id}/ler/${link.id}`);
      assert.equal(res.status, 302, `Esperado 302, recebido ${res.status}`);

      const location = res.headers.get('location');
      assert.ok(location, 'Redirecionamento deve ter Location');
      assert.match(location, /^https:\/\//, 'Location deve ser HTTPS');
      assert.equal(location, normalizarHttps(link.url),
        'Location deve ser exatamente a URL registada (com upgrade para https)');
      assert.ok(!ehPirata(location), 'Location não pode apontar para domínio pirata');
      assert.ok(!hostInterno(new URL(location).hostname), 'Location não pode apontar para rede interna (SSRF)');
    });

    test('1.2 — Leitura incrementa o contador de leituras em exatamente 1', async () => {
      const db = getDatabase();
      const link = db.prepare(`
        SELECT ll.id, ll.livro_id FROM links_livros ll
        JOIN livros l ON l.id = ll.livro_id
        WHERE ll.url LIKE 'http%' ORDER BY ll.id ASC LIMIT 1
      `).get();
      assert.ok(link);

      const antes = db.prepare('SELECT leituras FROM livros WHERE id = ?').get(link.livro_id).leituras;
      await apiFetch(`/api/livros/${link.livro_id}/ler/${link.id}`);
      const depois = db.prepare('SELECT leituras FROM livros WHERE id = ?').get(link.livro_id).leituras;
      assert.equal(depois - antes, 1, 'Contador de leituras deve crescer exatamente 1 por leitura');
    });

    test('1.3 — Upgrade automático http:// -> https:// no destino (mixed content bloqueado)', async () => {
      const link = linkDoLivro(livroPdfHttp.id, 'pdf');
      assert.ok(link, 'Fixture de PDF http:// deve existir');
      const res = await apiFetch(`/api/livros/${link.livro_id}/ler/${link.id}`);
      assert.equal(res.status, 302);
      assert.equal(res.headers.get('location'), 'https://example.com/obra-teste.pdf',
        `Esperado upgrade para https://example.com/obra-teste.pdf, recebido "${res.headers.get('location')}"`);
    });

    test('1.4 — :id e :linkId não numéricos respondem 404 (anti-SQLi, nunca 500)', async () => {
      const casos = [
        '/api/livros/abc/ler/1',
        '/api/livros/1/ler/xyz',
        "/api/livros/1%20OR%201=1/ler/1",
        '/api/livros/-1/ler/1'
      ];
      for (const rota of casos) {
        const res = await apiFetch(rota);
        assert.equal(res.status, 404, `Rota "${rota}" deve responder 404 (recebido ${res.status})`);
      }
    });

    test('1.5 — Livro ou link inexistente responde 404 seguro', async () => {
      const resLivroFantasma = await apiFetch('/api/livros/99999999/ler/1');
      assert.equal(resLivroFantasma.status, 404);

      const db = getDatabase();
      const link = db.prepare('SELECT id, livro_id FROM links_livros LIMIT 1').get();
      assert.ok(link);
      const resLinkFantasma = await apiFetch(`/api/livros/${link.livro_id}/ler/99999999`);
      assert.equal(resLinkFantasma.status, 404);
    });

    test('1.6 — IDOR cross-resource: link PDF de OUTRO livro responde 404', async () => {
      const db = getDatabase();
      const pares = db.prepare(`
        SELECT a.id AS idA, a.livro_id AS livroA, b.id AS idB
        FROM links_livros a
        JOIN links_livros b ON b.livro_id <> a.livro_id
        WHERE a.formato = 'pdf' AND b.formato = 'pdf'
        LIMIT 1
      `).get();
      assert.ok(pares, 'Devem existir PDFs suficientes para o teste IDOR');
      const res = await apiFetch(`/api/livros/${pares.livroA}/ler/${pares.idB}`);
      assert.equal(res.status, 404, 'Não é permitido ler um link pertencente a outro livro');
    });

    test('1.7 — Link web local (url vazia) devolve JSON com mensagem e conteudo_texto (sem 302)', async () => {
      const link = linkDoLivro(livroLocalWeb.id, 'html');
      assert.ok(link, 'Fixture de leitura local deve existir');
      const res = await apiFetch(`/api/livros/${link.livro_id}/ler/${link.id}`);
      assert.equal(res.status, 200);
      assert.ok(res.body);
      assert.equal(res.body.mensagem, 'Leitura iniciada');
      assert.ok(res.body.conteudo_texto, 'Leitura local deve devolver o conteudo_texto da obra');
      assert.equal(res.headers.get('location'), null, 'Não deve redirecionar para fora');
    });

    test('1.8 — TDD: link de domínio pirata DEVE responder 400 (política), nunca 500', async () => {
      const link = linkDoLivro(livroPdfProibido.id, 'pdf');
      assert.ok(link, 'Fixture de link pirata deve existir');
      const res = await apiFetch(`/api/livros/${link.livro_id}/ler/${link.id}`);
      assert.equal(res.status, 400, `Violação de compliance deve ser 400 (recebido ${res.status})`);
      assert.ok(res.body && res.body.erro, 'Deve devolver mensagem de erro de política');
      assert.equal(res.headers.get('location'), null, 'Nenhum redirecionamento para fontes piratas');
    });

    test('1.9 — Fluxo "Baixar PDF": usa o link correto do formato pdf do livro', async () => {
      const db = getDatabase();
      const livro = db.prepare(`
        SELECT l.id FROM livros l
        WHERE l.id IN (SELECT livro_id FROM links_livros WHERE formato='pdf')
        LIMIT 1
      `).get();
      assert.ok(livro);
      const linkPdf = linkDoLivro(livro.id, 'pdf');
      assert.ok(linkPdf, 'O livro deve ter o link pdf que a carta do acervo usa para Baixar');

      const res = await apiFetch(`/api/livros/${livro.id}/ler/${linkPdf.id}`);
      assert.equal(res.status, 302);
      assert.equal(res.headers.get('location'), normalizarHttps(linkPdf.url),
        'Baixar PDF deve redirecionar exatamente para a url registada do formato pdf');
    });
  });

  // =========================================================================
  // 2. BAIXAR PDF — integridade de todo o fluxo de download
  // =========================================================================
  describe('2. Baixar PDF — fluxo de download (formato pdf)', () => {

    // As fixtures do grupo 1 (incluindo a de link pirata) já serviram ao seu
    // propósito: removê-las para que as varreduras abaixo analisem apenas o
    // acervo real semeado.
    before(() => {
      const db = getDatabase();
      for (const fixture of [livroLocalWeb, livroPdfHttp, livroPdfProibido]) {
        db.prepare('DELETE FROM links_livros WHERE livro_id = ?').run(fixture.id);
        db.prepare('DELETE FROM livros WHERE id = ?').run(fixture.id);
      }
    });

    test('2.1 — Todas as cartas do catálogo com badge PDF expõem link pdf válido', async () => {
      const res = await apiFetch('/api/livros?limite=100&page=1');
      assert.equal(res.status, 200);
      const livros = res.body.data || [];
      assert.ok(livros.length > 0);
      assert.equal(res.body.page, 1);
      assert.equal(res.body.limit, 100);

      let comPdf = 0;
      for (const livro of livros) {
        const linkPdf = (livro.links || []).find((l) => l.formato === 'pdf');
        if (!linkPdf) continue;
        comPdf++;
        assert.ok(linkPdf.id, `Livro ${livro.id}: link pdf precisa de id para /ler`);
        assert.ok(linkPdf.url, `Livro ${livro.id}: link pdf precisa de url`);
        assert.match(linkPdf.url, /^https:\/\//, `Livro ${livro.id}: url pdf deve ser HTTPS (recebido ${linkPdf.url})`);
        assert.ok(!ehPirata(linkPdf.url), `Livro ${livro.id}: url pdf não pode ser pirata`);
      }
      assert.ok(comPdf > 0, 'A primeira página do catálogo deve expor ao menos um badge PDF');
    });

    test('2.2 — Amostra determinística de 20 links PDF responde 302 https exterior permitido', async () => {
      const db = getDatabase();
      const pdfs = db.prepare(`
        SELECT ll.id, ll.livro_id, ll.url FROM links_livros ll
        WHERE ll.formato = 'pdf' AND ll.url LIKE 'http%'
        ORDER BY ll.id ASC
      `).all();
      assert.ok(pdfs.length >= 20, `Devem existir >= 20 PDFs no acervo (existem ${pdfs.length})`);

      const passo = Math.max(1, Math.floor(pdfs.length / 20));
      const amostra = pdfs.filter((_, i) => i % passo === 0).slice(0, 20);
      assert.equal(amostra.length, 20);

      for (const link of amostra) {
        const res = await apiFetch(`/api/livros/${link.livro_id}/ler/${link.id}`);
        assert.equal(res.status, 302, `PDF #${link.id} do livro ${link.livro_id} deveria 302`);
        const location = res.headers.get('location') || '';
        assert.match(location, /^https:\/\//, `PDF #${link.id}: destino deve ser https (recebido ${location})`);
        assert.ok(!ehPirata(location), `PDF #${link.id}: destino pirata proibido (${location})`);
        assert.ok(!hostInterno(new URL(location).hostname), `PDF #${link.id}: destino interno proibido (${location})`);
      }
    });

    test('2.3 — ZERO links PDF com esquemas perigosos (javascript:, data:, vbscript:)', async () => {
      const db = getDatabase();
      const ruins = db.prepare(`
        SELECT COUNT(*) c FROM links_livros
        WHERE formato = 'pdf' AND (
          LOWER(url) LIKE 'javascript:%' OR LOWER(url) LIKE 'data:%'
          OR LOWER(url) LIKE 'vbscript:%'
        )
      `).get();
      assert.equal(ruins.c, 0, `Esquemas perigosos em links PDF: ${ruins.c}`);
    });

    test('2.4 — ZERO links PDF para domínios da lista negra de pirataria', async () => {
      const db = getDatabase();
      const pdfs = db.prepare("SELECT url FROM links_livros WHERE formato = 'pdf' AND url LIKE 'http%'").all();
      assert.ok(pdfs.length > 0);
      const ruins = pdfs.filter((l) => ehPirata(l.url));
      assert.deepEqual(ruins, [], `Links pdf piratas: ${JSON.stringify(ruins.slice(0, 3))}`);
    });

    test('2.5 — ZERO destinos de PDF em rede interna/privada (SSRF)', async () => {
      const db = getDatabase();
      const pdfs = db.prepare("SELECT url FROM links_livros WHERE formato='pdf' AND url LIKE 'http%'").all();
      const ruins = pdfs.filter((l) => {
        try { return hostInterno(new URL(l.url).hostname); } catch (_) { return true; }
      });
      assert.deepEqual(ruins, [], `Links pdf com destino interno: ${JSON.stringify(ruins.slice(0, 3))}`);
    });
  });

  // =========================================================================
  // 3. INTEGRIDADE DO ACERVO — imagens (capas), títulos e sinopses
  // =========================================================================
  describe('3. Integridade do acervo — capas (imagens), títulos e sinopses', () => {

    // Snapshot do acervo REAL capturado logo após o seed (sem fixtures)
    const lerAcervo = () => acervoSemeado;

    test('3.1 — Cada livro tem título real (sem vazio, placeholder, mojibake ou controle)', () => {
      const PLACEHOLDER = /^\s*(n\/?a|none|null|undefined|unknown|sem\s*titulo|sin\s*titulo|-+|\.+)\s*$/i;
      // Mojibake real = UTF-8 duplamente codificado (Ã seguido de Latin-1 Supplement,
      // â + € ou caractere de substituição U+FFFD). "Ã" ou "â" isolados são letras
      // portuguesas legítimas (MÃE, âncora) e NÃO podem falhar.
      const MOJIBAKE = /\ufffd|\u00c3[\u0080-\u00bf]|\u00e2[\u20ac\u201a\u2020\u2122]/;
      for (const livro of lerAcervo()) {
        const t = String(livro.titulo || '').trim();
        assert.ok(t.length >= 2, `Livro ${livro.id}: título inválido (${JSON.stringify(t)})`);
        assert.ok(!PLACEHOLDER.test(t), `Livro ${livro.id}: título placeholder (${t})`);
        assert.ok(!MOJIBAKE.test(t), `Livro ${livro.id}: mojibake no título (${t})`);
        assert.ok(!/[\u0000-\u0008\u000e-\u001f]/.test(t), `Livro ${livro.id}: caracteres de controle no título`);
      }
    });

    test('3.2 — Cada livro tem descrição/sinopse preenchida (zero nulo/vazio/placeholder)', () => {
      const PLACEHOLDER = /^\s*(n\/?a|none|null|undefined|lorem ipsum|todo|-+|\.+)\s*$/i;
      let vazias = 0;
      let placeholders = 0;
      for (const livro of lerAcervo()) {
        const s = String(livro.sinopse || '').trim();
        if (!s) vazias++;
        if (s && PLACEHOLDER.test(s)) placeholders++;
      }
      assert.equal(vazias, 0, `Livros sem sinopse: ${vazias}`);
      assert.equal(placeholders, 0, `Livros com sinopse placeholder: ${placeholders}`);
    });

    test('3.3 — 100% das capas LOCAIS existem como arquivo com assinatura de imagem válida', () => {
      const MAGIAS = [
        Buffer.from([0x89, 0x50, 0x4e, 0x47]),  // png
        Buffer.from([0xff, 0xd8, 0xff]),        // jpg
        Buffer.from('GIF8'),                    // gif
        Buffer.from('RIFF')                     // webp (RIFF....WEBP)
      ];
      let locais = 0;
      for (const livro of lerAcervo()) {
        const capa = String(livro.capa_url || '');
        if (!capa.startsWith('/') || capa.startsWith('//')) continue;
        locais++;
        const caminho = path.join(__dirname, '..', 'public', capa.split('?')[0]);
        assert.ok(fs.existsSync(caminho), `Livro ${livro.id}: capa local inexistente (${capa})`);
        assert.ok(fs.statSync(caminho).size > 0, `Livro ${livro.id}: capa com 0 bytes (${capa})`);
        const fd = fs.openSync(caminho, 'r');
        const buf = Buffer.alloc(16);
        try { fs.readSync(fd, buf, 0, 16, 0); } finally { fs.closeSync(fd); }
        const texto = buf.toString('latin1');
        const ehSvg = texto.startsWith('<svg') || texto.startsWith('<?xml');
        const ehRaster = MAGIAS.some((m) => buf.subarray(0, m.length).equals(m));
        assert.ok(ehSvg || ehRaster, `Livro ${livro.id}: capa local não é imagem reconhecível (${capa})`);
      }
      assert.ok(locais > 1000, `Esperadas >1000 capas locais semeadas (recebidas ${locais})`);
    });

    test('3.4 — 100% das capas EXTERNAS usam hosts da allowlist do proxy /api/capas', () => {
      let externas = 0;
      for (const livro of lerAcervo()) {
        const capa = String(livro.capa_url || '');
        if (!/^https?:\/\//i.test(capa)) continue;
        externas++;
        const host = new URL(capa).hostname;
        assert.ok(
          hostCapaPermitido(host),
          `Livro ${livro.id}: capa externa com host FORA da allowlist do proxy (${host}) — capa quebraria em produção`
        );
      }
      assert.ok(externas > 500, `Esperadas >500 capas externas semeadas (recebidas ${externas})`);
    });

    test('3.5 — Zero duplicatas de obra (titulo + autor) no acervo', () => {
      const linhas = getDatabase().prepare(`
        SELECT LOWER(TRIM(titulo)) AS t, autor_id, COUNT(*) c FROM livros
        GROUP BY LOWER(TRIM(titulo)), autor_id HAVING c > 1
      `).all();
      assert.deepEqual(linhas, [], `Duplicatas: ${JSON.stringify(linhas.slice(0, 3))}`);
    });

    test('3.6 — Sinopses têm cópia legível (mínimo 15 caracteres reais)', () => {
      for (const livro of lerAcervo()) {
        const s = String(livro.sinopse || '').trim();
        if (!s) continue;
        assert.ok(s.length >= 15, `Livro ${livro.id}: sinopse demasiado curta (${JSON.stringify(s)})`);
      }
    });

    test('3.7 — O frontend dispõe o fluxo Ler/Baixar PDF sobre /api/livros/:id/ler/:linkId', () => {
      const appjs = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'app.js'), 'utf8');
      assert.ok(appjs.includes('/ler/'), 'app.js deve consumir o proxy /ler/ (contador + defesa de URLs)');
    });

    test('3.8 — Paridade Express/Worker: allowlist wixstatic.com e erros de política com codigoHttp', () => {
      const capasExpress = fs.readFileSync(path.join(__dirname, '..', 'src', 'controllers', 'capasController.js'), 'utf8');
      assert.ok(capasExpress.includes('wixstatic.com'),
        'allowlist do proxy de capas no Express deve aceitar wixstatic.com (capa real do livro #997)');

      const workerIndex = fs.readFileSync(path.join(__dirname, '..', 'workers', 'src', 'index.ts'), 'utf8');
      assert.ok(workerIndex.includes('wixstatic.com'),
        'allowlist do proxy de capas no Worker deve aceitar wixstatic.com (capa real do livro #997)');

      const validatorWorker = fs.readFileSync(path.join(__dirname, '..', 'workers', 'src', 'utils', 'urlValidator.ts'), 'utf8');
      assert.ok(validatorWorker.includes('codigoHttp'),
        'urlValidator do Worker deve marcar erros de política com codigoHttp (400)');

      const validatorExpress = fs.readFileSync(path.join(__dirname, '..', 'src', 'utils', 'urlValidator.js'), 'utf8');
      assert.ok(validatorExpress.includes('codigoHttp'),
        'urlValidator do Express deve marcar erros de política com codigoHttp (400)');
    });
  });
});
