const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { initDatabase } = require('../src/database');

describe('Testes de Distribuição de Livros Digitais', () => {
  const testDbPath = path.join(__dirname, 'test_digital.db');
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
    const res = insert.run('Clássicos Brasileiros', 'Obras nacionais em domínio público');
    assert.ok(res.lastInsertRowid > 0);

    assert.throws(() => {
      insert.run('Clássicos Brasileiros', 'Tentativa duplicada');
    }, /UNIQUE/);
  });

  test('Deve cadastrar autores com dados biográficos', () => {
    const insert = db.prepare('INSERT INTO autores (nome, nacionalidade, biografia) VALUES (?, ?, ?)');
    const res = insert.run('Machado de Assis', 'Brasileiro', 'Mestre do realismo e fundador da ABL');
    assert.ok(res.lastInsertRowid > 0);

    const autor = db.prepare('SELECT * FROM autores WHERE id = ?').get(res.lastInsertRowid);
    assert.equal(autor.nome, 'Machado de Assis');
    assert.equal(autor.nacionalidade, 'Brasileiro');
  });

  test('Deve cadastrar livro digital com formato, arquivo e texto de leitura', () => {
    const autor = db.prepare('SELECT id FROM autores LIMIT 1').get();
    const categoria = db.prepare('SELECT id FROM categorias LIMIT 1').get();

    const insertLivro = db.prepare(`
      INSERT INTO livros (
        titulo, subtitulo, sinopse, formato, arquivo_url, capa_url, conteudo_texto, autor_id, categoria_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const res = insertLivro.run(
      'Dom Casmurro',
      'Edição Digital Escolar',
      'A história de Bento Santiago e Capitu.',
      'PDF',
      'https://exemplo.com/dom-casmurro.pdf',
      'https://exemplo.com/capa.jpg',
      'CAPÍTULO I: Do Título. Uma noite destas...',
      autor.id,
      categoria.id
    );

    assert.ok(res.lastInsertRowid > 0);

    const livro = db.prepare('SELECT * FROM livros WHERE id = ?').get(res.lastInsertRowid);
    assert.equal(livro.titulo, 'Dom Casmurro');
    assert.equal(livro.formato, 'PDF');
    assert.equal(livro.downloads_count, 0);
    assert.equal(livro.leituras_count, 0);
    assert.ok(livro.conteudo_texto.includes('CAPÍTULO I'));
  });

  test('Distribuição digital: Deve incrementar downloads_count e registrar log de acesso', () => {
    const livro = db.prepare('SELECT id, downloads_count FROM livros LIMIT 1').get();
    const countAntes = livro.downloads_count;

    // Incrementar download
    db.prepare('UPDATE livros SET downloads_count = downloads_count + 1 WHERE id = ?').run(livro.id);

    // Inserir log
    const resAcesso = db.prepare(`
      INSERT INTO acessos_digitais (livro_id, tipo_acesso, aluno_nome, aluno_turma)
      VALUES (?, 'download', ?, ?)
    `).run(livro.id, 'Lucas Silva', '3º Ano');

    assert.ok(resAcesso.lastInsertRowid > 0);

    const livroAtualizado = db.prepare('SELECT downloads_count FROM livros WHERE id = ?').get(livro.id);
    assert.equal(livroAtualizado.downloads_count, countAntes + 1);

    const log = db.prepare('SELECT * FROM acessos_digitais WHERE id = ?').get(resAcesso.lastInsertRowid);
    assert.equal(log.tipo_acesso, 'download');
    assert.equal(log.aluno_nome, 'Lucas Silva');
  });

  test('Distribuição digital: Deve incrementar leituras_count para leitura online no navegador', () => {
    const livro = db.prepare('SELECT id, leituras_count FROM livros LIMIT 1').get();
    const countAntes = livro.leituras_count;

    // Incrementar leitura
    db.prepare('UPDATE livros SET leituras_count = leituras_count + 1 WHERE id = ?').run(livro.id);

    // Inserir log
    const resAcesso = db.prepare(`
      INSERT INTO acessos_digitais (livro_id, tipo_acesso, aluno_nome, aluno_turma)
      VALUES (?, 'leitura_online', ?, ?)
    `).run(livro.id, 'Mariana Costa', '2º Ano');

    assert.ok(resAcesso.lastInsertRowid > 0);

    const livroAtualizado = db.prepare('SELECT leituras_count FROM livros WHERE id = ?').get(livro.id);
    assert.equal(livroAtualizado.leituras_count, countAntes + 1);
  });

  test('Integridade: Excluir livro digital deve remover acessos em cascata', () => {
    const livro = db.prepare('SELECT id FROM livros LIMIT 1').get();
    
    const logsAntes = db.prepare('SELECT COUNT(*) AS total FROM acessos_digitais WHERE livro_id = ?').get(livro.id);
    assert.ok(logsAntes.total > 0);

    db.prepare('DELETE FROM livros WHERE id = ?').run(livro.id);

    const logsDepois = db.prepare('SELECT COUNT(*) AS total FROM acessos_digitais WHERE livro_id = ?').get(livro.id);
    assert.equal(logsDepois.total, 0);
  });
});
