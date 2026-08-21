const fs = require('fs');

function fixFile(file) {
  let code = fs.readFileSync(file, 'utf-8');
  
  // Replace radius={999} with rounded-full class and remove radius prop
  // Actually, we can just replace `radius={999}\n            className="` with `className="rounded-full `
  code = code.replace(/radius=\{999\}\s*className="/g, 'className="rounded-full ');
  
  fs.writeFileSync(file, code);
  console.log('Fixed', file);
}

fixFile('src/components/Movies.tsx');
fixFile('src/components/ContinueWatchingRow.tsx');
