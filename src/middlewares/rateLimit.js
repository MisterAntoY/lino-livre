/**
 * Rate limiting em memória — Lino Livre
 *
 * Cada limiter tem o seu próprio balde, indexado por IP (e, opcionalmente, por
 * um discriminador adicional como a rota). O mapa é limpo periodicamente e tem
 * um teto rígido, para que um atacante que rode IPs (ou falsifique
 * X-Forwarded-For) não consiga transformar o próprio limitador num vetor de
 * consumo de memória.
 */

const LIMITE_ENTRADAS = 20_000;

function limparExpirados(mapa, agora) {
  for (const [k, v] of mapa) {
    if (agora > v.resetAt) mapa.delete(k);
  }
}

function criarRateLimit({
  windowMs = 60_000,
  max = 120,
  message = 'Demasiadas requisições. Tente novamente em instantes.',
  escopo = 'geral',
  ativo = process.env.NODE_ENV !== 'test'
} = {}) {
  const balde = new Map();
  let ultimaLimpeza = 0;

  return function rateLimit(req, res, next) {
    if (!ativo) return next();

    const ip = req.ip || req.socket?.remoteAddress || 'desconhecido';
    const chave = `${escopo}:${ip}`;
    const agora = Date.now();
    const entrada = balde.get(chave);

    if (!entrada || agora > entrada.resetAt) {
      if (balde.size >= LIMITE_ENTRADAS) {
        limparExpirados(balde, agora);
        // Ainda cheio: descarta a entrada mais antiga para nunca crescer sem limite.
        if (balde.size >= LIMITE_ENTRADAS) balde.delete(balde.keys().next().value);
      }
      balde.set(chave, { count: 1, resetAt: agora + windowMs });
    } else {
      entrada.count++;
      if (entrada.count > max) {
        const retryAfter = Math.max(1, Math.ceil((entrada.resetAt - agora) / 1000));
        res.setHeader('Retry-After', String(retryAfter));
        res.setHeader('X-RateLimit-Limit', String(max));
        res.setHeader('X-RateLimit-Remaining', '0');
        return res.status(429).json({ erro: message, retry_after_s: retryAfter });
      }
    }

    if (agora - ultimaLimpeza > 60_000) {
      ultimaLimpeza = agora;
      limparExpirados(balde, agora);
    }

    next();
  };
}

module.exports = { criarRateLimit };
