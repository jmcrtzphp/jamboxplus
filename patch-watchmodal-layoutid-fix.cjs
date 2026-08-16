const fs = require('fs');
let file = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');
file = file.replace(/layoutId=\{`poster-\$\{tmdbId\}`\}/, 'layoutId={`poster-${showId}`}');
fs.writeFileSync('src/components/WatchModal.tsx', file);
