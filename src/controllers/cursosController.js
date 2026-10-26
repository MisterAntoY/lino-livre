const { getDatabase } = require('../database');
const { validarUrlRedirecionamento } = require('../utils/urlValidator');
const { buildCursosQuery, buildRoadmapsQuery, escaparLike } = require('../database/queries/cursosQueries');

function listar(req, res) {
  try {
    const db = getDatabase();
    const { sql, params } = buildCursosQuery(req.query);
    const cursos = db.prepare(sql).all(...params);
    res.json(cursos);
  } catch (err) {
    console.error('[cursosController]', err);
    res.status(500).json({ erro: 'Erro ao buscar cursos' });
  }
}

function listarRoadmaps(req, res) {
  try {
    const db = getDatabase();
    const { sql, params } = buildRoadmapsQuery(req.query);
    const roadmaps = db.prepare(sql).all(...params);
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
