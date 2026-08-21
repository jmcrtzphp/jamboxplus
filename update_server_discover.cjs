const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

code = code.replace(
  "params.watch_region = (query.country || 'US').toString().toUpperCase();",
  "params.watch_region = (query.country || 'US').toString().toUpperCase();\n    if (query.with_watch_monetization_types) params.with_watch_monetization_types = String(query.with_watch_monetization_types);"
);

fs.writeFileSync('server.ts', code);
