const fs = require('fs');

// Patch server.ts
let server = fs.readFileSync('server.ts', 'utf-8');
server = server.replace(
  `const cast = item.credits?.cast?.slice(0, 8).map((c: any) => c.name) || item.cast || [];`,
  `const cast = item.credits?.cast?.slice(0, 8).map((c: any) => ({ name: c.name, profilePath: c.profile_path ? \`https://image.tmdb.org/t/p/w185\${c.profile_path}\` : undefined })) || item.cast || [];`
);
fs.writeFileSync('server.ts', server);
console.log('Patched server.ts cast mapping');

// Patch tmdb.ts interface
let tmdb = fs.readFileSync('src/lib/tmdb.ts', 'utf-8');
tmdb = tmdb.replace(
  `cast?: string[];`,
  `cast?: { name: string; profilePath?: string }[];`
);
fs.writeFileSync('src/lib/tmdb.ts', tmdb);
console.log('Patched tmdb.ts Show interface');

