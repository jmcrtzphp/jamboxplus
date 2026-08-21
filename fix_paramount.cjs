const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

const paramountRegex = /\s*\) : activeTab === 'paramount' \? \([\s\S]*?<ParamountView[\s\S]*?\/>\s*<\/motion\.div>/;
code = code.replace(paramountRegex, "");

fs.writeFileSync('src/components/Movies.tsx', code);
