const fs = require('fs');

let watch = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');

const startIndex = watch.indexOf('{/* Main Metadata Layout */}');
const endIndex = watch.indexOf('{/* Related Shows (You May Also Like) */}');

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `{/* Main Metadata Layout */}
              <div className="pt-6 border-t border-white/5 space-y-8 mt-6">
                
                {/* Cast */}
                {show.cast && show.cast.length > 0 && (
                  <section className="watch-modal-section mt-6">
                    <h3 className="text-white/50 font-semibold mb-3 uppercase tracking-wider text-[10px]">Cast</h3>
                    <div className="flex gap-3 overflow-x-auto pb-1.5 scrollbar-hide snap-x">
                      {show.cast.map((actor, idx) => (
                        <div key={actor.id || idx} className="flex-shrink-0 w-[78px] sm:w-[90px] text-center snap-center">
                          {actor.profilePath ? (
                            <img src={actor.profilePath} alt={actor.name} loading="lazy" className="w-[78px] h-[104px] sm:w-[90px] sm:h-[120px] object-cover rounded-[14px] shadow-sm" />
                          ) : (
                            <div className="w-[78px] h-[104px] sm:w-[90px] sm:h-[120px] rounded-[14px] bg-white/5 flex items-center justify-center text-sm font-bold text-white/30 border border-white/5">
                              {actor.name.charAt(0)}
                            </div>
                          )}
                          <div className="mt-2 text-[11px] sm:text-xs font-medium text-white/90 truncate px-1" title={actor.name}>{actor.name}</div>
                          {actor.character && (
                            <div className="text-[9px] sm:text-[10px] text-white/50 truncate px-1" title={actor.character}>{actor.character}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Trailer Clips */}
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
                      <div className="flex gap-3 overflow-x-auto pb-1.5 scrollbar-hide snap-x">
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
                                <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white/90 group-hover/trailer:scale-110 group-hover/trailer:bg-white/20 transition-all backdrop-blur-sm">
                                  <Play className="w-4 h-4 ml-1 fill-current" />
                                </div>
                              </div>
                            </div>
                            <div className="text-[11px] sm:text-xs font-medium text-white/90 truncate px-1" title={video.name}>{video.name}</div>
                            <div className="text-[9px] sm:text-[10px] text-white/50 truncate px-1 mt-0.5" title={video.type}>{video.type}</div>
                          </button>
                        ))}
                      </div>
                    </section>
                  );
                })()}

                {/* Movie/TV Details */}
                <section className="watch-modal-section mt-6 border-t border-white/5 pt-6">
                  <h3 className="text-white/50 font-semibold mb-4 uppercase tracking-wider text-[10px]">
                    {show.showType === 'series' ? 'TV Show Details' : 'Movie Details'}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Genre */}
                    {show.genres && show.genres.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] opacity-55 text-white/60">Genre</span>
                        <div className="flex flex-wrap gap-1.5">
                          {show.genres.map(genre => (
                            <span key={genre.id} className="px-2.5 py-1 text-xs rounded-full bg-white/5 border border-white/5 text-white/80">
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Director / Creator */}
                    {(() => {
                       const isTV = show.showType === 'series';
                       const directors = show.directors?.join(', ');
                       const creators = show.creators?.join(', ');
                       
                       if (!isTV && directors) {
                         return (
                           <div className="flex flex-col gap-1.5">
                             <span className="text-[12px] opacity-55 text-white/60">Director</span>
                             <span className="text-[14px] text-white/90">{directors}</span>
                           </div>
                         );
                       }
                       if (isTV && creators) {
                         return (
                           <div className="flex flex-col gap-1.5">
                             <span className="text-[12px] opacity-55 text-white/60">Creator</span>
                             <span className="text-[14px] text-white/90">{creators}</span>
                           </div>
                         );
                       }
                       if (isTV && directors) {
                         return (
                           <div className="flex flex-col gap-1.5">
                             <span className="text-[12px] opacity-55 text-white/60">Director</span>
                             <span className="text-[14px] text-white/90">{directors}</span>
                           </div>
                         );
                       }
                       return null;
                    })()}

                    {/* Release Info */}
                    {show.releaseYear && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] opacity-55 text-white/60">Year</span>
                        <span className="text-[14px] text-white/90">{show.releaseYear}</span>
                      </div>
                    )}
                    
                    {/* Runtime */}
                    {show.runtime && show.runtime > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] opacity-55 text-white/60">Runtime</span>
                        <span className="text-[14px] text-white/90">
                          {show.runtime >= 60 ? \`\${Math.floor(show.runtime / 60)}h \${show.runtime % 60 > 0 ? \`\${show.runtime % 60}m\` : ''}\` : \`\${show.runtime}m\`}
                        </span>
                      </div>
                    )}

                    {/* Origin Country */}
                    {show.originCountry && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] opacity-55 text-white/60">Origin Country</span>
                        <span className="text-[14px] text-white/90">
                          {(() => {
                            const code = show.originCountry;
                            const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
                            try {
                              return regionNames.of(code) || code;
                            } catch (e) {
                              return code;
                            }
                          })()}
                        </span>
                      </div>
                    )}

                    {/* Original Language */}
                    {show.originalLanguage && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] opacity-55 text-white/60">Original Language</span>
                        <span className="text-[14px] text-white/90 capitalize">
                          {(() => {
                            const code = show.originalLanguage;
                            const languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
                            try {
                              return languageNames.of(code) || code;
                            } catch (e) {
                              return code;
                            }
                          })()}
                        </span>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              `;
  watch = watch.substring(0, startIndex) + replacement + watch.substring(endIndex);
  fs.writeFileSync('src/components/WatchModal.tsx', watch);
  console.log('Patched WatchModal.tsx layout');
} else {
  console.log('Could not find replace targets');
}
