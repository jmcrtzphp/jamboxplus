const fs = require('fs');
let code = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');

const relatedBlock = `
              {relatedShows && relatedShows.length > 0 && (
                <div className="mt-8 border-t border-white/10 pt-8">
                  <h3 className="text-lg font-bold text-white mb-4">More Like This</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {relatedShows.slice(0, 10).map((relatedShow) => (
                      <div 
                        key={relatedShow.id} 
                        className="cursor-pointer group relative overflow-hidden rounded-xl border border-white/10 bg-[#1A1D24] aspect-[2/3]"
                        onClick={() => {
                          if (onSelectRelated) onSelectRelated(relatedShow.id);
                        }}
                      >
                        {relatedShow.imageSet?.poster ? (
                          <img 
                            src={relatedShow.imageSet.poster} 
                            alt={relatedShow.title} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-black/40 text-white/50 text-xs p-4 text-center">
                            {relatedShow.title}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                          <h4 className="text-white font-bold text-xs truncate">{relatedShow.title}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-white/70 mt-1">
                            <span className="flex items-center gap-0.5"><Star size={10} className="text-yellow-500 fill-current" /> {relatedShow.rating ? (relatedShow.rating / 10).toFixed(1) : 'NR'}</span>
                            <span>{relatedShow.releaseYear}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
`;

code = code.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\s*:\s*null\}/, match => relatedBlock + match);
fs.writeFileSync('src/components/WatchModal.tsx', code);
