const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace("    params.with_watch_monetization_types = 'flatrate';\n", "");
fs.writeFileSync('server.ts', code);
