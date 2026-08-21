const fs = require('fs');
let lines = fs.readFileSync('src/components/Movies.tsx', 'utf-8').split('\n');

lines.splice(938, 2, '      ))}');

fs.writeFileSync('src/components/Movies.tsx', lines.join('\n'));
