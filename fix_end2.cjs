const fs = require('fs');
let lines = fs.readFileSync('src/components/Movies.tsx', 'utf-8').split('\n');

const garbageStart = lines.findIndex(l => l.includes('           onSelectMovie={onSelectMovie}'));

if (garbageStart > -1) {
  // Let's just crop here!
  lines = lines.slice(0, garbageStart);
  fs.writeFileSync('src/components/Movies.tsx', lines.join('\n'));
}

