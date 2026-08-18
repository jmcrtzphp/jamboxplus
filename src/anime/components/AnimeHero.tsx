import React, { useState, useEffect } from 'react';
import { Play, Info, Plus, Check, Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimeMedia } from '../types/anime';
import { getAnimeDisplayTitle, getAnimeBackdrop, getAnimePoster } from '../api/anilist';
import { GlassButton } from '../../components/liquid-glass';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const animeList = featuredAnime.slice(0, 6);

  // Auto-advance banner every 7 seconds if not hovered
  useEffect(() => {
    if (animeList.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animeList.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [animeList.length, isHovered]);

  if (animeList.length === 0) return null;

  const currentAnime = animeList[currentIndex];
  const title = getAnimeDisplayTitle(currentAnime);
  const backdrop = getAnimeBackdrop(currentAnime);
  const poster = getAnimePoster(currentAnime);
  const score = currentAnime.averageScore ? (currentAnime.averageScore / 10).toFixed(1) : null;
  const isFav = isFavorite ? isFavorite(currentAnime.id) : false;

  const cleanDescription = currentAnime.description
    ? currentAnime.description.replace(/<[^>]*>?/gm, '').slice(0, 220) + '...'
    : 'Stream the full anime series in HD on JamBox+ with CineSrc playback.';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[60vh] sm:h-[68vh] md:h-[78vh] overflow-hidden bg-[#0A0C10] select-none"
    >
      {/* Background Backdrop Layer with Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`backdrop-${currentAnime.id}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={backdrop}
            alt={title}
            className="w-full h-full object-cover object-center filter brightness-90"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Vignettes & Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1113] via-[#0F1113]/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F1113] via-[#0F1113]/70 to-transparent z-10" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80 z-10" />

      {/* Content Container */}
      <div className="relative z-20 h-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-2xl sm:max-w-3xl space-y-4 sm:space-y-5">
          {/* Badges & Meta Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles size={12} />
              Anime Featured
            </span>

            {score && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-300">
                <Star size={11} className="fill-amber-300" />
                {score} Rating
              </span>
            )}

            {currentAnime.format && (
              <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/80 text-xs font-medium uppercase">
                {currentAnime.format}
              </span>
            )}

            {currentAnime.episodes && (
              <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/70 text-xs font-medium">
                {currentAnime.episodes} Episodes
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-2xl">
            {title}
          </h1>

          {/* Genres */}
          {currentAnime.genres && (
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-white/70 font-medium">
              {currentAnime.genres.slice(0, 4).map((g, idx) => (
                <span key={g} className="flex items-center gap-2">
                  {idx > 0 && <span className="text-white/30">•</span>}
                  <span>{g}</span>
                </span>
              ))}
            </div>
          )}

          {/* Synopsis */}
          <p className="text-xs sm:text-sm md:text-base text-white/70 leading-relaxed line-clamp-3 max-w-xl sm:max-w-2xl drop-shadow">
            {cleanDescription}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onPlay(currentAnime, 1)}
              className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm sm:text-base shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Play size={18} className="fill-black" />
              <span>Watch Ep 1</span>
            </button>

            <button
              onClick={() => onOpenDetails(currentAnime)}
              className="flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/15 text-white font-semibold text-sm sm:text-base hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Info size={18} />
              <span>Details</span>
            </button>

            {onToggleFavorite && (
              <button
                onClick={(e) => onToggleFavorite(e, currentAnime.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all duration-200 cursor-pointer ${
                  isFav
                    ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30'
                    : 'bg-black/50 text-white/80 border-white/20 hover:text-white hover:bg-black/70 hover:scale-105'
                }`}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFav ? <Check size={20} className="stroke-[3]" /> : <Plus size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Carousel Controls (Left/Right Arrows & Indicators) */}
      {animeList.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev === 0 ? animeList.length - 1 : prev - 1))}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white items-center justify-center hover:scale-110 active:scale-90 transition-all cursor-pointer"
            aria-label="Previous Featured Anime"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % animeList.length)}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white items-center justify-center hover:scale-110 active:scale-90 transition-all cursor-pointer"
            aria-label="Next Featured Anime"
          >
            <ChevronRight size={22} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute right-4 sm:right-8 md:right-16 bottom-8 z-30 flex items-center gap-2">
            {animeList.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-7 bg-amber-500'
                    : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});
