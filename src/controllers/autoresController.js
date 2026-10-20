const { getDatabase } = require('../database');

function listar(req, res) {
  try {
    const db = getDatabase();
    const busca = (req.query.busca || req.query.q || '').trim();
    const limitParam = req.query.limit || req.query.limite;
    const pageParam = req.query.page || req.query.pagina;

    let query = `
      SELECT a.*, COUNT(l.id) AS total_livros
      FROM autores a
      LEFT JOIN livros l ON l.autor_id = a.id
    `;
    const params = [];

    if (busca) {
      query += ' WHERE a.nome LIKE ?';
      params.push(`%${busca}%`);
    }

    query += ' GROUP BY a.id ORDER BY a.nome ASC';

    if (limitParam || pageParam) {
      const limit = Math.min(Math.max(parseInt(limitParam || '100', 10), 1), 500);
      const page = Math.max(parseInt(pageParam || '1', 10), 1);
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const autores = db.prepare(query).all(...params);
    res.json(autores);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar autores: ' + err.message });
  }
}

function obterPorId(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(404).json({ erro: 'Autor não encontrado' });
    }
    const db = getDatabase();
    const autor = db.prepare('SELECT * FROM autores WHERE id = ?').get(id);
    if (!autor) {
      return res.status(404).json({ erro: 'Autor não encontrado' });
    }
    const livros = db.prepare('SELECT id, titulo, ano_publicacao, leituras, capa_url FROM livros WHERE autor_id = ?').all(id);
    res.json({ ...autor, livros });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar autor: ' + err.message });
  }
}

function criar(req, res) {
  try {
    const { nome, nacionalidade, biografia } = req.body;
    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: 'O nome do autor é obrigatório' });
    }
    const db = getDatabase();
    const result = db.prepare('INSERT INTO autores (nome, nacionalidade, biografia) VALUES (?, ?, ?)').run(
      nome.trim(),
      nacionalidade ? nacionalidade.trim() : null,
      biografia ? biografia.trim() : null
    );
    const novo = db.prepare('SELECT * FROM autores WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar autor: ' + err.message });
  }
}

function atualizar(req, res) {
  try {
    const { nome, nacionalidade, biografia } = req.body;
    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: 'O nome do autor é obrigatório' });
    }
    const db = getDatabase();
    const result = db.prepare('UPDATE autores SET nome = ?, nacionalidade = ?, biografia = ? WHERE id = ?').run(
      nome.trim(),
      nacionalidade ? nacionalidade.trim() : null,
      biografia ? biografia.trim() : null,
      req.params.id
    );
    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Autor não encontrado' });
    }
    const atualizado = db.prepare('SELECT * FROM autores WHERE id = ?').get(req.params.id);
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar autor: ' + err.message });
  }
}

function remover(req, res) {
  try {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM autores WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Autor não encontrado' });
    }
    res.json({ mensagem: 'Autor removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover autor: ' + err.message });
  }
}

module.exports = {
  listar,
  obterPorId,
  criar,
  atualizar,
  remover
};
