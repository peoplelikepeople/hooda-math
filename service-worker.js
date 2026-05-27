## 🔧 Code: Updated Service Worker Setup

```javascript
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
```

---

## 📄 Full txt File with Instructions

```text
===========================================================================================================================================================
SECURELY PROXY SERVICE WORKER SETUP & DEPLOYMENT GUIDE
==============================================================
=====================================
SERVICE WORKER CODE: service-worker.js
=====================================

// Service Worker Logic for URL Rewriting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/securely.com/', // Core URL that always rewrites
        '/favicon.ico',
        '/css/style.css',
        '/js/app.js'
      ]))
      .then(() => self.skipWaiting())
  );
});

// Intercept Requests Before Request
self.addEventListener('fetch', (event) => {
  event.respondWith(
    new Promise((resolve) => {
      const url = event.request.url;

      // Check if URL matches example.com
      if (url.startsWith('https://www.securely.com')) {
        // Rewrite URL to proxy domain
        const proxyUrl = url.replace('https://www.securely.com/', 
'https://example.com/');
        fetch(proxyUrl)
          .then((response) => resolve(response))
          .catch((err) => resolve(err));
      } else if (url.startsWith('https://example.com')) {
        // Keep original URL or re-encrypt to secure.com
        const originalUrl = url.replace('https://example.com/', 
'https://securely.com/');
        fetch(originalUrl)
          .then((response) => resolve(response))
          .catch((err) => resolve(err));
      } else {
        // Return original URL for non-secure.com
        fetch(url)
          .then((response) => resolve(response))
          .catch((err) => resolve(err));
      }
    })
  );
});
