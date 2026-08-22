const fs = require('fs');
let code = fs.readFileSync('src/lib/platforms.tsx', 'utf8');

code = code.replace(
`  if (platformId === 'theaters') {`,
`  if (platformId === 'theaters' || platformId === 'now-showing') {`
);

fs.writeFileSync('src/lib/platforms.tsx', code);
