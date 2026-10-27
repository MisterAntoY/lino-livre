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
  redirecionarHttps,
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
import { capasApp, HOSTS_CAPAS_PERMITIDOS } from './routes/capas';
import { buscaFederadaApp } from './routes/buscaFederada';
import { pwaApp } from './routes/pwa';
import { livrosRouter } from './routes/livros';
export { HOSTS_CAPAS_PERMITIDOS }; // Inclui wixstatic.com para a capa real da obra #997
import { obterRepo, repoSupabase, obterRepoSupabase, ehErroDeCota, respostaDegradada } from './utils/repoHelper';
import { escaparLike, normalizarCapaUrl, normalizarUrlSegura, tabelaExiste } from './utils/sqlHelpers';
import { livrosLruCache } from './utils/lruCache';

const app = new Hono<{ Bindings: Bindings }>();

// ────────────────────────────────────────────────────────────
// CORS: leitura pública abrangente, mutações restritas.
// A API de leitura é pública (metadados abertos), mas operações de escrita só
// aceitam origens conhecidas. Pedidos sem Origin (curl, server-to-server,
// cron) continuam permitidos — a autorização real é a chave administrativa.
// ────────────────────────────────────────────────────────────
app.use('/api/*', corsMiddleware);
app.use('*', redirecionarHttps);
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
app.route('/', capasApp);
app.route('/', buscaFederadaApp);
app.route('/', pwaApp);
app.route('/', livrosRouter);

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


