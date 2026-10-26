const { getDatabase } = require('../database');

const LIMITE_AUTORES = 100;
const LIMITE_MAXIMO = 500;
const PAGINA_MAXIMA = 2000;

// Escapa os metacaracteres de LIKE. Sem isto, `busca=%a%b%c...` transforma o
// filtro num varrimento com múltiplos wildcards (DoS de CPU na base de dados).
function escaparLike(valor) {
  return String(valor || '').slice(0, 120).replace(/[\\%_]/g, '\\$&');
}

function listar(req, res) {
  try {
    const db = getDatabase();
    const nomeExato = String(req.query.nome || '').trim().slice(0, 120);
    const busca = String(req.query.busca || req.query.q || '').trim().slice(0, 120);
    const limitParam = req.query.limit || req.query.limite;
    const pageParam = req.query.page || req.query.pagina;

    let query = 'SELECT a.* FROM autores a';
    const params = [];

    // Prioriza tabela agregada autor_totais se presente para evitar varredura em livros
    let temTotais = false;
    try {
      temTotais = !!db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='autor_totais'").get();
    } catch (_) {}

    if (temTotais) {
      query = `SELECT a.*, COALESCE(t.total, 0) AS total_livros
               FROM autores a LEFT JOIN autor_totais t ON t.autor_id = a.id`;
    }

    if (nomeExato) {
      // Correspondência exata — usa o índice autores(nome COLLATE NOCASE).
      query += ' WHERE a.nome = ? COLLATE NOCASE';
      params.push(nomeExato);
    } else if (busca) {
      query += " WHERE a.nome LIKE ? ESCAPE '\\'";
      params.push(`%${escaparLike(busca)}%`);
    }

    query += ' ORDER BY a.nome ASC';

    // Limite por omissão: sem ele, a rota devolvia todos os autores numa só
    // resposta (enumeração em massa e leitura desnecessária da base).
    const limit = Math.min(
      Math.max(parseInt(limitParam || String(LIMITE_AUTORES), 10) || LIMITE_AUTORES, 1),
      LIMITE_MAXIMO
    );
    const page = Math.min(
      PAGINA_MAXIMA,
      Math.max(parseInt(pageParam || '1', 10) || 1, 1)
    );
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const autores = db.prepare(query).all(...params);

    // Sem a tabela autor_totais, faz fallback pontual usando idx_livros_autor
    if (!temTotais && autores.length > 0) {
      const ids = autores.map((a) => a.id);
      const marcadores = ids.map(() => '?').join(',');
      const contagens = db.prepare(
        `SELECT autor_id, COUNT(*) AS total FROM livros WHERE autor_id IN (${marcadores}) GROUP BY autor_id`
      ).all(...ids);
      const porAutor = new Map(contagens.map((c) => [Number(c.autor_id), Number(c.total)]));
      for (const autor of autores) autor.total_livros = porAutor.get(Number(autor.id)) || 0;
    }

    res.json(autores);
  } catch (err) {
    console.error('[autoresController]', err);
    res.status(500).json({ erro: 'Erro ao buscar autores' });
  }
}

function obterPorId(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(404).json({ erro: 'Autor não encontrado' });
    }
    const db = getDatabase();
    const autor = db.prepare('SELECT * FROM autores WHERE id = ?').get(id);
    if (!autor) {
      return res.status(404).json({ erro: 'Autor não encontrado' });
    }
    const livros = db.prepare('SELECT id, titulo, ano_publicacao, leituras, capa_url FROM livros WHERE autor_id = ?').all(id);
    res.json({ ...autor, livros });
  } catch (err) {
    console.error('[autoresController]', err);
    res.status(500).json({ erro: 'Erro ao buscar autor' });
  }
}

function criar(req, res) {
  try {
    const { nome, nacionalidade, biografia } = req.body || {};
    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: 'O nome do autor é obrigatório' });
    }
    const db = getDatabase();
    const result = db.prepare('INSERT INTO autores (nome, nacionalidade, biografia) VALUES (?, ?, ?)').run(
      nome.trim(),
      nacionalidade ? nacionalidade.trim() : null,
      biografia ? biografia.trim() : null
    );
    const novo = db.prepare('SELECT * FROM autores WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(novo);
  } catch (err) {
    console.error('[autoresController]', err);
    res.status(500).json({ erro: 'Erro ao cadastrar autor' });
  }
}

function atualizar(req, res) {
  try {
    const { nome, nacionalidade, biografia } = req.body || {};
    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: 'O nome do autor é obrigatório' });
    }
    const db = getDatabase();
    const result = db.prepare('UPDATE autores SET nome = ?, nacionalidade = ?, biografia = ? WHERE id = ?').run(
      nome.trim(),
      nacionalidade ? nacionalidade.trim() : null,
      biografia ? biografia.trim() : null,
      req.params.id
    );
    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Autor não encontrado' });
    }
    const atualizado = db.prepare('SELECT * FROM autores WHERE id = ?').get(req.params.id);
    res.json(atualizado);
  } catch (err) {
    console.error('[autoresController]', err);
    res.status(500).json({ erro: 'Erro ao atualizar autor' });
  }
}

function remover(req, res) {
  try {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM autores WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Autor não encontrado' });
    }
    res.json({ mensagem: 'Autor removido com sucesso' });
  } catch (err) {
    console.error('[autoresController]', err);
    res.status(500).json({ erro: 'Erro ao remover autor' });
  }
}

module.exports = {
  listar,
  obterPorId,
  criar,
  atualizar,
  remover
};
