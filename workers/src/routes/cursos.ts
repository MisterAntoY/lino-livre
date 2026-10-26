import { Hono } from 'hono';
import { Bindings } from '../types';
import { edgeLoadBalancer } from '../loadBalancer';
import { verificarAdminWorker } from '../middlewares/security';
import { validarUrlRedirecionamento } from '../utils/urlValidator';
import { obterRepo, repoSupabase, ehErroDeCota, respostaDegradada } from '../utils/repoHelper';
import { escaparLike } from '../utils/sqlHelpers';

export const cursosRouter = new Hono<{ Bindings: Bindings }>();

// 6. Cursos
cursosRouter.get('/api/cursos', async (c) => {
  const filtros = c.req.query();
  try {
    const { d1, supabase, backendMode } = obterRepo(c);
    const { data: cursos, backend, degraded } = await edgeLoadBalancer.execute({
      backendMode,
      isSupabaseConfigured: !!supabase,
      supabase: supabase ? () => supabase.cursos(filtros) : undefined,
      d1: d1 ? async () => {
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
          query += " AND plataforma LIKE ? ESCAPE '\\'";
          params.push(`%${escaparLike(plataforma)}%`);
        } else if (fonte && (fonte.toLowerCase() === 'guiadeti' || fonte.toLowerCase() === 'guia de ti')) {
          query += ' AND plataforma LIKE ?';
          params.push('%Guia de TI%');
        }
        if (youtube === '1' || youtube === 'true' || (plataforma && plataforma.toLowerCase() === 'youtube')) {
          query += ' AND plataforma LIKE ?';
          params.push('%YouTube%');
        }
        if (certificado === 'gratuito' || certificado === '1' || certificado === 'true') {
          query += " AND (instr(LOWER(descricao), 'certifica') > 0 OR instr(LOWER(plataforma), 'certifica') > 0)";
        }
        if (busca && busca.trim()) {
          const termo = `%${escaparLike(busca.trim())}%`;
          query += " AND (titulo LIKE ? ESCAPE '\\' OR descricao LIKE ? ESCAPE '\\' OR plataforma LIKE ? ESCAPE '\\')";
          params.push(termo, termo, termo);
        }

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

        return (await d1.prepare(query).bind(...params).all()).results;
      } : undefined,
      fallback: () => []
    });

    c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    c.header('X-Data-Backend', backend);
    if (degraded) c.header('X-Data-Status', 'degraded');
    return c.json(cursos);
  } catch (err: any) {
    if (ehErroDeCota(err)) return respostaDegradada(c);
    console.error('[worker]', err); return c.json({ erro: 'Erro ao buscar cursos' }, 500);
  }
});

cursosRouter.get('/api/roadmaps', async (c) => {
  const filtros = c.req.query();
  try {
    const { d1, supabase, backendMode } = obterRepo(c);
    const { data: roadmaps, backend, degraded } = await edgeLoadBalancer.execute({
      backendMode,
      isSupabaseConfigured: !!supabase,
      supabase: supabase ? () => supabase.roadmaps(filtros) : undefined,
      d1: d1 ? async () => {
        const { busca, plataforma, area } = filtros;
        let query = "SELECT * FROM cursos WHERE tipo = 'roadmap'";
        const params: any[] = [];

        if (plataforma) {
          query += " AND plataforma LIKE ? ESCAPE '\\'";
          params.push(`%${escaparLike(plataforma)}%`);
        }
        if (area) {
          query += ' AND area = ?';
          params.push(area);
        }
        if (busca && busca.trim()) {
          const termo = `%${escaparLike(busca.trim())}%`;
          query += " AND (titulo LIKE ? ESCAPE '\\' OR descricao LIKE ? ESCAPE '\\' OR plataforma LIKE ? ESCAPE '\\')";
          params.push(termo, termo, termo);
        }

        query += " ORDER BY CASE WHEN plataforma LIKE '%Roadmap.sh%' THEN 0 WHEN plataforma LIKE '%Trilha Info%' THEN 1 ELSE 2 END, titulo ASC";

        const limitParam = filtros.limit || filtros.limite;
        const pageParam = filtros.page || filtros.pagina;
        if (limitParam || pageParam) {
          const limit = Math.min(Math.max(parseInt(limitParam || '100', 10) || 100, 1), 500);
          const page = Math.min(2000, Math.max(parseInt(pageParam || '1', 10) || 1, 1));
          const offset = (page - 1) * limit;
          query += ' LIMIT ? OFFSET ?';
          params.push(limit, offset);
        }

        return (await d1.prepare(query).bind(...params).all()).results;
      } : undefined,
      fallback: () => []
    });

    c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    c.header('X-Data-Backend', backend);
    if (degraded) c.header('X-Data-Status', 'degraded');
    return c.json(roadmaps);
  } catch (err: any) {
    if (ehErroDeCota(err)) return respostaDegradada(c);
    console.error('[worker]', err); return c.json({ erro: 'Erro ao buscar roadmaps' }, 500);
  }
});

cursosRouter.get('/api/cursos/:id', async (c) => {
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
    console.error('[worker]', err); return c.json({ erro: 'Erro ao carregar curso' }, 500);
  }
});

cursosRouter.get('/api/cursos/:id/acessar', async (c) => {
  try {
    const id = c.req.param('id');
    const { d1, supabase, backendMode } = obterRepo(c);
    const { data: curso } = await edgeLoadBalancer.execute({
      backendMode,
      isSupabaseConfigured: !!supabase,
      supabase: supabase ? async () => {
        const item = await supabase.curso(id);
        if (!item) {
          const err: any = new Error('Curso não encontrado');
          err.codigoHttp = 404;
          throw err;
        }
        return item;
      } : undefined,
      d1: d1 ? async () => {
        const item = await d1.prepare('SELECT id, titulo, url FROM cursos WHERE id = ?').bind(id).first();
        if (!item) {
          const err: any = new Error('Curso não encontrado');
          err.codigoHttp = 404;
          throw err;
        }
        return item;
      } : undefined
    });

    const urlSegura = validarUrlRedirecionamento(String((curso as any).url));
    return c.redirect(urlSegura, 302);
  } catch (err: any) {
    if (err?.codigoHttp) return c.json({ erro: err.message }, err.codigoHttp);
    if (err?.message && err.message.includes('rejeitada por violar')) {
      return c.json({ erro: err.message }, 400);
    }
    console.error('[worker]', err); return c.json({ erro: 'Erro ao redirecionar para o curso' }, 500);
  }
});

cursosRouter.post('/api/cursos', verificarAdminWorker, async (c) => {
  try {
    const { titulo, area, plataforma, url, licenca, nivel, descricao } = await c.req.json<any>();
    if (!titulo || !area || !plataforma || !url) {
      return c.json({ erro: 'Campos obrigatórios: titulo, area, plataforma, url' }, 400);
    }

    let urlValida: string;
    try {
      urlValida = validarUrlRedirecionamento(url);
    } catch (err: any) {
      console.error('URL de curso inválida:', err?.message);
      return c.json({ erro: 'URL do curso inválida ou não autorizada' }, 400);
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
    console.error('[worker]', err); return c.json({ erro: 'Erro ao cadastrar curso' }, 500);
  }
});

cursosRouter.delete('/api/cursos/:id', verificarAdminWorker, async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;
    const res = await db.prepare('DELETE FROM cursos WHERE id = ?').bind(id).run();
    if (res.meta.changes === 0) return c.json({ erro: 'Curso não encontrado' }, 404);
    return c.json({ mensagem: 'Curso removido com sucesso' });
  } catch (err: any) {
    console.error('[worker]', err); return c.json({ erro: 'Erro ao remover curso' }, 500);
  }
});
