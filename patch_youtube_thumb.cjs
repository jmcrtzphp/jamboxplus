const fs = require('fs');
let watch = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');

watch = watch.replaceAll('hqdefault.jpg', 'mqdefault.jpg');

fs.writeFileSync('src/components/WatchModal.tsx', watch);
console.log('YouTube thumbnails patched for speed.');
