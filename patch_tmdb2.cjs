const fs = require('fs');
let code = fs.readFileSync('src/lib/tmdb.ts', 'utf-8');

code = code.replace(
  "show_type?: 'movie' | 'series' | 'all';",
  "show_type?: 'movie' | 'series' | 'all';\n  with_watch_monetization_types?: string;"
);

fs.writeFileSync('src/lib/tmdb.ts', code);
