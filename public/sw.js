const cacheItems = 'items_v1'
const cacheData = 'budget_v1'

// informations that will be on the cacheItems
const resourcesToCache = [
    "/",
    "/index.html",
    "/styles.css",
    "/js/index.js",
    "/js/db.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

// open on cache after the service worker is installed
self.addEventListener('install', (event) =>{
    event.waitUntil(
        caches.open(cacheItems)
        .then(cache => (cache.addAll(resourcesToCache))),
    );
    event.waitUntil(
        caches.open(cacheItems)
        .then(cache => (cache.add("/api/transaction"))),
    );
});

self.addEventListener('fetch', function(event) {
// inform to the browser to check future events 
    event.respondWith(
// take the current request and looks in the cache for a resource that matches
      caches.match(event.request).then(function(response) {
// checking if the files exist or not on the cache
        return response || fetch(event.request);
      })
    )
});
