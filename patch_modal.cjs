const fs = require('fs');

let code = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');

const oldHero = `{trailerUrl && !isPlaying ? (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <iframe 
                        className="absolute top-1/2 left-1/2 w-[450vw] sm:w-[200vw] aspect-video max-w-none -translate-x-1/2 -translate-y-1/2 opacity-70"
                        src={trailerUrl}
                        allow="autoplay; encrypted-media" 
                        allowFullScreen
                        style={{ pointerEvents: 'none' }}
                      />
                    </div>
                  ) : (
                    <img
                      src={backdrop}
                      alt={show.title}
                      decoding="sync"
                      loading="eager"
                      fetchPriority="high"
                      className="w-full h-full object-cover object-center scale-105 filter brightness-100 will-change-transform"
                    />
                  )}`;

const newHero = `{trailerUrl && !isPlaying && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
                      <iframe 
                        className="absolute top-1/2 left-1/2 sm:w-[200vw] aspect-video max-w-none -translate-x-1/2 -translate-y-1/2 opacity-70"
                        src={trailerUrl}
                        allow="autoplay; encrypted-media" 
                        allowFullScreen
                        style={{ pointerEvents: 'none' }}
                      />
                    </div>
                  )}
                  <img
                    src={backdrop}
                    alt={show.title}
                    decoding="sync"
                    loading="eager"
                    fetchPriority="high"
                    className={\`w-full h-full object-cover object-center scale-105 filter brightness-100 will-change-transform \${trailerUrl && !isPlaying ? 'block sm:hidden' : 'block'}\`}
                  />`;

if (code.includes(oldHero)) {
  code = code.replace(oldHero, newHero);
  fs.writeFileSync('src/components/WatchModal.tsx', code);
  console.log('Hero banner patched for mobile.');
} else {
  console.log('Could not find old hero block. Check whitespace/formatting.');
}
