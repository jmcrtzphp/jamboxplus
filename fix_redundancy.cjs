const fs = require('fs');
let content = fs.readFileSync('src/components/Movies.tsx', 'utf8');

// MoviesView
content = content.replace(
  /const trendingFetcher = useCallback\(\(\) => fetchFilters\(\{ country, show_type: 'movie', order_by: 'popularity_1week' \}\), \[country\]\);/,
  "const trendingFetcher = useCallback(() => fetchFilters({ country, show_type: 'movie', order_by: 'top_rated' }), [country]);"
);
content = content.replace(
  /title="Trending Movies"/,
  'title="Top Rated Movies"'
);

// TVShowsView
content = content.replace(
  /const trendingFetcher = useCallback\(\(\) => fetchFilters\(\{ country, show_type: 'series', order_by: 'popularity_1week' \}\), \[country\]\);/,
  "const trendingFetcher = useCallback(() => fetchFilters({ country, show_type: 'series', order_by: 'top_rated' }), [country]);"
);
content = content.replace(
  /title="Trending TV Series"/,
  'title="Top Rated TV Series"'
);


fs.writeFileSync('src/components/Movies.tsx', content);
console.log("Fixed redundancy");
