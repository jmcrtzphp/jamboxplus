const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

// 1. Add Paramount tab to Movies component state
code = code.replace(
  "useState<'movies' | 'tv' | 'favorites' | 'search'>('movies');",
  "useState<'movies' | 'tv' | 'favorites' | 'search' | 'paramount'>('movies');"
);

// 2. Add ParamountView rendering to the activeTab logic
code = code.replace(
  "        ) : activeTab === 'search' ? (",
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
          </motion.div>
        ) : activeTab === 'search' ? (`
);

// 3. Add hideHero to PlatformPage
code = code.replace(
  "function PlatformPage({ platformId, type, country, onBack, onSelectMovie, isFavorite, toggleFavorite }: any) {",
  "function PlatformPage({ platformId, type, country, onBack, onSelectMovie, isFavorite, toggleFavorite, hideHero }: any) {"
);

// 4. Update PlatformPage to hide the hero if hideHero is true
code = code.replace(
  "{/* 1. Platform Hero Banner with Pull-Down Zoom & Stretch */}",
  "{/* 1. Platform Hero Banner with Pull-Down Zoom & Stretch */}\n      {!hideHero && ("
);
// Now we need to close the !hideHero check before the grid.
code = code.replace(
  "{/* 2. Platform Catalogue Content Grid */}",
  ")}\n      {/* 2. Platform Catalogue Content Grid */}"
);

// 5. Add ParamountView component
const paramountViewComponent = `
function ParamountView({ country, onSelectMovie, isFavorite, toggleFavorite }: any) {
  const [activeTab, setActiveTab] = useState<'movie' | 'series'>('movie');

  return (
    <div className="w-full pt-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <StreamingPlatformIcon platformId="paramount" className="w-16 h-16 rounded-2xl shadow-2xl" />
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Paramount+</h1>
          <p className="text-white/60">United States Catalog</p>
        </div>
      </div>
      
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('movie')}
          className={\`px-6 py-2 rounded-full font-semibold transition-colors \${activeTab === 'movie' ? 'bg-[#0064FF] text-white shadow-[0_0_20px_rgba(0,100,255,0.4)]' : 'bg-white/10 text-white/70 hover:text-white'}\`}
        >
          Movies
        </button>
        <button 
          onClick={() => setActiveTab('series')}
          className={\`px-6 py-2 rounded-full font-semibold transition-colors \${activeTab === 'series' ? 'bg-[#0064FF] text-white shadow-[0_0_20px_rgba(0,100,255,0.4)]' : 'bg-white/10 text-white/70 hover:text-white'}\`}
        >
          TV Shows
        </button>
      </div>

      <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 xl:-mx-16">
        <PlatformPage 
          platformId="paramount" 
          type={activeTab} 
          country="US" 
          onBack={() => {}} 
          onSelectMovie={onSelectMovie} 
          isFavorite={isFavorite} 
          toggleFavorite={toggleFavorite}
          hideHero={true}
        />
      </div>
    </div>
  );
}
`;

code = code + '\n' + paramountViewComponent;

fs.writeFileSync('src/components/Movies.tsx', code);
console.log("Updated Movies.tsx");
