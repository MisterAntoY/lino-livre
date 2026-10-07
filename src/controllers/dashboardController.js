const { getDatabase, atualizarStatusAtrasos } = require('../database');

function metricas(req, res) {
  try {
    const db = getDatabase();
    atualizarStatusAtrasos(db);

    const totaisLivros = db.prepare(`
      SELECT 
        COUNT(*) AS total_titulos,
        COALESCE(SUM(quantidade_total), 0) AS total_exemplares,
        COALESCE(SUM(quantidade_disponivel), 0) AS total_disponiveis,
        COALESCE(SUM(quantidade_total - quantidade_disponivel), 0) AS total_emprestados
      FROM livros
    `).get();

    const totaisEmprestimos = db.prepare(`
      SELECT 
        COUNT(CASE WHEN status = 'ativo' THEN 1 END) AS ativos,
        COUNT(CASE WHEN status = 'atrasado' THEN 1 END) AS atrasados,
        COUNT(CASE WHEN status = 'devolvido' THEN 1 END) AS devolvidos,
        COUNT(*) AS total_historico
      FROM emprestimos
    `).get();

    const totalAutores = db.prepare('SELECT COUNT(*) AS total FROM autores').get().total;
    const totalCategorias = db.prepare('SELECT COUNT(*) AS total FROM categorias').get().total;

    const maisEmprestados = db.prepare(`
      SELECT l.id, l.titulo, COUNT(e.id) AS total_emprestimos
      FROM livros l
      JOIN emprestimos e ON e.livro_id = l.id
      GROUP BY l.id
      ORDER BY total_emprestimos DESC
      LIMIT 5
    `).all();

    const ultimosEmprestimos = db.prepare(`
      SELECT 
        e.*,
        l.titulo AS livro_titulo
      FROM emprestimos e
      JOIN livros l ON l.id = e.livro_id
      ORDER BY e.criado_em DESC
      LIMIT 5
    `).all();

    res.json({
      acervo: {
        total_titulos: totaisLivros.total_titulos,
        total_exemplares: totaisLivros.total_exemplares,
        total_disponiveis: totaisLivros.total_disponiveis,
        total_emprestados: totaisLivros.total_emprestados,
        total_autores: totalAutores,
        total_categorias: totalCategorias
      },
      emprestimos: totaisEmprestimos,
      mais_emprestados: maisEmprestados,
      ultimos_emprestimos: ultimosEmprestimos
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao carregar métricas do dashboard: ' + err.message });
  }
}

module.exports = {
  metricas
};
