import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Loader2, AlertCircle, RefreshCw, Film, Tv, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { buildCineSrcUrl, isCineSrcOrigin, saveWatchProgress, WatchProgressItem } from '../lib/cinesrc';
import { GlassButton } from './liquid-glass';

export interface CineSrcPlayerProps {
  tmdbId: string | number;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
  title?: string;
  poster?: string;
  backdrop?: string;
  autoPlay?: boolean;
  startAt?: number;
  subtitle?: string;
  theme?: string;
  className?: string;
  episodeTitle?: string;
  hasNextEpisode?: boolean;
  onNextEpisode?: () => void;
  onProgress?: (progress: { currentTime: number; duration: number; percentage: number }) => void;
  onEnded?: () => void;
  onError?: (error: string) => void;
}

export function CineSrcPlayer({
  tmdbId,
  type,
  season = 1,
  episode = 1,
  title,
  poster,
  backdrop,
  autoPlay = true,
  startAt = 0,
  subtitle,
  theme = 'dark',
  className = '',
  episodeTitle,
  hasNextEpisode = false,
  onNextEpisode,
  onProgress,
  onEnded,
  onError
}: CineSrcPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [showAutoNextBanner, setShowAutoNextBanner] = useState(false);
  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(null);

  const lastProgressTimeRef = useRef<number>(0);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const autoNextTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Validate TMDB ID
  const cleanTmdbId = useMemo(() => {
    return String(tmdbId || '').replace(/^(movie|tv|series)-/, '').trim();
  }, [tmdbId]);

  // Construct Player Embed URL
  const playerUrl = useMemo(() => {
    if (!cleanTmdbId) return '';
    try {
      return buildCineSrcUrl({
        type,
        tmdbId: cleanTmdbId,
        season,
        episode,
        options: {
          title,
          poster: poster || backdrop,
          autoPlay,
          startAt: startAt > 10 ? startAt : undefined, // Only pass startAt if meaningful progress (>10s)
          theme,
          fullscreenButton: true,
          chromecast: true,
          sub: subtitle
        }
      });
    } catch (err: any) {
      console.error('Error constructing CineSrc URL:', err);
      return '';
    }
  }, [type, cleanTmdbId, season, episode, title, poster, backdrop, autoPlay, startAt, theme, subtitle]);

  // Reset loading & error state when URL changes or retried
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage(null);
    setShowAutoNextBanner(false);
    if (autoNextTimerRef.current) {
      clearInterval(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
    setAutoNextCountdown(null);

    if (!cleanTmdbId) {
      setHasError(true);
      setErrorMessage('Missing or invalid TMDB ID.');
      setIsLoading(false);
      onError?.('Missing TMDB ID');
    }
  }, [playerUrl, retryKey, cleanTmdbId, onError]);

  // Handle postMessage events from CineSrc
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isCineSrcOrigin(event.origin)) {
        return;
      }

      let payload = event.data;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }

      if (!payload || typeof payload !== 'object') return;
      
      const { type: eventType, ...data } = payload;

      if (eventType === 'cinesrc:ready') {
        setIsLoading(false);
        setHasError(false);
      } else if (eventType === 'cinesrc:error') {
        setIsLoading(false);
        setHasError(true);
        setErrorMessage(data.error || 'The video stream could not be loaded.');
        onError?.(data.error || 'Stream error');
      } else if (eventType === 'cinesrc:timeupdate') {
        const currentTime = Number(data.currentTime);
        const duration = Number(data.duration);
        
        if (!isNaN(currentTime) && currentTime > 0) {
          setIsLoading(false);
          const validDuration = (!isNaN(duration) && duration > 0) ? duration : (currentTime * 1.5);
          const percentage = Math.min(100, Math.max(0, (currentTime / validDuration) * 100));

          // Throttle progress persistence to at most once every 3.5 seconds
          const now = Date.now();
          if (now - lastProgressTimeRef.current > 3500) {
            lastProgressTimeRef.current = now;

            const progressItem: WatchProgressItem = {
              id: `${type}-${cleanTmdbId}`,
              tmdbId: cleanTmdbId,
              mediaType: type,
              title: title || (type === 'movie' ? 'Movie' : 'TV Show'),
              poster,
              backdrop,
              season: type === 'tv' ? season : undefined,
            episode: type === 'tv' ? episode : undefined,
            episodeTitle: type === 'tv' ? episodeTitle : undefined,
            currentTime,
            duration: validDuration,
            percentage,
            updatedAt: now
          };

          saveWatchProgress(progressItem);
          onProgress?.({ currentTime, duration: validDuration, percentage });
        }
      }

      } else if (eventType === 'cinesrc:ended') {
        onEnded?.();

        // If it's a TV show and has next episode, show countdown auto-advance banner
        if (type === 'tv' && hasNextEpisode && onNextEpisode) {
          setShowAutoNextBanner(true);
          let timeLeft = 6;
          setAutoNextCountdown(timeLeft);

          if (autoNextTimerRef.current) clearInterval(autoNextTimerRef.current);
          autoNextTimerRef.current = setInterval(() => {
            timeLeft -= 1;
            setAutoNextCountdown(timeLeft);
            if (timeLeft <= 0) {
              if (autoNextTimerRef.current) clearInterval(autoNextTimerRef.current);
              setShowAutoNextBanner(false);
              onNextEpisode();
            }
          }, 1000);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      if (autoNextTimerRef.current) {
        clearInterval(autoNextTimerRef.current);
      }
    };
  }, [cleanTmdbId, type, season, episode, title, poster, backdrop, episodeTitle, hasNextEpisode, onNextEpisode, onProgress, onEnded, onError]);

  const handleIframeLoad = useCallback(() => {
    // Give player a brief moment to render video before dismissing loading overlay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = useCallback(() => {
    setRetryKey(k => k + 1);
  }, []);

  const handleSkipToNextNow = useCallback(() => {
    if (autoNextTimerRef.current) clearInterval(autoNextTimerRef.current);
    setShowAutoNextBanner(false);
    onNextEpisode?.();
  }, [onNextEpisode]);

  const handleCancelAutoNext = useCallback(() => {
    if (autoNextTimerRef.current) clearInterval(autoNextTimerRef.current);
    setShowAutoNextBanner(false);
    setAutoNextCountdown(null);
  }, []);

  return (
    <div className={`relative w-full min-h-[320px] aspect-[4/3] sm:min-h-0 sm:aspect-video bg-[#0B0C10] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 select-none ${className}`}>
      {/* Background Poster Blur for smooth aesthetics */}
      {(backdrop || poster) && (
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-20 scale-110 pointer-events-none transition-opacity duration-700"
          style={{ backgroundImage: `url(${backdrop || poster})` }}
        />
      )}

      {/* Main CineSrc Iframe */}
      {playerUrl && !hasError ? (
        <iframe
          id="cinesrc-iframe"
          key={`${playerUrl}-${retryKey}`}
          ref={iframeRef}
          src={playerUrl}
          title={title ? `${title} - CineSrc Player` : 'CineSrc Video Player'}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          sandbox="allow-same-origin allow-scripts allow-forms"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; accelerometer; gyroscope"
          allowFullScreen
          onLoad={handleIframeLoad}
          className="w-full h-full relative z-10 block"
        />
      ) : null}

      {/* Loading State Overlay */}
      <AnimatePresence>
        {isLoading && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-20 bg-[#090A0E]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative mb-4">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
              <div className="absolute inset-0 rounded-full blur-md bg-amber-500/20" />
            </div>

            <div className="space-y-1.5 max-w-sm">
              <p className="text-white font-bold text-base tracking-wide flex items-center justify-center gap-2">
                {type === 'movie' ? <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" /> : <Tv className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />}
                Connecting to CineSrc Stream
              </p>
              {title && (
                <p className="text-white/60 text-xs truncate">
                  {title} {type === 'tv' && `(S${season}:E${episode})`}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Fallback State Overlay */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-[#0c0e14]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/10">
              <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div className="max-w-md space-y-1.5">
              <h3 className="text-lg font-bold text-white tracking-tight">Playback Encountered an Issue</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                {errorMessage || 'Unable to establish video playback from CineSrc. Please verify the title or try reloading.'}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <GlassButton
                variant="primary"
                size="sm"
                onClick={handleRetry}
                className="flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 sm:w-[14px] sm:h-[14px]" /> Retry Player
              </GlassButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TV Episode Auto-Advance Notification Banner */}
      <AnimatePresence>
        {showAutoNextBanner && hasNextEpisode && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute bottom-6 right-6 z-40 bg-[#0D1017]/95 border border-amber-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-center gap-4 max-w-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 font-bold shrink-0">
              {autoNextCountdown}s
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Playing Next Episode</p>
              <p className="text-[11px] text-white/60 truncate">Season {season}, Episode {episode + 1}</p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleSkipToNextNow}
                className="p-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer"
                title="Play Next Episode Now"
              >
                <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleCancelAutoNext}
                className="px-2.5 py-1 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
