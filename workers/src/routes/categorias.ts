import { Hono } from 'hono';
import { Bindings } from '../types';
import { edgeLoadBalancer } from '../loadBalancer';
import { DIMENSOES_ESTATICAS } from '../data/constants';
import { verificarAdminWorker } from '../middlewares/security';
import { obterRepo, ehErroDeCota, respostaDegradada } from '../utils/repoHelper';

export const categoriasRouter = new Hono<{ Bindings: Bindings }>();

// 2. Categorias / Áreas do Conhecimento
categoriasRouter.get('/api/categorias', async (c) => {
  try {
    const { d1, supabase, backendMode } = obterRepo(c);
    const { data: categorias, backend, degraded } = await edgeLoadBalancer.execute({
      backendMode,
      isSupabaseConfigured: !!supabase,
      supabase: supabase ? () => supabase.categorias() : undefined,
      d1: d1 ? async () => {
        const res = await d1.prepare(`
          SELECT c.*, COALESCE(k.total, 0) AS total_livros
          FROM categorias c
          LEFT JOIN contadores k ON k.dimensao = 'categoria' AND k.chave = CAST(c.id AS TEXT)
          ORDER BY c.nome ASC
        `).all();
        return res.results;
      } : undefined,
      fallback: () => DIMENSOES_ESTATICAS.categorias
    });

    c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    c.header('X-Data-Backend', backend);
    if (degraded) c.header('X-Data-Status', 'degraded');
    return c.json(categorias);
  } catch (err: any) {
    if (ehErroDeCota(err)) {
      return respostaDegradada(c, DIMENSOES_ESTATICAS.categorias);
    }
    console.error('[worker]', err); return c.json({ erro: 'Erro ao buscar categorias' }, 500);
  }
});

categoriasRouter.get('/api/categorias/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const categoria = await db.prepare('SELECT * FROM categorias WHERE id = ?').bind(id).first();
    if (!categoria) return c.json({ erro: 'Categoria não encontrada' }, 404);
    return c.json(categoria);
  } catch (err: any) {
    console.error('[worker]', err); return c.json({ erro: 'Erro ao buscar categoria' }, 500);
  }
});

categoriasRouter.post('/api/categorias', verificarAdminWorker, async (c) => {
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
    console.error('[worker]', err); return c.json({ erro: 'Erro ao cadastrar categoria' }, 500);
  }
});

categoriasRouter.put('/api/categorias/:id', verificarAdminWorker, async (c) => {
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
    console.error('[worker]', err); return c.json({ erro: 'Erro ao atualizar categoria' }, 500);
  }
});

categoriasRouter.delete('/api/categorias/:id', verificarAdminWorker, async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const res = await db.prepare('DELETE FROM categorias WHERE id = ?').bind(id).run();
    if (res.meta.changes === 0) return c.json({ erro: 'Categoria não encontrada' }, 404);
    return c.json({ mensagem: 'Categoria removida com sucesso' });
  } catch (err: any) {
    console.error('[worker]', err); return c.json({ erro: 'Erro ao remover categoria' }, 500);
  }
});
