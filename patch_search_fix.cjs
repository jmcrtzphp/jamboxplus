const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace from app.get("/api/search" up to app.get("/api/shows/:id"
const startStr = 'app.get("/api/search"';
const endStr = 'app.get("/api/shows/:id"';

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

const replacement = `app.get("/api/search", async (req, res) => {
  const title = req.query.title as string;
  const page = parseInt(req.query.cursor as string || "1", 10);
  const movieGenre = req.query.movie_genre as string;
  const tvGenre = req.query.tv_genre as string;

  try {
    if (title) {
      const data = await fetchTmdb("/search/multi", { query: title, page, language: "en-US" });
      let shows = (data.results || [])
        .filter((i: any) => i.media_type === "movie" || i.media_type === "tv")
        .map((item: any) => normalizeTmdbShow(item));

      if (movieGenre || tvGenre) {
        shows = shows.filter(s => {
          if (s.showType === 'movie' && movieGenre && s.genres?.some(g => String(g.id) === String(movieGenre))) return true;
          if (s.showType === 'series' && tvGenre && s.genres?.some(g => String(g.id) === String(tvGenre))) return true;
          return false;
        });
      }

      return res.json({
        hasMore: data.page < data.total_pages,
        nextCursor: String(data.page + 1),
        shows
      });
    } else {
      const data = await fetchTmdb("/trending/all/day", { page, language: "en-US" });
      const shows = (data.results || [])
        .filter((i: any) => i.media_type === "movie" || i.media_type === "tv")
        .map((item: any) => normalizeTmdbShow(item));
      return res.json({
        hasMore: data.page < data.total_pages,
        nextCursor: String(data.page + 1),
        shows
      });
    }
  } catch {
    const searchQ = (title || "").toLowerCase();
    const all = [...FALLBACK_MOVIES.map(m => normalizeTmdbShow(m, "movie")), ...FALLBACK_SHOWS.map(s => normalizeTmdbShow(s, "tv"))];
    let filtered = searchQ
      ? all.filter(s => s.title.toLowerCase().includes(searchQ) || s.overview?.toLowerCase().includes(searchQ))
      : all;
      
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
