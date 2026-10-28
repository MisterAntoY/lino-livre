import { Hono } from 'hono';
import { Bindings } from '../types';
import { limitarRequisicao } from '../middlewares/security';
import { validarUrlRedirecionamento } from '../utils/urlValidator';

export const capasApp = new Hono<{ Bindings: Bindings }>();

export const HOSTS_CAPAS_PERMITIDOS = [
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

capasApp.get('/api/capas', async (c) => {
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
  if (alvo.hostname.toLowerCase().includes('standardebooks.org')) {
    return c.redirect(alvo.href, 302);
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return c.json({ erro: 'Não foi possível obter a capa na origem', motivo: msg }, 502);
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
        return c.json({ erro: 'Redirecionamento para origem não permitida' }, 403);
      }
      atual = proximo.href;
      continue;
    }

    origem = resposta;
    break;
  }

  if (!origem) {
    return c.json({ erro: 'Demasiados redirecionamentos na origem' }, 502);
  }
  if (!origem.ok) {
    const statusCod = origem.status;
    try { await origem.body?.cancel(); } catch { /* ignorado */ }
    return c.json({ erro: 'Não foi possível obter a capa na origem', status_origem: statusCod }, 502);
  }

  const tipo = (origem.headers.get('content-type') || '').toLowerCase().split(';')[0].trim();
  if (!TIPOS_IMAGEM_PERMITIDOS.has(tipo)) {
    try { await origem.body?.cancel(); } catch { /* ignorado */ }
    return c.json({ erro: 'O conteúdo remoto não é uma imagem suportada' }, 415);
  }

  const tamanhoStr = origem.headers.get('content-length');
  if (tamanhoStr && parseInt(tamanhoStr, 10) > CAPA_TAMANHO_MAXIMO) {
    try { await origem.body?.cancel(); } catch { /* ignorado */ }
    return c.json({ erro: 'Imagem acima do limite permitido' }, 413);
  }

  const cabecalhos = new Headers();
  cabecalhos.set('Content-Type', tipo);
  cabecalhos.set('Cache-Control', CAPA_CACHE_CONTROL);
  cabecalhos.set('X-Content-Type-Options', 'nosniff');
  cabecalhos.set('Content-Security-Policy', "default-src 'none'; sandbox");
  cabecalhos.set('Cross-Origin-Resource-Policy', 'cross-origin');
  cabecalhos.set('Access-Control-Allow-Origin', '*');

  const corpo = typeof origem.arrayBuffer === 'function'
    ? new Uint8Array(await origem.arrayBuffer())
    : origem.body;
  if (corpo && typeof (corpo as any).byteLength === 'number' && (corpo as any).byteLength > CAPA_TAMANHO_MAXIMO) {
    return c.json({ erro: 'Imagem acima do limite permitido' }, 413);
  }

  const paraCache = new Response(corpo as any, { status: 200, headers: cabecalhos });
  c.executionCtx?.waitUntil(cache.put(chave, paraCache.clone()));

  return new Response(corpo as any, { status: 200, headers: cabecalhos });
});
