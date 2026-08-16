const fs = require('fs');

let code = fs.readFileSync('src/lib/genres.ts', 'utf-8');

const replacement = `
export const GENRE_CATEGORIES: GenreCategory[] = Object.keys(GENRE_SLUGS).map((slug, idx) => {
  const id = GENRE_SLUGS[slug];
  const name = MOVIE_GENRES[id] || TV_GENRES[id] || slug;
  return {
    id: String(id),
    name: name,
    description: \`Explore \${name} titles\`,
    gradient: defaultGradients[idx % defaultGradients.length],
    borderGlow: 'hover:border-white/50 hover:shadow-white/20',
    iconName: 'Film',
    backdrop: ''
  };
});
`;

code = code.replace(/export const GENRE_CATEGORIES[\s\S]*/, replacement);
fs.writeFileSync('src/lib/genres.ts', code);
