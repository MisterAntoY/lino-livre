process.env.NODE_ENV = 'test';
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');

const app = require('../src/app');
const { initDatabase, closeDatabase } = require('../src/database');

describe('Proxy de Capas Externas (/api/capas)', () => {
  let server;
  let port;
  let originalFetch;
  let originalLookup;
  const dnsPromises = require('node:dns/promises');
  const testDbPath = path.join(__dirname, 'capas_proxy_test.db');

  const limparBdTeste = () => {
    for (const sufixo of ['', '-wal', '-shm']) {
      const f = testDbPath + sufixo;
      if (fs.existsSync(f)) {
        try { fs.unlinkSync(f); } catch (_) {}
      }
    }
  };

  const fakeUpstream = ({ type = 'image/jpeg', bytes = null, status = 200, location = null }) => {
    const corpo = bytes || new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
    const headers = new Headers({
      'content-type': type,
      'content-length': String(corpo.byteLength)
    });
    if (location) headers.set('location', location);
    return new Response(status === 204 ? null : corpo, { status, headers });
  };

  before(async () => {
    limparBdTeste();
    initDatabase(testDbPath);

    // Sem rede nos testes: a resolução DNS devolve sempre um IP público.
    originalLookup = dnsPromises.lookup;
    dnsPromises.lookup = async () => [{ address: '151.101.0.133', family: 4 }];

    originalFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      const alvo = String(url);
      // Simula redirecionamento 302 da origem permitida para a rede interna.
      if (alvo.includes('redirecionar-ssrf')) {
        return fakeUpstream({ status: 302, location: 'http://127.0.0.1/segredo.jpg' });
      }
      // Simula redirecionamento para um host fora da allowlist.
      if (alvo.includes('redirecionar-externo')) {
        return fakeUpstream({ status: 302, location: 'https://evil.example/capa.jpg' });
      }
      // Simula SVG (documento executável, nunca deve ser servido da nossa origem).
      if (alvo.includes('vetor.svg')) {
        return fakeUpstream({ type: 'image/svg+xml', bytes: new TextEncoder().encode('<svg onload="alert(1)"/>') });
      }
      // Simula origem que devolve HTML em vez de imagem.
      if (alvo.includes('nao-e-imagem')) {
        return fakeUpstream({ type: 'text/html', bytes: new TextEncoder().encode('<html></html>') });
      }
      // Simula origem indisponível.
      if (alvo.includes('indisponivel')) {
        return fakeUpstream({ status: 404 });
      }
      return fakeUpstream({});
    };

    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, () => {
        port = server.address().port;
        resolve();
      });
    });
  });

  after(async () => {
    if (originalFetch) globalThis.fetch = originalFetch;
    if (originalLookup) dnsPromises.lookup = originalLookup;
    if (server.closeAllConnections) server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    closeDatabase();
    limparBdTeste();
  });

  const pedir = async (urlPath) => {
    const res = await originalFetch(`http://127.0.0.1:${port}${urlPath}`, {
      redirect: 'manual',
      headers: { Connection: 'close' }
    });
    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await res.json().catch(() => null)
      : Buffer.from(await res.arrayBuffer());
    return { status: res.status, headers: res.headers, data };
  };

  test('1. Rejeita pedido sem parâmetro u (400)', async () => {
    const res = await pedir('/api/capas');
    assert.equal(res.status, 400);
    assert.match(String(res.data.erro), /obrigatório/i);
  });

  test('2. Bloqueia origem fora da allowlist (403)', async () => {
    const res = await pedir('/api/capas?u=' + encodeURIComponent('https://example.com/capa.jpg'));
    assert.equal(res.status, 403);
    assert.match(String(res.data.erro), /não permitida/i);
  });

  test('3. Bloqueia SSRF para loopback antes de qualquer fetch (400)', async () => {
    const res = await pedir('/api/capas?u=' + encodeURIComponent('http://127.0.0.1/segredo.jpg'));
    assert.equal(res.status, 400);
    assert.match(String(res.data.erro), /inválida/i);
  });

  test('4. Bloqueia SSRF por redirecionamento da origem (403)', async () => {
    const res = await pedir('/api/capas?u=' + encodeURIComponent('https://www.gutenberg.org/redirecionar-ssrf.jpg'));
    assert.equal(res.status, 403);
    assert.match(String(res.data.erro), /Redirecionamento/i);
  });

  test('5. Recusa conteúdo que não é imagem (415)', async () => {
    const res = await pedir('/api/capas?u=' + encodeURIComponent('https://www.gutenberg.org/nao-e-imagem.jpg'));
    assert.equal(res.status, 415);
  });

  test('6. Devolve 502 quando a origem está indisponível', async () => {
    const res = await pedir('/api/capas?u=' + encodeURIComponent('https://www.gutenberg.org/indisponivel.jpg'));
    assert.equal(res.status, 502);
  });

  test('7. Serve a capa com Cache-Control eficiente (1 ano) e Content-Type correto', async () => {
    const res = await pedir('/api/capas?u=' + encodeURIComponent('https://www.gutenberg.org/cache/epub/10/pg10.cover.medium.jpg'));
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'image/jpeg');
    const cache = res.headers.get('cache-control') || '';
    assert.match(cache, /max-age=31536000/);
    assert.match(cache, /s-maxage=31536000/);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.match(res.headers.get('content-security-policy') || '', /default-src 'none'/);
    assert.ok(res.data.length > 0);
  });

  test('8. Bloqueia IPv6 mapeado em IPv4 (loopback) e FQDN com ponto final', async () => {
    const alvos = ['http://[::ffff:7f00:1]/segredo.jpg', 'https://localhost./segredo.jpg'];
    for (const alvo of alvos) {
      const res = await pedir('/api/capas?u=' + encodeURIComponent(alvo));
      assert.equal(res.status, 400, `Deve rejeitar ${alvo}`);
    }
  });

  test('9. Bloqueia metadados de nuvem em IPv6 mapeado (169.254.169.254)', async () => {
    const res = await pedir('/api/capas?u=' + encodeURIComponent('http://[::ffff:a9fe:a9fe]/latest/meta-data/'));
    assert.equal(res.status, 400);
  });

  test('10. Recusa SVG (documento executável servido da nossa origem)', async () => {
    const res = await pedir('/api/capas?u=' + encodeURIComponent('https://www.gutenberg.org/vetor.svg'));
    assert.equal(res.status, 415);
  });

  test('11. Bloqueia redirecionamento para host fora da allowlist', async () => {
    const res = await pedir('/api/capas?u=' + encodeURIComponent('https://www.gutenberg.org/redirecionar-externo.jpg'));
    assert.equal(res.status, 403);
  });
});
