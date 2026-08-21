const fs = require('fs');
let tmdb = fs.readFileSync('src/lib/tmdb.ts', 'utf-8');

tmdb = tmdb.replace(
  'cast?: { name: string; profilePath?: string }[];',
  'cast?: { id?: number; name: string; character?: string; profilePath?: string }[];\n  creators?: string[];'
);

tmdb = tmdb.replace(
  '    directors: data.directors,',
  '    directors: data.directors,\n    creators: data.creators,'
);

fs.writeFileSync('src/lib/tmdb.ts', tmdb);
