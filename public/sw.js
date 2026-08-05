/* ═══════════════════════════════════════════════════════════════════════════
   SERVICE WORKER WITH WORKBOX CACHING STRATEGY
   - Static Assets: Precached & Stale-While-Revalidate
   - Images & Media: Cache-First with Expiration
   - Google Fonts: Cache-First & Stale-While-Revalidate
   - API & Data Responses: Network-First with Cache Fallback
   - Full Offline Support & Navigation Fallback
   ═══════════════════════════════════════════════════════════════════════════ */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

if (self.workbox) {
  workbox.core.setConfig({ debug: false });
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  const CACHE_NAMES = {
    static: 'abakra-static-v2',
    images: 'abakra-images-v2',
    fonts: 'abakra-fonts-v2',
    api: 'abakra-api-v2',
  };

  // 1. Precache Core App Shell Assets
  const PRECACHE_ASSETS = [
    { url: '/', revision: 'v2' },
    { url: '/index.html', revision: 'v2' },
    { url: '/manifest.json', revision: 'v2' },
    { url: '/images/space-bg.jpg', revision: 'v2' },
    { url: '/images/hero-bg.jpg', revision: 'v2' },
    { url: '/images/hero-night.jpg', revision: 'v2' },
    { url: '/images/emblem-star.jpg', revision: 'v2' },
  ];

  workbox.precaching.precacheAndRoute(PRECACHE_ASSETS);

  // 2. Cache Images & Visual Media with CacheFirst strategy
  workbox.routing.registerRoute(
    ({ request, url }) =>
      request.destination === 'image' ||
      url.pathname.startsWith('/images/') ||
      /\.(?:png|jpg|jpeg|svg|webp|gif|ico)$/i.test(url.pathname),
    new workbox.strategies.CacheFirst({
      cacheName: CACHE_NAMES.images,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          purgeOnQuotaError: true,
        }),
      ],
    })
  );

  // 3. Cache Google Fonts (Stylesheets & Font Files)
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
    })
  );

  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
      cacheName: CACHE_NAMES.fonts,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 Year
        }),
      ],
    })
  );

  // 4. Cache JS, CSS, Web Workers
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'worker',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE_NAMES.static,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // 5. Cache API & Data Responses (Firebase, REST APIs, JSON data)
  workbox.routing.registerRoute(
    ({ url, request }) =>
      url.pathname.startsWith('/api/') ||
      url.hostname.includes('firestore.googleapis.com') ||
      url.hostname.includes('firebase') ||
      request.headers.get('accept')?.includes('application/json'),
    new workbox.strategies.NetworkFirst({
      cacheName: CACHE_NAMES.api,
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        }),
      ],
    })
  );

  // 6. Navigation Fallback for Single Page Application (SPA)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: CACHE_NAMES.static,
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

  // Catch-all offline fallback
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.mode === 'navigate') {
      return (await caches.match('/index.html')) || Response.error();
    }
    return Response.error();
  });
} else {
  // Fallback Service Worker implementation if Workbox CDN fails to load
  const FALLBACK_CACHE = 'abakra-fallback-v2';
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(FALLBACK_CACHE).then((cache) => {
        return cache.addAll(['/', '/index.html', '/manifest.json']).catch(() => {});
      })
    );
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    self.clients.claim();
  });

  self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request)
            .then((response) => {
              if (response && response.status === 200) {
                const clone = response.clone();
                caches.open(FALLBACK_CACHE).then((cache) => cache.put(event.request, clone));
              }
              return response;
            })
            .catch(() => caches.match('/index.html'))
        );
      })
    );
  });
}
