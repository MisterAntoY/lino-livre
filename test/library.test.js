const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { initDatabase, closeDatabase } = require('../src/database');

describe('Testes de Domínio e Banco de Dados - Lino Livre', () => {
  const testDbPath = path.join(__dirname, 'test_lino_livre.db');
  let db;

  before(() => {
    if (fs.existsSync(testDbPath)) {
      try { fs.unlinkSync(testDbPath); } catch (_) {}
    }
    db = initDatabase(testDbPath, false);
  });

  after(() => {
    try { db.close(); } catch (_) {}
    if (fs.existsSync(testDbPath)) {
      try { fs.unlinkSync(testDbPath); } catch (_) {}
    }
  });

  test('Deve cadastrar categorias e impedir duplicações com o mesmo nome', () => {
    const insert = db.prepare('INSERT INTO categorias (nome, descricao) VALUES (?, ?)');
    const res = insert.run('Literatura Brasileira', 'Obras de autores brasileiros');
    assert.ok(res.lastInsertRowid > 0);

    assert.throws(() => {
      insert.run('Literatura Brasileira', 'Duplicata');
    }, /UNIQUE/);
  });

  test('Deve cadastrar autores e fontes abertas', () => {
    const insertAut = db.prepare('INSERT INTO autores (nome, nacionalidade) VALUES (?, ?)');
    const resAut = insertAut.run('Machado de Assis', 'Brasileiro');
    assert.ok(resAut.lastInsertRowid > 0);

    const insertFonte = db.prepare('INSERT INTO fontes (slug, nome, tipo, url_base) VALUES (?, ?, ?, ?)');
    const resFonte = insertFonte.run('gutenberg', 'Project Gutenberg', 'api', 'https://gutendex.com');
    assert.ok(resFonte.lastInsertRowid > 0);
  });

  test('Deve aplicar constraint CHECK na licença do livro digital', () => {
    const autor = db.prepare('SELECT id FROM autores LIMIT 1').get();
    const categoria = db.prepare('SELECT id FROM categorias LIMIT 1').get();
    const fonte = db.prepare('SELECT id FROM fontes LIMIT 1').get();

    const insertLivro = db.prepare(`
      INSERT INTO livros (
        titulo, autor_id, categoria_id, fonte_id, licenca
      ) VALUES (?, ?, ?, ?, ?)
    `);

    // Licença válida deve passar
    const resValido = insertLivro.run('Dom Casmurro', autor.id, categoria.id, fonte.id, 'dominio-publico');
    assert.ok(resValido.lastInsertRowid > 0);

    // Licença inválida deve ser rejeitada pela CHECK constraint do SQLite
    assert.throws(() => {
      insertLivro.run('Livro Pirata', autor.id, categoria.id, fonte.id, 'licenca-invalida');
    }, /CHECK/);
  });

  test('Busca FTS5 deve encontrar livros por título e nome do autor via triggers', () => {
    const buscaTitulo = db.prepare(`
      SELECT rowid FROM livros_fts WHERE livros_fts MATCH ?
    `).all('Casmurro*');
    assert.ok(buscaTitulo.length > 0, 'Deve encontrar pelo título no FTS5');

    const buscaAutor = db.prepare(`
      SELECT rowid FROM livros_fts WHERE livros_fts MATCH ?
    `).all('Machado*');
    assert.ok(buscaAutor.length > 0, 'Deve encontrar pelo autor no FTS5');
  });

  test('DELETE de livro deve remover links associados em cascata (ON DELETE CASCADE)', () => {
    const livro = db.prepare("SELECT id FROM livros WHERE titulo = 'Dom Casmurro'").get();
    assert.ok(livro, 'Livro deve existir');

    // Inserir dois links para o livro
    const insertLink = db.prepare(`
      INSERT INTO links_livros (livro_id, formato, url, tamanho_bytes, link_externo)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertLink.run(livro.id, 'pdf', 'https://exemplo.org/dom-casmurro.pdf', 1024, 1);
    insertLink.run(livro.id, 'epub', 'https://exemplo.org/dom-casmurro.epub', 2048, 1);

    const linksAntes = db.prepare('SELECT COUNT(*) AS total FROM links_livros WHERE livro_id = ?').get(livro.id).total;
    assert.equal(linksAntes, 2);

    // Deletar o livro
    db.prepare('DELETE FROM livros WHERE id = ?').run(livro.id);

    // Verificar se links foram removidos em cascata
    const linksDepois = db.prepare('SELECT COUNT(*) AS total FROM links_livros WHERE livro_id = ?').get(livro.id).total;
    assert.equal(linksDepois, 0, 'Links devem ser removidos em cascata após deleção do livro');
  });

  test('Importação idempotente: reexecução com mesmo (fonte_id, fonte_id_externo) não duplica registros', () => {
    const fonte = db.prepare("SELECT id FROM fontes WHERE slug = 'gutenberg'").get();
    assert.ok(fonte);

    const upsertLivro = db.prepare(`
      INSERT INTO livros (
        titulo, idioma, autor_id, fonte_id, fonte_id_externo, licenca
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(fonte_id, fonte_id_externo) DO UPDATE SET
        titulo = excluded.titulo
    `);

    // Primeira inserção
    upsertLivro.run('Memórias Póstumas', 'pt', null, fonte.id, 'pg-54829', 'dominio-publico');
    const total1 = db.prepare('SELECT COUNT(*) AS total FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fonte.id, 'pg-54829').total;
    assert.equal(total1, 1);

    // Segunda inserção com os mesmos identificadores
    upsertLivro.run('Memórias Póstumas de Brás Cubas', 'pt', null, fonte.id, 'pg-54829', 'dominio-publico');
    const total2 = db.prepare('SELECT COUNT(*) AS total FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fonte.id, 'pg-54829').total;
    assert.equal(total2, 1, 'Não deve duplicar o registro no banco');

    const livroAtualizado = db.prepare('SELECT titulo FROM livros WHERE fonte_id = ? AND fonte_id_externo = ?').get(fonte.id, 'pg-54829');
    assert.equal(livroAtualizado.titulo, 'Memórias Póstumas de Brás Cubas');
  });

  test('Diretório de cursos gratuitos: cadastro e filtragem por área', () => {
    const insertCurso = db.prepare(`
      INSERT INTO cursos (titulo, area, plataforma, url, licenca, nivel, descricao)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertCurso.run('CS50 Introdução à Computação', 'Tecnologia', 'Harvard', 'https://cs50.harvard.edu', 'gratuito', 'Iniciante', 'Curso aberto');
    insertCurso.run('Física Experimental', 'Ciências Exatas', 'PhET', 'https://phet.colorado.edu', 'cc-by', 'Ensino Médio', 'Simulações');

    const cursosTech = db.prepare("SELECT * FROM cursos WHERE area = 'Tecnologia'").all();
    assert.ok(cursosTech.length >= 1);
    assert.equal(cursosTech[0].titulo, 'CS50 Introdução à Computação');
  });

  test('Guia de TI: cadastro de fonte primária e busca de cursos/roadmaps', async () => {
    const { buscarGuiaDeTI } = require('../src/services/importer');

    const insertFonte = db.prepare('INSERT OR IGNORE INTO fontes (slug, nome, tipo, url_base, ativa) VALUES (?, ?, ?, ?, ?)');
    insertFonte.run('guiadeti', 'Guia de TI', 'rss', 'https://guiadeti.com.br', 1);

    const fonte = db.prepare("SELECT * FROM fontes WHERE slug = 'guiadeti'").get();
    assert.ok(fonte, 'Fonte guiadeti deve existir no banco');
    assert.equal(fonte.nome, 'Guia de TI');
    assert.equal(fonte.tipo, 'rss');

    const itens = await buscarGuiaDeTI('python');
    assert.ok(itens.length > 0, 'Deve retornar itens do Guia de TI');
    assert.ok(itens.some(i => i.titulo.toLowerCase().includes('python')));
    assert.equal(itens[0].autor_nome, 'Guia de TI & Comunidade');
  });
});
