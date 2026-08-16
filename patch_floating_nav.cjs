const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingNav.tsx', 'utf8');

const startStr = '{/* Mobile Top Floating Elements */}';
const endStr = '<div className="hidden sm:flex fixed top-0 left-0 w-full justify-center py-5 z-50 pointer-events-none px-4">';

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `{/* Mobile Top Floating Elements */}
      <div className="sm:hidden fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-black/80 via-black/30 to-transparent z-40 pointer-events-none" />
      
      {/* Logo */}
      <div 
        className="sm:hidden fixed top-4 left-4 z-50 pointer-events-auto cursor-pointer flex items-center gap-2 bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.15)] rounded-[20px] pl-2.5 pr-4 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.3)]" 
        onClick={onBack}
      >
        <Logo className="w-8 h-8 drop-shadow-md" />
        <JamBoxText className="text-[16px] drop-shadow-md" />
      </div>

      {/* Profile & Search Container */}
      <div className="sm:hidden fixed top-4 right-4 left-4 z-50 pointer-events-none flex flex-col items-end">
        {/* Profile Button - Layered ON TOP */}
        <div className="pointer-events-auto bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.15)] rounded-full p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)] z-20 relative">
          {profileMenu}
        </div>

        {/* Search Bar - Layered BENEATH profile */}
        <AnimatePresence>
          {activeTab === 'search' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full relative pointer-events-auto z-10 -mt-4" 
            >
              <div className="relative w-full">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 drop-shadow-md z-10" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search titles, actors, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[rgba(20,23,29,0.5)] backdrop-blur-[30px] border border-[rgba(255,255,255,0.15)] rounded-[24px] py-4 pl-12 pr-12 text-[15px] text-white placeholder-white/40 outline-none focus:border-amber-500/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all"
                />
                <button 
                  onClick={() => { setSearchQuery(''); setActiveTab('movies'); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      `;
  code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
  fs.writeFileSync('src/components/FloatingNav.tsx', code);
} else {
  console.error("Could not find replacement bounds");
}
