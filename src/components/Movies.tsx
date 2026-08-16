import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Play, Search, Film, Tv, ChevronRight, ChevronLeft, Loader2, Star, X, Check, ExternalLink, Radio, Bookmark, Flame, Sparkles, Laugh, Skull, Wand2, Heart, Users, Shield, Music, Clapperboard, Plus, Compass, Smile, Fingerprint, Camera, Landmark, Rocket, Zap, Baby, Newspaper, Mic, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Show, fetchFilters, searchTitle, fetchShowDetails, fetchByGenre } from '../lib/tmdb';
import { GENRES, GENRE_LIST, UnifiedGenre } from '../lib/genres';

import { PLATFORMS, StreamingPlatformIcon, resolvePlatform, PlatformBadge } from '../lib/platforms';
import { GlassButton, GlassPill, GlassContainer } from './liquid-glass';
import { WatchModal } from './WatchModal';
import { ContinueWatchingRow } from './ContinueWatchingRow';
import { Footer } from './Footer';

import { FloatingNav } from './FloatingNav';

interface MoviesProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export function Movies({ onBack, onNavigate }: MoviesProps) {
  const [activeTab, setActiveTab] = useState<'movies' | 'tv' | 'favorites' | 'search'>('movies');
  const [activePlatform, setActivePlatform] = useState<{ id: string, type: 'movie' | 'series' } | null>(null);
  
  const country = 'us';
  const [heroMovies, setHeroMovies] = useState<Show[]>([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  
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
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovieId(null);
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
              onSelectMovie={handleSelectMovie}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              onSeeAll={(id: string, type: any) => setActivePlatform({ id, type })}
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

      <div className="sm:hidden mb-6 relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
        <input 
          autoFocus
          type="text" 
          placeholder="Search titles, actors, genres..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1A1D24] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-white/40 outline-none focus:border-amber-500/50 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>

                <div className="sm:hidden mb-6 relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
        <input 
          autoFocus
          type="text" 
          placeholder="Search titles, actors, genres..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1A1D24] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-white/40 outline-none focus:border-amber-500/50 focus:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-white drop-shadow">Your Favorites</h2>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 content-auto">
              {favorites.map(id => (
                <FavoriteItem 
                  key={id} 
                  id={id} 
                  country={country} 
                  onClick={() => handleSelectMovie(id)} 
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

      <Footer />

      {/* Watch & Playback Modal - Liquid Glass with CineSrc Player */}
      <AnimatePresence>
        {selectedMovieId && (
          <WatchModal onSelectRelated={handleSelectMovie} 
             showId={selectedMovieId} 
             country={country} 
             onClose={handleCloseModal} 
             isFavorite={isFavorite(selectedMovieId)}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const FavoriteItem = React.memo(function FavoriteItem({ id, country, onClick, isFavorite, onToggleFavorite }: { id: string, country: string, onClick: () => void, isFavorite: boolean, onToggleFavorite: any }) {
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchShowDetails(id, country).then(res => {
      if (isMounted) {
        setShow(res);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [id, country]);

  if (loading) {
    return <div className="aspect-[2/3] bg-white/5 rounded-3xl animate-pulse" />;
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

function TVShowsView({ country, onSelectMovie, isFavorite, toggleFavorite, onSeeAll }: any) {
  const [heroTVs, setHeroTVs] = useState<Show[]>([]);
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
  }, [heroMovies]);

  if (loading || !heroMovies || heroMovies.length === 0) {
    return <div className="h-[70vh] md:h-[80vh] w-full bg-[#14161B] animate-pulse" />;
  }

  const currentMovie = heroMovies[activeIndex];
  const rating = currentMovie.rating ? (currentMovie.rating / 10).toFixed(1) : null;
  const isFav = isFavorite(currentMovie.id);

  return (
    <div className="relative h-[92vh] md:h-[90vh] w-full overflow-hidden gpu-layer group">
      {/* Background Posters with cross-fade */}
      {heroMovies.map((movie: any, idx: number) => {
        const bg = movie.imageSet?.horizontalPoster?.w1080 || movie.imageSet?.poster;
        return (
          <img 
            key={movie.id}
            src={bg} 
            alt={movie.title} 
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-100 will-change-transform transition-opacity duration-1000 ease-in-out ${idx === activeIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
          />
        );
      })}

      {/* Atmospheric Liquid Glass Depth Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1113] via-[#0F1113]/60 via-30% to-transparent z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F1113] via-[#0F1113]/60 via-30% to-transparent w-full md:w-2/3 z-0 pointer-events-none" />

      {/* Hero Content Panel */}
      <div className="absolute bottom-16 sm:bottom-20 md:bottom-28 left-0 right-0 px-6 sm:px-0 sm:left-6 md:left-8 lg:left-12 xl:left-16 sm:right-auto flex flex-col items-center text-center sm:items-start sm:text-left max-w-2xl z-10 pb-2 sm:pb-0">
        {rating && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-subtle text-yellow-300 text-xs font-bold mb-3.5 shadow-md">
            <Star size={13} className="fill-yellow-400 text-yellow-400" />
            <span>{rating} Rating</span>
          </div>
        )}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg leading-tight transition-all duration-500">
          {currentMovie.title}
        </h1>
        <p className="text-white/80 text-sm md:text-base line-clamp-3 mb-6 font-normal drop-shadow leading-relaxed max-w-xl transition-all duration-500">
          {currentMovie.overview}
        </p>

        {/* Hero Interactive Physical Buttons */}
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
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
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-6 md:bottom-12 left-0 right-0 sm:right-auto flex justify-center sm:justify-start sm:left-6 md:left-8 lg:left-12 xl:left-16 items-center gap-2 z-20">
        {heroMovies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${idx === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
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
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { rootMargin: '300px' });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    let isMounted = true;
    setLoading(true);
    fetcher().then((res: any) => {
      if (isMounted) setShows(res.shows);
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
            <div key={i} className="w-[180px] h-[270px] bg-white/5 rounded-3xl flex-shrink-0 animate-pulse" />
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
          {shows.map(show => (
            <div key={show.id} className="w-[140px] sm:w-[160px] md:w-[190px] lg:w-[220px] xl:w-[240px] flex-shrink-0 snap-start">
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
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { rootMargin: '300px' });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
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
            <div key={i} className="w-[180px] h-[270px] bg-white/5 rounded-3xl flex-shrink-0 animate-pulse" />
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
          {shows.slice(0, 12).map(show => (
            <div key={show.id} className="w-[140px] sm:w-[160px] md:w-[190px] lg:w-[220px] xl:w-[240px] flex-shrink-0 snap-start">
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

  return (
    <div className="pt-20 md:pt-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto min-h-screen pb-28 md:pb-20">
      <GlassButton variant="secondary" size="sm" onClick={onBack} className="mb-6 md:mb-8">
        <ChevronLeft size={16} /> Back to Catalog
      </GlassButton>

      <div className="flex items-center gap-4 mb-8 md:mb-10">
        <StreamingPlatformIcon platformId={platformId} className="w-14 h-14 sm:w-16 sm:h-16 text-xl rounded-2xl shadow-2xl" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{p.displayName}</h1>
          <p className="text-white/60 text-sm sm:text-base">Top {type === 'movie' ? 'Movies' : 'TV Shows'}</p>
        </div>
      </div>

      {loading && shows.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : shows.length === 0 ? (
        <div className="text-center text-white/50 py-20">No content available for {p.displayName} in this region.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 pb-20 content-auto">
          {shows.map((show, index) => {
            const isLast = index === shows.length - 1;
            return (
              <div key={show.id} ref={isLast ? lastElementRef : null}>
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
  );
}

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

function SearchPage({ country, searchQuery, setSearchQuery, onSelectMovie, isFavorite, toggleFavorite }: any) {
  const [selectedGenre, setSelectedGenre] = useState<UnifiedGenre | null>(null);
  const [genreImages, setGenreImages] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/genres/images')
      .then(res => res.json())
      .then(data => setGenreImages(data))
      .catch(console.error);
  }, []);

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

  useEffect(() => {
    if (searchQuery?.trim()) {
      (() => { setSelectedGenre(null); window.history.pushState({}, '', '/'); })();
    }
  }, [searchQuery]);

  const loadData = useCallback((reset = false) => {
    const isSearch = !!searchQuery?.trim();
    if (!isSearch && !selectedGenre) {
      setShows([]);
      setLoading(false);
      return;
    }

    if (reset) {
      setLoading(true);
      setShows([]);
    } else {
      setIsFetchingMore(true);
    }

    if (isSearch) {
      searchTitle({ title: searchQuery.trim(), country, cursor: reset ? undefined : nextCursor, ...(selectedGenre ? { movie_genre: selectedGenre.movieId, tv_genre: selectedGenre.tvId } : {}) })
        .then(res => {
          setShows(prev => reset ? res.shows : [...prev, ...res.shows]);
          setHasMore(res.hasMore);
          setNextCursor(res.nextCursor);
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false);
          setIsFetchingMore(false);
        });
    } else if (selectedGenre) {
      fetchByGenre(selectedGenre.movieId, selectedGenre.tvId, genreTypeFilter, country, reset ? undefined : nextCursor)
        .then(res => {
          setShows(prev => reset ? res.shows : [...prev, ...res.shows]);
          setHasMore(res.hasMore);
          setNextCursor(res.nextCursor);
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false);
          setIsFetchingMore(false);
        });
    }
  }, [searchQuery, selectedGenre, genreTypeFilter, country, nextCursor]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(true);
    }, searchQuery ? 100 : 0);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenre, genreTypeFilter, country]);

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
      {/* Category Pills Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2 mb-6">
        <button
          onClick={() => {
            setSearchQuery?.('');
            (() => { setSelectedGenre(null); window.history.pushState({}, '', '/'); })();
          }}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
            !selectedGenre && !isSearchActive
              ? 'refractive-glass-pill text-white shadow-lg'
              : 'glass-subtle text-white/70 hover:text-white'
          }`}
        >
          All Genres
        </button>

        {GENRE_LIST.map((genre) => {
          const isSelected = selectedGenre?.id === genre.id;
          return (
            <button
              key={genre.id}
              onClick={() => {
                setSearchQuery?.('');
                setSelectedGenre(genre);
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'refractive-glass-pill text-white shadow-lg'
                  : 'glass-subtle text-white/70 hover:text-white'
              }`}
            >
              <GenreIcon name={genre.iconName} size={14} className={isSelected ? 'text-white' : 'text-white/60'} />
              {genre.name}
            </button>
          );
        })}
      </div>

      {/* Case 1: Active Search Query */}
      {isSearchActive ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Search size={22} className="text-amber-500" />
              Search Results for <span className="text-amber-500">"{searchQuery}"</span>
            </h2>
            <button
              onClick={() => setSearchQuery?.('')}
              className="text-xs text-white/60 hover:text-white flex items-center gap-1 glass-subtle px-3 py-1.5 rounded-full cursor-pointer transition-colors"
            >
              Clear Search
            </button>
          </div>

          {loading && shows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-sm text-white/50">Searching titles...</p>
            </div>
          ) : shows.length === 0 ? (
            <div className="text-center py-24 glass-subtle rounded-3xl p-8 max-w-lg mx-auto">
              <Search size={40} className="mx-auto text-white/20 mb-3" />
              <h3 className="text-lg font-medium text-white mb-1">No matches found</h3>
              <p className="text-sm text-white/50 max-w-md mx-auto mb-6">
                We couldn't find anything matching "{searchQuery}". Try exploring our curated genres instead.
              </p>
              <GlassButton
                variant="primary"
                onClick={() => setSearchQuery?.('')}
              >
                Browse Genres
              </GlassButton>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 pb-20 content-auto">
              {shows.map((show, index) => {
                const isLast = index === shows.length - 1;
                return (
                  <div key={show.id} ref={isLast ? lastElementRef : null}>
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
        /* Case 2: Selected Genre View */
        <div className="flex flex-col">
          {/* Back Button */}
          <button 
            onClick={() => { setSelectedGenre(null); window.history.pushState({}, '', '/'); }}
            className="inline-flex items-center self-start gap-2 text-sm font-semibold text-white/80 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-[20px] mb-8 backdrop-blur-3xl cursor-pointer transition-all shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          >
            <ChevronLeft size={16} />
            Back to All Genres
          </button>

          {/* Genre Header Box (Liquid Glass) */}
          <div className="flex items-center gap-6 bg-[rgba(255,255,255,0.03)] backdrop-blur-[30px] border border-[rgba(255,255,255,0.18)] rounded-[36px] p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] mb-8">
            <div className="w-[88px] h-[88px] rounded-[24px] bg-[rgba(255,255,255,0.06)] border border-white/20 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
              <GenreIcon name={selectedGenre.iconName} size={40} className="text-white drop-shadow-md" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-[32px] font-extrabold text-white tracking-tight leading-none drop-shadow-md mb-2">
                {selectedGenre.name}
              </h2>
              <p className="text-[15px] text-white/70 font-medium tracking-wide">
                {selectedGenre.description}
              </p>
            </div>
          </div>

          {/* Content Type Selector */}
          <div className="flex items-center bg-[rgba(255,255,255,0.03)] backdrop-blur-[30px] p-2 rounded-[24px] border border-[rgba(255,255,255,0.12)] mb-8 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <button
              onClick={() => handleSetGenreType('all')}
              className={`flex-1 py-3 text-sm sm:text-base font-semibold rounded-[16px] transition-all duration-300 cursor-pointer ${
                genreTypeFilter === 'all' 
                  ? 'bg-white/15 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleSetGenreType('movie')}
              className={`flex-1 py-3 text-sm sm:text-base font-semibold rounded-[16px] transition-all duration-300 cursor-pointer ${
                genreTypeFilter === 'movie' 
                  ? 'bg-white/15 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => handleSetGenreType('series')}
              className={`flex-1 py-3 text-sm sm:text-base font-semibold rounded-[16px] transition-all duration-300 cursor-pointer ${
                genreTypeFilter === 'series' 
                  ? 'bg-white/15 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              TV Series
            </button>
          </div>

          {/* Genre Shows List */}
          {loading && shows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              <p className="text-sm text-white/50">Loading {selectedGenre.name} titles...</p>
            </div>
          ) : shows.length === 0 ? (
            <div className="text-center py-20 text-white/50">No titles found in this category.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 pb-20 content-auto">
              {shows.map((show, index) => {
                const isLast = index === shows.length - 1;
                return (
                  <div key={show.id} ref={isLast ? lastElementRef : null}>
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
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105 opacity-60 group-hover:opacity-80 will-change-transform"
                    style={{ backgroundImage: `url('${(genre.movieId && genreImages[`movie_${genre.movieId}`]) || (genre.tvId && genreImages[`tv_${genre.tvId}`]) || genre.image || ''}')` }}
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
