const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const startStr = 'app.get("/api/discover"';
const endStr = 'app.get("/api/search"';
const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

const replacement = `app.get("/api/discover", async (req, res) => {
  const country = (req.query.country as string || "US").toUpperCase();
  const movieGenre = req.query.movie_genre as string;
  const tvGenre = req.query.tv_genre as string;
  const showType = (req.query.show_type as string) || "all";
  const page = parseInt(req.query.cursor as string || "1", 10);

  try {
    if (showType === "movie") {
      const data = await fetchTmdb("/discover/movie", {
        with_genres: movieGenre,
        sort_by: "popularity.desc",
        region: country,
        page,
        language: "en-US"
      });
      return res.json({
        hasMore: data.page < data.total_pages,
        nextCursor: String(data.page + 1),
        shows: (data.results || []).map((item: any) => normalizeTmdbShow(item, "movie"))
      });
    } else if (showType === "series") {
      const data = await fetchTmdb("/discover/tv", {
        with_genres: tvGenre,
        sort_by: "popularity.desc",
        watch_region: country,
        page,
        language: "en-US"
      });
      return res.json({
        hasMore: data.page < data.total_pages,
        nextCursor: String(data.page + 1),
        shows: (data.results || []).map((item: any) => normalizeTmdbShow(item, "tv"))
      });
    } else {
      const [movieData, tvData] = await Promise.all([
        movieGenre ? fetchTmdb("/discover/movie", { with_genres: movieGenre, sort_by: "popularity.desc", region: country, page, language: "en-US" }).catch(() => ({ results: [], page: 1, total_pages: 1 })) : Promise.resolve({ results: [], page: 1, total_pages: 1 }),
        tvGenre ? fetchTmdb("/discover/tv", { with_genres: tvGenre, sort_by: "popularity.desc", watch_region: country, page, language: "en-US" }).catch(() => ({ results: [], page: 1, total_pages: 1 })) : Promise.resolve({ results: [], page: 1, total_pages: 1 })
      ]);

      const movies = (movieData.results || []).map((item: any) => normalizeTmdbShow(item, "movie"));
      const tv = (tvData.results || []).map((item: any) => normalizeTmdbShow(item, "tv"));
      const combined: any[] = [];
      const maxLen = Math.max(movies.length, tv.length);
      for (let i = 0; i < maxLen; i++) {
        if (i < movies.length) combined.push(movies[i]);
        if (i < tv.length) combined.push(tv[i]);
      }
      return res.json({
        hasMore: (movieData.page < movieData.total_pages) || (tvData.page < tvData.total_pages),
        nextCursor: String(page + 1),
        shows: combined
      });
    }
  } catch {
    const all = [...FALLBACK_MOVIES.map(m => normalizeTmdbShow(m, "movie")), ...FALLBACK_SHOWS.map(s => normalizeTmdbShow(s, "tv"))];
    let filtered = all;
    if (movieGenre || tvGenre) {
      filtered = filtered.filter(s => {
        if (s.showType === 'movie' && movieGenre && s.genres?.some(g => String(g.id) === String(movieGenre))) return true;
        if (s.showType === 'series' && tvGenre && s.genres?.some(g => String(g.id) === String(tvGenre))) return true;
        return false;
      });
    }
    return res.json({
      hasMore: false,
      nextCursor: undefined,
      shows: filtered
    });
  }
});\n\n`;

code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
fs.writeFileSync('server.ts', code);
