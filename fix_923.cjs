const fs = require('fs');
let lines = fs.readFileSync('src/components/Movies.tsx', 'utf-8').split('\n');

for (let i = 918; i < 928; i++) {
  if (lines[i] && lines[i].includes('      }')) {
    lines[i] = lines[i].replace('}', ')}');
  }
}

fs.writeFileSync('src/components/Movies.tsx', lines.join('\n'));
