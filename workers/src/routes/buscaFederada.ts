import { Hono } from 'hono';
import { Bindings } from '../types';
import { limitarRequisicao } from '../middlewares/security';
import { obterMotor } from '../services/federacaoBusca';

export const buscaFederadaApp = new Hono<{ Bindings: Bindings }>();

buscaFederadaApp.get('/api/busca/federada', async (c) => {
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

    const seguros = (r.resultados ?? [])
      .map((x: any) => ({
        id: String(x.id ?? ''),
        titulo: String(x.titulo ?? '').replace(/[<>"']/g, ''),
        autor: x.autor ? String(x.autor).replace(/[<>"']/g, '') : null,
        ano: Number.isFinite(x.ano) ? x.ano : null,
        idioma: x.idioma ? String(x.idioma).slice(0, 12) : null,
        fonte: x.fonte,
        fontes: x.fontes,
        url: /^https?:\/\//i.test(String(x.url ?? '')) ? x.url : null,
        capa: /^https?:\/\//i.test(String(x.capa ?? '')) ? x.capa : null,
        sinopse: x.sinopse ? String(x.sinopse).replace(/[<>"']/g, '').slice(0, 300) : null,
        licenca: x.licenca,
        score: x.score
      }))
      .filter((x: any) => x.url);

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
    console.error('[worker]', err);
    return c.json({ erro: 'Erro na busca federada' }, 500);
  }
});

buscaFederadaApp.get('/api/busca/federada/diagnostico', (c) => {
  return c.json({
    motor: 'federado-distribuido-rrf',
    k: 60,
    upstreams: obterMotor().diagnostico()
  });
});
