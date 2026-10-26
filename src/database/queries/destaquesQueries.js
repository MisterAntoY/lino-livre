/**
 * Query Builders puros para destaques e coleções históricas.
 * Zero I/O — compartilhado entre Express e Cloudflare Workers.
 */

function buildDestaquesQuery(tipoParam = 'todos', limitParam = 12) {
  const tipo = String(tipoParam || 'todos').toLowerCase();
  const limit = Math.min(50, Math.max(1, parseInt(limitParam, 10) || 12));

  let whereSql = '';
  let orderBySql = '';
  const params = [];

  if (tipo === 'lusofonia' || tipo === 'classicos') {
    whereSql = 'WHERE (l.categoria_id IN (1, 19) OR l.id IN (1, 2, 3, 4, 5, 828, 838))';
    orderBySql = 'ORDER BY l.leituras DESC, l.id ASC';
  } else if (tipo === 'africa') {
    whereSql = "WHERE (l.categoria_id IN (12, 13, 14, 15, 16, 17, 18) OR l.fonte_id_externo LIKE 'africa-%')";
    orderBySql = 'ORDER BY l.leituras DESC, l.id ASC';
  } else if (tipo === 'tech' || tipo === 'tecnologia') {
    whereSql = "WHERE (l.categoria_id IN (6, 7, 8, 9, 10, 11) OR l.fonte_id_externo LIKE 'github-%')";
    orderBySql = 'ORDER BY l.leituras DESC, l.id ASC';
  } else {
    // 'todos' ou 'mundo': Obras Mais Populares e Procuradas da História
    whereSql = `WHERE (
      l.fonte_id_externo LIKE 'world-hist-%' 
      OR l.fonte_id_externo LIKE 'world-top100-%'
      OR l.id IN (1, 2, 3)
    )`;
    orderBySql = `ORDER BY 
      CASE 
        WHEN l.fonte_id_externo LIKE 'world-hist-%' THEN CAST(SUBSTR(l.fonte_id_externo, 12) AS INTEGER) 
        WHEN l.fonte_id_externo LIKE 'world-top100-%' THEN 10 + CAST(SUBSTR(l.fonte_id_externo, 14) AS INTEGER) 
        WHEN l.id = 1 THEN 11 
        WHEN l.id = 2 THEN 12 
        ELSE 999 
      END ASC,
      l.leituras DESC, l.titulo ASC`;
  }

  const sql = `
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
    ${whereSql}
    ${orderBySql}
    LIMIT ?
  `;

  return { sql, params, limit };
}

module.exports = {
  buildDestaquesQuery
};
