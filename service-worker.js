const CACHE = 'tmg-v2';
const FILES = ['./', './index.html', './manifest.json', './icon.png',
  './art/park.jpg', './art/alley.jpg', './art/bakery-int.jpg', './art/street-diner-ext.jpg',
  './art/diner.jpg', './art/apartment.jpg', './art/street-night.jpg', './art/office.jpg',
  './art/liminal.jpg', './art/confrontation.jpg', './art/dawn.jpg'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(cached=> cached || fetch(e.request).then(res=>{
      const copy = res.clone();
      caches.open(CACHE).then(c=>c.put(e.request, copy));
      return res;
    }).catch(()=>cached))
  );
});
