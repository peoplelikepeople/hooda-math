const CACHE_NAME = 'securely-proxy-v1';

// Register the worker to intercept requests globally
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/service-worker.js',
        '/securely.com/' // Ensure we rewrite the root to match
      ]))
      .then(() => self.skipWaiting())
  );
});
