/**
 * Verificação server-side do Cloudflare Turnstile (CAPTCHA invisível).
 *
 * É OPCIONAL por desenho: só entra em acção quando `TURNSTILE_SECRET_KEY` está
 * configurada. Sem chave, a rota continua protegida por rate limiting e
 * validação — nunca há uma "chave de teste" pública que abra a porta.
 *
 * Documentação: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TIMEOUT_MS = 5000;

/**
 * @param {{ token?: string, ip?: string, secret?: string, fetchImpl?: Function }} opcoes
 * @returns {Promise<{ configurado: boolean, ok: boolean, motivo?: string }>}
 */
async function verificarTurnstile({ token, ip, secret, fetchImpl = fetch } = {}) {
  if (!secret) {
    return { configurado: false, ok: true };
  }

  if (!token || typeof token !== 'string' || token.length > 2048) {
    return { configurado: true, ok: false, motivo: 'token_ausente' };
  }

  try {
    const corpo = new URLSearchParams({ secret, response: token });
    if (ip) corpo.set('remoteip', ip);

    const resposta = await fetchImpl(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: corpo,
      signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout
        ? AbortSignal.timeout(TIMEOUT_MS)
        : undefined
    });

    const dados = await resposta.json().catch(() => null);
    if (dados && dados.success === true) {
      return { configurado: true, ok: true };
    }
    const codigos = Array.isArray(dados?.['error-codes']) ? dados['error-codes'].join(',') : 'desconhecido';
    return { configurado: true, ok: false, motivo: codigos };
  } catch (_) {
    return { configurado: true, ok: false, motivo: 'falha_de_rede' };
  }
}

module.exports = { verificarTurnstile, SITEVERIFY_URL };
