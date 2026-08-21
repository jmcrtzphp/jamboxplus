const fs = require('fs');

let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

// 1. useState activeTab
code = code.replace(
  "useState<'movies' | 'tv' | 'favorites' | 'search' | 'paramount'>('movies');",
  "useState<'movies' | 'tv' | 'favorites' | 'search'>('movies');"
);

// 2. activeTab === 'paramount'
code = code.replace(
  `        ) : activeTab === 'paramount' ? (
          <motion.div
            key="paramount"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <ParamountView
              country={country}
              onSelectMovie={handleSelectMovie}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
            />
          </motion.div>`,
  ""
);

// 3. PlatformPage hideHero
code = code.replace(
  "function PlatformPage({ platformId, type, country, onBack, onSelectMovie, isFavorite, toggleFavorite, hideHero }: any) {",
  "function PlatformPage({ platformId, type, country, onBack, onSelectMovie, isFavorite, toggleFavorite }: any) {"
);

code = code.replace(
  `      {/* 1. Platform Hero Banner with Pull-Down Zoom & Stretch */}
      {!hideHero && (loading && shows.length === 0 ? (`,
  `      {/* 1. Platform Hero Banner with Pull-Down Zoom & Stretch */}
      {loading && shows.length === 0 ? (`
);

// Wait, earlier I also had a ')}' somewhere to close hideHero, but then I changed it?
// Let's check how I patched the closing tags for hideHero.
