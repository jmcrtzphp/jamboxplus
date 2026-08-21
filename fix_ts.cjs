const fs = require('fs');

let movies = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

movies = movies.replace(/p\.name/g, 'p.displayName');

movies = movies.replace(/<PlatformBadge platformId=\{platformId\} size="md" \/>/g, '<StreamingPlatformIcon platformId={platformId} className="w-8 h-8" />');

// Update FilterParams in tmdb.ts to accept limit
let tmdb = fs.readFileSync('src/lib/tmdb.ts', 'utf-8');
if (!tmdb.includes('limit?: number;')) {
  tmdb = tmdb.replace(/cursor\?: string;/, 'cursor?: string;\n  limit?: number;');
  fs.writeFileSync('src/lib/tmdb.ts', tmdb);
}

fs.writeFileSync('src/components/Movies.tsx', movies);
console.log('Fixed TS errors');
