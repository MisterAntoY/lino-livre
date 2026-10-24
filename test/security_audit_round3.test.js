/**
 * Auditoria de segurança — 3.ª ronda (regressões)
 * ================================================
 *
 * Cobre os achados corrigidos nesta ronda:
 *  - enumeração em massa / LIMIT em falta em GET /api/autores;
 *  - LIKE com wildcards não escapados (CPU) em autores e cursos;
 *  - bypass do guard de "zero armazenamento" por percent-encoding;
 *  - ficheiros ocultos servidos pelo express.static;
 *  - entradas numéricas inválidas (NaN) a provocar 500.
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

const DB_TEMP = path.join(os.tmpdir(), `lino_round3_${Date.now()}.db`);
const PUBLIC = path.join(__dirname, '../public');
const PDF_TESTE = path.join(PUBLIC, '__audit_round3.pdf');
const DOTFILE_TESTE = path.join(PUBLIC, '.audit_round3');

let server;
let base;

async function api(caminho, opcoes = {}) {
  const res = await fetch(base + caminho, opcoes);
  const texto = await res.text();
  let json = null;
  try { json = JSON.parse(texto); } catch (_) {}
  return { status: res.status, headers: res.headers, texto, json };
}

before(async () => {
  const db = initDatabase(DB_TEMP);
  seed(db);
  server = http.createServer(app);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  for (const f of [PDF_TESTE, DOTFILE_TESTE]) {
    try { fs.unlinkSync(f); } catch (_) {}
  }
  await new Promise((r) => server.close(r));
  closeDatabase();
  try { fs.unlinkSync(DB_TEMP); } catch (_) {}
});

describe('Enumeração e custo de consulta em /api/autores', () => {
  test('sem parâmetros devolve no máximo o limite por omissão (100)', async () => {
    const { status, json } = await api('/api/autores');
    assert.equal(status, 200);
    assert.ok(Array.isArray(json), 'deve devolver um array');
    assert.ok(json.length <= 100, `devolveu ${json.length} autores`);
    assert.ok(json.length > 0, 'o seed deve ter autores');
    assert.ok('total_livros' in json[0], 'cada autor mantém a contagem de livros');
  });

  test('?limit=abc não provoca 500 e aplica o limite por omissão', async () => {
    const { status, json } = await api('/api/autores?limit=abc');
    assert.equal(status, 200);
    assert.ok(Array.isArray(json));
    assert.ok(json.length <= 100);
  });

  test('?limit=99999 é limitado a 500', async () => {
    const { status, json } = await api('/api/autores?limit=99999');
    assert.equal(status, 200);
    assert.ok(json.length <= 500);
  });

  test('?nome= faz correspondência exata (fluxo de criação de livro)', async () => {
    const todos = await api('/api/autores?limit=500');
    const nome = todos.json[0].nome;
    const { status, json } = await api(`/api/autores?nome=${encodeURIComponent(nome)}`);
    assert.equal(status, 200);
    assert.ok(json.some((a) => a.nome === nome));
    assert.ok(json.every((a) => a.nome.toLowerCase() === nome.toLowerCase()));
  });

  test('wildcards de LIKE são escapados (busca=% não devolve toda a tabela)', async () => {
    const { status, json } = await api('/api/autores?busca=%25');
    assert.equal(status, 200);
    assert.ok(Array.isArray(json));
    assert.equal(json.length, 0, 'nenhum nome contém um wildcard literal');
  });
});

describe('Zero armazenamento de obras (guard de extensões)', () => {
  test('ficheiro .pdf directo devolve 404', async () => {
    fs.writeFileSync(PDF_TESTE, '%PDF-1.4 auditoria');
    const { status } = await api('/__audit_round3.pdf');
    assert.equal(status, 404);
  });

  test('ficheiro .pdf com ponto percent-encoded devolve 404 (sem bypass)', async () => {
    fs.writeFileSync(PDF_TESTE, '%PDF-1.4 auditoria');
    const { status } = await api('/__audit_round3%2Epdf');
    assert.equal(status, 404);
  });

  test('dupla codificação também não contorna o guard', async () => {
    fs.writeFileSync(PDF_TESTE, '%PDF-1.4 auditoria');
    const { status } = await api('/__audit_round3%252Epdf');
    assert.equal(status, 404);
  });
});

describe('Ficheiros ocultos em public/', () => {
  test('dotfile não é servido pelo express.static', async () => {
    fs.writeFileSync(DOTFILE_TESTE, 'segredo-interno');
    const { status } = await api('/.audit_round3');
    assert.equal(status, 404);
  });
});

describe('Entradas numéricas inválidas', () => {
  test('parâmetros de paginação não numéricos não geram 500', async () => {
    for (const rota of [
      '/api/livros?limit=abc&pagina=xyz',
      '/api/cursos?limit=abc&pagina=xyz',
      '/api/roadmaps?limit=abc&pagina=xyz'
    ]) {
      const { status } = await api(rota);
      assert.ok(status < 500, `${rota} devolveu ${status}`);
    }
  });
});
