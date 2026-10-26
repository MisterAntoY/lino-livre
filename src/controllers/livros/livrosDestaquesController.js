const { getDatabase } = require('../../database');
const { normalizarCapaUrl, normalizarUrlSegura } = require('./livrosHelpers');

function gerarDestaqueBadge(livro) {
  if (!livro) return '⭐ Muito Procurado';
  const fExt = livro.fonte_id_externo || '';
  if (fExt === 'world-hist-1') return '🔥 #1 Mais Lido da História';
  if (fExt === 'world-hist-2') return '🔥 > 500M de Leitores';
  if (fExt === 'world-hist-3') return '📜 Tratado Histórico';
  if (fExt === 'world-hist-4') return '📖 Livro Histórico';
  if (fExt === 'world-hist-5') return '📖 Texto Sagrado Histórico';
  if (fExt === 'world-top100-1') return '⭐ > 200M de Cópias';
  if (fExt === 'world-top100-2') return '⭐ > 150M de Cópias';
  if (fExt === 'world-top100-3') return '🌟 > 140M de Leitores';
  if (fExt === 'world-top100-4') return '⭐ > 120M de Leitores';
  if (fExt === 'world-top100-5') return '⭐ > 100M de Cópias';
  if (fExt === 'world-top100-6') return '⭐ > 100M de Leitores';
  if (fExt === 'world-top100-7') return '⭐ > 100M de Leitores';
  if (fExt === 'world-top100-8') return '⭐ > 100M de Leitores';
  if (fExt === 'world-top100-11') return '⭐ > 80M de Leitores';
  if (fExt === 'world-top100-13') return '⭐ > 65M de Cópias';
  if (fExt === 'world-top100-14') return '⭐ > 50M de Cópias';
  if (fExt === 'world-top100-15') return '🌟 Distopia Universal';
  if (fExt === 'world-top100-17') return '🌟 Clássico Universal';

  const tit = (livro.titulo || '').toLowerCase();
  if (tit.includes('casmurro')) return '🏆 Obra-Prima da Lusofonia';
  if (tit.includes('brás cubas') || tit.includes('bras cubas')) return '📜 Marco do Realismo';
  if (tit.includes('lusíadas') || tit.includes('lusiadas')) return '⚓ Epopeia Nacional';
  if (tit.includes('cortiço') || tit.includes('cortico')) return '🏛️ Clássico do Naturalismo';
  if (tit.includes('iracema')) return '🌿 Clássico Indianista';
  if (tit.includes('mensagem')) return '📜 O Grande Épico Moderno';
  if (tit.includes('cidade e as serras')) return '📖 Clássico Realista';
  if (tit.includes('alienista')) return '🎭 Sátira Genial';

  if (livro.categoria_id === 1 || livro.categoria_id === 19) return '📜 Clássico Universal';
  if (livro.categoria_id >= 12 && livro.categoria_id <= 18) return '🌍 Tesouro de África';
  if (livro.categoria_id >= 6 && livro.categoria_id <= 11) return '💻 Manual de Referência';
  return '⭐ Muito Procurado';
}

function destaques(req, res) {
  try {
    const db = getDatabase();
    const tipo = (req.query.tipo || 'todos').toLowerCase();
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limite || req.query.limit || 12, 10)));

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
      ${whereSql}
      ${orderBySql}
      LIMIT ?
    `;

    const livros = db.prepare(selectQuery).all(...params, limit);

    // Anexar links
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
        livro.destaque_badge = gerarDestaqueBadge(livro);
      }
    } else {
      for (const livro of livros) {
        livro.capa_url = normalizarCapaUrl(livro.capa_url);
      }
    }

    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    return res.json({
      status: 'ok',
      tipo,
      total: livros.length,
      data: livros
    });
  } catch (err) {
    console.error('[livros.destaques]', err);
    return res.status(500).json({ erro: 'Erro ao obter livros em destaque' });
  }
}

module.exports = {
  destaques,
  gerarDestaqueBadge
};
