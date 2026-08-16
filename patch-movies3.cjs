const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

code = code.replace(/<div className="absolute bottom-0 left-0 right-0 p-8 sm:p-16 z-20 flex flex-col items-start gap-4 max-w-4xl">/, 
  '<GlassContainer className="absolute bottom-8 left-8 right-8 p-8 sm:p-12 z-20 flex flex-col items-start gap-4 max-w-4xl rounded-3xl border border-white/10" intensity="high">');
code = code.replace(/<\/div>\s*<\/div>\s*\{\/\* Main/g, '</GlassContainer></div>\n      {/* Main');

fs.writeFileSync('src/components/Movies.tsx', code);
