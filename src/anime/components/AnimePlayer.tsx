import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  SkipForward,
  SkipBack,
  RotateCcw,
  RotateCw,
  Sparkles,
  Layers,
  CheckCircle,
  X,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimeMedia } from '../types/anime';
import { getAnimeDisplayTitle, getAnimePoster, getAnimeBackdrop } from '../api/anilist';
import { animePlaybackService } from '../services/playbackService';
import { EpisodeSelector } from './EpisodeSelector';
import { GlassPill, GlassButton } from '../../components/liquid-glass';

interface AnimePlayerProps {
  anime: AnimeMedia;
  initialEpisode?: number;
  onBack: () => void;
  onSelectEpisode?: (ep: number) => void;
}

export const AnimePlayer = React.memo(function AnimePlayer({
  anime,
  initialEpisode = 1,
  onBack,
  onSelectEpisode,
}: AnimePlayerProps) {
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState(false);
  const [showAutoNextBanner, setShowAutoNextBanner] = useState(false);
  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const autoNextTimerRef = useRef<NodeJS.Timeout | null>(null);

  const title = getAnimeDisplayTitle(anime);
  const poster = getAnimePoster(anime);
  const backdrop = getAnimeBackdrop(anime) || poster;

  const totalEpisodes = useMemo(() => {
    if (anime.episodes && anime.episodes > 0) return anime.episodes;
    if (anime.nextAiringEpisode) return Math.max(1, anime.nextAiringEpisode.episode - 1);
    if (anime.status === 'RELEASING') return 24;
    if (anime.format === 'MOVIE') return 1;
    return 12;
  }, [anime]);

  const hasNextEpisode = currentEpisode < totalEpisodes;
  const hasPrevEpisode = currentEpisode > 1;

  // Retrieve MegaPlay playback sources
  const sources = useMemo(() => {
    return animePlaybackService.getSources({
      anilistId: anime.id,
      idMal: anime.idMal,
      episode: currentEpisode,
      title: `${title} - Episode ${currentEpisode}`,
      poster,
      backdrop,
      autoPlay: true,
    });
  }, [anime.id, anime.idMal, currentEpisode, title, poster, backdrop]);

  const currentSource = sources[selectedServerIndex] || sources[0];

  // Ad-Blocker Popup Interception Layer:
  // Intercepts any popup/window.open attempts while video player is mounted
  useEffect(() => {
    const originalOpen = window.open;
    // Block unwanted ad popups from player embeds
    window.open = function (...args: any[]) {
      console.log('[JamBox AdBlocker] Blocked ad popup / redirect attempt:', args[0]);
      return null;
    };

    return () => {
      window.open = originalOpen;
    };
  }, []);

  // Save anime watch progress
  useEffect(() => {
    const progress = animePlaybackService.getProgress(anime.id);
    animePlaybackService.saveProgress({
      anilistId: anime.id,
      idMal: anime.idMal,
      title,
      poster,
      backdrop,
      episode: currentEpisode,
      totalEpisodes,
      episodeTitle: `Episode ${currentEpisode}`,
      currentTime: progress?.episode === currentEpisode ? progress.currentTime : 0,
      duration: 1440,
      percentage: progress?.episode === currentEpisode ? progress.percentage : 5,
      updatedAt: Date.now(),
    });
  }, [anime.id, currentEpisode, title, poster, backdrop, totalEpisodes]);

  // Reset loading state when source or episode changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setShowAutoNextBanner(false);
    if (autoNextTimerRef.current) {
      clearInterval(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
    setAutoNextCountdown(null);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [currentEpisode, selectedServerIndex]);

  const handleNextEpisode = useCallback(() => {
    if (hasNextEpisode) {
      const nextEp = currentEpisode + 1;
      setCurrentEpisode(nextEp);
      if (onSelectEpisode) onSelectEpisode(nextEp);
    }
  }, [hasNextEpisode, currentEpisode, onSelectEpisode]);

  const handlePrevEpisode = useCallback(() => {
    if (hasPrevEpisode) {
      const prevEp = currentEpisode - 1;
      setCurrentEpisode(prevEp);
      if (onSelectEpisode) onSelectEpisode(prevEp);
    }
  }, [hasPrevEpisode, currentEpisode, onSelectEpisode]);

  const handleSelectSpecificEpisode = useCallback((epNum: number) => {
    setCurrentEpisode(epNum);
    setShowEpisodeDrawer(false);
    if (onSelectEpisode) onSelectEpisode(epNum);
  }, [onSelectEpisode]);

  // Mobile landscape lock helper
  const enterLandscape = useCallback(async () => {
    try {
      const orientationObj = (screen as any).orientation || (window as any).screen?.orientation;
      if (orientationObj && typeof orientationObj.lock === 'function') {
        await orientationObj.lock('landscape');
      }
    } catch (err) {
      // ignore
    }
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'n' || e.key === 'N') {
        if (hasNextEpisode) handleNextEpisode();
      } else if (e.key === 'p' || e.key === 'P') {
        if (hasPrevEpisode) handlePrevEpisode();
      } else if (e.key === 'Escape') {
        if (showEpisodeDrawer) setShowEpisodeDrawer(false);
        else onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasNextEpisode, hasPrevEpisode, showEpisodeDrawer, onBack, handleNextEpisode, handlePrevEpisode]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#0A0C10] text-[#F4F5F7] flex flex-col overflow-hidden font-sans select-none"
    >
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 bg-black/80 backdrop-blur-xl border-b border-white/10 z-30">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-subtle hover:glass-medium text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 shadow-md"
            title="Back to Anime"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Back to Details</span>
          </button>

          <GlassPill variant="accent" size="xs">
            EP {currentEpisode}
          </GlassPill>

          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm md:text-base font-bold text-white truncate max-w-[140px] sm:max-w-xs md:max-w-md">
              {title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* AdBlock Protected Shield Indicator */}
          <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
            <ShieldCheck size={13} />
            <span>AdBlock Active</span>
          </div>

          {/* Server Selector */}
          <div className="relative">
            <select
              value={selectedServerIndex}
              onChange={(e) => setSelectedServerIndex(Number(e.target.value))}
              aria-label="Select playback server"
              className="bg-white/10 hover:bg-white/20 text-white text-xs rounded-xl px-3 py-1.5 pr-7 border border-white/15 focus:outline-none focus:border-amber-500 cursor-pointer appearance-none"
            >
              {sources.map((src, idx) => (
                <option key={src.id} value={idx} className="bg-[#14161C] text-white">
                  {src.name}
                </option>
              ))}
            </select>
            <Layers size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
          </div>

          {/* Mobile Landscape Rotation trigger */}
          <button
            onClick={enterLandscape}
            className="p-1.5 rounded-xl glass-subtle hover:glass-medium text-white/80 hover:text-white transition-all cursor-pointer flex sm:hidden items-center justify-center shadow-md"
            title="Rotate to Landscape"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Episode Drawer Toggle */}
          <button
            onClick={() => setShowEpisodeDrawer(!showEpisodeDrawer)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              showEpisodeDrawer
                ? 'bg-amber-500 text-black border-amber-400 font-bold'
                : 'glass-subtle hover:glass-medium text-white border-white/15'
            }`}
          >
            Episodes
          </button>

          {/* Close Player */}
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl glass-subtle hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer shadow-md"
            title="Close Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
        {/* Ambient Glow Background Backdrop */}
        <div
          className="absolute -inset-10 bg-cover bg-center opacity-30 blur-[60px] md:blur-[100px] animate-pulse pointer-events-none"
          style={{
            backgroundImage: `url(${backdrop})`,
            animationDuration: '8s',
          }}
        />

        {/* Video Player Container */}
        <div className="w-full h-full max-w-6xl mx-auto p-2 sm:p-4 md:p-6 relative z-10 flex flex-col justify-center">
          <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/10 bg-black">
            {/*
              MEGA PLAY AD-BLOCKED EMBED:
              We enforce strict sandbox attributes: "allow-scripts allow-same-origin allow-forms allow-presentation"
              Excluding allow-popups, allow-popups-to-escape-sandbox, and allow-top-navigation ensures
              that any popup ads, popunders, or parent redirects triggered by the player are blocked 100%.
            */}
            <iframe
              ref={iframeRef}
              key={`${anime.id}-${currentEpisode}-${selectedServerIndex}`}
              src={currentSource.url}
              title={`${title} - Episode ${currentEpisode}`}
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture; accelerometer; gyroscope"
              referrerPolicy="no-referrer"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              className="w-full h-full border-0 relative z-10 block"
            />

            {/* Loading Spinner Overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0F1113]/90 backdrop-blur-md gap-3 pointer-events-none"
                >
                  <div className="relative">
                    <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                    <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <p className="text-sm font-semibold text-white">
                    Loading Episode {currentEpisode}...
                  </p>
                  <p className="text-xs text-white/50">
                    Connecting to MegaPlay Stream ({currentSource.name})
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Fallback */}
            {hasError && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0F1113]/95 backdrop-blur-xl p-6 text-center max-w-md mx-auto space-y-4">
                <AlertCircle size={44} className="text-amber-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">Playback Stream Unavailable</h3>
                <p className="text-xs text-white/60">
                  We couldn't connect to this playback stream. Try switching to an alternate MegaPlay server.
                </p>
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  {sources.map((src, idx) => (
                    <button
                      key={src.id}
                      onClick={() => {
                        setSelectedServerIndex(idx);
                        setHasError(false);
                        setIsLoading(true);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        selectedServerIndex === idx
                          ? 'bg-amber-500 text-black'
                          : 'glass-subtle hover:glass-medium text-white'
                      }`}
                    >
                      Switch to {src.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Episode Navigator Below Player */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 px-2">
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
                <SkipBack size={13} /> Prev Episode
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
                Next Episode <SkipForward size={13} />
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-white/50">
              <span>
                Episode {currentEpisode} of {totalEpisodes}
              </span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="hidden sm:inline text-white/40">
                Shortcuts: [N] Next • [P] Prev • [ESC] Exit
              </span>
            </div>
          </div>
        </div>

        {/* Side Episode Drawer Overlay */}
        <AnimatePresence>
          {showEpisodeDrawer && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="absolute right-0 top-0 bottom-0 w-80 sm:w-96 bg-[#121419]/95 backdrop-blur-2xl border-l border-white/10 z-40 p-4 sm:p-5 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <h3 className="font-bold text-base text-white">Select Episode</h3>
                <button
                  onClick={() => setShowEpisodeDrawer(false)}
                  className="text-xs text-white/60 hover:text-white px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                <EpisodeSelector
                  anime={anime}
                  currentEpisode={currentEpisode}
                  onSelectEpisode={handleSelectSpecificEpisode}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
