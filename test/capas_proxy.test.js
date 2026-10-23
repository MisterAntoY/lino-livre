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
  const testDbPath = path.join(__dirname, 'capas_proxy_test.db');

  const limparBdTeste = () => {
    for (const sufixo of ['', '-wal', '-shm']) {
      const f = testDbPath + sufixo;
      if (fs.existsSync(f)) {
        try { fs.unlinkSync(f); } catch (_) {}
      }
    }
  };

  const fakeUpstream = ({ url, type = 'image/jpeg', bytes = null, status = 200 }) => {
    const corpo = bytes || new Uint8Array([0xff, 0xd8, 0xff, 0xd9]).buffer;
    return {
      ok: status >= 200 && status < 300,
      status,
      url,
      headers: new Headers({
        'content-type': type,
        'content-length': String(corpo.byteLength)
      }),
      arrayBuffer: async () => corpo
    };
  };

  before(async () => {
    limparBdTeste();
    initDatabase(testDbPath);

    originalFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      const alvo = String(url);
      // Simula redirecionamento para a rede interna (deve ser bloqueado após o fetch).
      if (alvo.includes('redirecionar-ssrf')) {
        return fakeUpstream({ url: 'http://127.0.0.1/segredo.jpg' });
      }
      // Simula origem que devolve HTML em vez de imagem.
      if (alvo.includes('nao-e-imagem')) {
        return fakeUpstream({ url: alvo, type: 'text/html' });
      }
      // Simula origem indisponível.
      if (alvo.includes('indisponivel')) {
        return fakeUpstream({ url: alvo, status: 404 });
      }
      return fakeUpstream({ url: alvo });
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
    assert.ok(res.data.length > 0);
  });
});
