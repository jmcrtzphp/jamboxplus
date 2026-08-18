import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Play,
  Plus,
  Check,
  Star,
  Sparkles,
  Calendar,
  Clock,
  Tv,
  Film,
  Building2,
  Users,
  Layers,
  ChevronRight,
  Share2,
  CheckCircle2,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimeMedia } from '../types/anime';
import {
  fetchAnimeDetails,
  getAnimeDisplayTitle,
  getAnimePoster,
  getAnimeBackdrop,
} from '../api/anilist';
import { EpisodeSelector } from './EpisodeSelector';
import { AnimeCard } from './AnimeCard';

interface AnimeDetailsModalProps {
  animeId: number;
  initialAnime?: AnimeMedia | null;
  onClose: () => void;
  onPlayEpisode: (anime: AnimeMedia, episode: number) => void;
  onSelectRelatedAnime?: (id: number) => void;
  isFavorite?: (id: number) => boolean;
  onToggleFavorite?: (e: React.MouseEvent, id: number) => void;
}

export const AnimeDetailsModal = React.memo(function AnimeDetailsModal({
  animeId,
  initialAnime,
  onClose,
  onPlayEpisode,
  onSelectRelatedAnime,
  isFavorite,
  onToggleFavorite,
}: AnimeDetailsModalProps) {
  const [anime, setAnime] = useState<AnimeMedia | null>(initialAnime || null);
  const [loading, setLoading] = useState(!initialAnime?.characters);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'episodes' | 'characters' | 'relations'>('episodes');

  // Fetch complete details including characters, staff, relations, recommendations
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchAnimeDetails(animeId)
      .then((data) => {
        if (isMounted) {
          setAnime(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Failed to load anime details:', err);
          if (!initialAnime) {
            setError('Could not load anime details. Please check your connection.');
          }
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [animeId, initialAnime]);

  // Lock background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const title = getAnimeDisplayTitle(anime);
  const poster = getAnimePoster(anime);
  const backdrop = getAnimeBackdrop(anime);

  const rawScore = anime?.averageScore || anime?.meanScore;
  const scoreValue = rawScore ? (rawScore > 10 ? (rawScore / 10).toFixed(1) : rawScore.toFixed(1)) : null;
  const isFav = anime && isFavorite ? isFavorite(anime.id) : false;

  const studio = anime?.studios?.edges?.find((e) => e.isMain)?.node?.name || anime?.studios?.edges?.[0]?.node?.name;

  const cleanDescription = useMemo(() => {
    if (!anime?.description) return 'No synopsis available for this title.';
    return anime.description.replace(/<[^>]*>?/gm, '');
  }, [anime?.description]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: `Watch ${title} on JamBox+ Anime`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex justify-center p-0 sm:p-4 md:p-6 select-none animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-5xl bg-[#101216] border border-white/10 sm:rounded-3xl overflow-hidden shadow-2xl min-h-screen sm:min-h-0 my-auto"
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Close (ESC)"
        >
          <X size={20} />
        </button>

        {/* Hero Backdrop Banner */}
        <div className="relative h-[40vh] sm:h-[48vh] w-full overflow-hidden bg-[#14161C]">
          <img
            src={backdrop}
            alt={title}
            className="w-full h-full object-cover object-center filter brightness-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101216] via-[#101216]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101216] via-transparent to-transparent" />

          {/* Quick Play Floating Hero Button */}
          {anime && (
            <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-3">
              <button
                onClick={() => onPlayEpisode(anime, 1)}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play size={18} className="fill-black" />
                <span>Watch Ep 1</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Main Content Container */}
        <div className="relative px-5 sm:px-8 md:px-10 pb-12 -mt-24 sm:-mt-32 z-20">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Left Column: Cover Poster & Action Buttons */}
            <div className="flex flex-col items-center md:items-start shrink-0">
              <div className="w-40 sm:w-52 aspect-[2/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-black/60 border border-white/15 shadow-2xl shadow-black/80">
                <img
                  src={poster}
                  alt={title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Action Buttons below poster on desktop */}
              {anime && (
                <div className="w-full mt-4 flex flex-col gap-2.5">
                  <button
                    onClick={() => onPlayEpisode(anime, 1)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-lg shadow-amber-500/25 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <Play size={16} className="fill-black" />
                    <span>Watch Now</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {onToggleFavorite && (
                      <button
                        onClick={(e) => onToggleFavorite(e, anime.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isFav
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
                        }`}
                      >
                        {isFav ? <Check size={14} className="stroke-[3]" /> : <Plus size={14} />}
                        <span>{isFav ? 'Favorited' : 'Favorite'}</span>
                      </button>
                    )}

                    <button
                      onClick={handleShare}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors cursor-pointer"
                      title="Share title"
                    >
                      {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Share2 size={16} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Title, Metadata, Synopsis, and Interactive Tabs */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {scoreValue && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold">
                    <Star size={12} className="fill-amber-400" />
                    <span>{scoreValue} Rating</span>
                  </div>
                )}

                {anime?.format && (
                  <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-white/80 text-xs font-semibold uppercase">
                    {anime.format}
                  </span>
                )}

                {anime?.status && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    anime.status === 'RELEASING'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-white/10 text-white/70 border-white/10'
                  }`}>
                    {anime.status === 'RELEASING' ? 'Airing Now' : anime.status === 'FINISHED' ? 'Completed' : anime.status}
                  </span>
                )}

                {anime?.seasonYear && (
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-white/60 text-xs">
                    {anime.season} {anime.seasonYear}
                  </span>
                )}

                {studio && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-white/60 text-xs">
                    <Building2 size={12} />
                    {studio}
                  </span>
                )}
              </div>

              {/* Title & Native Titles */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                  {title}
                </h1>
                {anime?.title?.native && (
                  <p className="text-xs sm:text-sm text-white/40 font-mono mt-1">
                    {anime.title.native} {anime.title.romaji && anime.title.romaji !== title ? `• ${anime.title.romaji}` : ''}
                  </p>
                )}
              </div>

              {/* Genres Chips */}
              {anime?.genres && anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {anime.genres.map((g) => (
                    <span
                      key={g}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-white/70 font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {/* Synopsis */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">
                  Synopsis
                </h3>
                <p className="text-sm text-white/80 leading-relaxed max-h-48 overflow-y-auto no-scrollbar pr-2">
                  {cleanDescription}
                </p>
              </div>

              {/* Quick Details Stats Bar */}
              {anime && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-white/40 block">Episodes</span>
                    <span className="font-semibold text-white">
                      {anime.episodes || 'Ongoing'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Duration</span>
                    <span className="font-semibold text-white">
                      {anime.duration ? `${anime.duration} mins / ep` : '24 mins'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Popularity</span>
                    <span className="font-semibold text-white">
                      #{anime.popularity?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Studio</span>
                    <span className="font-semibold text-white truncate block">
                      {studio || 'Unknown Studio'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation: Episodes | Characters | Relations */}
          {anime && (
            <div className="mt-10 border-t border-white/10 pt-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <button
                  onClick={() => setActiveTab('episodes')}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === 'episodes'
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Episodes ({anime.episodes || 'All'})
                </button>

                {anime.characters?.edges && anime.characters.edges.length > 0 && (
                  <button
                    onClick={() => setActiveTab('characters')}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeTab === 'characters'
                        ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Characters & Cast
                  </button>
                )}

                {anime.relations?.edges && anime.relations.edges.length > 0 && (
                  <button
                    onClick={() => setActiveTab('relations')}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeTab === 'relations'
                        ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Sequels & Related
                  </button>
                )}
              </div>

              {/* Tab 1: Episode Selector Grid */}
              {activeTab === 'episodes' && (
                <div className="bg-[#0D0F13] p-4 sm:p-6 rounded-3xl border border-white/5">
                  <EpisodeSelector
                    anime={anime}
                    onSelectEpisode={(ep) => onPlayEpisode(anime, ep)}
                  />
                </div>
              )}

              {/* Tab 2: Characters Gallery */}
              {activeTab === 'characters' && anime.characters?.edges && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {anime.characters.edges.map((edge) => (
                    <div
                      key={edge.node.id}
                      className="bg-white/5 rounded-2xl p-2.5 flex flex-col items-center text-center border border-white/5 hover:border-white/20 transition-all group"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden mb-2 bg-black/40 border border-white/10">
                        {edge.node.image?.large ? (
                          <img
                            src={edge.node.image.large}
                            alt={edge.node.name.full}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <Users size={20} className="text-white/30 m-auto mt-4" />
                        )}
                      </div>
                      <p className="text-xs font-bold text-white line-clamp-1">
                        {edge.node.name.full}
                      </p>
                      <span className="text-[10px] text-amber-400/80 uppercase font-medium mt-0.5">
                        {edge.role}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Relations & Franchise */}
              {activeTab === 'relations' && anime.relations?.edges && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {anime.relations.edges.map((edge) => (
                    <div
                      key={edge.node.id}
                      onClick={() => {
                        if (onSelectRelatedAnime && edge.node.type === 'ANIME') {
                          onSelectRelatedAnime(edge.node.id);
                        }
                      }}
                      className={`bg-white/5 rounded-2xl p-3 border border-white/5 transition-all group flex flex-col ${
                        edge.node.type === 'ANIME' ? 'hover:border-amber-500/50 cursor-pointer' : 'opacity-60'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                        {edge.relationType.replace(/_/g, ' ')}
                      </span>
                      {edge.node.coverImage?.large && (
                        <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-black/40">
                          <img
                            src={edge.node.coverImage.large}
                            alt={edge.node.title.userPreferred || 'Related'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                      <p className="text-xs font-bold text-white line-clamp-2 mt-auto">
                        {edge.node.title.english || edge.node.title.userPreferred || edge.node.title.romaji}
                      </p>
                      <span className="text-[10px] text-white/40 mt-1">
                        {edge.node.format} {edge.node.episodes ? `• ${edge.node.episodes} eps` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations Row */}
              {anime.recommendations?.nodes && anime.recommendations.nodes.length > 0 && (
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-400" />
                    <span>Recommended for You</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {anime.recommendations.nodes
                      .filter((n) => n.mediaRecommendation)
                      .slice(0, 5)
                      .map((node) => {
                        const rec = node.mediaRecommendation!;
                        return (
                          <div
                            key={rec.id}
                            onClick={() => {
                              if (onSelectRelatedAnime) onSelectRelatedAnime(rec.id);
                            }}
                            className="bg-white/5 rounded-2xl p-2.5 border border-white/5 hover:border-amber-500/50 transition-all cursor-pointer group flex flex-col"
                          >
                            {rec.coverImage?.large && (
                              <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-black/40">
                                <img
                                  src={rec.coverImage.large}
                                  alt={rec.title.userPreferred || 'Recommendation'}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                            <p className="text-xs font-bold text-white line-clamp-2 mt-auto group-hover:text-amber-400 transition-colors">
                              {rec.title.english || rec.title.userPreferred || rec.title.romaji}
                            </p>
                            {rec.averageScore && (
                              <span className="text-[10px] text-amber-400 font-semibold mt-1">
                                ⭐ {(rec.averageScore / 10).toFixed(1)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
});
