const fs = require('fs');
let movies = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

movies = movies.replace(
  /<div \n      onClick=\{onClick\}\n      style=\{\{ borderRadius: '24px' \}\}\n      className="group\/card relative aspect-\[2\/3\] w-full overflow-hidden cursor-pointer glass-subtle border border-white\/15 hover:border-white\/35 transition-all duration-250 transform hover:-translate-y-1\.5 hover:shadow-\[0_16px_40px_rgba\(0,0,0,0\.8\)\] flex flex-col justify-between gpu-layer will-change-transform"/,
  `<motion.div 
      layoutId={\`poster-\${show.id}\`}
      onClick={onClick}
      style={{ borderRadius: '24px' }}
      className="group/card relative aspect-[2/3] w-full overflow-hidden cursor-pointer glass-subtle border border-white/15 hover:border-white/35 transition-all duration-250 transform hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between gpu-layer will-change-transform"`
);

// We need to replace the last </div> before `});` in MovieCard.
movies = movies.replace(
  /        <\/div>\n      <\/div>\n    <\/div>\n  \);\n\}\);/g,
  `        </div>\n      </div>\n    </motion.div>\n  );\n});`
);

fs.writeFileSync('src/components/Movies.tsx', movies);
