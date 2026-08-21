import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Clock, X, ChevronLeft, ChevronRight, Film, Tv } from 'lucide-react';
import { getAllWatchProgress, removeWatchProgress, WatchProgressItem } from '../lib/cinesrc';
import { GlassPill } from './liquid-glass';
import { LiquidGlass } from './LiquidGlass';

interface ContinueWatchingRowProps {
  onSelect: (id: string) => void;
  filterType?: 'movie' | 'tv' | 'all';
}

export function ContinueWatchingRow({ onSelect, filterType = 'all' }: ContinueWatchingRowProps) {
  const [items, setItems] = useState<WatchProgressItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadItems = useCallback(() => {
    const list = getAllWatchProgress();
    const filtered = list.filter(item => {
      if (filterType === 'movie') return item.mediaType === 'movie';
      if (filterType === 'tv') return item.mediaType === 'tv';
      return true;
    });
    setItems(filtered);
  }, [filterType]);

  useEffect(() => {
    loadItems();

    const handleProgressUpdate = () => {
      loadItems();
    };

    window.addEventListener('jamtv-progress-updated', handleProgressUpdate);
    return () => window.removeEventListener('jamtv-progress-updated', handleProgressUpdate);
  }, [loadItems]);

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeWatchProgress(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: dir === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="relative group px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <svg className="w-5 h-5 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 12L3 18.9671C3 21.2763 5.53435 22.736 7.59662 21.6145L10.7996 19.8727M3 8L3 5.0329C3 2.72368 5.53435 1.26402 7.59661 2.38548L20.4086 9.35258C22.5305 10.5065 22.5305 13.4935 20.4086 14.6474L14.0026 18.131" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white drop-shadow">
            Continue Watching
          </h3>
        </div>

        {items.length > 3 && (
          <div className="hidden sm:flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 md:right-12 top-0 -mt-1 z-10">
            <div className="pointer-events-auto">
              <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full glass-button flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronLeft size={16} className="text-white" />
          </button>
            </div>
            <div className="pointer-events-auto">
              <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full glass-button flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight size={16} className="text-white" />
          </button>
            </div>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
      >
        {items.map((item, index) => {
          const bgImg = item.backdrop || item.poster;
          
          // Generate srcset if we assume TMDB structure and it has imageSet
          const hPoster = (item as any).imageSet?.horizontalPoster;
          const srcSet = hPoster ? [
            hPoster.w360 ? `${hPoster.w360} 360w` : null,
            hPoster.w480 ? `${hPoster.w480} 480w` : null,
            hPoster.w720 ? `${hPoster.w720} 720w` : null,
            hPoster.w1080 ? `${hPoster.w1080} 1080w` : null,
          ].filter(Boolean).join(', ') : undefined;

          const isMovie = item.mediaType === 'movie';
          const progressPercent = Math.min(100, Math.max(5, Math.round(item.percentage || 0)));

          return (
            <div
              key={`${item.id}-${index}`}
              onClick={() => onSelect(item.id)}
              className="relative flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[360px] aspect-video rounded-2xl overflow-hidden glass-subtle hover:glass-medium border border-white/15 hover:border-amber-500/50 transition-all duration-300 cursor-pointer group/card shadow-lg flex flex-col justify-end p-3.5"
            >
              {/* Background Backdrop */}
              {bgImg ? (
                <img
                  src={bgImg}
                  srcSet={srcSet}
                  sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, (max-width: 1024px) 320px, 360px"
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-[#12141A]" />
              )}

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Remove Button */}
              <button
                onClick={(e) => handleRemove(e, item.id)}
                className="absolute top-2.5 right-2.5 z-20 w-6 h-6 rounded-full bg-black/60 hover:bg-red-500/80 text-white/70 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover/card:opacity-100"
                title="Remove from Continue Watching"
              >
                <X size={12} />
              </button>

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full glass-button-primary flex items-center justify-center shadow-lg group-hover/card:scale-110 transition-transform">
                  <Play size={16} className="text-white ml-0.5 fill-current" />
                </div>
              </div>

              {/* Card Bottom Meta */}
              <div className="relative z-10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <GlassPill variant="accent" size="xs">
                    {isMovie ? 'MOVIE' : `S${item.season}:E${item.episode}`}
                  </GlassPill>
                  <span className="text-[10px] text-white/70 font-mono">
                    {progressPercent}%
                  </span>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-white truncate drop-shadow">
                  {item.title}
                </h4>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
