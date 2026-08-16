const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

// replace imports
code = code.replace(
  /import \{ GENRES, GENRE_SLUGS, getSlugForGenre, GENRE_CATEGORIES, GenreCategory \} from '\.\.\/lib\/genres';/,
  `import { GENRES, GENRE_LIST, UnifiedGenre } from '../lib/genres';\nimport { ArrowLeft, Film, Compass, Clapperboard, Smile, Fingerprint, Camera, Star, Users, Wand2, Landmark, Skull, Music, Search, Heart, Rocket, Zap, Shield, Baby, Newspaper, Tv, Sparkles, Mic } from 'lucide-react';`
);

// replace GenreIcon map if it exists, or just use a helper
code = code.replace(
  /const GenreIcon = \(\{ name, .*\} \)=> \{[\s\S]*?\};/,
  `const GenreIcon = ({ name, ...props }: any) => {
    const IconMap: any = { Film, Compass, Clapperboard, Laugh: Smile, Fingerprint, Camera, Star, Users, Wand2, Landmark, Skull, Music, Search, Heart, Rocket, Zap, Shield, Baby, Newspaper, Tv, Sparkles, Mic };
    const Icon = IconMap[name] || Film;
    return <Icon {...props} />;
  };`
);

// State type
code = code.replace(
  /const \[selectedGenre, setSelectedGenre\] = useState<GenreCategory \| null>\(null\);/,
  `const [selectedGenre, setSelectedGenre] = useState<UnifiedGenre | null>(null);`
);

// Sync from URL
code = code.replace(
  /const cat = GENRE_CATEGORIES\.find\(g => g\.id === String\(genreId\)\);/g,
  `const cat = GENRE_LIST.find(g => g.id === slug);`
);
code = code.replace(
  /const genreId = GENRE_SLUGS\[slug\];\n      if \(genreId\) \{/,
  `if (slug) {`
);

// URL search params logic inside syncGenreFromUrl
code = code.replace(
  /const syncGenreFromUrl = useCallback\(\(\) => \{[\s\S]*?setSelectedGenre\(null\);\n  \}, \[\]\);/,
  `const syncGenreFromUrl = useCallback(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const typeParam = searchParams.get('type');
    if (typeParam === 'movie' || typeParam === 'tv' || typeParam === 'all') {
      setGenreTypeFilter(typeParam as 'all' | 'movie' | 'series');
    } else if (typeParam === 'series') {
      setGenreTypeFilter('series');
    }
    
    if (path.startsWith('/genre/')) {
      const slug = path.split('/')[2];
      if (slug) {
        const cat = GENRE_LIST.find(g => g.id === slug);
        if (cat) {
          setSelectedGenre(cat);
          return;
        }
      }
    }
    setSelectedGenre(null);
  }, []);`
);

// handleSelectGenre
code = code.replace(
  /const handleSelectGenre = \(genre\) => \{[\s\S]*?setSelectedGenre\(genre\);[\s\S]*?const slug = getSlugForGenre\(Number\(genre\.id\)\);[\s\S]*?if \(slug\) \{[\s\S]*?window\.history\.pushState\(\{\}, '', \`\/genre\/\$\{slug\}\`\);[\s\S]*?\} else \{[\s\S]*?window\.history\.pushState\(\{\}, '', '\/'\);[\s\S]*?\}[\s\S]*?\};/,
  `const handleSelectGenre = (genre: UnifiedGenre) => {
    setSelectedGenre(genre);
    setGenreTypeFilter('all');
    window.history.pushState({}, '', \`/genre/\${genre.id}\`);
  };`
);

// type filter setter
code = code.replace(
  /const \[genreTypeFilter, setGenreTypeFilter\] = useState<'all' \| 'movie' \| 'series'>\('all'\);/,
  `const [genreTypeFilter, setGenreTypeFilter] = useState<'all' | 'movie' | 'series'>('all');
  
  const handleSetGenreType = (type: 'all' | 'movie' | 'series') => {
    setGenreTypeFilter(type);
    if (selectedGenre) {
      window.history.pushState({}, '', \`/genre/\${selectedGenre.id}?type=\${type}\`);
    }
  };`
);

// fetchByGenre invocation
code = code.replace(
  /fetchByGenre\(selectedGenre\.id, genreTypeFilter, country, reset \? undefined : nextCursor\)/,
  `fetchByGenre(selectedGenre.movieId, selectedGenre.tvId, genreTypeFilter, country, reset ? undefined : nextCursor)`
);

fs.writeFileSync('src/components/Movies.tsx', code);
