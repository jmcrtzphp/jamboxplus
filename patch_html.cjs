const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const preconnects = `
    <!-- Preconnect to external critical media & API origins for faster loading -->
    <link rel="preconnect" href="https://image.tmdb.org" crossorigin fetchpriority="high" />
    <link rel="dns-prefetch" href="https://image.tmdb.org" />
    <link rel="preconnect" href="https://api.themoviedb.org" crossorigin fetchpriority="high" />
    <link rel="dns-prefetch" href="https://api.themoviedb.org" />
`;

html = html.replace(
  /<!-- Preconnect to external critical media & API origins for faster loading -->[\s\S]*?<link rel="dns-prefetch" href="https:\/\/api\.themoviedb\.org" \/>/,
  preconnects.trim()
);

fs.writeFileSync('index.html', html);
console.log('HTML preconnects patched.');
