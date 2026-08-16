const fs = require('fs');
let code = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');

// Import
code = code.replace(/fetchSeasonDetails \} from '\.\.\/lib\/tmdb';/, "fetchSeasonDetails, fetchRelatedShows } from '../lib/tmdb';");

// State
code = code.replace(/const \[loading, setLoading\] = useState\(true\);/, "const [loading, setLoading] = useState(true);\n  const [relatedShows, setRelatedShows] = useState<Show[]>([]);");

// Fetch
code = code.replace(/const data = await fetchShowDetails\(showId, country\);/, "const [data, related] = await Promise.all([fetchShowDetails(showId, country), fetchRelatedShows(showId)]);\n        setRelatedShows(related);");

fs.writeFileSync('src/components/WatchModal.tsx', code);
