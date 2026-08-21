const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

code = code.replace(
  "This product uses the TMDB API but is not endorsed or certified by TMDB.",
  "This product uses the TMDB API but is not endorsed or certified by TMDB.\n              Streaming availability data provided by JustWatch."
);

fs.writeFileSync('src/components/Footer.tsx', code);
