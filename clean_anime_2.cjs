const fs = require('fs');
let content = fs.readFileSync('src/components/Movies.tsx', 'utf8');

// Remove everything from {/* Anime Details Modal ... to before {playingAnime && (
content = content.replace(/\{\/\* Anime Details Modal & Player from Favorites \*\/\}[\s\S]*?\{playingAnime && \([\s\S]*?\)\}/, '');
// Remove if (anime) block
content = content.replace(/if \(anime\) \{[\s\S]*?\}\s*return null;/g, 'return null;');

// Also fix any dangling playingAnime logic
content = content.replace(/.*setPlayingAnime.*/g, '');
content = content.replace(/.*setSelectedAnimeId.*/g, '');
content = content.replace(/.*<AnimePlayer[\s\S]*?\/>/g, '');
content = content.replace(/.*<AnimeDetailsModal[\s\S]*?\/>/g, '');

fs.writeFileSync('src/components/Movies.tsx', content);
console.log("Cleaned 2");
