import React, { useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { AnimeMedia } from '../types/anime';
import { AnimeCard } from './AnimeCard';
import { AnimeRowSkeleton } from './AnimeSkeleton';

interface AnimeRowProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  animeList: AnimeMedia[];
  loading?: boolean;
  onSelectAnime: (anime: AnimeMedia) => void;
  onQuickPlay?: (anime: AnimeMedia) => void;
  onSeeAll?: () => void;
  isFavorite?: (id: number) => boolean;
  onToggleFavorite?: (e: React.MouseEvent, id: number) => void;
}

export const AnimeRow = React.memo(function AnimeRow({
  title,
  icon,
  subtitle,
  animeList,
  loading = false,
  onSelectAnime,
  onQuickPlay,
  onSeeAll,
  isFavorite,
  onToggleFavorite,
}: AnimeRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: dir === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading && (!animeList || animeList.length === 0)) {
    return <AnimeRowSkeleton title={title} />;
  }

  if (!loading && (!animeList || animeList.length === 0)) {
    return null;
  }

  return (
    <div className="relative group px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-8 h-8 rounded-xl glass-subtle flex items-center justify-center text-amber-400">
              {icon}
            </div>
          )}
          <div>
            {subtitle && (
              <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-0.5">
                {subtitle}
              </div>
            )}
            <h3 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
              {title}
            </h3>
          </div>
        </div>

        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1 group/btn glass-subtle px-3 py-1 rounded-full cursor-pointer transition-colors"
          >
            See All <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Row Horizontal Shelf */}
      <div className="relative">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-24 glass-subtle rounded-r-2xl hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronRight size={24} className="rotate-180 text-white" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide snap-x py-4 -my-4 pl-1 pr-12"
        >
          {animeList.slice(0, 15).map((anime, index) => (
            <div
              key={`${anime.id}-${index}`}
              className="w-[140px] sm:w-[160px] md:w-[190px] lg:w-[220px] xl:w-[240px] flex-shrink-0 snap-start"
            >
              <AnimeCard
                anime={anime}
                onClick={() => onSelectAnime(anime)}
                onQuickPlay={onQuickPlay}
                isFavorite={isFavorite ? isFavorite(anime.id) : false}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-24 glass-subtle rounded-l-2xl hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
});
