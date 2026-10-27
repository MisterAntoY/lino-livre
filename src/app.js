const express = require('express');
const path = require('node:path');
const compression = require('compression');

if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch (_) {}
}

const apiRoutes = require('./routes/api');
const { criarRateLimit } = require('./middlewares/rateLimit');

const app = express();

// Não expor a tecnologia do servidor (fingerprinting).
app.disable('x-powered-by');

// Só confia em X-Forwarded-For quando existe um proxy explicitamente
// configurado. Com um valor por omissão, qualquer cliente conseguia forjar o
// IP e contornar o rate limiting (CWE-348 / CVE-2026-90711).
const TRUST_PROXY = process.env.TRUST_PROXY;
if (TRUST_PROXY) {
  app.set('trust proxy', /^\d+$/.test(TRUST_PROXY) ? Number(TRUST_PROXY) : TRUST_PROXY);
} else {
  app.set('trust proxy', false);
}

// Compressão HTTP (Gzip/Deflate) para economizar dados móveis
app.use(compression());

// Redirecionamento HTTP -> HTTPS em produção (Lighthouse PWA / Segurança)
app.use((req, res, next) => {
  const proto = req.headers['x-forwarded-proto'];
  const host = req.headers.host || '';
  if (
    proto === 'http' &&
    process.env.NODE_ENV === 'production' &&
    !host.startsWith('localhost') &&
    !host.startsWith('127.0.0.1')
  ) {
    return res.redirect(301, `https://${host}${req.originalUrl}`);
  }
  next();
});

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
      "script-src 'self' 'sha256-VObpZF2rrhL4LG40uRUH3yRXC/1nwGniYanKxkqAWxo=' 'sha256-keHLDO8UACnw+cRVVeKuRurHKeLrwqY0rMi7Sjqgzkc=' 'sha256-wZSMpQgLrgIlbRyynN5NCOpERrzb5ODoykQ0lbDTWnQ=' 'sha256-qOpPGAwL3XogEKhDdObnXr0bcx7NIZEs41a4ijt3hWM=' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https:",
      "connect-src 'self' https://challenges.cloudflare.com",
      "media-src 'self' https:",
      "frame-src 'self' https://www.youtube.com https://open.spotify.com https://challenges.cloudflare.com",
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

// ==================== WAF DEFENSE (BAD BOTS / PROBES) ====================
const SCANNERS_RE = /\b(sqlmap|nikto|dirbuster|gobuster|acunetix|nuclei|masscan|wpscan|zgrab)\b/i;
const PROBE_PATHS_RE = /\/(\.env|\.git|wp-admin|phpmyadmin|cgi-bin|\.aws|\.docker)\b/i;

app.use((req, res, next) => {
  const ua = req.headers['user-agent'] || '';
  if (SCANNERS_RE.test(ua)) {
    return res.status(403).json({ erro: 'Acesso bloqueado por política de segurança (WAF).' });
  }
  if (PROBE_PATHS_RE.test(caminhoDecodificado(req.path))) {
    return res.status(404).send('Not Found');
  }
  next();
});

// ==================== RATE LIMITING ====================
// Instâncias criadas uma única vez (não por pedido) e com teto de memória.
const limitadorApi = criarRateLimit({
  windowMs: 60_000, max: 300, escopo: 'api',
  message: 'Demasiadas requisições. Tente novamente em instantes.'
});
const limitadorEscrita = criarRateLimit({
  windowMs: 60_000, max: 30, escopo: 'api-escrita',
  message: 'Limite de escritas excedido. Tente novamente em instantes.'
});
// Endpoints caros: proxy de imagens (memória/egress) e busca federada (fan-out).
const limitadorCapas = criarRateLimit({
  windowMs: 60_000, max: 60, escopo: 'capas',
  message: 'Limite de pedidos de capa excedido. Tente novamente em instantes.'
});
const limitadorFederada = criarRateLimit({
  windowMs: 60_000, max: 20, escopo: 'busca-federada',
  message: 'Limite de buscas federadas excedido. Tente novamente em instantes.'
});
const limitadorSugestoes = criarRateLimit({
  windowMs: 60_000, max: 5, escopo: 'sugestoes',
  message: 'Limite de sugestões excedido. Tente novamente mais tarde.'
});
const limitadorReproducao = criarRateLimit({
  windowMs: 60_000, max: 20, escopo: 'reproducao',
  message: 'Limite de registos de reprodução excedido.'
});
// Cada leitura redireccionada incrementa o contador `leituras` (escrita).
const limitadorLeitura = criarRateLimit({
  windowMs: 60_000, max: 60, escopo: 'leitura',
  message: 'Limite de aberturas de obra excedido. Tente novamente em instantes.'
});

app.use('/api', limitadorApi);
app.use('/api', (req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return limitadorEscrita(req, res, next);
  }
  next();
});
app.use('/api/capas', limitadorCapas);
app.use('/api/busca/federada', limitadorFederada);
app.use('/api/sugestoes', limitadorSugestoes);
app.use('/api/podcasts/episodios/:id/ouvir', limitadorReproducao);
app.use('/api/livros/:id/ler/:linkId', limitadorLeitura);

// ==================== PAYLOAD LIMITS ====================
// A API só aceita JSON; `extended: false` evita o parser de objetos aninhados
// do qs (superfície de prototype pollution) e `parameterLimit` limita o custo.
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb', parameterLimit: 100 }));

// ==================== ROTAS PWA & SERVICE WORKER ====================
app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, '../public/sw.js'));
});
app.get('/manifest.webmanifest', (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, '../public/manifest.webmanifest'));
});
app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, '../public/manifest.json'));
});
app.get('/offline', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/offline.html'));
});

// ==================== AGENTIC WEB & DISCOVERY (llms.txt & ai-catalog.json) ====================
app.get('/llms.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, '../public/llms.txt'));
});
app.get('/llms-full.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, '../public/llms-full.txt'));
});
app.get('/.well-known/ai-catalog.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, '../public/.well-known/ai-catalog.json'), { dotfiles: 'allow' });
});
app.get('/ai-catalog.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, '../public/ai-catalog.json'));
});

// ==================== ZERO ARMAZENAMENTO DE OBRAS ====================
// Mesmo que alguém (agente, script, PR) coloque um ficheiro de livro em
// `public/`, ele nunca é servido. O acesso a obras é sempre por 302 externo.
// As rotas explícitas acima (llms*.txt, robots.txt, ads.txt, .well-known) são
// registadas antes deste guard e continuam acessíveis.
const ARQUIVOS_NUNCA_SERVIDOS = /\.(pdf|epub|mobi|azw3?|mp3|mp4|wav|ogg|flac|txt)$/i;

/**
 * Decodifica o caminho antes de o inspecionar. O `express.static` descodifica
 * `%2e` e serve o ficheiro real; sem esta normalização, `/obra%2Epdf`
 * contornava o guard de "zero armazenamento" (CWE-180 / bypass de validação).
 * Descodifica no máximo 3 vezes para apanhar dupla/tripla codificação.
 */
function caminhoDecodificado(caminho) {
  let atual = String(caminho || '');
  for (let i = 0; i < 3; i++) {
    let proximo;
    try {
      proximo = decodeURIComponent(atual);
    } catch (_) {
      break;
    }
    if (proximo === atual) break;
    atual = proximo;
  }
  return atual.replace(/\\/g, '/');
}

app.use((req, res, next) => {
  const caminho = caminhoDecodificado(req.path);
  // Metadados de segurança e ficheiros de política não são obras.
  if (caminho.startsWith('/.well-known/') || caminho === '/robots.txt' || caminho === '/ads.txt') {
    return next();
  }
  if (ARQUIVOS_NUNCA_SERVIDOS.test(caminho)) {
    return res.status(404).json({
      erro: 'O Lino Livre não armazena nem serve ficheiros de obras. Utilize o link de redirecionamento para a fonte externa.'
    });
  }
  next();
});

// ==================== ESTÁTICOS COM CACHE ====================
// `dotfiles: 'ignore'`: ficheiros ocultos em public/ nunca são servidos por
// acidente. Os ficheiros de /.well-known/ têm rotas explícitas acima.
app.use(express.static(path.join(__dirname, '../public'), {
  dotfiles: 'ignore',
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('sw.js')) {
      res.setHeader('Service-Worker-Allowed', '/');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (filePath.endsWith('manifest.webmanifest') || filePath.endsWith('manifest.json')) {
      res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=86400');
    } else if (filePath.endsWith('llms.txt') || filePath.endsWith('llms-full.txt')) {
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=86400');
    } else if (filePath.endsWith('ai-catalog.json')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=86400');
    } else if (/\.(jpg|jpeg|png|svg|webp|woff2|woff|ttf)$/i.test(filePath)) {
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

// Páginas Públicas Institucionais & Compliance
app.get('/creditos', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/creditos.html'));
});
app.get('/legal', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/legal.html'));
});
app.get('/termos', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/termos.html'));
});
app.get('/comunidade', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/comunidade.html'));
});

// Divulgação responsável de vulnerabilidades (RFC 9116)
app.get('/.well-known/security.txt', (req, res) => {
  res.type('text/plain').send([
    'Contact: mailto:bv6alblu6@mozmail.com',
    'Expires: 2027-10-23T00:00:00.000Z',
    'Preferred-Languages: pt, en',
    'Canonical: https://lino-livre.linolivre.workers.dev/.well-known/security.txt',
    'Policy: https://lino-livre.linolivre.workers.dev/legal',
    ''
  ].join('\n'));
});

// Fallback SPA restrito: apenas navegação de browser (Accept: text/html) e
// caminhos sem extensão recebem o index. Tudo o resto devolve 404 real —
// evita "soft 404" (200 para qualquer caminho), melhora SEO e não mascara sondas.
app.use((req, res) => {
  const aceitaHtml = String(req.get('accept') || '').includes('text/html');
  const temExtensao = /\.[a-z0-9]{1,8}$/i.test(req.path);
  if ((req.method === 'GET' || req.method === 'HEAD') && aceitaHtml && !temExtensao) {
    return res.sendFile(path.join(__dirname, '../public/index.html'));
  }
  return res.status(404).json({ erro: 'Recurso não encontrado' });
});

// ==================== ERROR HANDLER ====================
// Registado no fim da pilha para apanhar erros de todas as rotas. Nunca
// devolve stack traces ao cliente.
app.use((err, req, res, next) => {
  console.error('[erro]', err.stack || err.message);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ erro: 'Erro interno do servidor' });
});

module.exports = app;
