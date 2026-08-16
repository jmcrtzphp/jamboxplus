const fs = require('fs');

let file = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');

file = file.replace(
  /\/\* Backdrop Hero Banner \*\/\n              <div className="relative h-\[42vh\] sm:h-\[48vh\] md:h-\[52vh\] w-full">/g,
  `/* Backdrop Hero Banner */
              <motion.div 
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative h-[42vh] sm:h-[48vh] md:h-[52vh] w-full"
              >`
);

file = file.replace(
  /                  <\/div>\n                <\/div>\n              <\/div>\n            \)\}/,
  `                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>`
);

fs.writeFileSync('src/components/WatchModal.tsx', file);
