process.env.NODE_ENV = 'test';
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const esbuild = require('esbuild');

const bundlePath = path.resolve(__dirname, '.worker.capas.test.bundle.cjs');

describe('Cloudflare Worker — Proxy de Capas (/api/capas)', () => {
  let app;
  let originalFetch;
  let fetchCount = 0;
  let cacheHit = null;
  const cachePuts = [];

  const fakeUpstream = (url, { type = 'image/jpeg', status = 200, body = 'fake-image', location = null } = {}) => {
    const headers = new Headers({
      'content-type': type,
      'content-length': String(body.length)
    });
    if (location) headers.set('location', location);
    return {
      ok: status >= 200 && status < 300,
      status,
      url,
      headers,
      body
    };
  };

  before(() => {
    esbuild.buildSync({
      entryPoints: [path.resolve(__dirname, '../workers/src/index.ts')],
      bundle: true,
      platform: 'node',
      format: 'cjs',
      packages: 'external',
      outfile: bundlePath
    });
    const workerModule = require(bundlePath);
    app = workerModule.app || workerModule.default;

    originalFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      fetchCount += 1;
      const alvo = String(url);
      if (alvo.includes('redirecionar-ssrf')) {
        // A origem responde 302 para a rede interna. Com `redirect: 'manual'`
        // o Worker valida o Location ANTES de o seguir (não há segundo fetch).
        return fakeUpstream(alvo, { status: 302, location: 'http://127.0.0.1/segredo.jpg', body: '' });
      }
      if (alvo.includes('nao-e-imagem')) {
        return fakeUpstream(alvo, { type: 'text/html' });
      }
      if (alvo.includes('indisponivel')) {
        return fakeUpstream(alvo, { status: 404 });
      }
      return fakeUpstream(alvo);
    };

    // Stub do Cache API de borda da Cloudflare
    globalThis.caches = {
      default: {
        match: async () => cacheHit,
        put: async (request, response) => {
          cachePuts.push({ url: request.url, status: response.status });
        }
      }
    };
  });

  after(() => {
    if (originalFetch) globalThis.fetch = originalFetch;
    delete globalThis.caches;
    try {
      if (fs.existsSync(bundlePath)) fs.unlinkSync(bundlePath);
    } catch (_) {}
  });

  const ctx = {
    waitUntil: (p) => {
      if (p && typeof p.then === 'function') p.catch(() => {});
    },
    passThroughOnException: () => {}
  };

  const pedir = (urlPath) => app.request(urlPath, { method: 'GET' }, {}, ctx);

  test('1. Rejeita pedido sem parâmetro u (400)', async () => {
    const res = await pedir('/api/capas');
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.match(String(data.erro), /obrigatório/i);
  });

  test('2. Bloqueia origem fora da allowlist (403)', async () => {
    const res = await pedir('/api/capas?u=' + encodeURIComponent('https://example.com/capa.jpg'));
    assert.equal(res.status, 403);
  });

  test('3. Bloqueia SSRF para loopback antes do fetch (400)', async () => {
    const antes = fetchCount;
    const res = await pedir('/api/capas?u=' + encodeURIComponent('http://127.0.0.1/segredo.jpg'));
    assert.equal(res.status, 400);
    assert.equal(fetchCount, antes, 'Não deve chamar fetch para rede interna');
  });

  test('4. Bloqueia SSRF por redirecionamento da origem (403)', async () => {
    const antes = fetchCount;
    const res = await pedir('/api/capas?u=' + encodeURIComponent('https://www.gutenberg.org/redirecionar-ssrf.jpg'));
    assert.equal(res.status, 403);
    assert.equal(fetchCount, antes + 1, 'Não deve haver segundo fetch para o destino do redirect');
  });

  test('5. Recusa conteúdo que não é imagem (415)', async () => {
    const res = await pedir('/api/capas?u=' + encodeURIComponent('https://www.gutenberg.org/nao-e-imagem.jpg'));
    assert.equal(res.status, 415);
  });

  test('6. Devolve 502 quando a origem está indisponível', async () => {
    const res = await pedir('/api/capas?u=' + encodeURIComponent('https://www.gutenberg.org/indisponivel.jpg'));
    assert.equal(res.status, 502);
  });

  test('7. Serve a capa com Cache-Control de 1 ano e guarda no Cache API', async () => {
    const antes = cachePuts.length;
    const res = await pedir('/api/capas?u=' + encodeURIComponent('https://www.gutenberg.org/cache/epub/10/pg10.cover.medium.jpg'));

    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'image/jpeg');
    assert.match(res.headers.get('cache-control') || '', /max-age=31536000/);
    assert.match(res.headers.get('cache-control') || '', /s-maxage=31536000/);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(await res.text(), 'fake-image');
    assert.equal(cachePuts.length, antes + 1, 'Deveria guardar a resposta no Cache API');
  });

  test('8. Serve do Cache API sem voltar a chamar a origem', async () => {
    cacheHit = new Response('capa-em-cache', {
      headers: {
        'content-type': 'image/jpeg',
        'cache-control': 'public, max-age=31536000'
      }
    });
    const antes = fetchCount;
    const res = await pedir('/api/capas?u=' + encodeURIComponent('https://www.gutenberg.org/cache/epub/10/pg10.cover.medium.jpg'));

    assert.equal(res.status, 200);
    assert.equal(await res.text(), 'capa-em-cache');
    assert.equal(fetchCount, antes, 'Cache hit não deve chamar a origem');
    cacheHit = null;
  });
});
