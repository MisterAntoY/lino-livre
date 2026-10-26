import { Hono } from 'hono';
import { Bindings } from '../types';
import { edgeLoadBalancer } from '../loadBalancer';
import { verificarAdminWorker } from '../middlewares/security';
import { obterRepo, ehErroDeCota, respostaDegradada } from '../utils/repoHelper';
import { escaparLike, tabelaExiste } from '../utils/sqlHelpers';

export const autoresRouter = new Hono<{ Bindings: Bindings }>();

// 3. Autores
autoresRouter.get('/api/autores', async (c) => {
  try {
    const busca = (c.req.query('busca') || c.req.query('q') || '').trim();
    const nomeExato = (c.req.query('nome') || '').trim();
    const limitParam = c.req.query('limit') || c.req.query('limite');
    const pageParam = c.req.query('page') || c.req.query('pagina');
    const limit = Math.min(Math.max(parseInt(limitParam || '500', 10) || 500, 1), 500);
    const page = Math.min(2000, Math.max(parseInt(pageParam || '1', 10) || 1, 1));

    const { d1, supabase, backendMode } = obterRepo(c);
    const { data: autores, backend, degraded } = await edgeLoadBalancer.execute({
      backendMode,
      isSupabaseConfigured: !!supabase,
      supabase: supabase ? () => supabase.autores({ busca, nome: nomeExato, limit, page }) : undefined,
      d1: d1 ? async () => {
        const temTotais = await tabelaExiste(d1, 'autor_totais');
        let query = temTotais
          ? `SELECT a.*, COALESCE(t.total, 0) AS total_livros
               FROM autores a LEFT JOIN autor_totais t ON t.autor_id = a.id`
          : `SELECT a.*, 0 AS total_livros FROM autores a`;
        const params: any[] = [];

        if (nomeExato) {
          query += ' WHERE a.nome = ? COLLATE NOCASE';
          params.push(nomeExato);
        } else if (busca) {
          query += " WHERE a.nome LIKE ? ESCAPE '\\'";
          params.push(`%${escaparLike(busca)}%`);
        }

        query += ' ORDER BY a.nome ASC';

        if (limitParam || pageParam) {
          const offset = (page - 1) * limit;
          query += ' LIMIT ? OFFSET ?';
          params.push(limit, offset);
        } else {
          query += ' LIMIT ?';
          params.push(limit);
        }

        const res = (await d1.prepare(query).bind(...params).all()).results as any[];

        if (!temTotais && res.length > 0) {
          const ids = res.map((a: any) => a.id);
          const contagens = (await d1.prepare(
            `SELECT autor_id, COUNT(*) AS total FROM livros
             WHERE autor_id IN (${ids.map(() => '?').join(',')}) GROUP BY autor_id`
          ).bind(...ids).all()).results as any[];
          const porAutor = new Map(contagens.map((r: any) => [Number(r.autor_id), Number(r.total)]));
          for (const a of res) a.total_livros = porAutor.get(a.id) || 0;
        }
        return res;
      } : undefined,
      fallback: () => []
    });

    c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    c.header('X-Data-Backend', backend);
    if (degraded) c.header('X-Data-Status', 'degraded');
    return c.json(autores);
  } catch (err: any) {
    if (ehErroDeCota(err)) return respostaDegradada(c);
    console.error('[worker]', err); return c.json({ erro: 'Erro ao buscar autores' }, 500);
  }
});

autoresRouter.get('/api/autores/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { d1, supabase, backendMode } = obterRepo(c);
    const { data: autor } = await edgeLoadBalancer.execute({
      backendMode,
      isSupabaseConfigured: !!supabase,
      supabase: supabase ? async () => {
        const a = await supabase.autor(id);
        if (!a) {
          const err: any = new Error('Autor não encontrado');
          err.codigoHttp = 404;
          throw err;
        }
        return a;
      } : undefined,
      d1: d1 ? async () => {
        const a = await d1.prepare('SELECT * FROM autores WHERE id = ?').bind(id).first();
        if (!a) {
          const err: any = new Error('Autor não encontrado');
          err.codigoHttp = 404;
          throw err;
        }
        const livros = (await d1.prepare('SELECT id, titulo, ano_publicacao FROM livros WHERE autor_id = ?').bind(id).all()).results;
        return { ...a, livros };
      } : undefined
    });
    return c.json(autor);
  } catch (err: any) {
    if (err?.codigoHttp) return c.json({ erro: err.message }, err.codigoHttp);
    console.error('[worker]', err); return c.json({ erro: 'Erro ao buscar autor' }, 500);
  }
});

autoresRouter.post('/api/autores', verificarAdminWorker, async (c) => {
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
    console.error('[worker]', err); return c.json({ erro: 'Erro ao cadastrar autor' }, 500);
  }
});

autoresRouter.put('/api/autores/:id', verificarAdminWorker, async (c) => {
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
    console.error('[worker]', err); return c.json({ erro: 'Erro ao atualizar autor' }, 500);
  }
});

autoresRouter.delete('/api/autores/:id', verificarAdminWorker, async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const res = await db.prepare('DELETE FROM autores WHERE id = ?').bind(id).run();
    if (res.meta.changes === 0) return c.json({ erro: 'Autor não encontrado' }, 404);
    return c.json({ mensagem: 'Autor removido com sucesso' });
  } catch (err: any) {
    console.error('[worker]', err); return c.json({ erro: 'Erro ao remover autor' }, 500);
  }
});
