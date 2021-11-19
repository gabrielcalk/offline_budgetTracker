// Checking if the browser support the service worker
if ('serviceWorker' in navigator){
    window.addEventListener('load', () =>{
// Registering the service worker
      navigator.serviceWorker.register('/sw.js',).then((registration) =>{
        console.log('ServiceWorket Registration Successful', registration)
      }, function (err){
        console.log(err)
      }
      )
    })
}

// variables that contains the name of the variables
var CACHE_NAME = "my-site-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

// informations that will be on the cacheItems
const resourcesToCache = [
    "/",
    "/index.html",
    "/styles.css",
    "/js/index.js",
    "/js/db.js",
    "/sw.js",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

// open on cache after the service worker is installed
self.addEventListener('install', (event) =>{
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => (cache.addAll(resourcesToCache))),
    );
    event.waitUntil(
        caches.open(DATA_CACHE_NAME)
        .then(cache => (cache.add("/api/transaction"))),
    );
});

self.addEventListener("fetch", function(event) {
    // cache all get requests to /api routes
    if (event.request.url.includes("/api/")) {
      event.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(event.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(event.request.url, response.clone());
              }
  
              return response;
            })
            .catch(err => {
              // Network request failed, try to get it from the cache.
              return cache.match(event.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
    }
  
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request).then(function(response) {
          if (response) {
            return response;
          } else if (event.request.headers.get("accept").includes("text/html")) {
            // return the cached home page for all requests for html pages
            return caches.match("/");
          }
        });
      })
    );
  });
