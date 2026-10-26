/**
 * Query Builders puros para o catálogo de livros e anexo de links.
 * Compartilhado entre Express e serviços de busca. Zero I/O.
 */

function buildFiltrosLivros(query = {}, dimensoes = { categorias: [], fontes: [] }, sanitizarFts = null) {
  const { busca, autor_id, categoria_id, idioma, licenca, formato, fonte, fonte_slug, colecao } = query;
  const filtros = [];
  const params = [];

  // 1. Busca FTS5 se fornecida e houver sanitizador
  if (busca && String(busca).trim() && typeof sanitizarFts === 'function') {
    const matchQuery = sanitizarFts(String(busca).trim());
    if (matchQuery) {
      filtros.push(`l.id IN (
        SELECT rowid FROM livros_fts WHERE livros_fts MATCH ?
      )`);
      params.push(matchQuery);
    }
  }

  // 2. Coleção Top 100
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
      const ids = (dimensoes.categorias || [])
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
    const fontesDisponiveis = dimensoes.fontes || [];
    let ids = fontesDisponiveis.filter((f) => f.slug.toLowerCase() === termo).map((f) => f.id);
    if (ids.length === 0) {
      ids = fontesDisponiveis.filter((f) => f.slug.toLowerCase().includes(termo)).map((f) => f.id);
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

  const orderByClause = isTop100
    ? `CASE 
         WHEN l.fonte_id_externo LIKE 'world-hist-%' THEN 0 
         WHEN l.fonte_id_externo LIKE 'world-top100-%' THEN CAST(SUBSTR(l.fonte_id_externo, 14) AS INTEGER) 
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

  const selectSql = `
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

  return {
    filtros,
    params,
    whereSql,
    isTop100,
    fonteIds,
    fonteFiltro,
    selectSql
  };
}

function anexarLinksAosLivros(livros, linksBrutos, normalizarUrlFn = (u) => u, normalizarCapaFn = (u) => u) {
  if (!livros || livros.length === 0) return [];
  const linksPorLivro = {};
  for (const link of (linksBrutos || [])) {
    if (!linksPorLivro[link.livro_id]) linksPorLivro[link.livro_id] = [];
    linksPorLivro[link.livro_id].push({
      id: link.id,
      formato: link.formato,
      url: normalizarUrlFn(link.url),
      tamanho_bytes: link.tamanho_bytes,
      link_externo: link.link_externo
    });
  }
  for (const livro of livros) {
    livro.capa_url = normalizarCapaFn(livro.capa_url);
    livro.links = linksPorLivro[livro.id] || [];
  }
  return livros;
}

module.exports = {
  buildFiltrosLivros,
  anexarLinksAosLivros
};
