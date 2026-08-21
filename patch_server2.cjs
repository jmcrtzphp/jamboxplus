const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf-8');

server = server.replace(
  /const cast = item\.credits\?\.cast\?\.slice\(0, 8\)\.map\(\(c: any\) => \(\{ name: c\.name, profilePath: c\.profile_path \? `https:\/\/image\.tmdb\.org\/t\/p\/w185\${c\.profile_path}` : undefined \}\)\) \|\| item\.cast \|\| \[\];/,
  "const cast = item.credits?.cast?.filter((c: any) => c.profile_path).slice(0, 12).map((c: any) => ({ id: c.id, name: c.name, character: c.character, profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : undefined })) || item.cast || [];\n  const creators = item.created_by?.map((c: any) => c.name) || item.creators || [];"
);

server = server.replace(/directors,\\n    creators,/, 'directors, creators,');
fs.writeFileSync('server.ts', server);
