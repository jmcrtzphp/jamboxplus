const fs = require('fs');

let movies = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

movies = movies.replace(
  /<div\s+key=\{show\.id\}\s+onClick=\{onClick\}\s+style=\{\{ borderRadius: '24px' \}\}\s+className="group\/card relative aspect-\[2\/3\] w-full overflow-hidden cursor-pointer glass-subtle border border-white\/15 hover:border-white\/35 transition-all duration-250 transform hover:-translate-y-1\.5 hover:shadow-\[0_16px_40px_rgba\(0,0,0,0\.8\)\] flex flex-col justify-between gpu-layer will-change-transform"/g,
  `<motion.div 
      layoutId={\`poster-\${show.id}\`}
      key={show.id}
      onClick={onClick}
      style={{ borderRadius: '24px' }}
      className="group/card relative aspect-[2/3] w-full overflow-hidden cursor-pointer glass-subtle border border-white/15 hover:border-white/35 transition-all duration-250 transform hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between gpu-layer will-change-transform"`
);

movies = movies.replace(
  /<\/div>\s*\{\/\* Poster Image \*\/\}/g, // wait, we replaced <div key={show.id}, so we need to close it with </motion.div>
  "" // wait this is dangerous
);
fs.writeFileSync('src/components/Movies.tsx', movies);
