const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

const regex = /      \)}\n      \)}\n      \{\/\* 2\. Platform Catalogue Content Grid \*\/\}/g;
code = code.replace(regex, `      ))}\n      {/* 2. Platform Catalogue Content Grid */}`);

fs.writeFileSync('src/components/Movies.tsx', code);
