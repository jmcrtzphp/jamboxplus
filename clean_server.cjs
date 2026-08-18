const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/\/\/ Anime Playback API Endpoint[\s\S]*?\/\/ Vite setup/g, '// Vite setup');
// Just manually find the app.get("/api/anime/playback" block and remove it
content = content.replace(/\/\/ Anime Playback API Endpoint[\s\S]*?app\.get\("\/api\/anime\/playback"[\s\S]*?\}\);\n/g, '');

fs.writeFileSync('server.ts', content);
console.log("Cleaned server.ts");
