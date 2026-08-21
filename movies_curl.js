import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=d84b7188"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=d84b7188"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useState = __vite__cjsImport1_react["useState"]; const useEffect = __vite__cjsImport1_react["useEffect"]; const useRef = __vite__cjsImport1_react["useRef"]; const useMemo = __vite__cjsImport1_react["useMemo"]; const useCallback = __vite__cjsImport1_react["useCallback"];
import { Play, Search, Film, Tv, ChevronRight, ChevronLeft, Loader2, Star, X, Check, Bookmark, Flame, Sparkles, Skull, Wand2, Heart, Users, Shield, Music, Clapperboard, Plus, Compass, Smile, Fingerprint, Camera, Landmark, Rocket, Zap, Baby, Newspaper, Mic, Info } from "/node_modules/.vite/deps/lucide-react.js?v=d84b7188";
import { motion, AnimatePresence } from "/node_modules/.vite/deps/motion_react.js?v=d84b7188";
import { fetchFilters, searchTitle, fetchShowDetails, fetchByGenre } from "/src/lib/tmdb.ts";
import { GENRE_LIST, DEFAULT_GENRE_IMAGES } from "/src/lib/genres.ts";
import { PLATFORMS, StreamingPlatformIcon, resolvePlatform, PlatformBadge } from "/src/lib/platforms.tsx";
import { GlassButton, GlassPill } from "/src/components/liquid-glass/index.ts";
import __vite__cjsImport8_react from "/node_modules/.vite/deps/react.js?v=d84b7188"; const lazy = __vite__cjsImport8_react["lazy"]; const Suspense = __vite__cjsImport8_react["Suspense"];
const WatchModal = lazy(() => import("/src/components/WatchModal.tsx").then((module) => ({ default: module.WatchModal })));
import { ContinueWatchingRow } from "/src/components/ContinueWatchingRow.tsx";
import { Footer } from "/src/components/Footer.tsx";
import { useElasticOverscroll } from "/src/hooks/useElasticOverscroll.ts";
import { usePullDownZoom } from "/src/hooks/usePullDownZoom.ts";
import { FloatingNav } from "/src/components/FloatingNav.tsx";
export function Movies({ onBack, onNavigate, onOpenCookies, onOpenPrivacy, onOpenTerms }) {
  const [activeTab, setActiveTab] = useState("movies");
  const [activePlatform, setActivePlatform] = useState(null);
  const country = "us";
  const [heroMovies, setHeroMovies] = useState([]);
  const [heroTVs, setHeroTVs] = useState([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("jamtv_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("jamtv_favorites", JSON.stringify(favorites));
    } catch (_) {
    }
  }, [favorites]);
  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);
  const toggleFavorite = useCallback((e, id) => {
    e.stopPropagation();
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  }, []);
  const handleSelectMovie = useCallback((id) => {
    setSelectedMovieId(id);
    window.history.pushState({ modalOpen: true, id }, "", `#title=${id}`);
  }, []);
  const handleCloseModal = useCallback(() => {
    if (window.history.state?.modalOpen) {
      window.history.back();
    } else {
      setSelectedMovieId(null);
    }
  }, []);
  useEffect(() => {
    const handlePopState = (e) => {
      if (!e.state?.modalOpen) {
        setSelectedMovieId(null);
      } else if (e.state?.id) {
        setSelectedMovieId(e.state.id);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-[#0F1113] text-[#F4F5F7] overflow-x-hidden font-sans pb-6 md:pb-0 select-none", children: [
    /* @__PURE__ */ jsxDEV(
      FloatingNav,
      {
        onBack,
        activeTab,
        setActiveTab: (tab) => {
          setActiveTab(tab);
          setActivePlatform(null);
        },
        isSearchExpanded,
        setIsSearchExpanded,
        searchQuery,
        setSearchQuery,
        onNavigate,
        onSelectMovie: handleSelectMovie,
        favoritesCount: favorites.length
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 87,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", children: activePlatform ? /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.3 },
        className: "w-full",
        children: /* @__PURE__ */ jsxDEV(
          PlatformPage,
          {
            platformId: activePlatform.id,
            type: activePlatform.type,
            country,
            onBack: () => setActivePlatform(null),
            onSelectMovie: handleSelectMovie,
            isFavorite,
            toggleFavorite
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 113,
            columnNumber: 13
          },
          this
        )
      },
      `platform-${activePlatform.id}`,
      false,
      {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 105,
        columnNumber: 11
      },
      this
    ) : activeTab === "paramount" ? /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.3 },
        className: "w-full",
        children: /* @__PURE__ */ jsxDEV(
          ParamountView,
          {
            country,
            onSelectMovie: handleSelectMovie,
            isFavorite,
            toggleFavorite
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 132,
            columnNumber: 13
          },
          this
        )
      },
      "paramount",
      false,
      {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 124,
        columnNumber: 11
      },
      this
    ) : activeTab === "search" ? /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.3 },
        className: "w-full",
        children: /* @__PURE__ */ jsxDEV(
          SearchPage,
          {
            country,
            searchQuery,
            setSearchQuery,
            onSelectMovie: handleSelectMovie,
            isFavorite,
            toggleFavorite
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 148,
            columnNumber: 13
          },
          this
        )
      },
      "search",
      false,
      {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 140,
        columnNumber: 11
      },
      this
    ) : activeTab === "movies" ? /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.3 },
        className: "w-full",
        children: /* @__PURE__ */ jsxDEV(
          MoviesView,
          {
            country,
            heroMovies,
            setHeroMovies,
            onSelectMovie: handleSelectMovie,
            isFavorite,
            toggleFavorite,
            onSeeAll: (id, type) => setActivePlatform({ id, type })
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 166,
            columnNumber: 13
          },
          this
        )
      },
      "movies",
      false,
      {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 158,
        columnNumber: 11
      },
      this
    ) : activeTab === "tv" ? /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.3 },
        className: "w-full",
        children: /* @__PURE__ */ jsxDEV(
          TVShowsView,
          {
            country,
            heroTVs,
            setHeroTVs,
            onSelectMovie: handleSelectMovie,
            isFavorite,
            toggleFavorite,
            onSeeAll: (id, type) => setActivePlatform({ id, type })
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 185,
            columnNumber: 13
          },
          this
        )
      },
      "tv",
      false,
      {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 177,
        columnNumber: 11
      },
      this
    ) : activeTab === "favorites" ? /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.3 },
        className: "w-full",
        children: /* @__PURE__ */ jsxDEV("div", { className: "pt-20 md:pt-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto min-h-screen pb-28 md:pb-20", children: [
          /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl sm:text-3xl font-extrabold mb-6 text-white drop-shadow", children: "Your Favorites" }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 205,
            columnNumber: 15
          }, this),
          favorites.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5 content-auto", children: favorites.map((id, index) => /* @__PURE__ */ jsxDEV(
            FavoriteItem,
            {
              id,
              country,
              onClick: () => {
                handleSelectMovie(id);
              },
              isFavorite: true,
              onToggleFavorite: toggleFavorite
            },
            `${id}-${index}`,
            false,
            {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 209,
              columnNumber: 17
            },
            this
          )) }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 207,
            columnNumber: 13
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-center text-white/50 py-20 glass-subtle p-12 rounded-3xl max-w-lg mx-auto", children: [
            /* @__PURE__ */ jsxDEV(Bookmark, { size: 40, className: "mx-auto text-white/20 mb-3" }, void 0, false, {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 225,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "font-semibold text-white/70", children: "You haven't added any favorites yet." }, void 0, false, {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 226,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-white/40 mt-1", children: "Click the + button on any title to save it here." }, void 0, false, {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 227,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 224,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 204,
          columnNumber: 13
        }, this)
      },
      "favorites",
      false,
      {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 196,
        columnNumber: 11
      },
      this
    ) : null }, void 0, false, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 103,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Footer, { onOpenCookies, onOpenPrivacy, onOpenTerms }, void 0, false, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 235,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { children: selectedMovieId && /* @__PURE__ */ jsxDEV(Suspense, { fallback: null, children: /* @__PURE__ */ jsxDEV(
      WatchModal,
      {
        onSelectRelated: handleSelectMovie,
        showId: selectedMovieId,
        country,
        onClose: handleCloseModal,
        isFavorite: isFavorite(selectedMovieId),
        onToggleFavorite: toggleFavorite
      },
      selectedMovieId,
      false,
      {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 240,
        columnNumber: 37
      },
      this
    ) }, void 0, false, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 240,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 238,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/Movies.tsx",
    lineNumber: 86,
    columnNumber: 5
  }, this);
}
const FavoriteItem = React.memo(function FavoriteItem2({ id, country, onClick, isFavorite, onToggleFavorite }) {
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    fetchShowDetails(id, country).then((res) => {
      if (isMounted) {
        setShow(res);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [id, country]);
  if (loading) {
    return /* @__PURE__ */ jsxDEV(SkeletonCard, {}, void 0, false, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 273,
      columnNumber: 12
    }, this);
  }
  if (!show) return null;
  return /* @__PURE__ */ jsxDEV(
    MovieCard,
    {
      show,
      country,
      onClick,
      isFavorite,
      onToggleFavorite
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 281,
      columnNumber: 5
    },
    this
  );
});
function MoviesView({ country, heroMovies, setHeroMovies, onSelectMovie, isFavorite, toggleFavorite, onSeeAll }) {
  const trendingFetcher = useCallback(() => fetchFilters({ country, show_type: "movie", order_by: "top_rated" }), [country]);
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-12", children: [
    /* @__PURE__ */ jsxDEV(
      HeroBanner,
      {
        country,
        type: "movie",
        heroMovies,
        setHeroMovies,
        onSelect: onSelectMovie,
        isFavorite,
        onToggleFavorite: toggleFavorite
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 296,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "space-y-10 relative z-20 pb-20 -mt-10 md:-mt-20", children: [
      /* @__PURE__ */ jsxDEV(ContinueWatchingRow, { onSelect: onSelectMovie, filterType: "movie" }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 307,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        CategoryRow,
        {
          title: "Top Rated Movies",
          fetcher: trendingFetcher,
          onSelect: onSelectMovie,
          isFavorite,
          toggleFavorite,
          country
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 309,
          columnNumber: 9
        },
        this
      ),
      Object.keys(PLATFORMS).map((platformId) => /* @__PURE__ */ jsxDEV(
        PlatformRow,
        {
          platformId,
          type: "movie",
          country,
          onSelect: onSelectMovie,
          isFavorite,
          toggleFavorite,
          onSeeAll: () => onSeeAll(platformId, "movie")
        },
        platformId,
        false,
        {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 319,
          columnNumber: 11
        },
        this
      ))
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 306,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/Movies.tsx",
    lineNumber: 295,
    columnNumber: 5
  }, this);
}
function TVShowsView({ country, heroTVs, setHeroTVs, onSelectMovie, isFavorite, toggleFavorite, onSeeAll }) {
  const trendingFetcher = useCallback(() => fetchFilters({ country, show_type: "series", order_by: "top_rated" }), [country]);
  return /* @__PURE__ */ jsxDEV("div", { className: "space-y-12", children: [
    /* @__PURE__ */ jsxDEV(
      HeroBanner,
      {
        country,
        type: "series",
        heroMovies: heroTVs,
        setHeroMovies: setHeroTVs,
        onSelect: onSelectMovie,
        isFavorite,
        onToggleFavorite: toggleFavorite
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 340,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "space-y-10 relative z-20 pb-20 -mt-10 md:-mt-20", children: [
      /* @__PURE__ */ jsxDEV(ContinueWatchingRow, { onSelect: onSelectMovie, filterType: "tv" }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 351,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        CategoryRow,
        {
          title: "Top Rated TV Series",
          fetcher: trendingFetcher,
          onSelect: onSelectMovie,
          isFavorite,
          toggleFavorite,
          country
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 353,
          columnNumber: 9
        },
        this
      ),
      Object.keys(PLATFORMS).map((platformId) => /* @__PURE__ */ jsxDEV(
        PlatformRow,
        {
          platformId,
          type: "series",
          country,
          onSelect: onSelectMovie,
          isFavorite,
          toggleFavorite,
          onSeeAll: () => onSeeAll(platformId, "series")
        },
        platformId,
        false,
        {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 363,
          columnNumber: 11
        },
        this
      ))
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 350,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/Movies.tsx",
    lineNumber: 339,
    columnNumber: 5
  }, this);
}
const HeroBanner = React.memo(function HeroBanner2({ country, type, heroMovies, setHeroMovies, onSelect, isFavorite, onToggleFavorite }) {
  const [loading, setLoading] = useState(!heroMovies || heroMovies.length === 0);
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    let isMounted = true;
    if (!heroMovies || heroMovies.length === 0) {
      fetchFilters({ country, show_type: type, order_by: "popularity_1week" }).then((res) => {
        if (isMounted && res?.shows?.length > 0) {
          setHeroMovies(res.shows.slice(0, 5));
        }
      }).catch((err) => {
        console.error("HeroBanner fetch error:", err?.message || err);
      }).finally(() => {
        if (isMounted) setLoading(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [country, type, heroMovies, setHeroMovies]);
  useEffect(() => {
    if (!heroMovies || heroMovies.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroMovies.length);
    }, 6e3);
    return () => clearInterval(interval);
  }, [heroMovies, activeIndex]);
  const { dragX, scale: swipeScale, handleDragEnd } = useElasticOverscroll({
    activeIndex,
    itemCount: heroMovies?.length || 0,
    onSwipeLeft: () => setActiveIndex((i) => i + 1),
    onSwipeRight: () => setActiveIndex((i) => i - 1)
  });
  const containerRef = useRef(null);
  const { imageScale, contentY } = usePullDownZoom(containerRef);
  if (loading) {
    return /* @__PURE__ */ jsxDEV("div", { className: "h-[70vh] md:h-[80vh] w-full bg-[#14161B] animate-pulse" }, void 0, false, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 418,
      columnNumber: 12
    }, this);
  }
  if (!heroMovies || heroMovies.length === 0) {
    return null;
  }
  const currentMovie = heroMovies[activeIndex];
  const rating = currentMovie.rating ? (currentMovie.rating / 10).toFixed(1) : null;
  const isFav = isFavorite(currentMovie.id);
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      ref: containerRef,
      style: { touchAction: "pan-x pan-y", WebkitUserSelect: "none" },
      className: "relative h-[92vh] md:h-[90vh] w-full overflow-hidden gpu-layer group bg-black select-none",
      children: [
        /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            className: "sticky top-0 inset-x-0 w-full h-full pointer-events-none will-change-transform",
            style: {
              scale: imageScale,
              transformOrigin: "50% 0%",
              WebkitTransformOrigin: "50% 0%"
            },
            children: /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                drag: "x",
                dragConstraints: { left: 0, right: 0 },
                dragElastic: 0.2,
                onDragEnd: handleDragEnd,
                style: { x: dragX, scale: swipeScale, touchAction: "pan-x pan-y" },
                className: "absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing pointer-events-auto",
                children: [
                  heroMovies.map((movie, idx) => {
                    const hPoster = movie.imageSet?.horizontalPoster;
                    const bg = hPoster?.w1080 || hPoster?.original || hPoster?.w720 || movie.imageSet?.poster;
                    const srcSet = hPoster ? [
                      hPoster.w480 ? `${hPoster.w480} 480w` : null,
                      hPoster.w720 ? `${hPoster.w720} 720w` : null,
                      hPoster.w1080 ? `${hPoster.w1080} 1080w` : null,
                      hPoster.original ? `${hPoster.original} 2000w` : null
                    ].filter(Boolean).join(", ") : void 0;
                    return /* @__PURE__ */ jsxDEV(
                      "img",
                      {
                        src: bg,
                        srcSet,
                        sizes: "100vw",
                        alt: movie.title,
                        decoding: idx === activeIndex ? "sync" : "async",
                        loading: idx === activeIndex ? "eager" : "lazy",
                        fetchPriority: idx === activeIndex ? "high" : "auto",
                        className: `absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-100 will-change-transform transition-opacity duration-1000 ease-in-out ${idx === activeIndex ? "opacity-100 z-0" : "opacity-0 -z-10"}`
                      },
                      `${movie.id}-${idx}`,
                      false,
                      {
                        fileName: "/app/applet/src/components/Movies.tsx",
                        lineNumber: 463,
                        columnNumber: 15
                      },
                      this
                    );
                  }),
                  /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0F1113] via-[#0F1113]/60 via-30% to-transparent z-0" }, void 0, false, {
                    fileName: "/app/applet/src/components/Movies.tsx",
                    lineNumber: 478,
                    columnNumber: 11
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-r from-[#0F1113] via-[#0F1113]/60 via-30% to-transparent w-full md:w-2/3 z-0" }, void 0, false, {
                    fileName: "/app/applet/src/components/Movies.tsx",
                    lineNumber: 479,
                    columnNumber: 11
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 444,
                columnNumber: 9
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 436,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            style: { y: contentY },
            className: "absolute bottom-16 sm:bottom-20 md:bottom-28 left-0 right-0 px-6 sm:px-0 sm:left-6 md:left-8 lg:left-12 xl:left-16 sm:right-auto flex flex-col items-center text-center sm:items-start sm:text-left max-w-2xl z-10 pb-2 sm:pb-0 pointer-events-none will-change-transform",
            children: [
              rating && /* @__PURE__ */ jsxDEV("div", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-subtle text-yellow-300 text-xs font-bold mb-3.5 shadow-md pointer-events-auto", children: [
                /* @__PURE__ */ jsxDEV(Star, { size: 13, className: "fill-yellow-400 text-yellow-400" }, void 0, false, {
                  fileName: "/app/applet/src/components/Movies.tsx",
                  lineNumber: 490,
                  columnNumber: 13
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: [
                  rating,
                  " Rating"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/Movies.tsx",
                  lineNumber: 491,
                  columnNumber: 13
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 489,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDEV("h1", { className: "text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg leading-tight transition-all duration-500", children: currentMovie.title }, void 0, false, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 494,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-white/80 text-sm md:text-base line-clamp-3 mb-6 font-normal drop-shadow leading-relaxed max-w-xl transition-all duration-500 pointer-events-auto", children: currentMovie.overview }, void 0, false, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 497,
                columnNumber: 9
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap justify-center sm:justify-start items-center gap-3 pointer-events-auto", children: [
                /* @__PURE__ */ jsxDEV(
                  GlassButton,
                  {
                    variant: "primary",
                    size: "md",
                    onClick: () => onSelect(currentMovie.id),
                    className: "cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsxDEV(Play, { size: 17, className: "fill-white" }, void 0, false, {
                        fileName: "/app/applet/src/components/Movies.tsx",
                        lineNumber: 509,
                        columnNumber: 13
                      }, this),
                      " Watch Options"
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/Movies.tsx",
                    lineNumber: 503,
                    columnNumber: 11
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  GlassButton,
                  {
                    variant: "secondary",
                    size: "md",
                    onClick: (e) => onToggleFavorite(e, currentMovie.id),
                    className: "cursor-pointer",
                    children: [
                      isFav ? /* @__PURE__ */ jsxDEV(Check, { size: 17, className: "text-green-400" }, void 0, false, {
                        fileName: "/app/applet/src/components/Movies.tsx",
                        lineNumber: 518,
                        columnNumber: 22
                      }, this) : /* @__PURE__ */ jsxDEV(Plus, { size: 17 }, void 0, false, {
                        fileName: "/app/applet/src/components/Movies.tsx",
                        lineNumber: 518,
                        columnNumber: 71
                      }, this),
                      isFav ? "Saved" : "Favorites"
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/Movies.tsx",
                    lineNumber: 512,
                    columnNumber: 11
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  GlassButton,
                  {
                    variant: "secondary",
                    size: "md",
                    onClick: () => onSelect(currentMovie.id),
                    className: "cursor-pointer !px-3",
                    "aria-label": "More Info",
                    children: /* @__PURE__ */ jsxDEV(Info, { size: 18, className: "text-white/80" }, void 0, false, {
                      fileName: "/app/applet/src/components/Movies.tsx",
                      lineNumber: 529,
                      columnNumber: 13
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/Movies.tsx",
                    lineNumber: 522,
                    columnNumber: 11
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 502,
                columnNumber: 9
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 484,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(motion.div, { style: { y: contentY }, className: "absolute bottom-6 md:bottom-12 left-0 right-0 sm:right-auto flex justify-center sm:justify-start sm:left-6 md:left-8 lg:left-12 xl:left-16 items-center gap-2 z-20 pointer-events-none will-change-transform", children: heroMovies.map((_, idx) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setActiveIndex(idx),
            className: `h-1.5 rounded-full transition-all duration-500 cursor-pointer pointer-events-auto ${idx === activeIndex ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"}`,
            "aria-label": `Go to slide ${idx + 1}`
          },
          idx,
          false,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 537,
            columnNumber: 11
          },
          this
        )) }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 535,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 430,
      columnNumber: 5
    },
    this
  );
});
function CategoryRow({ title, fetcher, onSelect, isFavorite, toggleFavorite, country }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }
    try {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      }, { rootMargin: "200px" });
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
    fetcher().then((res) => {
      if (isMounted) setShows(res?.shows || []);
    }).catch((err) => {
      console.error("CategoryRow fetch error:", err?.message || err);
    }).finally(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [fetcher, isInView]);
  const scroll = (dir) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: dir === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };
  if (loading || !isInView) {
    return /* @__PURE__ */ jsxDEV("div", { className: "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-4", ref: containerRef, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "h-6 w-48 bg-white/10 rounded-full animate-pulse" }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 605,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 overflow-hidden", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxDEV("div", { className: "w-[180px] flex-shrink-0", children: /* @__PURE__ */ jsxDEV(SkeletonCard, {}, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 608,
        columnNumber: 62
      }, this) }, i, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 608,
        columnNumber: 13
      }, this)) }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 606,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 604,
      columnNumber: 7
    }, this);
  }
  if (shows.length === 0) return null;
  return /* @__PURE__ */ jsxDEV("div", { className: "relative group px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16", ref: containerRef, children: [
    /* @__PURE__ */ jsxDEV("h3", { className: "text-lg sm:text-xl font-extrabold text-white mb-4 tracking-tight drop-shadow", children: title }, void 0, false, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 619,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => scroll("left"),
          className: "absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-24 glass-subtle rounded-r-2xl hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer",
          children: /* @__PURE__ */ jsxDEV(ChevronRight, { size: 24, className: "rotate-180 text-white" }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 626,
            columnNumber: 11
          }, this)
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 622,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { ref: scrollRef, className: "flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide snap-x py-4 -my-4 pl-1 pr-12", children: shows.map((show, index) => /* @__PURE__ */ jsxDEV("div", { className: "w-[140px] sm:w-[160px] md:w-[190px] lg:w-[220px] xl:w-[240px] flex-shrink-0 snap-start", children: /* @__PURE__ */ jsxDEV(
        MovieCard,
        {
          show,
          country,
          onClick: () => onSelect(show.id),
          isFavorite: isFavorite(show.id),
          onToggleFavorite: toggleFavorite
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 632,
          columnNumber: 15
        },
        this
      ) }, `${show.id}-${index}`, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 631,
        columnNumber: 13
      }, this)) }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 629,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => scroll("right"),
          className: "absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-24 glass-subtle rounded-l-2xl hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer",
          children: /* @__PURE__ */ jsxDEV(ChevronRight, { size: 24, className: "text-white" }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 647,
            columnNumber: 11
          }, this)
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 643,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 621,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/Movies.tsx",
    lineNumber: 618,
    columnNumber: 5
  }, this);
}
function PlatformRow({ platformId, type, country, onSelect, isFavorite, toggleFavorite, onSeeAll }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const p = PLATFORMS[platformId];
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }
    try {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      }, { rootMargin: "200px" });
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
    fetchFilters({ country, show_type: type, catalogs: p.providerId, order_by: "popularity_1week" }).then((res) => setShows(res.shows)).catch((err) => setError(err.message || "Failed to load")).finally(() => setLoading(false));
  }, [country, type, p.providerId, isInView]);
  useEffect(() => {
    loadData();
  }, [loadData]);
  const scroll = (dir) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: dir === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };
  if (loading || !isInView) {
    return /* @__PURE__ */ jsxDEV("div", { className: "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-4", ref: containerRef, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded-xl bg-white/10 animate-pulse" }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 714,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "h-5 w-40 bg-white/10 rounded-full animate-pulse" }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 715,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 713,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 overflow-hidden", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxDEV("div", { className: "w-[180px] flex-shrink-0", children: /* @__PURE__ */ jsxDEV(SkeletonCard, {}, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 719,
        columnNumber: 62
      }, this) }, i, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 719,
        columnNumber: 13
      }, this)) }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 717,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 712,
      columnNumber: 7
    }, this);
  }
  if (error || shows.length === 0) return null;
  return /* @__PURE__ */ jsxDEV("div", { className: "relative group px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16", ref: containerRef, children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxDEV(StreamingPlatformIcon, { platformId }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 732,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("div", { className: "text-[10px] text-white/50 uppercase font-bold tracking-wider mb-0.5", children: p.displayName }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 734,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h3", { className: "text-base sm:text-xl font-extrabold text-white tracking-tight", children: [
            "Top ",
            type === "movie" ? "Movies" : "Shows",
            " on ",
            p.displayName
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 735,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 733,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 731,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: onSeeAll,
          className: "text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1 group/btn glass-subtle px-3 py-1 rounded-full cursor-pointer transition-colors",
          children: [
            "See All ",
            /* @__PURE__ */ jsxDEV(ChevronRight, { size: 14, className: "group-hover/btn:translate-x-0.5 transition-transform" }, void 0, false, {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 744,
              columnNumber: 19
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 740,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 730,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => scroll("left"),
          className: "absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-24 glass-subtle rounded-r-2xl hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer",
          children: /* @__PURE__ */ jsxDEV(ChevronRight, { size: 24, className: "rotate-180 text-white" }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 753,
            columnNumber: 11
          }, this)
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 749,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { ref: scrollRef, className: "flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide snap-x py-4 -my-4 pl-1 pr-12", children: shows.slice(0, 12).map((show, index) => /* @__PURE__ */ jsxDEV("div", { className: "w-[140px] sm:w-[160px] md:w-[190px] lg:w-[220px] xl:w-[240px] flex-shrink-0 snap-start", children: /* @__PURE__ */ jsxDEV(
        MovieCard,
        {
          show,
          country,
          platformId,
          onClick: () => onSelect(show.id),
          isFavorite: isFavorite(show.id),
          onToggleFavorite: toggleFavorite
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 759,
          columnNumber: 15
        },
        this
      ) }, `${show.id}-${index}`, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 758,
        columnNumber: 13
      }, this)) }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 756,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => scroll("right"),
          className: "absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-24 glass-subtle rounded-l-2xl hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer",
          children: /* @__PURE__ */ jsxDEV(ChevronRight, { size: 24, className: "text-white" }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 775,
            columnNumber: 11
          }, this)
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 771,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 748,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/Movies.tsx",
    lineNumber: 729,
    columnNumber: 5
  }, this);
}
function PlatformPage({ platformId, type, country, onBack, onSelectMovie, isFavorite, toggleFavorite, hideHero }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(void 0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const p = PLATFORMS[platformId];
  const heroRef = useRef(null);
  const { imageScale, contentY } = usePullDownZoom(heroRef);
  const loadData = useCallback((reset = false) => {
    if (reset) setLoading(true);
    else setIsFetchingMore(true);
    fetchFilters({
      country,
      show_type: type,
      catalogs: p.providerId,
      order_by: "popularity_1week",
      cursor: reset ? void 0 : nextCursor
    }).then((res) => {
      setShows((prev) => reset ? res.shows : [...prev, ...res.shows]);
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
  const observer = useRef(null);
  const lastElementRef = useCallback((node) => {
    if (loading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
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
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen pb-28 md:pb-20", children: [
    !hideHero && (loading && shows.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "h-[55vh] md:h-[65vh] w-full bg-[#14161B] animate-pulse" }, void 0, false, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 838,
      columnNumber: 9
    }, this) : topShow && topPoster ? /* @__PURE__ */ jsxDEV(
      "div",
      {
        ref: heroRef,
        style: { touchAction: "pan-x pan-y", WebkitUserSelect: "none" },
        className: "relative h-[60vh] sm:h-[68vh] md:h-[75vh] w-full overflow-hidden gpu-layer group bg-black select-none",
        children: [
          /* @__PURE__ */ jsxDEV(
            motion.div,
            {
              className: "sticky top-0 inset-x-0 w-full h-full pointer-events-none will-change-transform",
              style: {
                scale: imageScale,
                transformOrigin: "50% 0%",
                WebkitTransformOrigin: "50% 0%"
              },
              children: [
                /* @__PURE__ */ jsxDEV(
                  "img",
                  {
                    src: topPoster,
                    alt: topShow.title,
                    decoding: "sync",
                    loading: "eager",
                    fetchPriority: "high",
                    className: "w-full h-full object-cover object-center scale-105 filter brightness-100 will-change-transform"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/Movies.tsx",
                    lineNumber: 854,
                    columnNumber: 13
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0F1113] via-[#0F1113]/60 via-35% to-transparent z-0" }, void 0, false, {
                  fileName: "/app/applet/src/components/Movies.tsx",
                  lineNumber: 863,
                  columnNumber: 13
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-r from-[#0F1113] via-[#0F1113]/60 via-30% to-transparent w-full md:w-2/3 z-0" }, void 0, false, {
                  fileName: "/app/applet/src/components/Movies.tsx",
                  lineNumber: 864,
                  columnNumber: 13
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent h-32 z-0" }, void 0, false, {
                  fileName: "/app/applet/src/components/Movies.tsx",
                  lineNumber: 865,
                  columnNumber: 13
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 846,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "absolute top-20 sm:top-24 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 z-30 pointer-events-auto", children: /* @__PURE__ */ jsxDEV(GlassButton, { variant: "secondary", size: "sm", onClick: onBack, className: "shadow-2xl", children: [
            /* @__PURE__ */ jsxDEV(ChevronLeft, { size: 16 }, void 0, false, {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 871,
              columnNumber: 15
            }, this),
            " Back to Catalog"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 870,
            columnNumber: 13
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 869,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            motion.div,
            {
              style: { y: contentY },
              className: "absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0 px-6 sm:px-0 sm:left-6 md:left-8 lg:left-12 xl:left-16 sm:right-auto flex flex-col items-center text-center sm:items-start sm:text-left max-w-2xl z-20 pb-2 sm:pb-0 pointer-events-none will-change-transform",
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap items-center gap-2.5 mb-3 pointer-events-auto", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full shadow-lg", children: [
                    /* @__PURE__ */ jsxDEV(StreamingPlatformIcon, { platformId, className: "w-5 h-5 rounded-md" }, void 0, false, {
                      fileName: "/app/applet/src/components/Movies.tsx",
                      lineNumber: 882,
                      columnNumber: 17
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-white uppercase tracking-wider", children: [
                      p.displayName,
                      " Spotlight"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/Movies.tsx",
                      lineNumber: 883,
                      columnNumber: 17
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/Movies.tsx",
                    lineNumber: 881,
                    columnNumber: 15
                  }, this),
                  topRating && /* @__PURE__ */ jsxDEV("div", { className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full glass-subtle text-yellow-300 text-xs font-bold shadow-md", children: [
                    /* @__PURE__ */ jsxDEV(Star, { size: 12, className: "fill-yellow-400 text-yellow-400" }, void 0, false, {
                      fileName: "/app/applet/src/components/Movies.tsx",
                      lineNumber: 888,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { children: topRating }, void 0, false, {
                      fileName: "/app/applet/src/components/Movies.tsx",
                      lineNumber: 889,
                      columnNumber: 19
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/Movies.tsx",
                    lineNumber: 887,
                    columnNumber: 17
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/Movies.tsx",
                  lineNumber: 880,
                  columnNumber: 13
                }, this),
                /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-lg leading-tight", children: topShow.title }, void 0, false, {
                  fileName: "/app/applet/src/components/Movies.tsx",
                  lineNumber: 894,
                  columnNumber: 13
                }, this),
                topShow.overview && /* @__PURE__ */ jsxDEV("p", { className: "text-white/80 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 mb-5 font-normal drop-shadow leading-relaxed max-w-xl pointer-events-auto", children: topShow.overview }, void 0, false, {
                  fileName: "/app/applet/src/components/Movies.tsx",
                  lineNumber: 899,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap justify-center sm:justify-start items-center gap-3 pointer-events-auto", children: [
                  /* @__PURE__ */ jsxDEV(
                    GlassButton,
                    {
                      variant: "primary",
                      size: "md",
                      onClick: () => onSelectMovie(topShow.id),
                      className: "cursor-pointer shadow-xl",
                      children: [
                        /* @__PURE__ */ jsxDEV(Play, { size: 17, className: "fill-white" }, void 0, false, {
                          fileName: "/app/applet/src/components/Movies.tsx",
                          lineNumber: 911,
                          columnNumber: 17
                        }, this),
                        " Watch Now"
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/Movies.tsx",
                      lineNumber: 905,
                      columnNumber: 15
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    GlassButton,
                    {
                      variant: "secondary",
                      size: "md",
                      onClick: (e) => toggleFavorite(e, topShow.id),
                      className: "cursor-pointer",
                      children: [
                        isTopFav ? /* @__PURE__ */ jsxDEV(Check, { size: 17, className: "text-green-400" }, void 0, false, {
                          fileName: "/app/applet/src/components/Movies.tsx",
                          lineNumber: 920,
                          columnNumber: 29
                        }, this) : /* @__PURE__ */ jsxDEV(Plus, { size: 17 }, void 0, false, {
                          fileName: "/app/applet/src/components/Movies.tsx",
                          lineNumber: 920,
                          columnNumber: 78
                        }, this),
                        isTopFav ? "Saved" : "Add to Favorites"
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/Movies.tsx",
                      lineNumber: 914,
                      columnNumber: 15
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/Movies.tsx",
                  lineNumber: 904,
                  columnNumber: 13
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 876,
              columnNumber: 11
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 840,
        columnNumber: 9
      },
      this
    ) : /* @__PURE__ */ jsxDEV("div", { className: "pt-20 md:pt-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto", children: [
      /* @__PURE__ */ jsxDEV(GlassButton, { variant: "secondary", size: "sm", onClick: onBack, className: "mb-6 md:mb-8", children: [
        /* @__PURE__ */ jsxDEV(ChevronLeft, { size: 16 }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 929,
          columnNumber: 13
        }, this),
        " Back to Catalog"
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 928,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4 mb-8", children: [
        /* @__PURE__ */ jsxDEV(StreamingPlatformIcon, { platformId, className: "w-14 h-14 sm:w-16 sm:h-16 text-xl rounded-2xl shadow-2xl" }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 932,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h1", { className: "text-2xl sm:text-3xl font-extrabold text-white tracking-tight", children: p.displayName }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 934,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-white/60 text-sm sm:text-base", children: [
            "Top ",
            type === "movie" ? "Movies" : "TV Shows"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 935,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 933,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 931,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 927,
      columnNumber: 9
    }, this)),
    /* @__PURE__ */ jsxDEV("div", { className: "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto pt-8", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxDEV(StreamingPlatformIcon, { platformId, className: "w-8 h-8 rounded-xl" }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 944,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h2", { className: "text-xl sm:text-2xl font-extrabold text-white tracking-tight", children: [
            "All ",
            p.displayName,
            " ",
            type === "movie" ? "Movies" : "TV Shows"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 946,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xs sm:text-sm text-white/50", children: [
            "Curated stream catalog for ",
            country.toUpperCase()
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 949,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 945,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 943,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 942,
        columnNumber: 9
      }, this),
      loading && shows.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6", children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ jsxDEV(SkeletonCard, {}, i, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 959,
        columnNumber: 15
      }, this)) }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 957,
        columnNumber: 11
      }, this) : shows.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "text-center text-white/50 py-20", children: [
        "No content available for ",
        p.displayName,
        " in this region."
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 963,
        columnNumber: 11
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 content-auto", children: [
        shows.map((show, index) => {
          const isLast = index === shows.length - 1;
          return /* @__PURE__ */ jsxDEV("div", { ref: isLast ? lastElementRef : null, children: /* @__PURE__ */ jsxDEV(
            MovieCard,
            {
              show,
              country,
              platformId,
              onClick: () => onSelectMovie(show.id),
              isFavorite: isFavorite(show.id),
              onToggleFavorite: toggleFavorite
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 970,
              columnNumber: 19
            },
            this
          ) }, `${show.id}-${index}`, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 969,
            columnNumber: 17
          }, this);
        }),
        isFetchingMore && /* @__PURE__ */ jsxDEV("div", { className: "col-span-full flex justify-center py-8", children: /* @__PURE__ */ jsxDEV(Loader2, { className: "w-8 h-8 animate-spin text-amber-500" }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 983,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 982,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 965,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 941,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/Movies.tsx",
    lineNumber: 835,
    columnNumber: 5
  }, this);
}
const SkeletonCard = React.memo(function SkeletonCard2() {
  return /* @__PURE__ */ jsxDEV(
    motion.div,
    {
      initial: { opacity: 0.5 },
      animate: { opacity: [0.5, 1, 0.5] },
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
      className: "aspect-[2/3] w-full bg-white/5 rounded-3xl overflow-hidden relative shadow-lg",
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1002,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-3 left-3 right-3 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "h-4 w-3/4 bg-white/10 rounded-full" }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1004,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "h-3 w-1/2 bg-white/10 rounded-full" }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1005,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1003,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 996,
      columnNumber: 5
    },
    this
  );
});
const MovieCard = React.memo(function MovieCard2({
  show,
  platformId,
  country = "us",
  onClick,
  isFavorite,
  onToggleFavorite
}) {
  const fallback = show.imageSet?.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";
  const vPoster = show.imageSet?.verticalPoster;
  const srcSet = vPoster ? [
    vPoster.w240 ? `${vPoster.w240} 240w` : null,
    vPoster.w360 ? `${vPoster.w360} 360w` : null,
    vPoster.w480 ? `${vPoster.w480} 480w` : null,
    vPoster.w600 ? `${vPoster.w600} 600w` : null
  ].filter(Boolean).join(", ") : void 0;
  const poster = vPoster?.w480 || vPoster?.w360 || fallback;
  const resolvedPlatform = useMemo(() => resolvePlatform(platformId, show, country), [platformId, show, country]);
  const rawRating = show.rating;
  const ratingValue = rawRating ? rawRating > 10 ? rawRating / 10 : rawRating : null;
  const formattedRating = ratingValue ? ratingValue.toFixed(1) : null;
  const releaseYear = show.releaseYear || show.first_air_date?.split("-")[0] || show.release_date?.split("-")[0] || null;
  return /* @__PURE__ */ jsxDEV(
    motion.div,
    {
      onClick,
      style: { borderRadius: "24px" },
      className: "group/card relative aspect-[2/3] w-full overflow-hidden cursor-pointer glass-subtle border border-white/15 hover:border-white/35 transition-all duration-250 transform hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between gpu-layer will-change-transform",
      children: [
        /* @__PURE__ */ jsxDEV(
          "img",
          {
            src: poster,
            srcSet,
            sizes: "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw",
            alt: show.title,
            decoding: "async",
            loading: "lazy",
            className: "absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105 will-change-transform bg-[#14161C]"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1051,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none z-20" }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1062,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "relative z-10 p-2.5 flex items-start justify-between gap-1 pointer-events-none", children: [
          resolvedPlatform ? /* @__PURE__ */ jsxDEV(PlatformBadge, { platform: resolvedPlatform, className: "pointer-events-auto shadow-lg" }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1067,
            columnNumber: 11
          }, this) : /* @__PURE__ */ jsxDEV(GlassPill, { variant: "subtle", size: "xs", className: "pointer-events-auto shadow-md", children: show.showType === "series" ? "TV" : "Movie" }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1069,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                onToggleFavorite(e, show.id);
              },
              className: `pointer-events-auto w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 border shadow-md cursor-pointer ${isFavorite ? "bg-red-500 text-white border-red-400 opacity-100 shadow-[0_0_12px_rgba(239,68,68,0.5)]" : "bg-black/60 text-white/90 border-white/20 hover:bg-white hover:text-black opacity-0 group-hover/card:opacity-100"}`,
              title: isFavorite ? "Remove from Favorites" : "Add to Favorites",
              children: isFavorite ? /* @__PURE__ */ jsxDEV(Check, { size: 13, className: "stroke-[3]" }, void 0, false, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1086,
                columnNumber: 25
              }, this) : /* @__PURE__ */ jsxDEV(Plus, { size: 14 }, void 0, false, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1086,
                columnNumber: 70
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 1074,
              columnNumber: 9
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1065,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "relative z-10 pt-16 pb-3.5 px-3.5 bg-gradient-to-t from-[#080A0E] via-[#080A0E]/80 via-50% to-transparent flex flex-col justify-end", children: [
          /* @__PURE__ */ jsxDEV("h4", { className: "font-bold text-white text-xs sm:text-sm line-clamp-1 mb-1 tracking-tight group-hover/card:text-amber-500 transition-colors drop-shadow", children: show.title }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1092,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between text-xs text-white/70", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1.5 text-xs text-white/60 font-medium", children: [
              releaseYear && /* @__PURE__ */ jsxDEV("span", { className: "text-white/90 font-semibold", children: releaseYear }, void 0, false, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1098,
                columnNumber: 29
              }, this),
              show.runtime && /* @__PURE__ */ jsxDEV("span", { children: [
                "• ",
                show.runtime,
                "m"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1099,
                columnNumber: 30
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 1097,
              columnNumber: 11
            }, this),
            formattedRating && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1 text-yellow-400 font-bold text-xs", children: [
              /* @__PURE__ */ jsxDEV(Star, { size: 11, className: "fill-yellow-400 text-yellow-400" }, void 0, false, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1104,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV("span", { children: formattedRating }, void 0, false, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1105,
                columnNumber: 15
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 1103,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1096,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1091,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1045,
      columnNumber: 5
    },
    this
  );
});
const GenreIcon = React.memo(function GenreIcon2({ name, size = 20, className = "" }) {
  const IconMap = { Flame, Compass, Clapperboard, Laugh: Smile, Fingerprint, Camera, Star, Users, Wand2, Landmark, Skull, Music, Search, Heart, Rocket, Zap, Shield, Baby, Newspaper, Tv, Sparkles, Mic };
  const Icon = IconMap[name] || Film;
  return /* @__PURE__ */ jsxDEV(Icon, { size, className }, void 0, false, {
    fileName: "/app/applet/src/components/Movies.tsx",
    lineNumber: 1117,
    columnNumber: 10
  }, this);
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
  onBack
}) {
  const backdropImage = selectedGenre.movieId && genreImages[`movie_${selectedGenre.movieId}`] || selectedGenre.tvId && genreImages[`tv_${selectedGenre.tvId}`] || selectedGenre.image || DEFAULT_GENRE_IMAGES[`movie_${selectedGenre.movieId}`] || DEFAULT_GENRE_IMAGES[`tv_${selectedGenre.tvId}`];
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen pb-28 md:pb-20", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "relative overflow-hidden border-b border-white/10 bg-[#0E1015] py-8 sm:py-12", children: [
      backdropImage && /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 pointer-events-none opacity-20 filter blur-2xl transform scale-110", children: /* @__PURE__ */ jsxDEV(
        "img",
        {
          src: backdropImage,
          alt: selectedGenre.name,
          decoding: "async",
          loading: "lazy",
          className: "w-full h-full object-cover"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1149,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1148,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-b from-[#0E1015]/80 via-[#0E1015]/95 to-[#0E1015] pointer-events-none" }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1158,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "mb-6", children: /* @__PURE__ */ jsxDEV(GlassButton, { variant: "secondary", size: "sm", onClick: onBack, className: "shadow-lg", children: [
          /* @__PURE__ */ jsxDEV(ChevronLeft, { size: 16 }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1164,
            columnNumber: 15
          }, this),
          " Back to All Genres"
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1163,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1162,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4 sm:gap-5", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_8px_24px_rgba(0,0,0,0.5)] shrink-0", children: /* @__PURE__ */ jsxDEV(GenreIcon, { name: selectedGenre.iconName, size: 30, className: "text-amber-500 drop-shadow-md" }, void 0, false, {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 1171,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 1170,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h1", { className: "text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none drop-shadow-md mb-1.5", children: selectedGenre.name }, void 0, false, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1174,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs sm:text-sm text-white/60 font-medium tracking-wide max-w-xl", children: selectedGenre.description }, void 0, false, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1177,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 1173,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1169,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 self-start md:self-auto shadow-md", children: ["all", "movie", "series"].map((t, index) => {
            const label = t === "all" ? "All" : t === "movie" ? "Movies" : "TV Series";
            const active = genreTypeFilter === t;
            return /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => handleSetGenreType(t),
                className: `px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${active ? "bg-amber-500 text-black shadow-md font-bold" : "text-white/60 hover:text-white hover:bg-white/5"}`,
                children: label
              },
              `${t}-${index}`,
              false,
              {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1189,
                columnNumber: 19
              },
              this
            );
          }) }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1184,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1168,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1160,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1145,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto pt-8", children: loading && shows.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 content-auto", children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ jsxDEV(SkeletonCard, {}, i, false, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1212,
      columnNumber: 15
    }, this)) }, void 0, false, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1210,
      columnNumber: 11
    }, this) : shows.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-20 text-white/50", children: "No titles found in this category." }, void 0, false, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1216,
      columnNumber: 11
    }, this) : /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 content-auto", children: [
      shows.map((show, index) => {
        const isLast = index === shows.length - 1;
        return /* @__PURE__ */ jsxDEV("div", { ref: isLast ? lastElementRef : null, children: /* @__PURE__ */ jsxDEV(
          MovieCard,
          {
            show,
            country,
            platformId: void 0,
            onClick: () => onSelectMovie(show.id),
            isFavorite: isFavorite(show.id),
            onToggleFavorite: toggleFavorite
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1223,
            columnNumber: 19
          },
          this
        ) }, `${show.id}-${index}`, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1222,
          columnNumber: 17
        }, this);
      }),
      isFetchingMore && /* @__PURE__ */ jsxDEV("div", { className: "col-span-full flex justify-center py-8", children: /* @__PURE__ */ jsxDEV(Loader2, { className: "w-8 h-8 animate-spin text-amber-500" }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1236,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1235,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1218,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1208,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/Movies.tsx",
    lineNumber: 1143,
    columnNumber: 5
  }, this);
}
function SearchPage({ country, searchQuery, setSearchQuery, onSelectMovie, isFavorite, toggleFavorite }) {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreImages] = useState(DEFAULT_GENRE_IMAGES);
  const [searchTypeFilter, setSearchTypeFilter] = useState("all");
  const [searchSort, setSearchSort] = useState("default");
  const [searchMinRating, setSearchMinRating] = useState(0);
  const [searchGenreFilter, setSearchGenreFilter] = useState(null);
  const syncGenreFromUrl = useCallback(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const typeParam = searchParams.get("type");
    if (typeParam === "movie" || typeParam === "series" || typeParam === "all") {
      setGenreTypeFilter(typeParam);
    } else if (typeParam === "tv") {
      setGenreTypeFilter("series");
    }
    if (path.startsWith("/genre/")) {
      const slug = path.split("/")[2];
      if (slug) {
        const cat = GENRE_LIST.find((g) => g.id === slug);
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
    window.addEventListener("popstate", syncGenreFromUrl);
    return () => window.removeEventListener("popstate", syncGenreFromUrl);
  }, [syncGenreFromUrl]);
  const handleSelectGenre = (genre) => {
    setSelectedGenre(genre);
    setGenreTypeFilter("all");
    window.history.pushState({}, "", `/genre/${genre.id}`);
  };
  const [genreTypeFilter, setGenreTypeFilter] = useState("all");
  const handleSetGenreType = (type) => {
    setGenreTypeFilter(type);
    if (selectedGenre) {
      window.history.pushState({}, "", `/genre/${selectedGenre.id}?type=${type}`);
    }
  };
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(void 0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const activeAbortRef = useRef(null);
  useEffect(() => {
    if (searchQuery?.trim()) {
      setSelectedGenre(null);
    }
  }, [searchQuery]);
  const searchMemCache = useRef(/* @__PURE__ */ new Map());
  const loadData = useCallback((reset = false) => {
    const isSearch = !!searchQuery?.trim();
    if (!isSearch && !selectedGenre) {
      setShows([]);
      setLoading(false);
      return;
    }
    const cacheKey = isSearch ? `search_${searchQuery.trim().toLowerCase()}_${searchTypeFilter}_${searchGenreFilter?.id || "all"}_${country}_${reset ? "init" : nextCursor || ""}` : `genre_${selectedGenre?.id}_${genreTypeFilter}_${country}_${reset ? "init" : nextCursor || ""}`;
    if (reset && searchMemCache.current.has(cacheKey)) {
      const cached = searchMemCache.current.get(cacheKey);
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
        show_type: searchTypeFilter === "all" ? void 0 : searchTypeFilter,
        cursor: reset ? void 0 : nextCursor,
        ...activeGenre ? { movie_genre: activeGenre.movieId, tv_genre: activeGenre.tvId } : {}
      }, currentController?.signal).then((res) => {
        setShows((prev) => {
          const updated = reset ? res.shows : [...prev, ...res.shows];
          searchMemCache.current.set(cacheKey, { shows: updated, hasMore: res.hasMore, nextCursor: res.nextCursor });
          return updated;
        });
        setHasMore(res.hasMore);
        setNextCursor(res.nextCursor);
      }).catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Search error:", err);
        }
      }).finally(() => {
        setLoading(false);
        setIsFetchingMore(false);
      });
    } else if (selectedGenre) {
      fetchByGenre(selectedGenre.movieId, selectedGenre.tvId, genreTypeFilter, country, reset ? void 0 : nextCursor).then((res) => {
        setShows((prev) => {
          const updated = reset ? res.shows : [...prev, ...res.shows];
          searchMemCache.current.set(cacheKey, { shows: updated, hasMore: res.hasMore, nextCursor: res.nextCursor });
          return updated;
        });
        setHasMore(res.hasMore);
        setNextCursor(res.nextCursor);
      }).catch(console.error).finally(() => {
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
  const processedShows = useMemo(() => {
    let result = [...shows];
    if (searchMinRating > 0) {
      result = result.filter((s) => (s.rating || 0) >= searchMinRating);
    }
    if (searchSort === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (searchSort === "newest") {
      result.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
    }
    return result;
  }, [shows, searchMinRating, searchSort]);
  const observer = useRef(null);
  const lastElementRef = useCallback((node) => {
    if (loading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadData(false);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, isFetchingMore, hasMore, loadData]);
  const isSearchActive = !!searchQuery?.trim();
  return /* @__PURE__ */ jsxDEV("div", { className: "pt-20 md:pt-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto min-h-screen pb-28 md:pb-20", children: isSearchActive ? /* @__PURE__ */ jsxDEV("div", { children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDEV(Search, { size: 22, className: "text-amber-500" }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1444,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("h2", { className: "text-xl sm:text-2xl font-bold tracking-tight text-white", children: [
            "Results for ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-amber-500", children: [
              '"',
              searchQuery,
              '"'
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 1446,
              columnNumber: 31
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1445,
            columnNumber: 17
          }, this),
          !loading && /* @__PURE__ */ jsxDEV("span", { className: "text-xs bg-white/10 text-white/70 px-2.5 py-0.5 rounded-full font-medium", children: [
            processedShows.length,
            " ",
            processedShows.length === 1 ? "title" : "titles"
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1449,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1443,
          columnNumber: 15
        }, this),
        searchGenreFilter && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 mt-1.5", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-white/50", children: "Filtered by:" }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1456,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "inline-flex items-center gap-1 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full", children: [
            searchGenreFilter.name,
            /* @__PURE__ */ jsxDEV("button", { onClick: () => setSearchGenreFilter(null), className: "hover:text-white ml-0.5", children: /* @__PURE__ */ jsxDEV(X, { size: 12 }, void 0, false, {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 1460,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 1459,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1457,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1455,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1442,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center bg-white/5 border border-white/10 rounded-full p-0.5 text-xs", children: ["all", "movie", "series"].map((t, index) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setSearchTypeFilter(t),
            className: `px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${searchTypeFilter === t ? "bg-amber-500 text-black font-semibold" : "text-white/60 hover:text-white"}`,
            children: t === "all" ? "All" : t === "movie" ? "Movies" : "TV Shows"
          },
          `${t}-${index}`,
          false,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1472,
            columnNumber: 19
          },
          this
        )) }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1470,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center bg-white/5 border border-white/10 rounded-full p-0.5 text-xs", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setSearchSort("default"),
              className: `px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${searchSort === "default" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"}`,
              children: "Best Match"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 1486,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setSearchSort("rating"),
              className: `px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${searchSort === "rating" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"}`,
              children: "Top Rated"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 1494,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setSearchSort("newest"),
              className: `px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${searchSort === "newest" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"}`,
              children: "Newest"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/Movies.tsx",
              lineNumber: 1502,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1485,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setSearchMinRating((prev) => prev === 0 ? 70 : prev === 70 ? 80 : 0),
            className: `px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${searchMinRating > 0 ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-white/5 text-white/60 border-white/10 hover:text-white"}`,
            title: "Filter by rating",
            children: [
              /* @__PURE__ */ jsxDEV(Star, { size: 12, className: searchMinRating > 0 ? "fill-amber-400 text-amber-400" : "" }, void 0, false, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1522,
                columnNumber: 17
              }, this),
              searchMinRating === 0 ? "Any Rating" : `${searchMinRating}%+ Only`
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1513,
            columnNumber: 15
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => {
              setSearchQuery?.("");
              setSearchGenreFilter(null);
              setSearchMinRating(0);
              setSearchSort("default");
            },
            className: "text-xs text-white/60 hover:text-white flex items-center gap-1 glass-subtle px-3 py-1.5 rounded-full cursor-pointer transition-colors",
            children: [
              /* @__PURE__ */ jsxDEV(X, { size: 13 }, void 0, false, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1535,
                columnNumber: 17
              }, this),
              "Clear"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1526,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1468,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1441,
      columnNumber: 11
    }, this),
    loading && shows.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 content-auto", children: Array.from({ length: 12 }).map((_, i) => /* @__PURE__ */ jsxDEV(SkeletonCard, {}, i, false, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1544,
      columnNumber: 15
    }, this)) }, void 0, false, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1542,
      columnNumber: 13
    }, this) : processedShows.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-20 glass-subtle rounded-3xl p-8 max-w-lg mx-auto", children: [
      /* @__PURE__ */ jsxDEV(Search, { size: 40, className: "mx-auto text-white/20 mb-3" }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1549,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-medium text-white mb-1", children: "No matches found" }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1550,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-white/50 max-w-md mx-auto mb-6", children: [
        `We couldn't find any results matching "`,
        searchQuery,
        '" with the current filters.'
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1551,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-amber-400 font-semibold uppercase tracking-wider", children: "Popular searches you might like" }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1555,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap justify-center gap-2", children: ["Dune", "Arcane", "Avengers", "Stranger Things", "Spider-Man", "Deadpool", "Fallout", "Oppenheimer"].map((t, index) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setSearchQuery?.(t),
            className: "px-3 py-1 text-xs bg-white/5 hover:bg-white/15 text-white/80 rounded-full border border-white/10 transition-colors cursor-pointer",
            children: t
          },
          `${t}-${index}`,
          false,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1560,
            columnNumber: 21
          },
          this
        )) }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1558,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "pt-2", children: /* @__PURE__ */ jsxDEV(
          GlassButton,
          {
            variant: "primary",
            onClick: () => {
              setSearchQuery?.("");
              setSearchGenreFilter(null);
              setSearchMinRating(0);
            },
            children: "Browse All Genres"
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1570,
            columnNumber: 19
          },
          this
        ) }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1569,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1554,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1548,
      columnNumber: 13
    }, this) : /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 pb-20 content-auto", children: [
      processedShows.map((show, index) => {
        const isLast = index === processedShows.length - 1;
        return /* @__PURE__ */ jsxDEV("div", { ref: isLast ? lastElementRef : null, children: /* @__PURE__ */ jsxDEV(
          MovieCard,
          {
            show,
            country,
            platformId: void 0,
            onClick: () => onSelectMovie(show.id),
            isFavorite: isFavorite(show.id),
            onToggleFavorite: toggleFavorite
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1589,
            columnNumber: 21
          },
          this
        ) }, `${show.id}-${index}`, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1588,
          columnNumber: 19
        }, this);
      }),
      isFetchingMore && /* @__PURE__ */ jsxDEV("div", { className: "col-span-full flex justify-center py-8", children: /* @__PURE__ */ jsxDEV(Loader2, { className: "w-8 h-8 animate-spin text-amber-500" }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1602,
        columnNumber: 19
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1601,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1584,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/Movies.tsx",
    lineNumber: 1439,
    columnNumber: 9
  }, this) : selectedGenre ? (
    /* Case 2: Selected Genre View with Pull-Down Zoom & Stretch Hero */
    /* @__PURE__ */ jsxDEV(
      GenreCatalogueView,
      {
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
        onBack: () => {
          setSelectedGenre(null);
          window.history.pushState({}, "", "/");
        }
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1610,
        columnNumber: 9
      },
      this
    )
  ) : (
    /* Case 3: Initial Search View -> Shows Genres Grid */
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-2 h-2 rounded-full bg-amber-500 animate-pulse" }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1630,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold uppercase tracking-widest text-amber-500", children: "Explore Catalog" }, void 0, false, {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1631,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1629,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow", children: "Browse by Genre" }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1633,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-xs sm:text-sm text-white/50 mt-1", children: "Select a category to discover curated movies, acclaimed series, and top trending releases." }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1636,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1628,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 pb-20 content-auto", children: GENRE_LIST.map((genre) => {
        return /* @__PURE__ */ jsxDEV(
          "div",
          {
            onClick: () => handleSelectGenre(genre),
            className: `group relative h-44 rounded-3xl overflow-hidden cursor-pointer border border-white/15 bg-[#15171C] transition-all duration-250 transform hover:-translate-y-1 hover:shadow-2xl ${"hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]"} gpu-layer will-change-transform`,
            children: [
              /* @__PURE__ */ jsxDEV(
                "img",
                {
                  src: genre.movieId && genreImages[`movie_${genre.movieId}`] || genre.tvId && genreImages[`tv_${genre.tvId}`] || genre.image || DEFAULT_GENRE_IMAGES[`movie_${genre.movieId}`] || DEFAULT_GENRE_IMAGES[`tv_${genre.tvId}`],
                  alt: genre.name,
                  loading: "lazy",
                  decoding: "async",
                  className: "absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-60 group-hover:opacity-85 will-change-transform"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/Movies.tsx",
                  lineNumber: 1651,
                  columnNumber: 19
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" }, void 0, false, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1660,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" }, void 0, false, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1661,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 rounded-3xl border border-white/15 group-hover:border-white/35 transition-colors pointer-events-none" }, void 0, false, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1664,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" }, void 0, false, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1665,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "relative z-10 h-full p-5 flex flex-col justify-between", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "w-11 h-11 rounded-2xl glass-medium border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200", children: /* @__PURE__ */ jsxDEV(GenreIcon, { name: genre.iconName, size: 20, className: "text-white drop-shadow-md" }, void 0, false, {
                    fileName: "/app/applet/src/components/Movies.tsx",
                    lineNumber: 1672,
                    columnNumber: 25
                  }, this) }, void 0, false, {
                    fileName: "/app/applet/src/components/Movies.tsx",
                    lineNumber: 1671,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded-full glass-subtle group-hover:glass-medium flex items-center justify-center transition-all duration-200", children: /* @__PURE__ */ jsxDEV(ChevronRight, { size: 16, className: "text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-transform" }, void 0, false, {
                    fileName: "/app/applet/src/components/Movies.tsx",
                    lineNumber: 1675,
                    columnNumber: 25
                  }, this) }, void 0, false, {
                    fileName: "/app/applet/src/components/Movies.tsx",
                    lineNumber: 1674,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/Movies.tsx",
                  lineNumber: 1670,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-extrabold text-white tracking-tight group-hover:text-white transition-colors", children: genre.name }, void 0, false, {
                    fileName: "/app/applet/src/components/Movies.tsx",
                    lineNumber: 1681,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-white/70 line-clamp-2 mt-1 font-medium leading-relaxed", children: genre.description }, void 0, false, {
                    fileName: "/app/applet/src/components/Movies.tsx",
                    lineNumber: 1684,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/Movies.tsx",
                  lineNumber: 1680,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/Movies.tsx",
                lineNumber: 1668,
                columnNumber: 19
              }, this)
            ]
          },
          genre.id,
          true,
          {
            fileName: "/app/applet/src/components/Movies.tsx",
            lineNumber: 1645,
            columnNumber: 17
          },
          this
        );
      }) }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1642,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1627,
      columnNumber: 9
    }, this)
  ) }, void 0, false, {
    fileName: "/app/applet/src/components/Movies.tsx",
    lineNumber: 1436,
    columnNumber: 5
  }, this);
}
function ParamountView({ country, onSelectMovie, isFavorite, toggleFavorite }) {
  const [activeTab, setActiveTab] = useState("movie");
  return /* @__PURE__ */ jsxDEV("div", { className: "w-full pt-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto min-h-screen", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsxDEV(StreamingPlatformIcon, { platformId: "paramount", className: "w-16 h-16 rounded-2xl shadow-2xl" }, void 0, false, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1706,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl font-extrabold text-white tracking-tight", children: "Paramount+" }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1708,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-white/60", children: "United States Catalog" }, void 0, false, {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1709,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1707,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1705,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4 mb-8", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setActiveTab("movie"),
          className: `px-6 py-2 rounded-full font-semibold transition-colors ${activeTab === "movie" ? "bg-[#0064FF] text-white shadow-[0_0_20px_rgba(0,100,255,0.4)]" : "bg-white/10 text-white/70 hover:text-white"}`,
          children: "Movies"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1714,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setActiveTab("series"),
          className: `px-6 py-2 rounded-full font-semibold transition-colors ${activeTab === "series" ? "bg-[#0064FF] text-white shadow-[0_0_20px_rgba(0,100,255,0.4)]" : "bg-white/10 text-white/70 hover:text-white"}`,
          children: "TV Shows"
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/Movies.tsx",
          lineNumber: 1720,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1713,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 xl:-mx-16", children: /* @__PURE__ */ jsxDEV(
      PlatformPage,
      {
        platformId: "paramount",
        type: activeTab,
        country: "US",
        onBack: () => {
        },
        onSelectMovie,
        isFavorite,
        toggleFavorite,
        hideHero: true
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/Movies.tsx",
        lineNumber: 1729,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "/app/applet/src/components/Movies.tsx",
      lineNumber: 1728,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/Movies.tsx",
    lineNumber: 1704,
    columnNumber: 5
  }, this);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vdmllcy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlTWVtbywgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBQbGF5LCBTZWFyY2gsIEZpbG0sIFR2LCBDaGV2cm9uUmlnaHQsIENoZXZyb25MZWZ0LCBMb2FkZXIyLCBTdGFyLCBYLCBDaGVjaywgRXh0ZXJuYWxMaW5rLCBSYWRpbywgQm9va21hcmssIEZsYW1lLCBTcGFya2xlcywgTGF1Z2gsIFNrdWxsLCBXYW5kMiwgSGVhcnQsIFVzZXJzLCBTaGllbGQsIE11c2ljLCBDbGFwcGVyYm9hcmQsIFBsdXMsIENvbXBhc3MsIFNtaWxlLCBGaW5nZXJwcmludCwgQ2FtZXJhLCBMYW5kbWFyaywgUm9ja2V0LCBaYXAsIEJhYnksIE5ld3NwYXBlciwgTWljLCBJbmZvIH0gZnJvbSAnbHVjaWRlLXJlYWN0JztcbmltcG9ydCB7IG1vdGlvbiwgQW5pbWF0ZVByZXNlbmNlLCB1c2VNb3Rpb25WYWx1ZSwgdXNlVHJhbnNmb3JtIH0gZnJvbSAnbW90aW9uL3JlYWN0JztcbmltcG9ydCB7IFNob3csIGZldGNoRmlsdGVycywgc2VhcmNoVGl0bGUsIGZldGNoU2hvd0RldGFpbHMsIGZldGNoQnlHZW5yZSB9IGZyb20gJy4uL2xpYi90bWRiJztcbmltcG9ydCB7IEdFTlJFUywgR0VOUkVfTElTVCwgREVGQVVMVF9HRU5SRV9JTUFHRVMsIFVuaWZpZWRHZW5yZSB9IGZyb20gJy4uL2xpYi9nZW5yZXMnO1xuXG5pbXBvcnQgeyBQTEFURk9STVMsIFN0cmVhbWluZ1BsYXRmb3JtSWNvbiwgcmVzb2x2ZVBsYXRmb3JtLCBQbGF0Zm9ybUJhZGdlIH0gZnJvbSAnLi4vbGliL3BsYXRmb3Jtcyc7XG5pbXBvcnQgeyBHbGFzc0J1dHRvbiwgR2xhc3NQaWxsLCBHbGFzc0NvbnRhaW5lciB9IGZyb20gJy4vbGlxdWlkLWdsYXNzJztcbmltcG9ydCB7IGxhenksIFN1c3BlbnNlIH0gZnJvbSAncmVhY3QnO1xuY29uc3QgV2F0Y2hNb2RhbCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL1dhdGNoTW9kYWwnKS50aGVuKG1vZHVsZSA9PiAoeyBkZWZhdWx0OiBtb2R1bGUuV2F0Y2hNb2RhbCB9KSkpO1xuaW1wb3J0IHsgQ29udGludWVXYXRjaGluZ1JvdyB9IGZyb20gJy4vQ29udGludWVXYXRjaGluZ1Jvdyc7XG5pbXBvcnQgeyBGb290ZXIgfSBmcm9tICcuL0Zvb3Rlcic7XG5pbXBvcnQgeyB1c2VFbGFzdGljT3ZlcnNjcm9sbCB9IGZyb20gJy4uL2hvb2tzL3VzZUVsYXN0aWNPdmVyc2Nyb2xsJztcbmltcG9ydCB7IHVzZVB1bGxEb3duWm9vbSB9IGZyb20gJy4uL2hvb2tzL3VzZVB1bGxEb3duWm9vbSc7XG5cbmltcG9ydCB7IEZsb2F0aW5nTmF2IH0gZnJvbSAnLi9GbG9hdGluZ05hdic7XG5cbmludGVyZmFjZSBNb3ZpZXNQcm9wcyB7XG4gIG9uQmFjazogKCkgPT4gdm9pZDtcbiAgb25OYXZpZ2F0ZT86ICh2aWV3OiBzdHJpbmcpID0+IHZvaWQ7XG4gIG9uT3BlbkNvb2tpZXM/OiAoKSA9PiB2b2lkO1xuICBvbk9wZW5Qcml2YWN5PzogKCkgPT4gdm9pZDtcbiAgb25PcGVuVGVybXM/OiAoKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTW92aWVzKHsgb25CYWNrLCBvbk5hdmlnYXRlLCBvbk9wZW5Db29raWVzLCBvbk9wZW5Qcml2YWN5LCBvbk9wZW5UZXJtcyB9OiBNb3ZpZXNQcm9wcykge1xuICBjb25zdCBbYWN0aXZlVGFiLCBzZXRBY3RpdmVUYWJdID0gdXNlU3RhdGU8J21vdmllcycgfCAndHYnIHwgJ2Zhdm9yaXRlcycgfCAnc2VhcmNoJyB8ICdwYXJhbW91bnQnPignbW92aWVzJyk7XG4gIGNvbnN0IFthY3RpdmVQbGF0Zm9ybSwgc2V0QWN0aXZlUGxhdGZvcm1dID0gdXNlU3RhdGU8eyBpZDogc3RyaW5nLCB0eXBlOiAnbW92aWUnIHwgJ3NlcmllcycgfSB8IG51bGw+KG51bGwpO1xuICBcbiAgY29uc3QgY291bnRyeSA9ICd1cyc7XG4gIFxuICBjb25zdCBbaGVyb01vdmllcywgc2V0SGVyb01vdmllc10gPSB1c2VTdGF0ZTxTaG93W10+KFtdKTtcbiAgY29uc3QgW2hlcm9UVnMsIHNldEhlcm9UVnNdID0gdXNlU3RhdGU8U2hvd1tdPihbXSk7XG4gIGNvbnN0IFtpc1NlYXJjaEV4cGFuZGVkLCBzZXRJc1NlYXJjaEV4cGFuZGVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3NlYXJjaFF1ZXJ5LCBzZXRTZWFyY2hRdWVyeV0gPSB1c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtzZWxlY3RlZE1vdmllSWQsIHNldFNlbGVjdGVkTW92aWVJZF0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcbiAgXG4gIGNvbnN0IFtmYXZvcml0ZXMsIHNldEZhdm9yaXRlc10gPSB1c2VTdGF0ZTxzdHJpbmdbXT4oKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzYXZlZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdqYW10dl9mYXZvcml0ZXMnKTtcbiAgICAgIHJldHVybiBzYXZlZCA/IEpTT04ucGFyc2Uoc2F2ZWQpIDogW107XG4gICAgfSBjYXRjaCAoXykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2phbXR2X2Zhdm9yaXRlcycsIEpTT04uc3RyaW5naWZ5KGZhdm9yaXRlcykpO1xuICAgIH0gY2F0Y2ggKF8pIHt9XG4gIH0sIFtmYXZvcml0ZXNdKTtcblxuICBjb25zdCBpc0Zhdm9yaXRlID0gdXNlQ2FsbGJhY2soKGlkOiBzdHJpbmcpID0+IGZhdm9yaXRlcy5pbmNsdWRlcyhpZCksIFtmYXZvcml0ZXNdKTtcblxuICBjb25zdCB0b2dnbGVGYXZvcml0ZSA9IHVzZUNhbGxiYWNrKChlOiBSZWFjdC5Nb3VzZUV2ZW50LCBpZDogc3RyaW5nKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBzZXRGYXZvcml0ZXMocHJldiA9PiBwcmV2LmluY2x1ZGVzKGlkKSA/IHByZXYuZmlsdGVyKGYgPT4gZiAhPT0gaWQpIDogWy4uLnByZXYsIGlkXSk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBoYW5kbGVTZWxlY3RNb3ZpZSA9IHVzZUNhbGxiYWNrKChpZDogc3RyaW5nKSA9PiB7XG4gICAgc2V0U2VsZWN0ZWRNb3ZpZUlkKGlkKTtcbiAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyBtb2RhbE9wZW46IHRydWUsIGlkIH0sICcnLCBgI3RpdGxlPSR7aWR9YCk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBoYW5kbGVDbG9zZU1vZGFsID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmICh3aW5kb3cuaGlzdG9yeS5zdGF0ZT8ubW9kYWxPcGVuKSB7XG4gICAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKCk7IC8vIExldCB0aGUgcG9wc3RhdGUgbGlzdGVuZXIgaGFuZGxlIHNldHRpbmcgc2VsZWN0ZWRNb3ZpZUlkIHRvIG51bGxcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0U2VsZWN0ZWRNb3ZpZUlkKG51bGwpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaGFuZGxlUG9wU3RhdGUgPSAoZTogUG9wU3RhdGVFdmVudCkgPT4ge1xuICAgICAgaWYgKCFlLnN0YXRlPy5tb2RhbE9wZW4pIHtcbiAgICAgICAgc2V0U2VsZWN0ZWRNb3ZpZUlkKG51bGwpO1xuICAgICAgfSBlbHNlIGlmIChlLnN0YXRlPy5pZCkge1xuICAgICAgICBzZXRTZWxlY3RlZE1vdmllSWQoZS5zdGF0ZS5pZCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBoYW5kbGVQb3BTdGF0ZSk7XG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGhhbmRsZVBvcFN0YXRlKTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJtaW4taC1zY3JlZW4gYmctWyMwRjExMTNdIHRleHQtWyNGNEY1RjddIG92ZXJmbG93LXgtaGlkZGVuIGZvbnQtc2FucyBwYi02IG1kOnBiLTAgc2VsZWN0LW5vbmVcIj5cbiAgICAgIDxGbG9hdGluZ05hdlxuICAgICAgICBvbkJhY2s9e29uQmFja31cbiAgICAgICAgYWN0aXZlVGFiPXthY3RpdmVUYWJ9XG4gICAgICAgIHNldEFjdGl2ZVRhYj17KHRhYikgPT4ge1xuICAgICAgICAgIHNldEFjdGl2ZVRhYih0YWIpO1xuICAgICAgICAgIHNldEFjdGl2ZVBsYXRmb3JtKG51bGwpO1xuICAgICAgICB9fVxuICAgICAgICBpc1NlYXJjaEV4cGFuZGVkPXtpc1NlYXJjaEV4cGFuZGVkfVxuICAgICAgICBzZXRJc1NlYXJjaEV4cGFuZGVkPXtzZXRJc1NlYXJjaEV4cGFuZGVkfVxuICAgICAgICBzZWFyY2hRdWVyeT17c2VhcmNoUXVlcnl9XG4gICAgICAgIHNldFNlYXJjaFF1ZXJ5PXtzZXRTZWFyY2hRdWVyeX1cbiAgICAgICAgb25OYXZpZ2F0ZT17b25OYXZpZ2F0ZX1cbiAgICAgICAgb25TZWxlY3RNb3ZpZT17aGFuZGxlU2VsZWN0TW92aWV9XG4gICAgICAgIGZhdm9yaXRlc0NvdW50PXtmYXZvcml0ZXMubGVuZ3RofVxuICAgICAgLz5cblxuICAgICAgPEFuaW1hdGVQcmVzZW5jZSBtb2RlPVwid2FpdFwiPlxuICAgICAgICB7YWN0aXZlUGxhdGZvcm0gPyAoXG4gICAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICAgIGtleT17YHBsYXRmb3JtLSR7YWN0aXZlUGxhdGZvcm0uaWR9YH1cbiAgICAgICAgICAgIGluaXRpYWw9e3sgb3BhY2l0eTogMCwgeDogMjAgfX1cbiAgICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSwgeDogMCB9fVxuICAgICAgICAgICAgZXhpdD17eyBvcGFjaXR5OiAwLCB4OiAtMjAgfX1cbiAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuMyB9fVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8UGxhdGZvcm1QYWdlIFxuICAgICAgICAgICAgICBwbGF0Zm9ybUlkPXthY3RpdmVQbGF0Zm9ybS5pZH0gXG4gICAgICAgICAgICAgIHR5cGU9e2FjdGl2ZVBsYXRmb3JtLnR5cGV9IFxuICAgICAgICAgICAgICBjb3VudHJ5PXtjb3VudHJ5fSBcbiAgICAgICAgICAgICAgb25CYWNrPXsoKSA9PiBzZXRBY3RpdmVQbGF0Zm9ybShudWxsKX0gXG4gICAgICAgICAgICAgIG9uU2VsZWN0TW92aWU9e2hhbmRsZVNlbGVjdE1vdmllfVxuICAgICAgICAgICAgICBpc0Zhdm9yaXRlPXtpc0Zhdm9yaXRlfVxuICAgICAgICAgICAgICB0b2dnbGVGYXZvcml0ZT17dG9nZ2xlRmF2b3JpdGV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbW90aW9uLmRpdj5cbiAgICAgICAgKSA6IGFjdGl2ZVRhYiA9PT0gJ3BhcmFtb3VudCcgPyAoXG4gICAgICAgICAgPG1vdGlvbi5kaXZcbiAgICAgICAgICAgIGtleT1cInBhcmFtb3VudFwiXG4gICAgICAgICAgICBpbml0aWFsPXt7IG9wYWNpdHk6IDAsIHg6IDIwIH19XG4gICAgICAgICAgICBhbmltYXRlPXt7IG9wYWNpdHk6IDEsIHg6IDAgfX1cbiAgICAgICAgICAgIGV4aXQ9e3sgb3BhY2l0eTogMCwgeDogLTIwIH19XG4gICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjMgfX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFBhcmFtb3VudFZpZXdcbiAgICAgICAgICAgICAgY291bnRyeT17Y291bnRyeX1cbiAgICAgICAgICAgICAgb25TZWxlY3RNb3ZpZT17aGFuZGxlU2VsZWN0TW92aWV9XG4gICAgICAgICAgICAgIGlzRmF2b3JpdGU9e2lzRmF2b3JpdGV9XG4gICAgICAgICAgICAgIHRvZ2dsZUZhdm9yaXRlPXt0b2dnbGVGYXZvcml0ZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9tb3Rpb24uZGl2PlxuICAgICAgICApIDogYWN0aXZlVGFiID09PSAnc2VhcmNoJyA/IChcbiAgICAgICAgICA8bW90aW9uLmRpdlxuICAgICAgICAgICAga2V5PVwic2VhcmNoXCJcbiAgICAgICAgICAgIGluaXRpYWw9e3sgb3BhY2l0eTogMCwgeDogMjAgfX1cbiAgICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSwgeDogMCB9fVxuICAgICAgICAgICAgZXhpdD17eyBvcGFjaXR5OiAwLCB4OiAtMjAgfX1cbiAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuMyB9fVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8U2VhcmNoUGFnZSBcbiAgICAgICAgICAgICAgY291bnRyeT17Y291bnRyeX0gXG4gICAgICAgICAgICAgIHNlYXJjaFF1ZXJ5PXtzZWFyY2hRdWVyeX0gXG4gICAgICAgICAgICAgIHNldFNlYXJjaFF1ZXJ5PXtzZXRTZWFyY2hRdWVyeX1cbiAgICAgICAgICAgICAgb25TZWxlY3RNb3ZpZT17aGFuZGxlU2VsZWN0TW92aWV9IFxuICAgICAgICAgICAgICBpc0Zhdm9yaXRlPXtpc0Zhdm9yaXRlfSBcbiAgICAgICAgICAgICAgdG9nZ2xlRmF2b3JpdGU9e3RvZ2dsZUZhdm9yaXRlfSBcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9tb3Rpb24uZGl2PlxuICAgICAgICApIDogYWN0aXZlVGFiID09PSAnbW92aWVzJyA/IChcbiAgICAgICAgICA8bW90aW9uLmRpdlxuICAgICAgICAgICAga2V5PVwibW92aWVzXCJcbiAgICAgICAgICAgIGluaXRpYWw9e3sgb3BhY2l0eTogMCwgeDogMjAgfX1cbiAgICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSwgeDogMCB9fVxuICAgICAgICAgICAgZXhpdD17eyBvcGFjaXR5OiAwLCB4OiAtMjAgfX1cbiAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuMyB9fVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8TW92aWVzVmlldyBcbiAgICAgICAgICAgICAgY291bnRyeT17Y291bnRyeX0gXG4gICAgICAgICAgICAgIGhlcm9Nb3ZpZXM9e2hlcm9Nb3ZpZXN9IFxuICAgICAgICAgICAgICBzZXRIZXJvTW92aWVzPXtzZXRIZXJvTW92aWVzfSBcbiAgICAgICAgICAgICAgb25TZWxlY3RNb3ZpZT17aGFuZGxlU2VsZWN0TW92aWV9XG4gICAgICAgICAgICAgIGlzRmF2b3JpdGU9e2lzRmF2b3JpdGV9XG4gICAgICAgICAgICAgIHRvZ2dsZUZhdm9yaXRlPXt0b2dnbGVGYXZvcml0ZX1cbiAgICAgICAgICAgICAgb25TZWVBbGw9eyhpZDogc3RyaW5nLCB0eXBlOiBhbnkpID0+IHNldEFjdGl2ZVBsYXRmb3JtKHsgaWQsIHR5cGUgfSl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvbW90aW9uLmRpdj5cbiAgICAgICAgKSA6IGFjdGl2ZVRhYiA9PT0gJ3R2JyA/IChcbiAgICAgICAgICA8bW90aW9uLmRpdlxuICAgICAgICAgICAga2V5PVwidHZcIlxuICAgICAgICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwLCB4OiAyMCB9fVxuICAgICAgICAgICAgYW5pbWF0ZT17eyBvcGFjaXR5OiAxLCB4OiAwIH19XG4gICAgICAgICAgICBleGl0PXt7IG9wYWNpdHk6IDAsIHg6IC0yMCB9fVxuICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC4zIH19XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGxcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxUVlNob3dzVmlldyBcbiAgICAgICAgICAgICAgY291bnRyeT17Y291bnRyeX0gXG4gICAgICAgICAgICAgIGhlcm9UVnM9e2hlcm9UVnN9XG4gICAgICAgICAgICAgIHNldEhlcm9UVnM9e3NldEhlcm9UVnN9XG4gICAgICAgICAgICAgIG9uU2VsZWN0TW92aWU9e2hhbmRsZVNlbGVjdE1vdmllfVxuICAgICAgICAgICAgICBpc0Zhdm9yaXRlPXtpc0Zhdm9yaXRlfVxuICAgICAgICAgICAgICB0b2dnbGVGYXZvcml0ZT17dG9nZ2xlRmF2b3JpdGV9XG4gICAgICAgICAgICAgIG9uU2VlQWxsPXsoaWQ6IHN0cmluZywgdHlwZTogYW55KSA9PiBzZXRBY3RpdmVQbGF0Zm9ybSh7IGlkLCB0eXBlIH0pfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgICAgICkgOiBhY3RpdmVUYWIgPT09ICdmYXZvcml0ZXMnID8gKFxuICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICBrZXk9XCJmYXZvcml0ZXNcIlxuICAgICAgICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwLCB4OiAyMCB9fVxuICAgICAgICAgICAgYW5pbWF0ZT17eyBvcGFjaXR5OiAxLCB4OiAwIH19XG4gICAgICAgICAgICBleGl0PXt7IG9wYWNpdHk6IDAsIHg6IC0yMCB9fVxuICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC4zIH19XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGxcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHQtMjAgbWQ6cHQtMzIgcHgtNCBzbTpweC02IG1kOnB4LTggbGc6cHgtMTIgeGw6cHgtMTYgbWF4LXctWzE2MDBweF0gbXgtYXV0byBtaW4taC1zY3JlZW4gcGItMjggbWQ6cGItMjBcIj5cbiAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtMnhsIHNtOnRleHQtM3hsIGZvbnQtZXh0cmFib2xkIG1iLTYgdGV4dC13aGl0ZSBkcm9wLXNoYWRvd1wiPllvdXIgRmF2b3JpdGVzPC9oMj5cbiAgICAgICAgICB7ZmF2b3JpdGVzLmxlbmd0aCA+IDAgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgc206Z3JpZC1jb2xzLTMgbWQ6Z3JpZC1jb2xzLTQgbGc6Z3JpZC1jb2xzLTUgeGw6Z3JpZC1jb2xzLTYgZ2FwLTMgc206Z2FwLTUgY29udGVudC1hdXRvXCI+XG4gICAgICAgICAgICAgIHtmYXZvcml0ZXMubWFwKChpZCwgaW5kZXgpID0+IChcbiAgICAgICAgICAgICAgICA8RmF2b3JpdGVJdGVtIFxuICAgICAgICAgICAgICAgICAga2V5PXtgJHtpZH0tJHtpbmRleH1gfSBcbiAgICAgICAgICAgICAgICAgIGlkPXtpZH0gXG4gICAgICAgICAgICAgICAgICBjb3VudHJ5PXtjb3VudHJ5fSBcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgaGFuZGxlU2VsZWN0TW92aWUoaWQpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIH19IFxuICAgICAgICAgICAgICAgICAgaXNGYXZvcml0ZT17dHJ1ZX0gXG4gICAgICAgICAgICAgICAgICBvblRvZ2dsZUZhdm9yaXRlPXt0b2dnbGVGYXZvcml0ZX0gXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciB0ZXh0LXdoaXRlLzUwIHB5LTIwIGdsYXNzLXN1YnRsZSBwLTEyIHJvdW5kZWQtM3hsIG1heC13LWxnIG14LWF1dG9cIj5cbiAgICAgICAgICAgICAgPEJvb2ttYXJrIHNpemU9ezQwfSBjbGFzc05hbWU9XCJteC1hdXRvIHRleHQtd2hpdGUvMjAgbWItM1wiIC8+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImZvbnQtc2VtaWJvbGQgdGV4dC13aGl0ZS83MFwiPllvdSBoYXZlbid0IGFkZGVkIGFueSBmYXZvcml0ZXMgeWV0LjwvcD5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXdoaXRlLzQwIG10LTFcIj5DbGljayB0aGUgKyBidXR0b24gb24gYW55IHRpdGxlIHRvIHNhdmUgaXQgaGVyZS48L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9BbmltYXRlUHJlc2VuY2U+XG5cbiAgICAgIDxGb290ZXIgb25PcGVuQ29va2llcz17b25PcGVuQ29va2llc30gb25PcGVuUHJpdmFjeT17b25PcGVuUHJpdmFjeX0gb25PcGVuVGVybXM9e29uT3BlblRlcm1zfSAvPlxuXG4gICAgICB7LyogV2F0Y2ggJiBQbGF5YmFjayBNb2RhbCAtIExpcXVpZCBHbGFzcyB3aXRoIENpbmVTcmMgUGxheWVyICovfVxuICAgICAgPEFuaW1hdGVQcmVzZW5jZT5cbiAgICAgICAgICAgICAgICB7c2VsZWN0ZWRNb3ZpZUlkICYmIChcbiAgICAgICAgICA8U3VzcGVuc2UgZmFsbGJhY2s9e251bGx9PjxXYXRjaE1vZGFsIGtleT17c2VsZWN0ZWRNb3ZpZUlkfSBvblNlbGVjdFJlbGF0ZWQ9e2hhbmRsZVNlbGVjdE1vdmllfSBcbiAgICAgICAgICAgICBzaG93SWQ9e3NlbGVjdGVkTW92aWVJZH0gXG4gICAgICAgICAgICAgY291bnRyeT17Y291bnRyeX0gXG4gICAgICAgICAgICAgb25DbG9zZT17aGFuZGxlQ2xvc2VNb2RhbH0gXG4gICAgICAgICAgICAgaXNGYXZvcml0ZT17aXNGYXZvcml0ZShzZWxlY3RlZE1vdmllSWQpfVxuICAgICAgICAgICAgb25Ub2dnbGVGYXZvcml0ZT17dG9nZ2xlRmF2b3JpdGV9XG4gICAgICAgICAgLz48L1N1c3BlbnNlPlxuICAgICAgICApfVxuICAgICAgPC9BbmltYXRlUHJlc2VuY2U+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmNvbnN0IEZhdm9yaXRlSXRlbSA9IFJlYWN0Lm1lbW8oZnVuY3Rpb24gRmF2b3JpdGVJdGVtKHsgaWQsIGNvdW50cnksIG9uQ2xpY2ssIGlzRmF2b3JpdGUsIG9uVG9nZ2xlRmF2b3JpdGUgfTogeyBpZDogc3RyaW5nLCBjb3VudHJ5OiBzdHJpbmcsIG9uQ2xpY2s6ICgpID0+IHZvaWQsIGlzRmF2b3JpdGU6IGJvb2xlYW4sIG9uVG9nZ2xlRmF2b3JpdGU6IGFueSB9KSB7XG4gIGNvbnN0IFtzaG93LCBzZXRTaG93XSA9IHVzZVN0YXRlPFNob3cgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcbiAgICBmZXRjaFNob3dEZXRhaWxzKGlkLCBjb3VudHJ5KVxuICAgICAgLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICBpZiAoaXNNb3VudGVkKSB7XG4gICAgICAgICAgc2V0U2hvdyhyZXMpO1xuICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgaWYgKGlzTW91bnRlZCkgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICB9KTtcbiAgICByZXR1cm4gKCkgPT4geyBpc01vdW50ZWQgPSBmYWxzZTsgfTtcbiAgfSwgW2lkLCBjb3VudHJ5XSk7XG5cbiAgaWYgKGxvYWRpbmcpIHtcbiAgICByZXR1cm4gPFNrZWxldG9uQ2FyZCAvPjtcbiAgfVxuXG4gIFxuXG4gIGlmICghc2hvdykgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuIChcbiAgICA8TW92aWVDYXJkIFxuICAgICAgc2hvdz17c2hvd30gXG4gICAgICBjb3VudHJ5PXtjb3VudHJ5fVxuICAgICAgb25DbGljaz17b25DbGlja30gXG4gICAgICBpc0Zhdm9yaXRlPXtpc0Zhdm9yaXRlfSBcbiAgICAgIG9uVG9nZ2xlRmF2b3JpdGU9e29uVG9nZ2xlRmF2b3JpdGV9IFxuICAgIC8+XG4gICk7XG59KTtcblxuZnVuY3Rpb24gTW92aWVzVmlldyh7IGNvdW50cnksIGhlcm9Nb3ZpZXMsIHNldEhlcm9Nb3ZpZXMsIG9uU2VsZWN0TW92aWUsIGlzRmF2b3JpdGUsIHRvZ2dsZUZhdm9yaXRlLCBvblNlZUFsbCB9OiBhbnkpIHtcbiAgY29uc3QgdHJlbmRpbmdGZXRjaGVyID0gdXNlQ2FsbGJhY2soKCkgPT4gZmV0Y2hGaWx0ZXJzKHsgY291bnRyeSwgc2hvd190eXBlOiAnbW92aWUnLCBvcmRlcl9ieTogJ3RvcF9yYXRlZCcgfSksIFtjb3VudHJ5XSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMTJcIj5cbiAgICAgIDxIZXJvQmFubmVyIFxuICAgICAgICBjb3VudHJ5PXtjb3VudHJ5fSBcbiAgICAgICAgdHlwZT1cIm1vdmllXCIgXG4gICAgICAgIGhlcm9Nb3ZpZXM9e2hlcm9Nb3ZpZXN9IFxuICAgICAgICBzZXRIZXJvTW92aWVzPXtzZXRIZXJvTW92aWVzfSBcbiAgICAgICAgb25TZWxlY3Q9e29uU2VsZWN0TW92aWV9IFxuICAgICAgICBpc0Zhdm9yaXRlPXtpc0Zhdm9yaXRlfVxuICAgICAgICBvblRvZ2dsZUZhdm9yaXRlPXt0b2dnbGVGYXZvcml0ZX1cbiAgICAgIC8+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0xMCByZWxhdGl2ZSB6LTIwIHBiLTIwIC1tdC0xMCBtZDotbXQtMjBcIj5cbiAgICAgICAgPENvbnRpbnVlV2F0Y2hpbmdSb3cgb25TZWxlY3Q9e29uU2VsZWN0TW92aWV9IGZpbHRlclR5cGU9XCJtb3ZpZVwiIC8+XG5cbiAgICAgICAgPENhdGVnb3J5Um93IFxuICAgICAgICAgIHRpdGxlPVwiVG9wIFJhdGVkIE1vdmllc1wiIFxuICAgICAgICAgIGZldGNoZXI9e3RyZW5kaW5nRmV0Y2hlcn0gXG4gICAgICAgICAgb25TZWxlY3Q9e29uU2VsZWN0TW92aWV9IFxuICAgICAgICAgIGlzRmF2b3JpdGU9e2lzRmF2b3JpdGV9XG4gICAgICAgICAgdG9nZ2xlRmF2b3JpdGU9e3RvZ2dsZUZhdm9yaXRlfVxuICAgICAgICAgIGNvdW50cnk9e2NvdW50cnl9XG4gICAgICAgIC8+XG5cbiAgICAgICAge09iamVjdC5rZXlzKFBMQVRGT1JNUykubWFwKHBsYXRmb3JtSWQgPT4gKFxuICAgICAgICAgIDxQbGF0Zm9ybVJvdyBcbiAgICAgICAgICAgIGtleT17cGxhdGZvcm1JZH1cbiAgICAgICAgICAgIHBsYXRmb3JtSWQ9e3BsYXRmb3JtSWR9XG4gICAgICAgICAgICB0eXBlPVwibW92aWVcIlxuICAgICAgICAgICAgY291bnRyeT17Y291bnRyeX1cbiAgICAgICAgICAgIG9uU2VsZWN0PXtvblNlbGVjdE1vdmllfVxuICAgICAgICAgICAgaXNGYXZvcml0ZT17aXNGYXZvcml0ZX1cbiAgICAgICAgICAgIHRvZ2dsZUZhdm9yaXRlPXt0b2dnbGVGYXZvcml0ZX1cbiAgICAgICAgICAgIG9uU2VlQWxsPXsoKSA9PiBvblNlZUFsbChwbGF0Zm9ybUlkLCAnbW92aWUnKX1cbiAgICAgICAgICAvPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5mdW5jdGlvbiBUVlNob3dzVmlldyh7IGNvdW50cnksIGhlcm9UVnMsIHNldEhlcm9UVnMsIG9uU2VsZWN0TW92aWUsIGlzRmF2b3JpdGUsIHRvZ2dsZUZhdm9yaXRlLCBvblNlZUFsbCB9OiBhbnkpIHtcbiAgY29uc3QgdHJlbmRpbmdGZXRjaGVyID0gdXNlQ2FsbGJhY2soKCkgPT4gZmV0Y2hGaWx0ZXJzKHsgY291bnRyeSwgc2hvd190eXBlOiAnc2VyaWVzJywgb3JkZXJfYnk6ICd0b3BfcmF0ZWQnIH0pLCBbY291bnRyeV0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTEyXCI+XG4gICAgICA8SGVyb0Jhbm5lciBcbiAgICAgICAgY291bnRyeT17Y291bnRyeX0gXG4gICAgICAgIHR5cGU9XCJzZXJpZXNcIiBcbiAgICAgICAgaGVyb01vdmllcz17aGVyb1RWc30gXG4gICAgICAgIHNldEhlcm9Nb3ZpZXM9e3NldEhlcm9UVnN9IFxuICAgICAgICBvblNlbGVjdD17b25TZWxlY3RNb3ZpZX0gXG4gICAgICAgIGlzRmF2b3JpdGU9e2lzRmF2b3JpdGV9XG4gICAgICAgIG9uVG9nZ2xlRmF2b3JpdGU9e3RvZ2dsZUZhdm9yaXRlfVxuICAgICAgLz5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTEwIHJlbGF0aXZlIHotMjAgcGItMjAgLW10LTEwIG1kOi1tdC0yMFwiPlxuICAgICAgICA8Q29udGludWVXYXRjaGluZ1JvdyBvblNlbGVjdD17b25TZWxlY3RNb3ZpZX0gZmlsdGVyVHlwZT1cInR2XCIgLz5cblxuICAgICAgICA8Q2F0ZWdvcnlSb3cgXG4gICAgICAgICAgdGl0bGU9XCJUb3AgUmF0ZWQgVFYgU2VyaWVzXCIgXG4gICAgICAgICAgZmV0Y2hlcj17dHJlbmRpbmdGZXRjaGVyfSBcbiAgICAgICAgICBvblNlbGVjdD17b25TZWxlY3RNb3ZpZX0gXG4gICAgICAgICAgaXNGYXZvcml0ZT17aXNGYXZvcml0ZX1cbiAgICAgICAgICB0b2dnbGVGYXZvcml0ZT17dG9nZ2xlRmF2b3JpdGV9XG4gICAgICAgICAgY291bnRyeT17Y291bnRyeX1cbiAgICAgICAgLz5cblxuICAgICAgICB7T2JqZWN0LmtleXMoUExBVEZPUk1TKS5tYXAocGxhdGZvcm1JZCA9PiAoXG4gICAgICAgICAgPFBsYXRmb3JtUm93IFxuICAgICAgICAgICAga2V5PXtwbGF0Zm9ybUlkfVxuICAgICAgICAgICAgcGxhdGZvcm1JZD17cGxhdGZvcm1JZH1cbiAgICAgICAgICAgIHR5cGU9XCJzZXJpZXNcIlxuICAgICAgICAgICAgY291bnRyeT17Y291bnRyeX1cbiAgICAgICAgICAgIG9uU2VsZWN0PXtvblNlbGVjdE1vdmllfVxuICAgICAgICAgICAgaXNGYXZvcml0ZT17aXNGYXZvcml0ZX1cbiAgICAgICAgICAgIHRvZ2dsZUZhdm9yaXRlPXt0b2dnbGVGYXZvcml0ZX1cbiAgICAgICAgICAgIG9uU2VlQWxsPXsoKSA9PiBvblNlZUFsbChwbGF0Zm9ybUlkLCAnc2VyaWVzJyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuY29uc3QgSGVyb0Jhbm5lciA9IFJlYWN0Lm1lbW8oZnVuY3Rpb24gSGVyb0Jhbm5lcih7IGNvdW50cnksIHR5cGUsIGhlcm9Nb3ZpZXMsIHNldEhlcm9Nb3ZpZXMsIG9uU2VsZWN0LCBpc0Zhdm9yaXRlLCBvblRvZ2dsZUZhdm9yaXRlIH06IGFueSkge1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSghaGVyb01vdmllcyB8fCBoZXJvTW92aWVzLmxlbmd0aCA9PT0gMCk7XG4gIGNvbnN0IFthY3RpdmVJbmRleCwgc2V0QWN0aXZlSW5kZXhdID0gdXNlU3RhdGUoMCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcbiAgICBpZiAoIWhlcm9Nb3ZpZXMgfHwgaGVyb01vdmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGZldGNoRmlsdGVycyh7IGNvdW50cnksIHNob3dfdHlwZTogdHlwZSwgb3JkZXJfYnk6ICdwb3B1bGFyaXR5XzF3ZWVrJyB9KS50aGVuKHJlcyA9PiB7XG4gICAgICAgIGlmIChpc01vdW50ZWQgJiYgcmVzPy5zaG93cz8ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNldEhlcm9Nb3ZpZXMocmVzLnNob3dzLnNsaWNlKDAsIDUpKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkhlcm9CYW5uZXIgZmV0Y2ggZXJyb3I6XCIsIGVycj8ubWVzc2FnZSB8fCBlcnIpO1xuICAgICAgfSkuZmluYWxseSgoKSA9PiB7XG4gICAgICAgIGlmIChpc01vdW50ZWQpIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiAoKSA9PiB7IGlzTW91bnRlZCA9IGZhbHNlOyB9O1xuICB9LCBbY291bnRyeSwgdHlwZSwgaGVyb01vdmllcywgc2V0SGVyb01vdmllc10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFoZXJvTW92aWVzIHx8IGhlcm9Nb3ZpZXMubGVuZ3RoIDw9IDEpIHJldHVybjtcbiAgICBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHNldEFjdGl2ZUluZGV4KChjdXJyZW50KSA9PiAoY3VycmVudCArIDEpICUgaGVyb01vdmllcy5sZW5ndGgpO1xuICAgIH0sIDYwMDApO1xuICAgIHJldHVybiAoKSA9PiBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgfSwgW2hlcm9Nb3ZpZXMsIGFjdGl2ZUluZGV4XSk7XG5cbiAgY29uc3QgeyBkcmFnWCwgc2NhbGU6IHN3aXBlU2NhbGUsIGhhbmRsZURyYWdFbmQgfSA9IHVzZUVsYXN0aWNPdmVyc2Nyb2xsKHtcbiAgICBhY3RpdmVJbmRleCxcbiAgICBpdGVtQ291bnQ6IGhlcm9Nb3ZpZXM/Lmxlbmd0aCB8fCAwLFxuICAgIG9uU3dpcGVMZWZ0OiAoKSA9PiBzZXRBY3RpdmVJbmRleChpID0+IGkgKyAxKSxcbiAgICBvblN3aXBlUmlnaHQ6ICgpID0+IHNldEFjdGl2ZUluZGV4KGkgPT4gaSAtIDEpLFxuICB9KTtcblxuICBjb25zdCBjb250YWluZXJSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpO1xuICBjb25zdCB7IGltYWdlU2NhbGUsIGNvbnRlbnRZIH0gPSB1c2VQdWxsRG93blpvb20oY29udGFpbmVyUmVmKTtcblxuICBpZiAobG9hZGluZykge1xuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImgtWzcwdmhdIG1kOmgtWzgwdmhdIHctZnVsbCBiZy1bIzE0MTYxQl0gYW5pbWF0ZS1wdWxzZVwiIC8+O1xuICB9XG5cbiAgaWYgKCFoZXJvTW92aWVzIHx8IGhlcm9Nb3ZpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7IC8vIEZhbGxiYWNrIHNvIHdlIGRvbid0IGNyYXNoIG9yIHNwaW4gZm9yZXZlclxuICB9XG5cbiAgY29uc3QgY3VycmVudE1vdmllID0gaGVyb01vdmllc1thY3RpdmVJbmRleF07XG4gIGNvbnN0IHJhdGluZyA9IGN1cnJlbnRNb3ZpZS5yYXRpbmcgPyAoY3VycmVudE1vdmllLnJhdGluZyAvIDEwKS50b0ZpeGVkKDEpIDogbnVsbDtcbiAgY29uc3QgaXNGYXYgPSBpc0Zhdm9yaXRlKGN1cnJlbnRNb3ZpZS5pZCk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IFxuICAgICAgcmVmPXtjb250YWluZXJSZWZ9XG4gICAgICBzdHlsZT17eyB0b3VjaEFjdGlvbjogJ3Bhbi14IHBhbi15JywgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnIH19XG4gICAgICBjbGFzc05hbWU9XCJyZWxhdGl2ZSBoLVs5MnZoXSBtZDpoLVs5MHZoXSB3LWZ1bGwgb3ZlcmZsb3ctaGlkZGVuIGdwdS1sYXllciBncm91cCBiZy1ibGFjayBzZWxlY3Qtbm9uZVwiXG4gICAgPlxuICAgICAgey8qIDEuIFN0aWNreSBIZXJvIEltYWdlIExheWVyIChGaXJtbHkgYW5jaG9yZWQgYXQgdG9wIDAsIGV4cGFuZHMgcHJvcG9ydGlvbmFsbHkgZG93bndhcmQgd2l0aG91dCBkaXN0b3J0aW9uKSAqL31cbiAgICAgIDxtb3Rpb24uZGl2IFxuICAgICAgICBjbGFzc05hbWU9XCJzdGlja3kgdG9wLTAgaW5zZXQteC0wIHctZnVsbCBoLWZ1bGwgcG9pbnRlci1ldmVudHMtbm9uZSB3aWxsLWNoYW5nZS10cmFuc2Zvcm1cIlxuICAgICAgICBzdHlsZT17eyBcbiAgICAgICAgICBzY2FsZTogaW1hZ2VTY2FsZSxcbiAgICAgICAgICB0cmFuc2Zvcm1PcmlnaW46ICc1MCUgMCUnLFxuICAgICAgICAgIFdlYmtpdFRyYW5zZm9ybU9yaWdpbjogJzUwJSAwJScsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgZHJhZz1cInhcIlxuICAgICAgICAgIGRyYWdDb25zdHJhaW50cz17eyBsZWZ0OiAwLCByaWdodDogMCB9fVxuICAgICAgICAgIGRyYWdFbGFzdGljPXswLjJ9XG4gICAgICAgICAgb25EcmFnRW5kPXtoYW5kbGVEcmFnRW5kfVxuICAgICAgICAgIHN0eWxlPXt7IHg6IGRyYWdYLCBzY2FsZTogc3dpcGVTY2FsZSwgdG91Y2hBY3Rpb246ICdwYW4teCBwYW4teScgfX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIHctZnVsbCBoLWZ1bGwgY3Vyc29yLWdyYWIgYWN0aXZlOmN1cnNvci1ncmFiYmluZyBwb2ludGVyLWV2ZW50cy1hdXRvXCJcbiAgICAgICAgPlxuICAgICAgICAgIHsvKiBCYWNrZ3JvdW5kIFBvc3RlcnMgd2l0aCBjcm9zcy1mYWRlICovfVxuICAgICAgICAgIHtoZXJvTW92aWVzLm1hcCgobW92aWU6IGFueSwgaWR4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhQb3N0ZXIgPSBtb3ZpZS5pbWFnZVNldD8uaG9yaXpvbnRhbFBvc3RlcjtcbiAgICAgICAgICAgIGNvbnN0IGJnID0gaFBvc3Rlcj8udzEwODAgfHwgaFBvc3Rlcj8ub3JpZ2luYWwgfHwgaFBvc3Rlcj8udzcyMCB8fCBtb3ZpZS5pbWFnZVNldD8ucG9zdGVyO1xuICAgICAgICAgICAgY29uc3Qgc3JjU2V0ID0gaFBvc3RlciA/IFtcbiAgICAgICAgICAgICAgaFBvc3Rlci53NDgwID8gYCR7aFBvc3Rlci53NDgwfSA0ODB3YCA6IG51bGwsXG4gICAgICAgICAgICAgIGhQb3N0ZXIudzcyMCA/IGAke2hQb3N0ZXIudzcyMH0gNzIwd2AgOiBudWxsLFxuICAgICAgICAgICAgICBoUG9zdGVyLncxMDgwID8gYCR7aFBvc3Rlci53MTA4MH0gMTA4MHdgIDogbnVsbCxcbiAgICAgICAgICAgICAgaFBvc3Rlci5vcmlnaW5hbCA/IGAke2hQb3N0ZXIub3JpZ2luYWx9IDIwMDB3YCA6IG51bGwsXG4gICAgICAgICAgICBdLmZpbHRlcihCb29sZWFuKS5qb2luKCcsICcpIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGltZyBcbiAgICAgICAgICAgICAgICBrZXk9e2Ake21vdmllLmlkfS0ke2lkeH1gfVxuICAgICAgICAgICAgICAgIHNyYz17Ymd9IFxuICAgICAgICAgICAgICAgIHNyY1NldD17c3JjU2V0fVxuICAgICAgICAgICAgICAgIHNpemVzPVwiMTAwdndcIlxuICAgICAgICAgICAgICAgIGFsdD17bW92aWUudGl0bGV9IFxuICAgICAgICAgICAgICAgIGRlY29kaW5nPXtpZHggPT09IGFjdGl2ZUluZGV4ID8gXCJzeW5jXCIgOiBcImFzeW5jXCJ9XG4gICAgICAgICAgICAgICAgbG9hZGluZz17aWR4ID09PSBhY3RpdmVJbmRleCA/IFwiZWFnZXJcIiA6IFwibGF6eVwifVxuICAgICAgICAgICAgICAgIGZldGNoUHJpb3JpdHk9e2lkeCA9PT0gYWN0aXZlSW5kZXggPyBcImhpZ2hcIiA6IFwiYXV0b1wifVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGFic29sdXRlIGluc2V0LTAgdy1mdWxsIGgtZnVsbCBvYmplY3QtY292ZXIgb2JqZWN0LWNlbnRlciBzY2FsZS0xMDUgZmlsdGVyIGJyaWdodG5lc3MtMTAwIHdpbGwtY2hhbmdlLXRyYW5zZm9ybSB0cmFuc2l0aW9uLW9wYWNpdHkgZHVyYXRpb24tMTAwMCBlYXNlLWluLW91dCAke2lkeCA9PT0gYWN0aXZlSW5kZXggPyAnb3BhY2l0eS0xMDAgei0wJyA6ICdvcGFjaXR5LTAgLXotMTAnfWB9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuXG4gICAgICAgICAgey8qIEF0bW9zcGhlcmljIExpcXVpZCBHbGFzcyBEZXB0aCBHcmFkaWVudCAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgYmctZ3JhZGllbnQtdG8tdCBmcm9tLVsjMEYxMTEzXSB2aWEtWyMwRjExMTNdLzYwIHZpYS0zMCUgdG8tdHJhbnNwYXJlbnQgei0wXCIgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgYmctZ3JhZGllbnQtdG8tciBmcm9tLVsjMEYxMTEzXSB2aWEtWyMwRjExMTNdLzYwIHZpYS0zMCUgdG8tdHJhbnNwYXJlbnQgdy1mdWxsIG1kOnctMi8zIHotMFwiIC8+XG4gICAgICAgIDwvbW90aW9uLmRpdj5cbiAgICAgIDwvbW90aW9uLmRpdj5cblxuICAgICAgey8qIDIuIFBhcmFsbGF4IENvbnRlbnQgT3ZlcmxheSBMYXllciAoU2VwYXJhdGUgbGF5ZXIgd2l0aCBuZWdhdGl2ZSB0cmFuc2xhdGlvbiBvZmZzZXQgb2YgMC4zNXggcHVsbCBkaXN0YW5jZSkgKi99XG4gICAgICA8bW90aW9uLmRpdiBcbiAgICAgICAgc3R5bGU9e3sgeTogY29udGVudFkgfX1cbiAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgYm90dG9tLTE2IHNtOmJvdHRvbS0yMCBtZDpib3R0b20tMjggbGVmdC0wIHJpZ2h0LTAgcHgtNiBzbTpweC0wIHNtOmxlZnQtNiBtZDpsZWZ0LTggbGc6bGVmdC0xMiB4bDpsZWZ0LTE2IHNtOnJpZ2h0LWF1dG8gZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgdGV4dC1jZW50ZXIgc206aXRlbXMtc3RhcnQgc206dGV4dC1sZWZ0IG1heC13LTJ4bCB6LTEwIHBiLTIgc206cGItMCBwb2ludGVyLWV2ZW50cy1ub25lIHdpbGwtY2hhbmdlLXRyYW5zZm9ybVwiXG4gICAgICA+XG4gICAgICAgIHtyYXRpbmcgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgcHgtMyBweS0xIHJvdW5kZWQtZnVsbCBnbGFzcy1zdWJ0bGUgdGV4dC15ZWxsb3ctMzAwIHRleHQteHMgZm9udC1ib2xkIG1iLTMuNSBzaGFkb3ctbWQgcG9pbnRlci1ldmVudHMtYXV0b1wiPlxuICAgICAgICAgICAgPFN0YXIgc2l6ZT17MTN9IGNsYXNzTmFtZT1cImZpbGwteWVsbG93LTQwMCB0ZXh0LXllbGxvdy00MDBcIiAvPlxuICAgICAgICAgICAgPHNwYW4+e3JhdGluZ30gUmF0aW5nPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC00eGwgc206dGV4dC01eGwgbWQ6dGV4dC02eGwgZm9udC1leHRyYWJvbGQgdGV4dC13aGl0ZSB0cmFja2luZy10aWdodCBtYi00IGRyb3Atc2hhZG93LWxnIGxlYWRpbmctdGlnaHQgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tNTAwXCI+XG4gICAgICAgICAge2N1cnJlbnRNb3ZpZS50aXRsZX1cbiAgICAgICAgPC9oMT5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC13aGl0ZS84MCB0ZXh0LXNtIG1kOnRleHQtYmFzZSBsaW5lLWNsYW1wLTMgbWItNiBmb250LW5vcm1hbCBkcm9wLXNoYWRvdyBsZWFkaW5nLXJlbGF4ZWQgbWF4LXcteGwgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tNTAwIHBvaW50ZXItZXZlbnRzLWF1dG9cIj5cbiAgICAgICAgICB7Y3VycmVudE1vdmllLm92ZXJ2aWV3fVxuICAgICAgICA8L3A+XG5cbiAgICAgICAgey8qIEhlcm8gSW50ZXJhY3RpdmUgUGh5c2ljYWwgQnV0dG9ucyAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBqdXN0aWZ5LWNlbnRlciBzbTpqdXN0aWZ5LXN0YXJ0IGl0ZW1zLWNlbnRlciBnYXAtMyBwb2ludGVyLWV2ZW50cy1hdXRvXCI+XG4gICAgICAgICAgPEdsYXNzQnV0dG9uIFxuICAgICAgICAgICAgdmFyaWFudD1cInByaW1hcnlcIiBcbiAgICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNlbGVjdChjdXJyZW50TW92aWUuaWQpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxQbGF5IHNpemU9ezE3fSBjbGFzc05hbWU9XCJmaWxsLXdoaXRlXCIgLz4gV2F0Y2ggT3B0aW9uc1xuICAgICAgICAgIDwvR2xhc3NCdXR0b24+XG5cbiAgICAgICAgICA8R2xhc3NCdXR0b24gXG4gICAgICAgICAgICB2YXJpYW50PVwic2Vjb25kYXJ5XCIgXG4gICAgICAgICAgICBzaXplPVwibWRcIlxuICAgICAgICAgICAgb25DbGljaz17KGUpID0+IG9uVG9nZ2xlRmF2b3JpdGUoZSwgY3VycmVudE1vdmllLmlkKX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aXNGYXYgPyA8Q2hlY2sgc2l6ZT17MTd9IGNsYXNzTmFtZT1cInRleHQtZ3JlZW4tNDAwXCIgLz4gOiA8UGx1cyBzaXplPXsxN30gLz59XG4gICAgICAgICAgICB7aXNGYXYgPyAnU2F2ZWQnIDogJ0Zhdm9yaXRlcyd9XG4gICAgICAgICAgPC9HbGFzc0J1dHRvbj5cblxuICAgICAgICAgIDxHbGFzc0J1dHRvblxuICAgICAgICAgICAgdmFyaWFudD1cInNlY29uZGFyeVwiXG4gICAgICAgICAgICBzaXplPVwibWRcIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25TZWxlY3QoY3VycmVudE1vdmllLmlkKX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImN1cnNvci1wb2ludGVyICFweC0zXCJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJNb3JlIEluZm9cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxJbmZvIHNpemU9ezE4fSBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlLzgwXCIgLz5cbiAgICAgICAgICA8L0dsYXNzQnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbW90aW9uLmRpdj5cblxuICAgICAgey8qIDMuIENhcm91c2VsIEluZGljYXRvcnMgKFN5bmNocm9uaXplZCBwYXJhbGxheCB3aXRoIGNvbnRlbnQgb3ZlcmxheSkgKi99XG4gICAgICA8bW90aW9uLmRpdiBzdHlsZT17eyB5OiBjb250ZW50WSB9fSBjbGFzc05hbWU9XCJhYnNvbHV0ZSBib3R0b20tNiBtZDpib3R0b20tMTIgbGVmdC0wIHJpZ2h0LTAgc206cmlnaHQtYXV0byBmbGV4IGp1c3RpZnktY2VudGVyIHNtOmp1c3RpZnktc3RhcnQgc206bGVmdC02IG1kOmxlZnQtOCBsZzpsZWZ0LTEyIHhsOmxlZnQtMTYgaXRlbXMtY2VudGVyIGdhcC0yIHotMjAgcG9pbnRlci1ldmVudHMtbm9uZSB3aWxsLWNoYW5nZS10cmFuc2Zvcm1cIj5cbiAgICAgICAge2hlcm9Nb3ZpZXMubWFwKChfLCBpZHgpID0+IChcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBrZXk9e2lkeH1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFjdGl2ZUluZGV4KGlkeCl9XG4gICAgICAgICAgICBjbGFzc05hbWU9e2BoLTEuNSByb3VuZGVkLWZ1bGwgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tNTAwIGN1cnNvci1wb2ludGVyIHBvaW50ZXItZXZlbnRzLWF1dG8gJHtpZHggPT09IGFjdGl2ZUluZGV4ID8gJ3ctOCBiZy13aGl0ZScgOiAndy0yIGJnLXdoaXRlLzMwIGhvdmVyOmJnLXdoaXRlLzUwJ31gfVxuICAgICAgICAgICAgYXJpYS1sYWJlbD17YEdvIHRvIHNsaWRlICR7aWR4ICsgMX1gfVxuICAgICAgICAgIC8+XG4gICAgICAgICkpfVxuICAgICAgPC9tb3Rpb24uZGl2PlxuICAgIDwvZGl2PlxuICApO1xufSk7XG5cbmZ1bmN0aW9uIENhdGVnb3J5Um93KHsgdGl0bGUsIGZldGNoZXIsIG9uU2VsZWN0LCBpc0Zhdm9yaXRlLCB0b2dnbGVGYXZvcml0ZSwgY291bnRyeSB9OiBhbnkpIHtcbiAgY29uc3QgW3Nob3dzLCBzZXRTaG93c10gPSB1c2VTdGF0ZTxTaG93W10+KFtdKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IHNjcm9sbFJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XG4gIGNvbnN0IGNvbnRhaW5lclJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XG4gIGNvbnN0IFtpc0luVmlldywgc2V0SXNJblZpZXddID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFjb250YWluZXJSZWYuY3VycmVudCB8fCB0eXBlb2YgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBzZXRJc0luVmlldyh0cnVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcbiAgICAgICAgaWYgKGVudHJpZXNbMF0/LmlzSW50ZXJzZWN0aW5nKSB7XG4gICAgICAgICAgc2V0SXNJblZpZXcodHJ1ZSk7XG4gICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICB9XG4gICAgICB9LCB7IHJvb3RNYXJnaW46ICcyMDBweCcgfSk7XG4gICAgICBcbiAgICAgIG9ic2VydmVyLm9ic2VydmUoY29udGFpbmVyUmVmLmN1cnJlbnQpO1xuICAgICAgcmV0dXJuICgpID0+IG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICBzZXRJc0luVmlldyh0cnVlKTtcbiAgICB9XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghaXNJblZpZXcpIHJldHVybjtcbiAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcbiAgICBzZXRMb2FkaW5nKHRydWUpO1xuICAgIGZldGNoZXIoKS50aGVuKChyZXM6IGFueSkgPT4ge1xuICAgICAgaWYgKGlzTW91bnRlZCkgc2V0U2hvd3MocmVzPy5zaG93cyB8fCBbXSk7XG4gICAgfSkuY2F0Y2goKGVycjogYW55KSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiQ2F0ZWdvcnlSb3cgZmV0Y2ggZXJyb3I6XCIsIGVycj8ubWVzc2FnZSB8fCBlcnIpO1xuICAgIH0pLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgaWYgKGlzTW91bnRlZCkgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuICgpID0+IHsgaXNNb3VudGVkID0gZmFsc2U7IH07XG4gIH0sIFtmZXRjaGVyLCBpc0luVmlld10pO1xuXG4gIGNvbnN0IHNjcm9sbCA9IChkaXI6ICdsZWZ0JyB8ICdyaWdodCcpID0+IHtcbiAgICBpZiAoc2Nyb2xsUmVmLmN1cnJlbnQpIHtcbiAgICAgIGNvbnN0IHsgc2Nyb2xsTGVmdCwgY2xpZW50V2lkdGggfSA9IHNjcm9sbFJlZi5jdXJyZW50O1xuICAgICAgY29uc3Qgc2Nyb2xsQW1vdW50ID0gY2xpZW50V2lkdGggKiAwLjc1O1xuICAgICAgc2Nyb2xsUmVmLmN1cnJlbnQuc2Nyb2xsVG8oe1xuICAgICAgICBsZWZ0OiBkaXIgPT09ICdsZWZ0JyA/IHNjcm9sbExlZnQgLSBzY3JvbGxBbW91bnQgOiBzY3JvbGxMZWZ0ICsgc2Nyb2xsQW1vdW50LFxuICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCdcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBpZiAobG9hZGluZyB8fCAhaXNJblZpZXcpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJweC00IHNtOnB4LTYgbWQ6cHgtOCBsZzpweC0xMiB4bDpweC0xNiBzcGFjZS15LTRcIiByZWY9e2NvbnRhaW5lclJlZn0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC02IHctNDggYmctd2hpdGUvMTAgcm91bmRlZC1mdWxsIGFuaW1hdGUtcHVsc2VcIiAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTQgb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgICAge0FycmF5LmZyb20oeyBsZW5ndGg6IDYgfSkubWFwKChfLCBpKSA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17aX0gY2xhc3NOYW1lPVwidy1bMTgwcHhdIGZsZXgtc2hyaW5rLTBcIj48U2tlbGV0b25DYXJkIC8+PC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGlmIChzaG93cy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBncm91cCBweC00IHNtOnB4LTYgbWQ6cHgtOCBsZzpweC0xMiB4bDpweC0xNlwiIHJlZj17Y29udGFpbmVyUmVmfT5cbiAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIHNtOnRleHQteGwgZm9udC1leHRyYWJvbGQgdGV4dC13aGl0ZSBtYi00IHRyYWNraW5nLXRpZ2h0IGRyb3Atc2hhZG93XCI+e3RpdGxlfTwvaDM+XG4gICAgICBcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzY3JvbGwoJ2xlZnQnKX0gXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgLWxlZnQtNCB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgei0yMCB3LTEwIGgtMjQgZ2xhc3Mtc3VidGxlIHJvdW5kZWQtci0yeGwgaGlkZGVuIG1kOmZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG9wYWNpdHktMCBncm91cC1ob3ZlcjpvcGFjaXR5LTEwMCB0cmFuc2l0aW9uLW9wYWNpdHkgZHVyYXRpb24tMjAwIGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxDaGV2cm9uUmlnaHQgc2l6ZT17MjR9IGNsYXNzTmFtZT1cInJvdGF0ZS0xODAgdGV4dC13aGl0ZVwiIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICBcbiAgICAgICAgPGRpdiByZWY9e3Njcm9sbFJlZn0gY2xhc3NOYW1lPVwiZmxleCBnYXAtMyBzbTpnYXAtNCBtZDpnYXAtNSBsZzpnYXAtNiBvdmVyZmxvdy14LWF1dG8gc2Nyb2xsYmFyLWhpZGUgc25hcC14IHB5LTQgLW15LTQgcGwtMSBwci0xMlwiPlxuICAgICAgICAgIHtzaG93cy5tYXAoKHNob3csIGluZGV4KSA9PiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17YCR7c2hvdy5pZH0tJHtpbmRleH1gfSBjbGFzc05hbWU9XCJ3LVsxNDBweF0gc206dy1bMTYwcHhdIG1kOnctWzE5MHB4XSBsZzp3LVsyMjBweF0geGw6dy1bMjQwcHhdIGZsZXgtc2hyaW5rLTAgc25hcC1zdGFydFwiPlxuICAgICAgICAgICAgICA8TW92aWVDYXJkIFxuICAgICAgICAgICAgICAgIHNob3c9e3Nob3d9IFxuICAgICAgICAgICAgICAgIGNvdW50cnk9e2NvdW50cnl9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25TZWxlY3Qoc2hvdy5pZCl9IFxuICAgICAgICAgICAgICAgIGlzRmF2b3JpdGU9e2lzRmF2b3JpdGUoc2hvdy5pZCl9IFxuICAgICAgICAgICAgICAgIG9uVG9nZ2xlRmF2b3JpdGU9e3RvZ2dsZUZhdm9yaXRlfSBcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgXG4gICAgICAgIDxidXR0b24gXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gc2Nyb2xsKCdyaWdodCcpfSBcbiAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSAtcmlnaHQtNCB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgei0yMCB3LTEwIGgtMjQgZ2xhc3Mtc3VidGxlIHJvdW5kZWQtbC0yeGwgaGlkZGVuIG1kOmZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG9wYWNpdHktMCBncm91cC1ob3ZlcjpvcGFjaXR5LTEwMCB0cmFuc2l0aW9uLW9wYWNpdHkgZHVyYXRpb24tMjAwIGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxDaGV2cm9uUmlnaHQgc2l6ZT17MjR9IGNsYXNzTmFtZT1cInRleHQtd2hpdGVcIiAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5mdW5jdGlvbiBQbGF0Zm9ybVJvdyh7IHBsYXRmb3JtSWQsIHR5cGUsIGNvdW50cnksIG9uU2VsZWN0LCBpc0Zhdm9yaXRlLCB0b2dnbGVGYXZvcml0ZSwgb25TZWVBbGwgfTogYW55KSB7XG4gIGNvbnN0IFtzaG93cywgc2V0U2hvd3NdID0gdXNlU3RhdGU8U2hvd1tdPihbXSk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xuICBjb25zdCBzY3JvbGxSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpO1xuICBjb25zdCBjb250YWluZXJSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpO1xuICBjb25zdCBbaXNJblZpZXcsIHNldElzSW5WaWV3XSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgcCA9IFBMQVRGT1JNU1twbGF0Zm9ybUlkXTtcblxuICAvLyBMYXp5IGxvYWRpbmcgb2JzZXJ2ZXJcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWNvbnRhaW5lclJlZi5jdXJyZW50IHx8IHR5cGVvZiBJbnRlcnNlY3Rpb25PYnNlcnZlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHNldElzSW5WaWV3KHRydWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcigoZW50cmllcykgPT4ge1xuICAgICAgICBpZiAoZW50cmllc1swXT8uaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgICAgICBzZXRJc0luVmlldyh0cnVlKTtcbiAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHsgcm9vdE1hcmdpbjogJzIwMHB4JyB9KTtcbiAgICAgIFxuICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShjb250YWluZXJSZWYuY3VycmVudCk7XG4gICAgICByZXR1cm4gKCkgPT4gb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgIHNldElzSW5WaWV3KHRydWUpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIGNvbnN0IGxvYWREYXRhID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmICghaXNJblZpZXcpIHJldHVybjtcbiAgICBzZXRMb2FkaW5nKHRydWUpO1xuICAgIHNldEVycm9yKG51bGwpO1xuICAgIGZldGNoRmlsdGVycyh7IGNvdW50cnksIHNob3dfdHlwZTogdHlwZSwgY2F0YWxvZ3M6IHAucHJvdmlkZXJJZCwgb3JkZXJfYnk6ICdwb3B1bGFyaXR5XzF3ZWVrJyB9KVxuICAgICAgLnRoZW4ocmVzID0+IHNldFNob3dzKHJlcy5zaG93cykpXG4gICAgICAuY2F0Y2goZXJyID0+IHNldEVycm9yKGVyci5tZXNzYWdlIHx8ICdGYWlsZWQgdG8gbG9hZCcpKVxuICAgICAgLmZpbmFsbHkoKCkgPT4gc2V0TG9hZGluZyhmYWxzZSkpO1xuICB9LCBbY291bnRyeSwgdHlwZSwgcC5wcm92aWRlcklkLCBpc0luVmlld10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbG9hZERhdGEoKTtcbiAgfSwgW2xvYWREYXRhXSk7XG5cbiAgY29uc3Qgc2Nyb2xsID0gKGRpcjogJ2xlZnQnIHwgJ3JpZ2h0JykgPT4ge1xuICAgIGlmIChzY3JvbGxSZWYuY3VycmVudCkge1xuICAgICAgY29uc3QgeyBzY3JvbGxMZWZ0LCBjbGllbnRXaWR0aCB9ID0gc2Nyb2xsUmVmLmN1cnJlbnQ7XG4gICAgICBjb25zdCBzY3JvbGxBbW91bnQgPSBjbGllbnRXaWR0aCAqIDAuNzU7XG4gICAgICBzY3JvbGxSZWYuY3VycmVudC5zY3JvbGxUbyh7XG4gICAgICAgIGxlZnQ6IGRpciA9PT0gJ2xlZnQnID8gc2Nyb2xsTGVmdCAtIHNjcm9sbEFtb3VudCA6IHNjcm9sbExlZnQgKyBzY3JvbGxBbW91bnQsXG4gICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIGlmIChsb2FkaW5nIHx8ICFpc0luVmlldykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTQgc206cHgtNiBtZDpweC04IGxnOnB4LTEyIHhsOnB4LTE2IHNwYWNlLXktNFwiIHJlZj17Y29udGFpbmVyUmVmfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy04IGgtOCByb3VuZGVkLXhsIGJnLXdoaXRlLzEwIGFuaW1hdGUtcHVsc2VcIiAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC01IHctNDAgYmctd2hpdGUvMTAgcm91bmRlZC1mdWxsIGFuaW1hdGUtcHVsc2VcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC00IG92ZXJmbG93LWhpZGRlblwiPlxuICAgICAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiA2IH0pLm1hcCgoXywgaSkgPT4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2l9IGNsYXNzTmFtZT1cInctWzE4MHB4XSBmbGV4LXNocmluay0wXCI+PFNrZWxldG9uQ2FyZCAvPjwvZGl2PlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBpZiAoZXJyb3IgfHwgc2hvd3MubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgZ3JvdXAgcHgtNCBzbTpweC02IG1kOnB4LTggbGc6cHgtMTIgeGw6cHgtMTZcIiByZWY9e2NvbnRhaW5lclJlZn0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi00XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICA8U3RyZWFtaW5nUGxhdGZvcm1JY29uIHBsYXRmb3JtSWQ9e3BsYXRmb3JtSWR9IC8+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC13aGl0ZS81MCB1cHBlcmNhc2UgZm9udC1ib2xkIHRyYWNraW5nLXdpZGVyIG1iLTAuNVwiPntwLmRpc3BsYXlOYW1lfTwvZGl2PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtYmFzZSBzbTp0ZXh0LXhsIGZvbnQtZXh0cmFib2xkIHRleHQtd2hpdGUgdHJhY2tpbmctdGlnaHRcIj5cbiAgICAgICAgICAgICAgVG9wIHt0eXBlID09PSAnbW92aWUnID8gJ01vdmllcycgOiAnU2hvd3MnfSBvbiB7cC5kaXNwbGF5TmFtZX1cbiAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgIG9uQ2xpY2s9e29uU2VlQWxsfVxuICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1zZW1pYm9sZCB0ZXh0LXdoaXRlLzYwIGhvdmVyOnRleHQtd2hpdGUgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgZ3JvdXAvYnRuIGdsYXNzLXN1YnRsZSBweC0zIHB5LTEgcm91bmRlZC1mdWxsIGN1cnNvci1wb2ludGVyIHRyYW5zaXRpb24tY29sb3JzXCJcbiAgICAgICAgPlxuICAgICAgICAgIFNlZSBBbGwgPENoZXZyb25SaWdodCBzaXplPXsxNH0gY2xhc3NOYW1lPVwiZ3JvdXAtaG92ZXIvYnRuOnRyYW5zbGF0ZS14LTAuNSB0cmFuc2l0aW9uLXRyYW5zZm9ybVwiIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICBcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cbiAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzY3JvbGwoJ2xlZnQnKX0gXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgLWxlZnQtNCB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgei0yMCB3LTEwIGgtMjQgZ2xhc3Mtc3VidGxlIHJvdW5kZWQtci0yeGwgaGlkZGVuIG1kOmZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIG9wYWNpdHktMCBncm91cC1ob3ZlcjpvcGFjaXR5LTEwMCB0cmFuc2l0aW9uLW9wYWNpdHkgZHVyYXRpb24tMjAwIGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxDaGV2cm9uUmlnaHQgc2l6ZT17MjR9IGNsYXNzTmFtZT1cInJvdGF0ZS0xODAgdGV4dC13aGl0ZVwiIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICBcbiAgICAgICAgPGRpdiByZWY9e3Njcm9sbFJlZn0gY2xhc3NOYW1lPVwiZmxleCBnYXAtMyBzbTpnYXAtNCBtZDpnYXAtNSBsZzpnYXAtNiBvdmVyZmxvdy14LWF1dG8gc2Nyb2xsYmFyLWhpZGUgc25hcC14IHB5LTQgLW15LTQgcGwtMSBwci0xMlwiPlxuICAgICAgICAgIHtzaG93cy5zbGljZSgwLCAxMikubWFwKChzaG93LCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2Ake3Nob3cuaWR9LSR7aW5kZXh9YH0gY2xhc3NOYW1lPVwidy1bMTQwcHhdIHNtOnctWzE2MHB4XSBtZDp3LVsxOTBweF0gbGc6dy1bMjIwcHhdIHhsOnctWzI0MHB4XSBmbGV4LXNocmluay0wIHNuYXAtc3RhcnRcIj5cbiAgICAgICAgICAgICAgPE1vdmllQ2FyZCBcbiAgICAgICAgICAgICAgICBzaG93PXtzaG93fSBcbiAgICAgICAgICAgICAgICBjb3VudHJ5PXtjb3VudHJ5fVxuICAgICAgICAgICAgICAgIHBsYXRmb3JtSWQ9e3BsYXRmb3JtSWR9IFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2VsZWN0KHNob3cuaWQpfSBcbiAgICAgICAgICAgICAgICBpc0Zhdm9yaXRlPXtpc0Zhdm9yaXRlKHNob3cuaWQpfSBcbiAgICAgICAgICAgICAgICBvblRvZ2dsZUZhdm9yaXRlPXt0b2dnbGVGYXZvcml0ZX0gXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIFxuICAgICAgICA8YnV0dG9uIFxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNjcm9sbCgncmlnaHQnKX0gXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgLXJpZ2h0LTQgdG9wLTEvMiAtdHJhbnNsYXRlLXktMS8yIHotMjAgdy0xMCBoLTI0IGdsYXNzLXN1YnRsZSByb3VuZGVkLWwtMnhsIGhpZGRlbiBtZDpmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBvcGFjaXR5LTAgZ3JvdXAtaG92ZXI6b3BhY2l0eS0xMDAgdHJhbnNpdGlvbi1vcGFjaXR5IGR1cmF0aW9uLTIwMCBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgID5cbiAgICAgICAgICA8Q2hldnJvblJpZ2h0IHNpemU9ezI0fSBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlXCIgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZnVuY3Rpb24gUGxhdGZvcm1QYWdlKHsgcGxhdGZvcm1JZCwgdHlwZSwgY291bnRyeSwgb25CYWNrLCBvblNlbGVjdE1vdmllLCBpc0Zhdm9yaXRlLCB0b2dnbGVGYXZvcml0ZSwgaGlkZUhlcm8gfTogYW55KSB7XG4gIGNvbnN0IFtzaG93cywgc2V0U2hvd3NdID0gdXNlU3RhdGU8U2hvd1tdPihbXSk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuICBjb25zdCBbaGFzTW9yZSwgc2V0SGFzTW9yZV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtuZXh0Q3Vyc29yLCBzZXROZXh0Q3Vyc29yXSA9IHVzZVN0YXRlPHN0cmluZyB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgY29uc3QgW2lzRmV0Y2hpbmdNb3JlLCBzZXRJc0ZldGNoaW5nTW9yZV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IHAgPSBQTEFURk9STVNbcGxhdGZvcm1JZF07XG5cbiAgY29uc3QgaGVyb1JlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XG4gIGNvbnN0IHsgaW1hZ2VTY2FsZSwgY29udGVudFkgfSA9IHVzZVB1bGxEb3duWm9vbShoZXJvUmVmKTtcblxuICBjb25zdCBsb2FkRGF0YSA9IHVzZUNhbGxiYWNrKChyZXNldCA9IGZhbHNlKSA9PiB7XG4gICAgaWYgKHJlc2V0KSBzZXRMb2FkaW5nKHRydWUpO1xuICAgIGVsc2Ugc2V0SXNGZXRjaGluZ01vcmUodHJ1ZSk7XG5cbiAgICBmZXRjaEZpbHRlcnMoeyBcbiAgICAgIGNvdW50cnksIFxuICAgICAgc2hvd190eXBlOiB0eXBlLCBcbiAgICAgIGNhdGFsb2dzOiBwLnByb3ZpZGVySWQsIFxuICAgICAgb3JkZXJfYnk6ICdwb3B1bGFyaXR5XzF3ZWVrJyxcbiAgICAgIGN1cnNvcjogcmVzZXQgPyB1bmRlZmluZWQgOiBuZXh0Q3Vyc29yXG4gICAgfSkudGhlbihyZXMgPT4ge1xuICAgICAgc2V0U2hvd3MocHJldiA9PiByZXNldCA/IHJlcy5zaG93cyA6IFsuLi5wcmV2LCAuLi5yZXMuc2hvd3NdKTtcbiAgICAgIHNldEhhc01vcmUocmVzLmhhc01vcmUpO1xuICAgICAgc2V0TmV4dEN1cnNvcihyZXMubmV4dEN1cnNvcik7XG4gICAgfSkuY2F0Y2goY29uc29sZS5lcnJvcikuZmluYWxseSgoKSA9PiB7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgIHNldElzRmV0Y2hpbmdNb3JlKGZhbHNlKTtcbiAgICB9KTtcbiAgfSwgW2NvdW50cnksIHR5cGUsIHAucHJvdmlkZXJJZCwgbmV4dEN1cnNvcl0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbG9hZERhdGEodHJ1ZSk7XG4gIH0sIFtwbGF0Zm9ybUlkLCB0eXBlLCBjb3VudHJ5XSk7XG5cbiAgY29uc3Qgb2JzZXJ2ZXIgPSB1c2VSZWY8SW50ZXJzZWN0aW9uT2JzZXJ2ZXIgfCBudWxsPihudWxsKTtcbiAgY29uc3QgbGFzdEVsZW1lbnRSZWYgPSB1c2VDYWxsYmFjaygobm9kZTogYW55KSA9PiB7XG4gICAgaWYgKGxvYWRpbmcgfHwgaXNGZXRjaGluZ01vcmUpIHJldHVybjtcbiAgICBpZiAob2JzZXJ2ZXIuY3VycmVudCkgb2JzZXJ2ZXIuY3VycmVudC5kaXNjb25uZWN0KCk7XG4gICAgb2JzZXJ2ZXIuY3VycmVudCA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihlbnRyaWVzID0+IHtcbiAgICAgIGlmIChlbnRyaWVzWzBdLmlzSW50ZXJzZWN0aW5nICYmIGhhc01vcmUpIHtcbiAgICAgICAgbG9hZERhdGEoZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChub2RlKSBvYnNlcnZlci5jdXJyZW50Lm9ic2VydmUobm9kZSk7XG4gIH0sIFtsb2FkaW5nLCBpc0ZldGNoaW5nTW9yZSwgaGFzTW9yZSwgbG9hZERhdGFdKTtcblxuICBjb25zdCB0b3BTaG93ID0gc2hvd3NbMF07XG4gIGNvbnN0IHRvcFBvc3RlciA9IHRvcFNob3c/LmltYWdlU2V0Py5ob3Jpem9udGFsUG9zdGVyPy53MTA4MCB8fCB0b3BTaG93Py5pbWFnZVNldD8ucG9zdGVyO1xuICBjb25zdCB0b3BSYXRpbmcgPSB0b3BTaG93Py5yYXRpbmcgPyAodG9wU2hvdy5yYXRpbmcgPiAxMCA/IHRvcFNob3cucmF0aW5nIC8gMTAgOiB0b3BTaG93LnJhdGluZykudG9GaXhlZCgxKSA6IG51bGw7XG4gIGNvbnN0IGlzVG9wRmF2ID0gdG9wU2hvdyA/IGlzRmF2b3JpdGUodG9wU2hvdy5pZCkgOiBmYWxzZTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIHBiLTI4IG1kOnBiLTIwXCI+XG4gICAgICB7LyogMS4gUGxhdGZvcm0gSGVybyBCYW5uZXIgd2l0aCBQdWxsLURvd24gWm9vbSAmIFN0cmV0Y2ggKi99XG4gICAgICB7IWhpZGVIZXJvICYmIChsb2FkaW5nICYmIHNob3dzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLVs1NXZoXSBtZDpoLVs2NXZoXSB3LWZ1bGwgYmctWyMxNDE2MUJdIGFuaW1hdGUtcHVsc2VcIiAvPlxuICAgICAgKSA6IHRvcFNob3cgJiYgdG9wUG9zdGVyID8gKFxuICAgICAgICA8ZGl2IFxuICAgICAgICAgIHJlZj17aGVyb1JlZn1cbiAgICAgICAgICBzdHlsZT17eyB0b3VjaEFjdGlvbjogJ3Bhbi14IHBhbi15JywgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnIH19XG4gICAgICAgICAgY2xhc3NOYW1lPVwicmVsYXRpdmUgaC1bNjB2aF0gc206aC1bNjh2aF0gbWQ6aC1bNzV2aF0gdy1mdWxsIG92ZXJmbG93LWhpZGRlbiBncHUtbGF5ZXIgZ3JvdXAgYmctYmxhY2sgc2VsZWN0LW5vbmVcIlxuICAgICAgICA+XG4gICAgICAgICAgey8qIFN0aWNreSBTY2FsYWJsZSBCYWNrZHJvcCBMYXllciAqL31cbiAgICAgICAgICA8bW90aW9uLmRpdiBcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInN0aWNreSB0b3AtMCBpbnNldC14LTAgdy1mdWxsIGgtZnVsbCBwb2ludGVyLWV2ZW50cy1ub25lIHdpbGwtY2hhbmdlLXRyYW5zZm9ybVwiXG4gICAgICAgICAgICBzdHlsZT17eyBcbiAgICAgICAgICAgICAgc2NhbGU6IGltYWdlU2NhbGUsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogJzUwJSAwJScsXG4gICAgICAgICAgICAgIFdlYmtpdFRyYW5zZm9ybU9yaWdpbjogJzUwJSAwJScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxpbWcgXG4gICAgICAgICAgICAgIHNyYz17dG9wUG9zdGVyfSBcbiAgICAgICAgICAgICAgYWx0PXt0b3BTaG93LnRpdGxlfSBcbiAgICAgICAgICAgICAgZGVjb2Rpbmc9XCJzeW5jXCJcbiAgICAgICAgICAgICAgbG9hZGluZz1cImVhZ2VyXCJcbiAgICAgICAgICAgICAgZmV0Y2hQcmlvcml0eT1cImhpZ2hcIlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlciBvYmplY3QtY2VudGVyIHNjYWxlLTEwNSBmaWx0ZXIgYnJpZ2h0bmVzcy0xMDAgd2lsbC1jaGFuZ2UtdHJhbnNmb3JtXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7LyogQXRtb3NwaGVyaWMgRGVwdGggR3JhZGllbnRzICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGJnLWdyYWRpZW50LXRvLXQgZnJvbS1bIzBGMTExM10gdmlhLVsjMEYxMTEzXS82MCB2aWEtMzUlIHRvLXRyYW5zcGFyZW50IHotMFwiIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgYmctZ3JhZGllbnQtdG8tciBmcm9tLVsjMEYxMTEzXSB2aWEtWyMwRjExMTNdLzYwIHZpYS0zMCUgdG8tdHJhbnNwYXJlbnQgdy1mdWxsIG1kOnctMi8zIHotMFwiIC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgYmctZ3JhZGllbnQtdG8tYiBmcm9tLWJsYWNrLzYwIHZpYS10cmFuc3BhcmVudCB0by10cmFuc3BhcmVudCBoLTMyIHotMFwiIC8+XG4gICAgICAgICAgPC9tb3Rpb24uZGl2PlxuXG4gICAgICAgICAgey8qIEZsb2F0aW5nIEJhY2sgTmF2aWdhdGlvbiBQaWxsICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLTIwIHNtOnRvcC0yNCBsZWZ0LTQgc206bGVmdC02IG1kOmxlZnQtOCBsZzpsZWZ0LTEyIHhsOmxlZnQtMTYgei0zMCBwb2ludGVyLWV2ZW50cy1hdXRvXCI+XG4gICAgICAgICAgICA8R2xhc3NCdXR0b24gdmFyaWFudD1cInNlY29uZGFyeVwiIHNpemU9XCJzbVwiIG9uQ2xpY2s9e29uQmFja30gY2xhc3NOYW1lPVwic2hhZG93LTJ4bFwiPlxuICAgICAgICAgICAgICA8Q2hldnJvbkxlZnQgc2l6ZT17MTZ9IC8+IEJhY2sgdG8gQ2F0YWxvZ1xuICAgICAgICAgICAgPC9HbGFzc0J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBQYXJhbGxheCBIZXJvIEluZm8gT3ZlcmxheSBMYXllciAqL31cbiAgICAgICAgICA8bW90aW9uLmRpdiBcbiAgICAgICAgICAgIHN0eWxlPXt7IHk6IGNvbnRlbnRZIH19XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBib3R0b20tOCBzbTpib3R0b20tMTIgbWQ6Ym90dG9tLTE2IGxlZnQtMCByaWdodC0wIHB4LTYgc206cHgtMCBzbTpsZWZ0LTYgbWQ6bGVmdC04IGxnOmxlZnQtMTIgeGw6bGVmdC0xNiBzbTpyaWdodC1hdXRvIGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIHRleHQtY2VudGVyIHNtOml0ZW1zLXN0YXJ0IHNtOnRleHQtbGVmdCBtYXgtdy0yeGwgei0yMCBwYi0yIHNtOnBiLTAgcG9pbnRlci1ldmVudHMtbm9uZSB3aWxsLWNoYW5nZS10cmFuc2Zvcm1cIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LXdyYXAgaXRlbXMtY2VudGVyIGdhcC0yLjUgbWItMyBwb2ludGVyLWV2ZW50cy1hdXRvXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgYmctYmxhY2svNjAgYmFja2Ryb3AtYmx1ci1tZCBib3JkZXIgYm9yZGVyLXdoaXRlLzIwIHB4LTMgcHktMSByb3VuZGVkLWZ1bGwgc2hhZG93LWxnXCI+XG4gICAgICAgICAgICAgICAgPFN0cmVhbWluZ1BsYXRmb3JtSWNvbiBwbGF0Zm9ybUlkPXtwbGF0Zm9ybUlkfSBjbGFzc05hbWU9XCJ3LTUgaC01IHJvdW5kZWQtbWRcIiAvPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1ib2xkIHRleHQtd2hpdGUgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyXCI+e3AuZGlzcGxheU5hbWV9IFNwb3RsaWdodDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAge3RvcFJhdGluZyAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgcHgtMi41IHB5LTEgcm91bmRlZC1mdWxsIGdsYXNzLXN1YnRsZSB0ZXh0LXllbGxvdy0zMDAgdGV4dC14cyBmb250LWJvbGQgc2hhZG93LW1kXCI+XG4gICAgICAgICAgICAgICAgICA8U3RhciBzaXplPXsxMn0gY2xhc3NOYW1lPVwiZmlsbC15ZWxsb3ctNDAwIHRleHQteWVsbG93LTQwMFwiIC8+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj57dG9wUmF0aW5nfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC0zeGwgc206dGV4dC00eGwgbWQ6dGV4dC01eGwgZm9udC1leHRyYWJvbGQgdGV4dC13aGl0ZSB0cmFja2luZy10aWdodCBtYi0zIGRyb3Atc2hhZG93LWxnIGxlYWRpbmctdGlnaHRcIj5cbiAgICAgICAgICAgICAge3RvcFNob3cudGl0bGV9XG4gICAgICAgICAgICA8L2gxPlxuXG4gICAgICAgICAgICB7dG9wU2hvdy5vdmVydmlldyAmJiAoXG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtd2hpdGUvODAgdGV4dC14cyBzbTp0ZXh0LXNtIG1kOnRleHQtYmFzZSBsaW5lLWNsYW1wLTIgc206bGluZS1jbGFtcC0zIG1iLTUgZm9udC1ub3JtYWwgZHJvcC1zaGFkb3cgbGVhZGluZy1yZWxheGVkIG1heC13LXhsIHBvaW50ZXItZXZlbnRzLWF1dG9cIj5cbiAgICAgICAgICAgICAgICB7dG9wU2hvdy5vdmVydmlld31cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBqdXN0aWZ5LWNlbnRlciBzbTpqdXN0aWZ5LXN0YXJ0IGl0ZW1zLWNlbnRlciBnYXAtMyBwb2ludGVyLWV2ZW50cy1hdXRvXCI+XG4gICAgICAgICAgICAgIDxHbGFzc0J1dHRvbiBcbiAgICAgICAgICAgICAgICB2YXJpYW50PVwicHJpbWFyeVwiIFxuICAgICAgICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25TZWxlY3RNb3ZpZSh0b3BTaG93LmlkKX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJjdXJzb3ItcG9pbnRlciBzaGFkb3cteGxcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFBsYXkgc2l6ZT17MTd9IGNsYXNzTmFtZT1cImZpbGwtd2hpdGVcIiAvPiBXYXRjaCBOb3dcbiAgICAgICAgICAgICAgPC9HbGFzc0J1dHRvbj5cblxuICAgICAgICAgICAgICA8R2xhc3NCdXR0b24gXG4gICAgICAgICAgICAgICAgdmFyaWFudD1cInNlY29uZGFyeVwiIFxuICAgICAgICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHRvZ2dsZUZhdm9yaXRlKGUsIHRvcFNob3cuaWQpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtpc1RvcEZhdiA/IDxDaGVjayBzaXplPXsxN30gY2xhc3NOYW1lPVwidGV4dC1ncmVlbi00MDBcIiAvPiA6IDxQbHVzIHNpemU9ezE3fSAvPn1cbiAgICAgICAgICAgICAgICB7aXNUb3BGYXYgPyAnU2F2ZWQnIDogJ0FkZCB0byBGYXZvcml0ZXMnfVxuICAgICAgICAgICAgICA8L0dsYXNzQnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9tb3Rpb24uZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHQtMjAgbWQ6cHQtMzIgcHgtNCBzbTpweC02IG1kOnB4LTggbGc6cHgtMTIgeGw6cHgtMTYgbWF4LXctWzE2MDBweF0gbXgtYXV0b1wiPlxuICAgICAgICAgIDxHbGFzc0J1dHRvbiB2YXJpYW50PVwic2Vjb25kYXJ5XCIgc2l6ZT1cInNtXCIgb25DbGljaz17b25CYWNrfSBjbGFzc05hbWU9XCJtYi02IG1kOm1iLThcIj5cbiAgICAgICAgICAgIDxDaGV2cm9uTGVmdCBzaXplPXsxNn0gLz4gQmFjayB0byBDYXRhbG9nXG4gICAgICAgICAgPC9HbGFzc0J1dHRvbj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC00IG1iLThcIj5cbiAgICAgICAgICAgIDxTdHJlYW1pbmdQbGF0Zm9ybUljb24gcGxhdGZvcm1JZD17cGxhdGZvcm1JZH0gY2xhc3NOYW1lPVwidy0xNCBoLTE0IHNtOnctMTYgc206aC0xNiB0ZXh0LXhsIHJvdW5kZWQtMnhsIHNoYWRvdy0yeGxcIiAvPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtMnhsIHNtOnRleHQtM3hsIGZvbnQtZXh0cmFib2xkIHRleHQtd2hpdGUgdHJhY2tpbmctdGlnaHRcIj57cC5kaXNwbGF5TmFtZX08L2gxPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlLzYwIHRleHQtc20gc206dGV4dC1iYXNlXCI+VG9wIHt0eXBlID09PSAnbW92aWUnID8gJ01vdmllcycgOiAnVFYgU2hvd3MnfTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICkpfVxuICAgICAgey8qIDIuIFBsYXRmb3JtIENhdGFsb2d1ZSBDb250ZW50IEdyaWQgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTQgc206cHgtNiBtZDpweC04IGxnOnB4LTEyIHhsOnB4LTE2IG1heC13LVsxNjAwcHhdIG14LWF1dG8gcHQtOFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi02XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgPFN0cmVhbWluZ1BsYXRmb3JtSWNvbiBwbGF0Zm9ybUlkPXtwbGF0Zm9ybUlkfSBjbGFzc05hbWU9XCJ3LTggaC04IHJvdW5kZWQteGxcIiAvPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQteGwgc206dGV4dC0yeGwgZm9udC1leHRyYWJvbGQgdGV4dC13aGl0ZSB0cmFja2luZy10aWdodFwiPlxuICAgICAgICAgICAgICAgIEFsbCB7cC5kaXNwbGF5TmFtZX0ge3R5cGUgPT09ICdtb3ZpZScgPyAnTW92aWVzJyA6ICdUViBTaG93cyd9XG4gICAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgc206dGV4dC1zbSB0ZXh0LXdoaXRlLzUwXCI+XG4gICAgICAgICAgICAgICAgQ3VyYXRlZCBzdHJlYW0gY2F0YWxvZyBmb3Ige2NvdW50cnkudG9VcHBlckNhc2UoKX1cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHtsb2FkaW5nICYmIHNob3dzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgc206Z3JpZC1jb2xzLTMgbWQ6Z3JpZC1jb2xzLTQgbGc6Z3JpZC1jb2xzLTUgeGw6Z3JpZC1jb2xzLTYgZ2FwLTMgc206Z2FwLTZcIj5cbiAgICAgICAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMiB9KS5tYXAoKF8sIGkpID0+IChcbiAgICAgICAgICAgICAgPFNrZWxldG9uQ2FyZCBrZXk9e2l9IC8+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IHNob3dzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyIHRleHQtd2hpdGUvNTAgcHktMjBcIj5ObyBjb250ZW50IGF2YWlsYWJsZSBmb3Ige3AuZGlzcGxheU5hbWV9IGluIHRoaXMgcmVnaW9uLjwvZGl2PlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBzbTpncmlkLWNvbHMtMyBtZDpncmlkLWNvbHMtNCBsZzpncmlkLWNvbHMtNSB4bDpncmlkLWNvbHMtNiBnYXAtMyBzbTpnYXAtNiBjb250ZW50LWF1dG9cIj5cbiAgICAgICAgICAgIHtzaG93cy5tYXAoKHNob3csIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGlzTGFzdCA9IGluZGV4ID09PSBzaG93cy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXYga2V5PXtgJHtzaG93LmlkfS0ke2luZGV4fWB9IHJlZj17aXNMYXN0ID8gbGFzdEVsZW1lbnRSZWYgOiBudWxsfT5cbiAgICAgICAgICAgICAgICAgIDxNb3ZpZUNhcmQgXG4gICAgICAgICAgICAgICAgICAgIHNob3c9e3Nob3d9IFxuICAgICAgICAgICAgICAgICAgICBjb3VudHJ5PXtjb3VudHJ5fVxuICAgICAgICAgICAgICAgICAgICBwbGF0Zm9ybUlkPXtwbGF0Zm9ybUlkfSBcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25TZWxlY3RNb3ZpZShzaG93LmlkKX0gXG4gICAgICAgICAgICAgICAgICAgIGlzRmF2b3JpdGU9e2lzRmF2b3JpdGUoc2hvdy5pZCl9IFxuICAgICAgICAgICAgICAgICAgICBvblRvZ2dsZUZhdm9yaXRlPXt0b2dnbGVGYXZvcml0ZX0gXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICB7aXNGZXRjaGluZ01vcmUgJiYgKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1zcGFuLWZ1bGwgZmxleCBqdXN0aWZ5LWNlbnRlciBweS04XCI+XG4gICAgICAgICAgICAgICAgPExvYWRlcjIgY2xhc3NOYW1lPVwidy04IGgtOCBhbmltYXRlLXNwaW4gdGV4dC1hbWJlci01MDBcIiAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuXG5jb25zdCBTa2VsZXRvbkNhcmQgPSBSZWFjdC5tZW1vKGZ1bmN0aW9uIFNrZWxldG9uQ2FyZCgpIHtcbiAgcmV0dXJuIChcbiAgICA8bW90aW9uLmRpdlxuICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwLjUgfX1cbiAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogWzAuNSwgMSwgMC41XSB9fVxuICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMS41LCByZXBlYXQ6IEluZmluaXR5LCBlYXNlOiBcImVhc2VJbk91dFwiIH19XG4gICAgICBjbGFzc05hbWU9XCJhc3BlY3QtWzIvM10gdy1mdWxsIGJnLXdoaXRlLzUgcm91bmRlZC0zeGwgb3ZlcmZsb3ctaGlkZGVuIHJlbGF0aXZlIHNoYWRvdy1sZ1wiXG4gICAgPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGJnLWdyYWRpZW50LXRvLXQgZnJvbS1ibGFjay82MCB0by10cmFuc3BhcmVudFwiIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGJvdHRvbS0zIGxlZnQtMyByaWdodC0zIGZsZXggZmxleC1jb2wgZ2FwLTJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTQgdy0zLzQgYmctd2hpdGUvMTAgcm91bmRlZC1mdWxsXCIgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTMgdy0xLzIgYmctd2hpdGUvMTAgcm91bmRlZC1mdWxsXCIgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvbW90aW9uLmRpdj5cbiAgKTtcbn0pO1xuXG5jb25zdCBNb3ZpZUNhcmQgPSBSZWFjdC5tZW1vKGZ1bmN0aW9uIE1vdmllQ2FyZCh7IFxuICBzaG93LCBcbiAgcGxhdGZvcm1JZCwgXG4gIGNvdW50cnkgPSAndXMnLCBcbiAgb25DbGljaywgXG4gIGlzRmF2b3JpdGUsIFxuICBvblRvZ2dsZUZhdm9yaXRlIFxufToge1xuICBzaG93OiBTaG93O1xuICBwbGF0Zm9ybUlkPzogc3RyaW5nO1xuICBjb3VudHJ5Pzogc3RyaW5nO1xuICBvbkNsaWNrOiAoKSA9PiB2b2lkO1xuICBpc0Zhdm9yaXRlOiBib29sZWFuO1xuICBvblRvZ2dsZUZhdm9yaXRlOiAoZTogUmVhY3QuTW91c2VFdmVudCwgaWQ6IHN0cmluZykgPT4gdm9pZDtcbn0pIHtcbiAgY29uc3QgZmFsbGJhY2sgPSBzaG93LmltYWdlU2V0Py5wb3N0ZXIgfHwgJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDg5NTk5ODQ5OTI3LTJlZTkxY2VkZTNiYT93PTUwMCZhdXRvPWZvcm1hdCZmaXQ9Y3JvcCZxPTYwJztcbiAgY29uc3QgdlBvc3RlciA9IHNob3cuaW1hZ2VTZXQ/LnZlcnRpY2FsUG9zdGVyO1xuICBjb25zdCBzcmNTZXQgPSB2UG9zdGVyID8gW1xuICAgIHZQb3N0ZXIudzI0MCA/IGAke3ZQb3N0ZXIudzI0MH0gMjQwd2AgOiBudWxsLFxuICAgIHZQb3N0ZXIudzM2MCA/IGAke3ZQb3N0ZXIudzM2MH0gMzYwd2AgOiBudWxsLFxuICAgIHZQb3N0ZXIudzQ4MCA/IGAke3ZQb3N0ZXIudzQ4MH0gNDgwd2AgOiBudWxsLFxuICAgIHZQb3N0ZXIudzYwMCA/IGAke3ZQb3N0ZXIudzYwMH0gNjAwd2AgOiBudWxsLFxuICBdLmZpbHRlcihCb29sZWFuKS5qb2luKCcsICcpIDogdW5kZWZpbmVkO1xuICBcbiAgY29uc3QgcG9zdGVyID0gdlBvc3Rlcj8udzQ4MCB8fCB2UG9zdGVyPy53MzYwIHx8IGZhbGxiYWNrO1xuXG4gIGNvbnN0IHJlc29sdmVkUGxhdGZvcm0gPSB1c2VNZW1vKCgpID0+IHJlc29sdmVQbGF0Zm9ybShwbGF0Zm9ybUlkLCBzaG93LCBjb3VudHJ5KSwgW3BsYXRmb3JtSWQsIHNob3csIGNvdW50cnldKTtcbiAgXG4gIGNvbnN0IHJhd1JhdGluZyA9IHNob3cucmF0aW5nO1xuICBjb25zdCByYXRpbmdWYWx1ZSA9IHJhd1JhdGluZyA/IChyYXdSYXRpbmcgPiAxMCA/IHJhd1JhdGluZyAvIDEwIDogcmF3UmF0aW5nKSA6IG51bGw7XG4gIGNvbnN0IGZvcm1hdHRlZFJhdGluZyA9IHJhdGluZ1ZhbHVlID8gcmF0aW5nVmFsdWUudG9GaXhlZCgxKSA6IG51bGw7XG4gIGNvbnN0IHJlbGVhc2VZZWFyID0gc2hvdy5yZWxlYXNlWWVhciB8fCAoc2hvdyBhcyBhbnkpLmZpcnN0X2Fpcl9kYXRlPy5zcGxpdCgnLScpWzBdIHx8IChzaG93IGFzIGFueSkucmVsZWFzZV9kYXRlPy5zcGxpdCgnLScpWzBdIHx8IG51bGw7XG5cbiAgcmV0dXJuIChcbiAgICA8bW90aW9uLmRpdiBcbiAgICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgICBzdHlsZT17eyBib3JkZXJSYWRpdXM6ICcyNHB4JyB9fVxuICAgICAgY2xhc3NOYW1lPVwiZ3JvdXAvY2FyZCByZWxhdGl2ZSBhc3BlY3QtWzIvM10gdy1mdWxsIG92ZXJmbG93LWhpZGRlbiBjdXJzb3ItcG9pbnRlciBnbGFzcy1zdWJ0bGUgYm9yZGVyIGJvcmRlci13aGl0ZS8xNSBob3Zlcjpib3JkZXItd2hpdGUvMzUgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMjUwIHRyYW5zZm9ybSBob3ZlcjotdHJhbnNsYXRlLXktMS41IGhvdmVyOnNoYWRvdy1bMF8xNnB4XzQwcHhfcmdiYSgwLDAsMCwwLjgpXSBmbGV4IGZsZXgtY29sIGp1c3RpZnktYmV0d2VlbiBncHUtbGF5ZXIgd2lsbC1jaGFuZ2UtdHJhbnNmb3JtXCJcbiAgICA+XG4gICAgICB7LyogUG9zdGVyIEltYWdlICovfVxuICAgICAgPGltZyBcbiAgICAgICAgc3JjPXtwb3N0ZXJ9IFxuICAgICAgICBzcmNTZXQ9e3NyY1NldH1cbiAgICAgICAgc2l6ZXM9XCIobWF4LXdpZHRoOiA2NDBweCkgNTB2dywgKG1heC13aWR0aDogNzY4cHgpIDMzdncsIChtYXgtd2lkdGg6IDEwMjRweCkgMjV2dywgKG1heC13aWR0aDogMTI4MHB4KSAyMHZ3LCAxNnZ3XCJcbiAgICAgICAgYWx0PXtzaG93LnRpdGxlfSBcbiAgICAgICAgZGVjb2Rpbmc9XCJhc3luY1wiXG4gICAgICAgIGxvYWRpbmc9XCJsYXp5XCJcbiAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCB3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlciB0cmFuc2l0aW9uLXRyYW5zZm9ybSBkdXJhdGlvbi01MDAgZWFzZS1vdXQgZ3JvdXAtaG92ZXIvY2FyZDpzY2FsZS0xMDUgd2lsbC1jaGFuZ2UtdHJhbnNmb3JtIGJnLVsjMTQxNjFDXVwiIFxuICAgICAgLz5cbiAgICAgIFxuICAgICAgey8qIFRvcCBTcGVjdWxhciBFZGdlIFNoZWVuICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC14LTMgdG9wLTAgaC1bMXB4XSBiZy1ncmFkaWVudC10by1yIGZyb20tdHJhbnNwYXJlbnQgdmlhLXdoaXRlLzgwIHRvLXRyYW5zcGFyZW50IHBvaW50ZXItZXZlbnRzLW5vbmUgei0yMFwiIC8+XG5cbiAgICAgIHsvKiBUb3AgRmxvYXRpbmcgQmFkZ2VzOiBQbGF0Zm9ybSBiYWRnZSAmIEZhdm9yaXRlIGFjdGlvbiAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgei0xMCBwLTIuNSBmbGV4IGl0ZW1zLXN0YXJ0IGp1c3RpZnktYmV0d2VlbiBnYXAtMSBwb2ludGVyLWV2ZW50cy1ub25lXCI+XG4gICAgICAgIHtyZXNvbHZlZFBsYXRmb3JtID8gKFxuICAgICAgICAgIDxQbGF0Zm9ybUJhZGdlIHBsYXRmb3JtPXtyZXNvbHZlZFBsYXRmb3JtfSBjbGFzc05hbWU9XCJwb2ludGVyLWV2ZW50cy1hdXRvIHNoYWRvdy1sZ1wiIC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPEdsYXNzUGlsbCB2YXJpYW50PVwic3VidGxlXCIgc2l6ZT1cInhzXCIgY2xhc3NOYW1lPVwicG9pbnRlci1ldmVudHMtYXV0byBzaGFkb3ctbWRcIj5cbiAgICAgICAgICAgIHtzaG93LnNob3dUeXBlID09PSAnc2VyaWVzJyA/ICdUVicgOiAnTW92aWUnfVxuICAgICAgICAgIDwvR2xhc3NQaWxsPlxuICAgICAgICApfVxuXG4gICAgICAgIDxidXR0b24gXG4gICAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBvblRvZ2dsZUZhdm9yaXRlKGUsIHNob3cuaWQpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgY2xhc3NOYW1lPXtgcG9pbnRlci1ldmVudHMtYXV0byB3LTcgaC03IHJvdW5kZWQtZnVsbCBiYWNrZHJvcC1ibHVyLW1kIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTIwMCBib3JkZXIgc2hhZG93LW1kIGN1cnNvci1wb2ludGVyICR7XG4gICAgICAgICAgICBpc0Zhdm9yaXRlIFxuICAgICAgICAgICAgICA/ICdiZy1yZWQtNTAwIHRleHQtd2hpdGUgYm9yZGVyLXJlZC00MDAgb3BhY2l0eS0xMDAgc2hhZG93LVswXzBfMTJweF9yZ2JhKDIzOSw2OCw2OCwwLjUpXScgXG4gICAgICAgICAgICAgIDogJ2JnLWJsYWNrLzYwIHRleHQtd2hpdGUvOTAgYm9yZGVyLXdoaXRlLzIwIGhvdmVyOmJnLXdoaXRlIGhvdmVyOnRleHQtYmxhY2sgb3BhY2l0eS0wIGdyb3VwLWhvdmVyL2NhcmQ6b3BhY2l0eS0xMDAnXG4gICAgICAgICAgfWB9XG4gICAgICAgICAgdGl0bGU9e2lzRmF2b3JpdGUgPyBcIlJlbW92ZSBmcm9tIEZhdm9yaXRlc1wiIDogXCJBZGQgdG8gRmF2b3JpdGVzXCJ9XG4gICAgICAgID5cbiAgICAgICAgICB7aXNGYXZvcml0ZSA/IDxDaGVjayBzaXplPXsxM30gY2xhc3NOYW1lPVwic3Ryb2tlLVszXVwiIC8+IDogPFBsdXMgc2l6ZT17MTR9IC8+fVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogQm90dG9tIEluZm8gR3JhZGllbnQgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIHotMTAgcHQtMTYgcGItMy41IHB4LTMuNSBiZy1ncmFkaWVudC10by10IGZyb20tWyMwODBBMEVdIHZpYS1bIzA4MEEwRV0vODAgdmlhLTUwJSB0by10cmFuc3BhcmVudCBmbGV4IGZsZXgtY29sIGp1c3RpZnktZW5kXCI+XG4gICAgICAgIDxoNCBjbGFzc05hbWU9XCJmb250LWJvbGQgdGV4dC13aGl0ZSB0ZXh0LXhzIHNtOnRleHQtc20gbGluZS1jbGFtcC0xIG1iLTEgdHJhY2tpbmctdGlnaHQgZ3JvdXAtaG92ZXIvY2FyZDp0ZXh0LWFtYmVyLTUwMCB0cmFuc2l0aW9uLWNvbG9ycyBkcm9wLXNoYWRvd1wiPlxuICAgICAgICAgIHtzaG93LnRpdGxlfVxuICAgICAgICA8L2g0PlxuICAgICAgICBcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gdGV4dC14cyB0ZXh0LXdoaXRlLzcwXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IHRleHQteHMgdGV4dC13aGl0ZS82MCBmb250LW1lZGl1bVwiPlxuICAgICAgICAgICAge3JlbGVhc2VZZWFyICYmIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtd2hpdGUvOTAgZm9udC1zZW1pYm9sZFwiPntyZWxlYXNlWWVhcn08L3NwYW4+fVxuICAgICAgICAgICAge3Nob3cucnVudGltZSAmJiA8c3Bhbj7igKIge3Nob3cucnVudGltZX1tPC9zcGFuPn1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICBcbiAgICAgICAgICB7Zm9ybWF0dGVkUmF0aW5nICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgdGV4dC15ZWxsb3ctNDAwIGZvbnQtYm9sZCB0ZXh0LXhzXCI+XG4gICAgICAgICAgICAgIDxTdGFyIHNpemU9ezExfSBjbGFzc05hbWU9XCJmaWxsLXllbGxvdy00MDAgdGV4dC15ZWxsb3ctNDAwXCIgLz5cbiAgICAgICAgICAgICAgPHNwYW4+e2Zvcm1hdHRlZFJhdGluZ308L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbW90aW9uLmRpdj5cbiAgKTtcbn0pO1xuXG5jb25zdCBHZW5yZUljb24gPSBSZWFjdC5tZW1vKGZ1bmN0aW9uIEdlbnJlSWNvbih7IG5hbWUsIHNpemUgPSAyMCwgY2xhc3NOYW1lID0gJycgfTogeyBuYW1lOiBzdHJpbmc7IHNpemU/OiBudW1iZXI7IGNsYXNzTmFtZT86IHN0cmluZyB9KSB7XG4gIGNvbnN0IEljb25NYXA6IGFueSA9IHsgRmxhbWUsIENvbXBhc3MsIENsYXBwZXJib2FyZCwgTGF1Z2g6IFNtaWxlLCBGaW5nZXJwcmludCwgQ2FtZXJhLCBTdGFyLCBVc2VycywgV2FuZDIsIExhbmRtYXJrLCBTa3VsbCwgTXVzaWMsIFNlYXJjaCwgSGVhcnQsIFJvY2tldCwgWmFwLCBTaGllbGQsIEJhYnksIE5ld3NwYXBlciwgVHYsIFNwYXJrbGVzLCBNaWMgfTtcbiAgY29uc3QgSWNvbiA9IEljb25NYXBbbmFtZV0gfHwgRmlsbTtcbiAgcmV0dXJuIDxJY29uIHNpemU9e3NpemV9IGNsYXNzTmFtZT17Y2xhc3NOYW1lfSAvPjtcbn0pO1xuXG5mdW5jdGlvbiBHZW5yZUNhdGFsb2d1ZVZpZXcoe1xuICBzZWxlY3RlZEdlbnJlLFxuICBnZW5yZUltYWdlcyxcbiAgZ2VucmVUeXBlRmlsdGVyLFxuICBoYW5kbGVTZXRHZW5yZVR5cGUsXG4gIHNob3dzLFxuICBsb2FkaW5nLFxuICBpc0ZldGNoaW5nTW9yZSxcbiAgY291bnRyeSxcbiAgbGFzdEVsZW1lbnRSZWYsXG4gIG9uU2VsZWN0TW92aWUsXG4gIGlzRmF2b3JpdGUsXG4gIHRvZ2dsZUZhdm9yaXRlLFxuICBvbkJhY2ssXG59OiBhbnkpIHtcbiAgY29uc3QgYmFja2Ryb3BJbWFnZSA9IFxuICAgIChzZWxlY3RlZEdlbnJlLm1vdmllSWQgJiYgZ2VucmVJbWFnZXNbYG1vdmllXyR7c2VsZWN0ZWRHZW5yZS5tb3ZpZUlkfWBdKSB8fCBcbiAgICAoc2VsZWN0ZWRHZW5yZS50dklkICYmIGdlbnJlSW1hZ2VzW2B0dl8ke3NlbGVjdGVkR2VucmUudHZJZH1gXSkgfHwgXG4gICAgc2VsZWN0ZWRHZW5yZS5pbWFnZSB8fCBcbiAgICBERUZBVUxUX0dFTlJFX0lNQUdFU1tgbW92aWVfJHtzZWxlY3RlZEdlbnJlLm1vdmllSWR9YF0gfHxcbiAgICBERUZBVUxUX0dFTlJFX0lNQUdFU1tgdHZfJHtzZWxlY3RlZEdlbnJlLnR2SWR9YF07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBwYi0yOCBtZDpwYi0yMFwiPlxuICAgICAgey8qIFJlZmluZWQgTGlxdWlkIEdsYXNzIENhdGVnb3J5IEhlYWRlciAoRmFzdCwgSW5zdGFudCwgTm8gUHVsbC1Eb3duIFpvb20pICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBvdmVyZmxvdy1oaWRkZW4gYm9yZGVyLWIgYm9yZGVyLXdoaXRlLzEwIGJnLVsjMEUxMDE1XSBweS04IHNtOnB5LTEyXCI+XG4gICAgICAgIHsvKiBTdWJ0bGUgQW1iaWVudCBCYWNrZ3JvdW5kIEFydHdvcmsgKi99XG4gICAgICAgIHtiYWNrZHJvcEltYWdlICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgcG9pbnRlci1ldmVudHMtbm9uZSBvcGFjaXR5LTIwIGZpbHRlciBibHVyLTJ4bCB0cmFuc2Zvcm0gc2NhbGUtMTEwXCI+XG4gICAgICAgICAgICA8aW1nIFxuICAgICAgICAgICAgICBzcmM9e2JhY2tkcm9wSW1hZ2V9IFxuICAgICAgICAgICAgICBhbHQ9e3NlbGVjdGVkR2VucmUubmFtZX0gXG4gICAgICAgICAgICAgIGRlY29kaW5nPVwiYXN5bmNcIiBcbiAgICAgICAgICAgICAgbG9hZGluZz1cImxhenlcIiBcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGgtZnVsbCBvYmplY3QtY292ZXJcIiBcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCBiZy1ncmFkaWVudC10by1iIGZyb20tWyMwRTEwMTVdLzgwIHZpYS1bIzBFMTAxNV0vOTUgdG8tWyMwRTEwMTVdIHBvaW50ZXItZXZlbnRzLW5vbmVcIiAvPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgei0xMCBweC00IHNtOnB4LTYgbWQ6cHgtOCBsZzpweC0xMiB4bDpweC0xNiBtYXgtdy1bMTYwMHB4XSBteC1hdXRvXCI+XG4gICAgICAgICAgey8qIEJhY2sgQWN0aW9uICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItNlwiPlxuICAgICAgICAgICAgPEdsYXNzQnV0dG9uIHZhcmlhbnQ9XCJzZWNvbmRhcnlcIiBzaXplPVwic21cIiBvbkNsaWNrPXtvbkJhY2t9IGNsYXNzTmFtZT1cInNoYWRvdy1sZ1wiPlxuICAgICAgICAgICAgICA8Q2hldnJvbkxlZnQgc2l6ZT17MTZ9IC8+IEJhY2sgdG8gQWxsIEdlbnJlc1xuICAgICAgICAgICAgPC9HbGFzc0J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBtZDpmbGV4LXJvdyBtZDppdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGdhcC02XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC00IHNtOmdhcC01XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xNCBoLTE0IHNtOnctMTYgc206aC0xNiByb3VuZGVkLTJ4bCBiZy13aGl0ZS8xMCBiYWNrZHJvcC1ibHVyLXhsIGJvcmRlciBib3JkZXItd2hpdGUvMjAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgc2hhZG93LVtpbnNldF8wXzJweF80cHhfcmdiYSgyNTUsMjU1LDI1NSwwLjIpLDBfOHB4XzI0cHhfcmdiYSgwLDAsMCwwLjUpXSBzaHJpbmstMFwiPlxuICAgICAgICAgICAgICAgIDxHZW5yZUljb24gbmFtZT17c2VsZWN0ZWRHZW5yZS5pY29uTmFtZX0gc2l6ZT17MzB9IGNsYXNzTmFtZT1cInRleHQtYW1iZXItNTAwIGRyb3Atc2hhZG93LW1kXCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtMnhsIHNtOnRleHQtM3hsIG1kOnRleHQtNHhsIGZvbnQtZXh0cmFib2xkIHRleHQtd2hpdGUgdHJhY2tpbmctdGlnaHQgbGVhZGluZy1ub25lIGRyb3Atc2hhZG93LW1kIG1iLTEuNVwiPlxuICAgICAgICAgICAgICAgICAge3NlbGVjdGVkR2VucmUubmFtZX1cbiAgICAgICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgc206dGV4dC1zbSB0ZXh0LXdoaXRlLzYwIGZvbnQtbWVkaXVtIHRyYWNraW5nLXdpZGUgbWF4LXcteGxcIj5cbiAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZEdlbnJlLmRlc2NyaXB0aW9ufVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIENvbnRlbnQgVHlwZSBGaWx0ZXIgVGFicyAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgYmctYmxhY2svNDAgYmFja2Ryb3AtYmx1ci14bCBwLTEuNSByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLXdoaXRlLzEwIHNlbGYtc3RhcnQgbWQ6c2VsZi1hdXRvIHNoYWRvdy1tZFwiPlxuICAgICAgICAgICAgICB7KFsnYWxsJywgJ21vdmllJywgJ3NlcmllcyddIGFzIGNvbnN0KS5tYXAoKHQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGFiZWwgPSB0ID09PSAnYWxsJyA/ICdBbGwnIDogdCA9PT0gJ21vdmllJyA/ICdNb3ZpZXMnIDogJ1RWIFNlcmllcyc7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlID0gZ2VucmVUeXBlRmlsdGVyID09PSB0O1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIGtleT17YCR7dH0tJHtpbmRleH1gfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVTZXRHZW5yZVR5cGUodCl9XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTQgcHktMS41IHRleHQteHMgc206dGV4dC1zbSBmb250LXNlbWlib2xkIHJvdW5kZWQteGwgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMjAwIGN1cnNvci1wb2ludGVyICR7XG4gICAgICAgICAgICAgICAgICAgICAgYWN0aXZlXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1hbWJlci01MDAgdGV4dC1ibGFjayBzaGFkb3ctbWQgZm9udC1ib2xkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgOiAndGV4dC13aGl0ZS82MCBob3Zlcjp0ZXh0LXdoaXRlIGhvdmVyOmJnLXdoaXRlLzUnXG4gICAgICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogMi4gR2VucmUgQ2F0YWxvZ3VlIFNob3dzIEdyaWQgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTQgc206cHgtNiBtZDpweC04IGxnOnB4LTEyIHhsOnB4LTE2IG1heC13LVsxNjAwcHhdIG14LWF1dG8gcHQtOFwiPlxuICAgICAgICB7bG9hZGluZyAmJiBzaG93cy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIHNtOmdyaWQtY29scy0zIG1kOmdyaWQtY29scy00IGxnOmdyaWQtY29scy01IHhsOmdyaWQtY29scy02IGdhcC0zIHNtOmdhcC02IGNvbnRlbnQtYXV0b1wiPlxuICAgICAgICAgICAge0FycmF5LmZyb20oeyBsZW5ndGg6IDEyIH0pLm1hcCgoXywgaSkgPT4gKFxuICAgICAgICAgICAgICA8U2tlbGV0b25DYXJkIGtleT17aX0gLz5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogc2hvd3MubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgcHktMjAgdGV4dC13aGl0ZS81MFwiPk5vIHRpdGxlcyBmb3VuZCBpbiB0aGlzIGNhdGVnb3J5LjwvZGl2PlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBzbTpncmlkLWNvbHMtMyBtZDpncmlkLWNvbHMtNCBsZzpncmlkLWNvbHMtNSB4bDpncmlkLWNvbHMtNiBnYXAtMyBzbTpnYXAtNiBjb250ZW50LWF1dG9cIj5cbiAgICAgICAgICAgIHtzaG93cy5tYXAoKHNob3c6IFNob3csIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgaXNMYXN0ID0gaW5kZXggPT09IHNob3dzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGRpdiBrZXk9e2Ake3Nob3cuaWR9LSR7aW5kZXh9YH0gcmVmPXtpc0xhc3QgPyBsYXN0RWxlbWVudFJlZiA6IG51bGx9PlxuICAgICAgICAgICAgICAgICAgPE1vdmllQ2FyZCBcbiAgICAgICAgICAgICAgICAgICAgc2hvdz17c2hvd30gXG4gICAgICAgICAgICAgICAgICAgIGNvdW50cnk9e2NvdW50cnl9XG4gICAgICAgICAgICAgICAgICAgIHBsYXRmb3JtSWQ9e3VuZGVmaW5lZH0gXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2VsZWN0TW92aWUoc2hvdy5pZCl9IFxuICAgICAgICAgICAgICAgICAgICBpc0Zhdm9yaXRlPXtpc0Zhdm9yaXRlKHNob3cuaWQpfSBcbiAgICAgICAgICAgICAgICAgICAgb25Ub2dnbGVGYXZvcml0ZT17dG9nZ2xlRmF2b3JpdGV9IFxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAge2lzRmV0Y2hpbmdNb3JlICYmIChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc3Bhbi1mdWxsIGZsZXgganVzdGlmeS1jZW50ZXIgcHktOFwiPlxuICAgICAgICAgICAgICAgIDxMb2FkZXIyIGNsYXNzTmFtZT1cInctOCBoLTggYW5pbWF0ZS1zcGluIHRleHQtYW1iZXItNTAwXCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmZ1bmN0aW9uIFNlYXJjaFBhZ2UoeyBjb3VudHJ5LCBzZWFyY2hRdWVyeSwgc2V0U2VhcmNoUXVlcnksIG9uU2VsZWN0TW92aWUsIGlzRmF2b3JpdGUsIHRvZ2dsZUZhdm9yaXRlIH06IGFueSkge1xuICBjb25zdCBbc2VsZWN0ZWRHZW5yZSwgc2V0U2VsZWN0ZWRHZW5yZV0gPSB1c2VTdGF0ZTxVbmlmaWVkR2VucmUgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2dlbnJlSW1hZ2VzXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KERFRkFVTFRfR0VOUkVfSU1BR0VTKTtcbiAgY29uc3QgW3NlYXJjaFR5cGVGaWx0ZXIsIHNldFNlYXJjaFR5cGVGaWx0ZXJdID0gdXNlU3RhdGU8J2FsbCcgfCAnbW92aWUnIHwgJ3Nlcmllcyc+KCdhbGwnKTtcbiAgY29uc3QgW3NlYXJjaFNvcnQsIHNldFNlYXJjaFNvcnRdID0gdXNlU3RhdGU8J2RlZmF1bHQnIHwgJ3JhdGluZycgfCAnbmV3ZXN0Jz4oJ2RlZmF1bHQnKTtcbiAgY29uc3QgW3NlYXJjaE1pblJhdGluZywgc2V0U2VhcmNoTWluUmF0aW5nXSA9IHVzZVN0YXRlPG51bWJlcj4oMCk7XG4gIGNvbnN0IFtzZWFyY2hHZW5yZUZpbHRlciwgc2V0U2VhcmNoR2VucmVGaWx0ZXJdID0gdXNlU3RhdGU8VW5pZmllZEdlbnJlIHwgbnVsbD4obnVsbCk7XG5cbiAgY29uc3Qgc3luY0dlbnJlRnJvbVVybCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCBwYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIGNvbnN0IHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gICAgY29uc3QgdHlwZVBhcmFtID0gc2VhcmNoUGFyYW1zLmdldCgndHlwZScpO1xuICAgIGlmICh0eXBlUGFyYW0gPT09ICdtb3ZpZScgfHwgdHlwZVBhcmFtID09PSAnc2VyaWVzJyB8fCB0eXBlUGFyYW0gPT09ICdhbGwnKSB7XG4gICAgICBzZXRHZW5yZVR5cGVGaWx0ZXIodHlwZVBhcmFtIGFzICdhbGwnIHwgJ21vdmllJyB8ICdzZXJpZXMnKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVQYXJhbSA9PT0gJ3R2Jykge1xuICAgICAgc2V0R2VucmVUeXBlRmlsdGVyKCdzZXJpZXMnKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHBhdGguc3RhcnRzV2l0aCgnL2dlbnJlLycpKSB7XG4gICAgICBjb25zdCBzbHVnID0gcGF0aC5zcGxpdCgnLycpWzJdO1xuICAgICAgaWYgKHNsdWcpIHtcbiAgICAgICAgY29uc3QgY2F0ID0gR0VOUkVfTElTVC5maW5kKGcgPT4gZy5pZCA9PT0gc2x1Zyk7XG4gICAgICAgIGlmIChjYXQpIHtcbiAgICAgICAgICBzZXRTZWxlY3RlZEdlbnJlKGNhdCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHNldFNlbGVjdGVkR2VucmUobnVsbCk7XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHN5bmNHZW5yZUZyb21VcmwoKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCBzeW5jR2VucmVGcm9tVXJsKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgc3luY0dlbnJlRnJvbVVybCk7XG4gIH0sIFtzeW5jR2VucmVGcm9tVXJsXSk7XG5cbiAgY29uc3QgaGFuZGxlU2VsZWN0R2VucmUgPSAoZ2VucmU6IFVuaWZpZWRHZW5yZSkgPT4ge1xuICAgIHNldFNlbGVjdGVkR2VucmUoZ2VucmUpO1xuICAgIHNldEdlbnJlVHlwZUZpbHRlcignYWxsJyk7XG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCAnJywgYC9nZW5yZS8ke2dlbnJlLmlkfWApO1xuICB9O1xuXG4gIGNvbnN0IFtnZW5yZVR5cGVGaWx0ZXIsIHNldEdlbnJlVHlwZUZpbHRlcl0gPSB1c2VTdGF0ZTwnYWxsJyB8ICdtb3ZpZScgfCAnc2VyaWVzJz4oJ2FsbCcpO1xuICBcbiAgY29uc3QgaGFuZGxlU2V0R2VucmVUeXBlID0gKHR5cGU6ICdhbGwnIHwgJ21vdmllJyB8ICdzZXJpZXMnKSA9PiB7XG4gICAgc2V0R2VucmVUeXBlRmlsdGVyKHR5cGUpO1xuICAgIGlmIChzZWxlY3RlZEdlbnJlKSB7XG4gICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe30sICcnLCBgL2dlbnJlLyR7c2VsZWN0ZWRHZW5yZS5pZH0/dHlwZT0ke3R5cGV9YCk7XG4gICAgfVxuICB9O1xuICBcbiAgY29uc3QgW3Nob3dzLCBzZXRTaG93c10gPSB1c2VTdGF0ZTxTaG93W10+KFtdKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaGFzTW9yZSwgc2V0SGFzTW9yZV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtuZXh0Q3Vyc29yLCBzZXROZXh0Q3Vyc29yXSA9IHVzZVN0YXRlPHN0cmluZyB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgY29uc3QgW2lzRmV0Y2hpbmdNb3JlLCBzZXRJc0ZldGNoaW5nTW9yZV0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IGFjdGl2ZUFib3J0UmVmID0gdXNlUmVmPEFib3J0Q29udHJvbGxlciB8IG51bGw+KG51bGwpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHNlYXJjaFF1ZXJ5Py50cmltKCkpIHtcbiAgICAgIHNldFNlbGVjdGVkR2VucmUobnVsbCk7XG4gICAgfVxuICB9LCBbc2VhcmNoUXVlcnldKTtcblxuICBjb25zdCBzZWFyY2hNZW1DYWNoZSA9IHVzZVJlZjxNYXA8c3RyaW5nLCB7IHNob3dzOiBTaG93W107IGhhc01vcmU6IGJvb2xlYW47IG5leHRDdXJzb3I/OiBzdHJpbmcgfT4+KG5ldyBNYXAoKSk7XG5cbiAgY29uc3QgbG9hZERhdGEgPSB1c2VDYWxsYmFjaygocmVzZXQgPSBmYWxzZSkgPT4ge1xuICAgIGNvbnN0IGlzU2VhcmNoID0gISFzZWFyY2hRdWVyeT8udHJpbSgpO1xuICAgIGlmICghaXNTZWFyY2ggJiYgIXNlbGVjdGVkR2VucmUpIHtcbiAgICAgIHNldFNob3dzKFtdKTtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNhY2hlS2V5ID0gaXNTZWFyY2hcbiAgICAgID8gYHNlYXJjaF8ke3NlYXJjaFF1ZXJ5LnRyaW0oKS50b0xvd2VyQ2FzZSgpfV8ke3NlYXJjaFR5cGVGaWx0ZXJ9XyR7c2VhcmNoR2VucmVGaWx0ZXI/LmlkIHx8ICdhbGwnfV8ke2NvdW50cnl9XyR7cmVzZXQgPyAnaW5pdCcgOiBuZXh0Q3Vyc29yIHx8ICcnfWBcbiAgICAgIDogYGdlbnJlXyR7c2VsZWN0ZWRHZW5yZT8uaWR9XyR7Z2VucmVUeXBlRmlsdGVyfV8ke2NvdW50cnl9XyR7cmVzZXQgPyAnaW5pdCcgOiBuZXh0Q3Vyc29yIHx8ICcnfWA7XG5cbiAgICBpZiAocmVzZXQgJiYgc2VhcmNoTWVtQ2FjaGUuY3VycmVudC5oYXMoY2FjaGVLZXkpKSB7XG4gICAgICBjb25zdCBjYWNoZWQgPSBzZWFyY2hNZW1DYWNoZS5jdXJyZW50LmdldChjYWNoZUtleSkhO1xuICAgICAgc2V0U2hvd3MoY2FjaGVkLnNob3dzKTtcbiAgICAgIHNldEhhc01vcmUoY2FjaGVkLmhhc01vcmUpO1xuICAgICAgc2V0TmV4dEN1cnNvcihjYWNoZWQubmV4dEN1cnNvcik7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocmVzZXQpIHtcbiAgICAgIGlmIChhY3RpdmVBYm9ydFJlZi5jdXJyZW50KSB7XG4gICAgICAgIGFjdGl2ZUFib3J0UmVmLmN1cnJlbnQuYWJvcnQoKTtcbiAgICAgIH1cbiAgICAgIGFjdGl2ZUFib3J0UmVmLmN1cnJlbnQgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICBzZXRMb2FkaW5nKHRydWUpO1xuICAgICAgc2V0U2hvd3MoW10pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRJc0ZldGNoaW5nTW9yZSh0cnVlKTtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50Q29udHJvbGxlciA9IGFjdGl2ZUFib3J0UmVmLmN1cnJlbnQ7XG5cbiAgICBpZiAoaXNTZWFyY2gpIHtcbiAgICAgIGNvbnN0IGFjdGl2ZUdlbnJlID0gc2VhcmNoR2VucmVGaWx0ZXI7XG4gICAgICBzZWFyY2hUaXRsZSh7XG4gICAgICAgIHRpdGxlOiBzZWFyY2hRdWVyeS50cmltKCksXG4gICAgICAgIGNvdW50cnksXG4gICAgICAgIHNob3dfdHlwZTogc2VhcmNoVHlwZUZpbHRlciA9PT0gJ2FsbCcgPyB1bmRlZmluZWQgOiBzZWFyY2hUeXBlRmlsdGVyLFxuICAgICAgICBjdXJzb3I6IHJlc2V0ID8gdW5kZWZpbmVkIDogbmV4dEN1cnNvcixcbiAgICAgICAgLi4uKGFjdGl2ZUdlbnJlID8geyBtb3ZpZV9nZW5yZTogYWN0aXZlR2VucmUubW92aWVJZCwgdHZfZ2VucmU6IGFjdGl2ZUdlbnJlLnR2SWQgfSA6IHt9KVxuICAgICAgfSwgY3VycmVudENvbnRyb2xsZXI/LnNpZ25hbClcbiAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICBzZXRTaG93cyhwcmV2ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSByZXNldCA/IHJlcy5zaG93cyA6IFsuLi5wcmV2LCAuLi5yZXMuc2hvd3NdO1xuICAgICAgICAgICAgc2VhcmNoTWVtQ2FjaGUuY3VycmVudC5zZXQoY2FjaGVLZXksIHsgc2hvd3M6IHVwZGF0ZWQsIGhhc01vcmU6IHJlcy5oYXNNb3JlLCBuZXh0Q3Vyc29yOiByZXMubmV4dEN1cnNvciB9KTtcbiAgICAgICAgICAgIHJldHVybiB1cGRhdGVkO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNldEhhc01vcmUocmVzLmhhc01vcmUpO1xuICAgICAgICAgIHNldE5leHRDdXJzb3IocmVzLm5leHRDdXJzb3IpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBpZiAoZXJyLm5hbWUgIT09ICdBYm9ydEVycm9yJykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlNlYXJjaCBlcnJvcjpcIiwgZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgICBzZXRJc0ZldGNoaW5nTW9yZShmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoc2VsZWN0ZWRHZW5yZSkge1xuICAgICAgZmV0Y2hCeUdlbnJlKHNlbGVjdGVkR2VucmUubW92aWVJZCwgc2VsZWN0ZWRHZW5yZS50dklkLCBnZW5yZVR5cGVGaWx0ZXIsIGNvdW50cnksIHJlc2V0ID8gdW5kZWZpbmVkIDogbmV4dEN1cnNvcilcbiAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICBzZXRTaG93cyhwcmV2ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSByZXNldCA/IHJlcy5zaG93cyA6IFsuLi5wcmV2LCAuLi5yZXMuc2hvd3NdO1xuICAgICAgICAgICAgc2VhcmNoTWVtQ2FjaGUuY3VycmVudC5zZXQoY2FjaGVLZXksIHsgc2hvd3M6IHVwZGF0ZWQsIGhhc01vcmU6IHJlcy5oYXNNb3JlLCBuZXh0Q3Vyc29yOiByZXMubmV4dEN1cnNvciB9KTtcbiAgICAgICAgICAgIHJldHVybiB1cGRhdGVkO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNldEhhc01vcmUocmVzLmhhc01vcmUpO1xuICAgICAgICAgIHNldE5leHRDdXJzb3IocmVzLm5leHRDdXJzb3IpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goY29uc29sZS5lcnJvcilcbiAgICAgICAgLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgICAgIHNldElzRmV0Y2hpbmdNb3JlKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LCBbc2VhcmNoUXVlcnksIHNlbGVjdGVkR2VucmUsIGdlbnJlVHlwZUZpbHRlciwgc2VhcmNoVHlwZUZpbHRlciwgc2VhcmNoR2VucmVGaWx0ZXIsIGNvdW50cnksIG5leHRDdXJzb3JdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBsb2FkRGF0YSh0cnVlKTtcbiAgICB9LCBzZWFyY2hRdWVyeSA/IDE1MCA6IDApO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIH07XG4gIH0sIFtzZWFyY2hRdWVyeSwgc2VsZWN0ZWRHZW5yZSwgZ2VucmVUeXBlRmlsdGVyLCBzZWFyY2hUeXBlRmlsdGVyLCBzZWFyY2hHZW5yZUZpbHRlciwgY291bnRyeV0pO1xuXG4gIC8vIENsaWVudC1zaWRlIGZpbHRlcmluZyAmIHNvcnRpbmcgZm9yIGluc3RhbnQgcmVmaW5lbWVudFxuICBjb25zdCBwcm9jZXNzZWRTaG93cyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGxldCByZXN1bHQgPSBbLi4uc2hvd3NdO1xuXG4gICAgLy8gRmlsdGVyIGJ5IHJhdGluZ1xuICAgIGlmIChzZWFyY2hNaW5SYXRpbmcgPiAwKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHQuZmlsdGVyKHMgPT4gKHMucmF0aW5nIHx8IDApID49IHNlYXJjaE1pblJhdGluZyk7XG4gICAgfVxuXG4gICAgLy8gU29ydFxuICAgIGlmIChzZWFyY2hTb3J0ID09PSAncmF0aW5nJykge1xuICAgICAgcmVzdWx0LnNvcnQoKGEsIGIpID0+IChiLnJhdGluZyB8fCAwKSAtIChhLnJhdGluZyB8fCAwKSk7XG4gICAgfSBlbHNlIGlmIChzZWFyY2hTb3J0ID09PSAnbmV3ZXN0Jykge1xuICAgICAgcmVzdWx0LnNvcnQoKGEsIGIpID0+IChiLnJlbGVhc2VZZWFyIHx8IDApIC0gKGEucmVsZWFzZVllYXIgfHwgMCkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sIFtzaG93cywgc2VhcmNoTWluUmF0aW5nLCBzZWFyY2hTb3J0XSk7XG5cbiAgY29uc3Qgb2JzZXJ2ZXIgPSB1c2VSZWY8SW50ZXJzZWN0aW9uT2JzZXJ2ZXIgfCBudWxsPihudWxsKTtcbiAgY29uc3QgbGFzdEVsZW1lbnRSZWYgPSB1c2VDYWxsYmFjaygobm9kZTogYW55KSA9PiB7XG4gICAgaWYgKGxvYWRpbmcgfHwgaXNGZXRjaGluZ01vcmUpIHJldHVybjtcbiAgICBpZiAob2JzZXJ2ZXIuY3VycmVudCkgb2JzZXJ2ZXIuY3VycmVudC5kaXNjb25uZWN0KCk7XG4gICAgb2JzZXJ2ZXIuY3VycmVudCA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihlbnRyaWVzID0+IHtcbiAgICAgIGlmIChlbnRyaWVzWzBdLmlzSW50ZXJzZWN0aW5nICYmIGhhc01vcmUpIHtcbiAgICAgICAgbG9hZERhdGEoZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChub2RlKSBvYnNlcnZlci5jdXJyZW50Lm9ic2VydmUobm9kZSk7XG4gIH0sIFtsb2FkaW5nLCBpc0ZldGNoaW5nTW9yZSwgaGFzTW9yZSwgbG9hZERhdGFdKTtcblxuICBjb25zdCBpc1NlYXJjaEFjdGl2ZSA9ICEhc2VhcmNoUXVlcnk/LnRyaW0oKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicHQtMjAgbWQ6cHQtMzIgcHgtNCBzbTpweC02IG1kOnB4LTggbGc6cHgtMTIgeGw6cHgtMTYgbWF4LXctWzE2MDBweF0gbXgtYXV0byBtaW4taC1zY3JlZW4gcGItMjggbWQ6cGItMjBcIj5cbiAgICAgIHsvKiBDYXNlIDE6IEFjdGl2ZSBTZWFyY2ggUXVlcnkgKi99XG4gICAgICB7aXNTZWFyY2hBY3RpdmUgPyAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgey8qIFNlYXJjaCBIZWFkZXIgQmFyICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBtZDpmbGV4LXJvdyBtZDppdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGdhcC00IG1iLTYgcGItNCBib3JkZXItYiBib3JkZXItd2hpdGUvMTBcIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICA8U2VhcmNoIHNpemU9ezIyfSBjbGFzc05hbWU9XCJ0ZXh0LWFtYmVyLTUwMFwiIC8+XG4gICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQteGwgc206dGV4dC0yeGwgZm9udC1ib2xkIHRyYWNraW5nLXRpZ2h0IHRleHQtd2hpdGVcIj5cbiAgICAgICAgICAgICAgICAgIFJlc3VsdHMgZm9yIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtYW1iZXItNTAwXCI+XCJ7c2VhcmNoUXVlcnl9XCI8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgICAgICB7IWxvYWRpbmcgJiYgKFxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBiZy13aGl0ZS8xMCB0ZXh0LXdoaXRlLzcwIHB4LTIuNSBweS0wLjUgcm91bmRlZC1mdWxsIGZvbnQtbWVkaXVtXCI+XG4gICAgICAgICAgICAgICAgICAgIHtwcm9jZXNzZWRTaG93cy5sZW5ndGh9IHtwcm9jZXNzZWRTaG93cy5sZW5ndGggPT09IDEgPyAndGl0bGUnIDogJ3RpdGxlcyd9XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIHtzZWFyY2hHZW5yZUZpbHRlciAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiBtdC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC13aGl0ZS81MFwiPkZpbHRlcmVkIGJ5Ojwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSB0ZXh0LXhzIGJnLWFtYmVyLTUwMC8yMCB0ZXh0LWFtYmVyLTMwMCBib3JkZXIgYm9yZGVyLWFtYmVyLTUwMC8zMCBweC0yIHB5LTAuNSByb3VuZGVkLWZ1bGxcIj5cbiAgICAgICAgICAgICAgICAgICAge3NlYXJjaEdlbnJlRmlsdGVyLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0U2VhcmNoR2VucmVGaWx0ZXIobnVsbCl9IGNsYXNzTmFtZT1cImhvdmVyOnRleHQtd2hpdGUgbWwtMC41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPFggc2l6ZT17MTJ9IC8+XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBGaWx0ZXIgQ29udHJvbHMgUm93ICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgey8qIFR5cGUgU2VsZWN0b3IgKEFsbCAvIE1vdmllcyAvIFNob3dzKSAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBiZy13aGl0ZS81IGJvcmRlciBib3JkZXItd2hpdGUvMTAgcm91bmRlZC1mdWxsIHAtMC41IHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICB7KFsnYWxsJywgJ21vdmllJywgJ3NlcmllcyddIGFzIGNvbnN0KS5tYXAoKHQsIGluZGV4KSA9PiAoXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIGtleT17YCR7dH0tJHtpbmRleH1gfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTZWFyY2hUeXBlRmlsdGVyKHQpfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEuNSByb3VuZGVkLWZ1bGwgZm9udC1tZWRpdW0gdHJhbnNpdGlvbi1jb2xvcnMgY3Vyc29yLXBvaW50ZXIgJHtcbiAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hUeXBlRmlsdGVyID09PSB0ID8gJ2JnLWFtYmVyLTUwMCB0ZXh0LWJsYWNrIGZvbnQtc2VtaWJvbGQnIDogJ3RleHQtd2hpdGUvNjAgaG92ZXI6dGV4dC13aGl0ZSdcbiAgICAgICAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHt0ID09PSAnYWxsJyA/ICdBbGwnIDogdCA9PT0gJ21vdmllJyA/ICdNb3ZpZXMnIDogJ1RWIFNob3dzJ31cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICB7LyogU29ydCBTZWxlY3RvciAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBiZy13aGl0ZS81IGJvcmRlciBib3JkZXItd2hpdGUvMTAgcm91bmRlZC1mdWxsIHAtMC41IHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTZWFyY2hTb3J0KCdkZWZhdWx0Jyl9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEuNSByb3VuZGVkLWZ1bGwgZm9udC1tZWRpdW0gdHJhbnNpdGlvbi1jb2xvcnMgY3Vyc29yLXBvaW50ZXIgJHtcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoU29ydCA9PT0gJ2RlZmF1bHQnID8gJ2JnLXdoaXRlLzIwIHRleHQtd2hpdGUnIDogJ3RleHQtd2hpdGUvNjAgaG92ZXI6dGV4dC13aGl0ZSdcbiAgICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIEJlc3QgTWF0Y2hcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTZWFyY2hTb3J0KCdyYXRpbmcnKX1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMS41IHJvdW5kZWQtZnVsbCBmb250LW1lZGl1bSB0cmFuc2l0aW9uLWNvbG9ycyBjdXJzb3ItcG9pbnRlciAke1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hTb3J0ID09PSAncmF0aW5nJyA/ICdiZy13aGl0ZS8yMCB0ZXh0LXdoaXRlJyA6ICd0ZXh0LXdoaXRlLzYwIGhvdmVyOnRleHQtd2hpdGUnXG4gICAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBUb3AgUmF0ZWRcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTZWFyY2hTb3J0KCduZXdlc3QnKX1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMS41IHJvdW5kZWQtZnVsbCBmb250LW1lZGl1bSB0cmFuc2l0aW9uLWNvbG9ycyBjdXJzb3ItcG9pbnRlciAke1xuICAgICAgICAgICAgICAgICAgICBzZWFyY2hTb3J0ID09PSAnbmV3ZXN0JyA/ICdiZy13aGl0ZS8yMCB0ZXh0LXdoaXRlJyA6ICd0ZXh0LXdoaXRlLzYwIGhvdmVyOnRleHQtd2hpdGUnXG4gICAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBOZXdlc3RcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgey8qIE1pbiBSYXRpbmcgRmlsdGVyICovfVxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2VhcmNoTWluUmF0aW5nKHByZXYgPT4gKHByZXYgPT09IDAgPyA3MCA6IHByZXYgPT09IDcwID8gODAgOiAwKSl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMyBweS0xLjUgcm91bmRlZC1mdWxsIHRleHQteHMgZm9udC1tZWRpdW0gYm9yZGVyIHRyYW5zaXRpb24tY29sb3JzIGN1cnNvci1wb2ludGVyIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xICR7XG4gICAgICAgICAgICAgICAgICBzZWFyY2hNaW5SYXRpbmcgPiAwXG4gICAgICAgICAgICAgICAgICAgID8gJ2JnLWFtYmVyLTUwMC8yMCB0ZXh0LWFtYmVyLTMwMCBib3JkZXItYW1iZXItNTAwLzQwJ1xuICAgICAgICAgICAgICAgICAgICA6ICdiZy13aGl0ZS81IHRleHQtd2hpdGUvNjAgYm9yZGVyLXdoaXRlLzEwIGhvdmVyOnRleHQtd2hpdGUnXG4gICAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICAgICAgdGl0bGU9XCJGaWx0ZXIgYnkgcmF0aW5nXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxTdGFyIHNpemU9ezEyfSBjbGFzc05hbWU9e3NlYXJjaE1pblJhdGluZyA+IDAgPyBcImZpbGwtYW1iZXItNDAwIHRleHQtYW1iZXItNDAwXCIgOiBcIlwifSAvPlxuICAgICAgICAgICAgICAgIHtzZWFyY2hNaW5SYXRpbmcgPT09IDAgPyAnQW55IFJhdGluZycgOiBgJHtzZWFyY2hNaW5SYXRpbmd9JSsgT25seWB9XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBzZXRTZWFyY2hRdWVyeT8uKCcnKTtcbiAgICAgICAgICAgICAgICAgIHNldFNlYXJjaEdlbnJlRmlsdGVyKG51bGwpO1xuICAgICAgICAgICAgICAgICAgc2V0U2VhcmNoTWluUmF0aW5nKDApO1xuICAgICAgICAgICAgICAgICAgc2V0U2VhcmNoU29ydCgnZGVmYXVsdCcpO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXdoaXRlLzYwIGhvdmVyOnRleHQtd2hpdGUgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEgZ2xhc3Mtc3VidGxlIHB4LTMgcHktMS41IHJvdW5kZWQtZnVsbCBjdXJzb3ItcG9pbnRlciB0cmFuc2l0aW9uLWNvbG9yc1wiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8WCBzaXplPXsxM30gLz5cbiAgICAgICAgICAgICAgICBDbGVhclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAge2xvYWRpbmcgJiYgc2hvd3MubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIHNtOmdyaWQtY29scy0zIG1kOmdyaWQtY29scy00IGxnOmdyaWQtY29scy01IHhsOmdyaWQtY29scy02IGdhcC0zIHNtOmdhcC02IGNvbnRlbnQtYXV0b1wiPlxuICAgICAgICAgICAge0FycmF5LmZyb20oeyBsZW5ndGg6IDEyIH0pLm1hcCgoXywgaSkgPT4gKFxuICAgICAgICAgICAgICA8U2tlbGV0b25DYXJkIGtleT17aX0gLz5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiBwcm9jZXNzZWRTaG93cy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyIHB5LTIwIGdsYXNzLXN1YnRsZSByb3VuZGVkLTN4bCBwLTggbWF4LXctbGcgbXgtYXV0b1wiPlxuICAgICAgICAgICAgICA8U2VhcmNoIHNpemU9ezQwfSBjbGFzc05hbWU9XCJteC1hdXRvIHRleHQtd2hpdGUvMjAgbWItM1wiIC8+XG4gICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtbWVkaXVtIHRleHQtd2hpdGUgbWItMVwiPk5vIG1hdGNoZXMgZm91bmQ8L2gzPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtd2hpdGUvNTAgbWF4LXctbWQgbXgtYXV0byBtYi02XCI+XG4gICAgICAgICAgICAgICAgV2UgY291bGRuJ3QgZmluZCBhbnkgcmVzdWx0cyBtYXRjaGluZyBcIntzZWFyY2hRdWVyeX1cIiB3aXRoIHRoZSBjdXJyZW50IGZpbHRlcnMuXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1hbWJlci00MDAgZm9udC1zZW1pYm9sZCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXJcIj5cbiAgICAgICAgICAgICAgICAgIFBvcHVsYXIgc2VhcmNoZXMgeW91IG1pZ2h0IGxpa2VcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC13cmFwIGp1c3RpZnktY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICB7WydEdW5lJywgJ0FyY2FuZScsICdBdmVuZ2VycycsICdTdHJhbmdlciBUaGluZ3MnLCAnU3BpZGVyLU1hbicsICdEZWFkcG9vbCcsICdGYWxsb3V0JywgJ09wcGVuaGVpbWVyJ10ubWFwKCh0LCBpbmRleCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAga2V5PXtgJHt0fS0ke2luZGV4fWB9XG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2VhcmNoUXVlcnk/Lih0KX1cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0zIHB5LTEgdGV4dC14cyBiZy13aGl0ZS81IGhvdmVyOmJnLXdoaXRlLzE1IHRleHQtd2hpdGUvODAgcm91bmRlZC1mdWxsIGJvcmRlciBib3JkZXItd2hpdGUvMTAgdHJhbnNpdGlvbi1jb2xvcnMgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge3R9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdC0yXCI+XG4gICAgICAgICAgICAgICAgICA8R2xhc3NCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cInByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0U2VhcmNoUXVlcnk/LignJyk7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0U2VhcmNoR2VucmVGaWx0ZXIobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0U2VhcmNoTWluUmF0aW5nKDApO1xuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICBCcm93c2UgQWxsIEdlbnJlc1xuICAgICAgICAgICAgICAgICAgPC9HbGFzc0J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIHNtOmdyaWQtY29scy0zIG1kOmdyaWQtY29scy00IGxnOmdyaWQtY29scy01IHhsOmdyaWQtY29scy02IGdhcC0zIHNtOmdhcC02IHBiLTIwIGNvbnRlbnQtYXV0b1wiPlxuICAgICAgICAgICAgICB7cHJvY2Vzc2VkU2hvd3MubWFwKChzaG93LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzTGFzdCA9IGluZGV4ID09PSBwcm9jZXNzZWRTaG93cy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGtleT17YCR7c2hvdy5pZH0tJHtpbmRleH1gfSByZWY9e2lzTGFzdCA/IGxhc3RFbGVtZW50UmVmIDogbnVsbH0+XG4gICAgICAgICAgICAgICAgICAgIDxNb3ZpZUNhcmQgXG4gICAgICAgICAgICAgICAgICAgICAgc2hvdz17c2hvd30gXG4gICAgICAgICAgICAgICAgICAgICAgY291bnRyeT17Y291bnRyeX1cbiAgICAgICAgICAgICAgICAgICAgICBwbGF0Zm9ybUlkPXt1bmRlZmluZWR9IFxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2VsZWN0TW92aWUoc2hvdy5pZCl9IFxuICAgICAgICAgICAgICAgICAgICAgIGlzRmF2b3JpdGU9e2lzRmF2b3JpdGUoc2hvdy5pZCl9IFxuICAgICAgICAgICAgICAgICAgICAgIG9uVG9nZ2xlRmF2b3JpdGU9e3RvZ2dsZUZhdm9yaXRlfSBcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICB7aXNGZXRjaGluZ01vcmUgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXNwYW4tZnVsbCBmbGV4IGp1c3RpZnktY2VudGVyIHB5LThcIj5cbiAgICAgICAgICAgICAgICAgIDxMb2FkZXIyIGNsYXNzTmFtZT1cInctOCBoLTggYW5pbWF0ZS1zcGluIHRleHQtYW1iZXItNTAwXCIgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IHNlbGVjdGVkR2VucmUgPyAoXG4gICAgICAgIC8qIENhc2UgMjogU2VsZWN0ZWQgR2VucmUgVmlldyB3aXRoIFB1bGwtRG93biBab29tICYgU3RyZXRjaCBIZXJvICovXG4gICAgICAgIDxHZW5yZUNhdGFsb2d1ZVZpZXcgXG4gICAgICAgICAgc2VsZWN0ZWRHZW5yZT17c2VsZWN0ZWRHZW5yZX1cbiAgICAgICAgICBnZW5yZUltYWdlcz17Z2VucmVJbWFnZXN9XG4gICAgICAgICAgZ2VucmVUeXBlRmlsdGVyPXtnZW5yZVR5cGVGaWx0ZXJ9XG4gICAgICAgICAgaGFuZGxlU2V0R2VucmVUeXBlPXtoYW5kbGVTZXRHZW5yZVR5cGV9XG4gICAgICAgICAgc2hvd3M9e3Nob3dzfVxuICAgICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgICAgaXNGZXRjaGluZ01vcmU9e2lzRmV0Y2hpbmdNb3JlfVxuICAgICAgICAgIGNvdW50cnk9e2NvdW50cnl9XG4gICAgICAgICAgbGFzdEVsZW1lbnRSZWY9e2xhc3RFbGVtZW50UmVmfVxuICAgICAgICAgIG9uU2VsZWN0TW92aWU9e29uU2VsZWN0TW92aWV9XG4gICAgICAgICAgaXNGYXZvcml0ZT17aXNGYXZvcml0ZX1cbiAgICAgICAgICB0b2dnbGVGYXZvcml0ZT17dG9nZ2xlRmF2b3JpdGV9XG4gICAgICAgICAgb25CYWNrPXsoKSA9PiB7IHNldFNlbGVjdGVkR2VucmUobnVsbCk7IHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgJycsICcvJyk7IH19XG4gICAgICAgIC8+XG4gICAgICApIDogKFxuICAgICAgICAvKiBDYXNlIDM6IEluaXRpYWwgU2VhcmNoIFZpZXcgLT4gU2hvd3MgR2VucmVzIEdyaWQgKi9cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTZcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgbWItMVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMiBoLTIgcm91bmRlZC1mdWxsIGJnLWFtYmVyLTUwMCBhbmltYXRlLXB1bHNlXCIgLz5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LWJvbGQgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0ZXh0LWFtYmVyLTUwMFwiPkV4cGxvcmUgQ2F0YWxvZzwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtMnhsIHNtOnRleHQtM3hsIGZvbnQtZXh0cmFib2xkIHRyYWNraW5nLXRpZ2h0IHRleHQtd2hpdGUgZHJvcC1zaGFkb3dcIj5cbiAgICAgICAgICAgICAgQnJvd3NlIGJ5IEdlbnJlXG4gICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyBzbTp0ZXh0LXNtIHRleHQtd2hpdGUvNTAgbXQtMVwiPlxuICAgICAgICAgICAgICBTZWxlY3QgYSBjYXRlZ29yeSB0byBkaXNjb3ZlciBjdXJhdGVkIG1vdmllcywgYWNjbGFpbWVkIHNlcmllcywgYW5kIHRvcCB0cmVuZGluZyByZWxlYXNlcy5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBDdXJhdGVkIEdlbnJlIEdyaWQgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIHNtOmdyaWQtY29scy0yIG1kOmdyaWQtY29scy0zIGxnOmdyaWQtY29scy00IGdhcC00IHNtOmdhcC01IHBiLTIwIGNvbnRlbnQtYXV0b1wiPlxuICAgICAgICAgICAge0dFTlJFX0xJU1QubWFwKChnZW5yZSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgIGtleT17Z2VucmUuaWR9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVTZWxlY3RHZW5yZShnZW5yZSl9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2Bncm91cCByZWxhdGl2ZSBoLTQ0IHJvdW5kZWQtM3hsIG92ZXJmbG93LWhpZGRlbiBjdXJzb3ItcG9pbnRlciBib3JkZXIgYm9yZGVyLXdoaXRlLzE1IGJnLVsjMTUxNzFDXSB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0yNTAgdHJhbnNmb3JtIGhvdmVyOi10cmFuc2xhdGUteS0xIGhvdmVyOnNoYWRvdy0yeGwgJHsnaG92ZXI6Ym9yZGVyLWFtYmVyLTUwMC8zMCBob3ZlcjpzaGFkb3ctWzBfMF8xNXB4X3JnYmEoMjQ1LDE1OCwxMSwwLjEpXSd9IGdwdS1sYXllciB3aWxsLWNoYW5nZS10cmFuc2Zvcm1gfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHsvKiBCYWNrZHJvcCBhcnR3b3JrICovfVxuICAgICAgICAgICAgICAgICAgPGltZyBcbiAgICAgICAgICAgICAgICAgICAgc3JjPXsoZ2VucmUubW92aWVJZCAmJiBnZW5yZUltYWdlc1tgbW92aWVfJHtnZW5yZS5tb3ZpZUlkfWBdKSB8fCAoZ2VucmUudHZJZCAmJiBnZW5yZUltYWdlc1tgdHZfJHtnZW5yZS50dklkfWBdKSB8fCBnZW5yZS5pbWFnZSB8fCBERUZBVUxUX0dFTlJFX0lNQUdFU1tgbW92aWVfJHtnZW5yZS5tb3ZpZUlkfWBdIHx8IERFRkFVTFRfR0VOUkVfSU1BR0VTW2B0dl8ke2dlbnJlLnR2SWR9YF19IFxuICAgICAgICAgICAgICAgICAgICBhbHQ9e2dlbnJlLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmc9XCJsYXp5XCJcbiAgICAgICAgICAgICAgICAgICAgZGVjb2Rpbmc9XCJhc3luY1wiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgdy1mdWxsIGgtZnVsbCBvYmplY3QtY292ZXIgdHJhbnNpdGlvbi10cmFuc2Zvcm0gZHVyYXRpb24tNTAwIGVhc2Utb3V0IGdyb3VwLWhvdmVyOnNjYWxlLTEwNSBvcGFjaXR5LTYwIGdyb3VwLWhvdmVyOm9wYWNpdHktODUgd2lsbC1jaGFuZ2UtdHJhbnNmb3JtXCJcbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIHsvKiBBdG1vc3BoZXJpYyBncmFkaWVudCBvdmVybGF5ICovfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGJnLWdyYWRpZW50LXRvLXQgZnJvbS1bIzBBMEEwQV0gdmlhLVsjMEEwQTBBXS82MCB0by10cmFuc3BhcmVudCBvcGFjaXR5LTgwIGdyb3VwLWhvdmVyOm9wYWNpdHktNjAgdHJhbnNpdGlvbi1vcGFjaXR5IGR1cmF0aW9uLTMwMFwiIC8+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgYmctZ3JhZGllbnQtdG8tYiBmcm9tLWJsYWNrLzQwIHZpYS10cmFuc3BhcmVudCB0by1ibGFjay84MFwiIC8+XG5cbiAgICAgICAgICAgICAgICAgIHsvKiBSZWZyYWN0aXZlIGJvcmRlciBzaGVlbiAqL31cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCByb3VuZGVkLTN4bCBib3JkZXIgYm9yZGVyLXdoaXRlLzE1IGdyb3VwLWhvdmVyOmJvcmRlci13aGl0ZS8zNSB0cmFuc2l0aW9uLWNvbG9ycyBwb2ludGVyLWV2ZW50cy1ub25lXCIgLz5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQteC00IHRvcC0wIGgtWzEuNXB4XSBiZy1ncmFkaWVudC10by1yIGZyb20tdHJhbnNwYXJlbnQgdmlhLXdoaXRlLzgwIHRvLXRyYW5zcGFyZW50IHBvaW50ZXItZXZlbnRzLW5vbmVcIiAvPlxuXG4gICAgICAgICAgICAgICAgICB7LyogQ2FyZCBDb250ZW50ICovfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB6LTEwIGgtZnVsbCBwLTUgZmxleCBmbGV4LWNvbCBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgICAgICAgICAgey8qIFRvcCBSb3c6IEljb24gYnViYmxlICsgQXJyb3cgKi99XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTExIGgtMTEgcm91bmRlZC0yeGwgZ2xhc3MtbWVkaXVtIGJvcmRlciBib3JkZXItd2hpdGUvMjAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgc2hhZG93LWxnIGdyb3VwLWhvdmVyOnNjYWxlLTEwNSB0cmFuc2l0aW9uLXRyYW5zZm9ybSBkdXJhdGlvbi0yMDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxHZW5yZUljb24gbmFtZT17Z2VucmUuaWNvbk5hbWV9IHNpemU9ezIwfSBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlIGRyb3Atc2hhZG93LW1kXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctOCBoLTggcm91bmRlZC1mdWxsIGdsYXNzLXN1YnRsZSBncm91cC1ob3ZlcjpnbGFzcy1tZWRpdW0gZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMjAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Q2hldnJvblJpZ2h0IHNpemU9ezE2fSBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlLzcwIGdyb3VwLWhvdmVyOnRleHQtd2hpdGUgZ3JvdXAtaG92ZXI6dHJhbnNsYXRlLXgtMC41IHRyYW5zaXRpb24tdHJhbnNmb3JtXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgey8qIEJvdHRvbSBSb3c6IFRpdGxlICsgVGFnbGluZSAqL31cbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LWV4dHJhYm9sZCB0ZXh0LXdoaXRlIHRyYWNraW5nLXRpZ2h0IGdyb3VwLWhvdmVyOnRleHQtd2hpdGUgdHJhbnNpdGlvbi1jb2xvcnNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtnZW5yZS5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LXdoaXRlLzcwIGxpbmUtY2xhbXAtMiBtdC0xIGZvbnQtbWVkaXVtIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge2dlbnJlLmRlc2NyaXB0aW9ufVxuICAgICAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59XG5cblxuZnVuY3Rpb24gUGFyYW1vdW50Vmlldyh7IGNvdW50cnksIG9uU2VsZWN0TW92aWUsIGlzRmF2b3JpdGUsIHRvZ2dsZUZhdm9yaXRlIH06IGFueSkge1xuICBjb25zdCBbYWN0aXZlVGFiLCBzZXRBY3RpdmVUYWJdID0gdXNlU3RhdGU8J21vdmllJyB8ICdzZXJpZXMnPignbW92aWUnKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIHB0LTI4IHB4LTQgc206cHgtNiBtZDpweC04IGxnOnB4LTEyIHhsOnB4LTE2IG1heC13LVsxNjAwcHhdIG14LWF1dG8gbWluLWgtc2NyZWVuXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC00IG1iLThcIj5cbiAgICAgICAgPFN0cmVhbWluZ1BsYXRmb3JtSWNvbiBwbGF0Zm9ybUlkPVwicGFyYW1vdW50XCIgY2xhc3NOYW1lPVwidy0xNiBoLTE2IHJvdW5kZWQtMnhsIHNoYWRvdy0yeGxcIiAvPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBmb250LWV4dHJhYm9sZCB0ZXh0LXdoaXRlIHRyYWNraW5nLXRpZ2h0XCI+UGFyYW1vdW50KzwvaDE+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC13aGl0ZS82MFwiPlVuaXRlZCBTdGF0ZXMgQ2F0YWxvZzwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC00IG1iLThcIj5cbiAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmVUYWIoJ21vdmllJyl9XG4gICAgICAgICAgY2xhc3NOYW1lPXtgcHgtNiBweS0yIHJvdW5kZWQtZnVsbCBmb250LXNlbWlib2xkIHRyYW5zaXRpb24tY29sb3JzICR7YWN0aXZlVGFiID09PSAnbW92aWUnID8gJ2JnLVsjMDA2NEZGXSB0ZXh0LXdoaXRlIHNoYWRvdy1bMF8wXzIwcHhfcmdiYSgwLDEwMCwyNTUsMC40KV0nIDogJ2JnLXdoaXRlLzEwIHRleHQtd2hpdGUvNzAgaG92ZXI6dGV4dC13aGl0ZSd9YH1cbiAgICAgICAgPlxuICAgICAgICAgIE1vdmllc1xuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmVUYWIoJ3NlcmllcycpfVxuICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTYgcHktMiByb3VuZGVkLWZ1bGwgZm9udC1zZW1pYm9sZCB0cmFuc2l0aW9uLWNvbG9ycyAke2FjdGl2ZVRhYiA9PT0gJ3NlcmllcycgPyAnYmctWyMwMDY0RkZdIHRleHQtd2hpdGUgc2hhZG93LVswXzBfMjBweF9yZ2JhKDAsMTAwLDI1NSwwLjQpXScgOiAnYmctd2hpdGUvMTAgdGV4dC13aGl0ZS83MCBob3Zlcjp0ZXh0LXdoaXRlJ31gfVxuICAgICAgICA+XG4gICAgICAgICAgVFYgU2hvd3NcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCItbXgtNCBzbTotbXgtNiBtZDotbXgtOCBsZzotbXgtMTIgeGw6LW14LTE2XCI+XG4gICAgICAgIDxQbGF0Zm9ybVBhZ2UgXG4gICAgICAgICAgcGxhdGZvcm1JZD1cInBhcmFtb3VudFwiIFxuICAgICAgICAgIHR5cGU9e2FjdGl2ZVRhYn0gXG4gICAgICAgICAgY291bnRyeT1cIlVTXCIgXG4gICAgICAgICAgb25CYWNrPXsoKSA9PiB7fX0gXG4gICAgICAgICAgb25TZWxlY3RNb3ZpZT17b25TZWxlY3RNb3ZpZX0gXG4gICAgICAgICAgaXNGYXZvcml0ZT17aXNGYXZvcml0ZX0gXG4gICAgICAgICAgdG9nZ2xlRmF2b3JpdGU9e3RvZ2dsZUZhdm9yaXRlfVxuICAgICAgICAgIGhpZGVIZXJvPXt0cnVlfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibWFwcGluZ3MiOiJBQXNGTTtBQXRGTixPQUFPLFNBQVMsVUFBVSxXQUFXLFFBQVEsU0FBUyxtQkFBbUI7QUFDekUsU0FBUyxNQUFNLFFBQVEsTUFBTSxJQUFJLGNBQWMsYUFBYSxTQUFTLE1BQU0sR0FBRyxPQUE0QixVQUFVLE9BQU8sVUFBaUIsT0FBTyxPQUFPLE9BQU8sT0FBTyxRQUFRLE9BQU8sY0FBYyxNQUFNLFNBQVMsT0FBTyxhQUFhLFFBQVEsVUFBVSxRQUFRLEtBQUssTUFBTSxXQUFXLEtBQUssWUFBWTtBQUN6UyxTQUFTLFFBQVEsdUJBQXFEO0FBQ3RFLFNBQWUsY0FBYyxhQUFhLGtCQUFrQixvQkFBb0I7QUFDaEYsU0FBaUIsWUFBWSw0QkFBMEM7QUFFdkUsU0FBUyxXQUFXLHVCQUF1QixpQkFBaUIscUJBQXFCO0FBQ2pGLFNBQVMsYUFBYSxpQkFBaUM7QUFDdkQsU0FBUyxNQUFNLGdCQUFnQjtB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O0FBQUEsVUFDNU07QUFBQTtBQUFBLFFBSEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BS0E7QUFBQSxNQUNBO0FBQUEsUUFBQztBQUFBO0FBQUEsVUFDQyxTQUFTLE1BQU0sYUFBYSxRQUFRO0FBQUEsVUFDcEMsV0FBVywwREFBMEQsY0FBYyxXQUFXLGtFQUFrRSw0Q0FBNEM7QUFBQSxVQUM3TTtBQUFBO0FBQUEsUUFIRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLQTtBQUFBLFNBWkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQWFBO0FBQUEsSUFFQSx1QkFBQyxTQUFJLFdBQVUsK0NBQ2I7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUNDLFlBQVc7QUFBQSxRQUNYLE1BQU07QUFBQSxRQUNOLFNBQVE7QUFBQSxRQUNSLFFBQVEsTUFBTTtBQUFBLFFBQUM7QUFBQSxRQUNmO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBLFVBQVU7QUFBQTtBQUFBLE1BUlo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBU0EsS0FWRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBV0E7QUFBQSxPQW5DRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBb0NBO0FBRUo7IiwibmFtZXMiOlsiRmF2b3JpdGVJdGVtIiwiSGVyb0Jhbm5lciIsIlNrZWxldG9uQ2FyZCIsIk1vdmllQ2FyZCIsIkdlbnJlSWNvbiJdfQ==