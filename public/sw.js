const cacheItems = 'items_v1'

const resourcesToCache = [
    "/",
    "/index.html",
    "/styles.css",
    "/js/index.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

self.addEventListener('install', (event) =>{
    event.waitUntil(
        caches.open(cacheItems)
        .then(cache => (cache.addAll(resourcesToCache))),
    );
});

self.addEventListener('fetch', function(event) {
    console.log(event.request.url);
   
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
   });