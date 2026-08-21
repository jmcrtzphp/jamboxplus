const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const cacheMiddleware = `
// Caching middleware for API GET requests
app.use('/api', (req, res, next) => {
  if (req.method === 'GET' && !req.path.includes('/visits') && !req.path.includes('/health')) {
    // Cache for 30 minutes in browser, 1 hour in CDN
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400');
  }
  next();
});
`;

// Insert after app.use(express.json());
code = code.replace(
  'app.use(express.json());',
  'app.use(express.json());\n' + cacheMiddleware
);

// Increase internal cache duration from 5 min to 30 min
code = code.replace(
  'const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes',
  'const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes'
);

fs.writeFileSync('server.ts', code);
