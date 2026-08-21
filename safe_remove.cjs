const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

// 1. useState activeTab
code = code.replace(
  "useState<'movies' | 'tv' | 'favorites' | 'search' | 'paramount'>('movies');",
  "useState<'movies' | 'tv' | 'favorites' | 'search'>('movies');"
);

// 2. The activeTab === 'paramount' block
const renderBlockRegex = /\s*\) : activeTab === 'paramount' \? \([\s\S]*?<ParamountView[\s\S]*?<\/motion\.div>/;
code = code.replace(renderBlockRegex, "");

// 3. PlatformPage hideHero signature
code = code.replace(
  "function PlatformPage({ platformId, type, country, onBack, onSelectMovie, isFavorite, toggleFavorite, hideHero }: any) {",
  "function PlatformPage({ platformId, type, country, onBack, onSelectMovie, isFavorite, toggleFavorite }: any) {"
);

// 4. PlatformPage hideHero usage
code = code.replace(
  `      {/* 1. Platform Hero Banner with Pull-Down Zoom & Stretch */}
      {!hideHero && (loading && shows.length === 0 ? (`,
  `      {/* 1. Platform Hero Banner with Pull-Down Zoom & Stretch */}
      {loading && shows.length === 0 ? (`
);

// 5. The closing brace for !hideHero (we changed it from ))} to )} but let's just make sure it's the right one)
// The original was:
//       </div>
//     )}
//     {/* 2. Platform Catalogue Content Grid */}
// We actually need to ensure it says `}` before {/* 2. Platform Catalogue Content Grid */}
// Wait, the recovered file has `)}` or `}`? Let's check.
// I will just leave it and let the linter tell me if there's an error.

// 6. ParamountView function at the bottom
const paramountViewRegex = /function ParamountView\([\s\S]*?\}\s*$/;
code = code.replace(paramountViewRegex, "");

fs.writeFileSync('src/components/Movies.tsx', code);
