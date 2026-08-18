const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const imageReplacement = `    imageSet: {
      poster: posterPath,
      verticalPoster: {
        w240: item.poster_path ? (item.poster_path.startsWith('http') ? item.poster_path : \`https://image.tmdb.org/t/p/w185\${item.poster_path}\`) : posterPath,
        w360: item.poster_path ? (item.poster_path.startsWith('http') ? item.poster_path : \`https://image.tmdb.org/t/p/w342\${item.poster_path}\`) : posterPath,
        w480: posterPath,
        w720: item.poster_path ? (item.poster_path.startsWith('http') ? item.poster_path : \`https://image.tmdb.org/t/p/w780\${item.poster_path}\`) : posterPath
      },
      horizontalPoster: {
        w360: item.backdrop_path ? (item.backdrop_path.startsWith('http') ? item.backdrop_path : \`https://image.tmdb.org/t/p/w300\${item.backdrop_path}\`) : backdropPath720,
        w720: backdropPath720,
        w1080: backdropPath1080
      }
    },`;

content = content.replace(/    imageSet: \{\n      poster: posterPath,\n      verticalPoster: \{\n        w720: posterPath,\n        w480: posterPath\n      \},\n      horizontalPoster: \{\n        w1080: backdropPath1080,\n        w720: backdropPath720\n      \}\n    \},/, imageReplacement);

fs.writeFileSync('server.ts', content);
console.log("Updated imageSet in server.ts");
