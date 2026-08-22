const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
`      const tmdbParams = buildTmdbDiscoverParams(req.query, 'movie');
      data = await fetchTmdb("/discover/movie", tmdbParams);`,
`      const tmdbParams = buildTmdbDiscoverParams(req.query, 'movie');
      console.log("Fetching discover with params:", tmdbParams);
      data = await fetchTmdb("/discover/movie", tmdbParams);`
);

fs.writeFileSync('server.ts', code);
