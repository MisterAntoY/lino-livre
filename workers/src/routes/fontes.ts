import { Hono } from 'hono';
import { Bindings } from '../types';
import { edgeLoadBalancer } from '../loadBalancer';
import { DIMENSOES_ESTATICAS } from '../data/constants';
import { verificarAdminWorker } from '../middlewares/security';
import { executarImportacaoD1 } from '../services/importer';
import { obterRepo, ehErroDeCota, respostaDegradada } from '../utils/repoHelper';

export const fontesRouter = new Hono<{ Bindings: Bindings }>();

// 5. Fontes e Importação
fontesRouter.get('/api/fontes', async (c) => {
  try {
    const { d1, supabase, backendMode } = obterRepo(c);
    const { data: fontes, backend, degraded } = await edgeLoadBalancer.execute({
      backendMode,
      isSupabaseConfigured: !!supabase,
      supabase: supabase ? () => supabase.fontes() : undefined,
      d1: d1 ? async () => {
        const res = await d1.prepare(`
          SELECT f.id, f.slug, f.nome, f.tipo, f.url_base, f.ativa,
                 COALESCE(k.total, 0) AS total_livros
          FROM fontes f
          LEFT JOIN contadores k ON k.dimensao = 'fonte' AND k.chave = CAST(f.id AS TEXT)
          WHERE f.ativa = 1
          ORDER BY f.id ASC
        `).all();
        return res.results;
      } : undefined,
      fallback: () => DIMENSOES_ESTATICAS.fontes
    });

    c.header('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    c.header('X-Data-Backend', backend);
    if (degraded) c.header('X-Data-Status', 'degraded');
    return c.json(fontes);
  } catch (err: any) {
    if (ehErroDeCota(err)) {
      return respostaDegradada(c, DIMENSOES_ESTATICAS.fontes);
    }
    console.error('[worker]', err); return c.json({ erro: 'Erro ao listar fontes' }, 500);
  }
});

fontesRouter.post('/api/import', verificarAdminWorker, async (c) => {
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
    console.error('[worker]', err); return c.json({ erro: 'Erro ao iniciar importação' }, 500);
  }
});

fontesRouter.get('/api/import/:id', verificarAdminWorker, async (c) => {
  try {
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    const id = parseInt(c.req.param('id'), 10);
    if (!Number.isInteger(id) || id <= 0) {
      return c.json({ erro: 'ID de importação inválido' }, 400);
    }
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
    console.error('[worker]', err); return c.json({ erro: 'Erro ao consultar status da importação' }, 500);
  }
});
