import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Search, X, Film, Tv, Radio, Bookmark, Star, Clock, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { Logo, JamBoxText } from './Logo';
import { motion, AnimatePresence } from 'motion/react';
import { fetchSearchSuggestions, SearchSuggestion } from '../lib/tmdb';

const isLiquidSupported = (() => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  if (isSafari || isFirefox) return false;
  if (!CSS.supports("backdrop-filter", "url(#lg)") && !CSS.supports("-webkit-backdrop-filter", "url(#lg)")) return false;
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 4;
    c.getContext("2d")?.getImageData(0, 0, 1, 1);
    return true;
  } catch (_) {
    return false;
  }
})();

function makeMap(w: number, h: number, radius: number, border: number, mapBlur: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const gx = ctx.createLinearGradient(0, 0, w, 0);
  gx.addColorStop(0, "rgb(0,0,0)");
  gx.addColorStop(1, "rgb(255,0,0)");
  ctx.fillStyle = gx;
  ctx.fillRect(0, 0, w, h);

  const gy = ctx.createLinearGradient(0, 0, 0, h);
  gy.addColorStop(0, "rgb(0,0,0)");
  gy.addColorStop(1, "rgb(0,0,255)");
  ctx.globalCompositeOperation = "difference";
  ctx.fillStyle = gy;
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = "source-over";
  const inset = border * Math.min(w, h);
  ctx.filter = `blur(${mapBlur}px)`;
  ctx.fillStyle = "rgba(128,128,128,0.93)";
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(inset, inset, w - inset * 2, h - inset * 2, Math.max(radius - inset, 2));
  } else {
    ctx.rect(inset, inset, w - inset * 2, h - inset * 2);
  }
  ctx.fill();
  ctx.filter = "none";
  return canvas.toDataURL();
}

export interface FloatingNavProps {
  onBack: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isSearchExpanded: boolean;
  setIsSearchExpanded: (expanded: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onNavigate?: (view: string) => void;
  onSelectMovie?: (id: string) => void;
  favoritesCount: number;
}

export function FloatingNav({
  onBack,
  activeTab,
  setActiveTab,
  isSearchExpanded,
  setIsSearchExpanded,
  searchQuery,
  setSearchQuery,
  onNavigate,
  onSelectMovie,
  favoritesCount,
}: FloatingNavProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [pillSize, setPillSize] = useState({ w: 0, h: 0 });
  const [mapUrl, setMapUrl] = useState('');
  const pillRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Bottom Nav Reference
  const [bottomNavSize, setBottomNavSize] = useState({ w: 0, h: 0 });
  const [bottomMapUrl, setBottomMapUrl] = useState('');
  const bottomNavRef = useRef<HTMLDivElement>(null);

  // Suggestions & Recent Searches
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jamtv_recent_searches');
      return saved ? JSON.parse(saved) : ['Dune', 'Arcane', 'Avengers', 'Stranger Things'];
    } catch (_) {
      return ['Dune', 'Arcane', 'Avengers'];
    }
  });

  const saveRecentSearch = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== trimmed.toLowerCase());
      const next = [trimmed, ...filtered].slice(0, 6);
      try {
        localStorage.setItem('jamtv_recent_searches', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('jamtv_recent_searches');
    } catch (_) {}
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / '/' to search, ESC to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchExpanded(true);
        setActiveTab('search');
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchExpanded(true);
        setActiveTab('search');
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === 'Escape' && isSearchExpanded) {
        setShowSuggestionsDropdown(false);
        if (!searchQuery) {
          setIsSearchExpanded(false);
          setActiveTab('movies');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchExpanded, searchQuery, setIsSearchExpanded, setActiveTab]);

  // Debounced Search Suggestions fetching
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsSuggesting(false);
      return;
    }

    const controller = new AbortController();
    setIsSuggesting(true);

    const timer = setTimeout(() => {
      fetchSearchSuggestions(searchQuery.trim(), controller.signal)
        .then(items => {
          setSuggestions(items);
          setIsSuggesting(false);
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            setIsSuggesting(false);
          }
        });
    }, 180);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  useEffect(() => {
    if (!pillRef.current) return;
    let timer: number | null = null;
    const ro = new ResizeObserver((entries) => {
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => {
        for (let entry of entries) {
          const rect = entry.target.getBoundingClientRect();
          const w = Math.round(rect.width);
          const h = Math.round(rect.height);
          if (entry.target === pillRef.current) {
            setPillSize({ w, h });
            if (w > 0 && h > 0 && isLiquidSupported) {
               setMapUrl(makeMap(w, h, Math.min(w, h) / 2, 0.07, 12));
            }
          } else if (entry.target === bottomNavRef.current) {
            setBottomNavSize({ w, h });
            if (w > 0 && h > 0 && isLiquidSupported) {
               setBottomMapUrl(makeMap(w, h, Math.min(w, h) / 2, 0.07, 12));
            }
          }
        }
      }, 120);
    });
    
    if (pillRef.current) ro.observe(pillRef.current);
    if (bottomNavRef.current) ro.observe(bottomNavRef.current);
    
    return () => {
      if (timer) clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  const links: Array<{ id: string, label: string, icon: any, mobileLabel?: string, action?: () => void }> = [
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'tv', label: 'TV Shows', icon: Tv },
    { id: 'favorites', label: `Favorites${favoritesCount > 0 ? ` (${favoritesCount})` : ''}`, icon: Bookmark, mobileLabel: 'Favorites' }
  ];

  return (
    <>
      {/* Hidden SVG container for dynamic refractive filter */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', left: '-9999px' }}>
        <defs>
          {isLiquidSupported && mapUrl && (
            <filter id="liquid-glass" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feImage
                x="0"
                y="0"
                width={pillSize.w}
                height={pillSize.h}
                preserveAspectRatio="none"
                result="map"
                href={mapUrl}
              />
              <feDisplacementMap in="SourceGraphic" in2="map" scale="-112" xChannelSelector="R" yChannelSelector="B" result="d0" />
              <feColorMatrix in="d0" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="c0" />
              
              <feDisplacementMap in="SourceGraphic" in2="map" scale="-106" xChannelSelector="R" yChannelSelector="B" result="d1" />
              <feColorMatrix in="d1" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="c1" />
              
              <feDisplacementMap in="SourceGraphic" in2="map" scale="-100" xChannelSelector="R" yChannelSelector="B" result="d2" />
              <feColorMatrix in="d2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="c2" />
              
              <feBlend in="c0" in2="c1" mode="screen" result="c01" />
              <feBlend in="c01" in2="c2" mode="screen" />
            </filter>
          )}
          
          {isLiquidSupported && bottomMapUrl && (
            <filter id="liquid-glass-bottom" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feImage
                x="0"
                y="0"
                width={bottomNavSize.w}
                height={bottomNavSize.h}
                preserveAspectRatio="none"
                result="map"
                href={bottomMapUrl}
              />
              <feDisplacementMap in="SourceGraphic" in2="map" scale="-112" xChannelSelector="R" yChannelSelector="B" result="d0" />
              <feColorMatrix in="d0" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="c0" />
              
              <feDisplacementMap in="SourceGraphic" in2="map" scale="-106" xChannelSelector="R" yChannelSelector="B" result="d1" />
              <feColorMatrix in="d1" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="c1" />
              
              <feDisplacementMap in="SourceGraphic" in2="map" scale="-100" xChannelSelector="R" yChannelSelector="B" result="d2" />
              <feColorMatrix in="d2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="c2" />
              
              <feBlend in="c0" in2="c1" mode="screen" result="c01" />
              <feBlend in="c01" in2="c2" mode="screen" />
            </filter>
          )}
        </defs>
      </svg>

      {/* Mobile Top Floating Elements */}
      <div className="sm:hidden fixed top-0 left-0 w-full h-20 bg-gradient-to-b from-black/80 to-transparent z-40 pointer-events-none" />
      <div className="sm:hidden fixed top-4 left-4 z-50 pointer-events-auto cursor-pointer flex items-center gap-2" onClick={onBack}>
        <Logo className="w-9 h-9" />
        <JamBoxText className="text-[17px] ml-1.5" />
      </div>

      <div className="hidden sm:flex fixed top-0 left-0 w-full justify-center py-5 z-50 pointer-events-none px-4">
        {/* Floating Glass Pill Container */}
        <div className="relative flex flex-col items-center">
          <div 
            ref={pillRef}
            className="pointer-events-auto inline-flex items-center gap-1 md:gap-2 lg:gap-4 rounded-full p-1.5 transition-opacity duration-[260ms] ease-out w-auto max-w-[95%] lg:max-w-4xl"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              boxShadow: 'inset 0 0 0 0.5px rgba(255, 255, 255, 0.15), 0 4px 16px rgba(0, 0, 0, 0.2)',
              ...(isLiquidSupported && mapUrl ? {
                backdropFilter: 'url(#liquid-glass) blur(3px) saturate(1.5)',
                WebkitBackdropFilter: 'url(#liquid-glass) blur(3px) saturate(1.5)',
              } : {
                backdropFilter: 'blur(16px) saturate(1.5)',
                WebkitBackdropFilter: 'blur(16px) saturate(1.5)',
              })
            }}
          >
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer pr-3 pl-1" onClick={onBack}>
              <Logo className="w-8 h-8" />
              <JamBoxText className="text-[15px] ml-1.5" />
            </div>

            {/* Desktop Nav Links / Search Input */}
            <div className="hidden sm:flex items-center overflow-hidden">
              <AnimatePresence mode="wait">
                {!isSearchExpanded ? (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1"
                  >
                    {links.map((link) => {
                      const isActive = activeTab === link.id;
                      return (
                        <button
                          key={link.id}
                          onClick={() => {
                            if (link.action) {
                              link.action();
                            } else {
                              setActiveTab(link.id);
                            }
                          }}
                          onMouseEnter={() => setHoveredTab(link.id)}
                          onMouseLeave={() => setHoveredTab(null)}
                          className="relative px-3 sm:px-4 md:px-5 lg:px-6 py-2 text-[0.875rem] md:text-[0.9375rem] font-medium transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full"
                          style={{ color: isActive || hoveredTab === link.id ? '#fff' : 'rgba(255,255,255,0.7)' }}
                        >
                          {hoveredTab === link.id && (
                            <motion.div
                              layoutId="nav-hover"
                              className="absolute inset-0 bg-white/10 rounded-full"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                              style={{ zIndex: 0 }}
                            />
                          )}
                          {isActive && (
                            <motion.div
                              layoutId="nav-active"
                              className="absolute inset-0 bg-amber-500/20 rounded-full"
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                              style={{ zIndex: 0 }}
                            />
                          )}
                          <span className="relative z-10">{link.label}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 340 }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center relative ml-1"
                  >
                    <Search size={15} className="absolute left-3 text-white/50" />
                    <input
                      ref={searchInputRef}
                      autoFocus
                      type="text"
                      placeholder="Search movies, shows, actors... (ESC to close)"
                      value={searchQuery}
                      onFocus={() => setShowSuggestionsDropdown(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (activeTab !== 'search') setActiveTab('search');
                        setShowSuggestionsDropdown(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          saveRecentSearch(searchQuery);
                          setShowSuggestionsDropdown(false);
                        }
                      }}
                      className="w-full py-1.5 pl-8 pr-14 text-sm text-white bg-transparent outline-none placeholder-white/40"
                    />

                    {isSuggesting && (
                      <Loader2 size={13} className="absolute right-8 text-amber-500 animate-spin" />
                    )}

                    <button 
                      onClick={() => {
                        if (searchQuery) {
                          setSearchQuery('');
                        } else {
                          setIsSearchExpanded(false);
                          setShowSuggestionsDropdown(false);
                          setActiveTab('movies');
                        }
                      }}
                      className="absolute right-2 text-white/50 hover:text-white p-1"
                      title="Clear / Close"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right-Side Search Action Toggle */}
            <div className="flex items-center gap-1 ml-1">
              <button
                onClick={() => {
                  if (!isSearchExpanded) {
                    setIsSearchExpanded(true);
                    setActiveTab('search');
                    setShowSuggestionsDropdown(true);
                    setTimeout(() => searchInputRef.current?.focus(), 50);
                  } else {
                    setIsSearchExpanded(false);
                    setShowSuggestionsDropdown(false);
                    setSearchQuery('');
                    setActiveTab('movies');
                  }
                }}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-[260ms] outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  isSearchExpanded ? 'bg-amber-500/20 text-amber-400' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                aria-label="Search"
                title={isSearchExpanded ? "Close search (ESC)" : "Search (Cmd+K)"}
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Desktop Search Suggestions & Recent Searches Dropdown */}
          <AnimatePresence>
            {isSearchExpanded && showSuggestionsDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="pointer-events-auto absolute top-full mt-2 w-96 max-w-[95vw] bg-[#121419]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 shadow-2xl z-50 overflow-hidden"
              >
                {/* Suggestions List */}
                {suggestions.length > 0 ? (
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-white/40 px-2 py-1 flex items-center justify-between">
                      <span>Instant Matches</span>
                      <span className="text-[10px] text-white/30 lowercase">Press Enter for all</span>
                    </div>
                    {suggestions.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          saveRecentSearch(item.title);
                          setShowSuggestionsDropdown(false);
                          if (onSelectMovie) {
                            onSelectMovie(item.id);
                          } else {
                            setSearchQuery(item.title);
                          }
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors group"
                      >
                        {item.poster ? (
                          <img src={item.poster} alt={item.title} className="w-9 h-13 object-cover rounded-lg bg-black/40 flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-13 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Film size={14} className="text-white/30" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate group-hover:text-amber-400 transition-colors">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-white/50 mt-0.5">
                            <span className="capitalize px-1.5 py-0.2 bg-white/5 rounded text-[10px] font-medium border border-white/10">
                              {item.mediaType === 'tv' ? 'TV' : 'Movie'}
                            </span>
                            {item.releaseYear && <span>{item.releaseYear}</span>}
                            {item.rating && (
                              <span className="flex items-center gap-0.5 text-yellow-400 font-medium">
                                <Star size={10} className="fill-yellow-400" />
                                {item.rating}%
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="p-3 text-center text-xs text-white/50">
                    Press <span className="text-amber-400 font-semibold">Enter</span> to search "{searchQuery}"
                  </div>
                ) : (
                  /* Recent & Trending Searches */
                  <div className="space-y-3 p-1">
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white/40 px-1 mb-2">
                          <span className="flex items-center gap-1"><Clock size={12} /> Recent Searches</span>
                          <button onClick={clearRecentSearches} className="hover:text-red-400 transition-colors text-[10px]">
                            Clear
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {recentSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => {
                                setSearchQuery(term);
                                saveRecentSearch(term);
                                setShowSuggestionsDropdown(false);
                              }}
                              className="px-2.5 py-1 text-xs bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg border border-white/5 transition-colors cursor-pointer"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500/80 px-1 mb-2">
                        🔥 Trending Now
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['Dune: Part Two', 'Arcane', 'Avengers', 'Spider-Man', 'Deadpool', 'Fallout'].map((t) => (
                          <button
                            key={t}
                            onClick={() => {
                              setSearchQuery(t);
                              saveRecentSearch(t);
                              setShowSuggestionsDropdown(false);
                            }}
                            className="px-2.5 py-1 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/20 transition-colors cursor-pointer"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Floating Bottom Nav */}
      <div className="sm:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.div 
          ref={bottomNavRef}
          layout
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="pointer-events-auto flex items-center w-full max-w-sm rounded-full p-1.5 transition-opacity duration-[260ms] ease-out min-h-[58px]"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            boxShadow: 'inset 0 0 0 0.5px rgba(255, 255, 255, 0.15), 0 4px 20px rgba(0, 0, 0, 0.4)',
            ...(isLiquidSupported && bottomMapUrl ? {
              backdropFilter: 'url(#liquid-glass-bottom) blur(3px) saturate(1.5)',
              WebkitBackdropFilter: 'url(#liquid-glass-bottom) blur(3px) saturate(1.5)',
            } : {
              backdropFilter: 'blur(18px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(18px) saturate(1.5)',
            })
          }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'search' ? (
              <motion.div
                key="mobile-search-mode"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="w-full flex items-center gap-2 px-3 py-1"
              >
                <Search size={18} className="text-amber-500 shrink-0 ml-1" />
                <input
                  ref={mobileSearchInputRef}
                  autoFocus
                  type="text"
                  placeholder="Search movies, TV shows..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value) saveRecentSearch(e.target.value);
                  }}
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none font-medium py-1.5 min-w-0"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 text-white/50 hover:text-white rounded-full transition-colors cursor-pointer shrink-0"
                    aria-label="Clear search text"
                  >
                    <X size={15} />
                  </button>
                )}
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchExpanded(false);
                    setActiveTab('movies');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 active:bg-white/20 rounded-full transition-all shrink-0 cursor-pointer"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="mobile-nav-mode"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-around w-full"
              >
                {[
                  { id: 'movies', label: 'Movies', icon: Film },
                  { id: 'tv', label: 'TV Shows', icon: Tv },
                  { id: 'favorites', label: `Favorites${favoritesCount > 0 ? ` (${favoritesCount})` : ''}`, icon: Bookmark, mobileLabel: 'Favorites' },
                  { id: 'search', label: 'Search', icon: Search }
                ].map((link) => {
                  const isActive = activeTab === link.id;
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        if (link.id === 'search') {
                          setIsSearchExpanded(true);
                          setActiveTab('search');
                          setTimeout(() => mobileSearchInputRef.current?.focus(), 60);
                        } else {
                          setActiveTab(link.id);
                        }
                      }}
                      className="relative flex flex-col items-center justify-center w-14 h-13 rounded-full text-white/70 hover:text-white transition-colors duration-200 outline-none cursor-pointer"
                      style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.7)' }}
                    >
                      <div 
                         className={`absolute inset-0 bg-amber-500 rounded-full transition-opacity duration-[260ms] ease-out ${isActive ? 'opacity-15' : 'opacity-0'}`}
                         style={{ zIndex: -1 }}
                      />
                      <Icon size={19} className="mb-0.5" />
                      <span className="text-[10px] font-medium leading-none">{link.mobileLabel || link.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
