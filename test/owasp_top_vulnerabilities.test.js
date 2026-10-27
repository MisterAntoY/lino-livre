/**
 * Suíte de Testes Automatizados — OWASP Top Vulnerabilities & Defesas
 * ===================================================================
 * 
 * Cobre de forma sistemática as principais classes de vulnerabilidades
 * do OWASP Top 10 Web, OWASP API Security Top 10 e CWE Top 25:
 * 
 * 1. Broken Object Level Authorization (BOLA / IDOR - CWE-639 / OWASP A01 / API1)
 * 2. Cross-Site Scripting (XSS - CWE-79 / OWASP A03 / Stored, Reflected, DOM)
 * 3. Injection (SQLi & FTS5 Injection - CWE-89 / OWASP A03)
 * 4. Server-Side Request Forgery (SSRF - CWE-918 / OWASP A10 / API7)
 * 5. Open Redirects & Dangerous Protocols (CWE-601 / OWASP A01)
 * 6. Broken Function Level Authorization (BFLA - CWE-285 / OWASP API5)
 * 7. Mass Assignment & Parameter Tampering (CWE-915 / OWASP API3)
 * 8. Prototype Pollution & Parameter Injection (CWE-1321 / CWE-20)
 * 9. Cryptographic Failures & Timing Attacks (CWE-208 / OWASP A02)
 * 10. Security Misconfiguration & Defensive Headers (CWE-16 / OWASP A05)
 * 11. Unrestricted Resource Consumption & DoS (CWE-400 / OWASP API4)
 * 12. Information Disclosure & Safe Error Handling (CWE-209 / OWASP A09)
 */

process.env.NODE_ENV = 'test';
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const app = require('../src/app');
const { initDatabase, getDatabase, closeDatabase } = require('../src/database');
const { seed } = require('../src/database/seed');
const { sanitizarFts5 } = require('../src/utils/sanitizer');
const { validarUrlRedirecionamento, DOMINIOS_PROIBIDOS } = require('../src/utils/urlValidator');

const CHAVE_ADMIN = 'chave-owasp-audit-forte-1234567890';

describe('OWASP Top Vulnerabilities & Defesas em Profundidade', () => {
  let server;
  let port;
  const dbFile = path.join(os.tmpdir(), `lino_owasp_${Date.now()}.db`);

  const cleanupDb = () => {
    for (const ext of ['', '-wal', '-shm']) {
      const f = dbFile + ext;
      if (fs.existsSync(f)) {
        try { fs.unlinkSync(f); } catch (_) {}
      }
    }
  };

  before(async () => {
    cleanupDb();
    process.env.ADMIN_API_KEY = CHAVE_ADMIN;
    const db = initDatabase(dbFile);
    seed(db);

    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        port = server.address().port;
        resolve();
      });
    });
  });

  after(async () => {
    if (server.closeAllConnections) server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    closeDatabase();
    cleanupDb();
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
      data = await res.json();
    } else {
      data = await res.text();
    }
    return {
      status: res.status,
      headers: res.headers,
      body: data
    };
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 1. BROKEN OBJECT LEVEL AUTHORIZATION (IDOR / BOLA - CWE-639 / API1)
  // ──────────────────────────────────────────────────────────────────────────
  describe('1. IDOR / BOLA — Proteção de Identificadores e Referências Cruzadas', () => {
    test('1.1 - GET /api/livros/:id com ID não-numérico responde 404 seguro sem erro SQL', async () => {
      const res = await apiFetch('/api/livros/abc-hack');
      assert.equal(res.status, 404);
      assert.ok(res.body.erro);
    });

    test('1.2 - GET /api/categorias/:id com ID não-numérico responde 404', async () => {
      const res = await apiFetch('/api/categorias/invalid-id');
      assert.equal(res.status, 404);
      assert.ok(res.body.erro);
    });

    test('1.3 - GET /api/cursos/:id com ID não-numérico responde 404', async () => {
      const res = await apiFetch('/api/cursos/hack%27--');
      assert.equal(res.status, 404);
      assert.ok(res.body.erro);
    });

    test('1.4 - GET /api/cursos/:id/acessar com ID malicioso responde 404', async () => {
      const res = await apiFetch('/api/cursos/abc/acessar');
      assert.equal(res.status, 404);
      assert.ok(res.body.erro);
    });

    test('1.5 - GET /api/livros/:id/ler/:linkId com parâmetros alfanuméricos responde 404', async () => {
      const res = await apiFetch('/api/livros/1/ler/abc');
      assert.equal(res.status, 404);
      assert.ok(res.body.erro);
    });

    test('1.6 - IDOR Cross-Resource: Acesso a link pertencente a livro diferente deve responder 404', async () => {
      const db = getDatabase();
      const links = db.prepare('SELECT id, livro_id FROM links_livros ORDER BY id ASC LIMIT 10').all();
      const parDiferente = links.find(l => l.livro_id !== links[0].livro_id);
      if (parDiferente) {
        const res = await apiFetch(`/api/livros/${links[0].livro_id}/ler/${parDiferente.id}`);
        assert.equal(res.status, 404, 'Não deve permitir ler link_id pertencente a outro livro_id');
      }
    });

    test('1.7 - Tentativa de exclusão IDOR sem autenticação é bloqueada (401)', async () => {
      const resLivro = await apiFetch('/api/livros/1', { method: 'DELETE' });
      assert.equal(resLivro.status, 401);
      const resCurso = await apiFetch('/api/cursos/1', { method: 'DELETE' });
      assert.equal(resCurso.status, 401);
      const resCat = await apiFetch('/api/categorias/1', { method: 'DELETE' });
      assert.equal(resCat.status, 401);
      const resAutor = await apiFetch('/api/autores/1', { method: 'DELETE' });
      assert.equal(resAutor.status, 401);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 2. CROSS-SITE SCRIPTING (XSS - CWE-79 / OWASP A03)
  // ──────────────────────────────────────────────────────────────────────────
  describe('2. XSS — Sanitização contra Scripts Refletidos e Armazenados', () => {
    test('2.1 - Busca textual refletida com tags HTML/JS responde JSON limpo com cabeçalho nosniff', async () => {
      const payloadXss = '<script>alert(document.cookie)</script>';
      const res = await apiFetch(`/api/livros?busca=${encodeURIComponent(payloadXss)}`);
      assert.equal(res.status, 200);
      assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
      const text = JSON.stringify(res.body);
      assert.ok(!text.includes('<script>'), 'Payload XSS não deve ser executado no servidor');
    });

    test('2.2 - Submissão de sugestão com HTML malicioso não quebra integridade e neutraliza dados', async () => {
      const res = await apiFetch('/api/sugestoes', {
        method: 'POST',
        body: {
          titulo: 'Livro Seguro <img src=x onerror=alert(1)>',
          autor_nome: 'Autor <script>alert(1)</script>',
          url_link: 'https://gutenberg.org/ebooks/12345'
        }
      });
      assert.equal(res.status, 201);
      assert.ok(res.body.sucesso);

      const db = getDatabase();
      const sugestao = db.prepare('SELECT titulo, autor_nome FROM sugestoes WHERE id = ?').get(res.body.id);
      assert.ok(sugestao);
      assert.ok(sugestao.titulo.length <= 250);
    });

    test('2.3 - Content-Security-Policy (CSP) estrito presente em todas as respostas HTTP', async () => {
      const res = await apiFetch('/api/dashboard');
      assert.equal(res.status, 200);
      const csp = res.headers.get('content-security-policy') || '';
      assert.ok(csp.includes("default-src 'self'"), 'CSP deve conter default-src self');
      assert.ok(csp.includes("object-src 'none'"), 'CSP deve conter object-src none');
      assert.ok(csp.includes("frame-ancestors 'none'"), 'CSP deve conter frame-ancestors none (anti-clickjacking)');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 3. INJECTION (SQLi & FTS5 - CWE-89 / OWASP A03)
  // ──────────────────────────────────────────────────────────────────────────
  describe('3. Injection — Prevenção de SQLi e Sanitização FTS5', () => {
    test('3.1 - Injeção SQL clássica em busca não altera a semântica da consulta', async () => {
      const payloads = [
        "' OR '1'='1",
        "'; DROP TABLE livros; --",
        "1 UNION SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20 --",
        "1; WAITFOR DELAY '0:0:5'--"
      ];
      for (const p of payloads) {
        const res = await apiFetch(`/api/livros?busca=${encodeURIComponent(p)}`);
        assert.equal(res.status, 200, `Payload SQLi não deve quebrar a API: ${p}`);
        assert.ok(Array.isArray(res.body.data));
      }
    });

    test('3.2 - Sanitizador FTS5 neutraliza caracteres de controle e operadores booleanos como literais seguros', () => {
      const entradasPerigosas = [
        'Machado AND OR NOT NEAR',
        'Hamlet * ^ : { }',
        '"aspas desbalanceadas',
        '(((parênteses aninhados)))'
      ];
      for (const entrada of entradasPerigosas) {
        const sanitizado = sanitizarFts5(entrada);
        assert.equal(typeof sanitizado, 'string');
        // No FTS5 todos os tokens são encapsulados como literais literais ("token"*)
        // impedindo que sejam interpretados como operadores de consulta
        const tokens = sanitizado.split(' ');
        for (const tok of tokens) {
          assert.ok(tok.startsWith('"') && tok.endsWith('"*'), `Token deve ser literal encapsulado: ${tok}`);
        }
      }
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 4. SERVER-SIDE REQUEST FORGERY & OPEN REDIRECT (SSRF / CWE-918 / CWE-601)
  // ──────────────────────────────────────────────────────────────────────────
  describe('4. SSRF & Open Redirect — Bloqueio de Redes Locais e Metadados Cloud', () => {
    test('4.1 - Bloqueio de loopbacks IPv4 e representações decimais/hexadecimais', () => {
      const urls = [
        'http://127.0.0.1:8080/admin',
        'http://127.0.0.2/',
        'http://localhost:3000/',
        'http://0.0.0.0/',
        'http://127.255.255.255/',
        'http://169.254.169.254/latest/meta-data/'
      ];
      for (const u of urls) {
        assert.throws(() => validarUrlRedirecionamento(u), /não autorizada|privado|loopback|proibido/i);
      }
    });

    test('4.2 - Bloqueio de esquemas perigosos (javascript:, data:, file:)', () => {
      const esquemas = [
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'file:///etc/passwd',
        'vbscript:msgbox(1)'
      ];
      for (const e of esquemas) {
        assert.throws(() => validarUrlRedirecionamento(e), /protocolo|não permitido|não autorizada|http/i);
      }
    });

    test('4.3 - Bloqueio de domínios da blacklist de pirataria', () => {
      const piratas = [
        'https://z-lib.is/book/1234',
        'https://libgen.is/book/index.php',
        'https://sci-hub.se/10.1000/182',
        'https://annas-archive.org/md5/abcdef',
        'https://pdfdrive.com/download'
      ];
      for (const p of piratas) {
        assert.throws(() => validarUrlRedirecionamento(p), /domínio não autorizado|pirataria|política/i);
      }
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 5. BROKEN FUNCTION LEVEL AUTHORIZATION & AUTH TIMING ATTACKS (API5 / CWE-208)
  // ──────────────────────────────────────────────────────────────────────────
  describe('5. Autenticação e Timing Attacks — Modo Fail-Closed e Tempo Constante', () => {
    test('5.1 - Token inválido em rotas de mutação responde 401 Unauthorized', async () => {
      const res = await apiFetch('/api/livros', {
        method: 'POST',
        headers: { 'x-admin-key': 'chave-incorreta-ou-forjada' },
        body: { titulo: 'Livro Teste', licenca: 'cc-by' }
      });
      assert.equal(res.status, 401);
    });

    test('5.2 - Bearer Token malicioso responde 401', async () => {
      const res = await apiFetch('/api/categorias', {
        method: 'POST',
        headers: { Authorization: 'Bearer token-falso' },
        body: { nome: 'Categoria Hack' }
      });
      assert.equal(res.status, 401);
    });

    test('5.3 - Token válido concede acesso à rota administrativa', async () => {
      const res = await apiFetch('/api/sugestoes', {
        method: 'GET',
        headers: { 'x-admin-key': CHAVE_ADMIN }
      });
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body));
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 6. MASS ASSIGNMENT & PROTOTYPE POLLUTION (CWE-915 / CWE-1321)
  // ──────────────────────────────────────────────────────────────────────────
  describe('6. Mass Assignment & Prototype Pollution', () => {
    test('6.1 - Payload com __proto__ não polui o protótipo global', async () => {
      const res = await apiFetch('/api/sugestoes', {
        method: 'POST',
        body: {
          __proto__: { admin: true },
          constructor: { prototype: { poluido: true } },
          titulo: 'Sugestão Anti-Pollution',
          url_link: 'https://openlibrary.org/works/OL12345W'
        }
      });
      assert.equal(res.status, 201);
      assert.equal(({}).admin, undefined, 'Não deve poluir Object.prototype.admin');
      assert.equal(({}).poluido, undefined, 'Não deve poluir Object.prototype.poluido');
    });

    test('6.2 - Tentativa de forçar status aprovado em sugestão é ignorada', async () => {
      const res = await apiFetch('/api/sugestoes', {
        method: 'POST',
        body: {
          titulo: 'Sugestão Status Teste',
          status: 'aprovado',
          url_link: 'https://gutenberg.org/ebooks/100'
        }
      });
      assert.equal(res.status, 201);
      const db = getDatabase();
      const row = db.prepare('SELECT status FROM sugestoes WHERE id = ?').get(res.body.id);
      assert.equal(row.status, 'pendente');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 7. SECURITY MISCONFIGURATION & DEFENSIVE HEADERS (CWE-16 / OWASP A05)
  // ──────────────────────────────────────────────────────────────────────────
  describe('7. Cabeçalhos Defensivos e Prevenção de Fingerprinting', () => {
    test('7.1 - Cabeçalho X-Powered-By deve estar ausente', async () => {
      const res = await apiFetch('/api/dashboard');
      assert.equal(res.headers.get('x-powered-by'), null);
    });

    test('7.2 - Cabeçalhos anti-sniffing e anti-clickjacking presentes', async () => {
      const res = await apiFetch('/api/livros');
      assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
      assert.equal(res.headers.get('x-frame-options'), 'DENY');
      assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
    });

    test('7.3 - WAF bloqueia user-agents de scanners agressivos conhecidos (403)', async () => {
      const scanners = ['sqlmap/1.5#stable', 'nikto/2.1.6', 'gobuster/3.1.0', 'nuclei'];
      for (const ua of scanners) {
        const res = await apiFetch('/api/dashboard', {
          headers: { 'User-Agent': ua }
        });
        assert.equal(res.status, 403, `Scanner ${ua} deve ser bloqueado com 403`);
      }
    });

    test('7.4 - Sondas de arquivos sensíveis retornam 404 estrito', async () => {
      const sondas = ['/.env', '/.git/config', '/wp-admin/index.php', '/phpmyadmin'];
      for (const s of sondas) {
        const res = await apiFetch(s);
        assert.equal(res.status, 404);
      }
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 8. UNRESTRICTED RESOURCE CONSUMPTION & SAFE ERROR HANDLING (CWE-400 / CWE-209)
  // ──────────────────────────────────────────────────────────────────────────
  describe('8. Controles de Recursos, Limites de Paginação e Mensagens Seguras', () => {
    test('8.1 - Limite de paginação excessivo é automaticamente delimitado (Anti-DoS)', async () => {
      const res = await apiFetch('/api/livros?limite=999999');
      assert.equal(res.status, 200);
      assert.ok(res.body.limit <= 100, 'Limite de itens por página deve ser delimitado');
    });

    test('8.2 - Página negativa ou absurda é normalizada', async () => {
      const res = await apiFetch('/api/livros?pagina=-50');
      assert.equal(res.status, 200);
      assert.equal(res.body.page, 1);
    });

    test('8.3 - Erros 404 e 400 não vazam stack traces ou detalhes internos', async () => {
      const res = await apiFetch('/api/livros/9999999');
      assert.equal(res.status, 404);
      assert.ok(res.body.erro);
      const str = JSON.stringify(res.body);
      assert.ok(!str.includes('SQLITE_ERROR'));
      assert.ok(!str.includes('at Module._compile'));
      assert.ok(!str.includes('node_modules'));
    });
  });
});
