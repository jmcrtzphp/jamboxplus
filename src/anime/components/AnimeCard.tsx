import React, { useState } from 'react';
import { Play, Star, Plus, Check, Sparkles } from 'lucide-react';
import { AnimeMedia } from '../types/anime';
import { getAnimeDisplayTitle, getAnimePoster } from '../api/anilist';

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
  onQuickPlay,
  isFavorite = false,
  onToggleFavorite,
}: AnimeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const title = getAnimeDisplayTitle(anime);
  const poster = getAnimePoster(anime);

  const rawScore = anime.averageScore || anime.meanScore;
  const scoreValue = rawScore ? (rawScore > 10 ? (rawScore / 10).toFixed(1) : rawScore.toFixed(1)) : null;

  const year = anime.seasonYear || anime.startDate?.year;
  const format = anime.format === 'TV_SHORT' ? 'TV' : anime.format || 'TV';

  return (
    <div
      onClick={onClick}
      className="group/card relative aspect-[2/3] w-full rounded-3xl overflow-hidden cursor-pointer bg-[#14161C] border border-white/5 hover:border-white/20 transition-all duration-300 transform-gpu hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 select-none"
    >
      {/* Background Image Layer */}
      <img
        src={imageError ? 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80' : poster}
        alt={title}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105 will-change-transform ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {!imageLoaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse rounded-3xl" />
      )}

      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-black/30 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60" />

      {/* Top Floating Badges */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
        {/* Score or Format Badge */}
        <div className="flex items-center gap-1.5">
          {scoreValue ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-400 shadow-md">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span>{scoreValue}</span>
            </div>
          ) : (
            <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white/80 uppercase tracking-wider">
              {format}
            </div>
          )}
        </div>

        {/* Favorite Bookmark Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => onToggleFavorite(e, anime.id)}
            className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 cursor-pointer ${
              isFavorite
                ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30'
                : 'bg-black/60 text-white/70 border-white/15 hover:text-white hover:bg-black/80 hover:scale-105'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <Check size={14} className="stroke-[3]" /> : <Plus size={14} />}
          </button>
        )}
      </div>

      {/* Center Play Button Overlay on Hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 z-10 pointer-events-none">
        <div 
          onClick={(e) => {
            if (onQuickPlay) {
              e.stopPropagation();
              onQuickPlay(anime);
            }
          }}
          className="pointer-events-auto w-13 h-13 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-2xl shadow-amber-500/50 transform scale-90 group-hover/card:scale-100 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          <Play size={22} className="fill-black ml-1 text-black" />
        </div>
      </div>

      {/* Bottom Information Details */}
      <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 z-10 flex flex-col justify-end pointer-events-none">
        {/* Episodes / Status Pill */}
        <div className="flex items-center gap-1.5 mb-1.5">
          {anime.status === 'RELEASING' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Airing
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-white/70 text-[10px] font-medium">
              {anime.episodes ? `${anime.episodes} Eps` : format}
            </span>
          )}
          {year && (
            <span className="text-[11px] text-white/50 font-medium">
              {year}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm sm:text-base text-white line-clamp-2 leading-snug group-hover/card:text-amber-400 transition-colors drop-shadow-md">
          {title}
        </h3>

        {/* Genres Sub-line */}
        {anime.genres && anime.genres.length > 0 && (
          <p className="text-[11px] text-white/50 truncate mt-1">
            {anime.genres.slice(0, 2).join(' • ')}
          </p>
        )}
      </div>
    </div>
  );
});
