const cacheItems = 'items_v1'
const cacheData = 'budget_v1'

// informations that will be on the cacheItems
const resourcesToCache = [
    "/",
    "/index.html",
    "/styles.css",
    "/js/index.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

// open on cache after the service worker is installed
self.addEventListener('install', (event) =>{
    event.waitUntil(
        caches.open(cacheItems)
        .then(cache => (cache.addAll(resourcesToCache))),
    );
});

self.addEventListener('fetch', function(event) {
// Checking if the request url contain /api/
    if(event.request.url.includes("/api/")){
        event.respondWith(
// If the user is actually doing one post, then create one new cache
            caches.open(cacheData).then(cache =>{
// returning the cache
                return fetch(event.request).then(response =>{
// if the response is ok, then add the body on the cache (clone)
                    if(response.status == 200){
                        cache.put(event.request.url, response.clone())
                    }
                    return response
                })
// sending errors back
                .catch(err =>{
                    return cache.match(event.request)
                });
            }).catch(err => console.log(err))
        );
        return;
    }
// inform to the browser to check future events 
    event.respondWith(
// take the current request and looks in the cache for a resource that matches
      caches.match(event.request).then(function(response) {
// checking if the files exist or not on the cache
        return response || fetch(event.request);
      })
    )
});

