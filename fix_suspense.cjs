const fs = require('fs');
let content = fs.readFileSync('src/components/Movies.tsx', 'utf8');

content = content.replace(/(\s+onToggleFavorite=\{toggleFavorite\}\n\s+\/>)/g, '$1</Suspense>');

fs.writeFileSync('src/components/Movies.tsx', content);
console.log("Fixed Suspense");
