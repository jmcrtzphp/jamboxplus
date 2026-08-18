import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading && (!animeList || animeList.length === 0)) {
    return <AnimeRowSkeleton title={title} />;
  }

  if (!loading && (!animeList || animeList.length === 0)) {
    return null;
  }

  return (
    <div className="my-8 sm:my-10 relative group/row">
      {/* Row Header */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between mb-3.5 sm:mb-4.5">
        <div>
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-white/50 mt-0.5">{subtitle}</p>
          )}
        </div>

        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All</span>
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Relative Carousel Container */}
      <div className="relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/15 text-white items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/15 text-white items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={22} />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          onScroll={checkScroll}
          className="flex gap-3 sm:gap-4.5 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {animeList.map((anime) => (
            <div
              key={anime.id}
              className="w-[140px] sm:w-[165px] md:w-[195px] lg:w-[225px] xl:w-[245px] flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
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
      </div>
    </div>
  );
});
