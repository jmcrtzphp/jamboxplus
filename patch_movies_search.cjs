const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

code = code.replace(
  /searchTitle\(\{ title: searchQuery\.trim\(\), country, cursor: reset \? undefined : nextCursor \}\)/,
  `searchTitle({ title: searchQuery.trim(), country, cursor: reset ? undefined : nextCursor, ...(selectedGenre ? { movie_genre: selectedGenre.movieId, tv_genre: selectedGenre.tvId } : {}) })`
);

fs.writeFileSync('src/components/Movies.tsx', code);
