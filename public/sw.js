/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const CACHE_NAME = "lean-strong-tracker-v3";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json"
];

// Install Service Worker and cache core static shell assets
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Safely cache assets, don't fail if one is missing
      return Promise.all(
        ASSETS_TO_CACHE.map((asset) => {
          return cache.add(asset).catch((err) => {
            console.warn(`[Service Worker] Failed to precache ${asset}:`, err);
          });
        })
      );
    })
  );
});

// Activate and clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key.startsWith("lean-strong-tracker-") && key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercept fetch requests for offline support
self.addEventListener("fetch", (event) => {
  // Only cache GET requests
  if (event.request.method !== "GET") return;
  if (event.request.url.startsWith('blob:')) return;
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);
  
  // Do not cache or intercept development paths or API requests
  if (
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/@vite/') ||
    url.pathname.startsWith('/@react-refresh') ||
    url.pathname.startsWith('/node_modules/.vite/') ||
    url.searchParams.has('t') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.tsx') ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }


  // Network-first for page navigations (HTML)
  if (event.request.mode === 'navigate') {
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
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback to app shell
            return caches.match('./index.html');
          });
        })
    );
    return;
  }

  
  const isHashedAsset = url.pathname.startsWith('/assets/') || url.pathname.match(/\.[a-f0-9]{8,}\.(js|css|woff2?|png|jpg|jpeg|svg)$/i);

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

