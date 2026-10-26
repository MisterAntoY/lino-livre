const { getDatabase } = require('../../database');
const { sanitizarFts5 } = require('../../utils/sanitizer');
const { 
  PAGINA_MAXIMA, 
  normalizarCapaUrl, 
  normalizarUrlSegura, 
  obterDimensoes 
} = require('./livrosHelpers');

function listar(req, res) {
  try {
    const db = getDatabase();
    const { 
      busca, categoria_id, autor_id, idioma, formato, licenca, fonte, fonte_slug, colecao
    } = req.query;

    const rawPage = req.query.pagina || req.query.page || 1;
    const rawLimit = req.query.limite || req.query.limit || 24;

    const numPage = Math.min(PAGINA_MAXIMA, Math.max(1, parseInt(rawPage, 10) || 1));
    const numLimit = Math.min(100, Math.max(1, parseInt(rawLimit, 10) || 24));
    const offset = (numPage - 1) * numLimit;

    // Filtros aplicados exclusivamente sobre livros (sem JOINs e sem LIKE).
    // Permite COUNT(*) — em vez de COUNT(DISTINCT l.id) — e o uso dos índices
    // compostos de popularidade (leituras DESC, titulo ASC).
    const filtros = [];
    const params = [];

    // Busca FTS5 se o termo de busca for informado
    if (busca && busca.trim()) {
      const matchQuery = sanitizarFts5(busca);
      if (matchQuery) {
        filtros.push(`l.id IN (
          SELECT rowid FROM livros_fts WHERE livros_fts MATCH ?
        )`);
        params.push(matchQuery);
      }
    }

    const isTop100 = (categoria_id && (
      categoria_id === '🌟 Mais Lidos do Mundo' ||
      categoria_id === 'Mais Lidos do Mundo' ||
      String(categoria_id).includes('Mais Lidos') ||
      categoria_id === 'top100' ||
      categoria_id === 'mais_lidos'
    )) || (colecao === 'top100' || colecao === 'mais_lidos');

    if (isTop100) {
      filtros.push("(l.fonte_id_externo LIKE 'world-%')");
    } else if (categoria_id) {
      if (/^\d+$/.test(categoria_id)) {
        filtros.push('l.categoria_id = ?');
        params.push(categoria_id);
      } else {
        const ids = obterDimensoes(db).categorias
          .filter((cat) => cat.nome === categoria_id)
          .map((cat) => cat.id);
        if (ids.length === 0) {
          filtros.push('1=0');
        } else {
          filtros.push(`l.categoria_id IN (${ids.map(() => '?').join(',')})`);
          params.push(...ids);
        }
      }
    }

    if (autor_id) {
      filtros.push('l.autor_id = ?');
      params.push(autor_id);
    }

    if (idioma) {
      filtros.push('l.idioma = ?');
      params.push(idioma);
    }

    if (licenca) {
      filtros.push('l.licenca = ?');
      params.push(licenca);
    }

    const fonteFiltro = fonte_slug || fonte;
    let fonteIds = [];
    if (fonteFiltro) {
      const termo = String(fonteFiltro).toLowerCase();
      const dim = obterDimensoes(db);
      let ids = dim.fontes.filter((f) => f.slug.toLowerCase() === termo).map((f) => f.id);
      if (ids.length === 0) {
        ids = dim.fontes.filter((f) => f.slug.toLowerCase().includes(termo)).map((f) => f.id);
      }
      fonteIds = ids;
      if (ids.length === 0) {
        filtros.push('1=0');
      } else {
        filtros.push(`l.fonte_id IN (${ids.map(() => '?').join(',')})`);
        params.push(...ids);
      }
    }

    if (formato) {
      filtros.push('l.id IN (SELECT livro_id FROM links_livros WHERE formato = ?)');
      params.push(formato.toLowerCase());
    }

    const whereSql = filtros.length ? ` AND ${filtros.join(' AND ')}` : '';

    // Total para paginação: usa agregados pré-calculados quando o filtro é
    // simples (evita varrer 104k linhas). Fallback seguro se as tabelas
    // estatisticas/contadores ainda não existirem.
    let total = null;
    try {
      const semSubquery = filtros.filter((f) => !f.startsWith('l.id IN'));
      const simples = !busca && !formato;
      if (filtros.includes('1=0')) {
        total = 0;
      } else if (simples && semSubquery.length === 0) {
        const r = db.prepare("SELECT valor FROM estatisticas WHERE chave = 'total_livros'").get();
        if (r) total = Number(r.valor);
      } else if (simples && semSubquery.length === 1 && idioma) {
        const r = db.prepare("SELECT total FROM contadores WHERE dimensao = 'idioma' AND chave = ?").get(idioma);
        if (r) total = Number(r.total);
      } else if (simples && semSubquery.length === 1 && licenca) {
        const r = db.prepare("SELECT total FROM contadores WHERE dimensao = 'licenca' AND chave = ?").get(licenca);
        if (r) total = Number(r.total);
      } else if (simples && semSubquery.length === 1 && categoria_id && /^\d+$/.test(categoria_id)) {
        const r = db.prepare("SELECT total FROM contadores WHERE dimensao = 'categoria' AND chave = ?").get(String(categoria_id));
        if (r) total = Number(r.total);
      } else if (simples && semSubquery.length === 1 && fonteFiltro && fonteIds.length === 1) {
        const r = db.prepare("SELECT total FROM contadores WHERE dimensao = 'fonte' AND chave = ?").get(String(fonteIds[0]));
        if (r) total = Number(r.total);
      }
    } catch (_) {
      // Agregados indisponíveis: segue para a contagem exata.
    }
    if (total === null) {
      const totalRow = db.prepare(`SELECT COUNT(*) AS total FROM livros l WHERE 1=1${whereSql}`).get(...params);
      total = totalRow ? totalRow.total : 0;
    }

    const orderByClause = isTop100
      ? `CASE 
           WHEN l.fonte_id_externo LIKE 'world-hist-%' THEN CAST(SUBSTR(l.fonte_id_externo, 12) AS INTEGER) 
           WHEN l.fonte_id_externo LIKE 'world-top100-%' THEN 1000 + CAST(SUBSTR(l.fonte_id_externo, 14) AS INTEGER) 
           ELSE 9999 
         END ASC, l.leituras DESC, l.titulo ASC`
      : `l.leituras DESC, 
         CASE 
           WHEN l.fonte_id_externo LIKE 'world-hist-%' THEN 1 
           WHEN l.fonte_id_externo LIKE 'world-top100-%' THEN 2 
           WHEN l.categoria_id = 1 THEN 3 
           WHEN l.categoria_id = 19 THEN 4 
           WHEN l.categoria_id = 16 THEN 5 
           WHEN l.categoria_id = 12 THEN 6 
           ELSE 10 
         END ASC, 
         CASE 
           WHEN l.fonte_id_externo LIKE 'world-hist-%' THEN CAST(SUBSTR(l.fonte_id_externo, 12) AS INTEGER) 
           WHEN l.fonte_id_externo LIKE 'world-top100-%' THEN CAST(SUBSTR(l.fonte_id_externo, 14) AS INTEGER) 
           ELSE l.id 
         END ASC, 
         l.titulo ASC`;

    // Buscar itens paginados
    const selectQuery = `
      SELECT 
        l.id, l.titulo, l.subtitulo, l.isbn, l.ano_publicacao, l.idioma,
        l.sinopse, l.capa_url, l.paginas, l.licenca, l.leituras, l.criado_em,
        l.fonte_id_externo,
        a.id AS autor_id, a.nome AS autor_nome,
        c.id AS categoria_id, c.nome AS categoria_nome,
        f.slug AS fonte_slug, f.nome AS fonte_nome
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      LEFT JOIN fontes f ON f.id = l.fonte_id
      WHERE 1=1${whereSql}
      ORDER BY ${orderByClause}
      LIMIT ? OFFSET ?
    `;

    const livros = db.prepare(selectQuery).all(...params, numLimit, offset);

    // Anexar links para cada livro (otimizado: busca única em vez de N+1 queries)
    if (livros.length > 0) {
      const placeholders = livros.map(() => '?').join(',');
      const links = db.prepare(`
        SELECT livro_id, id, formato, url, tamanho_bytes, link_externo
        FROM links_livros
        WHERE livro_id IN (${placeholders})
      `).all(...livros.map(l => l.id));
      
      const linksPorLivro = {};
      for (const link of links) {
        if (!linksPorLivro[link.livro_id]) linksPorLivro[link.livro_id] = [];
        linksPorLivro[link.livro_id].push({
          id: link.id,
          formato: link.formato,
          url: normalizarUrlSegura(link.url),
          tamanho_bytes: link.tamanho_bytes,
          link_externo: link.link_externo
        });
      }
      for (const livro of livros) {
        livro.capa_url = normalizarCapaUrl(livro.capa_url);
        livro.links = linksPorLivro[livro.id] || [];
      }
    } else {
      for (const livro of livros) {
        livro.capa_url = normalizarCapaUrl(livro.capa_url);
      }
    }

    res.json({
      page: numPage,
      pagina: numPage,
      limit: numLimit,
      limite: numLimit,
      total,
      total_pages: Math.ceil(total / numLimit),
      total_paginas: Math.ceil(total / numLimit),
      data: livros
    });
  } catch (err) {
    console.error('[livros.listar]', err);
    res.status(500).json({ erro: 'Erro interno ao buscar livros' });
  }
}

module.exports = { listar };
