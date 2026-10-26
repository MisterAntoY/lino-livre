/**
 * Query Builders puros para o catálogo de cursos e roadmaps.
 * Zero dependências de banco e zero I/O — 100% testável.
 */

function escaparLike(valor) {
  return String(valor || '').slice(0, 120).replace(/[\\%_]/g, '\\$&');
}

function buildCursosQuery(filtros = {}) {
  const { area, nivel, plataforma, fonte, busca, youtube, certificado, tipo, excluir_roadmaps, licenca } = filtros;

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
  if (excluir_roadmaps === '1' || excluir_roadmaps === 'true' || excluir_roadmaps === true) {
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
  } else if (fonte && (String(fonte).toLowerCase() === 'guiadeti' || String(fonte).toLowerCase() === 'guia de ti')) {
    query += ' AND plataforma LIKE ?';
    params.push('%Guia de TI%');
  }
  if (youtube === '1' || youtube === 'true' || youtube === true || (plataforma && String(plataforma).toLowerCase() === 'youtube')) {
    query += ' AND plataforma LIKE ?';
    params.push('%YouTube%');
  }
  if (certificado === 'gratuito' || certificado === '1' || certificado === 'true' || certificado === true) {
    query += " AND (instr(LOWER(descricao), 'certifica') > 0 OR instr(LOWER(plataforma), 'certifica') > 0)";
  }
  if (busca && String(busca).trim()) {
    const termo = `%${escaparLike(String(busca).trim())}%`;
    query += " AND (titulo LIKE ? ESCAPE '\\' OR descricao LIKE ? ESCAPE '\\' OR plataforma LIKE ? ESCAPE '\\')";
    params.push(termo, termo, termo);
  }

  // Guia de TI no topo por igualdade estrita, ordenação estável por id
  query += " ORDER BY CASE WHEN plataforma = 'Guia de TI' THEN 0 ELSE 1 END, id ASC";

  const limitParam = filtros.limit || filtros.limite;
  const pageParam = filtros.page || filtros.pagina;
  if (limitParam || pageParam) {
    const limit = Math.min(Math.max(parseInt(limitParam || '100', 10) || 100, 1), 500);
    const page = Math.min(2000, Math.max(parseInt(pageParam || '1', 10) || 1, 1));
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
  }

  return { sql: query, params };
}

function buildRoadmapsQuery(filtros = {}) {
  const { busca, plataforma, area } = filtros;
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
  if (busca && String(busca).trim()) {
    const termo = `%${escaparLike(String(busca).trim())}%`;
    query += " AND (titulo LIKE ? ESCAPE '\\' OR descricao LIKE ? ESCAPE '\\' OR plataforma LIKE ? ESCAPE '\\')";
    params.push(termo, termo, termo);
  }

  query += " ORDER BY CASE WHEN plataforma = 'Roadmap.sh' THEN 0 WHEN plataforma = 'Trilha Info' THEN 1 ELSE 2 END, titulo ASC";

  const limitParam = filtros.limit || filtros.limite;
  const pageParam = filtros.page || filtros.pagina;
  if (limitParam || pageParam) {
    const limit = Math.min(Math.max(parseInt(limitParam || '100', 10) || 100, 1), 500);
    const page = Math.min(2000, Math.max(parseInt(pageParam || '1', 10) || 1, 1));
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
  }

  return { sql: query, params };
}

module.exports = {
  escaparLike,
  buildCursosQuery,
  buildRoadmapsQuery
};
