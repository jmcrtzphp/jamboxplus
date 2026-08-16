const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(/normalizeTmdbShow\(item, type\)/g, "normalizeTmdbShow(item, type as 'movie' | 'tv')");

fs.writeFileSync('server.ts', code);
