const { getDatabase, atualizarStatusAtrasos } = require('../database');

function listar(req, res) {
  try {
    const db = getDatabase();
    atualizarStatusAtrasos(db);

    const { status, busca } = req.query;
    let query = `
      SELECT 
        e.*,
        l.titulo AS livro_titulo,
        l.isbn AS livro_isbn,
        a.nome AS autor_nome,
        c.nome AS categoria_nome
      FROM emprestimos e
      JOIN livros l ON l.id = e.livro_id
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      WHERE 1=1
    `;
    const params = [];

    if (status && ['ativo', 'devolvido', 'atrasado'].includes(status)) {
      query += ` AND e.status = ?`;
      params.push(status);
    }

    if (busca && busca.trim()) {
      query += ` AND (e.aluno_nome LIKE ? OR e.aluno_matricula LIKE ? OR l.titulo LIKE ?)`;
      const term = `%${busca.trim()}%`;
      params.push(term, term, term);
    }

    query += ` ORDER BY CASE e.status WHEN 'atrasado' THEN 1 WHEN 'ativo' THEN 2 ELSE 3 END, e.data_devolucao_prevista ASC`;

    const emprestimos = db.prepare(query).all(...params);
    res.json(emprestimos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar empréstimos: ' + err.message });
  }
}

function obterPorId(req, res) {
  try {
    const db = getDatabase();
    atualizarStatusAtrasos(db);

    const emprestimo = db.prepare(`
      SELECT 
        e.*,
        l.titulo AS livro_titulo,
        l.isbn AS livro_isbn,
        a.nome AS autor_nome,
        c.nome AS categoria_nome
      FROM emprestimos e
      JOIN livros l ON l.id = e.livro_id
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      WHERE e.id = ?
    `).get(req.params.id);

    if (!emprestimo) {
      return res.status(404).json({ erro: 'Empréstimo não encontrado' });
    }

    res.json(emprestimo);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar empréstimo: ' + err.message });
  }
}

function criar(req, res) {
  const db = getDatabase();
  try {
    const { livro_id, aluno_nome, aluno_matricula, dias_prazo, data_devolucao_prevista, observacoes } = req.body;

    if (!livro_id) {
      return res.status(400).json({ erro: 'O livro é obrigatório' });
    }
    if (!aluno_nome || !aluno_nome.trim()) {
      return res.status(400).json({ erro: 'O nome do aluno é obrigatório' });
    }
    if (!aluno_matricula || !aluno_matricula.trim()) {
      return res.status(400).json({ erro: 'A matrícula do aluno é obrigatória' });
    }

    // Iniciar transação
    db.exec('BEGIN TRANSACTION;');

    const livro = db.prepare('SELECT id, titulo, quantidade_disponivel FROM livros WHERE id = ?').get(livro_id);
    if (!livro) {
      db.exec('ROLLBACK;');
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }

    if (livro.quantidade_disponivel <= 0) {
      db.exec('ROLLBACK;');
      return res.status(400).json({ 
        erro: `Não há exemplares disponíveis de "${livro.titulo}" para empréstimo no momento` 
      });
    }

    // Calcular datas
    const hoje = new Date();
    const dataEmprestimo = hoje.toISOString().split('T')[0];

    let dataDevolucao;
    if (data_devolucao_prevista) {
      dataDevolucao = data_devolucao_prevista;
    } else {
      const prazoDias = parseInt(dias_prazo, 10) || 14; // Padrão 14 dias
      const dataPrevista = new Date(hoje);
      dataPrevista.setDate(hoje.getDate() + prazoDias);
      dataDevolucao = dataPrevista.toISOString().split('T')[0];
    }

    // Atualizar quantidade disponível do livro
    db.prepare('UPDATE livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = ?').run(livro_id);

    // Inserir registro de empréstimo
    const insertResult = db.prepare(`
      INSERT INTO emprestimos (livro_id, aluno_nome, aluno_matricula, data_emprestimo, data_devolucao_prevista, status, observacoes)
      VALUES (?, ?, ?, ?, ?, 'ativo', ?)
    `).run(
      livro_id,
      aluno_nome.trim(),
      aluno_matricula.trim(),
      dataEmprestimo,
      dataDevolucao,
      observacoes ? observacoes.trim() : null
    );

    db.exec('COMMIT;');

    const novoEmprestimo = db.prepare(`
      SELECT 
        e.*,
        l.titulo AS livro_titulo,
        l.isbn AS livro_isbn,
        a.nome AS autor_nome,
        c.nome AS categoria_nome
      FROM emprestimos e
      JOIN livros l ON l.id = e.livro_id
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      WHERE e.id = ?
    `).get(insertResult.lastInsertRowid);

    res.status(201).json(novoEmprestimo);
  } catch (err) {
    try { db.exec('ROLLBACK;'); } catch (_) {}
    res.status(500).json({ erro: 'Erro ao registrar empréstimo: ' + err.message });
  }
}

function devolver(req, res) {
  const db = getDatabase();
  try {
    const emprestimoId = req.params.id;

    db.exec('BEGIN TRANSACTION;');

    const emprestimo = db.prepare('SELECT * FROM emprestimos WHERE id = ?').get(emprestimoId);
    if (!emprestimo) {
      db.exec('ROLLBACK;');
      return res.status(404).json({ erro: 'Empréstimo não encontrado' });
    }

    if (emprestimo.status === 'devolvido') {
      db.exec('ROLLBACK;');
      return res.status(400).json({ erro: 'Este empréstimo já foi finalizado e o livro devolvido' });
    }

    const dataHoje = new Date().toISOString().split('T')[0];

    // Atualizar status do empréstimo
    db.prepare(`
      UPDATE emprestimos
      SET status = 'devolvido', data_devolucao_real = ?
      WHERE id = ?
    `).run(dataHoje, emprestimoId);

    // Repor exemplar no acervo (respeitando o limite total)
    db.prepare(`
      UPDATE livros
      SET quantidade_disponivel = MIN(quantidade_total, quantidade_disponivel + 1)
      WHERE id = ?
    `).run(emprestimo.livro_id);

    db.exec('COMMIT;');

    const finalizado = db.prepare(`
      SELECT 
        e.*,
        l.titulo AS livro_titulo,
        l.quantidade_disponivel AS livro_quantidade_disponivel
      FROM emprestimos e
      JOIN livros l ON l.id = e.livro_id
      WHERE e.id = ?
    `).get(emprestimoId);

    res.json({
      mensagem: 'Livro devolvido com sucesso ao acervo!',
      emprestimo: finalizado
    });
  } catch (err) {
    try { db.exec('ROLLBACK;'); } catch (_) {}
    res.status(500).json({ erro: 'Erro ao registrar devolução: ' + err.message });
  }
}

function renovar(req, res) {
  try {
    const db = getDatabase();
    const emprestimoId = req.params.id;
    const diasExtras = parseInt(req.body.dias_extras, 10) || 7;

    const emprestimo = db.prepare('SELECT * FROM emprestimos WHERE id = ?').get(emprestimoId);
    if (!emprestimo) {
      return res.status(404).json({ erro: 'Empréstimo não encontrado' });
    }

    if (emprestimo.status === 'devolvido') {
      return res.status(400).json({ erro: 'Não é possível renovar um empréstimo já devolvido' });
    }

    const baseData = new Date(emprestimo.data_devolucao_prevista + 'T00:00:00');
    baseData.setDate(baseData.getDate() + diasExtras);
    const novaDataPrevista = baseData.toISOString().split('T')[0];

    const hoje = new Date().toISOString().split('T')[0];
    const novoStatus = novaDataPrevista >= hoje ? 'ativo' : 'atrasado';

    db.prepare(`
      UPDATE emprestimos
      SET data_devolucao_prevista = ?, status = ?
      WHERE id = ?
    `).run(novaDataPrevista, novoStatus, emprestimoId);

    const atualizado = db.prepare('SELECT * FROM emprestimos WHERE id = ?').get(emprestimoId);
    res.json({
      mensagem: `Empréstimo renovado com sucesso por mais ${diasExtras} dias!`,
      emprestimo: atualizado
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao renovar empréstimo: ' + err.message });
  }
}

module.exports = {
  listar,
  obterPorId,
  criar,
  devolver,
  renovar
};
