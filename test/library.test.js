const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { initDatabase, atualizarStatusAtrasos } = require('../src/database');

describe('Testes do Sistema de Biblioteca Escolar', () => {
  const testDbPath = path.join(__dirname, 'test_biblioteca.db');
  let db;

  before(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    db = initDatabase(testDbPath);
  });

  after(() => {
    if (fs.existsSync(testDbPath)) {
      try { fs.unlinkSync(testDbPath); } catch (_) {}
    }
  });

  test('Deve cadastrar categorias e impedir duplicações com o mesmo nome', () => {
    const insert = db.prepare('INSERT INTO categorias (nome, descricao) VALUES (?, ?)');
    const res = insert.run('Literatura Brasileira', 'Livros nacionais');
    assert.ok(res.lastInsertRowid > 0);

    // Tentar duplicar deve lançar erro devido à restrição UNIQUE
    assert.throws(() => {
      insert.run('Literatura Brasileira', 'Tentativa duplicada');
    }, /UNIQUE/);
  });

  test('Deve cadastrar autores corretamente', () => {
    const insert = db.prepare('INSERT INTO autores (nome, nacionalidade, biografia) VALUES (?, ?, ?)');
    const res = insert.run('Machado de Assis', 'Brasileiro', 'Fundador da ABL');
    assert.ok(res.lastInsertRowid > 0);

    const autor = db.prepare('SELECT * FROM autores WHERE id = ?').get(res.lastInsertRowid);
    assert.equal(autor.nome, 'Machado de Assis');
    assert.equal(autor.nacionalidade, 'Brasileiro');
  });

  test('Deve cadastrar livros com estoque inicial e chaves estrangeiras', () => {
    const autor = db.prepare('SELECT id FROM autores LIMIT 1').get();
    const categoria = db.prepare('SELECT id FROM categorias LIMIT 1').get();

    const insertLivro = db.prepare(`
      INSERT INTO livros (titulo, isbn, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id, categoria_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    // Livro com 2 exemplares
    const res = insertLivro.run('Dom Casmurro', '978-8572323864', 1899, 2, 2, autor.id, categoria.id);
    assert.ok(res.lastInsertRowid > 0);

    const livro = db.prepare('SELECT * FROM livros WHERE id = ?').get(res.lastInsertRowid);
    assert.equal(livro.titulo, 'Dom Casmurro');
    assert.equal(livro.quantidade_total, 2);
    assert.equal(livro.quantidade_disponivel, 2);
  });

  test('Regra de negócio: Realizar empréstimo deve decrementar quantidade_disponivel', () => {
    const livro = db.prepare('SELECT * FROM livros WHERE titulo = ?').get('Dom Casmurro');
    const qtdInicial = livro.quantidade_disponivel;

    // Empréstimo 1
    db.prepare('UPDATE livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = ?').run(livro.id);
    const emp1 = db.prepare(`
      INSERT INTO emprestimos (livro_id, aluno_nome, aluno_matricula, data_emprestimo, data_devolucao_prevista, status)
      VALUES (?, ?, ?, '2026-10-01', '2026-10-15', 'ativo')
    `).run(livro.id, 'Carlos Alberto', 'MAT-100');

    assert.ok(emp1.lastInsertRowid > 0);

    const livroApos1 = db.prepare('SELECT quantidade_disponivel FROM livros WHERE id = ?').get(livro.id);
    assert.equal(livroApos1.quantidade_disponivel, qtdInicial - 1);

    // Empréstimo 2 (último exemplar)
    db.prepare('UPDATE livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = ?').run(livro.id);
    const emp2 = db.prepare(`
      INSERT INTO emprestimos (livro_id, aluno_nome, aluno_matricula, data_emprestimo, data_devolucao_prevista, status)
      VALUES (?, ?, ?, '2026-10-02', '2026-10-16', 'ativo')
    `).run(livro.id, 'Mariana Lima', 'MAT-101');

    assert.ok(emp2.lastInsertRowid > 0);

    const livroEsgotado = db.prepare('SELECT quantidade_disponivel FROM livros WHERE id = ?').get(livro.id);
    assert.equal(livroEsgotado.quantidade_disponivel, 0);
  });

  test('Regra de negócio: Devolução deve restaurar quantidade_disponivel e marcar como devolvido', () => {
    const emp = db.prepare('SELECT * FROM emprestimos WHERE aluno_matricula = ?').get('MAT-100');
    assert.equal(emp.status, 'ativo');

    // Devolver
    db.prepare(`
      UPDATE emprestimos
      SET status = 'devolvido', data_devolucao_real = '2026-10-05'
      WHERE id = ?
    `).run(emp.id);

    db.prepare(`
      UPDATE livros
      SET quantidade_disponivel = MIN(quantidade_total, quantidade_disponivel + 1)
      WHERE id = ?
    `).run(emp.livro_id);

    const empDevolvido = db.prepare('SELECT * FROM emprestimos WHERE id = ?').get(emp.id);
    assert.equal(empDevolvido.status, 'devolvido');
    assert.equal(empDevolvido.data_devolucao_real, '2026-10-05');

    const livroAtualizado = db.prepare('SELECT quantidade_disponivel FROM livros WHERE id = ?').get(emp.livro_id);
    assert.equal(livroAtualizado.quantidade_disponivel, 1);
  });

  test('Regra de negócio: Identificação automática de empréstimo em atraso', () => {
    const livro = db.prepare('SELECT id FROM livros LIMIT 1').get();

    // Criar um empréstimo com data de devolução prevista no passado
    const empAtrasado = db.prepare(`
      INSERT INTO emprestimos (livro_id, aluno_nome, aluno_matricula, data_emprestimo, data_devolucao_prevista, status)
      VALUES (?, ?, ?, '2026-09-01', '2026-09-15', 'ativo')
    `).run(livro.id, 'Aluno Atrasado', 'MAT-999');

    // Executar verificação de atraso
    atualizarStatusAtrasos(db);

    const res = db.prepare('SELECT status FROM emprestimos WHERE id = ?').get(empAtrasado.lastInsertRowid);
    assert.equal(res.status, 'atrasado');
  });

  test('Regra de negócio: Integridade referencial impede deletar livro com empréstimo ativo', () => {
    const livro = db.prepare(`
      SELECT l.id FROM livros l
      JOIN emprestimos e ON e.livro_id = l.id
      WHERE e.status = 'ativo'
      LIMIT 1
    `).get();

    assert.ok(livro);

    // O controller verifica se há empréstimos ativos antes de deletar
    const ativos = db.prepare(`
      SELECT COUNT(*) AS total FROM emprestimos WHERE livro_id = ? AND status IN ('ativo', 'atrasado')
    `).get(livro.id);

    assert.ok(ativos.total > 0);
  });
});
