import { Hono } from 'hono';
import { Bindings } from '../types';
import { validarUrlRedirecionamento } from '../utils/urlValidator';
import { limitarRequisicao, verificarTurnstileWorker, verificarAdminWorker } from '../middlewares/security';

export const LICENCAS_VALIDAS = ['dominio-publico', 'cc0', 'cc-by', 'cc-by-sa', 'cc-by-nc', 'outro'];

export const sugestoesRouter = new Hono<{ Bindings: Bindings }>();

// 5.5 Sugestões da Comunidade (Moderação Pública)
sugestoesRouter.post('/api/sugestoes', async (c) => {
  const bloqueio = await limitarRequisicao(c, 'sugestoes', 5);
  if (bloqueio) return bloqueio;

  try {
    let body: any;
    try {
      body = await c.req.json<any>();
    } catch {
      return c.json({ erro: 'Corpo JSON inválido' }, 400);
    }
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
      return c.json({ erro: 'URL inválida ou não autorizada' }, 400);
    }

    let capaValida: string | null = null;
    if (capa_url) {
      try {
        capaValida = validarUrlRedirecionamento(String(capa_url).slice(0, 500));
      } catch {
        return c.json({ erro: 'URL da capa inválida ou não autorizada' }, 400);
      }
    }

    if (!(await verificarTurnstileWorker(c, body?.turnstile_token))) {
      return c.json({ erro: 'Verificação anti-bot falhou. Recarregue a página e tente novamente.' }, 403);
    }

    const licencaFinal = LICENCAS_VALIDAS.includes(licenca) ? licenca : 'outro';
    const formatosValidos = ['pdf', 'epub', 'txt', 'html', 'mp3', 'mp4', 'outro'];
    const formatoFinal = formatosValidos.includes(String(formato).toLowerCase())
      ? String(formato).toLowerCase()
      : 'outro';
    const anoNum = parseInt(ano_publicacao, 10);
    const anoFinal = Number.isInteger(anoNum) && anoNum > 0 && anoNum <= 2100 ? anoNum : null;
    const categoriaNum = parseInt(categoria_id, 10);
    const categoriaFinal = Number.isInteger(categoriaNum) && categoriaNum > 0 ? categoriaNum : null;

    const db = c.env.DB;
    const res = await db.prepare(`
      INSERT INTO sugestoes (
        titulo, autor_nome, ano_publicacao, categoria_id, licenca, formato,
        url_link, capa_url, sinopse, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendente')
    `).bind(
      titulo.trim().slice(0, 250),
      autor_nome ? String(autor_nome).trim().slice(0, 150) : null,
      anoFinal,
      categoriaFinal,
      licencaFinal,
      formatoFinal,
      urlValida,
      capaValida,
      sinopse ? String(sinopse).trim().slice(0, 1000) : null
    ).run();

    return c.json({
      sucesso: true,
      mensagem: 'Sugestão recebida com sucesso! Passará pela curadoria do Lino Livre (LinoDigital) antes de ser publicada.',
      id: res.meta?.last_row_id
    }, 201);
  } catch (err: any) {
    console.error('[worker]', err);
    return c.json({ erro: 'Erro ao processar sugestão' }, 500);
  }
});

sugestoesRouter.get('/api/sugestoes', verificarAdminWorker, async (c) => {
  try {
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    const status = c.req.query('status') || 'pendente';
    const db = c.env.DB;
    const sugestoes = (await db.prepare('SELECT * FROM sugestoes WHERE status = ? ORDER BY criado_em DESC LIMIT 50').bind(status).all()).results;
    return c.json(sugestoes);
  } catch (err: any) {
    console.error('[worker]', err);
    return c.json({ erro: 'Erro ao listar sugestões' }, 500);
  }
});
