const fs = require('fs');
let code = fs.readFileSync('src/lib/tmdb.ts', 'utf8');

code = code.replace(
  /const params: any = \{[\s\S]*?movie_genre\?: number \| null;[\s\S]*?tv_genre\?: number \| null;[\s\S]*?show_type\?: showType,[\s\S]*?country,[\s\S]*?cursor[\s\S]*?\};/,
  `const params: any = {
    show_type: showType,
    country,
    cursor
  };`
);

fs.writeFileSync('src/lib/tmdb.ts', code);
