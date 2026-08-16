const fs = require('fs');

let movies = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

// Replace the HeroSection closing tag
movies = movies.replace(
  /        <\/div>\n      <\/div>\n    <\/motion\.div>\n  \);\n\}\);/,
  `        </div>\n      </div>\n    </div>\n  );\n});`
);

// Replace the Genre mapping closing tag (line 1131)
movies = movies.replace(
  /                  <\/div>\n    <\/motion\.div>\n  \);\n\}\)\}/,
  `                  </div>\n    </div>\n  );\n})}`
);

fs.writeFileSync('src/components/Movies.tsx', movies);
