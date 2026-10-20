const { getDatabase } = require('../database');
const { podcastsShowsData } = require('../database/podcastsSeedData');

function listarShows(req, res) {
  try {
    const db = getDatabase();
    const { busca, categoria } = req.query;

    let query = `
      SELECT s.*, 
        COUNT(e.id) as total_episodios
      FROM podcasts_shows s
      LEFT JOIN podcasts_episodios e ON e.show_id = s.id
      WHERE s.ativo = 1
    `;
    const params = [];

    if (categoria && categoria.trim()) {
      query += ` AND s.categoria LIKE ?`;
      params.push(`%${categoria.trim()}%`);
    }

    if (busca && busca.trim()) {
      query += ` AND (s.titulo LIKE ? OR s.descricao LIKE ?)`;
      const term = `%${busca.trim()}%`;
      params.push(term, term);
    }

    query += ` GROUP BY s.id ORDER BY s.id ASC`;

    const shows = db.prepare(query).all(...params);
    res.json(shows);
  } catch (err) {
    // Fallback defensivo usando os dados em memória se a tabela não tiver sido criada ainda
    let data = podcastsShowsData.map(s => ({
      ...s,
      total_episodios: (s.episodios || []).length
    }));
    res.json(data);
  }
}

function obterShow(req, res) {
  try {
    const { slugOuId } = req.params;
    const db = getDatabase();

    let show;
    if (/^\d+$/.test(slugOuId)) {
      show = db.prepare(`SELECT * FROM podcasts_shows WHERE id = ? AND ativo = 1`).get(parseInt(slugOuId, 10));
    } else {
      show = db.prepare(`SELECT * FROM podcasts_shows WHERE slug = ? AND ativo = 1`).get(slugOuId);
    }

    if (!show) {
      return res.status(404).json({ erro: 'Podcast não encontrado' });
    }

    const episodios = db.prepare(`
      SELECT * FROM podcasts_episodios 
      WHERE show_id = ? 
      ORDER BY numero ASC, publicado_em DESC
    `).all(show.id);

    res.json({
      ...show,
      episodios
    });
  } catch (err) {
    const { slugOuId } = req.params;
    const s = podcastsShowsData.find(item => item.slug === slugOuId || String(item.id) === slugOuId);
    if (s) {
      return res.json(s);
    }
    res.status(500).json({ erro: 'Erro ao buscar podcast: ' + err.message });
  }
}

function listarEpisodiosRecentes(req, res) {
  try {
    const db = getDatabase();
    const episodios = db.prepare(`
      SELECT e.*, 
        s.titulo as show_titulo, 
        s.capa_url as show_capa_url,
        s.slug as show_slug
      FROM podcasts_episodios e
      JOIN podcasts_shows s ON s.id = e.show_id
      WHERE s.ativo = 1
      ORDER BY e.publicado_em DESC, e.id DESC
      LIMIT 20
    `).all();

    res.json(episodios);
  } catch (err) {
    const todos = [];
    for (const s of podcastsShowsData) {
      for (const e of (s.episodios || [])) {
        todos.push({
          ...e,
          show_titulo: s.titulo,
          show_capa_url: s.capa_url,
          show_slug: s.slug
        });
      }
    }
    res.json(todos.slice(0, 20));
  }
}

function ouvirEpisodio(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id) || id <= 0) {
      return res.status(400).json({ erro: 'ID do episódio inválido' });
    }
    const db = getDatabase();
    const result = db.prepare(`UPDATE podcasts_episodios SET reproducoes = reproducoes + 1 WHERE id = ?`).run(id);
    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Episódio não encontrado' });
    }
    res.json({ sucesso: true, id });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registar reprodução: ' + err.message });
  }
}

module.exports = {
  listarShows,
  obterShow,
  listarEpisodiosRecentes,
  ouvirEpisodio
};
