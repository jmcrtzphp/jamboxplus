const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

code = code.replace(
  "order_by: 'popularity_1week',\n      cursor:",
  "order_by: 'popularity_1week',\n      with_watch_monetization_types: 'flatrate',\n      cursor:"
);

// Also add import for StreamingPlatformsRow
code = code.replace(
  "import { FloatingNav } from './FloatingNav';",
  "import { FloatingNav } from './FloatingNav';\nimport { StreamingPlatformsRow } from './StreamingPlatformsRow';"
);

// Add StreamingPlatformsRow to MoviesView
code = code.replace(
  '<ContinueWatchingRow onSelect={onSelectMovie} filterType="movie" />',
  '<ContinueWatchingRow onSelect={onSelectMovie} filterType="movie" />\n        <StreamingPlatformsRow onSelectPlatform={(id) => onSeeAll(id, \'all\')} />'
);

// Add StreamingPlatformsRow to TVShowsView
code = code.replace(
  '<ContinueWatchingRow onSelect={onSelectMovie} filterType="tv" />',
  '<ContinueWatchingRow onSelect={onSelectMovie} filterType="tv" />\n        <StreamingPlatformsRow onSelectPlatform={(id) => onSeeAll(id, \'all\')} />'
);

fs.writeFileSync('src/components/Movies.tsx', code);
