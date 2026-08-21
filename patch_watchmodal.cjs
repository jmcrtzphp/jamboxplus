const fs = require('fs');

let watch = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');

// 1. Add trailerScrollRef
watch = watch.replace(
  'const relatedScrollRef = useRef<HTMLDivElement>(null);',
  'const relatedScrollRef = useRef<HTMLDivElement>(null);\n  const trailerScrollRef = useRef<HTMLDivElement>(null);'
);

// 2. Replace Cast Section
const castRegex = /\{\/\* Cast \*\/\}[\s\S]*?\{\/\* Trailer Clips \*\/\}/;
const newCast = `{/* Cast */}
                {show.cast && show.cast.length > 0 && (
                  <section className="watch-modal-section mt-6">
                    <h3 className="text-white/50 font-semibold mb-3 uppercase tracking-wider text-[10px]">Cast</h3>
                    <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-1.5 scrollbar-hide snap-x">
                      {show.cast.map((actor, idx) => (
                        <div key={actor.id || idx} className="flex-shrink-0 w-[95px] sm:w-[120px] text-center snap-center">
                          {actor.profilePath ? (
                            <img src={actor.profilePath} alt={actor.name} loading="lazy" className="mx-auto w-[82px] h-[82px] sm:w-[100px] sm:h-[100px] object-cover rounded-full shadow-md border border-white/10" />
                          ) : (
                            <div className="mx-auto w-[82px] h-[82px] sm:w-[100px] sm:h-[100px] rounded-full bg-white/5 flex items-center justify-center text-xl sm:text-2xl font-bold text-white/30 border border-white/5 shadow-md">
                              {actor.name.charAt(0)}
                            </div>
                          )}
                          <div className="mt-3 text-[11px] sm:text-xs font-medium text-white/90 truncate px-1" title={actor.name}>{actor.name}</div>
                          {actor.character && (
                            <div className="text-[9px] sm:text-[10px] text-white/50 truncate px-1 mt-0.5" title={actor.character}>{actor.character}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Trailer Clips */}`;

watch = watch.replace(castRegex, newCast);

// 3. Replace Trailer Clips Section
const trailerRegex = /\{\/\* Trailer Clips \*\/\}[\s\S]*?\{\/\* Movie\/TV Details \*\/\}/;
const newTrailer = `{/* Trailer Clips */}
                {(() => {
                  if (!show.videos || show.videos.length === 0) return null;
                  
                  const trailerClips = show.videos
                    .filter(video => video.site === "YouTube" && ["Trailer", "Teaser", "Clip", "Featurette"].includes(video.type))
                    .sort((a, b) => {
                      const priority = { Trailer: 1, Teaser: 2, Clip: 3, Featurette: 4 };
                      return (priority[a.type] || 99) - (priority[b.type] || 99);
                    });
                  
                  if (trailerClips.length === 0) return null;
                  
                  const officialVideos = trailerClips.filter(video => video.official);
                  const displayVideos = officialVideos.length > 0 ? officialVideos.slice(0, 8) : trailerClips.slice(0, 8);
                  
                  return (
                    <section className="watch-modal-section mt-6 border-t border-white/5 pt-6">
                      <h3 className="text-white/50 font-semibold mb-3 uppercase tracking-wider text-[10px]">Trailer & Clips</h3>
                      <div className="relative group/trailer-carousel">
                        <button
                          className="absolute left-2 top-[60px] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover/trailer-carousel:opacity-100 transition-all hidden sm:flex text-white hover:bg-black/80 hover:scale-110 shadow-lg disabled:opacity-0"
                          onClick={() => {
                            if (trailerScrollRef.current) {
                              trailerScrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
                            }
                          }}
                        >
                          <ChevronLeft className="w-6 h-6 mr-0.5" />
                        </button>
                        
                        <div ref={trailerScrollRef} className="flex gap-3 overflow-x-auto pb-1.5 scrollbar-hide snap-x relative z-0 scroll-smooth">
                          {displayVideos.map((video, idx) => (
                            <button
                              key={video.id || idx}
                              onClick={() => window.open(\`https://www.youtube.com/watch?v=\${video.key}\`, '_blank')}
                              className="flex-shrink-0 w-[210px] sm:w-[240px] bg-transparent border-0 text-left cursor-pointer snap-center group/trailer"
                            >
                              <div className="relative aspect-video overflow-hidden rounded-[14px] bg-black/20 border border-white/5 mb-2">
                                <img
                                  src={\`https://img.youtube.com/vi/\${video.key}/hqdefault.jpg\`}
                                  alt={video.name}
                                  loading="lazy"
                                  className="w-full h-full object-cover opacity-80 group-hover/trailer:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white/90 group-hover/trailer:scale-110 group-hover/trailer:bg-white/20 transition-all backdrop-blur-sm shadow-md">
                                    <Play className="w-4 h-4 ml-1 fill-current" />
                                  </div>
                                </div>
                              </div>
                              <div className="text-[11px] sm:text-xs font-medium text-white/90 truncate px-1" title={video.name}>{video.name}</div>
                              <div className="text-[9px] sm:text-[10px] text-white/50 truncate px-1 mt-0.5" title={video.type}>{video.type}</div>
                            </button>
                          ))}
                        </div>

                        <button
                          className="absolute right-2 top-[60px] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover/trailer-carousel:opacity-100 transition-all hidden sm:flex text-white hover:bg-black/80 hover:scale-110 shadow-lg disabled:opacity-0"
                          onClick={() => {
                            if (trailerScrollRef.current) {
                              trailerScrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
                            }
                          }}
                        >
                          <ChevronRight className="w-6 h-6 ml-0.5" />
                        </button>
                      </div>
                    </section>
                  );
                })()}

                {/* Movie/TV Details */}`;

watch = watch.replace(trailerRegex, newTrailer);

fs.writeFileSync('src/components/WatchModal.tsx', watch);
console.log('Patched WatchModal.tsx with cast and trailer updates');
