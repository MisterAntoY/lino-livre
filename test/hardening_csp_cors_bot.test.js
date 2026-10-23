process.env.NODE_ENV = 'test';
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const esbuild = require('esbuild');

const RAIZ = path.resolve(__dirname, '..');
const ler = (rel) => fs.readFileSync(path.join(RAIZ, rel), 'utf8');

const HTMLS = [
  'public/index.html',
  'public/comunidade.html',
  'public/offline.html',
  'public/creditos.html',
  'public/legal.html',
  'public/termos.html'
];

// ═══════════════════════════════════════════════════════════════════════════
// 1. CSP endurecida — sem 'unsafe-inline' em script-src
// ═══════════════════════════════════════════════════════════════════════════
describe('1. CSP endurecida (sem script inline por confiança implícita)', () => {
  test('1.1 - Nenhum HTML usa atributos on*= (só data-acao)', () => {
    const re = /\son(?:click|change|input|submit|error|load|focus|blur|keyup|keydown|mouseover|mouseout)\s*=/i;
    for (const ficheiro of HTMLS) {
      const encontrado = ler(ficheiro).match(re);
      assert.equal(encontrado, null, `${ficheiro} contém handler inline: ${encontrado && encontrado[0]}`);
    }
  });

  test('1.2 - Nenhuma CSP mantém unsafe-inline em script-src', () => {
    for (const ficheiro of ['public/_headers', 'src/app.js', 'workers/src/index.ts']) {
      const scriptSrc = ler(ficheiro).match(/script-src[^;\n"]*/);
      assert.ok(scriptSrc, `${ficheiro}: directiva script-src não encontrada`);
      assert.ok(
        !scriptSrc[0].includes("'unsafe-inline'"),
        `${ficheiro}: script-src ainda contém 'unsafe-inline'`
      );
    }
  });

  test('1.3 - Todos os scripts inline executáveis têm hash sha256 nas 3 CSPs', () => {
    const hashes = [];
    for (const ficheiro of HTMLS) {
      const html = ler(ficheiro);
      const re = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;
      let m;
      while ((m = re.exec(html)) !== null) {
        if (m[1].includes('application/ld+json')) continue;
        const hash = crypto.createHash('sha256').update(m[2], 'utf8').digest('base64');
        hashes.push({ origem: ficheiro, hash });
      }
    }

    assert.ok(hashes.length >= 4, `esperados >= 4 scripts inline, encontrados ${hashes.length}`);
    for (const ficheiro of ['public/_headers', 'src/app.js', 'workers/src/index.ts']) {
      const csp = ler(ficheiro);
      for (const { origem, hash } of hashes) {
        assert.ok(
          csp.includes(`'sha256-${hash}'`),
          `${ficheiro} não autoriza o script inline de ${origem} (sha256-${hash})`
        );
      }
    }
  });

  test('1.4 - Todas as acções data-acao estão na allowlist e resolvem para um método', () => {
    const js = ler('public/js/app.js');
    const markup = HTMLS.map(ler).join('\n') + js;
    const acoes = new Set([...markup.matchAll(/data-acao="([^"]+)"/g)].map((m) => m[1]));

    const bloco = js.match(/const ACOES_PERMITIDAS = new Set\(\[([\s\S]*?)\]\);/);
    assert.ok(bloco, 'allowlist de acções não encontrada em app.js');
    const permitidas = new Set([...bloco[1].matchAll(/'([^']+)'/g)].map((m) => m[1]));

    for (const acao of acoes) {
      assert.ok(permitidas.has(acao), `acção "${acao}" usada no HTML mas ausente da allowlist`);
    }

    const metodos = new Set(
      [...js.matchAll(/^ {2}(?:async )?([A-Za-z_]\w*)\(/gm)].map((m) => m[1])
    );
    const especiais = new Set([
      'imprimir', 'recarregar', 'fallbackImagem'
    ]);
    for (const acao of permitidas) {
      assert.ok(
        metodos.has(acao) || especiais.has(acao),
        `acção "${acao}" está na allowlist mas não resolve para nenhum método`
      );
    }
  });

  test('1.5 - app.js não gera handlers inline em templates dinâmicos', () => {
    const js = ler('public/js/app.js');
    assert.equal(/\son(?:click|change|input|submit|error)=/.test(js), false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. Soft-404 no Express e no Worker
// ═══════════════════════════════════════════════════════════════════════════
describe('2. 404 real (sem soft-404)', () => {
  let servidor;
  let porta;
  const expressApp = require('../src/app');

  before(async () => {
    servidor = http.createServer(expressApp);
    await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
    porta = servidor.address().port;
  });

  after(async () => {
    await new Promise((resolve) => servidor.close(resolve));
  });

  const pedir = (caminho, headers = {}) =>
    fetch(`http://127.0.0.1:${porta}${caminho}`, { headers: { Connection: 'close', ...headers } });

  test('2.1 - Express: caminho desconhecido sem Accept HTML devolve 404', async () => {
    const res = await pedir('/rota-que-nao-existe', { Accept: '*/*' });
    assert.equal(res.status, 404);
  });

  test('2.2 - Express: navegação HTML em caminho sem extensão continua a receber o SPA', async () => {
    const res = await pedir('/rota-que-nao-existe', { Accept: 'text/html,application/xhtml+xml' });
    assert.equal(res.status, 200);
    assert.ok((await res.text()).includes('Lino Livre'));
  });

  test('2.3 - Express: caminho com extensão nunca devolve o SPA (404)', async () => {
    const res = await pedir('/falso.pdf', { Accept: 'text/html' });
    assert.equal(res.status, 404);
  });

  test('2.4 - Express: API desconhecida devolve 404 JSON', async () => {
    const res = await pedir('/api/nao-existe', { Accept: '*/*' });
    assert.equal(res.status, 404);
    const corpo = await res.json();
    assert.ok(corpo.erro);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. Turnstile (anti-bot opcional) — Express
// ═══════════════════════════════════════════════════════════════════════════
describe('3. Turnstile opcional (Express)', () => {
  const { verificarTurnstile } = require('../src/utils/turnstile');
  const sugestoesController = require('../src/controllers/sugestoesController');

  const respostaFalsa = () => {
    const res = {
      statusCode: 200,
      corpo: null,
      status(codigo) { this.statusCode = codigo; return this; },
      json(corpo) { this.corpo = corpo; return this; }
    };
    return res;
  };

  test('3.1 - Sem segredo configurado a verificação é ignorada (não falha aberta por omissão de chave)', async () => {
    const r = await verificarTurnstile({});
    assert.equal(r.configurado, false);
    assert.equal(r.ok, true);
  });

  test('3.2 - Com segredo, token ausente falha', async () => {
    const r = await verificarTurnstile({ secret: 'segredo-teste' });
    assert.equal(r.configurado, true);
    assert.equal(r.ok, false);
  });

  test('3.3 - Com segredo, o siteverify é consultado e só o sucesso é aceite', async () => {
    const ok = await verificarTurnstile({
      secret: 'segredo-teste',
      token: 'token-valido',
      fetchImpl: async (url) => {
        assert.ok(String(url).includes('challenges.cloudflare.com'));
        return { json: async () => ({ success: true }) };
      }
    });
    assert.equal(ok.ok, true);

    const falha = await verificarTurnstile({
      secret: 'segredo-teste',
      token: 'token-invalido',
      fetchImpl: async () => ({ json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }) })
    });
    assert.equal(falha.ok, false);

    const rede = await verificarTurnstile({
      secret: 'segredo-teste',
      token: 'token',
      fetchImpl: async () => { throw new Error('offline'); }
    });
    assert.equal(rede.ok, false);
  });

  test('3.4 - Controller recusa sugestão sem token quando a chave está configurada', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'segredo-turnstile-teste';
    try {
      const res = respostaFalsa();
      await sugestoesController.criar({
        body: { titulo: 'Obra de Teste', url_link: 'https://archive.org/details/obra-teste' },
        ip: '127.0.0.1'
      }, res);
      assert.equal(res.statusCode, 403);
      assert.match(res.corpo.erro, /anti-bot/i);
    } finally {
      delete process.env.TURNSTILE_SECRET_KEY;
    }
  });

  test('3.5 - GET /api/config só expõe a chave pública (nunca o segredo)', async () => {
    const servidor = http.createServer(require('../src/app'));
    await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
    const porta = servidor.address().port;

    try {
      process.env.TURNSTILE_SITE_KEY = 'site-key-publica';
      process.env.TURNSTILE_SECRET_KEY = 'segredo-que-nunca-sai';
      const res = await fetch(`http://127.0.0.1:${porta}/api/config`, { headers: { Connection: 'close' } });
      assert.equal(res.status, 200);
      const corpo = await res.json();
      assert.equal(corpo.turnstile_site_key, 'site-key-publica');
      assert.equal(JSON.stringify(corpo).includes('segredo-que-nunca-sai'), false);
    } finally {
      delete process.env.TURNSTILE_SITE_KEY;
      delete process.env.TURNSTILE_SECRET_KEY;
      await new Promise((resolve) => servidor.close(resolve));
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4, 5 e 6. Worker: CORS, Turnstile, rate limit distribuído e 404
// ═══════════════════════════════════════════════════════════════════════════
describe('4. Cloudflare Worker: CORS, Turnstile, rate limit e 404', () => {
  let app;
  const bundle = path.resolve(__dirname, '.hardening.worker.bundle.cjs');
  const originalFetch = globalThis.fetch;
  let fetchMock = null;

  const ctx = { waitUntil: (p) => { if (p && p.then) p.catch(() => {}); }, passThroughOnException: () => {} };

  const mockD1 = (over = {}) => ({
    prepare: () => {
      const stmt = {
        bind: () => stmt,
        first: async () => over.first ?? null,
        all: async () => ({ results: over.results ?? [] }),
        run: async () => ({ meta: { changes: 1, last_row_id: over.lastRowId ?? 1 } })
      };
      return stmt;
    },
    batch: async () => []
  });

  const env = (extra = {}) => ({
    ADMIN_API_KEY: 'chave-admin-forte-de-teste-123456',
    ENVIRONMENT: 'production',
    DB: mockD1(),
    ...extra
  });

  const pedir = (caminho, opcoes = {}, extra = {}) => app.request(caminho, opcoes, env(extra), ctx);

  before(() => {
    esbuild.buildSync({
      entryPoints: [path.resolve(RAIZ, 'workers/src/index.ts')],
      bundle: true,
      platform: 'node',
      format: 'cjs',
      packages: 'external',
      outfile: bundle
    });
    const mod = require(bundle);
    app = mod.app || mod.default;

    globalThis.fetch = (...args) => (fetchMock ? fetchMock(...args) : originalFetch(...args));
  });

  after(() => {
    globalThis.fetch = originalFetch;
    try { fs.unlinkSync(bundle); } catch (_) {}
  });

  test('4.1 - Preflight de escrita a partir de origem desconhecida é recusado (403)', async () => {
    const res = await pedir('/api/livros', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://atacante.example',
        'Access-Control-Request-Method': 'POST'
      }
    });
    assert.equal(res.status, 403);
  });

  test('4.2 - Preflight de escrita a partir de origem conhecida é autorizado', async () => {
    const res = await pedir('/api/livros', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://linolivre.org',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'x-admin-key,content-type'
      }
    });
    assert.equal(res.status, 204);
    assert.equal(res.headers.get('access-control-allow-origin'), 'https://linolivre.org');
    assert.match(res.headers.get('access-control-allow-headers') || '', /x-admin-key/i);
  });

  test('4.3 - Leitura pública continua aberta a qualquer origem', async () => {
    const res = await pedir('/api/livros?page=1&limit=1', {
      headers: { Origin: 'https://atacante.example' }
    });
    assert.equal(res.headers.get('access-control-allow-origin'), '*');
    assert.ok([200, 503].includes(res.status));
  });

  test('4.4 - Escrita a partir de origem desconhecida é bloqueada antes da autenticação', async () => {
    const res = await pedir('/api/livros', {
      method: 'POST',
      headers: { Origin: 'https://atacante.example', 'Content-Type': 'application/json' },
      body: '{}'
    });
    assert.equal(res.status, 403);
  });

  test('4.5 - Escrita server-to-server (sem Origin) segue para validação de chave', async () => {
    const res = await pedir('/api/livros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    });
    assert.equal(res.status, 401);
  });

  test('4.6 - GET /api/config devolve null quando não há chave configurada', async () => {
    const res = await pedir('/api/config');
    assert.equal(res.status, 200);
    const corpo = await res.json();
    assert.equal(corpo.turnstile_site_key, null);
  });

  test('4.7 - Worker exige Turnstile quando o segredo existe', async () => {
    const res = await pedir('/api/sugestoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Obra Livre', url_link: 'https://archive.org/details/obra-livre' })
    }, { TURNSTILE_SECRET_KEY: 'segredo-worker-teste' });
    assert.equal(res.status, 403);
  });

  test('4.8 - Worker aceita sugestão com token válido (siteverify simulado)', async () => {
    fetchMock = async (url) => {
      assert.ok(String(url).includes('/turnstile/v0/siteverify'));
      return { json: async () => ({ success: true }) };
    };
    try {
      const res = await pedir('/api/sugestoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: 'Obra Livre',
          url_link: 'https://archive.org/details/obra-livre',
          turnstile_token: 'token-valido'
        })
      }, { TURNSTILE_SECRET_KEY: 'segredo-worker-teste', DB: mockD1({ lastRowId: 77 }) });
      assert.equal(res.status, 201);
      const corpo = await res.json();
      assert.equal(corpo.sucesso, true);
      assert.equal(corpo.id, 77);
    } finally {
      fetchMock = null;
    }
  });

  test('4.9 - Rate limit binding distribuído bloqueia com 429 quando esgotado', async () => {
    const res = await pedir('/api/livros?page=1', {}, {
      RATE_LIMITER: { limit: async () => ({ success: false }) }
    });
    assert.equal(res.status, 429);
    assert.ok(Number(res.headers.get('retry-after')) >= 1);
  });

  test('4.10 - Rate limit binding permite quando há folga', async () => {
    const res = await pedir('/api/livros?page=1&limit=1', {}, {
      RATE_LIMITER: { limit: async () => ({ success: true }) }
    });
    assert.ok([200, 503].includes(res.status));
  });

  test('4.11 - Rota desconhecida devolve 404 JSON para a API e 404 HTML para navegação', async () => {
    const api = await pedir('/api/rota-inexistente', { headers: { Accept: 'application/json' } });
    assert.equal(api.status, 404);
    const corpo = await api.json();
    assert.ok(corpo.erro);

    const navegacao = await pedir('/rota-inexistente', { headers: { Accept: 'text/html' } });
    assert.equal(navegacao.status, 404);
    assert.match(await navegacao.text(), /404/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. Supply chain: GitHub Actions fixadas por SHA e permissões mínimas
// ═══════════════════════════════════════════════════════════════════════════
describe('5. Supply chain dos workflows', () => {
  const dir = path.join(RAIZ, '.github/workflows');
  const ficheiros = fs.readdirSync(dir).filter((f) => f.endsWith('.yml'));

  test('5.1 - Todas as acções estão fixadas a um commit SHA de 40 hex', () => {
    assert.ok(ficheiros.length >= 1);
    for (const ficheiro of ficheiros) {
      const conteudo = ler(path.join('.github/workflows', ficheiro));
      for (const m of conteudo.matchAll(/uses:\s*(\S+)/g)) {
        const ref = m[1];
        assert.match(
          ref,
          /@[0-9a-f]{40}$/,
          `${ficheiro}: "${ref}" não está fixada por SHA (tags móveis são um risco de supply chain)`
        );
      }
    }
  });

  test('5.2 - Todos os workflows declaram permissões explícitas', () => {
    for (const ficheiro of ficheiros) {
      const conteudo = ler(path.join('.github/workflows', ficheiro));
      assert.match(conteudo, /^permissions:/m, `${ficheiro}: falta o bloco permissions`);
    }
  });

  test('5.3 - O deploy usa apenas contents: read', () => {
    const deploy = ler('.github/workflows/deploy.yml');
    const bloco = deploy.match(/^permissions:\n((?: {2}.*\n)+)/m);
    assert.ok(bloco, 'deploy.yml: bloco permissions ausente');
    assert.match(bloco[1], /contents:\s*read/);
    assert.equal(/contents:\s*write/.test(bloco[1]), false);
  });
});
