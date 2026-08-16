const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

// The replacement HTML for the Selected Genre View
const newUI = `      ) : selectedGenre ? (
        /* Case 2: Selected Genre View */
        <div className="flex flex-col">
          {/* Back Button */}
          <button 
            onClick={() => { setSelectedGenre(null); window.history.pushState({}, '', '/'); }}
            className="inline-flex items-center self-start gap-2 text-sm font-semibold text-white/80 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-[20px] mb-8 backdrop-blur-3xl cursor-pointer transition-all shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          >
            <ChevronLeft size={16} />
            Back to All Genres
          </button>

          {/* Genre Header Box (Liquid Glass) */}
          <div className="flex items-center gap-6 bg-[rgba(255,255,255,0.03)] backdrop-blur-[30px] border border-[rgba(255,255,255,0.18)] rounded-[36px] p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] mb-8">
            <div className="w-[88px] h-[88px] rounded-[24px] bg-[rgba(255,255,255,0.06)] border border-white/20 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
              <GenreIcon name={selectedGenre.iconName} size={40} className="text-white drop-shadow-md" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-[32px] font-extrabold text-white tracking-tight leading-none drop-shadow-md mb-2">
                {selectedGenre.name}
              </h2>
              <p className="text-[15px] text-white/70 font-medium tracking-wide">
                {selectedGenre.description}
              </p>
            </div>
          </div>

          {/* Content Type Selector */}
          <div className="flex items-center bg-[rgba(255,255,255,0.03)] backdrop-blur-[30px] p-2 rounded-[24px] border border-[rgba(255,255,255,0.12)] mb-8 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <button
              onClick={() => handleSetGenreType('all')}
              className={\`flex-1 py-3 text-sm sm:text-base font-semibold rounded-[16px] transition-all duration-300 cursor-pointer \${
                genreTypeFilter === 'all' 
                  ? 'bg-white/15 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }\`}
            >
              All
            </button>
            <button
              onClick={() => handleSetGenreType('movie')}
              className={\`flex-1 py-3 text-sm sm:text-base font-semibold rounded-[16px] transition-all duration-300 cursor-pointer \${
                genreTypeFilter === 'movie' 
                  ? 'bg-white/15 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }\`}
            >
              Movies
            </button>
            <button
              onClick={() => handleSetGenreType('series')}
              className={\`flex-1 py-3 text-sm sm:text-base font-semibold rounded-[16px] transition-all duration-300 cursor-pointer \${
                genreTypeFilter === 'series' 
                  ? 'bg-white/15 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }\`}
            >
              TV Series
            </button>
          </div>

          {/* Genre Shows List */}`;

// Replace from "      ) : selectedGenre ? (" to "{/* Genre Shows List */}"
const startIdx = code.indexOf(') : selectedGenre ? (');
const endIdx = code.indexOf('{/* Genre Shows List */}', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + newUI + code.substring(endIdx + '{/* Genre Shows List */}'.length);
  fs.writeFileSync('src/components/Movies.tsx', code);
} else {
  console.error("Indices not found", startIdx, endIdx);
}
