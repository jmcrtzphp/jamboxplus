const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

// Replace GENRE_CATEGORIES with imported GENRE_SLUGS from lib/genres
code = code.replace(/import \{.*?GENRE_CATEGORIES.*?\} from '\.\.\/lib\/tmdb';/, "import { Show, fetchFilters, searchTitle, fetchShowDetails, fetchByGenre } from '../lib/tmdb';\nimport { GENRES, GENRE_SLUGS, getSlugForGenre } from '../lib/genres';");

fs.writeFileSync('src/components/Movies.tsx', code);
