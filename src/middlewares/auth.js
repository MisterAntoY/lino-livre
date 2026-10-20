/**
 * Middleware de Autenticação Administrativa
 * Protege rotas de mutação no acervo do Lino Livre.
 *
 * SEGURANÇA: falha de forma fechada (fail-closed). Sem ADMIN_API_KEY definida
 * em produção, o acesso é BLOQUEADO — nunca existe uma chave de fallback
 * utilizável em produção.
 */
const crypto = require('node:crypto');

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PROD = NODE_ENV === 'production';

function getAdminKey() {
  const key = process.env.ADMIN_API_KEY;
  if (key && key.length >= 16) return key;
  // Em desenvolvimento aceita chave curta para facilitate testes locais
  if (!IS_PROD && key && key.length >= 8) return key;
  return null;
}

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    // Still perform a comparison to keep timing constant
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function verificarAdmin(req, res, next) {
  const adminKey = getAdminKey();

  // Fail-closed: sem chave configurada, bloqueia sempre
  if (!adminKey) {
    console.error('[auth] ADMIN_API_KEY não definida — rotas de mutação bloqueadas.');
    return res.status(503).json({
      erro: 'Serviço indisponível: chave administrativa não configurada no servidor.'
    });
  }

  const headerKey = req.headers['x-admin-key'];
  const authHeader = req.headers.authorization;
  const bearer = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : null;

  const authorized =
    (headerKey && timingSafeEqual(headerKey, adminKey)) ||
    (bearer && timingSafeEqual(bearer, adminKey));

  if (!authorized) {
    return res.status(401).json({
      erro: 'Acesso não autorizado: chave administrativa necessária'
    });
  }

  next();
}

module.exports = {
  verificarAdmin
};
