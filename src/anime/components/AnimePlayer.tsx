import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  RefreshCw,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle,
  Maximize,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimeMedia } from '../types/anime';
import { getAnimeDisplayTitle, getAnimePoster, getAnimeBackdrop } from '../api/anilist';
import { animePlaybackService } from '../services/playbackService';
import { EpisodeSelector } from './EpisodeSelector';

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
  const [showFinishedOverlay, setShowFinishedOverlay] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const title = getAnimeDisplayTitle(anime);
  const poster = getAnimePoster(anime);
  const backdrop = getAnimeBackdrop(anime);

  const totalEpisodes = useMemo(() => {
    if (anime.episodes && anime.episodes > 0) return anime.episodes;
    if (anime.nextAiringEpisode) return Math.max(1, anime.nextAiringEpisode.episode - 1);
    if (anime.status === 'RELEASING') return 24;
    if (anime.format === 'MOVIE') return 1;
    return 12;
  }, [anime]);

  const hasNextEpisode = currentEpisode < totalEpisodes;
  const hasPrevEpisode = currentEpisode > 1;

  // Retrieve available playback sources for current episode
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

  // Load saved progress for resume
  useEffect(() => {
    const progress = animePlaybackService.getProgress(anime.id);
    // If progress is recorded for this episode, record watch update
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
      duration: 1440, // standard anime 24 min
      percentage: progress?.episode === currentEpisode ? progress.percentage : 5,
      updatedAt: Date.now(),
    });
  }, [anime.id, currentEpisode, title, poster, backdrop, totalEpisodes]);

  // Reset loading state when source or episode changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setShowFinishedOverlay(false);
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(null);

    // Timeout safety fallback: if iframe takes > 12s, allow user retry
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, [currentEpisode, selectedServerIndex]);

  const handleNextEpisode = () => {
    if (hasNextEpisode) {
      const nextEp = currentEpisode + 1;
      setCurrentEpisode(nextEp);
      if (onSelectEpisode) onSelectEpisode(nextEp);
    }
  };

  const handlePrevEpisode = () => {
    if (hasPrevEpisode) {
      const prevEp = currentEpisode - 1;
      setCurrentEpisode(prevEp);
      if (onSelectEpisode) onSelectEpisode(prevEp);
    }
  };

  const handleReplayEpisode = () => {
    setShowFinishedOverlay(false);
    if (iframeRef.current) {
      iframeRef.current.src = currentSource.url;
    }
  };

  const handleSelectSpecificEpisode = (epNum: number) => {
    setCurrentEpisode(epNum);
    setShowEpisodeDrawer(false);
    if (onSelectEpisode) onSelectEpisode(epNum);
  };

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
  }, [hasNextEpisode, hasPrevEpisode, showEpisodeDrawer, onBack]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#0A0C10] text-[#F4F5F7] flex flex-col overflow-hidden font-sans select-none"
    >
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-black/80 backdrop-blur-xl border-b border-white/10 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft size={16} />
            <span>Back to Anime</span>
          </button>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-white truncate">
              {title}
            </h1>
            <p className="text-[11px] sm:text-xs text-amber-400 font-medium flex items-center gap-1.5">
              <span>Episode {currentEpisode} of {totalEpisodes}</span>
              <span className="text-white/30">•</span>
              <span className="text-white/60">{currentSource.name}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Server Selector */}
          <div className="relative">
            <select
              value={selectedServerIndex}
              onChange={(e) => setSelectedServerIndex(Number(e.target.value))}
              className="bg-white/10 hover:bg-white/20 text-white text-xs rounded-full px-3 py-1.5 pr-7 border border-white/15 focus:outline-none focus:border-amber-500 cursor-pointer appearance-none"
            >
              {sources.map((src, idx) => (
                <option key={src.id} value={idx} className="bg-[#14161C] text-white">
                  {src.name}
                </option>
              ))}
            </select>
            <Layers size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
          </div>

          {/* Episode Drawer Toggle */}
          <button
            onClick={() => setShowEpisodeDrawer(!showEpisodeDrawer)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              showEpisodeDrawer
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
            }`}
          >
            Episodes
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
        {/* Dynamic Refractive Player Iframe */}
        <iframe
          ref={iframeRef}
          key={`${anime.id}-${currentEpisode}-${selectedServerIndex}`}
          src={currentSource.url}
          title={`${title} - Episode ${currentEpisode}`}
          allowFullScreen
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className="w-full h-full border-0"
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
                Connecting to {currentSource.name}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Fallback */}
        {hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0F1113]/95 backdrop-blur-xl p-6 text-center max-w-md mx-auto space-y-4">
            <AlertCircle size={44} className="text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">Playback Error</h3>
            <p className="text-xs text-white/60">
              We couldn't connect to this playback stream. Try switching to an alternative server.
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
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold cursor-pointer ${
                    selectedServerIndex === idx
                      ? 'bg-amber-500 text-black'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  Switch to {src.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Episode Finished Overlay */}
        <AnimatePresence>
          {showFinishedOverlay && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl p-6 text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle size={32} />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Episode {currentEpisode} Finished
                </h2>
                <p className="text-xs sm:text-sm text-white/60">
                  Ready to continue watching {title}?
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                {hasNextEpisode && (
                  <button
                    onClick={handleNextEpisode}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-xl shadow-amber-500/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <SkipForward size={16} />
                    <span>Next Episode ({currentEpisode + 1})</span>
                  </button>
                )}

                <button
                  onClick={handleReplayEpisode}
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <RotateCcw size={16} />
                  <span>Replay</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                  className="text-xs text-white/50 hover:text-white px-2 py-1 bg-white/5 rounded-lg"
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

      {/* Bottom Floating Control Bar */}
      <div className="px-4 sm:px-6 py-3 bg-[#0D0F12] border-t border-white/10 flex items-center justify-between text-xs text-white/70">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevEpisode}
            disabled={!hasPrevEpisode}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
              hasPrevEpisode
                ? 'bg-white/10 hover:bg-white/20 text-white cursor-pointer'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            <SkipBack size={14} />
            <span>Prev Ep</span>
          </button>

          <button
            onClick={handleNextEpisode}
            disabled={!hasNextEpisode}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
              hasNextEpisode
                ? 'bg-amber-500 hover:bg-amber-400 text-black cursor-pointer shadow-md shadow-amber-500/20'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            <span>Next Ep</span>
            <SkipForward size={14} />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-white/40 text-[11px]">
          <span>Shortcuts: [N] Next Ep • [P] Prev Ep • [ESC] Exit</span>
        </div>
      </div>
    </div>
  );
});
