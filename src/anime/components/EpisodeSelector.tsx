import React, { useState, useMemo } from 'react';
import { Play, CheckCircle2, Search, Film } from 'lucide-react';
import { AnimeMedia } from '../types/anime';
import { getAnimeWatchProgress } from '../api/megaplay';

interface EpisodeSelectorProps {
  anime: AnimeMedia;
  currentEpisode?: number;
  onSelectEpisode: (episodeNumber: number) => void;
  className?: string;
}

export const EpisodeSelector = React.memo(function EpisodeSelector({
  anime,
  currentEpisode = 1,
  onSelectEpisode,
  className = '',
}: EpisodeSelectorProps) {
  const [searchFilter, setSearchFilter] = useState('');
  const [activeChunkIndex, setActiveChunkIndex] = useState(0);

  const totalEpisodes = useMemo(() => {
    if (anime.episodes && anime.episodes > 0) return anime.episodes;
    if (anime.nextAiringEpisode) return Math.max(1, anime.nextAiringEpisode.episode - 1);
    if (anime.status === 'RELEASING') return 24; // Default sensible fallback if ongoing
    if (anime.format === 'MOVIE') return 1;
    return 12; // Standard fallback
  }, [anime.episodes, anime.nextAiringEpisode, anime.status, anime.format]);

  // Saved watch progress for this anime
  const savedProgress = useMemo(() => {
    return getAnimeWatchProgress(anime.id);
  }, [anime.id]);

  // Generate array of all episode numbers
  const allEpisodes = useMemo(() => {
    return Array.from({ length: totalEpisodes }, (_, i) => i + 1);
  }, [totalEpisodes]);

  // Chunk size (e.g. 50 episodes per tab if > 50)
  const CHUNK_SIZE = 50;
  const chunkCount = Math.ceil(totalEpisodes / CHUNK_SIZE);

  const chunks = useMemo(() => {
    const list: Array<{ start: number; end: number; label: string }> = [];
    for (let i = 0; i < chunkCount; i++) {
      const start = i * CHUNK_SIZE + 1;
      const end = Math.min((i + 1) * CHUNK_SIZE, totalEpisodes);
      list.push({
        start,
        end,
        label: `${start} - ${end}`,
      });
    }
    return list;
  }, [chunkCount, totalEpisodes]);

  // Filtered episodes based on search or chunk tab
  const displayedEpisodes = useMemo(() => {
    if (searchFilter.trim()) {
      const num = parseInt(searchFilter.trim(), 10);
      if (!isNaN(num)) {
        return allEpisodes.filter((ep) => ep.toString().includes(searchFilter.trim()));
      }
    }

    if (chunks.length <= 1) {
      return allEpisodes;
    }

    const currentChunk = chunks[activeChunkIndex] || chunks[0];
    return allEpisodes.filter((ep) => ep >= currentChunk.start && ep <= currentChunk.end);
  }, [allEpisodes, searchFilter, chunks, activeChunkIndex]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selector Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Film size={18} className="text-amber-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            Episodes ({totalEpisodes})
          </h3>
        </div>

        {/* Episode Jump/Search */}
        {totalEpisodes > 12 && (
          <div className="relative w-full sm:w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Find episode..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full py-1.5 pl-8 pr-3 text-xs bg-white/5 border border-white/10 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Chunks Navigation (if > 50 episodes, like One Piece / Naruto) */}
      {chunks.length > 1 && !searchFilter && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {chunks.map((chunk, idx) => (
            <button
              key={chunk.label}
              onClick={() => setActiveChunkIndex(idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeChunkIndex === idx
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5'
              }`}
            >
              {chunk.label}
            </button>
          ))}
        </div>
      )}

      {/* Episodes Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-[320px] overflow-y-auto no-scrollbar pr-1">
        {displayedEpisodes.map((epNum) => {
          const isCurrent = currentEpisode === epNum;
          const isWatched = savedProgress && savedProgress.episode >= epNum;

          return (
            <button
              key={epNum}
              onClick={() => onSelectEpisode(epNum)}
              className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isCurrent
                  ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-lg shadow-amber-500/25 scale-[1.03]'
                  : 'bg-white/5 hover:bg-white/15 text-white/90 border-white/10 hover:border-white/20'
              }`}
              title={`Play Episode ${epNum}`}
            >
              <span className="text-xs sm:text-sm font-semibold">
                {epNum}
              </span>

              {/* Status sub-label or icon */}
              <div className="mt-1 flex items-center justify-center">
                {isCurrent ? (
                  <Play size={10} className="fill-black" />
                ) : isWatched ? (
                  <CheckCircle2 size={10} className="text-emerald-400 opacity-80" />
                ) : (
                  <span className="text-[9px] text-white/40 group-hover:text-white/70">
                    Ep
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});
