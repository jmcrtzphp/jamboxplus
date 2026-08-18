import React, { useState } from 'react';
import { Star, Plus, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimeMedia } from '../types/anime';
import { getAnimeDisplayTitle, getAnimePoster } from '../api/anilist';
import { GlassPill } from '../../components/liquid-glass';

interface AnimeCardProps {
  anime: AnimeMedia;
  onClick: () => void;
  onQuickPlay?: (anime: AnimeMedia) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent, id: number) => void;
}

export const AnimeCard = React.memo(function AnimeCard({
  anime,
  onClick,
  isFavorite = false,
  onToggleFavorite,
}: AnimeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const title = getAnimeDisplayTitle(anime);
  const poster = getAnimePoster(anime);

  const rawScore = anime.averageScore || anime.meanScore;
  const ratingValue = rawScore ? (rawScore > 10 ? (rawScore / 10).toFixed(1) : rawScore.toFixed(1)) : null;

  const year = anime.seasonYear || anime.startDate?.year;
  const format = anime.format === 'TV_SHORT' ? 'TV' : anime.format || 'TV';

  return (
    <motion.div
      onClick={onClick}
      style={{ borderRadius: '24px' }}
      className="group/card relative aspect-[2/3] w-full overflow-hidden cursor-pointer glass-subtle border border-white/15 hover:border-white/35 transition-all duration-250 transform hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between gpu-layer will-change-transform select-none"
    >
      {/* Background Poster Image */}
      <img
        src={imageError ? 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80' : poster}
        alt={title}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105 will-change-transform bg-[#14161C] ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {!imageLoaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse rounded-[24px]" />
      )}

      {/* Top Specular Edge Sheen */}
      <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none z-20" />

      {/* Top Floating Badges: Format / Status badge & Favorite action */}
      <div className="relative z-10 p-2.5 flex items-start justify-between gap-1 pointer-events-none">
        {anime.status === 'RELEASING' ? (
          <GlassPill variant="accent" size="xs" className="pointer-events-auto shadow-md">
            AIRING
          </GlassPill>
        ) : (
          <GlassPill variant="subtle" size="xs" className="pointer-events-auto shadow-md">
            {format}
          </GlassPill>
        )}

        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(e, anime.id);
            }}
            className={`pointer-events-auto w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 border shadow-md cursor-pointer ${
              isFavorite
                ? 'bg-red-500 text-white border-red-400 opacity-100 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                : 'bg-black/60 text-white/90 border-white/20 hover:bg-white hover:text-black opacity-0 group-hover/card:opacity-100'
            }`}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            {isFavorite ? <Check size={13} className="stroke-[3]" /> : <Plus size={14} />}
          </button>
        )}
      </div>

      {/* Bottom Info Gradient */}
      <div className="relative z-10 pt-16 pb-3.5 px-3.5 bg-gradient-to-t from-[#080A0E] via-[#080A0E]/80 via-50% to-transparent flex flex-col justify-end">
        <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-1 mb-1 tracking-tight group-hover/card:text-amber-500 transition-colors drop-shadow">
          {title}
        </h4>

        <div className="flex items-center justify-between text-xs text-white/70">
          <div className="flex items-center gap-1.5 text-xs text-white/60 font-medium">
            {year && <span className="text-white/90 font-semibold">{year}</span>}
            {anime.episodes && <span>• {anime.episodes} eps</span>}
          </div>

          {ratingValue && (
            <div className="flex items-center gap-1 text-yellow-400 font-bold text-xs">
              <Star size={11} className="fill-yellow-400 text-yellow-400" />
              <span>{ratingValue}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});
