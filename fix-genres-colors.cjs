const fs = require('fs');
let genres = fs.readFileSync('src/lib/genres.ts', 'utf-8');

// Use regex to replace ALL gradient strings in the form 'from-XXX via-YYY to-ZZZ'
genres = genres.replace(/'from-[^']+to-[^']+'/g, "'from-[#1A1A1A]/90 via-[#0A0A0A]/80 to-[#050505]'");
// Replace all border-glow classes
genres = genres.replace(/'hover:border-[^\s]+\s+hover:shadow-[^']+'/g, "'hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]'");
fs.writeFileSync('src/lib/genres.ts', genres);

// Do the same for tmdb.ts which might have gradients
let tmdb = fs.readFileSync('src/lib/tmdb.ts', 'utf-8');
tmdb = tmdb.replace(/'from-[^']+to-[^']+'/g, "'from-[#1A1A1A]/90 via-[#0A0A0A]/80 to-[#050505]'");
tmdb = tmdb.replace(/'hover:border-[^\s]+\s+hover:shadow-[^']+'/g, "'hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]'");
fs.writeFileSync('src/lib/tmdb.ts', tmdb);

