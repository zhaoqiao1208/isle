const CACHE_NAME = 'isle-v1';
const PRECACHE = [
  '/',
  '/index.html',
  '/music-shared.js',
  '/visitor.js',
  '/cottage.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Network first, fall back to cache
  event.respondWith(
    fetch(event.request).then(response => {
      // Cache successful GET requests
      if (event.request.method === 'GET' && response.status === 200) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => caches.match(event.request))
  );
});
