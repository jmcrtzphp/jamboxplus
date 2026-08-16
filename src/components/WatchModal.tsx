import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Play, X, Star, Check, Plus, ChevronLeft, ChevronRight, Layers, Clock, Calendar, Bookmark, RotateCcw, Sparkles, ExternalLink, Loader2, Film, Tv, Maximize, Minimize, RotateCw, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Show, Episode, SeasonDetails, fetchShowDetails, fetchSeasonDetails, fetchRelatedShows } from '../lib/tmdb';
import { CineSrcPlayer } from './CineSrcPlayer';
import { Footer } from './Footer';
import { getWatchProgress, WatchProgressItem, removeWatchProgress } from '../lib/cinesrc';
import { GlassButton, GlassPill, GlassIconButton, GlassContainer } from './liquid-glass';

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
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedShows, setRelatedShows] = useState<Show[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const relatedScrollRef = useRef<HTMLDivElement>(null);
  
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
    const playerContainer = document.getElementById('player-stage-container');
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
    setIsPlaying(true);
    setTimeout(() => {
      enterFullscreenAndLandscape();
    }, 120);
  }, [enterFullscreenAndLandscape]);

  const handleStartPlayback = useCallback((resume: boolean = true) => {
    if (!resume) {
      setResumeStartAt(0);
    }
    setIsPlaying(true);
    setTimeout(() => {
      enterFullscreenAndLandscape();
    }, 120);
  }, [enterFullscreenAndLandscape]);

  const handleStopPlayback = useCallback(() => {
    setIsPlaying(false);
    exitFullscreenAndRestoreOrientation();
  }, [exitFullscreenAndRestoreOrientation]);

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
  const backdrop = show?.imageSet?.horizontalPoster?.w1080 || show?.imageSet?.horizontalPoster?.w720 || poster;
  const rating = show?.rating ? (show.rating / 10).toFixed(1) : 'NR';

  // Format saved progress time
  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 md:p-6 lg:p-8 overflow-hidden bg-[#0A0C10] sm:bg-transparent">
      {/* Dim Backdrop Overlay - Hidden on mobile to feel like a separate page */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="hidden sm:block absolute inset-0 bg-black/85 backdrop-blur-xl"
        onClick={handleCloseModal}
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

        {/* Floating Close/Back Button (when not in full video player mode) */}
        {!isPlaying && (
          <button
            onClick={handleCloseModal}
            className="absolute top-4 left-4 sm:left-auto sm:right-4 z-40 p-2.5 rounded-full bg-black/50 sm:glass-subtle hover:bg-black/70 sm:hover:bg-white/20 text-white transition-all cursor-pointer shadow-lg backdrop-blur-md"
            title="Back / Close"
          >
            <ArrowLeft className="sm:hidden block w-5 h-5" />
            <X className="hidden sm:block w-5 h-5" />
          </button>
        )}

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] gap-3">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            <p className="text-white/60 text-sm font-medium animate-pulse">Loading show details...</p>
          </div>
        ) : show ? (
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {/* Top Video Stage / Hero Section */}
            <AnimatePresence mode="wait">
              {isPlaying ? (
              <motion.div 
                key="player"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
                className="bg-black relative z-20"
              >
                {/* Cinema View Player Stage */}
                <div id="player-stage-container" className="w-full max-w-5xl mx-auto p-2 sm:p-4 md:p-6 bg-black relative flex flex-col justify-center">
                  
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
                        {isMovie ? 'MOVIE' : `S${selectedSeason}:E${selectedEpisode}`}
                      </GlassPill>

                      <span className="text-xs text-white/90 font-bold truncate max-w-[140px] sm:max-w-[240px] md:max-w-md drop-shadow">
                        {show.title} {currentEpisodeData?.name && <span className="font-normal text-white/70"> - "{currentEpisodeData.name}"</span>}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Mobile Landscape Rotation trigger */}
                      <button
                        onClick={enterFullscreenAndLandscape}
                        className="p-2 rounded-xl glass-subtle hover:glass-medium text-white/80 hover:text-white transition-all cursor-pointer flex sm:hidden items-center justify-center shadow-md"
                        title="Rotate to Landscape"
                      >
                        <RotateCw className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
                      </button>

                      {/* Fullscreen Toggle */}
                      <button
                        onClick={handleToggleFullscreen}
                        className="px-3 py-1.5 rounded-xl glass-button-primary text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen & Landscape"}
                      >
                        {isFullscreen ? (
                          <>
                            <Minimize className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
                            <span className="hidden sm:inline">Exit Fullscreen</span>
                          </>
                        ) : (
                          <>
                            <Maximize className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
                            <span className="hidden sm:inline">Fullscreen</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleCloseModal}
                        className="p-1.5 rounded-xl glass-subtle hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer shadow-md"
                        title="Close Modal"
                      >
                        <X className="w-4 h-4 sm:w-[17px] sm:h-[17px]" />
                      </button>
                    </div>
                  </div>

                  {/* Main Video Embed */}
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
                    className="shadow-[0_15px_50px_rgba(0,0,0,0.8)]"
                  />

                  {/* TV Episode Navigator */}
                  {!isMovie && (
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
                          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Prev Episode
                        </button>

                        <button
                          onClick={handleNextEpisode}
                          disabled={!hasNextEpisode}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                            hasNextEpisode
                              ? 'glass-button-primary text-white cursor-pointer shadow-md'
                              : 'opacity-40 text-white/40 cursor-not-allowed'
                          }`}
                        >
                          Next Episode <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      <span className="text-xs text-white/50">
                        Season {selectedSeason} ({seasonData?.episodes?.length || 0} Episodes)
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              /* Backdrop Hero Banner */
              <motion.div 
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative h-[55vh] sm:h-[65vh] md:h-[70vh] w-full"
              >
                <img
                  src={backdrop}
                  alt={show.title}
                  decoding="async"
                  className="w-full h-full object-cover object-center filter brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1117] via-[#0E1117]/60 via-30% to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0E1117] via-[#0E1117]/60 via-30% to-transparent w-full md:w-2/3" />

                {/* Hero Overlay Info */}
                <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 z-20">
                  <div className="flex flex-wrap items-center gap-2.5 mb-3 text-xs sm:text-sm font-semibold">
                    <span className="text-yellow-400 font-bold bg-yellow-400/20 border border-yellow-400/30 px-2.5 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-[12px] sm:h-[12px] fill-yellow-400" /> {rating}
                    </span>
                    <span>{show.releaseYear}</span>
                    {show.runtime && <span>• {show.runtime}m</span>}
                    <GlassPill variant="accent" size="xs">
                      {isMovie ? 'MOVIE' : `TV SERIES (${show.seasonCount || 1} SEASONS)`}
                    </GlassPill>
                  </div>

                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg leading-tight">
                    {show.title}
                  </h1>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3.5">
                    <GlassButton
                      variant="primary"
                      size="lg"
                      onClick={() => handleStartPlayback(true)}
                      className="cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.5)]"
                    >
                      <Play className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-white" />
                      {savedProgress && savedProgress.currentTime > 15 && savedProgress.percentage < 92
                        ? `Resume (${formatSeconds(savedProgress.currentTime)})`
                        : (isMovie ? 'Play Movie' : `Play S${selectedSeason}:E${selectedEpisode}`)}
                    </GlassButton>

                    {savedProgress && savedProgress.currentTime > 15 && savedProgress.percentage < 92 && (
                      <GlassButton
                        variant="secondary"
                        size="md"
                        onClick={() => handleStartPlayback(false)}
                        className="cursor-pointer text-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" /> Play from Start
                      </GlassButton>
                    )}

                    <GlassButton
                      variant="secondary"
                      size="md"
                      onClick={(e) => onToggleFavorite(e, show.id)}
                      className="cursor-pointer"
                    >
                      {isFavorite ? <Check className="w-4 h-4 sm:w-[16px] sm:h-[16px] text-green-400" /> : <Plus className="w-4 h-4 sm:w-[16px] sm:h-[16px]" />}
                      {isFavorite ? 'In Favorites' : 'Add to Favorites'}
                    </GlassButton>
                  </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>

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
                      {seasonData.episodes.map((ep) => {
                        const isActive = selectedEpisode === ep.episodeNumber;
                        const epThumb = ep.stillPath || backdrop || poster;
                        return (
                          <div
                            key={ep.id}
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

              {/* Main Metadata & Overview Layout */}
              <div className="flex flex-col md:flex-row gap-8 pt-4">
                
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-2">Overview</h3>
                    <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
                      {show.overview || 'No plot summary available.'}
                    </p>
                  </div>
                </div>

                {/* Sidebar Cast & Director Metadata */}
                <div className="w-full md:w-64 shrink-0 space-y-5 text-xs sm:text-sm glass-subtle p-5 rounded-2xl border border-white/10 self-start">
                  <div>
                    <span className="text-white/50 block font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Cast</span>
                    <div className="text-white/90 leading-relaxed font-medium">
                      {show.cast?.slice(0, 5).join(', ') || 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <span className="text-white/50 block font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Genres</span>
                    <div className="text-white/90 leading-relaxed font-medium">
                      {show.genres?.map(g => g.name).join(', ') || 'Unknown'}
                    </div>
                  </div>
                  {show.directors && show.directors.length > 0 && (
                    <div>
                      <span className="text-white/50 block font-semibold mb-1.5 uppercase tracking-wider text-[10px]">Director</span>
                      <div className="text-white/90 leading-relaxed font-medium">
                        {show.directors.join(', ')}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-white/50 block font-semibold mb-1.5 uppercase tracking-wider text-[10px]">TMDB ID</span>
                    <div className="text-white/70 font-mono text-xs">
                      #{tmdbId}
                    </div>
                  </div>
                </div>
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
                      {relatedShows.map((relatedShow) => (
                        <div 
                          key={relatedShow.id} 
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
        ) : null}
      </motion.div>
    </div>
  );
}