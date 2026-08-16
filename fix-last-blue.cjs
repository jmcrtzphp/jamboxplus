const fs = require('fs');

let file = fs.readFileSync('src/components/liquid-glass/GlassNavbar.tsx', 'utf-8');
file = file.replace(/via-blue-400\/35/g, 'via-amber-400/35');
fs.writeFileSync('src/components/liquid-glass/GlassNavbar.tsx', file);
