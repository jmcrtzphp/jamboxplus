const fs = require('fs');
let code = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');

code = code.replace(/playerContainer\.webkitRequestFullscreen/g, "(playerContainer as any).webkitRequestFullscreen");

fs.writeFileSync('src/components/WatchModal.tsx', code);
