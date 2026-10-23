const { getDatabase } = require('../database');
const { validarUrlRedirecionamento } = require('../utils/urlValidator');

// Escapa os metacaracteres de LIKE. Sem isto, `busca=%a%b%c...` transforma o
// filtro num varrimento com múltiplos wildcards (DoS de CPU na base de dados).
function escaparLike(valor) {
  return String(valor || '').slice(0, 120).replace(/[\\%_]/g, '\\$&');
}

function listar(req, res) {
  try {
    const db = getDatabase();
    const { area, nivel, plataforma, fonte, busca, youtube, certificado, tipo, excluir_roadmaps, licenca } = req.query;

    let query = 'SELECT * FROM cursos WHERE 1=1';
    const params = [];

    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }
    if (licenca) {
      query += ' AND licenca = ?';
      params.push(licenca);
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
      const termo = `%${escaparLike(busca.trim())}%`;
      query += " AND (titulo LIKE ? ESCAPE '\\' OR descricao LIKE ? ESCAPE '\\' OR plataforma LIKE ? ESCAPE '\\')";
      params.push(termo, termo, termo);
    }

    // Guia de TI como fonte principal destacada no topo, ordenação estável por id
    query += " ORDER BY CASE WHEN plataforma LIKE '%Guia de TI%' THEN 0 ELSE 1 END, id ASC";

    const limitParam = req.query.limit || req.query.limite;
    const pageParam = req.query.page || req.query.pagina;
    if (limitParam || pageParam) {
      const limit = Math.min(Math.max(parseInt(limitParam || '100', 10) || 100, 1), 500);
      const page = Math.min(2000, Math.max(parseInt(pageParam || '1', 10) || 1, 1));
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const cursos = db.prepare(query).all(...params);
    res.json(cursos);
  } catch (err) {
    console.error('[cursosController]', err);
    res.status(500).json({ erro: 'Erro ao buscar cursos' });
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
      const termo = `%${escaparLike(busca.trim())}%`;
      query += " AND (titulo LIKE ? ESCAPE '\\' OR descricao LIKE ? ESCAPE '\\' OR plataforma LIKE ? ESCAPE '\\')";
      params.push(termo, termo, termo);
    }

    query += " ORDER BY CASE WHEN plataforma LIKE '%Roadmap.sh%' THEN 0 WHEN plataforma LIKE '%Trilha Info%' THEN 1 ELSE 2 END, titulo ASC";

    const limitParam = req.query.limit || req.query.limite;
    const pageParam = req.query.page || req.query.pagina;
    if (limitParam || pageParam) {
      const limit = Math.min(Math.max(parseInt(limitParam || '100', 10) || 100, 1), 500);
      const page = Math.min(2000, Math.max(parseInt(pageParam || '1', 10) || 1, 1));
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const roadmaps = db.prepare(query).all(...params);
    res.json(roadmaps);
  } catch (err) {
    console.error('[cursosController]', err);
    res.status(500).json({ erro: 'Erro ao buscar roadmaps' });
  }
}

function obterPorId(req, res) {
  try {
    const db = getDatabase();
    const curso = db.prepare('SELECT * FROM cursos WHERE id = ?').get(req.params.id);
    if (!curso) return res.status(404).json({ erro: 'Curso não encontrado' });
    res.json(curso);
  } catch (err) {
    console.error('[cursosController]', err);
    res.status(500).json({ erro: 'Erro ao carregar curso' });
  }
}

function criar(req, res) {
  try {
    const { titulo, area, plataforma, url, licenca, nivel, descricao } = req.body || {};
    if (!titulo || !area || !plataforma || !url) {
      return res.status(400).json({ erro: 'Campos obrigatórios: titulo, area, plataforma, url' });
    }

    let urlValida;
    try {
      urlValida = validarUrlRedirecionamento(url);
    } catch (err) {
      console.error('[cursos.criar] URL inválida:', err.message);
      return res.status(400).json({ erro: 'URL do curso inválida ou não autorizada' });
    }

    const db = getDatabase();
    const result = db.prepare(`
      INSERT INTO cursos (titulo, area, plataforma, url, licenca, nivel, descricao)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      titulo.trim(),
      area.trim(),
      plataforma.trim(),
      urlValida,
      licenca || 'gratuito',
      nivel || 'Iniciante',
      descricao ? descricao.trim() : null
    );

    const novo = db.prepare('SELECT * FROM cursos WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(novo);
  } catch (err) {
    console.error('[cursosController]', err);
    res.status(500).json({ erro: 'Erro ao cadastrar curso' });
  }
}

function remover(req, res) {
  try {
    const db = getDatabase();
    const resDel = db.prepare('DELETE FROM cursos WHERE id = ?').run(req.params.id);
    if (resDel.changes === 0) return res.status(404).json({ erro: 'Curso não encontrado' });
    res.json({ mensagem: 'Curso removido com sucesso' });
  } catch (err) {
    console.error('[cursosController]', err);
    res.status(500).json({ erro: 'Erro ao remover curso' });
  }
}

function acessarRedirect(req, res) {
  try {
    const db = getDatabase();
    const curso = db.prepare('SELECT id, titulo, url FROM cursos WHERE id = ?').get(req.params.id);
    if (!curso) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }
    // Redirecionamento HTTP 302 direto para o curso oficial após validação estrita
    const urlDestino = validarUrlRedirecionamento(curso.url);
    res.redirect(302, urlDestino);
  } catch (err) {
    console.error('[cursosController]', err);
    res.status(500).json({ erro: 'Erro ao redirecionar para o curso' });
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
