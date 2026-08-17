cat << 'INNER_EOF' > replacement.txt
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.title || req.query.query;
    const data = await fetchTmdb("/search/multi", { ...req.query, query } as any);
    const shows = (data.results || []).filter((s:any) => s.media_type !== 'person').map((s: any) => normalizeTmdbShow(s));
    res.json({ shows, hasMore: data.page < data.total_pages, nextCursor: data.page + 1 });
  } catch (error: any) {
    if (error.message === 'TMDB_API_KEY_UNAVAILABLE' || (error as any).status === 401 || (error as any).status === 403) {
       return res.json({ shows: [...FALLBACK_MOVIES, ...FALLBACK_SHOWS].map(s => normalizeTmdbShow(s)), hasMore: false });
    }
    res.status(500).json({ error: error.message });
  }
});
INNER_EOF

sed -i '/app.get("\/api\/search"/,/});/c\
'"$(cat replacement.txt | sed 's/$/\\/g' | sed '$s/\\$//')"'
' server.ts
