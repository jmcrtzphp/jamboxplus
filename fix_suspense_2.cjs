const fs = require('fs');
let content = fs.readFileSync('src/components/Movies.tsx', 'utf8');

content = content.replace(/<\/Suspense><\/Suspense><\/Suspense>/g, '</Suspense>');
content = content.replace(/<\/Suspense>        \)}/g, '</Suspense>\n        )}');

fs.writeFileSync('src/components/Movies.tsx', content);
console.log("Fixed Suspense 2");
