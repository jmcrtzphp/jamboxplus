const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

const effectBlock = `
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/genre/')) {
      const slug = path.split('/')[2];
      const genreId = GENRE_SLUGS[slug];
      if (genreId) {
        const cat = GENRE_CATEGORIES.find(g => g.id === String(genreId));
        if (cat) setSelectedGenre(cat);
      }
    }
  }, []);

  const handleSelectGenre = (genre) => {
    setSelectedGenre(genre);
    const slug = getSlugForGenre(Number(genre.id));
    if (slug) {
      window.history.pushState({}, '', \`/genre/\${slug}\`);
    } else {
      window.history.pushState({}, '', '/');
    }
  };
`;

code = code.replace(/const \[selectedGenre, setSelectedGenre\] = useState<GenreCategory \| null>\(null\);/, 
  "const [selectedGenre, setSelectedGenre] = useState<GenreCategory | null>(null);\n" + effectBlock);

code = code.replace(/onClick=\{\(\) => setSelectedGenre\(genre\)\}/g, "onClick={() => handleSelectGenre(genre)}");
code = code.replace(/setSelectedGenre\(null\)/g, "(() => { setSelectedGenre(null); window.history.pushState({}, '', '/'); })()");

fs.writeFileSync('src/components/Movies.tsx', code);
