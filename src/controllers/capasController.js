/**
 * Proxy de Capas Externas — Lino Livre
 *
 * Intermedia apenas miniaturas de capa (metadados visuais) para que a resposta
 * chegue ao navegador com um Cache-Control eficiente. Nenhum ficheiro de livro
 * é armazenado: a imagem é buscada na origem e transmitida em streaming.
 *
 * Regras de segurança:
 *  - apenas http(s) e hosts previamente autorizados (allowlist);
 *  - validação anti-SSRF (bloqueio de loopback, redes privadas e metadados cloud);
 *  - revalidação do URL final após redirecionamentos;
 *  - apenas Content-Type image/* e limite de 5 MB por imagem.
 */

const { validarUrlRedirecionamento } = require('../utils/urlValidator');

const HOSTS_CAPAS_PERMITIDOS = [
  'gutenberg.org',
  'openlibrary.org',
  'archive.org',
  'githubusercontent.com',
  'guiadeti.com.br',
  'supabase.co',
  'unsplash.com',
  'wikimedia.org',
  'africanstorybook.org',
  'standardebooks.org'
];

const CAPA_CACHE_CONTROL = 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=604800';
const CAPA_TAMANHO_MAXIMO = 5 * 1024 * 1024;
const CAPA_TIMEOUT_MS = 8000;

function hostCapaPermitido(hostname) {
  const host = String(hostname || '').toLowerCase();
  return HOSTS_CAPAS_PERMITIDOS.some((base) => host === base || host.endsWith(`.${base}`));
}

async function proxy(req, res) {
  const bruto = String(req.query.u || '').trim();

  if (!bruto) {
    return res.status(400).json({ erro: 'Parâmetro "u" (URL da capa) é obrigatório' });
  }
  if (bruto.length > 1000) {
    return res.status(400).json({ erro: 'URL de capa demasiado longa' });
  }

  let destino;
  try {
    destino = validarUrlRedirecionamento(bruto);
  } catch (_) {
    return res.status(400).json({ erro: 'URL de capa inválida' });
  }

  const alvo = new URL(destino);
  // Forçar sempre protocolo seguro HTTPS
  if (alvo.protocol === 'http:') {
    alvo.protocol = 'https:';
  }

  // African Storybook tem certificado SSL expirado e ficheiros inexistentes na origem: redirecionar para capa padrão local segura
  if (alvo.hostname.toLowerCase().includes('africanstorybook.org')) {
    return res.redirect(302, '/capas/dom_casmurro.jpg');
  }

  if (alvo.protocol !== 'https:' || !hostCapaPermitido(alvo.hostname)) {
    return res.status(403).json({ erro: 'Origem de capa não permitida' });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CAPA_TIMEOUT_MS);

  try {
    const origem = await fetch(alvo.href, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        Accept: 'image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8',
        'User-Agent': 'LinoLivre-CoverProxy/1.0 (+https://lino-livre.linolivre.workers.dev)'
      }
    });

    if (!origem.ok) {
      return res.status(502).json({ erro: 'Origem da capa indisponível' });
    }

    // Revalida o destino final para bloquear redirecionamentos para rede interna.
    try {
      validarUrlRedirecionamento(origem.url);
    } catch (_) {
      return res.status(403).json({ erro: 'Redirecionamento de capa não permitido' });
    }

    const tipo = String(origem.headers.get('content-type') || '').toLowerCase();
    if (!tipo.startsWith('image/')) {
      return res.status(415).json({ erro: 'O conteúdo remoto não é uma imagem' });
    }

    const buffer = Buffer.from(await origem.arrayBuffer());
    if (buffer.length > CAPA_TAMANHO_MAXIMO) {
      return res.status(413).json({ erro: 'Imagem acima do limite permitido' });
    }

    res.setHeader('Content-Type', tipo);
    res.setHeader('Cache-Control', CAPA_CACHE_CONTROL);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.send(buffer);
  } catch (err) {
    if (!res.headersSent) {
      return res.status(502).json({ erro: 'Não foi possível obter a capa na origem' });
    }
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { proxy };
