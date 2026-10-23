/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Service Worker — Lino Livre PWA
 * ═══════════════════════════════════════════════════════════════════════════
 * Proporciona carregamento instantâneo, funcionamento offline para estudantes
 * e professores, cache resiliente e navegação em áreas sem internet.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const CACHE_VERSION = 'v20261024perf';
const CORE_CACHE = `linolivre-core-${CACHE_VERSION}`;
const API_CACHE = `linolivre-api-${CACHE_VERSION}`;
const IMAGE_CACHE = `linolivre-images-v1`;
const FONT_CACHE = `linolivre-fonts-v1`;

// Ficheiros essenciais do App Shell (armazenados durante a instalação)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/comunidade.html',
  '/creditos.html',
  '/legal.html',
  '/termos.html',
  '/css/style.css',
  '/fonts/lora-latin-var.woff2',
  '/fonts/lora-italic-latin-var.woff2',
  '/js/app.js',
  '/js/i18n.js',
  '/manifest.webmanifest',
  '/manifest.json',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/img/icons/icon-192.png',
  '/img/icons/icon-512.png',
  '/img/icons/icon-maskable-192.png',
  '/img/icons/icon-maskable-512.png',
  '/locales/pt.json',
  '/locales/pt-br.json',
  '/locales/en.json',
  '/locales/es.json',
  '/locales/fr.json',
  '/locales/de.json',
  '/locales/zh.json'
];

// Instalação do Service Worker: pré-carrega o app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[PWA SW] Aviso ao pré-carregar ${url}:`, err.message);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Ativação: remove caches antigos de versões anteriores
self.addEventListener('activate', (event) => {
  const currentCaches = [CORE_CACHE, API_CACHE, IMAGE_CACHE, FONT_CACHE];
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => !currentCaches.includes(name))
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégias de Interceptação de Rede
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Apenas processa requisições HTTP/HTTPS GET
  if (request.method !== 'GET') return;

  // 1. Navegação (HTML Pages) — Network-First com Fallback Offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkRes) => {
          if (networkRes.ok) {
            const copy = networkRes.clone();
            caches.open(CORE_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkRes;
        })
        .catch(async () => {
          const cachedRes = await caches.match(request);
          if (cachedRes) return cachedRes;
          const indexCached = await caches.match('/index.html');
          if (indexCached) return indexCached;
          const offlinePage = await caches.match('/offline.html');
          return offlinePage || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
        })
    );
    return;
  }

  // 2. APIs Públicas de Consulta (Dashboard, Categorias, Fontes, Livros, Cursos, Dicas, etc.)
  // Estratégia: Stale-While-Revalidate — Carregamento em 0ms no navegador, suporte offline para estudantes
  // e ZERO consumo de cota no servidor para acessos repetidos (100% Free Architecture).
  if (url.origin === location.origin && (
      url.pathname === '/api/dashboard' ||
      url.pathname === '/api/categorias' ||
      url.pathname === '/api/fontes' ||
      url.pathname === '/api/dicas' ||
      url.pathname === '/api/creditos' ||
      url.pathname === '/api/cursos' ||
      url.pathname === '/api/roadmaps' ||
      url.pathname === '/api/podcasts' ||
      url.pathname === '/api/comunidade' ||
      url.pathname === '/api/canal' ||
      (url.pathname === '/api/livros' && !url.pathname.includes('/ler'))
  )) {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        const cachedRes = await cache.match(request);
        const networkPromise = fetch(request)
          .then((networkRes) => {
            if (networkRes.ok) {
              cache.put(request, networkRes.clone());
            }
            return networkRes;
          })
          .catch(() => cachedRes);

        return cachedRes || networkPromise;
      })
    );
    return;
  }

  // Não interceptar outras rotas da API dinâmica ou redirecionamentos 302 (/api/livros/*/ler, /api/cursos/*/acessar)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 3. Imagens de capas e logotipos (Same-origin ou Cross-origin) — Cache-First
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|ico)$/i)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        try {
          const networkRes = await fetch(request);
          if (networkRes.ok || networkRes.type === 'opaque') {
            cache.put(request, networkRes.clone());
          }
          return networkRes;
        } catch (_) {
          return new Response('', { status: 404 });
        }
      })
    );
    return;
  }

  // 4. Fontes Web (Google Fonts / Noto / Lora) — Cache-First
  if (request.destination === 'font' || url.hostname.includes('gstatic.com') || url.hostname.includes('googleapis.com')) {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        try {
          const networkRes = await fetch(request);
          if (networkRes.ok || networkRes.type === 'opaque') {
            cache.put(request, networkRes.clone());
          }
          return networkRes;
        } catch (_) {
          return new Response('', { status: 504 });
        }
      })
    );
    return;
  }

  // 5. Assets Estáticos do Core (CSS, JS, Locales) — Stale-While-Revalidate
  event.respondWith(
    caches.open(CORE_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const networkPromise = fetch(request)
        .then((networkRes) => {
          if (networkRes.ok) {
            cache.put(request, networkRes.clone());
          }
          return networkRes;
        })
        .catch(() => cached);

      return cached || networkPromise;
    })
  );
});

// Mensagens vindas do cliente
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data === 'clearCache') {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
});
