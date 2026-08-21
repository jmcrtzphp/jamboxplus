const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

const regex = /           isFavorite=\{isFavorite\}[\s\S]*$/;
code = code.replace(regex, "");
fs.writeFileSync('src/components/Movies.tsx', code);
