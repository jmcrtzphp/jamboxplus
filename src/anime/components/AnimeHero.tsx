import React, { useState, useEffect, useRef } from 'react';
import { Play, Info, Plus, Check, Star, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimeMedia } from '../types/anime';
import { getAnimeDisplayTitle, getAnimeBackdrop, getAnimePoster } from '../api/anilist';
import { GlassButton } from '../../components/liquid-glass';
import { usePullDownZoom } from '../../hooks/usePullDownZoom';
import { useElasticOverscroll } from '../../hooks/useElasticOverscroll';

interface AnimeHeroProps {
  featuredAnime: AnimeMedia[];
  onPlay: (anime: AnimeMedia, episode?: number) => void;
  onOpenDetails: (anime: AnimeMedia) => void;
  isFavorite?: (id: number) => boolean;
  onToggleFavorite?: (e: React.MouseEvent, id: number) => void;
}

export const AnimeHero = React.memo(function AnimeHero({
  featuredAnime,
  onPlay,
  onOpenDetails,
  isFavorite,
  onToggleFavorite,
}: AnimeHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const animeList = featuredAnime.slice(0, 6);

  // Auto-advance banner every 6 seconds
  useEffect(() => {
    if (animeList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % animeList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [animeList.length, activeIndex]);

  const { dragX, scale: swipeScale, handleDragEnd } = useElasticOverscroll({
    activeIndex,
    itemCount: animeList.length,
    onSwipeLeft: () => setActiveIndex((i) => (i + 1) % animeList.length),
    onSwipeRight: () => setActiveIndex((i) => (i - 1 + animeList.length) % animeList.length),
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { imageScale, contentY } = usePullDownZoom(containerRef);

  if (animeList.length === 0) return null;

  const currentAnime = animeList[activeIndex];
  const title = getAnimeDisplayTitle(currentAnime);
  const rawScore = currentAnime.averageScore || currentAnime.meanScore;
  const rating = rawScore ? (rawScore > 10 ? (rawScore / 10).toFixed(1) : rawScore.toFixed(1)) : null;
  const isFav = isFavorite ? isFavorite(currentAnime.id) : false;

  const cleanDescription = currentAnime.description
    ? currentAnime.description.replace(/<[^>]*>?/gm, '')
    : 'Stream the full anime series in HD on JamBox+ with fast, ad-free MegaPlay streaming.';

  return (
    <div
      ref={containerRef}
      style={{ touchAction: 'pan-x pan-y', WebkitUserSelect: 'none' }}
      className="relative h-[92vh] md:h-[90vh] w-full overflow-hidden gpu-layer group bg-black select-none"
    >
      {/* 1. Sticky Hero Image Layer */}
      <motion.div
        className="sticky top-0 inset-x-0 w-full h-full pointer-events-none will-change-transform"
        style={{
          scale: imageScale,
          transformOrigin: '50% 0%',
          WebkitTransformOrigin: '50% 0%',
        }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ x: dragX, scale: swipeScale, touchAction: 'pan-x pan-y' }}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing pointer-events-auto"
        >
          {/* Background Posters with cross-fade */}
          {animeList.map((anime, idx) => {
            const bg = getAnimeBackdrop(anime) || getAnimePoster(anime);
            return (
              <img
                key={`${anime.id}-${idx}`}
                src={bg}
                alt={getAnimeDisplayTitle(anime)}
                decoding={idx === activeIndex ? 'sync' : 'async'}
                loading={idx === activeIndex ? 'eager' : 'lazy'}
                fetchPriority={idx === activeIndex ? 'high' : 'auto'}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-100 will-change-transform transition-opacity duration-1000 ease-in-out ${
                  idx === activeIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
                }`}
              />
            );
          })}

          {/* Atmospheric Liquid Glass Depth Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1113] via-[#0F1113]/60 via-30% to-transparent z-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1113] via-[#0F1113]/60 via-30% to-transparent w-full md:w-2/3 z-0" />
        </motion.div>
      </motion.div>

      {/* 2. Parallax Content Overlay Layer */}
      <motion.div
        style={{ y: contentY }}
        className="absolute bottom-16 sm:bottom-20 md:bottom-28 left-0 right-0 px-6 sm:px-0 sm:left-6 md:left-8 lg:left-12 xl:left-16 sm:right-auto flex flex-col items-center text-center sm:items-start sm:text-left max-w-2xl z-10 pb-2 sm:pb-0 pointer-events-none will-change-transform"
      >
        <div className="flex items-center gap-2 mb-3.5 pointer-events-auto">
          {rating && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-subtle text-yellow-300 text-xs font-bold shadow-md">
              <Star size={13} className="fill-yellow-400 text-yellow-400" />
              <span>{rating} Rating</span>
            </div>
          )}
          {currentAnime.format && (
            <span className="px-2.5 py-1 rounded-full glass-subtle text-white/80 text-xs font-bold uppercase tracking-wider">
              {currentAnime.format === 'TV_SHORT' ? 'TV' : currentAnime.format}
            </span>
          )}
          {currentAnime.status === 'RELEASING' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Airing
            </span>
          )}
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg leading-tight transition-all duration-500">
          {title}
        </h1>

        <p className="text-white/80 text-sm md:text-base line-clamp-3 mb-6 font-normal drop-shadow leading-relaxed max-w-xl transition-all duration-500 pointer-events-auto">
          {cleanDescription}
        </p>

        {/* Hero Interactive Physical Buttons */}
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 pointer-events-auto">
          <GlassButton
            variant="primary"
            size="md"
            onClick={() => onOpenDetails(currentAnime)}
            className="cursor-pointer"
          >
            <Play size={17} className="fill-white" /> Watch Options
          </GlassButton>

          {onToggleFavorite && (
            <GlassButton
              variant="secondary"
              size="md"
              onClick={(e) => onToggleFavorite(e, currentAnime.id)}
              className="cursor-pointer"
            >
              {isFav ? <Check size={17} className="text-green-400" /> : <Plus size={17} />}
              {isFav ? 'Saved' : 'Favorites'}
            </GlassButton>
          )}

          <GlassButton
            variant="secondary"
            size="md"
            onClick={() => onOpenDetails(currentAnime)}
            className="cursor-pointer !px-3"
            aria-label="More Info"
          >
            <Info size={18} className="text-white/80" />
          </GlassButton>
        </div>
      </motion.div>

      {/* 3. Carousel Indicators */}
      <motion.div
        style={{ y: contentY }}
        className="absolute bottom-6 md:bottom-12 left-0 right-0 sm:right-auto flex justify-center sm:justify-start sm:left-6 md:left-8 lg:left-12 xl:left-16 items-center gap-2 z-20 pointer-events-none will-change-transform"
      >
        {animeList.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer pointer-events-auto ${
              idx === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </motion.div>
    </div>
  );
});
