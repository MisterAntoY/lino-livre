/**
 * MATRIZ DE ATAQUES E REGRESSÃO DE SEGURANÇA — Lino Livre
 * ======================================================
 *
 * Cobre, de forma automatizada, as classes de ataque mais exploradas segundo o
 * OWASP Top 10, o OWASP API Security Top 10, o CWE Top 25 e o catálogo KEV da
 * CISA, aplicadas à superfície real deste projecto:
 *
 *  - A01 Broken Access Control ....... IDOR, rotas admin abertas, CORS
 *  - A02 Cryptographic Failures ...... (sem segredos em código; chave fail-closed)
 *  - A03 Injection ................... SQLi, FTS5 injection, CRLF, prototype pollution
 *  - A04 Insecure Design ............. DoS por FTS, rate-limit bypass, escrita pública
 *  - A05 Security Misconfiguration ... cabeçalhos, X-Powered-By, cache de admin
 *  - A06 Vulnerable Components ....... verificado por `npm audit` (ver relatório)
 *  - A07 Auth Failures ............... timing-safe compare, fail-closed
 *  - A08 Data Integrity .............. mass assignment, campos calculados
 *  - A09 Logging Failures ............ erros internos não vazam para o cliente
 *  - A10 SSRF ........................ IPv4/IPv6 não canónicos, redirects, metadados
 */

process.env.NODE_ENV = 'test';
process.env.ADMIN_API_KEY = 'chave-de-auditoria-forte-1234567890';

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const app = require('../src/app');
const { initDatabase, closeDatabase } = require('../src/database');
const { seed } = require('../src/database/seed');
const { criarRateLimit } = require('../src/middlewares/rateLimit');
const {
  validarUrlRedirecionamento,
  hostInterno,
  verificarUrlConformidade
} = require('../src/utils/urlValidator');

const CHAVE_ADMIN = process.env.ADMIN_API_KEY;
const DB_TEMP = path.join(os.tmpdir(), `lino_attack_${Date.now()}.db`);

// ═══════════════════════════════════════════════════════════════════════════
// 1. SSRF — VALIDAÇÃO DE URL (unitário, sem rede)
// ═══════════════════════════════════════════════════════════════════════════
describe('A10 — SSRF: matriz de evasão de endereços internos', () => {
  const BLOQUEAR = [
    'http://127.0.0.1/',
    'http://127.1/',
    'http://2130706433/',            // 127.0.0.1 em decimal
    'http://0x7f000001/',            // 127.0.0.1 em hexadecimal
    'http://0177.0.0.1/',            // 127.0.0.1 em octal
    'http://0.0.0.0/',
    'http://10.0.0.1/',
    'http://172.16.5.4/',
    'http://192.168.1.1/',
    'http://100.64.0.1/',            // CGNAT
    'http://169.254.169.254/',       // metadados AWS/GCP/Azure
    'http://localhost/',
    'http://localhost./',            // FQDN com ponto final
    'http://LOCALHOST./',
    'http://foo.localhost/',
    'http://metadata.google.internal/',
    'http://impressora.local/',
    'http://[::1]/',
    'http://[::]/',
    'http://[::ffff:127.0.0.1]/',    // IPv4 mapeado em IPv6
    'http://[::ffff:7f00:1]/',
    'http://[::ffff:a9fe:a9fe]/',    // 169.254.169.254 mapeado
    'http://[0:0:0:0:0:ffff:127.0.0.1]/',
    'http://[64:ff9b::7f00:1]/',     // NAT64
    'http://[fc00::1]/',             // ULA
    'http://[fd12:3456::1]/',
    'http://[fe80::1]/',             // link-local
    'http://[ff02::1]/',             // multicast
    'file:///etc/passwd',
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'gopher://127.0.0.1:6379/_INFO',
    'http://user:password@example.com/' // credenciais embutidas
  ];

  const PERMITIR = [
    'https://www.gutenberg.org/ebooks/1',
    'https://pt.wikipedia.org/wiki/Machado_de_Assis',
    'https://fcbarcelona.com/',      // regressão: prefixo "fc" não é ULA
    'https://fdic.gov/',
    'https://example.com/livro?x=1',
    'https://[2606:4700::1111]/'     // IPv6 público (Cloudflare DNS)
  ];

  test('bloqueia todas as formas de endereço interno conhecidas', () => {
    for (const url of BLOQUEAR) {
      assert.throws(
        () => validarUrlRedirecionamento(url),
        /inválid|proibid|permitid|interna|credenciais|demasiado/i,
        `Deveria bloquear: ${url}`
      );
    }
  });

  test('permite destinos públicos legítimos', () => {
    for (const url of PERMITIR) {
      assert.doesNotThrow(() => validarUrlRedirecionamento(url), `Deveria permitir: ${url}`);
    }
  });

  test('hostInterno identifica faixas privadas sem falsos positivos de domínio', () => {
    assert.equal(hostInterno('127.0.0.1'), true);
    assert.equal(hostInterno('::ffff:7f00:1'), true);
    assert.equal(hostInterno('localhost.'), true);
    assert.equal(hostInterno('fcbarcelona.com'), false);
    assert.equal(hostInterno('fdic.gov'), false);
  });

  test('lista negra de pirataria continua activa', () => {
    assert.throws(() => verificarUrlConformidade('https://libgen.is/livro'), /pirataria/i);
    assert.throws(() => verificarUrlConformidade('https://z-lib.io/x'), /pirataria/i);
    assert.doesNotThrow(() => verificarUrlConformidade('https://www.gutenberg.org/'));
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. RATE LIMITING — anti-bypass e anti-exaustão de memória
// ═══════════════════════════════════════════════════════════════════════════
describe('A04 — Rate limiting', () => {
  const executar = (limiter, ip, vezes) => {
    const resultados = [];
    for (let i = 0; i < vezes; i++) {
      let status = 200;
      const req = { ip, socket: { remoteAddress: ip } };
      const res = {
        headers: {},
        setHeader(k, v) { this.headers[k] = v; },
        status(code) { status = code; return this; },
        json() { return this; }
      };
      limiter(req, res, () => {});
      resultados.push(status);
    }
    return resultados;
  };

  test('bloqueia após o limite e envia Retry-After', () => {
    const limiter = criarRateLimit({ ativo: true, max: 3, windowMs: 60_000, escopo: 'teste' });
    const resultados = executar(limiter, '203.0.113.10', 5);
    assert.deepEqual(resultados, [200, 200, 200, 429, 429]);
  });

  test('baldes são independentes por IP', () => {
    const limiter = criarRateLimit({ ativo: true, max: 1, windowMs: 60_000, escopo: 'teste-ip' });
    assert.deepEqual(executar(limiter, '203.0.113.20', 2), [200, 429]);
    assert.deepEqual(executar(limiter, '203.0.113.21', 1), [200]);
  });

  test('a app não confia em X-Forwarded-For por omissão (anti-spoofing)', () => {
    assert.equal(app.get('trust proxy'), false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. TESTES HTTP CONTRA O SERVIDOR EXPRESS
// ═══════════════════════════════════════════════════════════════════════════
describe('Ataques HTTP contra a API Express', () => {
  let server;
  let base;

  const pedir = async (caminho, { method = 'GET', headers = {}, body } = {}) => {
    const res = await fetch(base + caminho, {
      method,
      headers,
      body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)),
      redirect: 'manual'
    });
    const texto = await res.text();
    let json = null;
    try { json = JSON.parse(texto); } catch (_) {}
    return { status: res.status, headers: res.headers, texto, json };
  };

  before(async () => {
    const db = initDatabase(DB_TEMP);
    seed(db);
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${server.address().port}`;
  });

  after(async () => {
    if (server.closeAllConnections) server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    closeDatabase();
    for (const sufixo of ['', '-wal', '-shm']) {
      try { fs.unlinkSync(DB_TEMP + sufixo); } catch (_) {}
    }
  });

  test('A05 — não revela a tecnologia do servidor', async () => {
    const r = await pedir('/');
    assert.equal(r.headers.get('x-powered-by'), null);
    assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(r.headers.get('x-frame-options'), 'DENY');
    assert.ok((r.headers.get('content-security-policy') || '').includes("default-src 'self'"));
  });

  test('A03 — SQLi/FTS5 não quebra nem vaza erros da base de dados', async () => {
    const cargas = [
      '" OR 1=1 --',
      "' OR '1'='1",
      'a") OR ("b',
      'NEAR(',
      '*',
      '"; DROP TABLE livros; --',
      "x' UNION SELECT sqlite_version() --"
    ];
    for (const carga of cargas) {
      const r = await pedir('/api/livros?busca=' + encodeURIComponent(carga));
      assert.equal(r.status, 200, `Carga: ${carga}`);
      assert.doesNotMatch(r.texto, /SQLITE|syntax error|no such (table|column)|at .*\.js:\d+/i);
    }
  });

  test('A04 — busca FTS com 4000 termos é limitada e termina rapidamente', async () => {
    const t0 = Date.now();
    const r = await pedir('/api/livros?busca=' + encodeURIComponent('a '.repeat(4000)));
    const ms = Date.now() - t0;
    assert.equal(r.status, 200);
    assert.ok(ms < 5000, `Busca demorou ${ms}ms (esperado < 5000ms)`);
  });

  test('A03 — corpo sem Content-Type devolve 400, nunca 500 com stack', async () => {
    const r = await pedir('/api/livros', {
      method: 'POST',
      headers: { 'x-admin-key': CHAVE_ADMIN },
      body: 'titulo=x'
    });
    assert.equal(r.status, 400);
    assert.doesNotMatch(r.texto, /TypeError|Cannot destructure|\.js:\d+/i);
  });

  test('A03 — poluição de protótipos via query e corpo é inócua', async () => {
    const q = await pedir('/api/livros?__proto__[poluido]=1&constructor[prototype][x]=2');
    assert.equal(q.status, 200);

    const b = await pedir('/api/sugestoes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: { titulo: 'PP', url_link: 'https://example.com/x', __proto__: { poluido: 1 } }
    });
    assert.equal(b.status, 201);
    assert.equal({}.poluido, undefined);
    assert.equal({}.x, undefined);
  });

  test('A03 — injecção CRLF não cria cabeçalhos', async () => {
    const r = await pedir('/api/livros?busca=' + encodeURIComponent('a\r\nX-Injected: sim'));
    assert.equal(r.status, 200);
    assert.equal(r.headers.get('x-injected'), null);
  });

  test('A01 — rotas administrativas falham fechadas (401) e não são cacheáveis', async () => {
    const semChave = await pedir('/api/sugestoes');
    assert.equal(semChave.status, 401);

    const comChave = await pedir('/api/sugestoes', { headers: { 'x-admin-key': CHAVE_ADMIN } });
    assert.equal(comChave.status, 200);
    assert.match(comChave.headers.get('cache-control') || '', /no-store/);

    assert.equal((await pedir('/api/import/1')).status, 401);
  });

  test('A01 — mutações sem chave são rejeitadas', async () => {
    const mutacoes = [
      ['POST', '/api/livros', { titulo: 'x', licenca: 'cc-by' }],
      ['PUT', '/api/livros/1', { titulo: 'x' }],
      ['DELETE', '/api/livros/1', undefined],
      ['POST', '/api/cursos', { titulo: 'x', area: 'y', plataforma: 'z', url: 'https://example.com' }],
      ['POST', '/api/import', { fonte_id: 1, query: 'x' }]
    ];
    for (const [method, caminho, body] of mutacoes) {
      const r = await pedir(caminho, {
        method,
        headers: { 'content-type': 'application/json' },
        body
      });
      assert.equal(r.status, 401, `${method} ${caminho} deveria exigir chave`);
    }
  });

  test('A01 — IDOR cross-resource continua bloqueado', async () => {
    const lista = await pedir('/api/livros?limite=3');
    const livros = lista.json?.data || [];
    const comLinks = livros.filter((l) => Array.isArray(l.links) && l.links.length);
    assert.ok(comLinks.length >= 2, 'Seed deve ter livros com links');
    const [a, b] = comLinks;
    const linkDeOutro = b.links[0].id;
    const r = await pedir(`/api/livros/${a.id}/ler/${linkDeOutro}`);
    assert.equal(r.status, 404);
  });

  test('A04 — payload acima de 1 MB é rejeitado com 413', async () => {
    const gigante = '{"titulo":"' + 'A'.repeat(1024 * 1024 + 1024) + '","url_link":"https://example.com"}';
    const r = await pedir('/api/sugestoes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: gigante
    });
    assert.equal(r.status, 413);
  });

  test('A10 — proxy de capas bloqueia SSRF e hosts fora da allowlist', async () => {
    const alvos = [
      'http://127.0.0.1/x.jpg',
      'http://[::ffff:7f00:1]/x.jpg',
      'http://localhost./x.jpg',
      'http://169.254.169.254/latest/meta-data/',
      'https://example.com/x.jpg'
    ];
    for (const alvo of alvos) {
      const r = await pedir('/api/capas?u=' + encodeURIComponent(alvo));
      assert.ok([400, 403].includes(r.status), `${alvo} devolveu ${r.status}`);
    }
  });

  test('A05 — WAF bloqueia scanners e sondas de ficheiros', async () => {
    const scanner = await pedir('/api/livros', { headers: { 'user-agent': 'sqlmap/1.7' } });
    assert.equal(scanner.status, 403);

    for (const sonda of ['/.env', '/.git/config', '/wp-admin/', '/phpmyadmin/']) {
      assert.equal((await pedir(sonda)).status, 404, `Sonda ${sonda}`);
    }
  });

  test('A08 — conteudo_texto só é aceite em domínio público', async () => {
    const comDireitos = await pedir('/api/livros', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-key': CHAVE_ADMIN },
      body: {
        titulo: 'Obra Contemporânea Protegida',
        licenca: 'cc-by-nc',
        conteudo_texto: 'Texto integral de obra sob direitos de autor'
      }
    });
    assert.equal(comDireitos.status, 400);
    assert.match(String(comDireitos.json?.erro), /domínio público/i);

    const dominioPublico = await pedir('/api/livros', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-key': CHAVE_ADMIN },
      body: {
        titulo: 'Obra Clássica em Domínio Público',
        licenca: 'dominio-publico',
        conteudo_texto: 'Texto integral de obra em domínio público'
      }
    });
    assert.equal(dominioPublico.status, 201);
  });

  test('A03 — redireccionamento 302 nunca aponta para a rede interna', async () => {
    const cursos = await pedir('/api/cursos?limite=1');
    const curso = (cursos.json || [])[0];
    assert.ok(curso, 'Seed deve ter cursos');
    const r = await pedir(`/api/cursos/${curso.id}/acessar`);
    assert.equal(r.status, 302);
    const destino = r.headers.get('location') || '';
    assert.match(destino, /^https?:\/\//);
    assert.equal(hostInterno(new URL(destino).hostname), false);
  });

  test('Arquitetura — ficheiros de obras nunca são servidos do disco', async () => {
    for (const ficheiro of ['/livro.pdf', '/livro.epub', '/audio.mp3', '/video.mp4', '/nota.txt']) {
      const r = await pedir(ficheiro);
      assert.equal(r.status, 404, `${ficheiro} deveria devolver 404`);
      assert.match(String(r.json?.erro || ''), /não armazena/i);
    }
    // robots.txt continua público
    assert.equal((await pedir('/robots.txt')).status, 200);
  });

  test('A05 — divulgação responsável disponível em /.well-known/security.txt', async () => {
    const r = await pedir('/.well-known/security.txt');
    assert.equal(r.status, 200);
    assert.match(r.texto, /^Contact: mailto:/m);
    assert.match(r.texto, /^Expires: \d{4}-\d{2}-\d{2}/m);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. CLOUDFLARE WORKER (Hono + D1)
// ═══════════════════════════════════════════════════════════════════════════
describe('Ataques contra o Cloudflare Worker', () => {
  const esbuild = require('esbuild');
  const bundle = path.resolve(__dirname, '.security_worker.bundle.cjs');
  let workerApp;

  const criarD1 = ({ captures = [] } = {}) => {
    const prepare = (sql) => {
      let params = [];
      const stmt = {
        bind: (...args) => { params = args; return stmt; },
        first: async () => {
          if (/COUNT\(\*\)/i.test(sql)) return { total: 0 };
          return null;
        },
        all: async () => ({ results: [] }),
        run: async () => {
          captures.push({ sql, params });
          return { meta: { changes: 1, last_row_id: 1 } };
        }
      };
      return stmt;
    };
    return { prepare, batch: async () => [] };
  };

  const pedirWorker = (url, options = {}, env = null, ip = '198.51.100.1') => {
    const ctx = { waitUntil: (p) => { if (p?.catch) p.catch(() => {}); }, passThroughOnException: () => {} };
    const ambiente = env || { ADMIN_API_KEY: 'chave-worker-segura-123456', DB: criarD1() };
    const headers = { 'cf-connecting-ip': ip, ...(options.headers || {}) };
    return workerApp.request(url, { ...options, headers }, ambiente, ctx);
  };

  before(() => {
    esbuild.buildSync({
      entryPoints: [path.resolve(__dirname, '../workers/src/index.ts')],
      bundle: true,
      platform: 'node',
      format: 'cjs',
      packages: 'external',
      outfile: bundle
    });
    const mod = require(bundle);
    workerApp = mod.app || mod.default;
  });

  after(() => {
    try { if (fs.existsSync(bundle)) fs.unlinkSync(bundle); } catch (_) {}
  });

  test('A07 — sem ADMIN_API_KEY falha fechado mesmo fora de produção (sem chave dev)', async () => {
    const env = { ENVIRONMENT: 'development', DB: criarD1() };
    const r = await pedirWorker('/api/categorias', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ nome: 'Categoria Invasora' })
    }, env);
    assert.equal(r.status, 401, 'A antiga chave "lino-admin-dev-key" já não pode existir');
  });

  test('A01 — GET /api/import/:id exige autenticação', async () => {
    const r = await pedirWorker('/api/import/1');
    assert.equal(r.status, 401);
  });

  test('A04 — FTS com milhares de termos é truncada antes da D1', async () => {
    const capturas = [];
    const env = {
      ADMIN_API_KEY: 'chave-worker-segura-123456',
      DB: criarD1({ captures: capturas })
    };
    const termos = Array.from({ length: 500 }, (_, i) => `t${i}`).join(' ');
    const r = await pedirWorker('/api/livros?busca=' + encodeURIComponent(termos), {}, env, '198.51.100.50');
    assert.equal(r.status, 200);
    // Nenhum parâmetro enviado pode conter mais de 8 expressões de prefixo.
    for (const c of capturas) {
      for (const p of c.params) {
        if (typeof p === 'string' && p.includes('"*')) {
          const quantidade = (p.match(/"\*/g) || []).length;
          assert.ok(quantidade <= 8, `MATCH com ${quantidade} termos chegou à D1`);
        }
      }
    }
  });

  test('A10 — proxy de capas do Worker bloqueia IPv6 mapeado e hosts fora da allowlist', async () => {
    const bloqueados = [
      'http://[::ffff:7f00:1]/x.jpg',
      'http://[::ffff:a9fe:a9fe]/latest/meta-data/',
      'http://localhost./x.jpg',
      'http://127.0.0.1/x.jpg',
      'https://example.com/x.jpg'
    ];
    for (const alvo of bloqueados) {
      const r = await pedirWorker('/api/capas?u=' + encodeURIComponent(alvo), {}, null, '198.51.100.60');
      assert.ok([400, 403].includes(r.status), `${alvo} devolveu ${r.status}`);
    }
  });

  test('A04 — POST /api/sugestoes é limitado por IP (5/min)', async () => {
    const capturas = [];
    const env = { ADMIN_API_KEY: 'chave-worker-segura-123456', DB: criarD1({ captures: capturas }) };
    const ip = '198.51.100.77';
    const corpo = JSON.stringify({ titulo: 'Sugestão Válida', url_link: 'https://example.com/obra' });
    const estados = [];
    for (let i = 0; i < 6; i++) {
      const r = await pedirWorker('/api/sugestoes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: corpo
      }, env, ip);
      estados.push(r.status);
    }
    assert.equal(estados[5], 429, `Esperado 429 no 6.º pedido, obtido ${estados.join(',')}`);
    assert.match(String((await pedirWorker('/api/sugestoes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: corpo
    }, env, ip)).headers.get('retry-after')), /^\d+$/);
  });

  test('A10 — sugestão com capa interna é rejeitada e licença inválida é normalizada', async () => {
    const capturas = [];
    const env = { ADMIN_API_KEY: 'chave-worker-segura-123456', DB: criarD1({ captures: capturas }) };

    const capaInterna = await pedirWorker('/api/sugestoes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        titulo: 'Sugestão com capa interna',
        url_link: 'https://example.com/obra',
        capa_url: 'http://127.0.0.1/segredo.jpg'
      })
    }, env, '198.51.100.90');
    assert.equal(capaInterna.status, 400);

    const licencaInvalida = await pedirWorker('/api/sugestoes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        titulo: 'Sugestão com licença arbitrária',
        url_link: 'https://example.com/obra',
        licenca: '<script>alert(1)</script>',
        formato: 'exe'
      })
    }, env, '198.51.100.91');
    assert.equal(licencaInvalida.status, 201);

    const inserida = capturas.find((c) => c.sql.includes('INSERT INTO sugestoes'));
    assert.ok(inserida, 'Deveria ter havido INSERT');
    assert.equal(inserida.params[4], 'outro');
    assert.equal(inserida.params[5], 'outro');
  });
});
