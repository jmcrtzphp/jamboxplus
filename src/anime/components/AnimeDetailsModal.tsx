import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';
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
  ChevronLeft,
  Share2,
  CheckCircle2,
  ArrowLeft,
  RotateCw,
  Loader2,
  ShieldCheck,
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
import { GlassButton, GlassPill } from '../../components/liquid-glass';
import { usePullDownZoom } from '../../hooks/usePullDownZoom';
import { animePlaybackService } from '../services/playbackService';

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

  // In-modal Cinema Playback State (matching WatchModal format)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [isPlayerLoading, setIsPlayerLoading] = useState(true);

  // Pull-down stretch for modal hero banner
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalHeroRef = useRef<HTMLDivElement>(null);
  const { imageScale: modalImageScale, contentY: modalContentY } = usePullDownZoom(modalHeroRef, {
    scrollContainerRef,
    maxScale: 1.0,
    pullRange: 220,
    contentParallaxRatio: -0.35,
  });

  // Lock background body scroll
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Fetch complete details
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    // Retrieve saved progress
    const progress = animePlaybackService.getProgress(animeId);
    if (progress?.episode) {
      setCurrentEpisode(progress.episode);
    } else {
      setCurrentEpisode(1);
    }

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
            setError('Could not load anime details.');
          }
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [animeId, initialAnime]);

  const title = getAnimeDisplayTitle(anime);
  const poster = getAnimePoster(anime);
  const backdrop = getAnimeBackdrop(anime) || poster;

  const rawScore = anime?.averageScore || anime?.meanScore;
  const scoreValue = rawScore ? (rawScore > 10 ? (rawScore / 10).toFixed(1) : rawScore.toFixed(1)) : null;
  const isFav = anime && isFavorite ? isFavorite(anime.id) : false;

  const studio = anime?.studios?.edges?.find((e) => e.isMain)?.node?.name || anime?.studios?.edges?.[0]?.node?.name;

  const totalEpisodes = useMemo(() => {
    if (anime?.episodes && anime.episodes > 0) return anime.episodes;
    if (anime?.nextAiringEpisode) return Math.max(1, anime.nextAiringEpisode.episode - 1);
    if (anime?.status === 'RELEASING') return 24;
    if (anime?.format === 'MOVIE') return 1;
    return 12;
  }, [anime]);

  const hasNextEpisode = currentEpisode < totalEpisodes;
  const hasPrevEpisode = currentEpisode > 1;

  // Retrieve MegaPlay playback sources
  const sources = useMemo(() => {
    if (!anime) return [];
    return animePlaybackService.getSources({
      anilistId: anime.id,
      idMal: anime.idMal,
      episode: currentEpisode,
      title: `${title} - Episode ${currentEpisode}`,
      poster,
      backdrop,
      autoPlay: true,
    });
  }, [anime, currentEpisode, title, poster, backdrop]);

  const currentSource = sources[selectedServerIndex] || sources[0];

  const handleNextEpisode = useCallback(() => {
    if (hasNextEpisode) {
      setCurrentEpisode((e) => e + 1);
      setIsPlayerLoading(true);
    }
  }, [hasNextEpisode]);

  const handlePrevEpisode = useCallback(() => {
    if (hasPrevEpisode) {
      setCurrentEpisode((e) => Math.max(1, e - 1));
      setIsPlayerLoading(true);
    }
  }, [hasPrevEpisode]);

  const handleStartPlayback = useCallback((ep: number = 1) => {
    setCurrentEpisode(ep);
    setIsPlayerLoading(true);
    flushSync(() => {
      setIsPlaying(true);
    });
  }, []);

  const handleStopPlayback = useCallback(() => {
    setIsPlaying(false);
  }, []);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 md:p-6 lg:p-8 overflow-hidden bg-[#0A0C10] sm:bg-transparent select-none">
      {/* Dim Backdrop Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="hidden sm:block absolute inset-0 bg-black/85 backdrop-blur-xl"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as any }}
        className="relative w-full h-full sm:h-auto sm:max-h-[95vh] max-w-6xl bg-[#0A0C10] sm:glass-strong sm:border sm:border-white/20 sm:rounded-[28px] overflow-hidden sm:shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex flex-col z-10 text-white"
      >
        {/* Top Edge Specular Highlight - Desktop Only */}
        <div className="hidden sm:block absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-100 via-white to-transparent pointer-events-none blur-[0.2px] z-30" />

        {/* Floating Close/Back Button */}
        {!isPlaying && (
          <button
            onClick={onClose}
            className="absolute top-4 left-4 sm:left-auto sm:right-4 z-40 p-2.5 rounded-full bg-black/50 sm:glass-subtle hover:bg-black/70 sm:hover:bg-white/20 text-white transition-all cursor-pointer shadow-lg backdrop-blur-md"
            title="Back / Close"
          >
            <ArrowLeft className="sm:hidden block w-5 h-5" />
            <X className="hidden sm:block w-5 h-5" />
          </button>
        )}

        {loading && !anime ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] gap-3">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            <p className="text-white/60 text-sm font-medium animate-pulse">Loading anime details...</p>
          </div>
        ) : anime ? (
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-hide">
            {/* Top Video Stage / Hero Section */}
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div
                  key="player"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
                  className="bg-black relative z-20 overflow-hidden"
                >
                  {/* Ambient Glow Background */}
                  <div
                    className="absolute -inset-10 bg-cover bg-center opacity-30 blur-[60px] md:blur-[100px] animate-pulse pointer-events-none"
                    style={{
                      backgroundImage: `url(${backdrop})`,
                      animationDuration: '8s',
                    }}
                  />

                  {/* Cinema View Player Stage */}
                  <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 md:p-6 relative z-10 flex flex-col justify-center">
                    {/* Floating Action Bar / Top Overlay */}
                    <div className="fullscreen-overlay-bar mb-3 flex items-center justify-between gap-2 px-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleStopPlayback}
                          className="px-3 py-1.5 rounded-xl glass-subtle hover:glass-medium text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                          title="Back to Details"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
                          <span className="hidden sm:inline">Back to Details</span>
                        </button>

                        <GlassPill variant="accent" size="xs">
                          EP {currentEpisode}
                        </GlassPill>

                        <span className="text-xs text-white/90 font-bold truncate max-w-[140px] sm:max-w-[240px] md:max-w-md drop-shadow">
                          {title} - Episode {currentEpisode}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Server Selector */}
                        <div className="relative">
                          <select
                            value={selectedServerIndex}
                            onChange={(e) => setSelectedServerIndex(Number(e.target.value))}
                            aria-label="Select server"
                            className="bg-white/10 hover:bg-white/20 text-white text-xs rounded-xl px-2.5 py-1.5 pr-6 border border-white/15 focus:outline-none focus:border-amber-500 cursor-pointer appearance-none"
                          >
                            {sources.map((src, idx) => (
                              <option key={src.id} value={idx} className="bg-[#14161C] text-white">
                                {src.name}
                              </option>
                            ))}
                          </select>
                          <Layers size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                        </div>

                        <button
                          onClick={onClose}
                          className="p-1.5 rounded-xl glass-subtle hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer shadow-md"
                          title="Close Modal"
                        >
                          <X className="w-4 h-4 sm:w-[17px] sm:h-[17px]" />
                        </button>
                      </div>
                    </div>

                    {/* Main MegaPlay Video Embed with full ad-blocking sandbox */}
                    <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.8)] border border-white/10 bg-black">
                      {currentSource?.url && (
                        <iframe
                          key={`${anime.id}-${currentEpisode}-${selectedServerIndex}`}
                          src={currentSource.url}
                          title={`${title} - Episode ${currentEpisode}`}
                          allowFullScreen
                          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; accelerometer; gyroscope"
                          referrerPolicy="no-referrer"
                          onLoad={() => setIsPlayerLoading(false)}
                          className="w-full h-full border-0 relative z-10 block"
                        />
                      )}

                      <AnimatePresence>
                        {isPlayerLoading && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0F1113]/90 backdrop-blur-md gap-3 pointer-events-none"
                          >
                            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                            <p className="text-sm font-semibold text-white">Loading Episode {currentEpisode}...</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Episode Navigation Controls */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/60">Episode Navigation:</span>
                        <button
                          onClick={handlePrevEpisode}
                          disabled={!hasPrevEpisode}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                            hasPrevEpisode
                              ? 'glass-subtle hover:glass-medium text-white cursor-pointer'
                              : 'opacity-40 text-white/40 cursor-not-allowed'
                          }`}
                        >
                          <ChevronLeft size={14} /> Prev Episode
                        </button>

                        <button
                          onClick={handleNextEpisode}
                          disabled={!hasNextEpisode}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                            hasNextEpisode
                              ? 'bg-amber-500 hover:bg-amber-400 text-black font-bold cursor-pointer shadow-md'
                              : 'opacity-40 text-white/40 cursor-not-allowed'
                          }`}
                        >
                          Next Episode <ChevronRight size={14} />
                        </button>
                      </div>

                      <span className="text-xs text-white/50">
                        Episode {currentEpisode} of {totalEpisodes}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Backdrop Hero Banner with Pull-Down Zoom & Stretch */
                <motion.div
                  key="hero"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  ref={modalHeroRef}
                  className="relative w-full h-[380px] sm:h-[440px] md:h-[500px] overflow-hidden bg-black flex-shrink-0"
                >
                  <motion.div
                    className="sticky top-0 inset-x-0 w-full h-full pointer-events-none will-change-transform"
                    style={{
                      scale: modalImageScale,
                      transformOrigin: '50% 0%',
                      WebkitTransformOrigin: '50% 0%',
                    }}
                  >
                    <img
                      src={backdrop}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.85] will-change-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-[#0A0C10]/60 via-30% to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0C10] via-[#0A0C10]/70 via-30% to-transparent w-full md:w-3/4" />
                  </motion.div>

                  {/* Parallax Content Overlay */}
                  <motion.div
                    style={{ y: modalContentY }}
                    className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-4 sm:left-8 md:left-10 right-4 sm:right-auto max-w-2xl z-20 flex flex-col items-start"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {scoreValue && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-subtle text-yellow-300 text-xs font-bold shadow-md">
                          <Star size={13} className="fill-yellow-400 text-yellow-400" />
                          <span>{scoreValue} Rating</span>
                        </div>
                      )}

                      {anime.format && (
                        <GlassPill variant="subtle" size="xs">
                          {anime.format === 'TV_SHORT' ? 'TV' : anime.format}
                        </GlassPill>
                      )}

                      {anime.status === 'RELEASING' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Airing
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs font-medium">
                          {anime.status === 'FINISHED' ? 'Completed' : anime.status}
                        </span>
                      )}

                      {anime.seasonYear && (
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-white/60 text-xs">
                          {anime.season} {anime.seasonYear}
                        </span>
                      )}
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg leading-tight">
                      {title}
                    </h1>

                    {anime.genres && (
                      <p className="text-xs sm:text-sm text-white/70 font-medium mb-3">
                        {anime.genres.slice(0, 4).join(' • ')}
                      </p>
                    )}

                    <p className="text-white/80 text-xs sm:text-sm line-clamp-3 mb-5 font-normal drop-shadow leading-relaxed max-w-xl">
                      {cleanDescription}
                    </p>

                    {/* Action GlassButtons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <GlassButton
                        variant="primary"
                        size="md"
                        onClick={() => handleStartPlayback(currentEpisode)}
                        className="cursor-pointer shadow-xl"
                      >
                        <Play size={17} className="fill-white" />
                        <span>Watch Ep {currentEpisode}</span>
                      </GlassButton>

                      {onToggleFavorite && (
                        <GlassButton
                          variant="secondary"
                          size="md"
                          onClick={(e) => onToggleFavorite(e, anime.id)}
                          className="cursor-pointer"
                        >
                          {isFav ? <Check size={17} className="text-green-400" /> : <Plus size={17} />}
                          <span>{isFav ? 'Saved' : 'Add to Favorites'}</span>
                        </GlassButton>
                      )}

                      <GlassButton
                        variant="secondary"
                        size="md"
                        onClick={handleShare}
                        className="cursor-pointer !px-3"
                        aria-label="Share"
                      >
                        {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Share2 size={18} />}
                      </GlassButton>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modal Body: Episodes, Characters, and Related Media */}
            <div className="px-4 sm:px-8 md:px-10 py-8 space-y-8">
              {/* Episodes Shelf */}
              <div className="space-y-4">
                <EpisodeSelector
                  anime={anime}
                  currentEpisode={currentEpisode}
                  onSelectEpisode={(ep) => handleStartPlayback(ep)}
                />
              </div>

              {/* Characters & Voice Cast Grid */}
              {anime.characters?.edges && anime.characters.edges.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-amber-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white">Characters & Cast</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {anime.characters.edges.slice(0, 6).map((edge) => (
                      <div
                        key={edge.node.id}
                        className="p-2.5 rounded-2xl glass-subtle border border-white/10 flex items-center gap-3"
                      >
                        <img
                          src={edge.node.image?.medium || edge.node.image?.large}
                          alt={edge.node.name?.full}
                          className="w-11 h-11 rounded-xl object-cover shrink-0 bg-white/5"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{edge.node.name?.full}</p>
                          <p className="text-[10px] text-white/50 truncate capitalize">
                            {edge.role ? edge.role.toLowerCase() : 'Character'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Anime Row */}
              {anime.relations?.edges && anime.relations.edges.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-400" />
                    <h3 className="text-base sm:text-lg font-bold text-white">Related Series & Franchise</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {anime.relations.edges.slice(0, 6).map((edge) => (
                      <div
                        key={edge.node.id}
                        onClick={() => {
                          if (onSelectRelatedAnime) onSelectRelatedAnime(edge.node.id);
                        }}
                        className="cursor-pointer"
                      >
                        <AnimeCard
                          anime={edge.node as any}
                          onClick={() => {
                            if (onSelectRelatedAnime) onSelectRelatedAnime(edge.node.id);
                          }}
                          isFavorite={isFavorite ? isFavorite(edge.node.id) : false}
                          onToggleFavorite={onToggleFavorite}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
});
