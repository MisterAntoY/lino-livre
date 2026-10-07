const { getDatabase } = require('../database');

function metricas(req, res) {
  try {
    const db = getDatabase();

    const totaisLivros = db.prepare(`
      SELECT 
        COUNT(*) AS total_titulos,
        COALESCE(SUM(downloads_count), 0) AS total_downloads,
        COALESCE(SUM(leituras_count), 0) AS total_leituras,
        COALESCE(SUM(downloads_count + leituras_count), 0) AS total_engajamento
      FROM livros
    `).get();

    const formatos = db.prepare(`
      SELECT formato, COUNT(*) AS total
      FROM livros
      GROUP BY formato
    `).all();

    const totalAutores = db.prepare('SELECT COUNT(*) AS total FROM autores').get().total;
    const totalCategorias = db.prepare('SELECT COUNT(*) AS total FROM categorias').get().total;

    const maisPopulares = db.prepare(`
      SELECT 
        l.id, l.titulo, l.formato, l.downloads_count, l.leituras_count,
        (l.downloads_count + l.leituras_count) AS total_acessos,
        a.nome AS autor_nome
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      ORDER BY total_acessos DESC
      LIMIT 5
    `).all();

    const ultimosAcessos = db.prepare(`
      SELECT 
        a.id, a.tipo_acesso, a.aluno_nome, a.aluno_turma, a.criado_em,
        l.titulo AS livro_titulo, l.formato
      FROM acessos_digitais a
      JOIN livros l ON l.id = a.livro_id
      ORDER BY a.criado_em DESC
      LIMIT 6
    `).all();

    res.json({
      resumo: {
        total_titulos: totaisLivros.total_titulos,
        total_downloads: totaisLivros.total_downloads,
        total_leituras: totaisLivros.total_leituras,
        total_engajamento: totaisLivros.total_engajamento,
        total_autores: totalAutores,
        total_categorias: totalCategorias
      },
      formatos,
      mais_populares: maisPopulares,
      ultimos_acessos: ultimosAcessos
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao carregar estatísticas digitais: ' + err.message });
  }
}

module.exports = {
  metricas
};
