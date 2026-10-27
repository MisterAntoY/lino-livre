const { getDatabase } = require('../database');

function listar(req, res) {
  try {
    const db = getDatabase();
    let temContadores = false;
    try {
      temContadores = !!db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='contadores'").get();
    } catch (_) {}

    let categorias;
    if (temContadores) {
      categorias = db.prepare(`
        SELECT c.*, COALESCE(k.total, 0) AS total_livros
        FROM categorias c
        LEFT JOIN contadores k ON k.dimensao = 'categoria' AND k.chave = CAST(c.id AS TEXT)
        ORDER BY c.nome ASC
      `).all();
    } else {
      categorias = db.prepare(`
        SELECT c.*, COUNT(l.id) AS total_livros
        FROM categorias c
        LEFT JOIN livros l ON l.categoria_id = c.id
        GROUP BY c.id
        ORDER BY c.nome ASC
      `).all();
    }
    res.json(categorias);
  } catch (err) {
    console.error('[categoriasController]', err);
    res.status(500).json({ erro: 'Erro ao buscar categorias' });
  }
}

function obterPorId(req, res) {
  try {
    if (!/^\d+$/.test(req.params.id)) {
      return res.status(404).json({ erro: 'ID da categoria deve ser um número inteiro' });
    }
    const db = getDatabase();
    const categoria = db.prepare('SELECT * FROM categorias WHERE id = ?').get(req.params.id);
    if (!categoria) {
      return res.status(404).json({ erro: 'Categoria não encontrada' });
    }
    res.json(categoria);
  } catch (err) {
    console.error('[categoriasController]', err);
    res.status(500).json({ erro: 'Erro ao buscar categoria' });
  }
}

function criar(req, res) {
  try {
    const { nome, descricao } = req.body || {};
    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: 'O nome da categoria é obrigatório' });
    }
    const db = getDatabase();
    const result = db.prepare('INSERT INTO categorias (nome, descricao) VALUES (?, ?)').run(nome.trim(), descricao || null);
    const nova = db.prepare('SELECT * FROM categorias WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(nova);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ erro: 'Já existe uma categoria com este nome' });
    }
    console.error('[categoriasController]', err);
    res.status(500).json({ erro: 'Erro ao cadastrar categoria' });
  }
}

function atualizar(req, res) {
  try {
    if (!/^\d+$/.test(req.params.id)) {
      return res.status(404).json({ erro: 'ID da categoria deve ser um número inteiro' });
    }
    const { nome, descricao } = req.body || {};
    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: 'O nome da categoria é obrigatório' });
    }
    const db = getDatabase();
    const result = db.prepare('UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?').run(nome.trim(), descricao || null, req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Categoria não encontrada' });
    }
    const atualizada = db.prepare('SELECT * FROM categorias WHERE id = ?').get(req.params.id);
    res.json(atualizada);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ erro: 'Já existe uma categoria com este nome' });
    }
    console.error('[categoriasController]', err);
    res.status(500).json({ erro: 'Erro ao atualizar categoria' });
  }
}

function remover(req, res) {
  try {
    if (!/^\d+$/.test(req.params.id)) {
      return res.status(404).json({ erro: 'ID da categoria deve ser um número inteiro' });
    }
    const db = getDatabase();
    const result = db.prepare('DELETE FROM categorias WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Categoria não encontrada' });
    }
    res.json({ mensagem: 'Categoria removida com sucesso' });
  } catch (err) {
    console.error('[categoriasController]', err);
    res.status(500).json({ erro: 'Erro ao remover categoria' });
  }
}

module.exports = {
  listar,
  obterPorId,
  criar,
  atualizar,
  remover
};
