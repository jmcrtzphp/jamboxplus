const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

code = code.replace(
  /if \(typeParam === 'movie' \|\| typeParam === 'tv' \|\| typeParam === 'all'\) \{[\s\S]*?setGenreTypeFilter\(typeParam as 'all' \| 'movie' \| 'series'\);[\s\S]*?\} else if \(typeParam === 'series'\) \{[\s\S]*?setGenreTypeFilter\('series'\);[\s\S]*?\}/,
  `if (typeParam === 'movie' || typeParam === 'series' || typeParam === 'all') {
      setGenreTypeFilter(typeParam as 'all' | 'movie' | 'series');
    } else if (typeParam === 'tv') {
      setGenreTypeFilter('series');
    }`
);

fs.writeFileSync('src/components/Movies.tsx', code);
