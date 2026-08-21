const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

code = code.replace(
  "useState<'movies' | 'tv' | 'favorites' | 'search' | 'paramount'>('movies');",
  "useState<'movies' | 'tv' | 'favorites' | 'search'>('movies');"
);

fs.writeFileSync('src/components/Movies.tsx', code);
