import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Play, X, Star, Check, Plus, ChevronLeft, ChevronRight, Layers, Clock, Calendar, Bookmark, RotateCcw, Sparkles, ExternalLink, Loader2, Film, Tv, Maximize, Minimize, RotateCw, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Show, Episode, SeasonDetails, fetchShowDetails, fetchSeasonDetails, fetchRelatedShows, globalShowCache } from '../lib/tmdb';
import { CineSrcPlayer } from './CineSrcPlayer';
import { Footer } from './Footer';
import { getWatchProgress, WatchProgressItem, removeWatchProgress } from '../lib/cinesrc';
import { GlassButton, GlassPill, GlassIconButton, GlassContainer } from './liquid-glass';
import { usePullDownZoom } from '../hooks/usePullDownZoom';

interface WatchModalProps {
  showId: string | null;
  country: string;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onSelectRelated?: (id: string) => void;
}

export function WatchModal({
  showId,
  country,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectRelated
}: WatchModalProps) {
  const [show, setShow] = useState<Show | null>(() => showId ? globalShowCache.get(showId) || null : null);
  const [loading, setLoading] = useState(() => !showId || !globalShowCache.has(showId));
  const [relatedShows, setRelatedShows] = useState<Show[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const trailerScrollRef = useRef<HTMLDivElement>(null);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [seasonData, setSeasonData] = useState<SeasonDetails | null>(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  
  // Progress & Resume
  const [savedProgress, setSavedProgress] = useState<WatchProgressItem | null>(null);
  const [resumeStartAt, setResumeStartAt] = useState<number>(0);

  // Pull-down stretch for modal hero banner (fixed 1:1 proportion without zooming)
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalHeroRef = useRef<HTMLDivElement>(null);
  const { imageScale: modalImageScale, contentY: modalContentY } = usePullDownZoom(modalHeroRef, {
    scrollContainerRef,
    maxScale: 1.0,
    pullRange: 220,
    contentParallaxRatio: -0.35,
  });

  // Lock body scroll
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Fullscreen and Screen Orientation Lock Helpers
  const enterFullscreenAndLandscape = useCallback(async () => {
    const playerContainer = document.getElementById('cinesrc-iframe') || document.documentElement;
    if (playerContainer) {
      try {
        if (playerContainer.requestFullscreen) {
          await playerContainer.requestFullscreen();
        } else if ((playerContainer as any).webkitRequestFullscreen) {
          await (playerContainer as any).webkitRequestFullscreen();
        } else if ((playerContainer as any).mozRequestFullScreen) {
          await (playerContainer as any).mozRequestFullScreen();
        } else if ((playerContainer as any).msRequestFullscreen) {
          await (playerContainer as any).msRequestFullscreen();
        }
      } catch (err) {
        console.warn('Native requestFullscreen caught:', err);
      }
    }

    // If mobile or small viewport, lock screen orientation to landscape
    const isMobile =
      window.innerWidth <= 820 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      try {
        const orientationObj = (screen as any).orientation || (window as any).screen?.orientation;
        if (orientationObj && typeof orientationObj.lock === 'function') {
          await orientationObj.lock('landscape');
        } else if ((screen as any).lockOrientation) {
          (screen as any).lockOrientation('landscape');
        } else if ((screen as any).mozLockOrientation) {
          (screen as any).mozLockOrientation('landscape');
        } else if ((screen as any).msLockOrientation) {
          (screen as any).msLockOrientation('landscape');
        }
      } catch (err) {
        console.warn('Screen orientation lock notice:', err);
      }
    }
  }, []);

  const exitFullscreenAndRestoreOrientation = useCallback(async () => {
    try {
      const orientationObj = (screen as any).orientation || (window as any).screen?.orientation;
      if (orientationObj && typeof orientationObj.unlock === 'function') {
        orientationObj.unlock();
      } else if ((screen as any).unlockOrientation) {
        (screen as any).unlockOrientation();
      }
    } catch (err) {
      // ignore
    }

    try {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      if (isFs) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (err) {
      // ignore
    }
  }, []);

  // Listen for fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      exitFullscreenAndRestoreOrientation();
    };
  }, [exitFullscreenAndRestoreOrientation]);

  // Load Show Details
  useEffect(() => {
    let isMounted = true;
    if (showId) {
      setLoading(true);
      setIsPlaying(false);
      
      // Check saved watch progress
      const progress = getWatchProgress(showId);
      setSavedProgress(progress);
      if (progress?.season) {
        setSelectedSeason(progress.season);
      } else {
        setSelectedSeason(1);
      }
      if (progress?.episode) {
        setSelectedEpisode(progress.episode);
      } else {
        setSelectedEpisode(1);
      }
      if (progress?.currentTime && progress.percentage < 93) {
        setResumeStartAt(progress.currentTime);
      } else {
        setResumeStartAt(0);
      }

      fetchShowDetails(showId, country)
        .then(res => {
          if (isMounted) setShow(res);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });

      setLoadingRelated(true);
      fetchRelatedShows(showId)
        .then(res => {
          if (isMounted) {
            setRelatedShows(res.filter(s => s.id !== showId).slice(0, 8));
          }
        })
        .catch(err => console.warn("Failed to load related shows:", err))
        .finally(() => {
          if (isMounted) setLoadingRelated(false);
        });
    }
    return () => { 
      isMounted = false; 
      exitFullscreenAndRestoreOrientation();
    };
  }, [showId, country, exitFullscreenAndRestoreOrientation]);

  // Load Season Episodes when TV Show or Season Changes
  useEffect(() => {
    let isMounted = true;
    if (show && show.showType === 'series') {
      setLoadingSeason(true);
      fetchSeasonDetails(show.id, selectedSeason)
        .then(data => {
          if (isMounted) setSeasonData(data);
        })
        .catch(err => {
          console.warn("Failed to load season details:", err);
          if (isMounted) {
            // Fallback episode structure
            setSeasonData({
              id: `season-${selectedSeason}`,
              seasonNumber: selectedSeason,
              name: `Season ${selectedSeason}`,
              episodes: Array.from({ length: 10 }, (_, i) => ({
                id: `${show.id}-s${selectedSeason}e${i + 1}`,
                episodeNumber: i + 1,
                seasonNumber: selectedSeason,
                name: `Episode ${i + 1}`,
                overview: `Season ${selectedSeason}, Episode ${i + 1}`,
                runtime: 45
              }))
            });
          }
        })
        .finally(() => {
          if (isMounted) setLoadingSeason(false);
        });
    }
    return () => { isMounted = false; };
  }, [show, selectedSeason]);

  // Current Episode info
  const currentEpisodeData = useMemo(() => {
    if (!seasonData?.episodes) return null;
    return seasonData.episodes.find(ep => ep.episodeNumber === selectedEpisode) || null;
  }, [seasonData, selectedEpisode]);

  const totalEpisodesInSeason = seasonData?.episodes?.length || 10;
  const hasNextEpisode = selectedEpisode < totalEpisodesInSeason;
  const hasPrevEpisode = selectedEpisode > 1;

  const handleNextEpisode = useCallback(() => {
    if (hasNextEpisode) {
      setSelectedEpisode(e => e + 1);
      setResumeStartAt(0);
    }
  }, [hasNextEpisode]);

  const handlePrevEpisode = useCallback(() => {
    if (hasPrevEpisode) {
      setSelectedEpisode(e => Math.max(1, e - 1));
      setResumeStartAt(0);
    }
  }, [hasPrevEpisode]);

  const handleSelectEpisode = useCallback((epNum: number) => {
    setSelectedEpisode(epNum);
    setResumeStartAt(0);
    flushSync(() => {
      setIsPlaying(true);
    });
    enterFullscreenAndLandscape();
  }, [enterFullscreenAndLandscape]);

  const handleStartPlayback = useCallback((resume: boolean = true) => {
    if (!resume) {
      setResumeStartAt(0);
    }
    flushSync(() => {
      setIsPlaying(true);
    });
    enterFullscreenAndLandscape();
  }, [enterFullscreenAndLandscape]);

  const handleStopPlayback = useCallback(() => {
    setIsPlaying(false);
    exitFullscreenAndRestoreOrientation();
  }, [exitFullscreenAndRestoreOrientation]);

  // Escape key listener for exiting playback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPlaying) {
        handleStopPlayback();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, handleStopPlayback]);

  const handleToggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreenAndRestoreOrientation();
    } else {
      enterFullscreenAndLandscape();
    }
  }, [isFullscreen, enterFullscreenAndLandscape, exitFullscreenAndRestoreOrientation]);

  const handleCloseModal = useCallback(() => {
    exitFullscreenAndRestoreOrientation();
    onClose();
  }, [exitFullscreenAndRestoreOrientation, onClose]);

  if (!showId) return null;

  const tmdbId = show?.tmdbId || showId.replace(/^(movie|tv|series)-/, '');
  const isMovie = show?.showType === 'movie';
  const poster = show?.imageSet?.poster;
  const backdrop = show?.imageSet?.horizontalPoster?.original || show?.imageSet?.horizontalPoster?.w1080 || show?.imageSet?.horizontalPoster?.w720 || poster;
  const rating = show?.rating ? (show.rating / 10).toFixed(1) : 'NR';

  // Find official trailer
  const trailer = show?.videos?.find(
    (video: any) => video.site === "YouTube" && video.type === "Trailer" && video.official
  ) || show?.videos?.find(
    (video: any) => video.site === "YouTube" && video.type === "Trailer"
  );
  const trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&loop=1&playlist=${trailer.key}&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&autohide=1&cc_load_policy=0` : null;

  // Format saved progress time
  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0F1113]">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as any }}
        className="relative w-full h-full bg-[#0F1113] overflow-y-auto overflow-x-hidden flex flex-col z-10 text-white"
      >
        {/* Top Edge Specular Highlight - Desktop Only */}
        <div className="hidden sm:block absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-100 via-white to-transparent pointer-events-none blur-[0.2px] z-30" />

        {/* Floating Close/Back Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 left-4 z-40 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all cursor-pointer shadow-lg backdrop-blur-md"
          title="Back / Close"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] gap-3">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            <p className="text-white/60 text-sm font-medium animate-pulse">Loading show details...</p>
          </div>
        ) : show ? (
          <>
            {/* Fullscreen Video Player */}
            <AnimatePresence>
              {isPlaying && (
                <motion.div 
                  key="fullscreen-player"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-[100] bg-black flex flex-col"
                >
                  <div className="absolute top-4 left-4 z-50">
                    <button
                      onClick={handleStopPlayback}
                      className="p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all cursor-pointer backdrop-blur-md"
                      title="Exit Player"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="w-full h-full relative flex flex-col">
                    <CineSrcPlayer
                      tmdbId={tmdbId}
                      type={isMovie ? 'movie' : 'tv'}
                      season={isMovie ? undefined : selectedSeason}
                      episode={isMovie ? undefined : selectedEpisode}
                      title={show.title}
                      poster={poster}
                      backdrop={backdrop}
                      startAt={resumeStartAt}
                      episodeTitle={currentEpisodeData?.name}
                      hasNextEpisode={hasNextEpisode}
                      onNextEpisode={handleNextEpisode}
                      className="w-full h-full flex-1"
                    />
                    {!isMovie && (
                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none opacity-0 hover:opacity-100 transition-opacity z-50">
                        <div className="pointer-events-auto flex items-center gap-4 bg-black/80 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10">
                          <button onClick={handlePrevEpisode} disabled={!hasPrevEpisode} className="p-2 text-white disabled:opacity-40 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                          <span className="text-white text-sm font-semibold tracking-wide">S{selectedSeason}:E{selectedEpisode}</span>
                          <button onClick={handleNextEpisode} disabled={!hasNextEpisode} className="p-2 text-white disabled:opacity-40 hover:bg-white/10 rounded-full transition-colors"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-hide">
              {/* Backdrop Hero Banner with Pull-Down Zoom & Stretch */}
              <motion.div 
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                ref={modalHeroRef}
                style={{ touchAction: 'pan-x pan-y', WebkitUserSelect: 'none' }}
                className="relative h-[92vh] md:h-[90vh] w-full overflow-hidden bg-black select-none"
              >
                {/* 1. Sticky Hero Image Layer (Anchored at top 0, expands proportionally downward) */}
                <motion.div 
                  className="sticky top-0 inset-x-0 w-full h-full pointer-events-none will-change-transform"
                  style={{ 
                    scale: modalImageScale,
                    transformOrigin: '50% 0%',
                    WebkitTransformOrigin: '50% 0%',
                  }}
                >
                  {trailerUrl && !isPlaying && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
                      <iframe 
                        className="absolute top-1/2 left-1/2 sm:w-[200vw] aspect-video max-w-none -translate-x-1/2 -translate-y-1/2 opacity-70"
                        src={trailerUrl}
                        allow="autoplay; encrypted-media" 
                        allowFullScreen
                        style={{ pointerEvents: 'none' }}
                      />
                    </div>
                  )}
                  <img
                    src={backdrop}
                    alt={show.title}
                    decoding="sync"
                    loading="eager"
                    fetchPriority="high"
                    className={`w-full h-full object-cover object-center scale-105 filter brightness-100 will-change-transform ${trailerUrl && !isPlaying ? 'block sm:hidden' : 'block'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1113] via-[#0F1113]/60 via-30% to-transparent z-0" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0F1113] via-[#0F1113]/60 via-30% to-transparent w-full md:w-2/3 z-0" />
                </motion.div>

                {/* 2. Parallax Hero Overlay Info Layer */}
                <motion.div 
                  style={{ y: modalContentY }}
                  className="absolute bottom-16 sm:bottom-20 md:bottom-28 left-0 right-0 px-6 sm:px-0 sm:left-6 md:left-8 lg:left-12 xl:left-16 sm:right-auto flex flex-col items-center text-center sm:items-start sm:text-left max-w-2xl z-10 pb-2 sm:pb-0 pointer-events-none will-change-transform"
                >
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2.5 mb-3 text-xs sm:text-sm font-semibold pointer-events-auto">
                    {rating && rating !== 'NR' && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-subtle text-yellow-300 text-xs font-bold shadow-md">
                        <Star size={13} className="fill-yellow-400 text-yellow-400" />
                        <span>{rating} Rating</span>
                      </div>
                    )}
                    <span className="px-3 py-1 rounded-full glass-subtle text-white/90 text-xs font-bold shadow-md">{show.releaseYear}</span>
                    {show.runtime && <span className="px-3 py-1 rounded-full glass-subtle text-white/90 text-xs font-bold shadow-md">{show.runtime}m</span>}
                    <GlassPill variant="accent" size="xs">
                      {isMovie ? 'MOVIE' : `TV SERIES (${show.seasonCount || 1} SEASONS)`}
                    </GlassPill>
                  </div>

                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg leading-tight transition-all duration-500">
                    {show.title}
                  </h1>

                  <p className="text-white/80 text-sm md:text-base line-clamp-3 mb-6 font-normal drop-shadow leading-relaxed max-w-xl transition-all duration-500 pointer-events-auto">
                    {show.overview || 'No plot summary available.'}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 pointer-events-auto">
                    <GlassButton
                      variant="primary"
                      size="md"
                      onClick={() => handleStartPlayback(true)}
                      className="cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.5)]"
                    >
                      <Play size={17} className="fill-white" />
                      {savedProgress && savedProgress.currentTime > 15 && savedProgress.percentage < 92
                        ? `Resume (${formatSeconds(savedProgress.currentTime)})`
                        : (isMovie ? 'Play Movie' : `Play S${selectedSeason}:E${selectedEpisode}`)}
                    </GlassButton>

                    {savedProgress && savedProgress.currentTime > 15 && savedProgress.percentage < 92 && (
                      <GlassButton
                        variant="secondary"
                        size="md"
                        onClick={() => handleStartPlayback(false)}
                        className="cursor-pointer"
                      >
                        <RotateCcw size={17} /> Play from Start
                      </GlassButton>
                    )}

                    <GlassButton
                      variant="secondary"
                      size="md"
                      onClick={(e) => onToggleFavorite(e, show.id)}
                      className="cursor-pointer"
                    >
                      {isFavorite ? <Check size={17} className="text-green-400" /> : <Plus size={17} />}
                      {isFavorite ? 'Saved' : 'Favorites'}
                    </GlassButton>
                  </div>
                </motion.div>
              </motion.div>
            
            {/* Content & Metadata Section */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* TV Episode & Season Selector */}
              {!isMovie && (
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 glass-button-primary rounded-xl flex items-center justify-center">
                        <Tv className="w-3.5 h-3.5 sm:w-[16px] sm:h-[16px] text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Episodes</h3>
                        <p className="text-xs text-white/50">
                          {seasonData?.name || `Season ${selectedSeason}`} • {seasonData?.episodes.length || 0} Episodes
                        </p>
                      </div>
                    </div>

                    {/* Season Tabs / Selector */}
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 max-w-full">
                      {Array.from({ length: show.seasonCount || 1 }, (_, i) => i + 1).map((sNum) => {
                        const isSelected = selectedSeason === sNum;
                        return (
                          <button
                            key={sNum}
                            onClick={() => {
                              setSelectedSeason(sNum);
                              setSelectedEpisode(1);
                              setResumeStartAt(0);
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                              isSelected
                                ? 'refractive-glass-pill text-white shadow-md'
                                : 'glass-subtle text-white/70 hover:text-white hover:bg-white/15'
                            }`}
                          >
                            Season {sNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Episode Grid / List */}
                  {loadingSeason ? (
                    <div className="flex items-center justify-center py-12 gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                      <span className="text-xs text-white/60">Loading episodes...</span>
                    </div>
                  ) : seasonData?.episodes && seasonData.episodes.length > 0 ? (
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={selectedSeason}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2"
                      >
                      {seasonData.episodes.map((ep, index) => {
                        const isActive = selectedEpisode === ep.episodeNumber;
                        const epThumb = ep.stillPath || backdrop || poster;
                        return (
                          <div
                            key={`${ep.id}-${index}`}
                            onClick={() => handleSelectEpisode(ep.episodeNumber)}
                            className={`relative rounded-2xl overflow-hidden p-3 transition-all duration-200 cursor-pointer flex flex-col group border ${
                              isActive
                                ? 'glass-medium border-amber-500/60 shadow-[0_4px_25px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/40'
                                : 'glass-subtle hover:glass-medium border-white/10 hover:border-white/20'
                            }`}
                          >
                            {/* Thumbnail & Play Overlay */}
                            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/40 mb-2.5">
                              {epThumb ? (
                                <img
                                  src={epThumb}
                                  alt={ep.name}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/30 text-xs">
                                  No Preview
                                </div>
                              )}

                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                              {/* Play Icon / Active Status */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-200 ${
                                  isActive
                                    ? 'bg-amber-600 text-white scale-110 shadow-lg'
                                    : 'bg-black/60 text-white/90 group-hover:scale-110 border border-white/20'
                                }`}>
                                  <Play className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px] ml-0.5 fill-current" />
                                </div>
                              </div>

                              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white/80 font-medium">
                                <span>Episode {ep.episodeNumber}</span>
                                {ep.runtime && <span>{ep.runtime}m</span>}
                              </div>
                            </div>

                            {/* Episode Title & Overview */}
                            <h4 className="font-bold text-xs text-white truncate group-hover:text-amber-500 transition-colors mb-1">
                              {ep.episodeNumber}. {ep.name}
                            </h4>
                            <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">
                              {ep.overview || 'No episode description available.'}
                            </p>
                          </div>
                        );
                      })}
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="text-center py-8 text-white/40 text-xs">
                      No episodes found for this season.
                    </div>
                  )}
                </div>
              )}

              {/* Main Metadata Layout */}
              <div className="pt-6 border-t border-white/5 space-y-8 mt-6">
                
                {/* Cast */}
                {show.cast && show.cast.length > 0 && (
                  <section className="watch-modal-section mt-6">
                    <h3 className="text-white/50 font-semibold mb-3 uppercase tracking-wider text-[10px]">Cast</h3>
                    <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-1.5 scrollbar-hide snap-x">
                      {show.cast.map((actor, idx) => (
                        <div key={actor.id || idx} className="flex-shrink-0 w-[95px] sm:w-[120px] text-center snap-center">
                          {actor.profilePath ? (
                            <img src={actor.profilePath} alt={actor.name} loading="lazy" className="mx-auto w-[82px] h-[82px] sm:w-[100px] sm:h-[100px] object-cover rounded-full shadow-md border border-white/10" />
                          ) : (
                            <div className="mx-auto w-[82px] h-[82px] sm:w-[100px] sm:h-[100px] rounded-full bg-white/5 flex items-center justify-center text-xl sm:text-2xl font-bold text-white/30 border border-white/5 shadow-md">
                              {actor.name.charAt(0)}
                            </div>
                          )}
                          <div className="mt-3 text-[11px] sm:text-xs font-medium text-white/90 truncate px-1" title={actor.name}>{actor.name}</div>
                          {actor.character && (
                            <div className="text-[9px] sm:text-[10px] text-white/50 truncate px-1 mt-0.5" title={actor.character}>{actor.character}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Trailer Clips */}
                {(() => {
                  if (!show.videos || show.videos.length === 0) return null;
                  
                  const trailerClips = show.videos
                    .filter(video => video.site === "YouTube" && ["Trailer", "Teaser", "Clip", "Featurette"].includes(video.type))
                    .sort((a, b) => {
                      const priority = { Trailer: 1, Teaser: 2, Clip: 3, Featurette: 4 };
                      return (priority[a.type] || 99) - (priority[b.type] || 99);
                    });
                  
                  if (trailerClips.length === 0) return null;
                  
                  const officialVideos = trailerClips.filter(video => video.official);
                  const displayVideos = officialVideos.length > 0 ? officialVideos.slice(0, 8) : trailerClips.slice(0, 8);
                  
                  return (
                    <section className="watch-modal-section mt-6 border-t border-white/5 pt-6">
                      <h3 className="text-white/50 font-semibold mb-3 uppercase tracking-wider text-[10px]">Trailer & Clips</h3>
                      <div className="relative group/trailer-carousel">
                        <button
                          className="absolute left-2 top-[60px] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover/trailer-carousel:opacity-100 transition-all hidden sm:flex text-white hover:bg-black/80 hover:scale-110 shadow-lg disabled:opacity-0"
                          onClick={() => {
                            if (trailerScrollRef.current) {
                              trailerScrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
                            }
                          }}
                        >
                          <ChevronLeft className="w-6 h-6 mr-0.5" />
                        </button>
                        
                        <div ref={trailerScrollRef} className="flex gap-3 overflow-x-auto pb-1.5 scrollbar-hide snap-x relative z-0 scroll-smooth">
                          {displayVideos.map((video, idx) => (
                            <button
                              key={video.id || idx}
                              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.key}`, '_blank')}
                              className="flex-shrink-0 w-[210px] sm:w-[240px] bg-transparent border-0 text-left cursor-pointer snap-center group/trailer"
                            >
                              <div className="relative aspect-video overflow-hidden rounded-[14px] bg-black/20 border border-white/5 mb-2">
                                <img
                                  src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                                  alt={video.name}
                                  loading="lazy"
                                  className="w-full h-full object-cover opacity-80 group-hover/trailer:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white/90 group-hover/trailer:scale-110 group-hover/trailer:bg-white/20 transition-all backdrop-blur-sm shadow-md">
                                    <Play className="w-4 h-4 ml-1 fill-current" />
                                  </div>
                                </div>
                              </div>
                              <div className="text-[11px] sm:text-xs font-medium text-white/90 truncate px-1" title={video.name}>{video.name}</div>
                              <div className="text-[9px] sm:text-[10px] text-white/50 truncate px-1 mt-0.5" title={video.type}>{video.type}</div>
                            </button>
                          ))}
                        </div>

                        <button
                          className="absolute right-2 top-[60px] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover/trailer-carousel:opacity-100 transition-all hidden sm:flex text-white hover:bg-black/80 hover:scale-110 shadow-lg disabled:opacity-0"
                          onClick={() => {
                            if (trailerScrollRef.current) {
                              trailerScrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
                            }
                          }}
                        >
                          <ChevronRight className="w-6 h-6 ml-0.5" />
                        </button>
                      </div>
                    </section>
                  );
                })()}

                {/* Movie/TV Details */}
                <section className="watch-modal-section mt-6 border-t border-white/5 pt-6">
                  <h3 className="text-white/50 font-semibold mb-4 uppercase tracking-wider text-[10px]">
                    {show.showType === 'series' ? 'TV Show Details' : 'Movie Details'}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Genre */}
                    {show.genres && show.genres.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] opacity-55 text-white/60">Genre</span>
                        <div className="flex flex-wrap gap-1.5">
                          {show.genres.map(genre => (
                            <span key={genre.id} className="px-2.5 py-1 text-xs rounded-full bg-white/5 border border-white/5 text-white/80">
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Director / Creator */}
                    {(() => {
                       const isTV = show.showType === 'series';
                       const directors = show.directors?.join(', ');
                       const creators = show.creators?.join(', ');
                       
                       if (!isTV && directors) {
                         return (
                           <div className="flex flex-col gap-1.5">
                             <span className="text-[12px] opacity-55 text-white/60">Director</span>
                             <span className="text-[14px] text-white/90">{directors}</span>
                           </div>
                         );
                       }
                       if (isTV && creators) {
                         return (
                           <div className="flex flex-col gap-1.5">
                             <span className="text-[12px] opacity-55 text-white/60">Creator</span>
                             <span className="text-[14px] text-white/90">{creators}</span>
                           </div>
                         );
                       }
                       if (isTV && directors) {
                         return (
                           <div className="flex flex-col gap-1.5">
                             <span className="text-[12px] opacity-55 text-white/60">Director</span>
                             <span className="text-[14px] text-white/90">{directors}</span>
                           </div>
                         );
                       }
                       return null;
                    })()}

                    {/* Release Info */}
                    {show.releaseYear && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] opacity-55 text-white/60">Year</span>
                        <span className="text-[14px] text-white/90">{show.releaseYear}</span>
                      </div>
                    )}
                    
                    {/* Runtime */}
                    {show.runtime && show.runtime > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] opacity-55 text-white/60">Runtime</span>
                        <span className="text-[14px] text-white/90">
                          {show.runtime >= 60 ? `${Math.floor(show.runtime / 60)}h ${show.runtime % 60 > 0 ? `${show.runtime % 60}m` : ''}` : `${show.runtime}m`}
                        </span>
                      </div>
                    )}

                    {/* Origin Country */}
                    {show.originCountry && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] opacity-55 text-white/60">Origin Country</span>
                        <span className="text-[14px] text-white/90">
                          {(() => {
                            const code = show.originCountry;
                            const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
                            try {
                              return regionNames.of(code) || code;
                            } catch (e) {
                              return code;
                            }
                          })()}
                        </span>
                      </div>
                    )}

                    {/* Original Language */}
                    {show.originalLanguage && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[12px] opacity-55 text-white/60">Original Language</span>
                        <span className="text-[14px] text-white/90 capitalize">
                          {(() => {
                            const code = show.originalLanguage;
                            const languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
                            try {
                              return languageNames.of(code) || code;
                            } catch (e) {
                              return code;
                            }
                          })()}
                        </span>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Related Shows (You May Also Like) */}
              <div className="mt-8 border-t border-white/10 pt-8 relative">
                <h3 className="text-lg font-bold text-white mb-4 tracking-tight">You May Also Like</h3>
                {loadingRelated ? (
                  <div className="flex gap-4 overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="w-[140px] sm:w-[160px] md:w-[180px] aspect-[2/3] bg-white/5 rounded-xl flex-shrink-0 animate-pulse" />
                    ))}
                  </div>
                ) : relatedShows && relatedShows.length > 0 ? (
                  <div className="relative group/related">
                    <button 
                      onClick={() => {
                        if (relatedScrollRef.current) {
                          relatedScrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
                        }
                      }}
                      className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-24 glass-subtle rounded-r-2xl hidden md:flex items-center justify-center opacity-0 group-hover/related:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </button>
                    
                    <motion.div 
                      ref={relatedScrollRef}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x py-2 pl-1 pr-8"
                    >
                      {relatedShows.map((relatedShow, index) => (
                        <div 
                          key={`${relatedShow.id}-${index}`} 
                          className="w-[140px] sm:w-[160px] md:w-[180px] flex-shrink-0 snap-start cursor-pointer group relative overflow-hidden rounded-xl border border-white/10 bg-[#1A1D24] aspect-[2/3] transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl will-change-transform"
                          onClick={() => {
                            if (onSelectRelated) onSelectRelated(relatedShow.id);
                          }}
                        >
                          {relatedShow.imageSet?.poster ? (
                            <img 
                              src={relatedShow.imageSet.poster} 
                              alt={relatedShow.title} 
                              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black/40 text-white/50 text-xs p-4 text-center">
                              {relatedShow.title}
                            </div>
                          )}
                          
                          {/* Top Specular Edge Sheen */}
                          <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-20" />
                          
                          {/* Info Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#080A0E] via-[#080A0E]/80 via-50% to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                            <h4 className="text-white font-bold text-xs sm:text-sm truncate drop-shadow">{relatedShow.title}</h4>
                            <div className="flex items-center justify-between text-[10px] text-white/70 mt-1">
                              <span className="flex items-center gap-0.5"><Star size={10} className="text-yellow-500 fill-current" /> {relatedShow.rating ? (relatedShow.rating / 10).toFixed(1) : 'NR'}</span>
                              <span className="font-semibold text-white/90">{relatedShow.releaseYear}</span>
                            </div>
                            {relatedShow.genres && relatedShow.genres.length > 0 && (
                              <div className="text-[9px] text-white/50 truncate mt-1">
                                {relatedShow.genres.map(g => g.name).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                    
                    <button 
                      onClick={() => {
                        if (relatedScrollRef.current) {
                          relatedScrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
                        }
                      }}
                      className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-24 glass-subtle rounded-l-2xl hidden md:flex items-center justify-center opacity-0 group-hover/related:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-white/40 italic">No recommendations found.</div>
                )}
              </div>
            </div>
            
            <Footer />
          </div>
          </>
        ) : null}
      </motion.div>
    </div>
  );
}