const fs = require('fs');

const linesToFix = [221, 329, 373, 543, 609, 640, 720, 768, 962, 1215, 1483, 1547, 1569];

let lines = fs.readFileSync('src/components/Movies.tsx', 'utf-8').split('\n');

for (let i of linesToFix) {
  lines[i-1] = lines[i-1].replace(')}', '))}');
}

fs.writeFileSync('src/components/Movies.tsx', lines.join('\n'));
