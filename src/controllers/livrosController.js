const { getDatabase } = require('../database');

function listar(req, res) {
  try {
    const db = getDatabase();
    const { busca, categoria_id, autor_id, apenas_disponiveis } = req.query;

    let query = `
      SELECT 
        l.*,
        a.nome AS autor_nome,
        c.nome AS categoria_nome,
        (l.quantidade_total - l.quantidade_disponivel) AS quantidade_emprestada
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      WHERE 1=1
    `;
    const params = [];

    if (busca && busca.trim()) {
      query += ` AND (l.titulo LIKE ? OR l.isbn LIKE ? OR a.nome LIKE ?)`;
      const term = `%${busca.trim()}%`;
      params.push(term, term, term);
    }

    if (categoria_id) {
      query += ` AND l.categoria_id = ?`;
      params.push(categoria_id);
    }

    if (autor_id) {
      query += ` AND l.autor_id = ?`;
      params.push(autor_id);
    }

    if (apenas_disponiveis === 'true' || apenas_disponiveis === '1') {
      query += ` AND l.quantidade_disponivel > 0`;
    }

    query += ` ORDER BY l.titulo ASC`;

    const livros = db.prepare(query).all(...params);
    res.json(livros);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar livros: ' + err.message });
  }
}

function obterPorId(req, res) {
  try {
    const db = getDatabase();
    const livro = db.prepare(`
      SELECT 
        l.*,
        a.nome AS autor_nome,
        c.nome AS categoria_nome,
        (l.quantidade_total - l.quantidade_disponivel) AS quantidade_emprestada
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      WHERE l.id = ?
    `).get(req.params.id);

    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    const historicoEmprestimos = db.prepare(`
      SELECT id, aluno_nome, aluno_matricula, data_emprestimo, data_devolucao_prevista, data_devolucao_real, status
      FROM emprestimos
      WHERE livro_id = ?
      ORDER BY data_emprestimo DESC
      LIMIT 10
    `).all(req.params.id);

    res.json({ ...livro, historico_emprestimos: historicoEmprestimos });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar detalhes do livro: ' + err.message });
  }
}

function criar(req, res) {
  try {
    const { titulo, isbn, ano_publicacao, quantidade_total, autor_id, categoria_id } = req.body;

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({ erro: 'O título do livro é obrigatório' });
    }

    const total = parseInt(quantidade_total, 10) || 1;
    if (total < 1) {
      return res.status(400).json({ erro: 'A quantidade total de exemplares deve ser de pelo menos 1' });
    }

    const db = getDatabase();

    // Validar se autor e categoria existem (caso informados)
    if (autor_id) {
      const autorExiste = db.prepare('SELECT id FROM autores WHERE id = ?').get(autor_id);
      if (!autorExiste) return res.status(400).json({ erro: 'Autor selecionado não existe' });
    }

    if (categoria_id) {
      const catExiste = db.prepare('SELECT id FROM categorias WHERE id = ?').get(categoria_id);
      if (!catExiste) return res.status(400).json({ erro: 'Categoria selecionada não existe' });
    }

    const result = db.prepare(`
      INSERT INTO livros (titulo, isbn, ano_publicacao, quantidade_total, quantidade_disponivel, autor_id, categoria_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      titulo.trim(),
      isbn ? isbn.trim() : null,
      ano_publicacao ? parseInt(ano_publicacao, 10) : null,
      total,
      total, // inicialmente todos disponíveis
      autor_id || null,
      categoria_id || null
    );

    const novo = db.prepare(`
      SELECT l.*, a.nome AS autor_nome, c.nome AS categoria_nome
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      WHERE l.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(novo);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ erro: 'Já existe um livro cadastrado com este ISBN' });
    }
    res.status(500).json({ erro: 'Erro ao cadastrar livro: ' + err.message });
  }
}

function atualizar(req, res) {
  try {
    const { titulo, isbn, ano_publicacao, quantidade_total, autor_id, categoria_id } = req.body;
    const db = getDatabase();

    const livroAtual = db.prepare('SELECT * FROM livros WHERE id = ?').get(req.params.id);
    if (!livroAtual) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({ erro: 'O título do livro é obrigatório' });
    }

    const novoTotal = parseInt(quantidade_total, 10) || livroAtual.quantidade_total;
    const exemplaresEmprestados = livroAtual.quantidade_total - livroAtual.quantidade_disponivel;

    if (novoTotal < exemplaresEmprestados) {
      return res.status(400).json({ 
        erro: `Não é possível reduzir a quantidade total para ${novoTotal}, pois há ${exemplaresEmprestados} exemplares emprestados no momento` 
      });
    }

    const novaDisponivel = novoTotal - exemplaresEmprestados;

    db.prepare(`
      UPDATE livros
      SET titulo = ?, isbn = ?, ano_publicacao = ?, quantidade_total = ?, quantidade_disponivel = ?, autor_id = ?, categoria_id = ?
      WHERE id = ?
    `).run(
      titulo.trim(),
      isbn ? isbn.trim() : null,
      ano_publicacao ? parseInt(ano_publicacao, 10) : null,
      novoTotal,
      novaDisponivel,
      autor_id || null,
      categoria_id || null,
      req.params.id
    );

    const atualizado = db.prepare(`
      SELECT l.*, a.nome AS autor_nome, c.nome AS categoria_nome
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      WHERE l.id = ?
    `).get(req.params.id);

    res.json(atualizado);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ erro: 'Já existe um livro cadastrado com este ISBN' });
    }
    res.status(500).json({ erro: 'Erro ao atualizar livro: ' + err.message });
  }
}

function remover(req, res) {
  try {
    const db = getDatabase();
    
    // Verificar se há empréstimos ativos para este livro
    const emprestimosAtivos = db.prepare(`
      SELECT COUNT(*) AS total
      FROM emprestimos
      WHERE livro_id = ? AND status IN ('ativo', 'atrasado')
    `).get(req.params.id);

    if (emprestimosAtivos && emprestimosAtivos.total > 0) {
      return res.status(400).json({ 
        erro: 'Não é possível excluir o livro enquanto houver empréstimos ativos ou em atraso pendentes' 
      });
    }

    const result = db.prepare('DELETE FROM livros WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    res.json({ mensagem: 'Livro removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover livro: ' + err.message });
  }
}

module.exports = {
  listar,
  obterPorId,
  criar,
  atualizar,
  remover
};
