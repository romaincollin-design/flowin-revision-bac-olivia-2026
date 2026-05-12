// Flowin Service Worker — v6 (no cache index.html)
const CACHE = 'flowin-v6';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(names.map(function(n){ return caches.delete(n); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  if(e.request.method !== 'GET') return;
  var url = e.request.url;
  // index.html : toujours depuis le réseau, jamais en cache
  if(url.endsWith('/') || url.includes('index.html') || url.includes('flowrevis.vercel')) {
    e.respondWith(fetch(e.request, {cache:'no-store'}).catch(function(){
      return caches.match(e.request);
    }));
    return;
  }
  // Assets (icônes, manifest) : cache
  e.respondWith(
    caches.match(e.request).then(function(cached){
      return cached || fetch(e.request).then(function(resp){
        if(resp.ok) {
          var c = resp.clone();
          caches.open(CACHE).then(function(cache){ cache.put(e.request, c); });
        }
        return resp;
      });
    })
  );
});
