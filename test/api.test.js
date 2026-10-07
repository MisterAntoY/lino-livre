const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const app = require('../src/app');
const { initDatabase } = require('../src/database');
const { seed } = require('../src/database/seed');

describe('Testes de Integração da API HTTP', () => {
  let server;
  let port;
  const testDbPath = path.join(__dirname, 'api_test.db');

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

  test('GET /api/dashboard retorna estatísticas consolidadas', async () => {
    const res = await request('/api/dashboard');
    assert.equal(res.status, 200);
    assert.ok(res.data.acervo.total_titulos > 0);
    assert.ok(res.data.acervo.total_exemplares > 0);
    assert.ok(res.data.emprestimos.ativos >= 0);
  });

  test('GET /api/livros retorna lista com autores e categorias vinculados', async () => {
    const res = await request('/api/livros');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.data));
    const domCasmurro = res.data.find(l => l.titulo === 'Dom Casmurro');
    assert.ok(domCasmurro);
    assert.equal(domCasmurro.autor_nome, 'Machado de Assis');
    assert.equal(domCasmurro.categoria_nome, 'Literatura Brasileira');
  });

  test('POST /api/emprestimos cria empréstimo e decrementa estoque', async () => {
    // Buscar livro com estoque disponível
    const listRes = await request('/api/livros?apenas_disponiveis=true');
    const livro = listRes.data[0];
    const qtdAntes = livro.quantidade_disponivel;

    const payload = {
      livro_id: livro.id,
      aluno_nome: 'Ana Clara',
      aluno_matricula: 'MAT-9901',
      dias_prazo: 14
    };

    const empRes = await request('/api/emprestimos', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    assert.equal(empRes.status, 201);
    assert.equal(empRes.data.aluno_nome, 'Ana Clara');
    assert.equal(empRes.data.status, 'ativo');

    // Verificar estoque atualizado do livro
    const livroAtualizado = await request(`/api/livros/${livro.id}`);
    assert.equal(livroAtualizado.data.quantidade_disponivel, qtdAntes - 1);

    // Devolver o livro
    const devRes = await request(`/api/emprestimos/${empRes.data.id}/devolver`, {
      method: 'POST'
    });
    assert.equal(devRes.status, 200);
    assert.equal(devRes.data.emprestimo.status, 'devolvido');

    // Confirmar reposição do estoque
    const livroAposDevolucao = await request(`/api/livros/${livro.id}`);
    assert.equal(livroAposDevolucao.data.quantidade_disponivel, qtdAntes);
  });
});
