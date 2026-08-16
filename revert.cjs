const fs = require('fs');

// 1. Revert FloatingNav.tsx
let navCode = fs.readFileSync('src/components/FloatingNav.tsx', 'utf8');

const startStr = '{/* Mobile Top Floating Elements */}';
const endStr = '<div className="hidden sm:flex fixed top-0 left-0 w-full justify-center py-5 z-50 pointer-events-none px-4">';

const startIdx = navCode.indexOf(startStr);
const endIdx = navCode.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const originalNav = `{/* Mobile Top Floating Elements */}
      <div className="sm:hidden fixed top-0 left-0 w-full h-24 bg-gradient-to-b from-black/80 to-transparent z-40 pointer-events-none" />
      <div className="sm:hidden fixed top-4 left-4 z-50 pointer-events-auto cursor-pointer flex items-center gap-2" onClick={onBack}>
        <Logo className="w-10 h-10" />
        <JamBoxText className="text-[17px] ml-2" />
      </div>
      <div className="sm:hidden fixed top-4 right-4 z-50 pointer-events-auto flex items-center">
        {profileMenu}
      </div>
      
      {/* Mobile Search Bar */}
      <AnimatePresence>
        {activeTab === 'search' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sm:hidden fixed top-20 left-4 right-4 z-50 pointer-events-auto"
          >
            <div className="relative w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                autoFocus
                type="text"
                placeholder="Search titles, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1A1D24]/90 backdrop-blur-md border border-white/10 rounded-full py-3 pl-10 pr-10 text-sm text-white placeholder-white/40 outline-none focus:border-amber-500/50 shadow-xl"
              />
              <button 
                onClick={() => { setSearchQuery(''); setActiveTab('movies'); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      `;
  navCode = navCode.substring(0, startIdx) + originalNav + navCode.substring(endIdx);
  fs.writeFileSync('src/components/FloatingNav.tsx', navCode);
}

// 2. Revert Movies.tsx
let moviesCode = fs.readFileSync('src/components/Movies.tsx', 'utf8');

const targetStr = '<h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-white drop-shadow">Your Favorites</h2>';
const moviesOriginal = `      <div className="sm:hidden mb-6 relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
        <input 
          autoFocus
          type="text" 
          placeholder="Search titles, actors, genres..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1A1D24] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-white/40 outline-none focus:border-amber-500/50 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-white drop-shadow">Your Favorites</h2>`;

moviesCode = moviesCode.replace(targetStr, moviesOriginal);
fs.writeFileSync('src/components/Movies.tsx', moviesCode);

