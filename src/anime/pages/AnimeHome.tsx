import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Sparkles,
  Flame,
  TrendingUp,
  Clock,
  Star,
  Search,
  X,
  Filter,
  Layers,
  ChevronDown,
  RefreshCw,
  Compass,
  AlertCircle
} from 'lucide-react';
import { AnimeMedia, AnimeSearchParams } from '../types/anime';
import {
  fetchTrendingAnime,
  fetchPopularAnime,
  fetchRecentlyReleasedAnime,
  fetchTopRatedAnime,
  fetchAnimeByGenre,
  searchAnime,
  ANIME_GENRES,
} from '../api/anilist';
import { AnimeHero } from '../components/AnimeHero';
import { AnimeRow } from '../components/AnimeRow';
import { AnimeCard } from '../components/AnimeCard';
import { AnimeHeroSkeleton, AnimeRowSkeleton, AnimeGridSkeleton } from '../components/AnimeSkeleton';
import { AnimeDetailsModal } from '../components/AnimeDetailsModal';
import { AnimePlayer } from '../components/AnimePlayer';

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
  const [loadingCurated, setLoadingCurated] = useState(true);

  // Genre filter state
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [genreAnime, setGenreAnime] = useState<AnimeMedia[]>([]);
  const [loadingGenre, setLoadingGenre] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AnimeMedia[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('POPULARITY');

  // Modal / Player State
  const [activeAnimeModalId, setActiveAnimeModalId] = useState<number | null>(null);
  const [activeAnimeMedia, setActiveAnimeMedia] = useState<AnimeMedia | null>(null);
  const [playingAnime, setPlayingAnime] = useState<{ anime: AnimeMedia; episode: number } | null>(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load initial curated collections
  useEffect(() => {
    let isMounted = true;
    setLoadingCurated(true);

    Promise.allSettled([
      fetchTrendingAnime(1, 15),
      fetchPopularAnime(1, 15),
      fetchRecentlyReleasedAnime(1, 15),
      fetchTopRatedAnime(1, 15),
    ]).then(([trendingRes, popularRes, recentRes, topRatedRes]) => {
      if (!isMounted) return;
      if (trendingRes.status === 'fulfilled') setTrending(trendingRes.value.media);
      if (popularRes.status === 'fulfilled') setPopular(popularRes.value.media);
      if (recentRes.status === 'fulfilled') setRecent(recentRes.value.media);
      if (topRatedRes.status === 'fulfilled') setTopRated(topRatedRes.value.media);
      setLoadingCurated(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Genre selection
  useEffect(() => {
    if (!selectedGenre) {
      setGenreAnime([]);
      return;
    }
    let isMounted = true;
    setLoadingGenre(true);
    fetchAnimeByGenre(selectedGenre, 1, 24)
      .then((res) => {
        if (isMounted) {
          setGenreAnime(res.media);
          setLoadingGenre(false);
        }
      })
      .catch((err) => {
        console.warn('Genre load error:', err);
        if (isMounted) setLoadingGenre(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedGenre]);

  // Execute Search query
  useEffect(() => {
    if (!debouncedQuery && !selectedFormat && selectedSort === 'POPULARITY') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let isMounted = true;
    setIsSearching(true);

    const params: AnimeSearchParams = {
      search: debouncedQuery || undefined,
      format: selectedFormat || undefined,
      sort: selectedSort,
      page: 1,
      perPage: 24,
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
  }, [debouncedQuery, selectedFormat, selectedSort]);

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
    <div className="min-h-screen bg-[#0A0C10] text-[#F4F5F7] pb-28 select-none">
      {/* Featured Anime Hero Banner (Shown when not actively searching) */}
      {!isSearchActive && !selectedGenre && (
        <>
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
        </>
      )}

      {/* Main Container */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mt-6 sm:mt-8 space-y-6">
        {/* Search & Filter Header Bar */}
        <div className="bg-[#121419]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input Box */}
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anime by title (e.g. Demon Slayer, Solo Leveling)..."
              className="w-full pl-10 pr-9 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Filters: Format & Sort */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {/* Format filter */}
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              aria-label="Filter by format"
              className="bg-white/5 hover:bg-white/10 text-white text-xs rounded-xl px-3 py-2 border border-white/10 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="" className="bg-[#14161C]">All Formats</option>
              <option value="TV" className="bg-[#14161C]">TV Series</option>
              <option value="MOVIE" className="bg-[#14161C]">Movie</option>
              <option value="OVA" className="bg-[#14161C]">OVA / Special</option>
              <option value="ONA" className="bg-[#14161C]">ONA</option>
            </select>

            {/* Sort filter */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              aria-label="Sort anime by"
              className="bg-white/5 hover:bg-white/10 text-white text-xs rounded-xl px-3 py-2 border border-white/10 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="POPULARITY" className="bg-[#14161C]">Most Popular</option>
              <option value="TRENDING" className="bg-[#14161C]">Trending Now</option>
              <option value="SCORE" className="bg-[#14161C]">Highest Rated</option>
              <option value="START_DATE" className="bg-[#14161C]">Newest Releases</option>
            </select>

            {/* Reset Filters button */}
            {(selectedGenre || searchQuery || selectedFormat) && (
              <button
                onClick={() => {
                  setSelectedGenre(null);
                  setSearchQuery('');
                  setSelectedFormat('');
                  setSelectedSort('POPULARITY');
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
              >
                <RefreshCw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Genre Tags Horizontal Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedGenre(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedGenre === null && !isSearchActive
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5'
            }`}
          >
            All Categories
          </button>

          {ANIME_GENRES.map((g) => (
            <button
              key={g}
              onClick={() => {
                setSelectedGenre(selectedGenre === g ? null : g);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedGenre === g
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* VIEW 1: Active Search Results */}
        {isSearchActive && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Search size={18} className="text-amber-400" />
                <span>
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'Filtered Anime'}
                </span>
              </h2>
              <span className="text-xs text-white/40">
                {searchResults.length} titles found
              </span>
            </div>

            {isSearching ? (
              <AnimeGridSkeleton count={18} />
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
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
              <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/5 space-y-3">
                <AlertCircle size={40} className="text-amber-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Anime Found</h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto">
                  We couldn't find any anime matching your criteria. Try adjusting your keywords or filters.
                </p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Selected Genre Catalogue */}
        {!isSearchActive && selectedGenre && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Compass size={18} className="text-amber-400" />
                <span>{selectedGenre} Anime</span>
              </h2>
              <span className="text-xs text-white/40">
                {genreAnime.length} titles
              </span>
            </div>

            {loadingGenre ? (
              <AnimeGridSkeleton count={18} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
                {genreAnime.map((anime) => (
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
            )}
          </div>
        )}

        {/* VIEW 3: Standard Curated Feed Rows */}
        {!isSearchActive && !selectedGenre && (
          <div className="space-y-6">
            {/* Trending Now */}
            <AnimeRow
              title="Trending Now"
              icon={<Flame size={20} className="text-orange-500" />}
              subtitle="Most actively discussed anime this week"
              animeList={trending}
              loading={loadingCurated}
              onSelectAnime={handleOpenDetails}
              onQuickPlay={(a) => handlePlayAnime(a, 1)}
              onSeeAll={() => setSelectedSort('TRENDING')}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />

            {/* Currently Airing / Recently Released */}
            <AnimeRow
              title="Currently Airing"
              icon={<Clock size={20} className="text-emerald-400" />}
              subtitle="Latest simulcasts and newly updated weekly episodes"
              animeList={recent}
              loading={loadingCurated}
              onSelectAnime={handleOpenDetails}
              onQuickPlay={(a) => handlePlayAnime(a, 1)}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />

            {/* All-Time Popular */}
            <AnimeRow
              title="All-Time Popular"
              icon={<TrendingUp size={20} className="text-amber-400" />}
              subtitle="Legendary titles loved by millions worldwide"
              animeList={popular}
              loading={loadingCurated}
              onSelectAnime={handleOpenDetails}
              onQuickPlay={(a) => handlePlayAnime(a, 1)}
              onSeeAll={() => setSelectedSort('POPULARITY')}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />

            {/* Highest Rated */}
            <AnimeRow
              title="Top Rated Masterpieces"
              icon={<Star size={20} className="text-yellow-400 fill-yellow-400" />}
              subtitle="Critically acclaimed and highest rated on AniList"
              animeList={topRated}
              loading={loadingCurated}
              onSelectAnime={handleOpenDetails}
              onQuickPlay={(a) => handlePlayAnime(a, 1)}
              onSeeAll={() => setSelectedSort('SCORE')}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        )}
      </div>

      {/* Anime Details Modal */}
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

      {/* Anime Video Player */}
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
