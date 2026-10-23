/**
 * Proxy de Capas Externas — Lino Livre
 *
 * Intermedia apenas miniaturas de capa (metadados visuais) para que a resposta
 * chegue ao navegador com um Cache-Control eficiente. Nenhum ficheiro de livro
 * é armazenado: a imagem é buscada na origem e transmitida em streaming.
 *
 * Regras de segurança:
 *  - apenas https e hosts previamente autorizados (allowlist);
 *  - validação anti-SSRF (loopback, RFC1918, CGNAT, link-local, metadados cloud,
 *    IPv6 mapeado/ULA/link-local) e resolução DNS validada antes do fetch;
 *  - redirecionamentos seguidos MANUALMENTE, com validação de cada salto
 *    (impede o pivô SSRF por 302 para 169.254.169.254);
 *  - apenas imagens raster (SVG descartado: é um documento executável e
 *    servido da nossa origem seria XSS);
 *  - limite de 5 MB aplicado durante o streaming, não depois de bufferizar.
 */

const dns = require('node:dns/promises');
const { validarUrlRedirecionamento, hostInterno } = require('../utils/urlValidator');

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
const CAPA_MAX_REDIRECTS = 3;
const TIPOS_IMAGEM_PERMITIDOS = new Set([
  'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif', 'image/gif'
]);
const STATUS_REDIRECT = new Set([301, 302, 303, 307, 308]);

function hostCapaPermitido(hostname) {
  const host = String(hostname || '').toLowerCase().replace(/\.$/, '');
  return HOSTS_CAPAS_PERMITIDOS.some((base) => host === base || host.endsWith(`.${base}`));
}

/**
 * Resolve o hostname e recusa o pedido se qualquer endereço resolvido for
 * interno. Mitiga DNS rebinding e nomes que apontam para 127.0.0.1.
 */
async function resolverHostSeguro(hostname) {
  if (hostInterno(hostname)) return false;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) || hostname.includes(':')) return true;

  let enderecos;
  try {
    enderecos = await dns.lookup(hostname, { all: true, verbatim: true });
  } catch (_) {
    return false;
  }
  if (!enderecos.length) return false;
  return enderecos.every((e) => !hostInterno(e.address));
}

function validarAlvoCapa(url) {
  const validado = validarUrlRedirecionamento(url);
  const parsed = new URL(validado);
  if (parsed.protocol !== 'https:') {
    const erro = new Error('Apenas https é permitido para capas');
    erro.codigoHttp = 403;
    throw erro;
  }
  if (!hostCapaPermitido(parsed.hostname)) {
    const erro = new Error('Origem de capa não permitida');
    erro.codigoHttp = 403;
    throw erro;
  }
  return parsed;
}

async function lerCorpoComLimite(corpo, maximo) {
  const leitor = corpo.getReader();
  const partes = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await leitor.read();
      if (done) break;
      total += value.length;
      if (total > maximo) {
        await leitor.cancel().catch(() => {});
        return null;
      }
      partes.push(value);
    }
  } finally {
    leitor.releaseLock?.();
  }
  return Buffer.concat(partes.map((p) => Buffer.from(p)));
}

async function proxy(req, res) {
  const bruto = String(req.query.u || '').trim();

  if (!bruto) {
    return res.status(400).json({ erro: 'Parâmetro "u" (URL da capa) é obrigatório' });
  }
  if (bruto.length > 1000) {
    return res.status(400).json({ erro: 'URL de capa demasiado longa' });
  }

  let alvo;
  try {
    alvo = validarAlvoCapa(bruto);
  } catch (err) {
    const status = err && err.codigoHttp ? err.codigoHttp : 400;
    return res.status(status).json({
      erro: status === 400 ? 'URL de capa inválida' : (err.message || 'Origem de capa não permitida')
    });
  }

  if (!(await resolverHostSeguro(alvo.hostname))) {
    return res.status(403).json({ erro: 'Origem de capa não permitida' });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CAPA_TIMEOUT_MS);

  try {
    let atual = alvo.href;
    let origem = null;

    for (let salto = 0; salto <= CAPA_MAX_REDIRECTS; salto++) {
      const resposta = await fetch(atual, {
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          Accept: 'image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8',
          'User-Agent': 'LinoLivre-CoverProxy/1.0 (+https://lino-livre.linolivre.workers.dev)'
        }
      });

      if (STATUS_REDIRECT.has(resposta.status)) {
        const location = resposta.headers.get('location');
        await resposta.body?.cancel().catch(() => {});
        if (!location) return res.status(502).json({ erro: 'Redirecionamento inválido na origem' });

        let proximo;
        try {
          proximo = validarAlvoCapa(new URL(location, atual).href);
        } catch (_) {
          return res.status(403).json({ erro: 'Redirecionamento de capa não permitido' });
        }
        if (!(await resolverHostSeguro(proximo.hostname))) {
          return res.status(403).json({ erro: 'Redirecionamento de capa não permitido' });
        }
        atual = proximo.href;
        continue;
      }

      origem = resposta;
      break;
    }

    if (!origem) {
      return res.status(502).json({ erro: 'Demasiados redirecionamentos na origem da capa' });
    }

    if (!origem.ok || !origem.body) {
      await origem.body?.cancel().catch(() => {});
      return res.status(502).json({ erro: 'Origem da capa indisponível' });
    }

    const tipo = String(origem.headers.get('content-type') || '').toLowerCase().split(';')[0].trim();
    if (!TIPOS_IMAGEM_PERMITIDOS.has(tipo)) {
      await origem.body.cancel().catch(() => {});
      return res.status(415).json({ erro: 'O conteúdo remoto não é uma imagem suportada' });
    }

    const declarado = Number(origem.headers.get('content-length') || '0');
    if (Number.isFinite(declarado) && declarado > CAPA_TAMANHO_MAXIMO) {
      await origem.body.cancel().catch(() => {});
      return res.status(413).json({ erro: 'Imagem acima do limite permitido' });
    }

    const buffer = await lerCorpoComLimite(origem.body, CAPA_TAMANHO_MAXIMO);
    if (buffer === null) {
      return res.status(413).json({ erro: 'Imagem acima do limite permitido' });
    }

    res.setHeader('Content-Type', tipo);
    res.setHeader('Cache-Control', CAPA_CACHE_CONTROL);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.send(buffer);
  } catch (err) {
    if (!res.headersSent) {
      if (err?.name === 'AbortError') {
        return res.status(504).json({ erro: 'Tempo esgotado ao obter a capa na origem' });
      }
      return res.status(502).json({ erro: 'Não foi possível obter a capa na origem' });
    }
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { proxy, hostCapaPermitido, resolverHostSeguro };
