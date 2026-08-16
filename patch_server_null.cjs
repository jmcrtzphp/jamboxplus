const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace "movieGenre" checking to ignore "null" strings
code = code.replace(
  /const movieGenre = req\.query\.movie_genre as string;/g,
  `const movieGenre = (req.query.movie_genre && req.query.movie_genre !== 'null') ? req.query.movie_genre as string : undefined;`
);

code = code.replace(
  /const tvGenre = req\.query\.tv_genre as string;/g,
  `const tvGenre = (req.query.tv_genre && req.query.tv_genre !== 'null') ? req.query.tv_genre as string : undefined;`
);

fs.writeFileSync('server.ts', code);
