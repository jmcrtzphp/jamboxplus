const fs = require('fs');
let code = fs.readFileSync('public/sw.js', 'utf-8');

code = code.replace(
  `  if (
    url.pathname.startsWith('/api/') || 
    url.hostname.includes('themoviedb.org') || 
    url.hostname.includes('tmdb.org') || 
    url.hostname.includes('imgflip.com') ||
    url.hostname.includes('tenor.com') ||
    event.request.method !== 'GET'
  ) {
    return; // Bypass Service Worker
  }`,
  `  if (event.request.method !== 'GET') return;

  // Stale-while-revalidate for API and Images
  if (
    url.pathname.startsWith('/api/') || 
    url.hostname.includes('themoviedb.org') || 
    url.hostname.includes('tmdb.org') || 
    url.hostname.includes('imgflip.com') ||
    url.hostname.includes('tenor.com')
  ) {
    event.respondWith(
      caches.open('jambox-api-v1').then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Ignore fetch errors to keep returning cached response
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }`
);

fs.writeFileSync('public/sw.js', code);
