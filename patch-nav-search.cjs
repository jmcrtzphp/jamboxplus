const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingNav.tsx', 'utf-8');

// We need a mobile search bar that appears when activeTab === 'search'
const mobileSearch = `
      {/* Mobile Top Floating Elements */}
      <div className="sm:hidden fixed top-0 left-0 w-full h-24 bg-gradient-to-b from-black/80 to-transparent z-40 pointer-events-none" />
      <div className="sm:hidden fixed top-4 left-4 z-50 pointer-events-auto cursor-pointer flex items-center gap-2" onClick={onBack}>
        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
          <Play size={16} className="text-white ml-0.5 fill-current" />
        </div>
        <span className="font-bold text-[17px] tracking-tight text-white drop-shadow">
          JAMBOX<span className="text-amber-500">+</span>
        </span>
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

      <div className="hidden sm:flex fixed top-0 left-0 w-full justify-center py-5 z-50 pointer-events-none px-4">
`;

code = code.replace(
  /\{\/\* Mobile Top Floating Elements \*\/\}[\s\S]*?<div className="hidden sm:flex fixed top-0 left-0 w-full justify-center py-5 z-50 pointer-events-none px-4">/,
  mobileSearch
);

fs.writeFileSync('src/components/FloatingNav.tsx', code);
