import { Hono } from 'hono';
import { Bindings } from '../types';
import { limitarRequisicao } from '../middlewares/security';
import { repoSupabase } from '../utils/repoHelper';
import { escaparLike } from '../utils/sqlHelpers';

export const podcastsRouter = new Hono<{ Bindings: Bindings }>();

// 9. Podcasts & Audiolivros (Spotify for Creators)
podcastsRouter.get('/api/podcasts', async (c) => {
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
      query += ` AND s.categoria LIKE ? ESCAPE '\\'`;
      params.push(`%${escaparLike(categoria.trim())}%`);
    }

    if (busca && busca.trim()) {
      query += ` AND (s.titulo LIKE ? ESCAPE '\\' OR s.descricao LIKE ? ESCAPE '\\')`;
      const term = `%${escaparLike(busca.trim())}%`;
      params.push(term, term);
    }

    query += ` GROUP BY s.id ORDER BY s.id ASC`;

    const result = await c.env.DB.prepare(query).bind(...params).all();
    return c.json(result.results || []);
  } catch (err: any) {
    console.error('[worker]', err); return c.json({ erro: 'Erro ao listar podcasts' }, 500);
  }
});

podcastsRouter.get('/api/podcasts/episodios/recentes', async (c) => {
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
    console.error('[worker]', err); return c.json({ erro: 'Erro ao listar episódios recentes' }, 500);
  }
});

podcastsRouter.get('/api/podcasts/:slugOuId', async (c) => {
  try {
    const { slugOuId } = c.req.param();
    const repo = repoSupabase(c);
    if (repo) {
      try {
        const show = await repo.podcast(slugOuId);
        if (show) return c.json(show);
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
    console.error('[worker]', err); return c.json({ erro: 'Erro ao obter podcast' }, 500);
  }
});

podcastsRouter.post('/api/podcasts/episodios/:id/ouvir', async (c) => {
  const bloqueio = await limitarRequisicao(c, 'ouvir', 20);
  if (bloqueio) return bloqueio;

  try {
    const id = parseInt(c.req.param('id'), 10);
    if (!Number.isInteger(id) || id <= 0) {
      return c.json({ erro: 'ID do episódio inválido' }, 400);
    }
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
    console.error('[worker]', err); return c.json({ erro: 'Erro ao registar reprodução' }, 500);
  }
});
