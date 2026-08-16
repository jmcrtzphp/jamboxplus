const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf-8');
file = file.replace(/ease: \[0\.22, 1, 0\.36, 1\]/g, 'ease: [0.22, 1, 0.36, 1] as any');
fs.writeFileSync('src/App.tsx', file);

let watch = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');
watch = watch.replace(/ease: \[0\.16, 1, 0\.3, 1\] \}\}/g, 'ease: [0.16, 1, 0.3, 1] as any }}');
fs.writeFileSync('src/components/WatchModal.tsx', watch);
