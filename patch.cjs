const fs = require('fs');
let code = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');
const regex = /\{\/\* Where to Watch Stream Options \*\/\}([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/;
code = code.replace(regex, '</div></div>');
fs.writeFileSync('src/components/WatchModal.tsx', code);
