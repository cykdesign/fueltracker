const CACHE = 'loggy-v1';
const ASSETS = [
  '/loggy/',
  '/loggy/index.html',
  '/loggy/manifest.json',
  '/loggy/icon-192.png',
  '/loggy/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('anthropic.com') || e.request.url.includes('fonts.googleapis') || e.request.url.includes('cdn.jsdelivr') || e.request.url.includes('supabase.co') || e.request.url.includes('nominatim.openstreetmap')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
