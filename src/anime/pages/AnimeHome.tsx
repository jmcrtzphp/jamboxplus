import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Flame,
  TrendingUp,
  Clock,
  Star,
  Search,
  X,
  Compass,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  Zap,
  Heart,
  Shield,
  Rocket,
} from 'lucide-react';
import { AnimeMedia, AnimeSearchParams } from '../types/anime';
import { motion } from 'motion/react';
import {
  fetchTrendingAnime,
  fetchPopularAnime,
  fetchRecentlyReleasedAnime,
  fetchTopRatedAnime,
  fetchAnimeByGenre,
  searchAnime,
  ANIME_GENRES,
  getAnimeDisplayTitle,
  getAnimeBackdrop,
  getAnimePoster,
} from '../api/anilist';
import { AnimeHero } from '../components/AnimeHero';
import { AnimeRow } from '../components/AnimeRow';
import { AnimeCard } from '../components/AnimeCard';
import { AnimeHeroSkeleton, AnimeGridSkeleton } from '../components/AnimeSkeleton';
import { AnimeDetailsModal } from '../components/AnimeDetailsModal';
import { AnimePlayer } from '../components/AnimePlayer';
import { ContinueWatchingRow } from '../../components/ContinueWatchingRow';
import { GlassButton } from '../../components/liquid-glass';
import { usePullDownZoom } from '../../hooks/usePullDownZoom';

interface AnimeHomeProps {
  onSelectAnimeMovie?: (anime: AnimeMedia) => void;
  favorites?: Set<number>;
  onToggleFavorite?: (e: React.MouseEvent, id: number) => void;
}

export const AnimeHome: React.FC<AnimeHomeProps> = ({
  favorites = new Set(),
  onToggleFavorite,
}) => {
  // Curated lists state
  const [trending, setTrending] = useState<AnimeMedia[]>([]);
  const [popular, setPopular] = useState<AnimeMedia[]>([]);
  const [recent, setRecent] = useState<AnimeMedia[]>([]);
  const [topRated, setTopRated] = useState<AnimeMedia[]>([]);
  const [actionAnime, setActionAnime] = useState<AnimeMedia[]>([]);
  const [fantasyAnime, setFantasyAnime] = useState<AnimeMedia[]>([]);
  const [sciFiAnime, setSciFiAnime] = useState<AnimeMedia[]>([]);
  const [romanceAnime, setRomanceAnime] = useState<AnimeMedia[]>([]);
  const [loadingCurated, setLoadingCurated] = useState(true);

  // Category "See All" Catalogue View state (matching PlatformPage / GenreCatalogueView)
  const [activeCategory, setActiveCategory] = useState<{
    id: string;
    title: string;
    type: 'genre' | 'sort';
  } | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AnimeMedia[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('');

  // Modal / Player State
  const [activeAnimeModalId, setActiveAnimeModalId] = useState<number | null>(null);
  const [activeAnimeMedia, setActiveAnimeMedia] = useState<AnimeMedia | null>(null);
  const [playingAnime, setPlayingAnime] = useState<{ anime: AnimeMedia; episode: number } | null>(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load initial curated collections & genres
  useEffect(() => {
    let isMounted = true;
    setLoadingCurated(true);

    Promise.allSettled([
      fetchTrendingAnime(1, 15),
      fetchRecentlyReleasedAnime(1, 15),
      fetchPopularAnime(1, 15),
      fetchTopRatedAnime(1, 15),
      fetchAnimeByGenre('Action', 1, 15),
      fetchAnimeByGenre('Fantasy', 1, 15),
      fetchAnimeByGenre('Sci-Fi', 1, 15),
      fetchAnimeByGenre('Romance', 1, 15),
    ]).then(([trendingRes, recentRes, popularRes, topRatedRes, actionRes, fantasyRes, sciFiRes, romanceRes]) => {
      if (!isMounted) return;
      if (trendingRes.status === 'fulfilled') setTrending(trendingRes.value.media);
      if (recentRes.status === 'fulfilled') setRecent(recentRes.value.media);
      if (popularRes.status === 'fulfilled') setPopular(popularRes.value.media);
      if (topRatedRes.status === 'fulfilled') setTopRated(topRatedRes.value.media);
      if (actionRes.status === 'fulfilled') setActionAnime(actionRes.value.media);
      if (fantasyRes.status === 'fulfilled') setFantasyAnime(fantasyRes.value.media);
      if (sciFiRes.status === 'fulfilled') setSciFiAnime(sciFiRes.value.media);
      if (romanceRes.status === 'fulfilled') setRomanceAnime(romanceRes.value.media);
      setLoadingCurated(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Execute Search query
  useEffect(() => {
    if (!debouncedQuery && !selectedFormat) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);

    const params: AnimeSearchParams = {
      search: debouncedQuery || undefined,
      format: selectedFormat || undefined,
      sort: 'POPULARITY_DESC',
      page: 1,
      perPage: 30,
    };

    searchAnime(params)
      .then((res) => {
        if (isMounted) {
          setSearchResults(res.media);
          setIsSearching(false);
        }
      })
      .catch((err) => {
        console.warn('Anime search error:', err);
        if (isMounted) setIsSearching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, selectedFormat]);

  const handleOpenDetails = useCallback((anime: AnimeMedia) => {
    setActiveAnimeMedia(anime);
    setActiveAnimeModalId(anime.id);
  }, []);

  const handlePlayAnime = useCallback((anime: AnimeMedia, episode: number = 1) => {
    setPlayingAnime({ anime, episode });
    setActiveAnimeModalId(null);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setActiveAnimeModalId(null);
    setActiveAnimeMedia(null);
  }, []);

  const isFavorite = useCallback(
    (id: number) => favorites.has(id),
    [favorites]
  );

  const isSearchActive = !!debouncedQuery || !!selectedFormat;

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#F4F5F7] select-none">
      {/* 1. Category Catalogue View (When user clicks "See All" on a category) */}
      {activeCategory ? (
        <AnimeCategoryCatalogue
          category={activeCategory}
          onBack={() => setActiveCategory(null)}
          onSelectAnime={handleOpenDetails}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      ) : isSearchActive ? (
        /* 2. Active Search Results View */
        <div className="pt-24 sm:pt-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto min-h-screen pb-28">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Search size={22} className="text-amber-400" />
                <span>{searchQuery ? `Search results for "${searchQuery}"` : 'Filtered Anime'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/50 mt-1">
                {searchResults.length} anime series found
              </p>
            </div>

            {/* Clear search */}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFormat('');
              }}
              className="glass-subtle hover:glass-medium text-white text-xs px-3.5 py-2 rounded-full cursor-pointer transition-colors self-start sm:self-auto"
            >
              Clear Search
            </button>
          </div>

          {isSearching ? (
            <AnimeGridSkeleton count={18} />
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 content-auto">
              {searchResults.map((anime) => (
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  onClick={() => handleOpenDetails(anime)}
                  onQuickPlay={(a) => handlePlayAnime(a, 1)}
                  isFavorite={isFavorite(anime.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-white/50 py-20 glass-subtle p-12 rounded-3xl max-w-lg mx-auto">
              <Compass size={40} className="mx-auto text-white/20 mb-3" />
              <p className="font-semibold text-white/70">No anime found matching your query.</p>
              <p className="text-xs text-white/40 mt-1">Try searching with different keywords.</p>
            </div>
          )}
        </div>
      ) : (
        /* 3. Main Anime Feed View (Matches MoviesView & TVShowsView format!) */
        <div className="space-y-12">
          {/* Featured Hero Banner */}
          {loadingCurated && trending.length === 0 ? (
            <AnimeHeroSkeleton />
          ) : (
            <AnimeHero
              featuredAnime={trending}
              onPlay={(anime, ep) => handlePlayAnime(anime, ep || 1)}
              onOpenDetails={handleOpenDetails}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />
          )}

          {/* Shelves & Category Rows Container */}
          <div className="space-y-10 relative z-20 pb-20 -mt-10 md:-mt-20">
            {/* Continue Watching Row for Anime */}
            <ContinueWatchingRow
              onSelect={(id) => {
                if (id.startsWith('anime-')) {
                  const num = parseInt(id.replace('anime-', ''), 10);
                  setActiveAnimeModalId(num);
                }
              }}
            />

            {/* Trending Anime Row */}
            <AnimeRow
              title="Trending Anime"
              icon={<Flame size={20} className="text-orange-500" />}
              subtitle="Most popular anime this week"
              animeList={trending}
              loading={loadingCurated}
              onSelectAnime={handleOpenDetails}
              onQuickPlay={(a) => handlePlayAnime(a, 1)}
              onSeeAll={() => setActiveCategory({ id: 'TRENDING_DESC', title: 'Trending Anime', type: 'sort' })}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />

            {/* Currently Airing Simulcasts Row */}
            <AnimeRow
              title="Top Airing Simulcasts"
              icon={<Clock size={20} className="text-emerald-400" />}
              subtitle="Currently releasing weekly episodes"
              animeList={recent}
              loading={loadingCurated}
              onSelectAnime={handleOpenDetails}
              onQuickPlay={(a) => handlePlayAnime(a, 1)}
              onSeeAll={() => setActiveCategory({ id: 'START_DATE_DESC', title: 'Currently Airing Anime', type: 'sort' })}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />

            {/* All-Time Popular Masterpieces Row */}
            <AnimeRow
              title="All-Time Popular Masterpieces"
              icon={<TrendingUp size={20} className="text-amber-400" />}
              subtitle="Highest fan followings worldwide"
              animeList={popular}
              loading={loadingCurated}
              onSelectAnime={handleOpenDetails}
              onQuickPlay={(a) => handlePlayAnime(a, 1)}
              onSeeAll={() => setActiveCategory({ id: 'POPULARITY_DESC', title: 'All-Time Popular Anime', type: 'sort' })}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />

            {/* Top Rated Masterpieces Row */}
            <AnimeRow
              title="Top Rated Masterpieces"
              icon={<Star size={20} className="text-yellow-400 fill-yellow-400" />}
              subtitle="Critically acclaimed on AniList"
              animeList={topRated}
              loading={loadingCurated}
              onSelectAnime={handleOpenDetails}
              onQuickPlay={(a) => handlePlayAnime(a, 1)}
              onSeeAll={() => setActiveCategory({ id: 'SCORE_DESC', title: 'Top Rated Anime', type: 'sort' })}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />

            {/* Action Anime Row */}
            <AnimeRow
              title="Action & Shonen Anime"
              icon={<Zap size={20} className="text-red-400" />}
              subtitle="High-octane battles and supernatural action"
              animeList={actionAnime}
              loading={loadingCurated}
              onSelectAnime={handleOpenDetails}
              onQuickPlay={(a) => handlePlayAnime(a, 1)}
              onSeeAll={() => setActiveCategory({ id: 'Action', title: 'Action Anime', type: 'genre' })}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />

            {/* Fantasy Anime Row */}
            <AnimeRow
              title="Fantasy & Isekai Anime"
              icon={<Sparkles size={20} className="text-purple-400" />}
              subtitle="Magical worlds, guilds, and adventures"
              animeList={fantasyAnime}
              loading={loadingCurated}
              onSelectAnime={handleOpenDetails}
              onQuickPlay={(a) => handlePlayAnime(a, 1)}
              onSeeAll={() => setActiveCategory({ id: 'Fantasy', title: 'Fantasy Anime', type: 'genre' })}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />

            {/* Sci-Fi Anime Row */}
            <AnimeRow
              title="Sci-Fi & Cyberpunk Anime"
              icon={<Rocket size={20} className="text-cyan-400" />}
              subtitle="Futuristic tech, space epics, and mecha"
              animeList={sciFiAnime}
              loading={loadingCurated}
              onSelectAnime={handleOpenDetails}
              onQuickPlay={(a) => handlePlayAnime(a, 1)}
              onSeeAll={() => setActiveCategory({ id: 'Sci-Fi', title: 'Sci-Fi Anime', type: 'genre' })}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />

            {/* Romance Anime Row */}
            <AnimeRow
              title="Romance & Slice of Life"
              icon={<Heart size={20} className="text-pink-400" />}
              subtitle="Heartfelt stories, comedy, and school life"
              animeList={romanceAnime}
              loading={loadingCurated}
              onSelectAnime={handleOpenDetails}
              onQuickPlay={(a) => handlePlayAnime(a, 1)}
              onSeeAll={() => setActiveCategory({ id: 'Romance', title: 'Romance Anime', type: 'genre' })}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        </div>
      )}

      {/* Anime Details Modal (Liquid glass matching WatchModal) */}
      {activeAnimeModalId && (
        <AnimeDetailsModal
          animeId={activeAnimeModalId}
          initialAnime={activeAnimeMedia}
          onClose={handleCloseDetails}
          onPlayEpisode={(anime, ep) => handlePlayAnime(anime, ep)}
          onSelectRelatedAnime={(id) => {
            setActiveAnimeModalId(id);
            setActiveAnimeMedia(null);
          }}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      )}

      {/* Fullscreen Video Player */}
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
};

/**
 * Category Catalogue View: Replicates PlatformPage & GenreCatalogueView from Movies.tsx
 */
function AnimeCategoryCatalogue({
  category,
  onBack,
  onSelectAnime,
  isFavorite,
  onToggleFavorite,
}: {
  category: { id: string; title: string; type: 'genre' | 'sort' };
  onBack: () => void;
  onSelectAnime: (anime: AnimeMedia) => void;
  isFavorite: (id: number) => boolean;
  onToggleFavorite?: (e: React.MouseEvent, id: number) => void;
}) {
  const [animeList, setAnimeList] = useState<AnimeMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { imageScale, contentY } = usePullDownZoom(heroRef);

  const loadData = useCallback(
    (targetPage = 1) => {
      if (targetPage === 1) setLoading(true);
      else setIsFetchingMore(true);

      const fetchPromise =
        category.type === 'genre'
          ? fetchAnimeByGenre(category.id, targetPage, 24)
          : searchAnime({ sort: category.id, page: targetPage, perPage: 24 });

      fetchPromise
        .then((res) => {
          setAnimeList((prev) => (targetPage === 1 ? res.media : [...prev, ...res.media]));
          setHasNextPage(res.pageInfo?.hasNextPage ?? false);
          setPage(targetPage);
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false);
          setIsFetchingMore(false);
        });
    },
    [category]
  );

  useEffect(() => {
    loadData(1);
  }, [loadData]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || isFetchingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          loadData(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, isFetchingMore, hasNextPage, page, loadData]
  );

  const topAnime = animeList[0];
  const topBackdrop = topAnime ? getAnimeBackdrop(topAnime) || getAnimePoster(topAnime) : null;
  const topScore = topAnime?.averageScore ? (topAnime.averageScore / 10).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-[#0A0C10] pb-24 select-none">
      {/* 1. Category Hero Banner */}
      {topAnime && topBackdrop ? (
        <div
          ref={heroRef}
          style={{ touchAction: 'pan-x pan-y', WebkitUserSelect: 'none' }}
          className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden gpu-layer group bg-black mb-8 select-none"
        >
          <motion.div
            className="sticky top-0 inset-x-0 w-full h-full pointer-events-none will-change-transform"
            style={{
              scale: imageScale,
              transformOrigin: '50% 0%',
              WebkitTransformOrigin: '50% 0%',
            }}
          >
            <img
              src={topBackdrop}
              alt={category.title}
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.85] will-change-transform"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-[#0A0C10]/60 via-30% to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0C10] via-[#0A0C10]/70 via-30% to-transparent w-full md:w-3/4" />
          </motion.div>

          <motion.div
            style={{ y: contentY }}
            className="absolute bottom-12 sm:bottom-16 md:bottom-20 left-4 sm:left-8 md:left-12 lg:left-16 right-4 sm:right-auto max-w-2xl z-20 flex flex-col items-start"
          >
            <GlassButton variant="secondary" size="sm" onClick={onBack} className="mb-4">
              <ChevronLeft size={16} /> Back to Anime Home
            </GlassButton>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full glass-subtle text-amber-400 text-xs font-bold uppercase tracking-wider">
                {category.title}
              </span>
              {topScore && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full glass-subtle text-yellow-300 text-xs font-bold">
                  <Star size={11} className="fill-yellow-400 text-yellow-400" />
                  <span>{topScore}</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-lg leading-tight">
              {category.title}
            </h1>

            <p className="text-white/80 text-xs sm:text-sm line-clamp-2 mb-5 max-w-lg drop-shadow">
              Browse top rated and trending {category.title} series available on JamBox+ with fast MegaPlay streaming.
            </p>

            <div className="flex items-center gap-3">
              <GlassButton
                variant="primary"
                size="md"
                onClick={() => onSelectAnime(topAnime)}
                className="cursor-pointer shadow-xl"
              >
                Watch Featured
              </GlassButton>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="pt-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto">
          <GlassButton variant="secondary" size="sm" onClick={onBack} className="mb-6">
            <ChevronLeft size={16} /> Back to Anime Home
          </GlassButton>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{category.title}</h1>
        </div>
      )}

      {/* 2. Grid Content */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              All {category.title} Titles
            </h2>
            <p className="text-xs sm:text-sm text-white/50">
              {animeList.length} anime series loaded
            </p>
          </div>
        </div>

        {loading && animeList.length === 0 ? (
          <AnimeGridSkeleton count={18} />
        ) : animeList.length === 0 ? (
          <div className="text-center text-white/50 py-20">No content available for this category.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 content-auto">
            {animeList.map((anime, index) => {
              const isLast = index === animeList.length - 1;
              return (
                <div key={`${anime.id}-${index}`} ref={isLast ? lastElementRef : null}>
                  <AnimeCard
                    anime={anime}
                    onClick={() => onSelectAnime(anime)}
                    isFavorite={isFavorite(anime.id)}
                    onToggleFavorite={onToggleFavorite}
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
