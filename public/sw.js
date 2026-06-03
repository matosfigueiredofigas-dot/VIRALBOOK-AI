const CACHE_NAME = 'viralbook-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Apenas lidar com requisições GET
  if (event.request.method !== 'GET') return;

  // Apenas caches de requisições na própria origem
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Ignora chamadas de API, autenticação e rotas internas do Next.js
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next') || url.pathname.includes('/auth')) {
    return;
  }

  // Estratégia Network-First com Fallback de Cache para páginas comuns
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        
        // Clona e guarda no cache se a resposta for válida
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      })
      .catch(() => {
        // Se a rede falhar (ex: offline), tenta ler do cache
        return caches.match(event.request);
      })
  );
});
