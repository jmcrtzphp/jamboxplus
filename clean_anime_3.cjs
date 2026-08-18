const fs = require('fs');
let content = fs.readFileSync('src/components/Movies.tsx', 'utf8');

// The if (anime) block might be structured differently
content = content.replace(/if \(anime\) \{[\s\S]*?\}\s*return null;/g, 'return null;');

// Just manually look for the AnimeCard block
content = content.replace(/if \(anime\) \{[\s\S]*?<AnimeCard[\s\S]*?\/>\s*\);\s*\}/g, '');

fs.writeFileSync('src/components/Movies.tsx', content);
console.log("Cleaned 3");
