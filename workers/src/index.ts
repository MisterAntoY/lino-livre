import { Hono } from 'hono';
import { Bindings } from './types';
import { RepoSupabase, obterConfigSupabase, backendSupabase } from './supabase';
import { edgeLoadBalancer } from './loadBalancer';
import { executarImportacaoD1 } from './services/importer';
import { obterMotor } from './services/federacaoBusca';
import { validarUrlRedirecionamento, verificarUrlConformidade, DOMINIOS_PROIBIDOS } from './utils/urlValidator';
import { ORIGENS_PERMITIDAS, DIMENSOES_ESTATICAS } from './data/constants';
import { FALLBACK_LIVROS, obterLinkFallback } from './data/fallbackLivros';
import { corsMiddleware } from './middlewares/cors';
import { cacheDeBorda } from './middlewares/cache';
import {
  cabecalhosSeguranca,
  wafSeguranca,
  rateLimitGlobal,
  verificarAdminWorker,
  timingSafeEqualStr,
  limitarRequisicao,
  verificarTurnstileWorker
} from './middlewares/security';

export const CSP_HEADER_WORKER = [
  "default-src 'self'",
  "script-src 'self' 'sha256-VObpZF2rrhL4LG40uRUH3yRXC/1nwGniYanKxkqAWxo=' 'sha256-keHLDO8UACnw+cRVVeKuRurHKeLrwqY0rMi7Sjqgzkc=' 'sha256-wZSMpQgLrgIlbRyynN5NCOpERrzb5ODoykQ0lbDTWnQ=' 'sha256-qOpPGAwL3XogEKhDdObnXr0bcx7NIZEs41a4ijt3hWM=' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: https:",
  "connect-src 'self' https://challenges.cloudflare.com",
  "media-src 'self' https:",
  "frame-src 'self' https://www.youtube.com https://open.spotify.com https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests"
].join('; ');

import { configRouter } from './routes/config';
import { dicasRouter } from './routes/dicas';
import { comunidadeRouter } from './routes/comunidade';
import { loadbalancerRouter } from './routes/loadbalancer';
import { agenticRouter } from './routes/agentic';
import { sugestoesRouter } from './routes/sugestoes';
import { categoriasRouter } from './routes/categorias';
import { autoresRouter } from './routes/autores';
import { fontesRouter } from './routes/fontes';
import { cursosRouter } from './routes/cursos';
import { podcastsRouter } from './routes/podcasts';
import { obterRepo, repoSupabase, obterRepoSupabase, ehErroDeCota, respostaDegradada } from './utils/repoHelper';
import { escaparLike, normalizarCapaUrl, normalizarUrlSegura, tabelaExiste } from './utils/sqlHelpers';

const app = new Hono<{ Bindings: Bindings }>();

// ────────────────────────────────────────────────────────────
// CORS: leitura pública abrangente, mutações restritas.
// A API de leitura é pública (metadados abertos), mas operações de escrita só
// aceitam origens conhecidas. Pedidos sem Origin (curl, server-to-server,
// cron) continuam permitidos — a autorização real é a chave administrativa.
// ────────────────────────────────────────────────────────────
app.use('/api/*', corsMiddleware);
app.use('*', cabecalhosSeguranca);
app.use('*', wafSeguranca);
app.use('/api/*', rateLimitGlobal);

app.route('/', loadbalancerRouter);
app.route('/', configRouter);
app.route('/', dicasRouter);
app.route('/', comunidadeRouter);
app.route('/', agenticRouter);
app.route('/', sugestoesRouter);
app.route('/', categoriasRouter);
app.route('/', autoresRouter);
app.route('/', fontesRouter);
app.route('/', cursosRouter);
app.route('/', podcastsRouter);

app.use('/api/dashboard', cacheDeBorda);
app.use('/api/categorias', cacheDeBorda);
app.use('/api/autores', cacheDeBorda);
app.use('/api/fontes', cacheDeBorda);
app.use('/api/cursos', cacheDeBorda);
app.use('/api/roadmaps', cacheDeBorda);
app.use('/api/livros', cacheDeBorda);
app.use('/api/livros/:id', cacheDeBorda);
app.use('/api/creditos', cacheDeBorda);
app.use('/api/busca/federada', cacheDeBorda);

const LICENCAS_VALIDAS = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'];

/**
 * Sanitiza termos para busca no SQLite FTS5 / D1.
 * Neutraliza caracteres especiais e operadores (AND, OR, NOT, NEAR, aspas, dois pontos, asteriscos, parênteses)
 * evitando exceções de sintaxe e ataques de DoS via busca.
 */
// Limites anti-DoS do FTS5: cada token vira uma consulta de prefixo. Sem teto,
// um pedido de 21 KB (4000 tokens) bloqueava o processamento.
const FTS_MAX_CARACTERES = 120;
const FTS_MAX_TERMOS = 8;

function sanitizarFts5(termo: string | undefined | null): string | null {
  if (!termo || typeof termo !== 'string') return null;
  const tokens = termo
    .slice(0, FTS_MAX_CARACTERES)
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const unicos = [...new Set(tokens)].slice(0, FTS_MAX_TERMOS);
  if (unicos.length === 0) return null;
  return unicos.map((t) => `"${t.replace(/"/g, '""')}"*`).join(' ');
}

// Cache em memória para estatísticas de dashboard para economizar cotas de leitura da D1
let cachedDashboard: { data: any; timestamp: number } | null = null;
let dashboardInFlight: Promise<any> | null = null;
const DASHBOARD_CACHE_TTL = 10 * 60 * 1000; // 10 minutos

// ────────────────────────────────────────────────────────────
// Agregados pré-calculados (estatisticas/contadores)
// Recalculados 1x/dia pelo cron. Evitam COUNT(*)/GROUP BY sobre
// 104k linhas a cada cache miss (limite free tier da D1: 5M/dia).
// ────────────────────────────────────────────────────────────
async function lerEstatistica(db: any, chave: string): Promise<number | null> {
  try {
    const row = await db.prepare('SELECT valor FROM estatisticas WHERE chave = ?').bind(chave).first();
    return row ? Number(row.valor) : null;
  } catch {
    return null;
  }
}

async function lerContador(db: any, dimensao: string, chave: string): Promise<number | null> {
  try {
    const row = await db.prepare('SELECT total FROM contadores WHERE dimensao = ? AND chave = ?')
      .bind(dimensao, String(chave)).first();
    return row ? Number(row.total) : null;
  } catch {
    return null;
  }
}

// Contagem de resultados de busca sem varrer a tabela de livros: a FTS tem
// exatamente uma linha por livro, por isso COUNT(*) do MATCH é o total.
// Custa ~10 linhas lidas em vez de ~104.848.
// Recebe o termo CRU e sanitiza-o exactamente como a consulta principal
// (sanitizarFts5) — sanitizar duas vezes devolveria uma expressão mais
// larga do que a usada nos resultados, e o total deixaria de bater certo.
async function contarNaFts(db: any, termo: string): Promise<number | null> {
  if (!termo) return null;
  const matchQuery = sanitizarFts5(termo);
  if (!matchQuery) return null;
  try {
    const row = await db.prepare(
      'SELECT COUNT(*) AS total FROM livros_fts WHERE livros_fts MATCH ?'
    ).bind(matchQuery).first();
    return row ? Number((row as any).total) : null;
  } catch {
    return null;
  }
}

async function contadoresDe(db: any, dimensao: string): Promise<any[]> {
  try {
    const res = await db.prepare('SELECT chave, rotulo, total FROM contadores WHERE dimensao = ? ORDER BY total DESC')
      .bind(dimensao).all();
    return (res.results || []) as any[];
  } catch {
    return [];
  }
}

// 1. Dashboard de Acervo e Leituras
app.get('/api/dashboard', async (c) => {
  const adminKey = c.env.ADMIN_API_KEY || null;
  const headerKey = c.req.header('x-admin-key');
  const isAdmin = !!(adminKey && headerKey && timingSafeEqualStr(headerKey, adminKey));
  const noCache = isAdmin && (c.req.header('cache-control')?.includes('no-cache') || c.req.header('pragma')?.includes('no-cache'));
  const now = Date.now();
  if (!noCache && cachedDashboard && (now - cachedDashboard.timestamp < DASHBOARD_CACHE_TTL)) {
    c.header('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    return c.json(cachedDashboard.data);
  }

  // Prevenção de Thundering Herd / Cache Stampede:
  // Requisições concorrentes aguardam a mesma consulta em andamento em vez de disparar leituras simultâneas na D1
  if (!noCache && dashboardInFlight) {
    try {
      const payload = await dashboardInFlight;
      c.header('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
      return c.json(payload);
    } catch (_) {}
  }

  const carregarDadosDashboard = async () => {
    const { d1, supabase, backendMode } = obterRepo(c);
    const { data: payload } = await edgeLoadBalancer.execute({
      backendMode,
      isSupabaseConfigured: !!supabase,
      supabase: supabase ? () => supabase.dashboard() : undefined,
      d1: d1 ? async () => {
        // Leitura dos agregados: ~330 linhas no total (era ~700k por cache miss).
        const [statsRes, contadoresRes, maisLidosRes, fontesRes] = await Promise.all([
          d1.prepare('SELECT chave, valor FROM estatisticas').all(),
          d1.prepare('SELECT dimensao, chave, rotulo, total FROM contadores ORDER BY total DESC').all(),
          d1.prepare(`
            SELECT l.id, l.titulo, l.leituras, l.licenca, l.capa_url,
                   a.nome AS autor_nome, c.nome AS categoria_nome
            FROM livros l
            LEFT JOIN autores a ON a.id = l.autor_id
            LEFT JOIN categorias c ON c.id = l.categoria_id
            ORDER BY 
              l.leituras DESC,
              CASE 
                WHEN l.fonte_id_externo LIKE 'world-hist-%' THEN 1 
                WHEN l.fonte_id_externo LIKE 'world-top100-%' THEN 2 
                WHEN l.categoria_id IN (1, 19, 16, 12) THEN 3
                ELSE 10 
              END ASC,
              l.titulo ASC
            LIMIT 5
          `).all(),
          d1.prepare('SELECT id, slug, nome, url_base FROM fontes WHERE ativa = 1').all()
        ]);

        const stats: Record<string, number> = {};
        for (const row of (statsRes.results || []) as any[]) stats[row.chave] = Number(row.valor);

        const contadores = (contadoresRes.results || []) as any[];
        // Sem agregados (primeiro deploy, antes do cron): usa o fallback estático.
        if (contadores.length === 0) throw new Error('agregados ainda não calculados');

        const doGrupo = (dim: string) => contadores.filter((r: any) => r.dimensao === dim);
        const fontes = ((fontesRes.results || []) as any[]).map((f: any) => {
          const c = contadores.find((r: any) => r.dimensao === 'fonte' && r.chave === String(f.id));
          return { ...f, total_livros: c ? c.total : 0 };
        }).sort((a: any, b: any) => b.total_livros - a.total_livros || String(a.nome).localeCompare(String(b.nome)));

        return {
          resumo: {
            total_livros: stats.total_livros ?? 0,
            total_leituras: stats.total_leituras ?? 0,
            total_autores: stats.total_autores ?? 0,
            total_categorias: stats.total_categorias ?? 0,
            total_cursos: stats.total_cursos ?? 0,
            total_fontes: stats.total_fontes ?? 0
          },
          formatos: doGrupo('formato').map((r: any) => ({ formato: r.chave, total: r.total })),
          licencas: doGrupo('licenca').map((r: any) => ({ licenca: r.chave, total: r.total })),
          idiomas: doGrupo('idioma').map((r: any) => ({ idioma: r.chave, total: r.total })),
          areas: doGrupo('categoria').map((r: any) => ({ area: r.rotulo || r.chave, total: r.total })),
          fontes,
          mais_lidos: (maisLidosRes.results || []).map((l: any) => ({
            ...l,
            capa_url: normalizarCapaUrl(l.capa_url)
          }))
        };
      } : undefined
    });

    cachedDashboard = { data: payload, timestamp: Date.now() };
    return payload;
  };

  try {
    dashboardInFlight = carregarDadosDashboard();
    const payload = await dashboardInFlight;
    c.header('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    return c.json(payload);
  } catch (err: any) {
    if (!noCache && cachedDashboard) {
      c.header('Cache-Control', 'public, max-age=300');
      return c.json(cachedDashboard.data);
    }
    c.header('Cache-Control', 'no-store');
    return c.json({
      erro: 'Estatísticas temporariamente indisponíveis',
      mensagem: 'As métricas estão sendo recalculadas ou a base de dados atingiu o limite de consultas temporário.',
                                                // Totais REAIS do acervo de PRODUÇÃO (fonte: D1 lino-livre-db).
      // Actualizar quando o acervo crescer — nunca números fictícios.
      resumo_estavel: {
        total_livros: 104170,
        total_autores: 37950,
        total_categorias: 29,
        total_cursos: 7501,
        total_fontes: 32
      }
    }, 503);
  } finally {
    dashboardInFlight = null;
  }
});

// 4. Livros Digitais

// Dimensões pequenas (fontes e categorias) em cache por isolate.
// Evita LIKE e JOINs na tabela livros (104k+ linhas) para resolver filtros.
let cacheDimensoes: {
  fontes: { id: number; slug: string }[];
  categorias: { id: number; nome: string }[];
  timestamp: number;
} | null = null;
const DIMENSOES_CACHE_TTL = 30 * 60 * 1000; // 30 minutos

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

app.get('/api/livros/destaques', async (c) => {
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

app.get('/api/livros', async (c) => {
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
        c.header('Cache-Control', 'public, max-age=600, stale-while-revalidate=3600');
        c.header('X-Data-Backend', 'supabase');
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

    c.header('Cache-Control', 'public, max-age=600, stale-while-revalidate=3600');
    return c.json({
      page: numPage,
      pagina: numPage,
      limit: numLimit,
      limite: numLimit,
      total,
      total_pages: Math.ceil(total / numLimit),
      total_paginas: Math.ceil(total / numLimit),
      data: livros
    });
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

app.get('/api/livros/:id', async (c) => {
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

app.get('/api/livros/:id/ler/:linkId', async (c) => {
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

app.post('/api/livros', verificarAdminWorker, async (c) => {
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

    return c.json(novo, 201);
  } catch (err: any) {
    console.error('[worker]', err); return c.json({ erro: 'Erro ao cadastrar livro' }, 500);
  }
});

app.put('/api/livros/:id', verificarAdminWorker, async (c) => {
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
    return c.json(atualizado);
  } catch (err: any) {
    console.error('[worker]', err); return c.json({ erro: 'Erro ao atualizar livro' }, 500);
  }
});

app.delete('/api/livros/:id', verificarAdminWorker, async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const res = await db.prepare('DELETE FROM livros WHERE id = ?').bind(id).run();
    if (res.meta.changes === 0) return c.json({ erro: 'Livro não encontrado' }, 404);
    await registrarMutacaoAcervo(db);
    return c.json({ mensagem: 'Livro e links removidos com sucesso' });
  } catch (err: any) {
    console.error('[worker]', err); return c.json({ erro: 'Erro ao remover livro' }, 500);
  }
});





// ═══════════════════════════════════════════════════════════════════════════
// PROXY DE CAPAS EXTERNAS — cache de borda com TTL eficiente
// Apenas miniaturas de capa (metadados visuais) passam por aqui. Nenhum
// ficheiro de livro é armazenado: a resposta é transmitida em streaming e
// guardada apenas no Cache API de borda da Cloudflare.
// ═══════════════════════════════════════════════════════════════════════════
const HOSTS_CAPAS_PERMITIDOS = [
  'gutenberg.org',
  'openlibrary.org',
  'archive.org',
  'githubusercontent.com',
  'guiadeti.com.br',
  'supabase.co',
  'unsplash.com',
  'wikimedia.org',
  'africanstorybook.org',
  'standardebooks.org',
  // CDN oficial de imagens do site da obra #997 (Tese do Método Fluência):
  // PNG verificado (HTTP 200, image/png). O filtro anti-SSRF e o limite
  // de 5 MB continuam aplicados a este host.
  'wixstatic.com'
];

const CAPA_CACHE_CONTROL = 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=604800';
const CAPA_TAMANHO_MAXIMO = 5 * 1024 * 1024;
const CAPA_MAX_REDIRECTS = 3;
const TIPOS_IMAGEM_PERMITIDOS = new Set([
  'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif', 'image/gif'
]);
const STATUS_REDIRECT = new Set([301, 302, 303, 307, 308]);

function hostCapaPermitido(hostname: string): boolean {
  const host = String(hostname || '').toLowerCase().replace(/\.$/, '');
  return HOSTS_CAPAS_PERMITIDOS.some((base) => host === base || host.endsWith(`.${base}`));
}

app.get('/api/capas', async (c) => {
  const bloqueioCapa = await limitarRequisicao(c, 'capas', 60);
  if (bloqueioCapa) return bloqueioCapa;

  const bruto = String(c.req.query('u') || '').trim();
  if (!bruto) return c.json({ erro: 'Parâmetro "u" (URL da capa) é obrigatório' }, 400);
  if (bruto.length > 1000) return c.json({ erro: 'URL de capa demasiado longa' }, 400);

  let destino: string;
  try {
    destino = validarUrlRedirecionamento(bruto);
  } catch {
    return c.json({ erro: 'URL de capa inválida' }, 400);
  }

  const alvo = new URL(destino);
  if (alvo.protocol === 'http:') {
    alvo.protocol = 'https:';
  }
  if (alvo.hostname.toLowerCase().includes('africanstorybook.org')) {
    return c.redirect('/capas/dom_casmurro.jpg', 302);
  }
  if (alvo.protocol !== 'https:' || !hostCapaPermitido(alvo.hostname)) {
    return c.json({ erro: 'Origem de capa não permitida' }, 403);
  }

  const chave = new Request(
    `https://lino-livre.internal/capa?u=${encodeURIComponent(alvo.href)}`,
    { method: 'GET' }
  );
  const cache = caches.default;
  const emCache = await cache.match(chave);
  if (emCache) return emCache;

  // Segue redirecionamentos MANUALMENTE: cada salto é revalidado antes de ser
  // pedido, impedindo o pivô SSRF (302 da origem permitida para 169.254.169.254).
  let atual = alvo.href;
  let origem: Response | null = null;

  for (let salto = 0; salto <= CAPA_MAX_REDIRECTS; salto++) {
    let resposta: Response;
    try {
      resposta = await fetch(atual, {
        redirect: 'manual',
        headers: {
          Accept: 'image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8',
          'User-Agent': 'LinoLivre-CoverProxy/1.0 (+https://lino-livre.linolivre.workers.dev)'
        },
        cf: { cacheEverything: true, cacheTtl: 2592000 }
      });
    } catch {
      return c.json({ erro: 'Não foi possível obter a capa na origem' }, 502);
    }

    if (STATUS_REDIRECT.has(resposta.status)) {
      const location = resposta.headers.get('location');
      try { await resposta.body?.cancel(); } catch { /* ignorado */ }
      if (!location) {
        return c.json({ erro: 'Redirecionamento inválido na origem' }, 502);
      }
      let proximo: URL;
      try {
        proximo = new URL(location, atual);
        if (proximo.protocol !== 'https:' || !hostCapaPermitido(proximo.hostname)) {
          throw new Error('origem não permitida');
        }
        validarUrlRedirecionamento(proximo.href);
      } catch {
        return c.json({ erro: 'Redirecionamento de capa não permitido' }, 403);
      }
      atual = proximo.href;
      continue;
    }

    origem = resposta;
    break;
  }

  if (!origem) {
    return c.json({ erro: 'Demasiados redirecionamentos na origem da capa' }, 502);
  }

  if (!origem.ok || !origem.body) {
    return c.json({ erro: 'Origem da capa indisponível' }, 502);
  }

  // Apenas imagens raster. SVG é um documento executável: servido da nossa
  // origem permitiria XSS armazenado (script inline com a CSP da aplicação).
  const tipo = String(origem.headers.get('content-type') || '').toLowerCase().split(';')[0].trim();
  if (!TIPOS_IMAGEM_PERMITIDOS.has(tipo)) {
    try { await origem.body.cancel(); } catch { /* ignorado */ }
    return c.json({ erro: 'O conteúdo remoto não é uma imagem suportada' }, 415);
  }

  const tamanho = Number(origem.headers.get('content-length') || '0');
  if (Number.isFinite(tamanho) && tamanho > CAPA_TAMANHO_MAXIMO) {
    try { await origem.body.cancel(); } catch { /* ignorado */ }
    return c.json({ erro: 'Imagem acima do limite permitido' }, 413);
  }

  const resposta = new Response(origem.body, {
    status: 200,
    headers: {
      'Content-Type': tipo,
      'Cache-Control': CAPA_CACHE_CONTROL,
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Access-Control-Allow-Origin': '*'
    }
  });

  c.executionCtx.waitUntil(cache.put(chave, resposta.clone()));
  return resposta;
});

// ═══════════════════════════════════════════════════════════════════════════
// FASE 4 — BUSCA FEDERADA GLOBAL (motor distribuído com RRF)
// Interroga vários catálogos abertos em paralelo na borda e funde os
// resultados num ranking único. Apenas METADADOS (zero armazenamento).
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/busca/federada', async (c) => {
  const bloqueioBusca = await limitarRequisicao(c, 'busca-federada', 20);
  if (bloqueioBusca) return bloqueioBusca;

  const q = String(c.req.query('q') ?? c.req.query('busca') ?? '').trim().slice(0, 120);
  if (!q) {
    return c.json({ erro: 'Parâmetro "q" (termo de busca) é obrigatório' }, 400);
  }
  const limite = Math.min(
    100,
    Math.max(1, parseInt(c.req.query('limite') ?? '30', 10) || 30)
  );

  try {
    const motor = obterMotor();
    const r = await motor.buscar(q, { limite });

    // Sanitização de output (defesa em profundidade)
    const seguros = (r.resultados ?? [])
      .map((x: any) => ({
        id: String(x.id ?? ''),
        titulo: String(x.titulo ?? '').replace(/[<>\"']/g, ''),
        autor: x.autor ? String(x.autor).replace(/[<>\"']/g, '') : null,
        ano: Number.isFinite(x.ano) ? x.ano : null,
        idioma: x.idioma ? String(x.idioma).slice(0, 12) : null,
        fonte: x.fonte,
        fontes: x.fontes,
        url: /^https?:\/\//i.test(String(x.url ?? '')) ? x.url : null,
        capa: /^https?:\/\//i.test(String(x.capa ?? '')) ? x.capa : null,
        sinopse: x.sinopse ? String(x.sinopse).replace(/[<>\"']/g, '').slice(0, 300) : null,
        licenca: x.licenca,
        score: x.score
      }))
      .filter((x: any) => x.url); // só resultados com link externo válido (302)

    c.header('Cache-Control', 'public, max-age=600, stale-while-revalidate=3600');
    return c.json({
      q: q.slice(0, 200),
      total: seguros.length,
      resultados: seguros,
      upstreams: r.upstreams,
      duracao_ms: r.duracao_ms,
      degradado: r.degradado,
      cache: r.cache === true,
      motor: 'federado-distribuido-rrf',
      k: 60
    });
  } catch (err: any) {
    console.error('[worker]', err); return c.json({ erro: 'Erro na busca federada' }, 500);
  }
});

// Diagnóstico do motor federado
app.get('/api/busca/federada/diagnostico', (c) => {
  return c.json({
    motor: 'federado-distribuido-rrf',
    k: 60,
    upstreams: obterMotor().diagnostico()
  });
});

// ==================== PWA, SERVICE WORKER E MANIFEST ====================
app.get('/manifest.webmanifest', async (c) => {
  if (c.env.ASSETS) {
    const res = await c.env.ASSETS.fetch(c.req.raw);
    const newRes = new Response(res.body, res);
    newRes.headers.set('Content-Type', 'application/manifest+json; charset=utf-8');
    newRes.headers.set('Cache-Control', 'public, max-age=86400');
    return newRes;
  }
  return c.text('Not found', 404);
});

app.get('/manifest.json', async (c) => {
  if (c.env.ASSETS) {
    const res = await c.env.ASSETS.fetch(c.req.raw);
    const newRes = new Response(res.body, res);
    newRes.headers.set('Content-Type', 'application/manifest+json; charset=utf-8');
    newRes.headers.set('Cache-Control', 'public, max-age=86400');
    return newRes;
  }
  return c.text('Not found', 404);
});

app.get('/sw.js', async (c) => {
  if (c.env.ASSETS) {
    const res = await c.env.ASSETS.fetch(c.req.raw);
    const newRes = new Response(res.body, res);
    newRes.headers.set('Content-Type', 'application/javascript; charset=utf-8');
    newRes.headers.set('Service-Worker-Allowed', '/');
    newRes.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return newRes;
  }
  return c.text('Not found', 404);
});

app.get('/offline', async (c) => {
  if (c.env.ASSETS) {
    const url = new URL(c.req.url);
    url.pathname = '/offline.html';
    return c.env.ASSETS.fetch(new Request(url.toString(), c.req.raw));
  }
  return c.text('Offline', 503);
});

export { servirAiCatalogWorker, SECURITY_TXT } from './routes/agentic';
// Marca institucional nos fallbacks do Worker: # LinoDigital — Lino Livre, name: 'LinoDigital' e LinoDigital · Lino Livre

// Diretrizes Legais, Intermediação, DMCA / Takedown e Privacidade
app.get('/api/legal', (c) => {
  return c.json({
    status: 'ativo',
    versao: '1.0',
    plataforma: c.env.SITE_NAME || 'LinoDigital · Lino Livre',
    marca_mae: 'LinoDigital',
    produto: 'Lino Livre',
    slogan: c.env.SITE_SLOGAN || 'Livros livres, para todos.',
    natureza: 'Educacional, comunitária e sem fins lucrativos',
    missao: 'Democratização do acesso à leitura, formação técnica e literatura nos países de língua portuguesa (PALOP) e Sul Global.',
    arquitetura: {
      papel: 'intermediario_indexador',
      armazenamento_local_arquivos: false,
      redirecionamento_protocolo: 'HTTP 302',
      diretriz_principal: 'Zero armazenamento local de arquivos binários (PDF, EPUB, MOBI) no servidor web e banco de dados. O acervo mantém unicamente metadados e links para provedores externos.'
    },
    aviso_legal: 'O Lino Livre, da LinoDigital, opera estritamente como plataforma intermediária e motor de busca de hiperligações externas públicas. Não controlamos, não editamos e não armazenamos o conteúdo físico nos nossos servidores.',
    dmca_takedown: {
      canal_oficial: c.env.SUPPORT_EMAIL || 'bv6alblu6@mozmail.com',
      assunto_obrigatorio: '[NOTIFICAÇÃO DE DIREITOS AUTORAIS / TAKEDOWN] - LinoDigital · Lino Livre',
      prazo_atendimento_horas: 48,
      compromisso: 'Desindexação célere e voluntária de links notificados de boa-fé por autores, editores ou seus representantes legais.',
      requisitos: [
        'Identificação da obra protegida por direitos autorais',
        'URL ou ID da obra indexada no Lino Livre',
        'URL externa para a qual o link aponta',
        'Comprovação da titularidade dos direitos autorais ou procuração',
        'Declaração de boa-fé do titular ou representante',
        'Informações de contato válidas'
      ]
    },
    privacidade: {
      cadastro_obrigatorio: false,
      cookies_rastreamento: false,
      venda_compartilhamento_dados: false,
      armazenamento_preferencias: 'localStorage (exclusivo no navegador do usuário para tema, fonte e áudio)',
      conformidade: ['LGPD (Lei 13.709/2018)', 'RGPD (Regulamento UE 2016/679)']
    },
    licencas_suportadas: LICENCAS_VALIDAS,
    links: {
      termos_completos: '/termos.html',
      aviso_legal: '/legal.html',
      creditos_licencas: '/creditos.html',
      documento_oficial: 'https://github.com/MisterAntoY/lino-livre/blob/main/TERMOS-DE-USO-E-AVISO-LEGAL.md',
      documento_compliance: 'https://github.com/MisterAntoY/lino-livre/blob/main/docs/FONTES-E-COMPLIANCE.md'
    }
  });
});

app.get('/api/creditos', async (c) => {
  try {
    const db = c.env.DB;
    let totalLivros = 0;
    let fontesAtivas: any[] = [];
    let distribuicaoLicencas: any[] = [];

    if (db) {
      try {
        // Usa os agregados pré-computados pelo cron (00:10 UTC): lê ~40 linhas
        // em vez de varrer a tabela de livros duas vezes (COUNT + GROUP BY).
        const stats = (await db.prepare('SELECT chave, valor FROM estatisticas').all()).results as any[];
        const porChave = new Map(stats.map((r) => [String(r.chave), Number(r.valor)]));
        totalLivros = porChave.get('total_livros') || 0;
        const licencas = (await db.prepare(
          "SELECT chave AS licenca, total FROM contadores WHERE dimensao = 'licenca' ORDER BY total DESC"
        ).all()).results as any[];
        distribuicaoLicencas = licencas.map((r) => ({ licenca: r.licenca, total: r.total }));
      } catch (_) {
        // Agregados ainda indisponíveis: cálculo direto (correto, mas caro).
        try {
          const row = await db.prepare('SELECT COUNT(*) AS total FROM livros').first<any>();
          totalLivros = row?.total || 0;
          distribuicaoLicencas = (await db.prepare('SELECT licenca, COUNT(*) AS total FROM livros GROUP BY licenca ORDER BY total DESC').all()).results as any[];
        } catch (_) {}
      }
      try {
        fontesAtivas = (await db.prepare('SELECT id, slug, nome, tipo, url_base FROM fontes WHERE ativa = 1 ORDER BY id ASC').all()).results;
      } catch (_) {}
    }

    c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return c.json({
      status: 'ativo',
      plataforma: c.env.SITE_NAME || 'LinoDigital · Lino Livre',
      marca_mae: 'LinoDigital',
      produto: 'Lino Livre',
      missao: 'Livros livres, para todos. Democratização do acesso ao conhecimento através de catalogação aberta.',
      taxonomia_licencas: {
        'dominio-publico': 'Obras em Domínio Público por decurso de prazo patrimonial (vida do autor + 70 anos)',
        'cc0': 'Creative Commons Zero 1.0 Universal (dedicação pública universal)',
        'cc-by': 'Creative Commons Atribuição (livre partilha e adaptação)',
        'cc-by-sa': 'Creative Commons Atribuição-CompartilhaIgual',
        'cc-by-nc': 'Creative Commons Atribuição-NãoComercial',
        'outro': 'Recursos Educacionais Abertos (REA) com licença pública permissiva e código aberto'
      },
      metricas_compliance: {
        total_livros: totalLivros,
        itens_com_licenca_verificada_percentual: 100,
        zero_armazenamento_local: true,
        redirecionamento_protocolo: 'HTTP 302',
        distribuicao_licencas: distribuicaoLicencas
      },
      fontes_aprovadas: fontesAtivas,
      fontes_proibidas_blacklist: [
        'Z-Library',
        'Library Genesis (LibGen)',
        'Sci-Hub',
        'Anna\'s Archive',
        'B-OK / BookFi',
        'PDF Drive'
      ],
      diretrizes: {
        documento_compliance: '/docs/FONTES-E-COMPLIANCE.md',
        pagina_termos: '/termos.html',
        pagina_legal: '/legal.html',
        pagina_creditos: '/creditos.html',
        contato_dmca: c.env.SUPPORT_EMAIL || 'bv6alblu6@mozmail.com'
      }
    });
  } catch (err: any) {
    console.error('[worker]', err); return c.json({ erro: 'Erro ao obter créditos e conformidade' }, 500);
  }
});

app.post('/api/admin/recalcular-estatisticas', verificarAdminWorker, async (c) => {
  try {
    const force = c.req.query('force') === 'true' || true;
    const resultado = await recomputarEstatisticas(c.env.DB, force);
    cachedDashboard = null;
    return c.json({
      sucesso: true,
      mensagem: 'Estatísticas e índices recalculados com sucesso',
      resultado
    });
  } catch (err: any) {
    return c.json({ erro: 'Falha ao recalcular estatísticas', detalhe: err?.message || String(err) }, 500);
  }
});

// ────────────────────────────────────────────────────────────
// Rastreador de Mutações para Economia de Cota da D1
// ────────────────────────────────────────────────────────────
async function registrarMutacaoAcervo(db: D1Database) {
  try {
    await db.prepare(`
      INSERT INTO estatisticas (chave, valor) VALUES ('versao_mutacoes', 1)
      ON CONFLICT(chave) DO UPDATE SET valor = valor + 1
    `).run();
  } catch (_) {}
}

// ────────────────────────────────────────────────────────────
// Cron diário (00:10 UTC, após o reset da cota da D1).
// Recálculo inteligente: verifica se houve mutações antes de varrer
// as 104k linhas, poupando 838.000 leituras e 75.000 escritas diárias.
// ────────────────────────────────────────────────────────────
async function recomputarEstatisticas(db: D1Database, force: boolean = false): Promise<{ executado: boolean; motivo?: string }> {
  if (!force) {
    try {
      const stats = await db.prepare(
        "SELECT chave, valor FROM estatisticas WHERE chave IN ('total_livros', 'atualizado_em_epoch', 'versao_mutacoes', 'versao_calculada')"
      ).all();
      const mapa: Record<string, number> = {};
      for (const row of (stats.results || []) as any[]) {
        mapa[row.chave] = Number(row.valor);
      }
      const totalLivros = mapa.total_livros || 0;
      const versaoMutacoes = mapa.versao_mutacoes || 0;
      const versaoCalculada = mapa.versao_calculada || 0;

      // Se temos agregados válidos e nenhuma alteração no acervo ocorreu:
      if (totalLivros > 0 && versaoMutacoes <= versaoCalculada) {
        return {
          executado: false,
          motivo: 'Acervo íntegro e sem mutações pendentes. Varredura da D1 evitada (economia de ~838k leituras e ~76k escritas).'
        };
      }
    } catch {
      // Se tabelas ainda não existirem, segue para o lote 1 inicial
    }
  }

  // Lote 1 — DDL idempotente + índices + limpeza (as tabelas podem não existir antes
  // do primeiro cron; a migração pode ter falhado durante a cota esgotada).
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS estatisticas (
      chave TEXT PRIMARY KEY, valor INTEGER NOT NULL DEFAULT 0,
      atualizado_em TEXT NOT NULL DEFAULT (datetime('now')))`),
    db.prepare(`CREATE TABLE IF NOT EXISTS contadores (
      dimensao TEXT NOT NULL, chave TEXT NOT NULL, rotulo TEXT,
      total INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (dimensao, chave))`),
    db.prepare(`CREATE TABLE IF NOT EXISTS autor_totais (
      autor_id INTEGER PRIMARY KEY, total INTEGER NOT NULL DEFAULT 0)`),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_contadores_dimensao ON contadores(dimensao, total DESC)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_livros_popularidade ON livros(leituras DESC, titulo ASC)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_livros_idioma_popularidade ON livros(idioma, leituras DESC, titulo ASC)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_livros_fonte_popularidade ON livros(fonte_id, leituras DESC, titulo ASC)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_livros_categoria_popularidade ON livros(categoria_id, leituras DESC, titulo ASC)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_livros_autor_popularidade ON livros(autor_id, leituras DESC, titulo ASC)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_livros_licenca_popularidade ON livros(licenca, leituras DESC, titulo ASC)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_links_formato_livro ON links_livros(formato, livro_id)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_autores_nome ON autores(nome)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_autores_nome_nocase ON autores(nome COLLATE NOCASE)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_cursos_url ON cursos(url)'),
    db.prepare('DELETE FROM contadores'),
    db.prepare('DELETE FROM estatisticas'),
    db.prepare('DELETE FROM autor_totais')
  ]);

  // Lote 2 — contadores por dimensão (uma varredura por grupo, ~765k linhas
  // no total; dividido para não aproximar o limite de duração da D1).
  await db.batch([
    db.prepare(`INSERT INTO contadores (dimensao, chave, rotulo, total)
      SELECT 'idioma', idioma, idioma, COUNT(*) FROM livros
      WHERE idioma IS NOT NULL GROUP BY idioma`),
    db.prepare(`INSERT INTO contadores (dimensao, chave, rotulo, total)
      SELECT 'licenca', licenca, licenca, COUNT(*) FROM livros
      WHERE licenca IS NOT NULL GROUP BY licenca`),
    db.prepare(`INSERT INTO contadores (dimensao, chave, rotulo, total)
      SELECT 'categoria', CAST(c.id AS TEXT), c.nome, COUNT(l.id)
      FROM categorias c LEFT JOIN livros l ON l.categoria_id = c.id
      GROUP BY c.id`),
    db.prepare(`INSERT INTO contadores (dimensao, chave, rotulo, total)
      SELECT 'fonte', CAST(f.id AS TEXT), f.nome, COUNT(l.id)
      FROM fontes f LEFT JOIN livros l ON l.fonte_id = f.id
      WHERE f.ativa = 1 GROUP BY f.id`),
    db.prepare(`INSERT INTO contadores (dimensao, chave, rotulo, total)
      SELECT 'formato', formato, formato, COUNT(DISTINCT livro_id)
      FROM links_livros GROUP BY formato`),
    db.prepare(`INSERT INTO contadores (dimensao, chave, rotulo, total)
      SELECT 'curso_tipo', COALESCE(tipo, 'outro'), COALESCE(tipo, 'outro'), COUNT(*)
      FROM cursos GROUP BY COALESCE(tipo, 'outro')`),
    // Contagem de livros por autor: uma única varredura agrupada, para que
    // /api/autores não tenha de juntar a tabela de 104.848 livros.
    db.prepare(`INSERT INTO autor_totais (autor_id, total)
      SELECT autor_id, COUNT(*) FROM livros
      WHERE autor_id IS NOT NULL GROUP BY autor_id`)
  ]);

  // Lote 3 — totais gerais.
  await db.batch([
    db.prepare(`INSERT INTO estatisticas (chave, valor) VALUES
      ('total_livros', (SELECT COUNT(*) FROM livros)),
      ('total_leituras', (SELECT COALESCE(SUM(leituras), 0) FROM livros)),
      ('total_autores', (SELECT COUNT(*) FROM autores)),
      ('total_categorias', (SELECT COUNT(*) FROM categorias)),
      ('total_cursos', (SELECT COUNT(*) FROM cursos)),
      ('total_fontes', (SELECT COUNT(*) FROM fontes WHERE ativa = 1)),
      ('atualizado_em_epoch', CAST(strftime('%s','now') AS INTEGER)),
      ('versao_calculada', (SELECT COALESCE(MAX(valor), 0) FROM estatisticas WHERE chave = 'versao_mutacoes'))`)
  ]);

  return { executado: true };
}

export function _limparCacheDashboard() {
  cachedDashboard = null;
}

export function _obterLoadBalancer() {
  return edgeLoadBalancer;
}

// 404 real (sem "soft 404"): a API devolve JSON; a navegação recebe HTML 404.
// O site usa routing por hash, portanto nenhum caminho desconhecido deve
// devolver 200 com a página inicial (mascarava sondas e prejudicava o SEO).
app.notFound((c) => {
  c.header('Cache-Control', 'no-store');
  const aceitaHtml = String(c.req.header('accept') || '').includes('text/html');
  if (c.req.path.startsWith('/api/') || !aceitaHtml) {
    return c.json({ erro: 'Recurso não encontrado' }, 404);
  }
  return c.html(`<!doctype html><html lang="pt"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>404 — Página não encontrada | LinoDigital · Lino Livre</title>
<meta name="robots" content="noindex">
<style>body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center;padding:24px}a{color:#34d399}</style>
</head><body><main><h1>404</h1><p>Esta página não existe no LinoDigital · Lino Livre.</p>
<p><a href="/">Voltar ao acervo de livros livres</a></p></main></body></html>`, 404);
});

export { app };

export default {
  fetch: app.fetch,
  async scheduled(_event: any, env: Bindings, ctx: ExecutionContext) {
    ctx.waitUntil(recomputarEstatisticas(env.DB));

    // Mantém os agregados do Supabase frescos sem depender de pg_cron.
    if (backendSupabase(env)) {
      const cfg = obterConfigSupabase(env);
      if (cfg) {
        const repo = new RepoSupabase(cfg);
        ctx.waitUntil(
          repo.recalcularEstatisticas().catch((err) => {
            console.error('Falha ao recalcular agregados no Supabase:', err);
          })
        );
      }
    }
  }
};


