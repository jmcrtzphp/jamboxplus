const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

const mobileSearchInput = `
      <div className="sm:hidden mb-6 relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
        <input 
          autoFocus
          type="text" 
          placeholder="Search titles, actors, genres..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1A1D24] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-white/40 outline-none focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>
`;

code = code.replace(/<div className="pt-20 md:pt-32 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen pb-28 md:pb-20">/, 
  match => match + "\n" + mobileSearchInput);

fs.writeFileSync('src/components/Movies.tsx', code);
