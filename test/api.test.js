const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const app = require('../src/app');
const { initDatabase } = require('../src/database');
const { seed } = require('../src/database/seed');

describe('Testes de Integração da API de Distribuição Digital', () => {
  let server;
  let port;
  const testDbPath = path.join(__dirname, 'api_test_digital.db');

  before(async () => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    const db = initDatabase(testDbPath);
    seed(db);

    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, () => {
        port = server.address().port;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
    if (fs.existsSync(testDbPath)) {
      try { fs.unlinkSync(testDbPath); } catch (_) {}
    }
  });

  const request = async (path, options = {}) => {
    const url = `http://127.0.0.1:${port}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  };

  test('GET /api/dashboard retorna métricas de distribuição digital', async () => {
    const res = await request('/api/dashboard');
    assert.equal(res.status, 200);
    assert.ok(res.data.resumo.total_titulos > 0);
    assert.ok(res.data.resumo.total_downloads > 0);
    assert.ok(res.data.resumo.total_leituras > 0);
    assert.ok(Array.isArray(res.data.formatos));
    assert.ok(Array.isArray(res.data.mais_populares));
  });

  test('GET /api/livros filtra por formato digital', async () => {
    const resPdf = await request('/api/livros?formato=PDF');
    assert.equal(resPdf.status, 200);
    assert.ok(resPdf.data.every(l => l.formato === 'PDF'));

    const resWeb = await request('/api/livros?formato=Web');
    assert.equal(resWeb.status, 200);
    assert.ok(resWeb.data.every(l => l.formato === 'Web'));
  });

  test('POST /api/livros/:id/download incrementa downloads_count', async () => {
    const listRes = await request('/api/livros');
    const livro = listRes.data[0];
    const downloadsAntes = livro.downloads_count;

    const dlRes = await request(`/api/livros/${livro.id}/download`, {
      method: 'POST',
      body: JSON.stringify({ aluno_nome: 'Carolina Lima', aluno_turma: '3º EM' })
    });

    assert.equal(dlRes.status, 200);
    assert.equal(dlRes.data.total_downloads, downloadsAntes + 1);

    const livroAtualizado = await request(`/api/livros/${livro.id}`);
    assert.equal(livroAtualizado.data.downloads_count, downloadsAntes + 1);
  });

  test('POST /api/livros/:id/ler abre leitura online e incrementa leituras_count', async () => {
    const listRes = await request('/api/livros');
    const livro = listRes.data[0];
    const leiturasAntes = livro.leituras_count;

    const lerRes = await request(`/api/livros/${livro.id}/ler`, {
      method: 'POST',
      body: JSON.stringify({ aluno_nome: 'Gabriel Pires', aluno_turma: '1º EM' })
    });

    assert.equal(lerRes.status, 200);
    assert.ok(lerRes.data.livro.conteudo_texto);
    assert.equal(lerRes.data.livro.leituras_count, leiturasAntes + 1);
  });
});
