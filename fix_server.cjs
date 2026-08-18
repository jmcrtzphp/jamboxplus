const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Remove everything from line 1100 to 1145 (until Vite setup begins)
// We know it ends before `async function startServer() {`
content = content.replace(/  \}\n\n  const anixoBase = [\s\S]*?async function startServer\(\) \{/, 'async function startServer() {');

fs.writeFileSync('server.ts', content);
console.log("Fixed server.ts");
