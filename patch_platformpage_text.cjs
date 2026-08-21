const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

code = code.replace(
  "Top {type === 'movie' ? 'Movies' : 'TV Shows'}",
  "{type === 'all' ? 'Top Movies & TV Shows' : (type === 'movie' ? 'Top Movies' : 'Top TV Shows')}"
);

code = code.replace(
  "All {p.displayName} {type === 'movie' ? 'Movies' : 'TV Shows'}",
  "All {p.displayName} {type === 'all' ? 'Movies & TV Shows' : (type === 'movie' ? 'Movies' : 'TV Shows')}"
);

fs.writeFileSync('src/components/Movies.tsx', code);
