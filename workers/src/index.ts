import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from './types';
import { RepoSupabase, obterConfigSupabase, backendSupabase } from './supabase';
import { generateQrCodeSvg } from './utils/qrcode';
import { dicasData } from '../../src/database/dicasData';
import { executarImportacaoD1 } from './services/importer';
import { obterMotor } from './services/federacaoBusca';
import { validarUrlRedirecionamento, verificarUrlConformidade, DOMINIOS_PROIBIDOS } from './utils/urlValidator';

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS
app.use('/api/*', cors());

// Cabeçalhos de segurança HTTP globais
app.use('*', async (c, next) => {
  await next();
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  c.header('Cross-Origin-Opener-Policy', 'same-origin');
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  c.header(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https:",
      "connect-src 'self'",
      "media-src 'self' https:",
      "frame-src 'self' https://www.youtube.com https://open.spotify.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join('; ')
  );
});

// WAF de Borda: bloqueio de scanners automatizados conhecidos e sondas de caminhos sensíveis
const SCANNERS_RE = /\b(sqlmap|nikto|dirbuster|gobuster|acunetix|nuclei|masscan|wpscan|zgrab)\b/i;
const PROBE_PATHS_RE = /\/(\.env|\.git|wp-admin|phpmyadmin|cgi-bin|\.aws|\.docker)\b/i;

app.use('*', async (c, next) => {
  const ua = c.req.header('user-agent') || '';
  if (SCANNERS_RE.test(ua)) {
    return c.json({ erro: 'Acesso bloqueado por política de segurança (WAF).' }, 403);
  }
  if (PROBE_PATHS_RE.test(c.req.path)) {
    return c.text('Not Found', 404);
  }
  await next();
});

// Cache de borda para leituras públicas. Registado antes das rotas para
// envolver os handlers (o Cache API evita invocações e leituras na D1).
app.use('/api/dashboard', cacheDeBorda);
app.use('/api/categorias', cacheDeBorda);
app.use('/api/autores', cacheDeBorda);
app.use('/api/fontes', cacheDeBorda);
app.use('/api/cursos', cacheDeBorda);
app.use('/api/roadmaps', cacheDeBorda);
app.use('/api/livros', cacheDeBorda);
app.use('/api/livros/:id', cacheDeBorda);

const LICENCAS_VALIDAS = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'];

/**
 * Sanitiza termos para busca no SQLite FTS5 / D1.
 * Neutraliza caracteres especiais e operadores (AND, OR, NOT, NEAR, aspas, dois pontos, asteriscos, parênteses)
 * evitando exceções de sintaxe e ataques de DoS via busca.
 */
function sanitizarFts5(termo: string | undefined | null): string | null {
  if (!termo || typeof termo !== 'string') return null;
  const tokens = termo
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return null;
  return tokens.map((t) => `"${t.replace(/"/g, '""')}"*`).join(' ');
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// ────────────────────────────────────────────────────────────
// Middleware de Autenticação Administrativa para Rotas de Escrita
// ────────────────────────────────────────────────────────────
async function verificarAdminWorker(c: any, next: any) {
  const adminKey = c.env.ADMIN_API_KEY || (c.env.ENVIRONMENT === 'production' ? null : 'lino-admin-dev-key');
  const headerKey = c.req.header('x-admin-key');
  const authHeader = c.req.header('authorization');
  let bearerToken: string | undefined;
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    bearerToken = authHeader.slice(7).trim();
  }
  const providedKey = headerKey || bearerToken;

  if (!adminKey || !providedKey || !timingSafeEqualStr(providedKey, adminKey)) {
    return c.json({ erro: 'Acesso não autorizado: chave administrativa necessária' }, 401);
  }

  await next();
}

// Cache em memória para estatísticas de dashboard para economizar cotas de leitura da D1
let cachedDashboard: { data: any; timestamp: number } | null = null;
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

// Tabelas existentes na D1 — cacheadas por isolate (WeakMap sobre o binding
// DB) para não repetir a consulta a sqlite_master em cada pedido.
const cacheTabelas = new WeakMap<object, { tabelas: Set<string>; timestamp: number }>();
const TABELAS_CACHE_TTL = 10 * 60 * 1000;

async function tabelaExiste(db: any, nome: string): Promise<boolean> {
  const chave = db && typeof db === 'object' ? (db as object) : null;
  let reg = chave ? cacheTabelas.get(chave) : null;
  if (!reg || Date.now() - reg.timestamp > TABELAS_CACHE_TTL) {
    try {
      const res = await db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all();
      reg = {
        tabelas: new Set(((res.results || []) as any[]).map((r) => String(r.name).toLowerCase())),
        timestamp: Date.now()
      };
      if (chave) cacheTabelas.set(chave, reg);
    } catch {
      return false;
    }
  }
  return reg!.tabelas.has(nome.toLowerCase());
}

// Erro de cota da D1 (free tier) — permite degradar em vez de devolver 500.
function ehErroDeCota(err: any): boolean {
  // Cota esgotada OU tabelas de agregados ainda não criadas (antes do 1º cron).
  return /exceeded D1|free tier daily row read|no such table: (estatisticas|contadores)/i
    .test(String(err?.message || ''));
}

function respostaDegradada(c: any, vazio: any = []) {
  c.header('Cache-Control', 'public, max-age=60');
  c.header('X-Data-Status', 'degraded');
  return c.json(vazio);
}

// Devolve o repositório Supabase quando DB_BACKEND=supabase e as credenciais
// existem. As rotas tentam o Supabase e, em caso de erro, seguem para a D1.
function repoSupabase(c: any): RepoSupabase | null {
  if (!backendSupabase(c.env)) return null;
  const cfg = obterConfigSupabase(c.env);
  return cfg ? new RepoSupabase(cfg) : null;
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
  const noCache = c.req.header('cache-control')?.includes('no-cache') || c.req.header('pragma')?.includes('no-cache');
  const now = Date.now();
  if (!noCache && cachedDashboard && (now - cachedDashboard.timestamp < DASHBOARD_CACHE_TTL)) {
    c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return c.json(cachedDashboard.data);
  }

  try {
    const repo = repoSupabase(c);
    if (repo) {
      try {
        const payload = await repo.dashboard();
        cachedDashboard = { data: payload, timestamp: now };
        c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
        return c.json(payload);
      } catch (err) {
        console.error('Supabase dashboard falhou; a usar D1:', err);
      }
    }

    const db = c.env.DB;

    // Leitura dos agregados: ~330 linhas no total (era ~700k por cache miss).
    const [statsRes, contadoresRes, maisLidosRes, fontesRes] = await Promise.all([
      db.prepare('SELECT chave, valor FROM estatisticas').all(),
      db.prepare('SELECT dimensao, chave, rotulo, total FROM contadores ORDER BY total DESC').all(),
      db.prepare(`
        SELECT l.id, l.titulo, l.leituras, l.licenca, l.capa_url,
               a.nome AS autor_nome, c.nome AS categoria_nome
        FROM livros l
        LEFT JOIN autores a ON a.id = l.autor_id
        LEFT JOIN categorias c ON c.id = l.categoria_id
        ORDER BY l.leituras DESC, l.titulo ASC
        LIMIT 5
      `).all(),
      db.prepare('SELECT id, slug, nome, url_base FROM fontes WHERE ativa = 1').all()
    ]);

    const stats: Record<string, number> = {};
    for (const row of (statsRes.results || []) as any[]) stats[row.chave] = Number(row.valor);

    const contadores = (contadoresRes.results || []) as any[];
    // Sem agregados (primeiro deploy, antes do cron): usa o fallback estático.
    if (contadores.length === 0) throw new Error('agregados ainda não calculados');

    const doGrupo = (dim: string) => contadores.filter((r) => r.dimensao === dim);
    const fontes = ((fontesRes.results || []) as any[]).map((f) => {
      const c = contadores.find((r) => r.dimensao === 'fonte' && r.chave === String(f.id));
      return { ...f, total_livros: c ? c.total : 0 };
    }).sort((a, b) => b.total_livros - a.total_livros || String(a.nome).localeCompare(String(b.nome)));

    const payload = {
      resumo: {
        total_livros: stats.total_livros ?? 0,
        total_leituras: stats.total_leituras ?? 0,
        total_autores: stats.total_autores ?? 0,
        total_categorias: stats.total_categorias ?? 0,
        total_cursos: stats.total_cursos ?? 0,
        total_fontes: stats.total_fontes ?? 0
      },
      formatos: doGrupo('formato').map((r) => ({ formato: r.chave, total: r.total })),
      licencas: doGrupo('licenca').map((r) => ({ licenca: r.chave, total: r.total })),
      idiomas: doGrupo('idioma').map((r) => ({ idioma: r.chave, total: r.total })),
      areas: doGrupo('categoria').map((r) => ({ area: r.rotulo || r.chave, total: r.total })),
      fontes,
      mais_lidos: maisLidosRes.results || []
    };

    cachedDashboard = { data: payload, timestamp: now };
    c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
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
        total_livros: 104848,
        total_autores: 37919,
        total_categorias: 29,
        total_cursos: 7501,
        total_fontes: 32
      }
    }, 503);
  }
});

// 2. Categorias / Áreas do Conhecimento
app.get('/api/categorias', async (c) => {
  try {
    const repo = repoSupabase(c);
    if (repo) {
      try {
        const categorias = await repo.categorias();
        c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
        return c.json(categorias);
      } catch (err) {
        console.error('Supabase categorias falhou; a usar D1:', err);
      }
    }
    const db = c.env.DB;
    // Contadores pré-calculados: 29 linhas em vez de varrer 104k livros.
    const categorias = (await db.prepare(`
      SELECT c.*, COALESCE(k.total, 0) AS total_livros
      FROM categorias c
      LEFT JOIN contadores k ON k.dimensao = 'categoria' AND k.chave = CAST(c.id AS TEXT)
      ORDER BY c.nome ASC
    `).all()).results;
    c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return c.json(categorias);
  } catch (err: any) {
    if (ehErroDeCota(err)) return respostaDegradada(c);
    return c.json({ erro: 'Erro ao buscar categorias: ' + err.message }, 500);
  }
});

app.get('/api/categorias/:id', async (c) => {
  try {
    const db = c.env.DB;
    const id = c.req.param('id');
    const categoria = await db.prepare('SELECT * FROM categorias WHERE id = ?').bind(id).first();
    if (!categoria) return c.json({ erro: 'Categoria não encontrada' }, 404);
    return c.json(categoria);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao buscar categoria: ' + err.message }, 500);
  }
});

app.post('/api/categorias', verificarAdminWorker, async (c) => {
  try {
    const { nome, descricao } = await c.req.json<{ nome?: string; descricao?: string }>();
    if (!nome || !nome.trim()) return c.json({ erro: 'O nome da categoria é obrigatório' }, 400);

    const db = c.env.DB;
    const res = await db.prepare('INSERT INTO categorias (nome, descricao) VALUES (?, ?)').bind(nome.trim(), descricao || null).run();
    const nova = await db.prepare('SELECT * FROM categorias WHERE id = ?').bind(res.meta.last_row_id).first();
    return c.json(nova, 201);
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) {
      return c.json({ erro: 'Já existe uma categoria com este nome' }, 400);
    }
    return c.json({ erro: 'Erro ao cadastrar categoria: ' + err.message }, 500);
  }
});

app.put('/api/categorias/:id', verificarAdminWorker, async (c) => {
  try {
    const id = c.req.param('id');
    const { nome, descricao } = await c.req.json<{ nome?: string; descricao?: string }>();
    if (!nome || !nome.trim()) return c.json({ erro: 'O nome da categoria é obrigatório' }, 400);

    const db = c.env.DB;
    const res = await db.prepare('UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?').bind(nome.trim(), descricao || null, id).run();
    if (res.meta.changes === 0) return c.json({ erro: 'Categoria não encontrada' }, 404);

    const atualizada = await db.prepare('SELECT * FROM categorias WHERE id = ?').bind(id).first();
    return c.json(atualizada);
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) {
      return c.json({ erro: 'Já existe uma categoria com este nome' }, 400);
    }
    return c.json({ erro: 'Erro ao atualizar categoria: ' + err.message }, 500);
  }
});

app.delete('/api/categorias/:id', verificarAdminWorker, async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const res = await db.prepare('DELETE FROM categorias WHERE id = ?').bind(id).run();
    if (res.meta.changes === 0) return c.json({ erro: 'Categoria não encontrada' }, 404);
    return c.json({ mensagem: 'Categoria removida com sucesso' });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao remover categoria: ' + err.message }, 500);
  }
});

// 3. Autores
app.get('/api/autores', async (c) => {
  try {
    const db = c.env.DB;
    const busca = (c.req.query('busca') || c.req.query('q') || '').trim();
    const nomeExato = (c.req.query('nome') || '').trim();
    const limitParam = c.req.query('limit') || c.req.query('limite');
    const pageParam = c.req.query('page') || c.req.query('pagina');

    // A contagem de livros por autor vem de autor_totais (índice), e não de
    // um LEFT JOIN sobre os 104.848 livros — esse JOIN era, depois do
    // dashboard, o maior ofensor de leituras da API.
    const temTotais = await tabelaExiste(db, 'autor_totais');

    let query = temTotais
      ? `SELECT a.*, COALESCE(t.total, 0) AS total_livros
           FROM autores a LEFT JOIN autor_totais t ON t.autor_id = a.id`
      : `SELECT a.*, 0 AS total_livros FROM autores a`;
    const params: any[] = [];

    if (nomeExato) {
      // Correspondência exata — usa o índice de autores(nome).
      query += ' WHERE a.nome = ? COLLATE NOCASE';
      params.push(nomeExato);
    } else if (busca) {
      query += ' WHERE a.nome LIKE ?';
      params.push(`%${busca}%`);
    }

    query += ' ORDER BY a.nome ASC';

    // Limite por omissão: sem ele, a rota devolvia os ~37.919 autores numa
    // só resposta (dezenas de milhares de linhas lidas). A paginação
    // (?limit / ?page) continua disponível para quem precisar de mais.
    const limit = Math.min(Math.max(parseInt(limitParam || '500', 10), 1), 500);
    if (limitParam || pageParam) {
      const page = Math.max(parseInt(pageParam || '1', 10), 1);
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    } else {
      query += ' LIMIT ?';
      params.push(limit);
    }

    const autores = (await db.prepare(query).bind(...params).all()).results as any[];

    // Sem a tabela de totais (ainda antes da migração), conta apenas os
    // autores devolvidos: a consulta usa idx_livros_autor e não varre a
    // tabela de livros inteira.
    if (!temTotais && autores.length > 0) {
      const ids = autores.map((a) => a.id);
      const contagens = (await db.prepare(
        `SELECT autor_id, COUNT(*) AS total FROM livros
         WHERE autor_id IN (${ids.map(() => '?').join(',')}) GROUP BY autor_id`
      ).bind(...ids).all()).results as any[];
      const porAutor = new Map(contagens.map((r) => [Number(r.autor_id), Number(r.total)]));
      for (const a of autores) a.total_livros = porAutor.get(a.id) || 0;
    }

    c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return c.json(autores);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao buscar autores: ' + err.message }, 500);
  }
});

app.get('/api/autores/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const autor = await db.prepare('SELECT * FROM autores WHERE id = ?').bind(id).first();
    if (!autor) return c.json({ erro: 'Autor não encontrado' }, 404);

    const livros = (await db.prepare('SELECT id, titulo, ano_publicacao FROM livros WHERE autor_id = ?').bind(id).all()).results;
    return c.json({ ...autor, livros });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao buscar autor: ' + err.message }, 500);
  }
});

app.post('/api/autores', verificarAdminWorker, async (c) => {
  try {
    const { nome, nacionalidade, biografia } = await c.req.json<{ nome?: string; nacionalidade?: string; biografia?: string }>();
    if (!nome || !nome.trim()) return c.json({ erro: 'O nome do autor é obrigatório' }, 400);

    const db = c.env.DB;
    const res = await db.prepare('INSERT INTO autores (nome, nacionalidade, biografia) VALUES (?, ?, ?)').bind(
      nome.trim(), nacionalidade ? nacionalidade.trim() : null, biografia ? biografia.trim() : null
    ).run();

    const novo = await db.prepare('SELECT * FROM autores WHERE id = ?').bind(res.meta.last_row_id).first();
    return c.json(novo, 201);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao cadastrar autor: ' + err.message }, 500);
  }
});

app.put('/api/autores/:id', verificarAdminWorker, async (c) => {
  try {
    const id = c.req.param('id');
    const { nome, nacionalidade, biografia } = await c.req.json<{ nome?: string; nacionalidade?: string; biografia?: string }>();
    if (!nome || !nome.trim()) return c.json({ erro: 'O nome do autor é obrigatório' }, 400);

    const db = c.env.DB;
    const res = await db.prepare('UPDATE autores SET nome = ?, nacionalidade = ?, biografia = ? WHERE id = ?').bind(
      nome.trim(), nacionalidade ? nacionalidade.trim() : null, biografia ? biografia.trim() : null, id
    ).run();

    if (res.meta.changes === 0) return c.json({ erro: 'Autor não encontrado' }, 404);
    const atualizado = await db.prepare('SELECT * FROM autores WHERE id = ?').bind(id).first();
    return c.json(atualizado);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao atualizar autor: ' + err.message }, 500);
  }
});

app.delete('/api/autores/:id', verificarAdminWorker, async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const res = await db.prepare('DELETE FROM autores WHERE id = ?').bind(id).run();
    if (res.meta.changes === 0) return c.json({ erro: 'Autor não encontrado' }, 404);
    return c.json({ mensagem: 'Autor removido com sucesso' });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao remover autor: ' + err.message }, 500);
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
const DIMENSOES_CACHE_TTL = 5 * 60 * 1000;

async function obterDimensoes(db: any) {
  if (cacheDimensoes && Date.now() - cacheDimensoes.timestamp < DIMENSOES_CACHE_TTL) {
    return cacheDimensoes;
  }
  const [fontes, categorias] = await Promise.all([
    db.prepare('SELECT id, slug FROM fontes').all(),
    db.prepare('SELECT id, nome FROM categorias').all()
  ]);
  cacheDimensoes = {
    fontes: (fontes.results || []) as { id: number; slug: string }[],
    categorias: (categorias.results || []) as { id: number; nome: string }[],
    timestamp: Date.now()
  };
  return cacheDimensoes;
}

// Cache de borda (Cache API) para GETs de leitura do acervo.
// Dados públicos e atualizados por importações: TTL curto é suficiente e
// reduz drasticamente o número de leituras na D1 em acessos repetidos.
async function cacheDeBorda(c: any, next: any) {
  if (c.req.method !== 'GET') return await next();
  const cache = typeof caches !== 'undefined' ? (caches as any).default : null;
  if (!cache) return await next();
  const key = new Request(c.req.url, { method: 'GET' });
  const hit = await cache.match(key);
  if (hit) return hit;
  await next();
  if (c.res.status === 200) {
    c.executionCtx.waitUntil(cache.put(key, c.res.clone()));
  }
}
app.get('/api/livros', async (c) => {
  const queryParams = c.req.query();
  const rawPage = queryParams.pagina || queryParams.page || '1';
  const rawLimit = queryParams.limite || queryParams.limit || '24';
  const numPage = Math.max(1, parseInt(rawPage, 10) || 1);
  const numLimit = Math.min(100, Math.max(1, parseInt(rawLimit, 10) || 24));
  const offset = (numPage - 1) * numLimit;
  const { busca, categoria_id, autor_id, idioma, formato, licenca, fonte, fonte_slug } = queryParams;

  try {
    const repo = repoSupabase(c);
    if (repo) {
      try {
        const payload = await repo.livros({
          page: numPage,
          limit: numLimit,
          busca,
          categoria: categoria_id,
          autor: autor_id,
          idioma,
          licenca,
          fonte: fonte_slug || fonte,
          formato
        });
        c.header('Cache-Control', 'public, max-age=600, stale-while-revalidate=3600');
        return c.json(payload);
      } catch (err) {
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

    if (categoria_id) {
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

    const selectQuery = `
      SELECT 
        l.id, l.titulo, l.subtitulo, l.isbn, l.ano_publicacao, l.idioma,
        l.sinopse, l.capa_url, l.paginas, l.licenca, l.leituras, l.criado_em,
        a.id AS autor_id, a.nome AS autor_nome,
        c.id AS categoria_id, c.nome AS categoria_nome,
        f.slug AS fonte_slug, f.nome AS fonte_nome
      FROM livros l
      LEFT JOIN autores a ON a.id = l.autor_id
      LEFT JOIN categorias c ON c.id = l.categoria_id
      LEFT JOIN fontes f ON f.id = l.fonte_id
      WHERE 1=1${whereSql}
      ORDER BY l.leituras DESC, l.titulo ASC
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
        linksPorLivro[link.livro_id].push(link);
      }
      for (const livro of livros) {
        livro.links = linksPorLivro[livro.id] || [];
      }
    }

    let total: number;
    if (totalConhecido !== null) {
      total = totalConhecido;
    } else {
      try {
        const countStmt = db.prepare(`SELECT COUNT(*) AS total FROM livros l WHERE 1=1${whereSql}`).bind(...params);
        total = Number((await countStmt.first<{ total: number }>())?.total || 0);
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
    const fallbackLivros = [
      {
        id: 1,
        titulo: 'Dom Casmurro',
        autor_nome: 'Machado de Assis',
        categoria_nome: 'Clássicos Brasileiros',
        ano_publicacao: 1899,
        idioma: 'pt',
        licenca: 'dominio-publico',
        capa_url: '/capas/dom_casmurro.jpg',
        sinopse: 'A obra-prima de Machado de Assis narrando a história de Bento Santiago e Capitu.',
        links: [{ id: 1, formato: 'html', url: 'https://pt.wikisource.org/wiki/Dom_Casmurro', link_externo: 1 }]
      },
      {
        id: 2,
        titulo: 'Memórias Póstumas de Brás Cubas',
        autor_nome: 'Machado de Assis',
        categoria_nome: 'Clássicos Brasileiros',
        ano_publicacao: 1881,
        idioma: 'pt',
        licenca: 'dominio-publico',
        capa_url: '/capas/memorias_posthumas.jpg',
        sinopse: 'Narrativa irônica e revolucionária de um defunto-autor.',
        links: [{ id: 2, formato: 'html', url: 'https://pt.wikisource.org/wiki/Memórias_Póstumas_de_Brás_Cubas', link_externo: 1 }]
      },
      {
        id: 3,
        titulo: 'O Cortiço',
        autor_nome: 'Aluísio Azevedo',
        categoria_nome: 'Romance & Crônicas',
        ano_publicacao: 1890,
        idioma: 'pt',
        licenca: 'dominio-publico',
        capa_url: '/capas/o_cortico.png',
        sinopse: 'Obra fundadora do Naturalismo no Brasil retratando a vida coletiva num cortiço.',
        links: [{ id: 3, formato: 'html', url: 'https://pt.wikisource.org/wiki/O_Cortiço', link_externo: 1 }]
      },
      {
        id: 4,
        titulo: 'Os Lusíadas',
        autor_nome: 'Luís de Camões',
        categoria_nome: 'Teatro & Poesia',
        ano_publicacao: 1572,
        idioma: 'pt',
        licenca: 'dominio-publico',
        capa_url: '/capas/os_lusiadas.jpg',
        sinopse: 'O épico supremo da língua portuguesa sobre a viagem de Vasco da Gama.',
        links: [{ id: 4, formato: 'html', url: 'https://pt.wikisource.org/wiki/Os_Lusíadas', link_externo: 1 }]
      },
      {
        id: 5,
        titulo: 'Mensagem',
        autor_nome: 'Fernando Pessoa',
        categoria_nome: 'Teatro & Poesia',
        ano_publicacao: 1934,
        idioma: 'pt',
        licenca: 'dominio-publico',
        capa_url: '/capas/mensagem.jpg',
        sinopse: 'A epopeia mística e poética dos navegadores e da alma portuguesa.',
        links: [{ id: 5, formato: 'html', url: 'https://pt.wikisource.org/wiki/Mensagem', link_externo: 1 }]
      },
      {
        id: 6,
        titulo: 'O Alienista',
        autor_nome: 'Machado de Assis',
        categoria_nome: 'Clássicos Brasileiros',
        ano_publicacao: 1882,
        idioma: 'pt',
        licenca: 'dominio-publico',
        capa_url: '/capas/o_alienista.png',
        sinopse: 'Simão Bacamarte funda a Casa Verde e investiga os limites entre sanidade e loucura.',
        links: [{ id: 6, formato: 'html', url: 'https://pt.wikisource.org/wiki/O_Alienista', link_externo: 1 }]
      },
      {
        id: 7,
        titulo: 'Iracema',
        autor_nome: 'José de Alencar',
        categoria_nome: 'Romance Indianista',
        ano_publicacao: 1865,
        idioma: 'pt',
        licenca: 'dominio-publico',
        capa_url: '/capas/iracema.png',
        sinopse: 'A virgem dos lábios de mel e o nascimento místico do Ceará.',
        links: [{ id: 7, formato: 'html', url: 'https://pt.wikisource.org/wiki/Iracema', link_externo: 1 }]
      },
      {
        id: 8,
        titulo: 'Triste Fim de Policarpo Quaresma',
        autor_nome: 'Lima Barreto',
        categoria_nome: 'Apoio Pedagógico & Filosofia',
        ano_publicacao: 1915,
        idioma: 'pt',
        licenca: 'dominio-publico',
        capa_url: '/capas/policarpo_quaresma.png',
        sinopse: 'O patriotismo idealista e trágico de Policarpo Quaresma no início da República.',
        links: [{ id: 8, formato: 'html', url: 'https://pt.wikisource.org/wiki/Triste_Fim_de_Policarpo_Quaresma', link_externo: 1 }]
      },
      {
        id: 9,
        titulo: 'Auto da Barca do Inferno',
        autor_nome: 'Gil Vicente',
        categoria_nome: 'Teatro & Poesia',
        ano_publicacao: 1517,
        idioma: 'pt',
        licenca: 'dominio-publico',
        capa_url: '/capas/auto_da_barca_do_inferno.jpg',
        sinopse: 'A clássica moralidade teatral renascentista julgando as almas humanas.',
        links: [{ id: 9, formato: 'html', url: 'https://pt.wikisource.org/wiki/Auto_da_Barca_do_Inferno', link_externo: 1 }]
      },
      {
        id: 10,
        titulo: 'Os Sertões',
        autor_nome: 'Euclides da Cunha',
        categoria_nome: 'Apoio Pedagógico & Filosofia',
        ano_publicacao: 1902,
        idioma: 'pt',
        licenca: 'dominio-publico',
        capa_url: '/capas/os_sertoes.jpg',
        sinopse: 'O relato épico, sociológico e humano da Guerra de Canudos no sertão baiano.',
        links: [{ id: 10, formato: 'html', url: 'https://pt.wikisource.org/wiki/Os_Sertões', link_externo: 1 }]
      }
    ];
    if (ehErroDeCota(err)) {
      // Recupera assim que a cota reiniciar (00:00 UTC), sem ficar preso em cache.
      c.header('Cache-Control', 'public, max-age=60');
      c.header('X-Data-Status', 'degraded');
    } else {
      c.header('Cache-Control', 'public, max-age=300');
    }
    // Total REAL do acervo (fonte: seed local) — nunca números fictícios.
    const totalCatalogoConhecido = 104848;
    return c.json({
      page: numPage,
      pagina: numPage,
      limit: numLimit,
      limite: numLimit,
      total: totalCatalogoConhecido,
      total_pages: Math.ceil(totalCatalogoConhecido / numLimit),
      total_paginas: Math.ceil(totalCatalogoConhecido / numLimit),
      data: fallbackLivros
    });
  }
});

app.get('/api/livros/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const repo = repoSupabase(c);
    if (repo) {
      try {
        const livro = await repo.livro(id);
        if (!livro) return c.json({ erro: 'Livro não encontrado' }, 404);
        c.header('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
        return c.json(livro);
      } catch (err) {
        console.error('Supabase livro falhou; a usar D1:', err);
      }
    }

    const db = c.env.DB;
    const livro = await db.prepare(`
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

    if (!livro) return c.json({ erro: 'Livro não encontrado' }, 404);

    livro.links = (await db.prepare('SELECT id, formato, url, tamanho_bytes, link_externo FROM links_livros WHERE livro_id = ?').bind(livro.id).all()).results;
    c.header('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
    return c.json(livro);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao carregar livro: ' + err.message }, 500);
  }
});

app.get('/api/livros/:id/ler/:linkId', async (c) => {
  try {
    const id = c.req.param('id');
    const linkId = c.req.param('linkId');
    const repo = repoSupabase(c);
    if (repo) {
      try {
        const link = await repo.link(id, linkId);
        if (!link) return c.json({ erro: 'Link de leitura não encontrado' }, 404);

        c.executionCtx.waitUntil(repo.registrarLeitura(id));

        if (link.url && String(link.url).startsWith('http')) {
          const urlSegura = validarUrlRedirecionamento(String(link.url));
          return c.redirect(urlSegura, 302);
        }
        const conteudo = await repo.conteudoTexto(id);
        return c.json({
          mensagem: 'Leitura iniciada',
          url: link.url,
          conteudo_texto: conteudo
        });
      } catch (err: any) {
        if (err.message && err.message.includes('rejeitada por violar')) {
          return c.json({ erro: err.message }, 400);
        }
        console.error('Supabase leitura falhou; a usar D1:', err);
      }
    }

    const db = c.env.DB;

    const link = await db.prepare(`
      SELECT ll.*, l.titulo, l.conteudo_texto
      FROM links_livros ll
      JOIN livros l ON l.id = ll.livro_id
      WHERE ll.livro_id = ? AND ll.id = ?
    `).bind(id, linkId).first<any>();

    if (!link) return c.json({ erro: 'Link de leitura não encontrado' }, 404);

    c.executionCtx.waitUntil(
      db.prepare('UPDATE livros SET leituras = leituras + 1 WHERE id = ?').bind(id).run()
    );

    if (link.url && link.url.startsWith('http')) {
      const urlSegura = validarUrlRedirecionamento(link.url);
      return c.redirect(urlSegura, 302);
    }

    return c.json({
      mensagem: 'Leitura iniciada',
      url: link.url,
      conteudo_texto: link.conteudo_texto
    });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao processar leitura: ' + err.message }, 500);
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

    return c.json(novo, 201);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao cadastrar livro: ' + err.message }, 500);
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
    const livroAtual = await db.prepare('SELECT id FROM livros WHERE id = ?').bind(id).first();
    if (!livroAtual) return c.json({ erro: 'Livro não encontrado' }, 404);

    if (!titulo || !titulo.trim()) return c.json({ erro: 'O título do livro é obrigatório' }, 400);

    if (licenca && !LICENCAS_VALIDAS.includes(licenca)) {
      return c.json({ erro: `Licença inválida. Valores aceitos: ${LICENCAS_VALIDAS.join(', ')}` }, 400);
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
    return c.json({ erro: 'Erro ao atualizar livro: ' + err.message }, 500);
  }
});

app.delete('/api/livros/:id', verificarAdminWorker, async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const res = await db.prepare('DELETE FROM livros WHERE id = ?').bind(id).run();
    if (res.meta.changes === 0) return c.json({ erro: 'Livro não encontrado' }, 404);
    return c.json({ mensagem: 'Livro e links removidos com sucesso' });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao remover livro: ' + err.message }, 500);
  }
});

// 5. Fontes e Importação
app.get('/api/fontes', async (c) => {
  try {
    const repo = repoSupabase(c);
    if (repo) {
      try {
        const fontes = await repo.fontes();
        c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
        return c.json(fontes);
      } catch (err) {
        console.error('Supabase fontes falhou; a usar D1:', err);
      }
    }
    const db = c.env.DB;
    // LEFT JOIN em tabela de contadores (32 linhas) em vez de GROUP BY em 104k.
    const fontes = (await db.prepare(`
      SELECT f.id, f.slug, f.nome, f.tipo, f.url_base, f.ativa,
             COALESCE(k.total, 0) AS total_livros
      FROM fontes f
      LEFT JOIN contadores k ON k.dimensao = 'fonte' AND k.chave = CAST(f.id AS TEXT)
      WHERE f.ativa = 1
      ORDER BY f.id ASC
    `).all()).results;
    c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return c.json(fontes);
  } catch (err: any) {
    if (ehErroDeCota(err)) return respostaDegradada(c);
    return c.json({ erro: 'Erro ao listar fontes: ' + err.message }, 500);
  }
});

app.post('/api/import', verificarAdminWorker, async (c) => {
  try {
    const db = c.env.DB;
    const body = await c.req.json<{ fonte_id?: number; fonte?: string; query?: string }>();

    let fonte: any;
    if (body.fonte_id) {
      fonte = await db.prepare('SELECT * FROM fontes WHERE id = ?').bind(body.fonte_id).first();
    } else if (body.fonte) {
      fonte = await db.prepare('SELECT * FROM fontes WHERE slug = ? OR nome = ?').bind(body.fonte, body.fonte).first();
    } else {
      fonte = await db.prepare("SELECT * FROM fontes WHERE slug = 'gutenberg'").first();
    }

    if (!fonte) return c.json({ erro: 'Fonte informada não existe ou está inativa' }, 400);

    const termoBusca = (body.query || 'literatura').trim();
    const res = await db.prepare(`
      INSERT INTO import_jobs (fonte_id, query, status, total, processados)
      VALUES (?, ?, 'pendente', 0, 0)
    `).bind(fonte.id, termoBusca).run();

    const jobId = Number(res.meta.last_row_id);

    // Disparar importação assíncrona na Edge sem bloquear resposta HTTP
    c.executionCtx.waitUntil(executarImportacaoD1(db, jobId, fonte.slug, termoBusca));

    return c.json({
      job_id: jobId,
      status: 'pendente',
      fonte: fonte.slug,
      query: termoBusca
    }, 202);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao iniciar importação: ' + err.message }, 500);
  }
});

app.get('/api/import/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const job = await db.prepare(`
      SELECT j.*, f.slug AS fonte_slug, f.nome AS fonte_nome
      FROM import_jobs j
      LEFT JOIN fontes f ON f.id = j.fonte_id
      WHERE j.id = ?
    `).bind(id).first();

    if (!job) return c.json({ erro: 'Job de importação não encontrado' }, 404);
    return c.json(job);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao consultar status da importação: ' + err.message }, 500);
  }
});

// 5.5 Sugestões da Comunidade (Moderação Pública)
app.post('/api/sugestoes', async (c) => {
  try {
    const body = await c.req.json<any>();
    const { titulo, autor_nome, ano_publicacao, categoria_id, licenca, formato, url_link, capa_url, sinopse } = body || {};

    if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 2) {
      return c.json({ erro: 'Título da obra é obrigatório' }, 400);
    }

    if (!url_link || typeof url_link !== 'string') {
      return c.json({ erro: 'URL de leitura pública ou página do acervo é obrigatória' }, 400);
    }

    let urlValida: string;
    try {
      urlValida = validarUrlRedirecionamento(url_link);
    } catch (err: any) {
      return c.json({ erro: 'URL inválida ou não autorizada: ' + err.message }, 400);
    }

    const db = c.env.DB;
    const res = await db.prepare(`
      INSERT INTO sugestoes (
        titulo, autor_nome, ano_publicacao, categoria_id, licenca, formato,
        url_link, capa_url, sinopse, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente')
    `).bind(
      titulo.trim().slice(0, 250),
      autor_nome ? String(autor_nome).trim().slice(0, 150) : null,
      ano_publicacao ? parseInt(ano_publicacao, 10) : null,
      categoria_id ? parseInt(categoria_id, 10) : null,
      licenca || 'outro',
      formato || 'html',
      urlValida,
      capa_url ? String(capa_url).trim().slice(0, 500) : null,
      sinopse ? String(sinopse).trim().slice(0, 1000) : null
    ).run();

    return c.json({
      sucesso: true,
      mensagem: 'Sugestão recebida com sucesso! Passará pela curadoria do Lino Livre antes de ser publicada.',
      id: res.meta?.last_row_id
    }, 201);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao processar sugestão: ' + err.message }, 500);
  }
});

app.get('/api/sugestoes', verificarAdminWorker, async (c) => {
  try {
    const status = c.req.query('status') || 'pendente';
    const db = c.env.DB;
    const sugestoes = (await db.prepare('SELECT * FROM sugestoes WHERE status = ? ORDER BY criado_em DESC LIMIT 50').bind(status).all()).results;
    return c.json(sugestoes);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao listar sugestões: ' + err.message }, 500);
  }
});

// 6. Cursos
app.get('/api/cursos', async (c) => {
  try {
    const filtros = c.req.query();
    const repo = repoSupabase(c);
    if (repo) {
      try {
        const cursos = await repo.cursos(filtros);
        c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
        return c.json(cursos);
      } catch (err) {
        console.error('Supabase cursos falhou; a usar D1:', err);
      }
    }

    const db = c.env.DB;
    const { area, nivel, plataforma, fonte, busca, youtube, certificado, tipo, excluir_roadmaps, licenca } = filtros;

    let query = 'SELECT * FROM cursos WHERE 1=1';
    const params: any[] = [];

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
      const termo = `%${busca.trim()}%`;
      query += ' AND (titulo LIKE ? OR descricao LIKE ? OR plataforma LIKE ?)';
      params.push(termo, termo, termo);
    }

    query += " ORDER BY CASE WHEN plataforma LIKE '%Guia de TI%' THEN 0 ELSE 1 END, id ASC";

    const limitParam = filtros.limit || filtros.limite;
    const pageParam = filtros.page || filtros.pagina;
    if (limitParam || pageParam) {
      const limit = Math.min(Math.max(parseInt(limitParam || '100', 10), 1), 500);
      const page = Math.max(parseInt(pageParam || '1', 10), 1);
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const cursos = (await db.prepare(query).bind(...params).all()).results;
    c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return c.json(cursos);
  } catch (err: any) {
    if (ehErroDeCota(err)) return respostaDegradada(c);
    return c.json({ erro: 'Erro ao buscar cursos: ' + err.message }, 500);
  }
});

app.get('/api/roadmaps', async (c) => {
  try {
    const filtros = c.req.query();
    const repo = repoSupabase(c);
    if (repo) {
      try {
        const roadmaps = await repo.roadmaps(filtros);
        c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
        return c.json(roadmaps);
      } catch (err) {
        console.error('Supabase roadmaps falhou; a usar D1:', err);
      }
    }

    const db = c.env.DB;
    const { busca, plataforma, area } = filtros;
    let query = "SELECT * FROM cursos WHERE tipo = 'roadmap'";
    const params: any[] = [];

    if (plataforma) {
      query += ' AND plataforma LIKE ?';
      params.push(`%${plataforma}%`);
    }
    if (area) {
      query += ' AND area = ?';
      params.push(area);
    }
    if (busca && busca.trim()) {
      const termo = `%${busca.trim()}%`;
      query += ' AND (titulo LIKE ? OR descricao LIKE ? OR plataforma LIKE ?)';
      params.push(termo, termo, termo);
    }

    query += " ORDER BY CASE WHEN plataforma LIKE '%Roadmap.sh%' THEN 0 WHEN plataforma LIKE '%Trilha Info%' THEN 1 ELSE 2 END, titulo ASC";

    const limitParam = filtros.limit || filtros.limite;
    const pageParam = filtros.page || filtros.pagina;
    if (limitParam || pageParam) {
      const limit = Math.min(Math.max(parseInt(limitParam || '100', 10), 1), 500);
      const page = Math.max(parseInt(pageParam || '1', 10), 1);
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const roadmaps = (await db.prepare(query).bind(...params).all()).results;
    c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return c.json(roadmaps);
  } catch (err: any) {
    if (ehErroDeCota(err)) return respostaDegradada(c);
    return c.json({ erro: 'Erro ao buscar roadmaps: ' + err.message }, 500);
  }
});

app.get('/api/cursos/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const repo = repoSupabase(c);
    if (repo) {
      try {
        const curso = await repo.curso(id);
        if (!curso) return c.json({ erro: 'Curso não encontrado' }, 404);
        return c.json(curso);
      } catch (err) {
        console.error('Supabase curso falhou; a usar D1:', err);
      }
    }

    const db = c.env.DB;
    const curso = await db.prepare('SELECT * FROM cursos WHERE id = ?').bind(id).first();
    if (!curso) return c.json({ erro: 'Curso não encontrado' }, 404);
    return c.json(curso);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao carregar curso: ' + err.message }, 500);
  }
});

app.get('/api/cursos/:id/acessar', async (c) => {
  try {
    const id = c.req.param('id');
    const repo = repoSupabase(c);
    if (repo) {
      try {
        const curso = await repo.curso(id);
        if (!curso) return c.json({ erro: 'Curso não encontrado' }, 404);
        const urlSegura = validarUrlRedirecionamento(String((curso as any).url));
        return c.redirect(urlSegura, 302);
      } catch (err: any) {
        if (err.message && err.message.includes('rejeitada por violar')) {
          return c.json({ erro: err.message }, 400);
        }
        console.error('Supabase acessar curso falhou; a usar D1:', err);
      }
    }

    const db = c.env.DB;
    const curso = await db.prepare('SELECT id, titulo, url FROM cursos WHERE id = ?').bind(id).first<{ url: string }>();
    if (!curso) return c.json({ erro: 'Curso não encontrado' }, 404);
    const urlSegura = validarUrlRedirecionamento(curso.url);
    return c.redirect(urlSegura, 302);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao redirecionar para o curso: ' + err.message }, 500);
  }
});

app.post('/api/cursos', verificarAdminWorker, async (c) => {
  try {
    const { titulo, area, plataforma, url, licenca, nivel, descricao } = await c.req.json<any>();
    if (!titulo || !area || !plataforma || !url) {
      return c.json({ erro: 'Campos obrigatórios: titulo, area, plataforma, url' }, 400);
    }

    let urlValida: string;
    try {
      urlValida = validarUrlRedirecionamento(url);
    } catch (err: any) {
      return c.json({ erro: 'URL do curso inválida ou não autorizada: ' + err.message }, 400);
    }

    const db = c.env.DB;
    const res = await db.prepare(`
      INSERT INTO cursos (titulo, area, plataforma, url, licenca, nivel, descricao)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      titulo.trim(), area.trim(), plataforma.trim(), urlValida,
      licenca || 'gratuito', nivel || 'Iniciante', descricao ? descricao.trim() : null
    ).run();

    const novo = await db.prepare('SELECT * FROM cursos WHERE id = ?').bind(res.meta.last_row_id).first();
    return c.json(novo, 201);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao cadastrar curso: ' + err.message }, 500);
  }
});

app.delete('/api/cursos/:id', verificarAdminWorker, async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const res = await db.prepare('DELETE FROM cursos WHERE id = ?').bind(id).run();
    if (res.meta.changes === 0) return c.json({ erro: 'Curso não encontrado' }, 404);
    return c.json({ mensagem: 'Curso removido com sucesso' });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao remover curso: ' + err.message }, 500);
  }
});

// 7. Dicas
app.get('/api/dicas', (c) => {
  try {
    const { categoria, busca } = c.req.query();
    let resultados = [...dicasData];

    if (categoria && categoria.trim()) {
      const cat = categoria.trim().toLowerCase();
      resultados = resultados.filter(d => d.categoria.toLowerCase() === cat);
    }

    if (busca && busca.trim()) {
      const termo = busca.trim().toLowerCase();
      resultados = resultados.filter(d =>
        d.titulo.toLowerCase().includes(termo) ||
        d.descricao.toLowerCase().includes(termo) ||
        d.dica_pratica.toLowerCase().includes(termo) ||
        d.categoria_label.toLowerCase().includes(termo)
      );
    }

    return c.json(resultados);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao listar dicas de estudo: ' + err.message }, 500);
  }
});

app.get('/api/dicas/:id', (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const dica = dicasData.find((d: any) => d.id === id);
    if (!dica) return c.json({ erro: 'Dica não encontrada' }, 404);
    return c.json(dica);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao buscar dica: ' + err.message }, 500);
  }
});

const DEFAULT_WHATSAPP_COMMUNITY = 'https://chat.whatsapp.com/FobzGj8sibBI0EWfQrl2oU';
const DEFAULT_WHATSAPP_CHANNEL = 'https://whatsapp.com/channel/0029Vb8qMqDBlHpk2TQYwU0X';

// 8. Comunidade e Canal WhatsApp
app.get('/api/comunidade', (c) => {
  const url = c.env.WHATSAPP_COMMUNITY_URL || DEFAULT_WHATSAPP_COMMUNITY;
  if (!url) return c.json({ erro: 'Comunidade WhatsApp não configurada' }, 404);
  return c.json({ url });
});

app.get('/api/comunidade/qrcode.svg', async (c) => {
  const url = c.env.WHATSAPP_COMMUNITY_URL || DEFAULT_WHATSAPP_COMMUNITY;
  if (!url) return c.json({ erro: 'Comunidade WhatsApp não configurada' }, 404);

  try {
    const svg = await generateQrCodeSvg(url, 'comunidade');
    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao gerar QR code: ' + err.message }, 500);
  }
});

app.get('/api/canal', (c) => {
  const url = c.env.WHATSAPP_CHANNEL_URL || DEFAULT_WHATSAPP_CHANNEL;
  if (!url) return c.json({ erro: 'Canal WhatsApp não configurado' }, 404);
  return c.json({ url });
});

app.get('/api/canal/qrcode.svg', async (c) => {
  const url = c.env.WHATSAPP_CHANNEL_URL || DEFAULT_WHATSAPP_CHANNEL;
  if (!url) return c.json({ erro: 'Canal WhatsApp não configurado' }, 404);

  try {
    const svg = await generateQrCodeSvg(url, 'canal');
    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao gerar QR code: ' + err.message }, 500);
  }
});

// 9. Podcasts & Audiolivros (Spotify for Creators)
app.get('/api/podcasts', async (c) => {
  try {
    const filtros = c.req.query();
    const repo = repoSupabase(c);
    if (repo) {
      try {
        return c.json(await repo.podcasts(filtros));
      } catch (err) {
        console.error('Supabase podcasts falhou; a usar D1:', err);
      }
    }

    const { busca, categoria } = filtros;
    let query = `
      SELECT s.*, 
        COUNT(e.id) as total_episodios
      FROM podcasts_shows s
      LEFT JOIN podcasts_episodios e ON e.show_id = s.id
      WHERE s.ativo = 1
    `;
    const params: any[] = [];

    if (categoria && categoria.trim()) {
      query += ` AND s.categoria LIKE ?`;
      params.push(`%${categoria.trim()}%`);
    }

    if (busca && busca.trim()) {
      query += ` AND (s.titulo LIKE ? OR s.descricao LIKE ?)`;
      const term = `%${busca.trim()}%`;
      params.push(term, term);
    }

    query += ` GROUP BY s.id ORDER BY s.id ASC`;

    const result = await c.env.DB.prepare(query).bind(...params).all();
    return c.json(result.results || []);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao listar podcasts: ' + err.message }, 500);
  }
});

app.get('/api/podcasts/episodios/recentes', async (c) => {
  try {
    const repo = repoSupabase(c);
    if (repo) {
      try {
        return c.json(await repo.episodiosRecentes());
      } catch (err) {
        console.error('Supabase episódios falhou; a usar D1:', err);
      }
    }

    const query = `
      SELECT e.*, 
        s.titulo as show_titulo, 
        s.capa_url as show_capa_url,
        s.slug as show_slug
      FROM podcasts_episodios e
      JOIN podcasts_shows s ON s.id = e.show_id
      WHERE s.ativo = 1
      ORDER BY e.publicado_em DESC, e.id DESC
      LIMIT 20
    `;
    const result = await c.env.DB.prepare(query).all();
    return c.json(result.results || []);
  } catch (err: any) {
    return c.json({ erro: 'Erro ao listar episódios recentes: ' + err.message }, 500);
  }
});

app.get('/api/podcasts/:slugOuId', async (c) => {
  try {
    const { slugOuId } = c.req.param();
    const repo = repoSupabase(c);
    if (repo) {
      try {
        const show = await repo.podcast(slugOuId);
        if (!show) return c.json({ erro: 'Podcast não encontrado' }, 404);
        return c.json(show);
      } catch (err) {
        console.error('Supabase podcast falhou; a usar D1:', err);
      }
    }

    let show: any = null;

    if (/^\d+$/.test(slugOuId)) {
      show = await c.env.DB.prepare(
        `SELECT * FROM podcasts_shows WHERE id = ? AND ativo = 1`
      ).bind(parseInt(slugOuId, 10)).first();
    } else {
      show = await c.env.DB.prepare(
        `SELECT * FROM podcasts_shows WHERE slug = ? AND ativo = 1`
      ).bind(slugOuId).first();
    }

    if (!show) {
      return c.json({ erro: 'Podcast não encontrado' }, 404);
    }

    const episodios = await c.env.DB.prepare(
      `SELECT * FROM podcasts_episodios WHERE show_id = ? ORDER BY numero ASC, publicado_em DESC`
    ).bind(show.id).all();

    return c.json({
      ...show,
      episodios: episodios.results || []
    });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao obter podcast: ' + err.message }, 500);
  }
});

app.post('/api/podcasts/episodios/:id/ouvir', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    const repo = repoSupabase(c);
    if (repo) {
      try {
        await repo.registrarReproducao(id);
        return c.json({ sucesso: true, id });
      } catch (err) {
        console.error('Supabase reprodução falhou; a usar D1:', err);
      }
    }

    await c.env.DB.prepare(
      `UPDATE podcasts_episodios SET reproducoes = reproducoes + 1 WHERE id = ?`
    ).bind(id).run();
    return c.json({ sucesso: true, id });
  } catch (err: any) {
    return c.json({ erro: 'Erro ao registar reprodução: ' + err.message }, 500);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// FASE 4 — BUSCA FEDERADA GLOBAL (motor distribuído com RRF)
// Interroga vários catálogos abertos em paralelo na borda e funde os
// resultados num ranking único. Apenas METADADOS (zero armazenamento).
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/busca/federada', async (c) => {
  const q = String(c.req.query('q') ?? c.req.query('busca') ?? '').trim();
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
    return c.json({ erro: 'Erro na busca federada: ' + err.message }, 500);
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

// Diretrizes Legais, Intermediação, DMCA / Takedown e Privacidade
app.get('/api/legal', (c) => {
  return c.json({
    status: 'ativo',
    versao: '1.0',
    plataforma: c.env.SITE_NAME || 'Lino Livre',
    slogan: c.env.SITE_SLOGAN || 'Livros livres, para todos.',
    natureza: 'Educacional, comunitária e sem fins lucrativos',
    missao: 'Democratização do acesso à leitura, formação técnica e literatura nos países de língua portuguesa (PALOP) e Sul Global.',
    arquitetura: {
      papel: 'intermediario_indexador',
      armazenamento_local_arquivos: false,
      redirecionamento_protocolo: 'HTTP 302',
      diretriz_principal: 'Zero armazenamento local de arquivos binários (PDF, EPUB, MOBI) no servidor web e banco de dados. O acervo mantém unicamente metadados e links para provedores externos.'
    },
    aviso_legal: 'O Lino Livre opera estritamente como plataforma intermediária e motor de busca de hiperligações externas públicas. Não controlamos, não editamos e não armazenamos o conteúdo físico nos nossos servidores.',
    dmca_takedown: {
      canal_oficial: c.env.SUPPORT_EMAIL || 'bv6alblu6@mozmail.com',
      assunto_obrigatorio: '[NOTIFICAÇÃO DE DIREITOS AUTORAIS / TAKEDOWN] - Lino Livre',
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

    return c.json({
      status: 'ativo',
      plataforma: c.env.SITE_NAME || 'Lino Livre',
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
    return c.json({ erro: 'Erro ao obter créditos e conformidade: ' + err.message }, 500);
  }
});

app.post('/api/admin/recalcular-estatisticas', verificarAdminWorker, async (c) => {
  try {
    await recomputarEstatisticas(c.env.DB);
    cachedDashboard = null;
    return c.json({ sucesso: true, mensagem: 'Estatísticas e índices recalculados com sucesso' });
  } catch (err: any) {
    return c.json({ erro: 'Falha ao recalcular estatísticas', detalhe: err?.message || String(err) }, 500);
  }
});

// ────────────────────────────────────────────────────────────
// Cron diário (00:10 UTC, após o reset da cota da D1).
// Uma única varredura por dia mantém estatisticas/contadores exatos,
// em vez de varrer 104k linhas em cada cache miss.
// ────────────────────────────────────────────────────────────
async function recomputarEstatisticas(db: D1Database): Promise<void> {
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
      ('atualizado_em_epoch', CAST(strftime('%s','now') AS INTEGER))`)
  ]);
}

export function _limparCacheDashboard() {
  cachedDashboard = null;
}

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


