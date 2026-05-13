// Flowin Service Worker — v7 (push + no cache index)
const CACHE = 'flowin-v7';

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
  if(url.endsWith('/') || url.includes('index.html') || url.includes('flowrevis.vercel')) {
    e.respondWith(fetch(e.request, {cache:'no-store'}).catch(function(){
      return caches.match(e.request);
    }));
    return;
  }
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

// ── PUSH NOTIFICATIONS ──
self.addEventListener('push', function(event) {
  var data = {};
  try { data = event.data ? event.data.json() : {}; } catch(e) {
    try { data = { title: 'Flowin', body: event.data ? event.data.text() : '' }; } catch(e2) {}
  }
  var title = data.title || 'Flowin';
  var options = {
    body: data.body || data.message || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'flowin-' + Date.now(),
    data: data.data || data.url ? { url: data.url } : {},
    vibrate: [100, 50, 100],
    requireInteraction: false
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c.url.includes('flowrevis') && 'focus' in c) {
          if (url && url !== '/') c.navigate(url);
          return c.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ── MESSAGES depuis l'app (force reload, refresh) ──
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
