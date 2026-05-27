const CACHE_NAME = 'securely-proxy-v1';

// Install: Pre-cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/service-worker.js',
        '/securely.com/', // Always cache the main domain
        '/favicon.ico',
      ]))
      .then(() => self.skipWaiting())
  );
});

// Fetch: Intercept before request
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Filter for secure.com domain (eTLD rewriting)
  if (url.startsWith('https://www.securely.com')) {
    // Rewrite to proxy domain
    event.respondWith(
      new Promise((resolve) => {
        fetch(url.replace('https://www.securely.com/', 
'https://example.com/'))
          .then((response) => resolve(response))
          .catch((err) => resolve(err));
      })
    );
  } else {
    // Proxy fallback for everything else
    const originalUrl = url.startsWith('https://example.com/')
      ? url
      : url.replace('https://example.com/', 'https://www.securely.com/');
    fetch(originalUrl)
      .then((response) => resolve(response))
      .catch((err) => resolve(err));
  }
});
