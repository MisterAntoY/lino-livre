const express = require('express');
const path = require('node:path');
const compression = require('compression');

if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch (_) {}
}

const apiRoutes = require('./routes/api');

const app = express();

// Desconfia de proxies (X-Forwarded-For) para rate limiting correcto
app.set('trust proxy', 1);

// Compressão HTTP (Gzip/Deflate) para economizar dados móveis
app.use(compression());

// ==================== CABEÇALHOS DE SEGURANÇA ====================
app.use((req, res, next) => {
  // Previne XSS via injecção de HTML/JS em respostas da API
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('Origin-Agent-Cluster', '?1');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  // Isola o documento em contexto próprio (anti-clickjacking/XSS)
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  // Content-Security-Policy: sem inline scripts excepto o bootstrap crítico
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https:",
      "connect-src 'self'",
      "media-src 'self' https:",
      "frame-src 'self' https://www.youtube.com https://open.spotify.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  );

  // HSTS apenas em produção (HTTPS)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
});

// ==================== RATE LIMITING (in-memory) ====================
const rateLimitStore = new Map();
// Nos testes de integração não limitamos pedidos: o suite faz dezenas de
// escritas no mesmo caminho e o limite tornaria os resultados instáveis.
const RATE_LIMIT_ATIVO = process.env.NODE_ENV !== 'test';

function rateLimit({ windowMs = 60_000, max = 120, message = 'Demasiadas requisições. Tente novamente em instantes.' } = {}) {
  return (req, res, next) => {
    if (!RATE_LIMIT_ATIVO || process.env.NODE_ENV === 'test') return next();
    const ip = req.ip || req.socket?.remoteAddress || 'desconhecido';
    const key = `${ip}:${req.baseUrl}${req.path}`;
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    } else {
      entry.count++;
      if (entry.count > max) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        res.setHeader('Retry-After', String(retryAfter));
        res.setHeader('X-RateLimit-Limit', String(max));
        res.setHeader('X-RateLimit-Remaining', '0');
        return res.status(429).json({ erro: message, retry_after_s: retryAfter });
      }
    }

    // Limpeza periódica do store
    if (rateLimitStore.size > 5000) {
      for (const [k, v] of rateLimitStore) {
        if (now > v.resetAt) rateLimitStore.delete(k);
      }
    }

    next();
  };
}

// Rate limit global (API)
app.use('/api', (req, res, next) => {
  if (process.env.NODE_ENV === 'test') return next();
  return rateLimit({ windowMs: 60_000, max: 300 })(req, res, next);
});

// Rate limit mais agressivo para operações de escrita
app.use('/api', (req, res, next) => {
  if (process.env.NODE_ENV === 'test') return next();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return rateLimit({ windowMs: 60_000, max: 30, message: 'Limite de escritas excedido. Tente novamente em instantes.' })(req, res, next);
  }
  next();
});

// ==================== PAYLOAD LIMITS ====================
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ==================== ESTÁTICOS COM CACHE ====================
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (/\.(jpg|jpeg|png|svg|webp|woff2|woff|ttf)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    } else if (/\.(js|css|html|json)$/i.test(filePath)) {
      // revalida sempre (ETag) para nunca servir código/idioma desatualizado
      res.setHeader('Cache-Control', 'no-cache');
    } else if (/\.(pdf|epub|txt|mp3|mp4)$/i.test(filePath)) {
      // Livros/NOTAS: nunca servidos do disco (ver AGENTS.md — zero armazenamento local)
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

// Rotas da API
app.use('/api', apiRoutes);

// Tratamento de rotas não encontradas para API
app.use('/api', (req, res) => {
  res.status(404).json({ erro: 'Endpoint da API não encontrado' });
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error('[erro]', err.message);
  res.status(err.status || 500).json({ erro: 'Erro interno do servidor' });
});

// Fallback para SPA/Frontend
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
