const fs = require('fs');

function fixFile(file) {
  let code = fs.readFileSync(file, 'utf-8');
  
  code = code.replace(/scale=\{-112\}/g, 'scale={-24}');
  code = code.replace(/chroma=\{6\}/g, 'chroma={2}');
  
  fs.writeFileSync(file, code);
  console.log('Fixed scale in', file);
}

fixFile('src/components/Movies.tsx');
fixFile('src/components/ContinueWatchingRow.tsx');
