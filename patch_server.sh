cat << 'INNER_EOF' > replacement.txt
let cachedGenreImages: Record<string, string> | null = null;
let fetchingGenreImagesPromise: Promise<Record<string, string>> | null = null;

function fetchGenreImagesInternal() {
  if (cachedGenreImages) return Promise.resolve(cachedGenreImages);
  if (!fetchingGenreImagesPromise) {
    fetchingGenreImagesPromise = (async () => {
      const movieGenres = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 53, 10752, 37];
      const tvGenres = [10762, 10763, 10764, 10766, 10767];
      const results: Record<string, string> = {};
      const promises = [];

      for (const mg of movieGenres) {
        promises.push(
          fetchTmdb("/discover/movie", { with_genres: mg, page: 1, sort_by: "popularity.desc" })
            .then(data => {
              if (data.results && data.results.length > 0) {
                const item = data.results.find((r: any) => r.backdrop_path) || data.results[0];
                if (item && item.backdrop_path) {
                  results[`movie_${mg}`] = `https://image.tmdb.org/t/p/w780${item.backdrop_path}`;
                }
              }
            }).catch(console.error)
        );
      }
      for (const tg of tvGenres) {
        promises.push(
          fetchTmdb("/discover/tv", { with_genres: tg, page: 1, sort_by: "popularity.desc" })
            .then(data => {
              if (data.results && data.results.length > 0) {
                const item = data.results.find((r: any) => r.backdrop_path) || data.results[0];
                if (item && item.backdrop_path) {
                  results[`tv_${tg}`] = `https://image.tmdb.org/t/p/w780${item.backdrop_path}`;
                }
              }
            }).catch(console.error)
        );
      }
      await Promise.all(promises);
      cachedGenreImages = results;
      return results;
    })();
  }
  return fetchingGenreImagesPromise;
}

app.get("/api/genres/images", async (req, res) => {
  try {
    const results = await fetchGenreImagesInternal();
    res.json(results);
  } catch (error) {
    console.error("Genre Images Error:", error);
    fetchingGenreImagesPromise = null;
    res.status(500).json({ error: "Failed to fetch genre images" });
  }
});
INNER_EOF

sed -i '/let cachedGenreImages: Record<string, string> | null = null;/,/    res.status(500).json({ error: "Failed to fetch genre images" });\n  }\n});/c\
'"$(cat replacement.txt | sed 's/\\/\\\\/g' | sed 's/$/\\/g')"'' server.ts
sed -i 's/\\$//' server.ts
