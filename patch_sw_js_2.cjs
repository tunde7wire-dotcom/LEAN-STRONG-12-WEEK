const fs = require('fs');
let code = fs.readFileSync('public/sw.js', 'utf8');

const strategyStr = `
  const isHashedAsset = url.pathname.startsWith('/assets/') || url.pathname.match(/\\.[a-f0-9]{8,}\\.(js|css|woff2?|png|jpg|jpeg|svg)$/i);

  if (isHashedAsset) {
    // Cache-first for immutable hashed assets
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      })
    );
  } else {
    // Network-first for other non-hashed resources
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});
`;

code = code.replace(/\/\/ Cache-first for immutable hashed assets[\s\S]*\}\);/, strategyStr);

fs.writeFileSync('public/sw.js', code);
console.log('patched sw.js phase 2');
