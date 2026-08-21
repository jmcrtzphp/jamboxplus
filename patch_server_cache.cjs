const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf-8');

// Update express API cache control
server = server.replace(
  "res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400');",
  "res.setHeader('Cache-Control', 'public, max-age=7200, s-maxage=14400, stale-while-revalidate=86400');"
);

// Update internal TMDB cache duration
server = server.replace(
  "const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes",
  "const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours"
);

fs.writeFileSync('server.ts', server);
console.log('Server cache duration extended.');
