const CACHE_NAME = "hotel-crc-v2"

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/favicon.ico",

  // Imágenes
  "/img/logo.png",
  "/img/portada.jpg",
  "/img/lobby.jpg",
  "/img/piscina.jpg"
]

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  )
  self.skipWaiting()
})

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // No interceptar archivos descargables
  if (url.pathname.endsWith(".mcworld")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
