const fs = require('fs');

// server.ts
let server = fs.readFileSync('server.ts', 'utf-8');
server = server.replace(/const type = rawType === 'series' \? 'tv' : rawType;/, "const type = rawType === 'series' ? 'tv' : rawType;\n  if (type !== 'tv' && type !== 'movie') return res.status(400).json({ error: 'Invalid type' });");
fs.writeFileSync('server.ts', server);

// src/components/FloatingNav.tsx
let nav = fs.readFileSync('src/components/FloatingNav.tsx', 'utf-8');
nav = nav.replace(/link\.mobileLabel \|\| link\.label/g, "(link as any).mobileLabel || link.label");
fs.writeFileSync('src/components/FloatingNav.tsx', nav);

// src/components/WatchModal.tsx
let modal = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');
modal = modal.replace(/container\.(webkitRequestFullscreen\(\))/g, "(container as any).$1");
fs.writeFileSync('src/components/WatchModal.tsx', modal);

