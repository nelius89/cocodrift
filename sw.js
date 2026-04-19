'use strict';

const CACHE_NAME = 'coco-shell';

const EXTERNAL = [
  'open-meteo.com',
  'nominatim.openstreetmap.org',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cloudflareinsights.com',
];

// Activar inmediatamente y limpiar cachés viejas
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Network-first: siempre intenta red, caché solo como fallback offline
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Dejar pasar APIs externas y fuentes sin interceptar
  if (EXTERNAL.some(h => url.hostname.includes(h))) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Actualizar caché con la respuesta fresca
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
