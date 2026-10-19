/**
 * Service Worker for Lino Livre
 * Caches static assets for offline access and faster subsequent loads
 */

const CACHE_NAME = 'linolivre-v20261009';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css?v=20261009',
  '/js/i18n.js?v=20261009',
  '/js/app.js?v=20261009',
];

const FONT_CACHE = 'linolivre-fonts-v1';
const IMAGE_CACHE = 'linolivre-images-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== FONT_CACHE && name !== IMAGE_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip cross-origin requests (except fonts and images)
  if (url.origin !== location.origin) {
    // Allow fonts and images from external origins
    if (request.destination === 'font' || request.destination === 'image') {
      // Handle external fonts/images with cache-first strategy
      event.respondWith(
        caches.open(FONT_CACHE).then(async (cache) => {
          const cached = await cache.match(request);
          if (cached) return cached;
          
          try {
            const response = await fetch(request);
            if (response.ok) cache.put(request, response.clone());
            return response;
          } catch (e) {
            return new Response('', { status: 504 });
          }
        })
      );
    }
    return;
  }
  
  // Handle same-origin requests
  if (request.destination === 'font') {
    // Fonts: cache-first with network fallback
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch (e) {
          return new Response('', { status: 504 });
        }
      })
    );
    return;
  }
  
  if (request.destination === 'image') {
    // Images: cache-first with network fallback
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch (e) {
          return new Response('', { status: 504 });
        }
      })
    );
    return;
  }
  
  // HTML, CSS, JS: network-first with cache fallback
  if (['document', 'script', 'style'].includes(request.destination) || 
      url.pathname.endsWith('.html') || 
      url.pathname.endsWith('.css') || 
      url.pathname.endsWith('.js')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
  
  // Default: network-first
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Handle messages from clients
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

console.log('[SW] Lino Livre Service Worker loaded');