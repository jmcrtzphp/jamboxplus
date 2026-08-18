import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Play, Search, Film, Tv, ChevronRight, ChevronLeft, Loader2, Star, X, Check, ExternalLink, Radio, Bookmark, Flame, Sparkles, Laugh, Skull, Wand2, Heart, Users, Shield, Music, Clapperboard, Plus, Compass, Smile, Fingerprint, Camera, Landmark, Rocket, Zap, Baby, Newspaper, Mic, Info } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Show, fetchFilters, searchTitle, fetchShowDetails, fetchByGenre } from '../lib/tmdb';
import { GENRES, GENRE_LIST, DEFAULT_GENRE_IMAGES, UnifiedGenre } from '../lib/genres';

import { PLATFORMS, StreamingPlatformIcon, resolvePlatform, PlatformBadge } from '../lib/platforms';
import { GlassButton, GlassPill, GlassContainer } from './liquid-glass';
import { WatchModal } from './WatchModal';
import { ContinueWatchingRow } from './ContinueWatchingRow';
import { Footer } from './Footer';
import { useElasticOverscroll } from '../hooks/useElasticOverscroll';
import { usePullDownZoom } from '../hooks/usePullDownZoom';

import { FloatingNav } from './FloatingNav';
import { AnimeHome, AnimeCard, AnimeDetailsModal, AnimePlayer, AnimeMedia, fetchAnimeDetails } from '../anime';

interface MoviesProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
  onOpenCookies?: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export function Movies({ onBack, onNavigate, onOpenCookies, onOpenPrivacy, onOpenTerms }: MoviesProps) {
  const [activeTab, setActiveTab] = useState<'movies' | 'tv' | 'anime' | 'favorites' | 'search'>('movies');
  const [activePlatform, setActivePlatform] = useState<{ id: string, type: 'movie' | 'series' } | null>(null);
  
  const country = 'us';
  const [heroMovies, setHeroMovies] = useState<Show[]>([]);
  const [heroTVs, setHeroTVs] = useState<Show[]>([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [selectedAnimeId, setSelectedAnimeId] = useState<number | null>(null);
  const [playingAnime, setPlayingAnime] = useState<{ anime: AnimeMedia; episode: number } | null>(null);
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jamtv_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('jamtv_favorites', JSON.stringify(favorites));
    } catch (_) {}
  }, [favorites]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }, []);

  const handleSelectMovie = useCallback((id: string) => {
    setSelectedMovieId(id);
    window.history.pushState({ modalOpen: true, id }, '', `#title=${id}`);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (window.history.state?.modalOpen) {
      window.history.back(); // Let the popstate listener handle setting selectedMovieId to null
    } else {
      setSelectedMovieId(null);
    }
  }, []);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (!e.state?.modalOpen) {
        setSelectedMovieId(null);
      } else if (e.state?.id) {
        setSelectedMovieId(e.state.id);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1113] text-[#F4F5F7] overflow-x-hidden font-sans pb-6 md:pb-0 select-none">
      <FloatingNav
        onBack={onBack}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActivePlatform(null);
        }}
        isSearchExpanded={isSearchExpanded}
        setIsSearchExpanded={setIsSearchExpanded}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNavigate={onNavigate}
        onSelectMovie={handleSelectMovie}
        favoritesCount={favorites.length}
      />

      <AnimatePresence mode="wait">
        {activePlatform ? (
          <motion.div
            key={`platform-${activePlatform.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <PlatformPage 
              platformId={activePlatform.id} 
              type={activePlatform.type} 
              country={country} 
              onBack={() => setActivePlatform(null)} 
              onSelectMovie={handleSelectMovie}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
            />
          </motion.div>
        ) : activeTab === 'search' ? (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <SearchPage 
              country={country} 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery}
              onSelectMovie={handleSelectMovie} 
              isFavorite={isFavorite} 
              toggleFavorite={toggleFavorite} 
            />
          </motion.div>
        ) : activeTab === 'movies' ? (
          <motion.div
            key="movies"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <MoviesView 
              country={country} 
              heroMovies={heroMovies} 
              setHeroMovies={setHeroMovies} 
              onSelectMovie={handleSelectMovie}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              onSeeAll={(id: string, type: any) => setActivePlatform({ id, type })}
            />
          </motion.div>
        ) : activeTab === 'tv' ? (
          <motion.div
            key="tv"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <TVShowsView 
              country={country} 
              heroTVs={heroTVs}
              setHeroTVs={setHeroTVs}
              onSelectMovie={handleSelectMovie}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              onSeeAll={(id: string, type: any) => setActivePlatform({ id, type })}
            />
          </motion.div>
        ) : activeTab === 'anime' ? (
          <motion.div
            key="anime"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <AnimeHome
              favorites={new Set(favorites.filter(f => f.startsWith('anime-')).map(f => parseInt(f.replace('anime-', ''), 10)))}
              onToggleFavorite={(e, animeId) => {
                toggleFavorite(e, `anime-${animeId}`);
              }}
            />
          </motion.div>
        ) : activeTab === 'favorites' ? (
          <motion.div
            key="favorites"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="pt-20 md:pt-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto min-h-screen pb-28 md:pb-20">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-white drop-shadow">Your Favorites</h2>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 content-auto">
              {favorites.map((id, index) => (
                <FavoriteItem 
                  key={`${id}-${index}`} 
                  id={id} 
                  country={country} 
                  onClick={() => {
                    if (id.startsWith('anime-')) {
                      setSelectedAnimeId(parseInt(id.replace('anime-', ''), 10));
                    } else {
                      handleSelectMovie(id);
                    }
                  }} 
                  isFavorite={true} 
                  onToggleFavorite={toggleFavorite} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-white/50 py-20 glass-subtle p-12 rounded-3xl max-w-lg mx-auto">
              <Bookmark size={40} className="mx-auto text-white/20 mb-3" />
              <p className="font-semibold text-white/70">You haven't added any favorites yet.</p>
              <p className="text-xs text-white/40 mt-1">Click the + button on any title to save it here.</p>
            </div>
          )}
        </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Footer onOpenCookies={onOpenCookies} onOpenPrivacy={onOpenPrivacy} onOpenTerms={onOpenTerms} />

      {/* Watch & Playback Modal - Liquid Glass with CineSrc Player */}
      <AnimatePresence>
        {selectedMovieId && (
          <WatchModal key={selectedMovieId} onSelectRelated={handleSelectMovie} 
             showId={selectedMovieId} 
             country={country} 
             onClose={handleCloseModal} 
             isFavorite={isFavorite(selectedMovieId)}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </AnimatePresence>

      {/* Anime Details Modal & Player from Favorites */}
      <AnimatePresence>
        {selectedAnimeId && (
          <AnimeDetailsModal
            animeId={selectedAnimeId}
            onClose={() => setSelectedAnimeId(null)}
            onPlayEpisode={(anime, ep) => {
              setPlayingAnime({ anime, episode: ep });
              setSelectedAnimeId(null);
            }}
            isFavorite={(id) => isFavorite(`anime-${id}`)}
            onToggleFavorite={(e, id) => toggleFavorite(e, `anime-${id}`)}
          />
        )}
      </AnimatePresence>

      {playingAnime && (
        <AnimePlayer
          anime={playingAnime.anime}
          initialEpisode={playingAnime.episode}
          onBack={() => setPlayingAnime(null)}
          onSelectEpisode={(ep) => setPlayingAnime({ anime: playingAnime.anime, episode: ep })}
        />
      )}
    </div>
  );
}

const FavoriteItem = React.memo(function FavoriteItem({ id, country, onClick, isFavorite, onToggleFavorite }: { id: string, country: string, onClick: () => void, isFavorite: boolean, onToggleFavorite: any }) {
  const [show, setShow] = useState<Show | null>(null);
  const [anime, setAnime] = useState<AnimeMedia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (id.startsWith('anime-')) {
      const anilistId = parseInt(id.replace('anime-', ''), 10);
      fetchAnimeDetails(anilistId)
        .then((res) => {
          if (isMounted) {
            setAnime(res);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      fetchShowDetails(id, country)
        .then((res) => {
          if (isMounted) {
            setShow(res);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => { isMounted = false; };
  }, [id, country]);

  if (loading) {
    return <SkeletonCard />;
  }

  if (anime) {
    return (
      <AnimeCard
        anime={anime}
        onClick={onClick}
        isFavorite={isFavorite}
        onToggleFavorite={(e) => onToggleFavorite(e, id)}
      />
    );
  }

  if (!show) return null;

  return (
    <MovieCard 
      show={show} 
      country={country}
      onClick={onClick} 
      isFavorite={isFavorite} 
      onToggleFavorite={onToggleFavorite} 
    />
  );
});

function MoviesView({ country, heroMovies, setHeroMovies, onSelectMovie, isFavorite, toggleFavorite, onSeeAll }: any) {
  const trendingFetcher = useCallback(() => fetchFilters({ country, show_type: 'movie', order_by: 'popularity_1week' }), [country]);

  return (
    <div className="space-y-12">
      <HeroBanner 
        country={country} 
        type="movie" 
        heroMovies={heroMovies} 
        setHeroMovies={setHeroMovies} 
        onSelect={onSelectMovie} 
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />

      <div className="space-y-10 relative z-20 pb-20 -mt-10 md:-mt-20">
        <ContinueWatchingRow onSelect={onSelectMovie} filterType="movie" />

        <CategoryRow 
          title="Trending Movies" 
          fetcher={trendingFetcher} 
          onSelect={onSelectMovie} 
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          country={country}
        />

        {Object.keys(PLATFORMS).map(platformId => (
          <PlatformRow 
            key={platformId}
            platformId={platformId}
            type="movie"
            country={country}
            onSelect={onSelectMovie}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            onSeeAll={() => onSeeAll(platformId, 'movie')}
          />
        ))}
      </div>
    </div>
  );
}

function TVShowsView({ country, heroTVs, setHeroTVs, onSelectMovie, isFavorite, toggleFavorite, onSeeAll }: any) {
  const trendingFetcher = useCallback(() => fetchFilters({ country, show_type: 'series', order_by: 'popularity_1week' }), [country]);

  return (
    <div className="space-y-12">
      <HeroBanner 
        country={country} 
        type="series" 
        heroMovies={heroTVs} 
        setHeroMovies={setHeroTVs} 
        onSelect={onSelectMovie} 
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />

      <div className="space-y-10 relative z-20 pb-20 -mt-10 md:-mt-20">
        <ContinueWatchingRow onSelect={onSelectMovie} filterType="tv" />

        <CategoryRow 
          title="Trending TV Series" 
          fetcher={trendingFetcher} 
          onSelect={onSelectMovie} 
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          country={country}
        />

        {Object.keys(PLATFORMS).map(platformId => (
          <PlatformRow 
            key={platformId}
            platformId={platformId}
            type="series"
            country={country}
            onSelect={onSelectMovie}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            onSeeAll={() => onSeeAll(platformId, 'series')}
          />
        ))}
      </div>
    </div>
  );
}

const HeroBanner = React.memo(function HeroBanner({ country, type, heroMovies, setHeroMovies, onSelect, isFavorite, onToggleFavorite }: any) {
  const [loading, setLoading] = useState(!heroMovies || heroMovies.length === 0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    if (!heroMovies || heroMovies.length === 0) {
      fetchFilters({ country, show_type: type, order_by: 'popularity_1week' }).then(res => {
        if (isMounted && res.shows.length > 0) {
          setHeroMovies(res.shows.slice(0, 5));
        }
      }).catch(err => {
        console.error("HeroBanner fetch error:", err);
      }).finally(() => {
        if (isMounted) setLoading(false);
      });
    }
    return () => { isMounted = false; };
  }, [country, type, heroMovies, setHeroMovies]);

  useEffect(() => {
    if (!heroMovies || heroMovies.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroMovies, activeIndex]);

  const { dragX, scale: swipeScale, handleDragEnd } = useElasticOverscroll({
    activeIndex,
    itemCount: heroMovies?.length || 0,
    onSwipeLeft: () => setActiveIndex(i => i + 1),
    onSwipeRight: () => setActiveIndex(i => i - 1),
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { imageScale, contentY } = usePullDownZoom(containerRef);

  if (loading) {
    return <div className="h-[70vh] md:h-[80vh] w-full bg-[#14161B] animate-pulse" />;
  }

  if (!heroMovies || heroMovies.length === 0) {
    return null; // Fallback so we don't crash or spin forever
  }

  const currentMovie = heroMovies[activeIndex];
  const rating = currentMovie.rating ? (currentMovie.rating / 10).toFixed(1) : null;
  const isFav = isFavorite(currentMovie.id);

  return (
    <div 
      ref={containerRef}
      style={{ touchAction: 'pan-x pan-y', WebkitUserSelect: 'none' }}
      className="relative h-[92vh] md:h-[90vh] w-full overflow-hidden gpu-layer group bg-black select-none"
    >
      {/* 1. Sticky Hero Image Layer (Firmly anchored at top 0, expands proportionally downward without distortion) */}
      <motion.div 
        className="sticky top-0 inset-x-0 w-full h-full pointer-events-none will-change-transform"
        style={{ 
          scale: imageScale,
          transformOrigin: '50% 0%',
          WebkitTransformOrigin: '50% 0%',
        }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ x: dragX, scale: swipeScale, touchAction: 'pan-x pan-y' }}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing pointer-events-auto"
        >
          {/* Background Posters with cross-fade */}
          {heroMovies.map((movie: any, idx: number) => {
            const bg = movie.imageSet?.horizontalPoster?.w1080 || movie.imageSet?.poster;
            return (
              <img 
                key={`${movie.id}-${idx}`}
                src={bg} 
                alt={movie.title} 
                decoding={idx === activeIndex ? "sync" : "async"}
                loading={idx === activeIndex ? "eager" : "lazy"}
                fetchPriority={idx === activeIndex ? "high" : "auto"}
                className={`absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-100 will-change-transform transition-opacity duration-1000 ease-in-out ${idx === activeIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
              />
            );
          })}

          {/* Atmospheric Liquid Glass Depth Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1113] via-[#0F1113]/60 via-30% to-transparent z-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1113] via-[#0F1113]/60 via-30% to-transparent w-full md:w-2/3 z-0" />
        </motion.div>
      </motion.div>

      {/* 2. Parallax Content Overlay Layer (Separate layer with negative translation offset of 0.35x pull distance) */}
      <motion.div 
        style={{ y: contentY }}
        className="absolute bottom-16 sm:bottom-20 md:bottom-28 left-0 right-0 px-6 sm:px-0 sm:left-6 md:left-8 lg:left-12 xl:left-16 sm:right-auto flex flex-col items-center text-center sm:items-start sm:text-left max-w-2xl z-10 pb-2 sm:pb-0 pointer-events-none will-change-transform"
      >
        {rating && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-subtle text-yellow-300 text-xs font-bold mb-3.5 shadow-md pointer-events-auto">
            <Star size={13} className="fill-yellow-400 text-yellow-400" />
            <span>{rating} Rating</span>
          </div>
        )}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg leading-tight transition-all duration-500">
          {currentMovie.title}
        </h1>
        <p className="text-white/80 text-sm md:text-base line-clamp-3 mb-6 font-normal drop-shadow leading-relaxed max-w-xl transition-all duration-500 pointer-events-auto">
          {currentMovie.overview}
        </p>

        {/* Hero Interactive Physical Buttons */}
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 pointer-events-auto">
          <GlassButton 
            variant="primary" 
            size="md"
            onClick={() => onSelect(currentMovie.id)}
            className="cursor-pointer"
          >
            <Play size={17} className="fill-white" /> Watch Options
          </GlassButton>

          <GlassButton 
            variant="secondary" 
            size="md"
            onClick={(e) => onToggleFavorite(e, currentMovie.id)}
            className="cursor-pointer"
          >
            {isFav ? <Check size={17} className="text-green-400" /> : <Plus size={17} />}
            {isFav ? 'Saved' : 'Favorites'}
          </GlassButton>

          <GlassButton
            variant="secondary"
            size="md"
            onClick={() => onSelect(currentMovie.id)}
            className="cursor-pointer !px-3"
            aria-label="More Info"
          >
            <Info size={18} className="text-white/80" />
          </GlassButton>
        </div>
      </motion.div>

      {/* 3. Carousel Indicators (Synchronized parallax with content overlay) */}
      <motion.div style={{ y: contentY }} className="absolute bottom-6 md:bottom-12 left-0 right-0 sm:right-auto flex justify-center sm:justify-start sm:left-6 md:left-8 lg:left-12 xl:left-16 items-center gap-2 z-20 pointer-events-none will-change-transform">
        {heroMovies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer pointer-events-auto ${idx === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </motion.div>
    </div>
  );
});

function CategoryRow({ title, fetcher, onSelect, isFavorite, toggleFavorite, country }: any) {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    try {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      }, { rootMargin: '300px 300px 300px 300px' });
      
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    } catch (_) {
      setIsInView(true);
    }
  }, []);

  useEffect(() => {
    if (!isInView) return;
    let isMounted = true;
    setLoading(true);
    fetcher().then((res: any) => {
      if (isMounted) setShows(res?.shows || []);
    }).catch((err: any) => {
      console.error("CategoryRow fetch error:", err?.message || err);
    }).finally(() => {
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [fetcher, isInView]);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: dir === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading || !isInView) {
    return (
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-4" ref={containerRef}>
        <div className="h-6 w-48 bg-white/10 rounded-full animate-pulse" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[180px] flex-shrink-0"><SkeletonCard /></div>
          ))}
        </div>
      </div>
    );
  }

  if (shows.length === 0) return null;

  return (
    <div className="relative group px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16" ref={containerRef}>
      <h3 className="text-lg sm:text-xl font-extrabold text-white mb-4 tracking-tight drop-shadow">{title}</h3>
      
      <div className="relative">
        <button 
          onClick={() => scroll('left')} 
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-24 glass-subtle rounded-r-2xl hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        >
          <ChevronRight size={24} className="rotate-180 text-white" />
        </button>
        
        <div ref={scrollRef} className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide snap-x py-4 -my-4 pl-1 pr-12">
          {shows.map((show, index) => (
            <div key={`${show.id}-${index}`} className="w-[140px] sm:w-[160px] md:w-[190px] lg:w-[220px] xl:w-[240px] flex-shrink-0 snap-start">
              <MovieCard 
                show={show} 
                country={country}
                onClick={() => onSelect(show.id)} 
                isFavorite={isFavorite(show.id)} 
                onToggleFavorite={toggleFavorite} 
              />
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => scroll('right')} 
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-24 glass-subtle rounded-l-2xl hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}

function PlatformRow({ platformId, type, country, onSelect, isFavorite, toggleFavorite, onSeeAll }: any) {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const p = PLATFORMS[platformId];

  // Lazy loading observer
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    try {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      }, { rootMargin: '300px 300px 300px 300px' });
      
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    } catch (_) {
      setIsInView(true);
    }
  }, []);

  const loadData = useCallback(() => {
    if (!isInView) return;
    setLoading(true);
    setError(null);
    fetchFilters({ country, show_type: type, catalogs: p.providerId, order_by: 'popularity_1week' })
      .then(res => setShows(res.shows))
      .catch(err => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [country, type, p.providerId, isInView]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: dir === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading || !isInView) {
    return (
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-4" ref={containerRef}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/10 animate-pulse" />
          <div className="h-5 w-40 bg-white/10 rounded-full animate-pulse" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[180px] flex-shrink-0"><SkeletonCard /></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || shows.length === 0) return null;

  return (
    <div className="relative group px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16" ref={containerRef}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <StreamingPlatformIcon platformId={platformId} />
          <div>
            <div className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-0.5">{p.displayName}</div>
            <h3 className="text-base sm:text-xl font-extrabold text-white tracking-tight">
              Top {type === 'movie' ? 'Movies' : 'Shows'} on {p.displayName}
            </h3>
          </div>
        </div>
        <button 
          onClick={onSeeAll}
          className="text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1 group/btn glass-subtle px-3 py-1 rounded-full cursor-pointer transition-colors"
        >
          See All <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
      
      <div className="relative">
        <button 
          onClick={() => scroll('left')} 
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-24 glass-subtle rounded-r-2xl hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        >
          <ChevronRight size={24} className="rotate-180 text-white" />
        </button>
        
        <div ref={scrollRef} className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide snap-x py-4 -my-4 pl-1 pr-12">
          {shows.slice(0, 12).map((show, index) => (
            <div key={`${show.id}-${index}`} className="w-[140px] sm:w-[160px] md:w-[190px] lg:w-[220px] xl:w-[240px] flex-shrink-0 snap-start">
              <MovieCard 
                show={show} 
                country={country}
                platformId={platformId} 
                onClick={() => onSelect(show.id)} 
                isFavorite={isFavorite(show.id)} 
                onToggleFavorite={toggleFavorite} 
              />
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => scroll('right')} 
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-24 glass-subtle rounded-l-2xl hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}

function PlatformPage({ platformId, type, country, onBack, onSelectMovie, isFavorite, toggleFavorite }: any) {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const p = PLATFORMS[platformId];

  const heroRef = useRef<HTMLDivElement>(null);
  const { imageScale, contentY } = usePullDownZoom(heroRef);

  const loadData = useCallback((reset = false) => {
    if (reset) setLoading(true);
    else setIsFetchingMore(true);

    fetchFilters({ 
      country, 
      show_type: type, 
      catalogs: p.providerId, 
      order_by: 'popularity_1week',
      cursor: reset ? undefined : nextCursor
    }).then(res => {
      setShows(prev => reset ? res.shows : [...prev, ...res.shows]);
      setHasMore(res.hasMore);
      setNextCursor(res.nextCursor);
    }).catch(console.error).finally(() => {
      setLoading(false);
      setIsFetchingMore(false);
    });
  }, [country, type, p.providerId, nextCursor]);

  useEffect(() => {
    loadData(true);
  }, [platformId, type, country]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: any) => {
    if (loading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadData(false);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, isFetchingMore, hasMore, loadData]);

  const topShow = shows[0];
  const topPoster = topShow?.imageSet?.horizontalPoster?.w1080 || topShow?.imageSet?.poster;
  const topRating = topShow?.rating ? (topShow.rating > 10 ? topShow.rating / 10 : topShow.rating).toFixed(1) : null;
  const isTopFav = topShow ? isFavorite(topShow.id) : false;

  return (
    <div className="min-h-screen pb-28 md:pb-20">
      {/* 1. Platform Hero Banner with Pull-Down Zoom & Stretch */}
      {loading && shows.length === 0 ? (
        <div className="h-[55vh] md:h-[65vh] w-full bg-[#14161B] animate-pulse" />
      ) : topShow && topPoster ? (
        <div 
          ref={heroRef}
          style={{ touchAction: 'pan-x pan-y', WebkitUserSelect: 'none' }}
          className="relative h-[60vh] sm:h-[68vh] md:h-[75vh] w-full overflow-hidden gpu-layer group bg-black select-none"
        >
          {/* Sticky Scalable Backdrop Layer */}
          <motion.div 
            className="sticky top-0 inset-x-0 w-full h-full pointer-events-none will-change-transform"
            style={{ 
              scale: imageScale,
              transformOrigin: '50% 0%',
              WebkitTransformOrigin: '50% 0%',
            }}
          >
            <img 
              src={topPoster} 
              alt={topShow.title} 
              decoding="sync"
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-cover object-center scale-105 filter brightness-100 will-change-transform"
            />
            {/* Atmospheric Depth Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1113] via-[#0F1113]/60 via-35% to-transparent z-0" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F1113] via-[#0F1113]/60 via-30% to-transparent w-full md:w-2/3 z-0" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent h-32 z-0" />
          </motion.div>

          {/* Floating Back Navigation Pill */}
          <div className="absolute top-20 sm:top-24 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 z-30 pointer-events-auto">
            <GlassButton variant="secondary" size="sm" onClick={onBack} className="shadow-2xl">
              <ChevronLeft size={16} /> Back to Catalog
            </GlassButton>
          </div>

          {/* Parallax Hero Info Overlay Layer */}
          <motion.div 
            style={{ y: contentY }}
            className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0 px-6 sm:px-0 sm:left-6 md:left-8 lg:left-12 xl:left-16 sm:right-auto flex flex-col items-center text-center sm:items-start sm:text-left max-w-2xl z-20 pb-2 sm:pb-0 pointer-events-none will-change-transform"
          >
            <div className="flex flex-wrap items-center gap-2.5 mb-3 pointer-events-auto">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full shadow-lg">
                <StreamingPlatformIcon platformId={platformId} className="w-5 h-5 rounded-md" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">{p.displayName} Spotlight</span>
              </div>

              {topRating && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full glass-subtle text-yellow-300 text-xs font-bold shadow-md">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span>{topRating}</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-lg leading-tight">
              {topShow.title}
            </h1>

            {topShow.overview && (
              <p className="text-white/80 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 mb-5 font-normal drop-shadow leading-relaxed max-w-xl pointer-events-auto">
                {topShow.overview}
              </p>
            )}

            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 pointer-events-auto">
              <GlassButton 
                variant="primary" 
                size="md"
                onClick={() => onSelectMovie(topShow.id)}
                className="cursor-pointer shadow-xl"
              >
                <Play size={17} className="fill-white" /> Watch Now
              </GlassButton>

              <GlassButton 
                variant="secondary" 
                size="md"
                onClick={(e) => toggleFavorite(e, topShow.id)}
                className="cursor-pointer"
              >
                {isTopFav ? <Check size={17} className="text-green-400" /> : <Plus size={17} />}
                {isTopFav ? 'Saved' : 'Add to Favorites'}
              </GlassButton>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="pt-20 md:pt-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto">
          <GlassButton variant="secondary" size="sm" onClick={onBack} className="mb-6 md:mb-8">
            <ChevronLeft size={16} /> Back to Catalog
          </GlassButton>
          <div className="flex items-center gap-4 mb-8">
            <StreamingPlatformIcon platformId={platformId} className="w-14 h-14 sm:w-16 sm:h-16 text-xl rounded-2xl shadow-2xl" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{p.displayName}</h1>
              <p className="text-white/60 text-sm sm:text-base">Top {type === 'movie' ? 'Movies' : 'TV Shows'}</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Platform Catalogue Content Grid */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto pt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <StreamingPlatformIcon platformId={platformId} className="w-8 h-8 rounded-xl" />
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                All {p.displayName} {type === 'movie' ? 'Movies' : 'TV Shows'}
              </h2>
              <p className="text-xs sm:text-sm text-white/50">
                Curated stream catalog for {country.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {loading && shows.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : shows.length === 0 ? (
          <div className="text-center text-white/50 py-20">No content available for {p.displayName} in this region.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 content-auto">
            {shows.map((show, index) => {
              const isLast = index === shows.length - 1;
              return (
                <div key={`${show.id}-${index}`} ref={isLast ? lastElementRef : null}>
                  <MovieCard 
                    show={show} 
                    country={country}
                    platformId={platformId} 
                    onClick={() => onSelectMovie(show.id)} 
                    isFavorite={isFavorite(show.id)} 
                    onToggleFavorite={toggleFavorite} 
                  />
                </div>
              );
            })}
            {isFetchingMore && (
              <div className="col-span-full flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


const SkeletonCard = React.memo(function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className="aspect-[2/3] w-full bg-white/5 rounded-3xl overflow-hidden relative shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
        <div className="h-4 w-3/4 bg-white/10 rounded-full" />
        <div className="h-3 w-1/2 bg-white/10 rounded-full" />
      </div>
    </motion.div>
  );
});

const MovieCard = React.memo(function MovieCard({ 
  show, 
  platformId, 
  country = 'us', 
  onClick, 
  isFavorite, 
  onToggleFavorite 
}: {
  show: Show;
  platformId?: string;
  country?: string;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
}) {
  const poster = show.imageSet?.verticalPoster?.w360 || show.imageSet?.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60';
  const resolvedPlatform = useMemo(() => resolvePlatform(platformId, show, country), [platformId, show, country]);
  
  const rawRating = show.rating;
  const ratingValue = rawRating ? (rawRating > 10 ? rawRating / 10 : rawRating) : null;
  const formattedRating = ratingValue ? ratingValue.toFixed(1) : null;
  const releaseYear = show.releaseYear || (show as any).first_air_date?.split('-')[0] || (show as any).release_date?.split('-')[0] || null;

  return (
    <motion.div 
      onClick={onClick}
      style={{ borderRadius: '24px' }}
      className="group/card relative aspect-[2/3] w-full overflow-hidden cursor-pointer glass-subtle border border-white/15 hover:border-white/35 transition-all duration-250 transform hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between gpu-layer will-change-transform"
    >
      {/* Poster Image */}
      <img 
        src={poster} 
        alt={show.title} 
        decoding="async"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105 will-change-transform bg-[#14161C]" 
      />
      
      {/* Top Specular Edge Sheen */}
      <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none z-20" />

      {/* Top Floating Badges: Platform badge & Favorite action */}
      <div className="relative z-10 p-2.5 flex items-start justify-between gap-1 pointer-events-none">
        {resolvedPlatform ? (
          <PlatformBadge platform={resolvedPlatform} className="pointer-events-auto shadow-lg" />
        ) : (
          <GlassPill variant="subtle" size="xs" className="pointer-events-auto shadow-md">
            {show.showType === 'series' ? 'TV' : 'Movie'}
          </GlassPill>
        )}

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e, show.id);
          }}
          className={`pointer-events-auto w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 border shadow-md cursor-pointer ${
            isFavorite 
              ? 'bg-red-500 text-white border-red-400 opacity-100 shadow-[0_0_12px_rgba(239,68,68,0.5)]' 
              : 'bg-black/60 text-white/90 border-white/20 hover:bg-white hover:text-black opacity-0 group-hover/card:opacity-100'
          }`}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          {isFavorite ? <Check size={13} className="stroke-[3]" /> : <Plus size={14} />}
        </button>
      </div>

      {/* Bottom Info Gradient */}
      <div className="relative z-10 pt-16 pb-3.5 px-3.5 bg-gradient-to-t from-[#080A0E] via-[#080A0E]/80 via-50% to-transparent flex flex-col justify-end">
        <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-1 mb-1 tracking-tight group-hover/card:text-amber-500 transition-colors drop-shadow">
          {show.title}
        </h4>
        
        <div className="flex items-center justify-between text-xs text-white/70">
          <div className="flex items-center gap-1.5 text-xs text-white/60 font-medium">
            {releaseYear && <span className="text-white/90 font-semibold">{releaseYear}</span>}
            {show.runtime && <span>• {show.runtime}m</span>}
          </div>
          
          {formattedRating && (
            <div className="flex items-center gap-1 text-yellow-400 font-bold text-xs">
              <Star size={11} className="fill-yellow-400 text-yellow-400" />
              <span>{formattedRating}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

const GenreIcon = React.memo(function GenreIcon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const IconMap: any = { Flame, Compass, Clapperboard, Laugh: Smile, Fingerprint, Camera, Star, Users, Wand2, Landmark, Skull, Music, Search, Heart, Rocket, Zap, Shield, Baby, Newspaper, Tv, Sparkles, Mic };
  const Icon = IconMap[name] || Film;
  return <Icon size={size} className={className} />;
});

function GenreCatalogueView({
  selectedGenre,
  genreImages,
  genreTypeFilter,
  handleSetGenreType,
  shows,
  loading,
  isFetchingMore,
  country,
  lastElementRef,
  onSelectMovie,
  isFavorite,
  toggleFavorite,
  onBack,
}: any) {
  const backdropImage = 
    (selectedGenre.movieId && genreImages[`movie_${selectedGenre.movieId}`]) || 
    (selectedGenre.tvId && genreImages[`tv_${selectedGenre.tvId}`]) || 
    selectedGenre.image || 
    DEFAULT_GENRE_IMAGES[`movie_${selectedGenre.movieId}`] ||
    DEFAULT_GENRE_IMAGES[`tv_${selectedGenre.tvId}`];

  return (
    <div className="min-h-screen pb-28 md:pb-20">
      {/* Refined Liquid Glass Category Header (Fast, Instant, No Pull-Down Zoom) */}
      <div className="relative overflow-hidden border-b border-white/10 bg-[#0E1015] py-8 sm:py-12">
        {/* Subtle Ambient Background Artwork */}
        {backdropImage && (
          <div className="absolute inset-0 pointer-events-none opacity-20 filter blur-2xl transform scale-110">
            <img 
              src={backdropImage} 
              alt={selectedGenre.name} 
              decoding="async" 
              loading="lazy" 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E1015]/80 via-[#0E1015]/95 to-[#0E1015] pointer-events-none" />

        <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto">
          {/* Back Action */}
          <div className="mb-6">
            <GlassButton variant="secondary" size="sm" onClick={onBack} className="shadow-lg">
              <ChevronLeft size={16} /> Back to All Genres
            </GlassButton>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_8px_24px_rgba(0,0,0,0.5)] shrink-0">
                <GenreIcon name={selectedGenre.iconName} size={30} className="text-amber-500 drop-shadow-md" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none drop-shadow-md mb-1.5">
                  {selectedGenre.name}
                </h1>
                <p className="text-xs sm:text-sm text-white/60 font-medium tracking-wide max-w-xl">
                  {selectedGenre.description}
                </p>
              </div>
            </div>

            {/* Content Type Filter Tabs */}
            <div className="flex items-center bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 self-start md:self-auto shadow-md">
              {(['all', 'movie', 'series'] as const).map((t, index) => {
                const label = t === 'all' ? 'All' : t === 'movie' ? 'Movies' : 'TV Series';
                const active = genreTypeFilter === t;
                return (
                  <button
                    key={`${t}-${index}`}
                    onClick={() => handleSetGenreType(t)}
                    className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                      active
                        ? 'bg-amber-500 text-black shadow-md font-bold'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Genre Catalogue Shows Grid */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto pt-8">
        {loading && shows.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 content-auto">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : shows.length === 0 ? (
          <div className="text-center py-20 text-white/50">No titles found in this category.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 content-auto">
            {shows.map((show: Show, index: number) => {
              const isLast = index === shows.length - 1;
              return (
                <div key={`${show.id}-${index}`} ref={isLast ? lastElementRef : null}>
                  <MovieCard 
                    show={show} 
                    country={country}
                    platformId={undefined} 
                    onClick={() => onSelectMovie(show.id)} 
                    isFavorite={isFavorite(show.id)} 
                    onToggleFavorite={toggleFavorite} 
                  />
                </div>
              );
            })}
            {isFetchingMore && (
              <div className="col-span-full flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchPage({ country, searchQuery, setSearchQuery, onSelectMovie, isFavorite, toggleFavorite }: any) {
  const [selectedGenre, setSelectedGenre] = useState<UnifiedGenre | null>(null);
  const [genreImages] = useState<Record<string, string>>(DEFAULT_GENRE_IMAGES);
  const [searchTypeFilter, setSearchTypeFilter] = useState<'all' | 'movie' | 'series'>('all');
  const [searchSort, setSearchSort] = useState<'default' | 'rating' | 'newest'>('default');
  const [searchMinRating, setSearchMinRating] = useState<number>(0);
  const [searchGenreFilter, setSearchGenreFilter] = useState<UnifiedGenre | null>(null);

  const syncGenreFromUrl = useCallback(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const typeParam = searchParams.get('type');
    if (typeParam === 'movie' || typeParam === 'series' || typeParam === 'all') {
      setGenreTypeFilter(typeParam as 'all' | 'movie' | 'series');
    } else if (typeParam === 'tv') {
      setGenreTypeFilter('series');
    }
    
    if (path.startsWith('/genre/')) {
      const slug = path.split('/')[2];
      if (slug) {
        const cat = GENRE_LIST.find(g => g.id === slug);
        if (cat) {
          setSelectedGenre(cat);
          return;
        }
      }
    }
    setSelectedGenre(null);
  }, []);

  useEffect(() => {
    syncGenreFromUrl();
    window.addEventListener('popstate', syncGenreFromUrl);
    return () => window.removeEventListener('popstate', syncGenreFromUrl);
  }, [syncGenreFromUrl]);

  const handleSelectGenre = (genre: UnifiedGenre) => {
    setSelectedGenre(genre);
    setGenreTypeFilter('all');
    window.history.pushState({}, '', `/genre/${genre.id}`);
  };

  const [genreTypeFilter, setGenreTypeFilter] = useState<'all' | 'movie' | 'series'>('all');
  
  const handleSetGenreType = (type: 'all' | 'movie' | 'series') => {
    setGenreTypeFilter(type);
    if (selectedGenre) {
      window.history.pushState({}, '', `/genre/${selectedGenre.id}?type=${type}`);
    }
  };
  
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const activeAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (searchQuery?.trim()) {
      setSelectedGenre(null);
    }
  }, [searchQuery]);

  const searchMemCache = useRef<Map<string, { shows: Show[]; hasMore: boolean; nextCursor?: string }>>(new Map());

  const loadData = useCallback((reset = false) => {
    const isSearch = !!searchQuery?.trim();
    if (!isSearch && !selectedGenre) {
      setShows([]);
      setLoading(false);
      return;
    }

    const cacheKey = isSearch
      ? `search_${searchQuery.trim().toLowerCase()}_${searchTypeFilter}_${searchGenreFilter?.id || 'all'}_${country}_${reset ? 'init' : nextCursor || ''}`
      : `genre_${selectedGenre?.id}_${genreTypeFilter}_${country}_${reset ? 'init' : nextCursor || ''}`;

    if (reset && searchMemCache.current.has(cacheKey)) {
      const cached = searchMemCache.current.get(cacheKey)!;
      setShows(cached.shows);
      setHasMore(cached.hasMore);
      setNextCursor(cached.nextCursor);
      setLoading(false);
      return;
    }

    if (reset) {
      if (activeAbortRef.current) {
        activeAbortRef.current.abort();
      }
      activeAbortRef.current = new AbortController();
      setLoading(true);
      setShows([]);
    } else {
      setIsFetchingMore(true);
    }

    const currentController = activeAbortRef.current;

    if (isSearch) {
      const activeGenre = searchGenreFilter;
      searchTitle({
        title: searchQuery.trim(),
        country,
        show_type: searchTypeFilter === 'all' ? undefined : searchTypeFilter,
        cursor: reset ? undefined : nextCursor,
        ...(activeGenre ? { movie_genre: activeGenre.movieId, tv_genre: activeGenre.tvId } : {})
      }, currentController?.signal)
        .then(res => {
          setShows(prev => {
            const updated = reset ? res.shows : [...prev, ...res.shows];
            searchMemCache.current.set(cacheKey, { shows: updated, hasMore: res.hasMore, nextCursor: res.nextCursor });
            return updated;
          });
          setHasMore(res.hasMore);
          setNextCursor(res.nextCursor);
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            console.error("Search error:", err);
          }
        })
        .finally(() => {
          setLoading(false);
          setIsFetchingMore(false);
        });
    } else if (selectedGenre) {
      fetchByGenre(selectedGenre.movieId, selectedGenre.tvId, genreTypeFilter, country, reset ? undefined : nextCursor)
        .then(res => {
          setShows(prev => {
            const updated = reset ? res.shows : [...prev, ...res.shows];
            searchMemCache.current.set(cacheKey, { shows: updated, hasMore: res.hasMore, nextCursor: res.nextCursor });
            return updated;
          });
          setHasMore(res.hasMore);
          setNextCursor(res.nextCursor);
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false);
          setIsFetchingMore(false);
        });
    }
  }, [searchQuery, selectedGenre, genreTypeFilter, searchTypeFilter, searchGenreFilter, country, nextCursor]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(true);
    }, searchQuery ? 150 : 0);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, selectedGenre, genreTypeFilter, searchTypeFilter, searchGenreFilter, country]);

  // Client-side filtering & sorting for instant refinement
  const processedShows = useMemo(() => {
    let result = [...shows];

    // Filter by rating
    if (searchMinRating > 0) {
      result = result.filter(s => (s.rating || 0) >= searchMinRating);
    }

    // Sort
    if (searchSort === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (searchSort === 'newest') {
      result.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
    }

    return result;
  }, [shows, searchMinRating, searchSort]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: any) => {
    if (loading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadData(false);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, isFetchingMore, hasMore, loadData]);

  const isSearchActive = !!searchQuery?.trim();

  return (
    <div className="pt-20 md:pt-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto min-h-screen pb-28 md:pb-20">
      {/* Case 1: Active Search Query */}
      {isSearchActive ? (
        <div>
          {/* Search Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <Search size={22} className="text-amber-500" />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Results for <span className="text-amber-500">"{searchQuery}"</span>
                </h2>
                {!loading && (
                  <span className="text-xs bg-white/10 text-white/70 px-2.5 py-0.5 rounded-full font-medium">
                    {processedShows.length} {processedShows.length === 1 ? 'title' : 'titles'}
                  </span>
                )}
              </div>
              {searchGenreFilter && (
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-white/50">Filtered by:</span>
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    {searchGenreFilter.name}
                    <button onClick={() => setSearchGenreFilter(null)} className="hover:text-white ml-0.5">
                      <X size={12} />
                    </button>
                  </span>
                </div>
              )}
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Type Selector (All / Movies / Shows) */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5 text-xs">
                {(['all', 'movie', 'series'] as const).map((t, index) => (
                  <button
                    key={`${t}-${index}`}
                    onClick={() => setSearchTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                      searchTypeFilter === t ? 'bg-amber-500 text-black font-semibold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {t === 'all' ? 'All' : t === 'movie' ? 'Movies' : 'TV Shows'}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5 text-xs">
                <button
                  onClick={() => setSearchSort('default')}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                    searchSort === 'default' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Best Match
                </button>
                <button
                  onClick={() => setSearchSort('rating')}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                    searchSort === 'rating' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Top Rated
                </button>
                <button
                  onClick={() => setSearchSort('newest')}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                    searchSort === 'newest' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Newest
                </button>
              </div>

              {/* Min Rating Filter */}
              <button
                onClick={() => setSearchMinRating(prev => (prev === 0 ? 70 : prev === 70 ? 80 : 0))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                  searchMinRating > 0
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                }`}
                title="Filter by rating"
              >
                <Star size={12} className={searchMinRating > 0 ? "fill-amber-400 text-amber-400" : ""} />
                {searchMinRating === 0 ? 'Any Rating' : `${searchMinRating}%+ Only`}
              </button>

              <button
                onClick={() => {
                  setSearchQuery?.('');
                  setSearchGenreFilter(null);
                  setSearchMinRating(0);
                  setSearchSort('default');
                }}
                className="text-xs text-white/60 hover:text-white flex items-center gap-1 glass-subtle px-3 py-1.5 rounded-full cursor-pointer transition-colors"
              >
                <X size={13} />
                Clear
              </button>
            </div>
          </div>

          {loading && shows.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 content-auto">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          ) : processedShows.length === 0 ? (
            <div className="text-center py-20 glass-subtle rounded-3xl p-8 max-w-lg mx-auto">
              <Search size={40} className="mx-auto text-white/20 mb-3" />
              <h3 className="text-lg font-medium text-white mb-1">No matches found</h3>
              <p className="text-sm text-white/50 max-w-md mx-auto mb-6">
                We couldn't find any results matching "{searchQuery}" with the current filters.
              </p>
              <div className="space-y-4">
                <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  Popular searches you might like
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Dune', 'Arcane', 'Avengers', 'Stranger Things', 'Spider-Man', 'Deadpool', 'Fallout', 'Oppenheimer'].map((t, index) => (
                    <button
                      key={`${t}-${index}`}
                      onClick={() => setSearchQuery?.(t)}
                      className="px-3 py-1 text-xs bg-white/5 hover:bg-white/15 text-white/80 rounded-full border border-white/10 transition-colors cursor-pointer"
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="pt-2">
                  <GlassButton
                    variant="primary"
                    onClick={() => {
                      setSearchQuery?.('');
                      setSearchGenreFilter(null);
                      setSearchMinRating(0);
                    }}
                  >
                    Browse All Genres
                  </GlassButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 pb-20 content-auto">
              {processedShows.map((show, index) => {
                const isLast = index === processedShows.length - 1;
                return (
                  <div key={`${show.id}-${index}`} ref={isLast ? lastElementRef : null}>
                    <MovieCard 
                      show={show} 
                      country={country}
                      platformId={undefined} 
                      onClick={() => onSelectMovie(show.id)} 
                      isFavorite={isFavorite(show.id)} 
                      onToggleFavorite={toggleFavorite} 
                    />
                  </div>
                );
              })}
              {isFetchingMore && (
                <div className="col-span-full flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                </div>
              )}
            </div>
          )}
        </div>
      ) : selectedGenre ? (
        /* Case 2: Selected Genre View with Pull-Down Zoom & Stretch Hero */
        <GenreCatalogueView 
          selectedGenre={selectedGenre}
          genreImages={genreImages}
          genreTypeFilter={genreTypeFilter}
          handleSetGenreType={handleSetGenreType}
          shows={shows}
          loading={loading}
          isFetchingMore={isFetchingMore}
          country={country}
          lastElementRef={lastElementRef}
          onSelectMovie={onSelectMovie}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          onBack={() => { setSelectedGenre(null); window.history.pushState({}, '', '/'); }}
        />
      ) : (
        /* Case 3: Initial Search View -> Shows Genres Grid */
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Explore Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow">
              Browse by Genre
            </h2>
            <p className="text-xs sm:text-sm text-white/50 mt-1">
              Select a category to discover curated movies, acclaimed series, and top trending releases.
            </p>
          </div>

          {/* Curated Genre Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 pb-20 content-auto">
            {GENRE_LIST.map((genre) => {
              return (
                <div
                  key={genre.id}
                  onClick={() => handleSelectGenre(genre)}
                  className={`group relative h-44 rounded-3xl overflow-hidden cursor-pointer border border-white/15 bg-[#15171C] transition-all duration-250 transform hover:-translate-y-1 hover:shadow-2xl ${'hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]'} gpu-layer will-change-transform`}
                >
                  {/* Backdrop artwork */}
                  <img 
                    src={(genre.movieId && genreImages[`movie_${genre.movieId}`]) || (genre.tvId && genreImages[`tv_${genre.tvId}`]) || genre.image || DEFAULT_GENRE_IMAGES[`movie_${genre.movieId}`] || DEFAULT_GENRE_IMAGES[`tv_${genre.tvId}`]} 
                    alt={genre.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-60 group-hover:opacity-85 will-change-transform"
                  />
                  
                  {/* Atmospheric gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

                  {/* Refractive border sheen */}
                  <div className="absolute inset-0 rounded-3xl border border-white/15 group-hover:border-white/35 transition-colors pointer-events-none" />
                  <div className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

                  {/* Card Content */}
                  <div className="relative z-10 h-full p-5 flex flex-col justify-between">
                    {/* Top Row: Icon bubble + Arrow */}
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl glass-medium border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                        <GenreIcon name={genre.iconName} size={20} className="text-white drop-shadow-md" />
                      </div>
                      <div className="w-8 h-8 rounded-full glass-subtle group-hover:glass-medium flex items-center justify-center transition-all duration-200">
                        <ChevronRight size={16} className="text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    {/* Bottom Row: Title + Tagline */}
                    <div>
                      <h3 className="text-lg font-extrabold text-white tracking-tight group-hover:text-white transition-colors">
                        {genre.name}
                      </h3>
                      <p className="text-xs text-white/70 line-clamp-2 mt-1 font-medium leading-relaxed">
                        {genre.description}
                      </p>
                    </div>
                  </div>
    </div>
  );
})}
          </div>
        </div>
      )}
    </div>
  );
}
