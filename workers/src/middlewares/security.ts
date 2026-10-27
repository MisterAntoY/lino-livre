import { MiddlewareHandler } from 'hono';
import { Bindings } from '../types';
import { CSP_HEADER_WORKER } from '../index';

export function timingSafeEqualStr(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  // Comparação de comprimento variável sem saída antecipada (evita revelar o
  // tamanho da chave por temporização).
  const max = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < max; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

// ────────────────────────────────────────────────────────────
// Redirecionamento HTTP -> HTTPS (Lighthouse PWA / Segurança)
// ────────────────────────────────────────────────────────────
export const redirecionarHttps: MiddlewareHandler<{ Bindings: Bindings }> = async (c, next) => {
  const url = new URL(c.req.url);
  const proto = c.req.header('x-forwarded-proto');
  if (
    (url.protocol === 'http:' || proto === 'http') &&
    url.hostname !== 'localhost' &&
    url.hostname !== '127.0.0.1' &&
    !url.hostname.endsWith('.internal')
  ) {
    url.protocol = 'https:';
    return c.redirect(url.toString(), 301);
  }
  await next();
};

// ────────────────────────────────────────────────────────────
// Cabeçalhos de segurança HTTP globais
// ────────────────────────────────────────────────────────────
export const cabecalhosSeguranca: MiddlewareHandler<{ Bindings: Bindings }> = async (c, next) => {
  await next();
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  c.header('Cross-Origin-Opener-Policy', 'same-origin');
  c.header('Cross-Origin-Resource-Policy', 'cross-origin');
  c.header('Origin-Agent-Cluster', '?1');
  c.header('X-DNS-Prefetch-Control', 'off');
  c.header('X-Permitted-Cross-Domain-Policies', 'none');
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  c.header('Content-Security-Policy', CSP_HEADER_WORKER);
};

// ────────────────────────────────────────────────────────────
// WAF de Borda: bloqueio de scanners conhecidos, sondas e rastreadores agressivos
// ────────────────────────────────────────────────────────────
const SCANNERS_RE = /\b(sqlmap|nikto|dirbuster|gobuster|acunetix|nuclei|masscan|wpscan|zgrab)\b/i;
const PROBE_PATHS_RE = /\/(\.env|\.git|wp-admin|phpmyadmin|cgi-bin|\.aws|\.docker)\b/i;
const AGGRESSIVE_API_BOTS_RE = /\b(bytespider|ahrefsbot|semrushbot|dotbot|petalbot|mj12bot|dataforseo|screaming frog|seekport|zoominfobot)\b/i;

export const wafSeguranca: MiddlewareHandler<{ Bindings: Bindings }> = async (c, next) => {
  const ua = c.req.header('user-agent') || '';
  if (SCANNERS_RE.test(ua)) {
    return c.json({ erro: 'Acesso bloqueado por política de segurança (WAF).' }, 403);
  }
  if (c.req.path.startsWith('/api/') && AGGRESSIVE_API_BOTS_RE.test(ua)) {
    return c.json({ erro: 'Acesso automatizado a APIs bloqueado para rastreadores (WAF).' }, 403);
  }
  if (PROBE_PATHS_RE.test(c.req.path)) {
    return c.text('Not Found', 404);
  }
  await next();
};

// ────────────────────────────────────────────────────────────
// Rate Limiting (Token Bucket em Memória + Cloudflare Binding)
// ────────────────────────────────────────────────────────────
const LIMITES_MEMORIA = new Map<string, { count: number; resetAt: number }>();
const LIMITE_MAX_ENTRADAS = 10_000;

function resposta429(c: any, retrySegundos: number): any {
  return c.json(
    { erro: 'Demasiadas requisições. Tente novamente em instantes.', retry_after_s: retrySegundos },
    429,
    { 'Retry-After': String(retrySegundos) }
  );
}

export async function limitarRequisicao(c: any, escopo: string, max: number, janelaMs = 60_000): Promise<any | null> {
  const ip = c.req.header('cf-connecting-ip') || 'desconhecido';
  const chave = `${escopo}:${ip}`;

  const binding = c.env?.RATE_LIMITER;
  if (binding && typeof binding.limit === 'function') {
    try {
      const resultado = await binding.limit({ key: chave });
      if (resultado && resultado.success === false) {
        return resposta429(c, Math.ceil(janelaMs / 1000));
      }
      return null;
    } catch {
      // Binding indisponível: degrada para o contador em memória.
    }
  }

  const agora = Date.now();

  if (LIMITES_MEMORIA.size > LIMITE_MAX_ENTRADAS) {
    for (const [k, v] of LIMITES_MEMORIA) {
      if (agora > v.resetAt) LIMITES_MEMORIA.delete(k);
    }
    if (LIMITES_MEMORIA.size > LIMITE_MAX_ENTRADAS) LIMITES_MEMORIA.clear();
  }

  const entrada = LIMITES_MEMORIA.get(chave);
  if (!entrada || agora > entrada.resetAt) {
    LIMITES_MEMORIA.set(chave, { count: 1, resetAt: agora + janelaMs });
    return null;
  }

  entrada.count++;
  if (entrada.count > max) {
    return resposta429(c, Math.max(1, Math.ceil((entrada.resetAt - agora) / 1000)));
  }
  return null;
}

export const rateLimitGlobal: MiddlewareHandler<{ Bindings: Bindings }> = async (c, next) => {
  const metodo = c.req.method.toUpperCase();
  const escrita = metodo !== 'GET' && metodo !== 'HEAD' && metodo !== 'OPTIONS';
  const bloqueio = await limitarRequisicao(c, escrita ? 'api-write' : 'api-read', escrita ? 30 : 300);
  if (bloqueio) return bloqueio;
  await next();
};

// ────────────────────────────────────────────────────────────
// Middleware de Autenticação Administrativa para Rotas de Escrita
// ────────────────────────────────────────────────────────────
export const verificarAdminWorker: MiddlewareHandler<{ Bindings: Bindings }> = async (c, next) => {
  c.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  const adminKey = c.env.ADMIN_API_KEY || null;
  const headerKey = c.req.header('x-admin-key');
  const authHeader = c.req.header('authorization');
  let bearerToken: string | undefined;
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    bearerToken = authHeader.slice(7).trim();
  }
  const providedKey = headerKey || bearerToken;

  if (!adminKey || !providedKey || !timingSafeEqualStr(providedKey, adminKey)) {
    return c.json({ erro: 'Acesso não autorizado: chave administrativa necessária' }, 401);
  }

  await next();
};

// ────────────────────────────────────────────────────────────
// Anti-bot Turnstile
// ────────────────────────────────────────────────────────────
export async function verificarTurnstileWorker(c: any, token: string | undefined): Promise<boolean> {
  const secret = c.env?.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token || typeof token !== 'string' || token.length > 2048) return false;
  try {
    const corpo = new URLSearchParams({ secret, response: token });
    const ip = c.req.header('cf-connecting-ip');
    if (ip) corpo.set('remoteip', ip);
    const resposta = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: corpo
    });
    const dados: any = await resposta.json().catch(() => null);
    return dados?.success === true;
  } catch {
    return false;
  }
}
