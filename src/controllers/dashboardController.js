const { getDatabase } = require('../database');

function metricas(req, res) {
  try {
    const db = getDatabase();

    const totaisLivros = db.prepare(`
      SELECT 
        COUNT(*) AS total_livros,
        COALESCE(SUM(leituras), 0) AS total_leituras
      FROM livros
    `).get();

    const totalAutores = db.prepare('SELECT COUNT(*) AS total FROM autores').get().total;
    const totalCategorias = db.prepare('SELECT COUNT(*) AS total FROM categorias').get().total;
    const totalCursos = db.prepare('SELECT COUNT(*) AS total FROM cursos').get().total;
    const totalFontes = db.prepare('SELECT COUNT(*) AS total FROM fontes WHERE ativa = 1').get().total;

    // Métricas por Formato
    const formatos = db.prepare(`
      SELECT formato, COUNT(DISTINCT livro_id) AS total
      FROM links_livros
      GROUP BY formato
      ORDER BY total DESC
    `).all();

    // Métricas por Licença
    const licencas = db.prepare(`
      SELECT licenca, COUNT(*) AS total
      FROM livros
      GROUP BY licenca
      ORDER BY total DESC
    `).all();

    // Métricas por Idioma
    const idiomas = db.prepare(`
      SELECT idioma, COUNT(*) AS total
      FROM livros
      GROUP BY idioma
      ORDER BY total DESC
    `).all();

    // Métricas por Área / Categoria
    const areas = db.prepare(`
      SELECT 
        COALESCE(c.nome, 'Sem categoria') AS area,
        COUNT(l.id) AS total
      FROM categorias c
      LEFT JOIN livros l ON l.categoria_id = c.id
      GROUP BY c.id
      ORDER BY total DESC, c.nome ASC
    `).all();

    // Fontes integradas e livros sincronizados
    const fontes = db.prepare(`
      SELECT 
        f.id, f.slug, f.nome, f.url_base,
        COUNT(l.id) AS total_livros
      FROM fontes f
      LEFT JOIN livros l ON l.fonte_id = f.id
      WHERE f.ativa = 1
      GROUP BY f.id
      ORDER BY total_livros DESC, f.nome ASC
    `).all();

    // Obras mais lidas/acessadas
    const maisLidos = db.prepare(`
      SELECT 
        l.id, l.titulo, l.leituras, l.licenca, l.capa_url,
        a.nome AS autor_nome,
        c.nome AS categoria_nome
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      ORDER BY l.leituras DESC, l.titulo ASC
      LIMIT 5
    `).all();

    res.json({
      resumo: {
        total_livros: totaisLivros.total_livros,
        total_leituras: totaisLivros.total_leituras,
        total_autores: totalAutores,
        total_categorias: totalCategorias,
        total_cursos: totalCursos,
        total_fontes: totalFontes
      },
      formatos,
      licencas,
      idiomas,
      areas,
      fontes,
      mais_lidos: maisLidos
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao carregar estatísticas do acervo: ' + err.message });
  }
}

module.exports = {
  metricas
};
