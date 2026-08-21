const fs = require('fs');

let watch = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');

const oldCast = `                    <span className="text-white/50 block font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Cast</span>
                    <div className="text-white/90 leading-relaxed font-medium">
                      {show.cast?.slice(0, 5).join(', ') || 'Unknown'}
                    </div>`;

const newCast = `                    <span className="text-white/50 block font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Cast</span>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {show.cast && show.cast.length > 0 ? show.cast.slice(0, 5).map((actor, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1 group/actor cursor-default" title={typeof actor === 'string' ? actor : actor.name}>
                          {typeof actor !== 'string' && actor.profilePath ? (
                            <img src={actor.profilePath} alt={actor.name} className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover/actor:border-white/30 transition-colors shadow-md" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/50 border border-white/5">
                              {(typeof actor === 'string' ? actor : actor.name).charAt(0)}
                            </div>
                          )}
                          <span className="text-[10px] text-white/70 text-center w-12 truncate">{typeof actor === 'string' ? actor : actor.name}</span>
                        </div>
                      )) : 'Unknown'}
                    </div>`;

watch = watch.replace(oldCast, newCast);
fs.writeFileSync('src/components/WatchModal.tsx', watch);
console.log('Patched WatchModal.tsx cast section');
