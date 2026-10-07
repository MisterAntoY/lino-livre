const { getDatabase } = require('../database');

function listar(req, res) {
  try {
    const db = getDatabase();
    const { area, nivel, plataforma, fonte, busca, youtube, certificado, tipo, excluir_roadmaps } = req.query;

    let query = 'SELECT * FROM cursos WHERE 1=1';
    const params = [];

    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }
    if (excluir_roadmaps === '1' || excluir_roadmaps === 'true') {
      query += " AND (tipo != 'roadmap' OR tipo IS NULL)";
    }
    if (area) {
      query += ' AND area = ?';
      params.push(area);
    }
    if (nivel) {
      query += ' AND nivel = ?';
      params.push(nivel);
    }
    if (plataforma) {
      query += ' AND plataforma LIKE ?';
      params.push(`%${plataforma}%`);
    } else if (fonte && (fonte.toLowerCase() === 'guiadeti' || fonte.toLowerCase() === 'guia de ti')) {
      query += ' AND plataforma LIKE ?';
      params.push('%Guia de TI%');
    }
    if (youtube === '1' || youtube === 'true' || (plataforma && plataforma.toLowerCase() === 'youtube')) {
      query += ' AND plataforma LIKE ?';
      params.push('%YouTube%');
    }
    if (certificado === 'gratuito' || certificado === '1' || certificado === 'true') {
      query += ' AND (descricao LIKE ? OR plataforma LIKE ?)';
      params.push('%certifica%', '%certifica%');
    }
    if (busca && busca.trim()) {
      const termo = `%${busca.trim()}%`;
      query += ' AND (titulo LIKE ? OR descricao LIKE ? OR plataforma LIKE ?)';
      params.push(termo, termo, termo);
    }

    // Guia de TI como fonte principal destacada no topo
    query += " ORDER BY CASE WHEN plataforma LIKE '%Guia de TI%' THEN 0 ELSE 1 END, area ASC, titulo ASC";
    const cursos = db.prepare(query).all(...params);
    res.json(cursos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar cursos: ' + err.message });
  }
}

function listarRoadmaps(req, res) {
  try {
    const db = getDatabase();
    const { busca, plataforma, area } = req.query;
    let query = "SELECT * FROM cursos WHERE tipo = 'roadmap'";
    const params = [];

    if (plataforma) {
      query += ' AND plataforma LIKE ?';
      params.push(`%${plataforma}%`);
    }
    if (area) {
      query += ' AND area = ?';
      params.push(area);
    }
    if (busca && busca.trim()) {
      const termo = `%${busca.trim()}%`;
      query += ' AND (titulo LIKE ? OR descricao LIKE ? OR plataforma LIKE ?)';
      params.push(termo, termo, termo);
    }

    query += " ORDER BY CASE WHEN plataforma LIKE '%Roadmap.sh%' THEN 0 WHEN plataforma LIKE '%Trilha Info%' THEN 1 ELSE 2 END, titulo ASC";
    const roadmaps = db.prepare(query).all(...params);
    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar roadmaps: ' + err.message });
  }
}

function obterPorId(req, res) {
  try {
    const db = getDatabase();
    const curso = db.prepare('SELECT * FROM cursos WHERE id = ?').get(req.params.id);
    if (!curso) return res.status(404).json({ erro: 'Curso não encontrado' });
    res.json(curso);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao carregar curso: ' + err.message });
  }
}

function criar(req, res) {
  try {
    const { titulo, area, plataforma, url, licenca, nivel, descricao } = req.body;
    if (!titulo || !area || !plataforma || !url) {
      return res.status(400).json({ erro: 'Campos obrigatórios: titulo, area, plataforma, url' });
    }

    const db = getDatabase();
    const result = db.prepare(`
      INSERT INTO cursos (titulo, area, plataforma, url, licenca, nivel, descricao)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      titulo.trim(),
      area.trim(),
      plataforma.trim(),
      url.trim(),
      licenca || 'gratuito',
      nivel || 'Iniciante',
      descricao ? descricao.trim() : null
    );

    const novo = db.prepare('SELECT * FROM cursos WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar curso: ' + err.message });
  }
}

function remover(req, res) {
  try {
    const db = getDatabase();
    const resDel = db.prepare('DELETE FROM cursos WHERE id = ?').run(req.params.id);
    if (resDel.changes === 0) return res.status(404).json({ erro: 'Curso não encontrado' });
    res.json({ mensagem: 'Curso removido com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao remover curso: ' + err.message });
  }
}

function acessarRedirect(req, res) {
  try {
    const db = getDatabase();
    const curso = db.prepare('SELECT id, titulo, url FROM cursos WHERE id = ?').get(req.params.id);
    if (!curso) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }
    // Redirecionamento HTTP 302 direto para o curso oficial
    res.redirect(302, curso.url);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao redirecionar para o curso: ' + err.message });
  }
}

module.exports = {
  listar,
  listarRoadmaps,
  obterPorId,
  acessarRedirect,
  criar,
  remover
};
