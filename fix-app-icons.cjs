const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf-8');

// The Logo was injected replacing `w-20 h-20 bg-amber-500/20`. Let's just fix the card contents.
// The Live TV card:
app = app.replace(
  /<Logo className="w-24 h-24 group-hover:scale-110 transition-transform duration-300 drop-shadow-xl" \/>\s*<span className="text-2xl font-semibold">Live TV<\/span>/,
  '<div className="w-20 h-20 bg-amber-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"><Tv size={40} className="text-amber-500 group-hover:text-amber-400 transition-colors" /></div>\n          <span className="text-2xl font-semibold">Live TV</span>'
);

// The Streaming card:
app = app.replace(
  /<Logo className="w-24 h-24 group-hover:scale-110 transition-transform duration-300 drop-shadow-xl" \/>\s*<span className="text-2xl font-semibold">Streaming<\/span>/,
  '<div className="w-20 h-20 bg-amber-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"><Film size={40} className="text-amber-500 group-hover:text-amber-400 transition-colors" /></div>\n          <span className="text-2xl font-semibold">Streaming</span>'
);

fs.writeFileSync('src/App.tsx', app);
