const { getDatabase } = require('../database');

function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>\"']/g, '').trim();
}

function metricas(req, res) {
  try {
    const db = getDatabase();

    // ==================== RESUMO GERAL ====================
    const totaisLivros = db.prepare(`
      SELECT 
        COUNT(*) AS total_livros,
        COALESCE(SUM(leituras), 0) AS total_leituras,
        COALESCE(AVG(paginas), 0) AS media_paginas,
        COUNT(DISTINCT idioma) AS total_idiomas,
        COUNT(DISTINCT autor_id) AS autores_com_obra
      FROM livros
    `).get();

    const totalAutores = db.prepare('SELECT COUNT(*) AS total FROM autores').get().total;
    const totalCategorias = db.prepare('SELECT COUNT(*) AS total FROM categorias').get().total;
    const totalCursos = db.prepare('SELECT COUNT(*) AS total FROM cursos').get().total;
    const totalFontes = db.prepare('SELECT COUNT(*) AS total FROM fontes WHERE ativa = 1').get().total;
    const totalLinks = db.prepare('SELECT COUNT(*) AS total FROM links_livros').get().total;

    // ==================== QUALIDADE / INTEGRIDADE DO ACERVO ====================
    const qualidade = db.prepare(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN capa_url IS NULL OR capa_url = '' THEN 1 ELSE 0 END) AS sem_capa,
        SUM(CASE WHEN sinopse IS NULL OR sinopse = '' THEN 1 ELSE 0 END) AS sem_sinopse,
        SUM(CASE WHEN autor_id IS NULL THEN 1 ELSE 0 END) AS sem_autor,
        SUM(CASE WHEN categoria_id IS NULL THEN 1 ELSE 0 END) AS sem_categoria,
        SUM(CASE WHEN ano_publicacao IS NULL THEN 1 ELSE 0 END) AS sem_ano,
        SUM(CASE WHEN paginas IS NULL OR paginas = 0 THEN 1 ELSE 0 END) AS sem_paginas
      FROM livros
    `).get();

    const semLinks = db.prepare(`
      SELECT COUNT(*) AS total
      FROM livros l
      WHERE NOT EXISTS (SELECT 1 FROM links_livros ll WHERE ll.livro_id = l.id)
    `).get().total;

    // ==================== DISTRIBUIÇÕES ====================
    const formatos = db.prepare(`
      SELECT formato, COUNT(DISTINCT livro_id) AS total
      FROM links_livros
      GROUP BY formato
      ORDER BY total DESC
    `).all();

    const licencas = db.prepare(`
      SELECT licenca, COUNT(*) AS total
      FROM livros
      GROUP BY licenca
      ORDER BY total DESC
    `).all();

    const idiomas = db.prepare(`
      SELECT idioma, COUNT(*) AS total
      FROM livros
      GROUP BY idioma
      ORDER BY total DESC
    `).all();

    const areas = db.prepare(`
      SELECT 
        COALESCE(c.nome, 'Sem categoria') AS area,
        COUNT(l.id) AS total
      FROM categorias c
      LEFT JOIN livros l ON l.categoria_id = c.id
      GROUP BY c.id
      ORDER BY total DESC, c.nome ASC
    `).all();

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

    // ==================== CURSOS ====================
    const cursosPorTipo = db.prepare(`
      SELECT COALESCE(tipo, 'curso') AS tipo, COUNT(*) AS total
      FROM cursos
      GROUP BY COALESCE(tipo, 'curso')
      ORDER BY total DESC
    `).all();

    const cursosPorPlataforma = db.prepare(`
      SELECT plataforma, COUNT(*) AS total
      FROM cursos
      GROUP BY plataforma
      ORDER BY total DESC
      LIMIT 12
    `).all();

    const cursosPorArea = db.prepare(`
      SELECT area, COUNT(*) AS total
      FROM cursos
      GROUP BY area
      ORDER BY total DESC
      LIMIT 12
    `).all();

    const cursosComCertificado = db.prepare(`
      SELECT COUNT(*) AS total
      FROM cursos
      WHERE LOWER(descricao) LIKE '%certificad%' OR LOWER(plataforma) LIKE '%certificad%'
    `).get().total;

    // ==================== TOP OBRAS ====================
    const maisLidos = db.prepare(`
      SELECT 
        l.id, l.titulo, l.leituras, l.licenca, l.capa_url,
        a.nome AS autor_nome,
        c.nome AS categoria_nome
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      ORDER BY 
        l.leituras DESC,
        CASE 
          WHEN l.fonte_id_externo LIKE 'world-hist-%' THEN 1 
          WHEN l.fonte_id_externo LIKE 'world-top100-%' THEN 2 
          WHEN l.categoria_id IN (1, 19, 16, 12) THEN 3
          ELSE 10 
        END ASC,
        l.titulo ASC
      LIMIT 5
    `).all();

    // ==================== PROGRESSO DA META ====================
    const META = 10000000;
    const pct = (totaisLivros.total_livros / META) * 100;

    res.json({
      resumo: {
        total_livros: totaisLivros.total_livros,
        total_leituras: totaisLivros.total_leituras,
        total_autores: totalAutores,
        total_categorias: totalCategorias,
        total_cursos: totalCursos,
        total_fontes: totalFontes,
        total_links: totalLinks,
        total_idiomas: totaisLivros.total_idiomas,
        media_paginas: Math.round(totaisLivros.media_paginas),
        cursos_com_certificado: cursosComCertificado
      },
      meta: {
        alvo: META,
        atual: totaisLivros.total_livros,
        faltam: Math.max(0, META - totaisLivros.total_livros),
        percentual: pct,
        percentual_formatado: pct < 0.01 ? pct.toFixed(4) : pct.toFixed(2)
      },
      qualidade: {
        com_capa: qualidade.total - qualidade.sem_capa,
        sem_capa: qualidade.sem_capa,
        com_sinopse: qualidade.total - qualidade.sem_sinopse,
        sem_sinopse: qualidade.sem_sinopse,
        com_autor: qualidade.total - qualidade.sem_autor,
        sem_autor: qualidade.sem_autor,
        com_categoria: qualidade.total - qualidade.sem_categoria,
        sem_categoria: qualidade.sem_categoria,
        sem_ano: qualidade.sem_ano,
        sem_paginas: qualidade.sem_paginas,
        com_link: qualidade.total - semLinks,
        sem_link: semLinks,
        percentual_completo: qualidade.total > 0
          ? Math.round(((qualidade.total - qualidade.sem_capa - qualidade.sem_sinopse) / qualidade.total) * 100)
          : 0
      },
      formatos,
      licencas,
      idiomas,
      areas,
      fontes,
      cursos_por_tipo: cursosPorTipo,
      cursos_por_plataforma: cursosPorPlataforma,
      cursos_por_area: cursosPorArea,
      mais_lidos: maisLidos.map(l => ({
        ...l,
        capa_url: (l.capa_url && !l.capa_url.toLowerCase().includes('africanstorybook.org'))
          ? (l.capa_url.startsWith('http://') ? 'https://' + l.capa_url.slice(7) : l.capa_url)
          : null
      }))
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao carregar estatísticas do acervo: ' + err.message });
  }
}

module.exports = {
  metricas
};