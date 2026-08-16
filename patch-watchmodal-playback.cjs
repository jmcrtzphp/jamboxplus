const fs = require('fs');

let file = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');

file = file.replace(
  /\{isPlaying \? \(\s*<div className="bg-black relative z-20">/g,
  `<AnimatePresence mode="wait">
              {isPlaying ? (
              <motion.div 
                key="player"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-black relative z-20"
              >`
);

file = file.replace(
  /                  <\/div>\n                <\/div>\n              <\/div>\n            \) : \(/,
  `                  </div>
                </div>
              </motion.div>
            ) : (`
);

file = file.replace(
  /              <div className="relative w-full aspect-video md:h-\[50vh\] max-h-\[600px\] bg-black flex-shrink-0 flex items-end">/g,
  `              <motion.div 
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full aspect-video md:h-[50vh] max-h-[600px] bg-black flex-shrink-0 flex items-end"
              >`
);

// We need to close the AnimatePresence for the hero
file = file.replace(
  /                  <\/div>\n                <\/div>\n              <\/div>\n            \)\}/,
  `                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>`
);

fs.writeFileSync('src/components/WatchModal.tsx', file);
