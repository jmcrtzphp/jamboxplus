const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
`    if (isTrending && (!req.query.cursor || req.query.cursor === '1')) {
      // Use TMDB trending endpoint for top weekly movies
      data = await fetchTmdb("/trending/movie/week", { page: String(req.query.cursor || req.query.page || 1) });
    } else {
      const tmdbParams = buildTmdbDiscoverParams(req.query, 'movie');
      data = await fetchTmdb("/discover/movie", tmdbParams);
    }`,
`    const inTheaters = req.query.in_theaters === 'true' || req.query.in_theaters === true;
    
    if (inTheaters) {
      data = await fetchTmdb("/movie/now_playing", {
        language: "en-US",
        region: "US",
        page: String(req.query.cursor || req.query.page || 1)
      });
    } else if (isTrending && (!req.query.cursor || req.query.cursor === '1')) {
      // Use TMDB trending endpoint for top weekly movies
      data = await fetchTmdb("/trending/movie/week", { page: String(req.query.cursor || req.query.page || 1) });
    } else {
      const tmdbParams = buildTmdbDiscoverParams(req.query, 'movie');
      data = await fetchTmdb("/discover/movie", tmdbParams);
    }`
);

fs.writeFileSync('server.ts', code);
