import React, { useState, useEffect, useRef } from 'react';
import { Play, Search, X, Film, Tv, Radio, Bookmark } from 'lucide-react';
import { Logo, JamBoxText } from './Logo';
import { motion, AnimatePresence } from 'motion/react';

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
  setActiveTab: (tab: string) => void;
  isSearchExpanded: boolean;
  setIsSearchExpanded: (expanded: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onNavigate?: (view: string) => void;
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
  favoritesCount,
}: FloatingNavProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [pillSize, setPillSize] = useState({ w: 0, h: 0 });
  const [mapUrl, setMapUrl] = useState('');
  const pillRef = useRef<HTMLDivElement>(null);

  // Bottom Nav Reference
  const [bottomNavSize, setBottomNavSize] = useState({ w: 0, h: 0 });
  const [bottomMapUrl, setBottomMapUrl] = useState('');
  const bottomNavRef = useRef<HTMLDivElement>(null);

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
      <div className="sm:hidden fixed top-0 left-0 w-full h-24 bg-gradient-to-b from-black/80 to-transparent z-40 pointer-events-none" />
      <div className="sm:hidden fixed top-4 left-4 z-50 pointer-events-auto cursor-pointer flex items-center gap-2" onClick={onBack}>
        <Logo className="w-10 h-10" />
        <JamBoxText className="text-[17px] ml-2" />
      </div>

      
      {/* Mobile Search Bar */}
      <AnimatePresence>
        {activeTab === 'search' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sm:hidden fixed top-20 left-4 right-4 z-50 pointer-events-auto"
          >
            <div className="relative w-full">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                autoFocus
                type="text"
                placeholder="Search titles, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1A1D24]/90 backdrop-blur-md border border-white/10 rounded-full py-3 pl-10 pr-10 text-sm text-white placeholder-white/40 outline-none focus:border-amber-500/50 shadow-xl"
              />
              <button 
                onClick={() => { setSearchQuery(''); setActiveTab('movies'); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="hidden sm:flex fixed top-0 left-0 w-full justify-center py-5 z-50 pointer-events-none px-4">


        {/* Floating Glass Pill */}
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

          {/* Desktop Nav Links */}
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
                  animate={{ opacity: 1, width: 320 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center relative ml-1"
                >
                  <Search size={15} className="absolute left-3 text-white/50" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search movies & shows..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activeTab !== 'search') setActiveTab('search');
                    }}
                    className="w-full py-1.5 pl-8 pr-8 text-sm text-white bg-transparent outline-none placeholder-white/40"
                  />
                  <button 
                    onClick={() => { setIsSearchExpanded(false); setSearchQuery(''); setActiveTab('movies'); }}
                    className="absolute right-2 text-white/50 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right-Side Actions */}
          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={() => {
                if (window.innerWidth < 640) {
                  // Mobile search behavior: if we want to expand search on mobile too, or navigate
                  if (!isSearchExpanded) {
                     setIsSearchExpanded(true);
                     setActiveTab('search');
                  } else {
                     setIsSearchExpanded(false);
                     setActiveTab('movies');
                  }
                } else {
                  if (!isSearchExpanded) {
                    setIsSearchExpanded(true);
                    setActiveTab('search');
                  } else {
                    setIsSearchExpanded(false);
                    setActiveTab('movies');
                  }
                }
              }}
              className="w-9 h-9 flex items-center justify-center rounded-[0.5rem] hover:bg-white/10 border border-transparent transition-all duration-[260ms] text-white/80 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            
            <div className="flex items-center justify-center">
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Bottom Nav */}
      <div className="sm:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div 
          ref={bottomNavRef}
          className="pointer-events-auto flex items-center justify-around w-full max-w-sm rounded-full p-2 transition-opacity duration-[260ms] ease-out"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            boxShadow: 'inset 0 0 0 0.5px rgba(255, 255, 255, 0.15), 0 4px 16px rgba(0, 0, 0, 0.2)',
            ...(isLiquidSupported && bottomMapUrl ? {
              backdropFilter: 'url(#liquid-glass-bottom) blur(3px) saturate(1.5)',
              WebkitBackdropFilter: 'url(#liquid-glass-bottom) blur(3px) saturate(1.5)',
            } : {
              backdropFilter: 'blur(16px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(16px) saturate(1.5)',
            })
          }}
        >
          
          {(() => {
            const mobileLinks = [
              { id: 'movies', label: 'Movies', icon: Film },
              { id: 'tv', label: 'TV Shows', icon: Tv },
              { id: 'favorites', label: 'Favorites', icon: Bookmark },
              { id: 'search', label: 'Search', icon: Search, action: () => { setIsSearchExpanded(true); setActiveTab('search'); } }
            ];
            return mobileLinks.map((link) => {

  
            const isActive = activeTab === link.id;
            const Icon = link.icon;
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
                className="relative flex flex-col items-center justify-center w-14 h-14 rounded-full text-white/70 hover:text-white transition-colors duration-200 outline-none"
                style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.7)' }}
              >
                <div 
                   className={`absolute inset-0 bg-amber-500 rounded-full transition-opacity duration-[260ms] ease-out ${isActive ? 'opacity-15' : 'opacity-0'}`}
                   style={{ zIndex: -1 }}
                />
                <Icon size={20} className="mb-1" />
                <span className="text-[10px] font-medium leading-none">{(link as any).mobileLabel || link.label}</span>
              </button>
            );
          }); })()}
        </div>
      </div>
    </>
  );
}
