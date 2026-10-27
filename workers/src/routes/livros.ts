import { Hono } from 'hono';
import { Bindings } from '../types';
import { DIMENSOES_ESTATICAS, LICENCAS_VALIDAS } from '../data/constants';
import { FALLBACK_LIVROS, obterLinkFallback } from '../data/fallbackLivros';
import { obterRepo, ehErroDeCota, respostaDegradada, obterRepoSupabase } from '../utils/repoHelper';
import {
  escaparLike,
  normalizarCapaUrl,
  normalizarUrlSegura,
  registrarMutacaoAcervo,
  tabelaExiste,
  sanitizarFts5,
  lerContador,
  lerEstatistica,
  contarNaFts
} from '../utils/sqlHelpers';
import { validarUrlRedirecionamento, verificarUrlConformidade } from '../utils/urlValidator';
import { livrosLruCache } from '../utils/lruCache';
import { verificarAdminWorker, limitarRequisicao } from '../middlewares/security';
import { edgeLoadBalancer } from '../loadBalancer';

export const livrosRouter = new Hono<{ Bindings: Bindings }>();

let cacheDimensoes: { fontes: any[]; categorias: any[]; timestamp: number } | null = null;
const DIMENSOES_CACHE_TTL = 30 * 60 * 1000;

async function obterDimensoes(db: any) {
  if (cacheDimensoes && Date.now() - cacheDimensoes.timestamp < DIMENSOES_CACHE_TTL) {
    return cacheDimensoes;
  }
  try {
    const [fontes, categorias] = await Promise.all([
      db.prepare('SELECT id, slug FROM fontes').all(),
      db.prepare('SELECT id, nome FROM categorias').all()
    ]);
    const fList = (fontes?.results || []) as { id: number; slug: string }[];
    const cList = (categorias?.results || []) as { id: number; nome: string }[];
    cacheDimensoes = {
      fontes: fList.length > 0 ? fList : DIMENSOES_ESTATICAS.fontes,
      categorias: cList.length > 0 ? cList : DIMENSOES_ESTATICAS.categorias,
      timestamp: Date.now()
    };
  } catch {
    cacheDimensoes = {
      fontes: DIMENSOES_ESTATICAS.fontes,
      categorias: DIMENSOES_ESTATICAS.categorias,
      timestamp: Date.now()
    };
  }
  return cacheDimensoes;
}

function gerarDestaqueBadge(livro: any): string {
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

livrosRouter.get('/api/livros/destaques', async (c) => {
  const queryParams = c.req.query();
  const tipo = (queryParams.tipo || 'todos').toLowerCase();
  const limit = Math.min(50, Math.max(1, parseInt(queryParams.limite || queryParams.limit || '12', 10)));

  try {
    const db = c.env.DB;
    if (!db) return c.json({ status: 'ok', tipo, total: 0, data: [] });

    let whereSql = '';
    let orderBySql = '';
    const params: any[] = [];

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

    const livros = (await db.prepare(selectQuery).bind(...params, limit).all()).results as any[];

    if (livros.length > 0) {
      const ids = livros.map(l => l.id);
      const placeholders = ids.map(() => '?').join(',');
      const links = (await db.prepare(`
        SELECT livro_id, id, formato, url, tamanho_bytes, link_externo
        FROM links_livros
        WHERE livro_id IN (${placeholders})
      `).bind(...ids).all()).results as any[];

      const linksPorLivro: Record<number, any[]> = {};
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

    c.header('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    return c.json({
      status: 'ok',
      tipo,
      total: livros.length,
      data: livros
    });
  } catch (err: any) {
    if (ehErroDeCota(err)) {
      c.header('X-Data-Status', 'degraded');
      c.header('Cache-Control', 'public, max-age=60');
      let filtrados = FALLBACK_LIVROS.map((l) => ({ ...l, destaque_badge: gerarDestaqueBadge(l) }));
      if (tipo === 'lusofonia' || tipo === 'classicos') {
        filtrados = filtrados.filter((l) => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(l.id));
      }
      return c.json({
        status: 'ok',
        tipo,
        total: filtrados.length,
        data: filtrados.slice(0, limit)
      });
    }
    console.error('Erro ao obter livros em destaque:', err);
    return c.json({ erro: 'Erro ao obter livros em destaque' }, 500);
  }
});

livrosRouter.get('/api/livros', async (c) => {
  const queryParams = c.req.query();
  const rawPage = queryParams.pagina || queryParams.page || '1';
  const rawLimit = queryParams.limite || queryParams.limit || '24';
  const numPage = Math.max(1, parseInt(rawPage, 10) || 1);
  const numLimit = Math.min(100, Math.max(1, parseInt(rawLimit, 10) || 24));
  const { busca, categoria_id, autor_id, idioma, formato, licenca, fonte, fonte_slug, colecao } = queryParams;

  // Guardrail de Paginação Profunda: previne varreduras de offset não-indexadas (scrapers/bots).
  // Navegações gerais sem filtro são limitadas às primeiras 50 páginas (1.200 livros).
  // Para explorar o restante do acervo de 104k obras, exige-se busca textual ou filtros temáticos.
  const temFiltroEspecifico = !!(busca || categoria_id || autor_id || idioma || formato || licenca || fonte || fonte_slug || colecao);
  const MAX_PAGINA_LIVRE = 50;
  if (!temFiltroEspecifico && numPage > MAX_PAGINA_LIVRE) {
    c.header('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return c.json({
      page: numPage,
      pagina: numPage,
      limit: numLimit,
      limite: numLimit,
      total: 104848,
      total_pages: Math.ceil(104848 / numLimit),
      total_paginas: Math.ceil(104848 / numLimit),
      aviso: 'Navegação sequencial no catálogo geral limitada a 50 páginas. Para explorar o acervo completo, utilize a busca ou selecione uma categoria/idioma.',
      data: []
    });
  }
  const offset = (numPage - 1) * numLimit;
  const cacheKey = `${numPage}:${numLimit}:${busca || ''}:${categoria_id || ''}:${autor_id || ''}:${idioma || ''}:${formato || ''}:${licenca || ''}:${fonte || ''}:${fonte_slug || ''}:${colecao || ''}`;
  const hit = livrosLruCache.get(cacheKey);
  if (hit) {
    c.header('Cache-Control', 'public, max-age=600, stale-while-revalidate=3600');
    c.header('X-Cache', 'HIT');
    return c.json(hit);
  }

  try {
    const { d1, supabase, backendMode } = obterRepo(c);
    const { primary } = edgeLoadBalancer.pickBackend(!!supabase);

    if (primary === 'supabase' && supabase) {
      try {
        const payload = await supabase.livros({
          page: numPage,
          limit: numLimit,
          busca,
          categoria: categoria_id,
          autor: autor_id,
          idioma,
          licenca,
          fonte: fonte_slug || fonte,
          formato,
          colecao
        });
        edgeLoadBalancer.recordSuccess('supabase', 0);
        livrosLruCache.set(cacheKey, payload);
        c.header('Cache-Control', 'public, max-age=600, stale-while-revalidate=3600');
        c.header('X-Data-Backend', 'supabase');
        c.header('X-Cache', 'MISS');
        return c.json(payload);
      } catch (err) {
        edgeLoadBalancer.recordFailure('supabase', err);
        console.error('Supabase livros falhou; a usar D1:', err);
      }
    }

    const db = c.env.DB;

    // Filtros aplicados exclusivamente sobre livros (sem JOINs e sem LIKE).
    // Isso permite COUNT(*) — em vez de COUNT(DISTINCT l.id) sobre 104k linhas —
    // e deixa o planejador usar os índices compostos de popularidade.
    const filtros: string[] = [];
    const params: any[] = [];
    const matchFts = sanitizarFts5(busca);

    if (matchFts) {
      filtros.push(`l.id IN (
        SELECT rowid FROM livros_fts WHERE livros_fts MATCH ?
      )`);
      params.push(matchFts);
    }

    const catDecoded = categoria_id ? decodeURIComponent(String(categoria_id)) : '';
    const isTop100 = (categoria_id && (
      catDecoded === '🌟 Mais Lidos do Mundo' ||
      catDecoded === 'Mais Lidos do Mundo' ||
      catDecoded.includes('Mais Lidos') ||
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
        const dim = await obterDimensoes(db);
        const ids = dim.categorias.filter((cat) => cat.nome === categoria_id).map((cat) => cat.id);
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
    let fonteIds: number[] = [];
    if (fonteFiltro) {
      const termo = String(fonteFiltro).toLowerCase();
      const dim = await obterDimensoes(db);
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

    // Total a partir dos agregados quando o filtro é simples. Só cai no
    // COUNT(*) (varredura de 104k linhas) para combinações de filtros.
    let totalConhecido: number | null = null;
    const temBusca = !!matchFts;
    const temFormato = !!formato;
    const filtrosDiretos = filtros.filter((f) => !f.startsWith('l.id IN'));
    if (filtros.includes('1=0')) {
      totalConhecido = 0;
    } else if (isTop100 && !temBusca) {
      totalConhecido = 105;
    } else if (temBusca && !temFormato && filtrosDiretos.length === 0) {
      // Busca pura: a FTS tem uma linha por livro, logo o COUNT do MATCH é
      // o total — lê ~10 linhas em vez de varrer os 104.848 livros.
      // Passa-se o termo cru: é sanitizado dentro de contarNaFts, tal como
      // na consulta principal, para o total e os resultados coincidirem.
      totalConhecido = await contarNaFts(db, String(busca || ''));
    } else if (temFormato && !temBusca && filtrosDiretos.length === 0) {
      // Formato puro: contador pré-computado (cron diário).
      totalConhecido = await lerContador(db, 'formato', String(formato).toLowerCase());
    } else if (temBusca || temFormato) {
      // Busca/formato combinados com outros filtros: contagem própria.
      totalConhecido = null;
    } else if (filtrosDiretos.length === 0) {
      totalConhecido = await lerEstatistica(db, 'total_livros');
    } else if (filtrosDiretos.length === 1) {
      if (idioma) totalConhecido = await lerContador(db, 'idioma', idioma);
      else if (licenca) totalConhecido = await lerContador(db, 'licenca', licenca);
      else if (categoria_id && /^\d+$/.test(categoria_id)) totalConhecido = await lerContador(db, 'categoria', categoria_id);
      else if (fonteFiltro && fonteIds.length === 1) totalConhecido = await lerContador(db, 'fonte', String(fonteIds[0]));
    }

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

    const livros = (await db.prepare(selectQuery).bind(...params, numLimit, offset).all()).results as any[];

    if (livros.length > 0) {
      const ids = livros.map(l => l.id);
      const placeholders = ids.map(() => '?').join(',');
      const links = (await db.prepare(`
        SELECT livro_id, id, formato, url, tamanho_bytes, link_externo
        FROM links_livros
        WHERE livro_id IN (${placeholders})
      `).bind(...ids).all()).results as any[];

      const linksPorLivro: Record<number, any[]> = {};
      for (const link of links) {
        if (!linksPorLivro[link.livro_id]) linksPorLivro[link.livro_id] = [];
        linksPorLivro[link.livro_id].push({
          ...link,
          url: normalizarUrlSegura(link.url)
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

    let total: number;
    if (totalConhecido !== null) {
      total = totalConhecido;
    } else if (numPage === 1 && livros.length < numLimit) {
      // Primeira página com menos itens que o limite: total exato com ZERO linhas lidas adicionais da D1
      total = livros.length;
    } else {
      try {
        // Bounded count: escaneia no máximo 500 registros em vez de 104.848.
        // Impede estourar o limite diário da D1 e reduz latência em até 99.8%.
        const tetoBusca = Math.max(offset + numLimit + 1, 500);
        const countStmt = db.prepare(`SELECT COUNT(*) AS total FROM (SELECT 1 FROM livros l WHERE 1=1${whereSql} LIMIT ?)`)
          .bind(...params, tetoBusca);
        const subTotal = Number((await countStmt.first<{ total: number }>())?.total || 0);

        if (subTotal < tetoBusca) {
          total = subTotal;
        } else {
          // Se excedeu 500, calcula limite superior derivado dos contadores pré-computados
          let menorContador: number | null = null;
          if (idioma) {
            const cId = await lerContador(db, 'idioma', idioma);
            if (cId !== null) menorContador = menorContador !== null ? Math.min(menorContador, cId) : cId;
          }
          if (licenca) {
            const cLic = await lerContador(db, 'licenca', licenca);
            if (cLic !== null) menorContador = menorContador !== null ? Math.min(menorContador, cLic) : cLic;
          }
          if (categoria_id && /^\d+$/.test(categoria_id)) {
            const cCat = await lerContador(db, 'categoria', categoria_id);
            if (cCat !== null) menorContador = menorContador !== null ? Math.min(menorContador, cCat) : cCat;
          }
          if (fonteFiltro && fonteIds.length === 1) {
            const cFte = await lerContador(db, 'fonte', String(fonteIds[0]));
            if (cFte !== null) menorContador = menorContador !== null ? Math.min(menorContador, cFte) : cFte;
          }
          total = menorContador !== null ? menorContador : offset + livros.length + (livros.length === numLimit ? numLimit : 0);
        }
      } catch {
        // Cota da D1 esgotada em filtros complexos: estima para não quebrar a UI.
        total = offset + livros.length + (livros.length === numLimit ? 1 : 0);
      }
    }

    const payload = {
      page: numPage,
      pagina: numPage,
      limit: numLimit,
      limite: numLimit,
      total,
      total_pages: Math.ceil(total / numLimit),
      total_paginas: Math.ceil(total / numLimit),
      data: livros
    };
    livrosLruCache.set(cacheKey, payload);
    c.header('Cache-Control', 'public, max-age=600, stale-while-revalidate=3600');
    c.header('X-Cache', 'MISS');
    return c.json(payload);
  } catch (err: any) {
    edgeLoadBalancer.recordFailure('d1', err);
    // Recupera assim que a cota reiniciar (00:00 UTC), sem ficar preso em cache.
    c.header('Cache-Control', 'public, max-age=60');
    c.header('X-Data-Status', 'degraded');
    const repoFallback = obterRepoSupabase(c.env);
    if (repoFallback) {
      try {
        const payload = await repoFallback.livros({
          page: numPage,
          limit: numLimit,
          busca,
          categoria: categoria_id,
          autor: autor_id,
          idioma,
          licenca,
          fonte: fonte_slug || fonte,
          formato,
          colecao
        });
        edgeLoadBalancer.recordSuccess('supabase', 0);
        c.header('X-Data-Backend', 'supabase');
        return c.json(payload);
      } catch (supaErr) {
        edgeLoadBalancer.recordFailure('supabase', supaErr);
        console.error('[worker] Supabase fallback para livros falhou:', supaErr);
      }
    }

    const catDecoded = categoria_id ? decodeURIComponent(String(categoria_id)) : '';
    const isTop100 = (categoria_id && (
      catDecoded === '🌟 Mais Lidos do Mundo' ||
      catDecoded === 'Mais Lidos do Mundo' ||
      catDecoded.includes('Mais Lidos') ||
      categoria_id === 'top100' ||
      categoria_id === 'mais_lidos'
    )) || (colecao === 'top100' || colecao === 'mais_lidos');

    let filtrados = [...FALLBACK_LIVROS];
    if (busca) {
      const q = busca.toLowerCase();
      filtrados = filtrados.filter(l =>
        (l.titulo && l.titulo.toLowerCase().includes(q)) ||
        (l.autor_nome && l.autor_nome.toLowerCase().includes(q)) ||
        (l.sinopse && l.sinopse.toLowerCase().includes(q))
      );
    }
    if (categoria_id) {
      if (/^\d+$/.test(categoria_id)) {
        const catNum = Number(categoria_id);
        filtrados = filtrados.filter(l => l.categoria_id === catNum);
      } else if (!isTop100) {
        const cNome = catDecoded.toLowerCase();
        filtrados = filtrados.filter(l => l.categoria_nome && l.categoria_nome.toLowerCase() === cNome);
      }
    }
    if (autor_id && /^\d+$/.test(autor_id)) {
      const aId = Number(autor_id);
      filtrados = filtrados.filter((l: any) => l.autor_id === aId);
    }
    if (idioma) {
      filtrados = filtrados.filter(l => l.idioma === idioma);
    }
    if (licenca) {
      filtrados = filtrados.filter(l => l.licenca === licenca);
    }
    if (formato) {
      const fmt = formato.toLowerCase();
      filtrados = filtrados.filter(l => l.links && l.links.some((lnk: any) => lnk.formato && lnk.formato.toLowerCase() === fmt));
    }
    if (fonte_slug || fonte) {
      const fSlug = (fonte_slug || fonte).toLowerCase();
      filtrados = filtrados.filter((l: any) =>
        (l.fonte_slug && l.fonte_slug.toLowerCase() === fSlug) ||
        (l.fonte_nome && l.fonte_nome.toLowerCase().includes(fSlug))
      );
    }

    const semFiltros = !busca && !categoria_id && !autor_id && !idioma && !licenca && !formato && !(fonte_slug || fonte) && !isTop100;
    const totalCatalogoConhecido = 104170;
    const totalResp = semFiltros ? totalCatalogoConhecido : filtrados.length;
    const paginados = filtrados.slice((numPage - 1) * numLimit, numPage * numLimit);

    return c.json({
      page: numPage,
      pagina: numPage,
      limit: numLimit,
      limite: numLimit,
      total: totalResp,
      total_pages: Math.ceil(totalResp / numLimit) || 1,
      total_paginas: Math.ceil(totalResp / numLimit) || 1,
      data: paginados
    });
  }
});

livrosRouter.get('/api/livros/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { d1, supabase, backendMode } = obterRepo(c);
    const { primary } = edgeLoadBalancer.pickBackend(!!supabase);

    if (primary === 'supabase' && supabase) {
      try {
        const livro = await supabase.livro(id);
        if (livro) {
          edgeLoadBalancer.recordSuccess('supabase', 0);
          livro.capa_url = normalizarCapaUrl(livro.capa_url);
          if (Array.isArray(livro.links)) {
            livro.links = livro.links.map((lnk: any) => ({ ...lnk, url: normalizarUrlSegura(lnk.url) }));
          }
          c.header('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
          c.header('X-Data-Backend', 'supabase');
          return c.json(livro);
        } else if (!d1) {
          return c.json({ erro: 'Livro não encontrado' }, 404);
        }
      } catch (err) {
        edgeLoadBalancer.recordFailure('supabase', err);
        console.error('Supabase livro falhou; a usar D1:', err);
      }
    }

    const db = c.env.DB;
    let livro: any = null;
    let d1FalhouPorCota = false;

    if (db) {
      try {
        livro = await db.prepare(`
          SELECT 
            l.*,
            a.nome AS autor_nome,
            c.nome AS categoria_nome,
            f.slug AS fonte_slug, f.nome AS fonte_nome, f.url_base AS fonte_url
          FROM livros l
          LEFT JOIN autores a ON a.id = l.autor_id
          LEFT JOIN categorias c ON c.id = l.categoria_id
          LEFT JOIN fontes f ON f.id = l.fonte_id
          WHERE l.id = ?
        `).bind(id).first<any>();
        if (livro) edgeLoadBalancer.recordSuccess('d1', 0);
      } catch (dbErr: any) {
        edgeLoadBalancer.recordFailure('d1', dbErr);
        if (ehErroDeCota(dbErr)) d1FalhouPorCota = true;
        const repoFallback = obterRepoSupabase(c.env);
        if (repoFallback) {
          try {
            livro = await repoFallback.livro(id);
            if (livro) edgeLoadBalancer.recordSuccess('supabase', 0);
          } catch (_) {}
        }
        if (!livro && !ehErroDeCota(dbErr)) throw dbErr;
      }
    }

    if (!livro && d1FalhouPorCota) {
      const lId = Number(id);
      const fl = FALLBACK_LIVROS.find((l) => l.id === lId);
      if (fl) {
        livro = { ...fl };
      }
    }

    if (!livro) {
      if (d1FalhouPorCota) {
        c.header('X-Data-Status', 'degraded');
        c.header('Retry-After', '3600');
        return c.json({
          erro: 'Serviço temporariamente indisponível devido ao limite diário da base de dados. Tente novamente mais tarde.',
          status: 'degraded'
        }, 503);
      }
      return c.json({ erro: 'Livro não encontrado' }, 404);
    }

    livro.capa_url = normalizarCapaUrl(livro.capa_url);
    if (!livro.links) {
      try {
        const rawLinks = (await db.prepare('SELECT id, formato, url, tamanho_bytes, link_externo FROM links_livros WHERE livro_id = ?').bind(livro.id).all()).results as any[];
        livro.links = rawLinks.map((lnk: any) => ({ ...lnk, url: normalizarUrlSegura(lnk.url) }));
      } catch (_) {
        livro.links = [];
      }
    } else {
      livro.links = livro.links.map((lnk: any) => ({ ...lnk, url: normalizarUrlSegura(lnk.url) }));
    }

    if (d1FalhouPorCota) {
      c.header('X-Data-Status', 'degraded');
      c.header('Cache-Control', 'public, max-age=60');
    } else {
      c.header('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
    }
    return c.json(livro);
  } catch (err: any) {
    if (ehErroDeCota(err)) {
      c.header('X-Data-Status', 'degraded');
      c.header('Retry-After', '3600');
      return c.json({
        erro: 'Serviço temporariamente indisponível devido ao limite diário da base de dados. Tente novamente mais tarde.',
        status: 'degraded'
      }, 503);
    }
    console.error('[worker]', err); return c.json({ erro: 'Erro ao carregar livro' }, 500);
  }
});

livrosRouter.get('/api/livros/:id/ler/:linkId', async (c) => {
  // Cada leitura incrementa `leituras` na D1: limitar para não esgotar a cota
  // de escrita gratuita com pedidos repetidos (o contador é analítico).
  const bloqueioLeitura = await limitarRequisicao(c, 'leitura', 60);
  if (bloqueioLeitura) return bloqueioLeitura;

  try {
    const id = c.req.param('id');
    const linkId = c.req.param('linkId');

    // Validação estrita de parâmetros numéricos (anti-SQLi / IDOR)
    if (!/^\d+$/.test(id) || !/^\d+$/.test(linkId)) {
      return c.json({ erro: 'Parâmetros id e linkId devem ser números inteiros' }, 404);
    }

    let link: any = null;
    let d1FalhouPorCota = false;

    // 1. Tentar Supabase se configurado como backend primário ou em auto/supabase_priority
    const { d1, supabase, backendMode } = obterRepo(c);
    const { primary } = edgeLoadBalancer.pickBackend(!!supabase);

    if (primary === 'supabase' && supabase) {
      try {
        link = await supabase.link(id, linkId);
        if (link) {
          edgeLoadBalancer.recordSuccess('supabase', 0);
          c.executionCtx.waitUntil(supabase.registrarLeitura(id).catch(() => {}));
        }
      } catch (err: any) {
        if (err?.codigoHttp) {
          return c.json({ erro: err.message }, err.codigoHttp);
        }
        if (err.message && err.message.includes('rejeitada por violar')) {
          return c.json({ erro: err.message }, 400);
        }
        edgeLoadBalancer.recordFailure('supabase', err);
        console.error('Supabase leitura falhou; a usar D1:', err);
      }
    }

    // 2. Se não encontrou no Supabase, tenta a D1
    const db = c.env.DB;
    if (!link && db) {
      try {
        link = await db.prepare(`
          SELECT ll.*, l.titulo, l.conteudo_texto
          FROM links_livros ll
          JOIN livros l ON l.id = ll.livro_id
          WHERE ll.livro_id = ? AND ll.id = ?
        `).bind(id, linkId).first<any>();

        if (link) {
          edgeLoadBalancer.recordSuccess('d1', 0);
          c.executionCtx.waitUntil(
            db.prepare('UPDATE livros SET leituras = leituras + 1 WHERE id = ?').bind(id).run().catch(() => {})
          );
        }
      } catch (dbErr: any) {
        edgeLoadBalancer.recordFailure('d1', dbErr);
        if (ehErroDeCota(dbErr)) {
          d1FalhouPorCota = true;
          // Tenta Supabase como fallback em caso de cota esgotada na D1
          const repoFallback = obterRepoSupabase(c.env);
          if (repoFallback) {
            try {
              link = await repoFallback.link(id, linkId);
              if (link) {
                edgeLoadBalancer.recordSuccess('supabase', 0);
                c.executionCtx.waitUntil(repoFallback.registrarLeitura(id).catch(() => {}));
              }
            } catch (supaErr: any) {
              edgeLoadBalancer.recordFailure('supabase', supaErr);
              if (supaErr?.codigoHttp) return c.json({ erro: supaErr.message }, supaErr.codigoHttp);
              console.error('Fallback Supabase leitura falhou:', supaErr);
            }
          }
        } else {
          throw dbErr;
        }
      }
    }

    // 3. Se ainda não encontrou e a D1 está degradada, consulta o catálogo de fallback
    if (!link && d1FalhouPorCota) {
      link = obterLinkFallback(id, linkId);
    }

    // 4. Se o link não existe em nenhuma fonte
    if (!link) {
      if (d1FalhouPorCota) {
        c.header('X-Data-Status', 'degraded');
        c.header('Retry-After', '3600');
        return c.json({
          erro: 'Serviço temporariamente indisponível devido ao limite diário da base de dados. Tente novamente mais tarde.',
          status: 'degraded'
        }, 503);
      }
      return c.json({ erro: 'Link de leitura não encontrado' }, 404);
    }

    // 5. Redirecionamento 302 seguro para repositório externo
    if (link.url && String(link.url).startsWith('http')) {
      const urlSegura = normalizarUrlSegura(validarUrlRedirecionamento(String(link.url)));
      if (d1FalhouPorCota) {
        c.header('X-Data-Status', 'degraded');
      }
      return c.redirect(urlSegura, 302);
    }

    return c.json({
      mensagem: 'Leitura iniciada',
      url: link.url,
      conteudo_texto: link.conteudo_texto
    });
  } catch (err: any) {
    // Paridade com o Express: violações de URL (SSRF/compliance) são 400
    // com mensagem de política, não 500 interno.
    if (err?.codigoHttp) {
      return c.json({ erro: err.message }, err.codigoHttp);
    }
    if (ehErroDeCota(err)) {
      c.header('X-Data-Status', 'degraded');
      c.header('Retry-After', '3600');
      return c.json({
        erro: 'Serviço temporariamente indisponível devido ao limite diário da base de dados. Tente novamente mais tarde.',
        status: 'degraded'
      }, 503);
    }
    console.error('[worker]', err); return c.json({ erro: 'Erro ao processar leitura' }, 500);
  }
});

livrosRouter.post('/api/livros', verificarAdminWorker, async (c) => {
  try {
    const body = await c.req.json<any>();
    const { 
      titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url,
      paginas, autor_id, categoria_id, fonte_id, fonte_id_externo, licenca,
      conteudo_texto, links 
    } = body;

    if (!titulo || !titulo.trim()) {
      return c.json({ erro: 'O título do livro é obrigatório' }, 400);
    }

    if (!licenca || !LICENCAS_VALIDAS.includes(licenca)) {
      return c.json({ 
        erro: `Licença inválida ou obrigatória. Valores aceitos: ${LICENCAS_VALIDAS.join(', ')}` 
      }, 400);
    }

    // Regra inviolável (AGENTS.md §1.4): texto integral só para domínio público.
    if (conteudo_texto && String(conteudo_texto).trim() && licenca !== 'dominio-publico') {
      return c.json({
        erro: 'O texto integral (conteudo_texto) só é permitido para obras em domínio público. Use licenca="dominio-publico" ou disponibilize apenas metadados e o link externo.'
      }, 400);
    }

    try {
      if (capa_url) {
        if (/^https?:\/\//i.test(capa_url)) {
          validarUrlRedirecionamento(capa_url);
        } else {
          verificarUrlConformidade(capa_url);
        }
      }
      if (Array.isArray(links)) {
        for (const l of links) {
          if (l?.url) validarUrlRedirecionamento(l.url);
        }
      }
    } catch (confErr: any) {
      return c.json({ erro: confErr.message }, 400);
    }

    const db = c.env.DB;
    const res = await db.prepare(`
      INSERT INTO livros (
        titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url,
        paginas, autor_id, categoria_id, fonte_id, fonte_id_externo, licenca, conteudo_texto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      titulo.trim(),
      subtitulo ? subtitulo.trim() : null,
      isbn ? isbn.trim() : null,
      ano_publicacao ? parseInt(ano_publicacao, 10) : null,
      idioma ? idioma.trim() : 'pt',
      sinopse ? sinopse.trim() : null,
      capa_url ? capa_url.trim() : null,
      paginas ? parseInt(paginas, 10) : null,
      autor_id || null,
      categoria_id || null,
      fonte_id || null,
      fonte_id_externo || null,
      licenca,
      conteudo_texto ? conteudo_texto.trim() : null
    ).run();

    const livroId = res.meta.last_row_id;

    if (Array.isArray(links)) {
      const stmt = db.prepare(`
        INSERT INTO links_livros (livro_id, formato, url, tamanho_bytes, link_externo)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const l of links) {
        if (l.formato && l.url) {
          await stmt.bind(livroId, l.formato.toLowerCase(), l.url, l.tamanho_bytes || 0, l.link_externo ?? 1).run();
        }
      }
    }

    const novo = await db.prepare('SELECT * FROM livros WHERE id = ?').bind(livroId).first<any>();
    novo.links = (await db.prepare('SELECT * FROM links_livros WHERE livro_id = ?').bind(livroId).all()).results;
    await registrarMutacaoAcervo(db);
    livrosLruCache.clear();

    return c.json(novo, 201);
  } catch (err: any) {
    console.error('[worker]', err); return c.json({ erro: 'Erro ao cadastrar livro' }, 500);
  }
});

livrosRouter.put('/api/livros/:id', verificarAdminWorker, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json<any>();
    const { 
      titulo, subtitulo, isbn, ano_publicacao, idioma, sinopse, capa_url,
      paginas, autor_id, categoria_id, licenca, conteudo_texto 
    } = body;

    const db = c.env.DB;
    const livroAtual = await db.prepare('SELECT id, licenca FROM livros WHERE id = ?').bind(id).first();
    if (!livroAtual) return c.json({ erro: 'Livro não encontrado' }, 404);

    if (!titulo || !titulo.trim()) return c.json({ erro: 'O título do livro é obrigatório' }, 400);

    if (licenca && !LICENCAS_VALIDAS.includes(licenca)) {
      return c.json({ erro: `Licença inválida. Valores aceitos: ${LICENCAS_VALIDAS.join(', ')}` }, 400);
    }

    // Regra inviolável (AGENTS.md §1.4): manter a licença coerente com o texto.
    const licencaEfetiva = licenca || (livroAtual as any).licenca;
    if (conteudo_texto !== undefined && conteudo_texto !== null && String(conteudo_texto).trim() && licencaEfetiva !== 'dominio-publico') {
      return c.json({
        erro: 'O texto integral (conteudo_texto) só é permitido para obras em domínio público (licenca="dominio-publico").'
      }, 400);
    }

    try {
      if (capa_url) {
        if (/^https?:\/\//i.test(capa_url)) {
          validarUrlRedirecionamento(capa_url);
        } else {
          verificarUrlConformidade(capa_url);
        }
      }
    } catch (confErr: any) {
      return c.json({ erro: confErr.message }, 400);
    }

    await db.prepare(`
      UPDATE livros
      SET titulo = ?, subtitulo = ?, isbn = ?, ano_publicacao = ?, idioma = ?,
          sinopse = ?, capa_url = ?, paginas = ?, autor_id = ?, categoria_id = ?,
          licenca = COALESCE(?, licenca), conteudo_texto = ?
      WHERE id = ?
    `).bind(
      titulo.trim(),
      subtitulo ? subtitulo.trim() : null,
      isbn ? isbn.trim() : null,
      ano_publicacao ? parseInt(ano_publicacao, 10) : null,
      idioma ? idioma.trim() : 'pt',
      sinopse ? sinopse.trim() : null,
      capa_url ? capa_url.trim() : null,
      paginas ? parseInt(paginas, 10) : null,
      autor_id || null,
      categoria_id || null,
      licenca || null,
      conteudo_texto ? conteudo_texto.trim() : null,
      id
    ).run();

    const atualizado = await db.prepare('SELECT * FROM livros WHERE id = ?').bind(id).first();
    livrosLruCache.clear();
    return c.json(atualizado);
  } catch (err: any) {
    console.error('[worker]', err); return c.json({ erro: 'Erro ao atualizar livro' }, 500);
  }
});

livrosRouter.delete('/api/livros/:id', verificarAdminWorker, async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const res = await db.prepare('DELETE FROM livros WHERE id = ?').bind(id).run();
    if (res.meta.changes === 0) return c.json({ erro: 'Livro não encontrado' }, 404);
    await registrarMutacaoAcervo(db);
    livrosLruCache.clear();
    return c.json({ mensagem: 'Livro e links removidos com sucesso' });
  } catch (err: any) {
    console.error('[worker]', err); return c.json({ erro: 'Erro ao remover livro' }, 500);
  }
});