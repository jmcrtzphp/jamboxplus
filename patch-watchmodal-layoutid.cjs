const fs = require('fs');

let file = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');

file = file.replace(
  /className="relative w-full max-w-6xl max-h-\[95vh\] glass-strong border border-white\/20 overflow-hidden shadow-\[0_30px_90px_rgba\(0,0,0,0\.9\)\] flex flex-col z-10 text-white"/,
  `layoutId={\`poster-\${tmdbId}\`}
        className="relative w-full max-w-6xl max-h-[95vh] glass-strong border border-white/20 overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex flex-col z-10 text-white"`
);

// We should also remove the hardcoded exit animation if we are using layoutId, because layoutId will automatically animate it back to the poster. But opacity and scale can stay, Framer Motion will blend them.

// Now for TV Show Season Switching (WatchModal.tsx)
// Look for seasonData.episodes.map
// Wrap it in AnimatePresence

file = file.replace(
  /seasonData\?.episodes && seasonData\.episodes\.length > 0 \? \(\s*<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3\.5 pt-2">/g,
  `seasonData?.episodes && seasonData.episodes.length > 0 ? (
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={selectedSeason}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2"
                      >`
);

file = file.replace(
  /                          <\/div>\n                        \);\n                      \}\)\}\n                    <\/div>\n                  \) : \(/,
  `                          </div>
                        );
                      })}
                      </motion.div>
                    </AnimatePresence>
                  ) : (`
);

fs.writeFileSync('src/components/WatchModal.tsx', file);
