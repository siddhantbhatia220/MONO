const CACHE_NAME = 'mono-pwa-v1'
const ASSETS_TO_CACHE = [
  '/',
  '/app',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/maskable-icon.png',
  '/apple-touch-icon.png',
]

// Install Event — pre-cache core static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE)
    })
  )
  self.skipWaiting()
})

// Activate Event — cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch Event — Stale-while-revalidate for local routes
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // Avoid caching browser extension schemes or cross-origin requests that might fail
  if (url.origin !== self.location.origin) return

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return networkResponse
        })
        .catch(() => {
          // If offline and request fails, return cached fallback or empty response
          return cachedResponse
        })

      return cachedResponse || fetchPromise
    })
  )
})
