#!/usr/bin/env node
/**
 * Probe dinâmico de superfície de ataque — Lino Livre (Express)
 * Uso: node scripts/security_probe_local.js
 * Não altera o repositório. Cria BD temporária e apaga no fim.
 */
process.env.NODE_ENV = 'test';
process.env.ADMIN_API_KEY = 'chave-de-auditoria-forte-1234567890';

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const app = require('../src/app');
const { initDatabase, closeDatabase } = require('../src/database');
const { seed } = require('../src/database/seed');

const DB = path.join(os.tmpdir(), `lino_audit_${Date.now()}.db`);
const results = [];
const add = (cat, name, detail) => results.push({ cat, name, detail });

async function main() {
  const db = initDatabase(DB);
  seed(db);

  const server = http.createServer(app);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;

  const req = async (method, url, { headers = {}, body, redirect = 'manual' } = {}) => {
    const t0 = Date.now();
    let res, text = '';
    try {
      res = await fetch(base + url, {
        method, headers, redirect,
        body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body))
      });
      text = await res.text();
    } catch (e) {
      return { error: e.message, ms: Date.now() - t0 };
    }
    return { status: res.status, headers: Object.fromEntries(res.headers), text, ms: Date.now() - t0 };
  };

  // 1. Cabeçalhos
  const home = await req('GET', '/');
  add('headers', 'GET / headers', {
    'x-powered-by': home.headers['x-powered-by'] || '(ausente)',
    csp: (home.headers['content-security-policy'] || '').slice(0, 80),
    hsts: home.headers['strict-transport-security'] || '(ausente, NODE_ENV=test)',
    xcto: home.headers['x-content-type-options'],
    corp: home.headers['cross-origin-resource-policy'],
    acao: home.headers['access-control-allow-origin'] || '(ausente)'
  });

  // 2. SQLi / FTS
  const injecoes = [
    `/api/livros?busca=${encodeURIComponent('" OR 1=1 --')}`,
    `/api/livros?busca=${encodeURIComponent("' OR '1'='1")}`,
    `/api/livros?busca=${encodeURIComponent('*')}`,
    `/api/livros?busca=${encodeURIComponent('NEAR(')}`,
    `/api/livros?busca=${encodeURIComponent('a") OR ("b')}`,
    `/api/livros?idioma=${encodeURIComponent("pt' OR 1=1--")}`,
    `/api/livros?categoria_id=${encodeURIComponent("1 OR 1=1")}`,
    `/api/livros?autor_id=1%20OR%201%3D1`,
    `/api/cursos?busca=${encodeURIComponent("%' OR 1=1--")}`,
    `/api/autores?nome=${encodeURIComponent("x' UNION SELECT 1--")}`
  ];
  const sqli = [];
  for (const u of injecoes) {
    const r = await req('GET', u);
    const vazou = /SQLITE|syntax error|no such (table|column)|SQL logic/i.test(r.text || '');
    sqli.push({ u: u.slice(0, 58), status: r.status, vazouErroSQL: vazou, ms: r.ms });
  }
  add('sqli', 'injeção em busca/filtros', sqli);

  // 3. Vazamento de erro interno
  const erros = [];
  for (const u of ['/api/livros?pagina=-999999999999', '/api/livros/999999999999999999/ler/1', '/api/cursos/abc', '/api/livros/abc']) {
    const r = await req('GET', u);
    const leak = /SQLITE|no such|syntax|Constraint|TypeError|Cannot read|at .*\.js:\d+/i.test(r.text || '');
    erros.push({ u, status: r.status, body: (r.text || '').slice(0, 160), leak });
  }
  add('errors', 'mensagens internas na resposta', erros);

  // 4. Auth nas rotas de escrita
  const auth = [];
  const writes = [
    ['POST', '/api/livros', { titulo: 'x', licenca: 'cc-by' }],
    ['PUT', '/api/livros/1', { titulo: 'x' }],
    ['DELETE', '/api/livros/1', undefined],
    ['POST', '/api/cursos', { titulo: 'x', area: 'y', plataforma: 'z', url: 'https://example.com' }],
    ['GET', '/api/sugestoes', undefined]
  ];
  for (const [m, u, b] of writes) {
    const sem = await req(m, u, b === undefined ? {} : { body: b });
    const errada = await req(m, u, { headers: { 'x-admin-key': 'chute-errado' }, ...(b === undefined ? {} : { body: b }) });
    const certa = await req(m, u, { headers: { 'x-admin-key': process.env.ADMIN_API_KEY }, ...(b === undefined ? {} : { body: b }) });
    auth.push({ rota: `${m} ${u}`, semChave: sem.status, chaveErrada: errada.status, chaveCerta: certa.status });
  }
  add('auth', 'fail-closed nas mutações', auth);

  // 5. Escrita não autenticada (quota/DoS)
  const ouvir = await req('POST', '/api/podcasts/episodios/1/ouvir');
  const importStatus = await req('GET', '/api/import/1');
  add('authz', 'mutações/leituras públicas indevidas', {
    'POST /api/podcasts/episodios/1/ouvir': ouvir.status,
    'GET /api/import/1': importStatus.status
  });

  // 6. IDOR cross-resource
  const livros = JSON.parse((await req('GET', '/api/livros?limite=2')).text || '{}');
  const a = livros.data?.[0], b = livros.data?.[1];
  let idor = { nota: 'sem dados suficientes' };
  if (a && b && b.links?.length) {
    const r = await req('GET', `/api/livros/${a.id}/ler/${b.links[0].id}`);
    idor = { livroA: a.id, linkDoLivroB: b.links[0].id, status: r.status, esperado: 404 };
  }
  add('idor', 'link de outro livro', idor);

  // 7. SSRF
  const ssrfAlvos = [
    'http://127.0.0.1/',
    'http://localhost./',
    'http://[::ffff:7f00:1]/',
    'http://[::ffff:a9fe:a9fe]/',
    'http://169.254.169.254/latest/meta-data/',
    'http://localtest.me/',
    'http://foo.localhost/',
    'https://fcbarcelona.com/',
    'file:///etc/passwd',
    'javascript:alert(1)'
  ];
  const ssrf = [];
  for (const u of ssrfAlvos) {
    const r = await req('GET', `/api/capas?u=${encodeURIComponent(u)}`);
    ssrf.push({ u, status: r.status });
  }
  add('ssrf', '/api/capas+?u=', ssrf);

  // 8. Open redirect
  const redir = await req('GET', '/api/cursos/1/acessar');
  add('redirect', 'Location de curso', {
    status: redir.status,
    location: redir.headers?.location || '(nenhum)'
  });

  // 9. Path traversal / WAF
  const trav = [];
  for (const p of ['/../package.json', '/%2e%2e/package.json', '/..%2fpackage.json', '/.env', '/.git/config', '/wp-admin/', '/phpmyadmin/']) {
    const r = await req('GET', p);
    trav.push({ p, status: r.status, ehIndex: (r.text || '').includes('<title>Lino Livre') });
  }
  const bot = await req('GET', '/api/livros', { headers: { 'user-agent': 'sqlmap/1.7' } });
  add('traversal-waf', 'probes + scanner UA', { caminhos: trav, sqlmapUA: bot.status });

  // 10. Prototype pollution
  const pp1 = await req('GET', '/api/livros?__proto__[poluido]=1&constructor[prototype][x]=2');
  const pp2 = await req('POST', '/api/sugestoes', {
    body: { titulo: 'PP', url_link: 'https://example.com/x', __proto__: { poluido: 1 }, constructor: { prototype: { y: 2 } } }
  });
  add('prototype-pollution', 'query + body', {
    queryStatus: pp1.status,
    objPoluido: String({}.poluido),
    bodyStatus: pp2.status,
    objY: String({}.y)
  });

  // 11. Payload grande e tipos
  const grande = await req('POST', '/api/sugestoes', {
    headers: { 'content-type': 'application/json' },
    body: '{"titulo":"' + 'A'.repeat(1024 * 1024 + 500) + '","url_link":"https://example.com"}'
  });
  const tipoErrado = await req('POST', '/api/sugestoes', {
    headers: { 'content-type': 'text/plain' },
    body: 'titulo=x'
  });
  add('limits', 'tamanho/content-type', { corpo1MB: grande.status, textPlain: tipoErrado.status });

  // 12. CRLF / header injection
  const crlf = await req('GET', '/api/livros?busca=a%0d%0aX-Injected:%20yes');
  add('crlf', 'quebra de cabeçalho', {
    status: crlf.status,
    injetado: crlf.headers?.['x-injected'] || '(não)'
  });

  // 13. Paginação profunda
  const t0 = Date.now();
  const deep = await req('GET', '/api/livros?pagina=999999999&limite=100');
  add('dos', 'paginação profunda', { status: deep.status, ms: Date.now() - t0 });

  // 14. FTS muito longa
  const longa = await req('GET', '/api/livros?busca=' + encodeURIComponent('a '.repeat(4000)));
  add('dos', 'FTS com 4000 termos', { status: longa.status, ms: longa.ms });

  // 15. CORS
  const cors = await req('OPTIONS', '/api/livros', {
    headers: {
      Origin: 'https://evil.example',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'x-admin-key'
    }
  });
  add('cors', 'preflight hostil', {
    status: cors.status,
    acao: cors.headers?.['access-control-allow-origin'] || '(nenhum)',
    acah: cors.headers?.['access-control-allow-headers'] || '(nenhum)'
  });

  // 16. Cache de respostas administrativas
  const adm = await req('GET', '/api/sugestoes', { headers: { 'x-admin-key': process.env.ADMIN_API_KEY } });
  add('cache', 'Cache-Control em /api/sugestoes (admin)', {
    status: adm.status,
    cacheControl: adm.headers?.['cache-control'] || '(ausente)'
  });

  // 17. Host header / X-Forwarded-Host
  const host = await req('GET', '/', { headers: { 'X-Forwarded-Host': 'evil.example', Host: 'evil.example' } });
  add('host-header', 'reflexo de Host', { status: host.status, contemEvil: (host.text || '').includes('evil.example') });

  // 18. Métodos
  const trace = await req('TRACE', '/api/livros');
  const putSemChave = await req('PUT', '/api/livros/1', { body: { titulo: 'hack' } });
  add('methods', 'métodos HTTP', { trace: trace.status, putSemChave: putSemChave.status });

  console.log(JSON.stringify(results, null, 2));

  server.closeAllConnections?.();
  server.close();
  closeDatabase();
  for (const s of ['', '-wal', '-shm']) { try { fs.unlinkSync(DB + s); } catch (_) {} }
}

main().catch((e) => { console.error('FALHA:', e); process.exit(1); });
