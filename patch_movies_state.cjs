const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

code = code.replace(/const \[heroMovie, setHeroMovie\] = useState<Show \| null>\(null\);/g, 'const [heroMovies, setHeroMovies] = useState<Show[]>([]);');
code = code.replace(/heroMovie={heroMovie}/g, 'heroMovies={heroMovies}');
code = code.replace(/setHeroMovie={setHeroMovie}/g, 'setHeroMovies={setHeroMovies}');
code = code.replace(/isFavorite={heroMovie \? isFavorite\(heroMovie.id\) : false}/g, 'isFavorite={isFavorite}');

code = code.replace(/function MoviesView\(\{ country, heroMovie, setHeroMovie, onSelectMovie, isFavorite, toggleFavorite, onSeeAll \}: any\) \{/g, 'function MoviesView({ country, heroMovies, setHeroMovies, onSelectMovie, isFavorite, toggleFavorite, onSeeAll }: any) {');

code = code.replace(/const \[heroTV, setHeroTV\] = useState<Show \| null>\(null\);/g, 'const [heroTVs, setHeroTVs] = useState<Show[]>([]);');
code = code.replace(/heroMovie={heroTV}/g, 'heroMovies={heroTVs}');
code = code.replace(/setHeroMovie={setHeroTV}/g, 'setHeroMovies={setHeroTVs}');
code = code.replace(/isFavorite={heroTV \? isFavorite\(heroTV.id\) : false}/g, 'isFavorite={isFavorite}');

fs.writeFileSync('src/components/Movies.tsx', code);
