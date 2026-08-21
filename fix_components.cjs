const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

const startIndex = code.indexOf('function CategoryRow');
const endIndex = code.indexOf('function PlatformPage');

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = `function CategoryRow({ title, fetcher, onSelect, isFavorite, toggleFavorite, country }: any) {
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
      }, { rootMargin: '200px' });
      
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
      <div className="flex items-center gap-2.5 mb-4">
        {title.toLowerCase().includes('top rated') && (
          <svg className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
            <g strokeWidth="0"></g>
            <g strokeLinecap="round" strokeLinejoin="round"></g>
            <g>
              <path d="M11,3.19a1.08,1.08,0,0,1,2.06,0l1.86,5.72h6a1.09,1.09,0,0,1,.64,2l-4.87,3.53,1.86,5.73a1.08,1.08,0,0,1-1.67,1.21L12,17.81,7.13,21.35a1.08,1.08,0,0,1-1.67-1.21l1.86-5.73L2.45,10.88a1.09,1.09,0,0,1,.64-2h6Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" fillRule="evenodd"></path>
            </g>
          </svg>
        )}
        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight drop-shadow">{title}</h3>
      </div>
      
      <div className="relative">
        <div className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full glass-button flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight size={24} className="rotate-180 text-white" />
          </button>
        </div>
        
        <div ref={scrollRef} className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide snap-x py-4 -my-4 pl-1 pr-12">
          {shows.map((show, index) => (
            <div key={\`\${show.id}-\${index}\`} className="w-[140px] sm:w-[160px] md:w-[190px] lg:w-[220px] xl:w-[240px] flex-shrink-0 snap-start">
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
        
        <div className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full glass-button flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>
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
      }, { rootMargin: '200px' });
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
    setError(null);
    
    fetchFilters({ 
      country, 
      show_type: type,
      catalogs: p.providerId,
      order_by: 'popularity_1week',
      with_watch_monetization_types: 'flatrate',
      limit: 20
    }).then((res: any) => {
      if (isMounted) setShows(res?.shows || []);
    }).catch((err: any) => {
      console.error(\`PlatformRow error (\${p.name}):\`, err);
      if (isMounted) setError('Failed to load shows');
    }).finally(() => {
      if (isMounted) setLoading(false);
    });
    
    return () => { isMounted = false; };
  }, [platformId, type, country, isInView, p]);

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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          <div className="h-6 w-32 bg-white/10 rounded-full animate-pulse" />
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
          <PlatformBadge platformId={platformId} size="md" />
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight drop-shadow">{p.name}</h3>
        </div>
        
        <button 
          onClick={onSeeAll}
          className="text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1 group/btn glass-subtle px-3 py-1 rounded-full cursor-pointer transition-colors"
        >
          See All <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
      
      <div className="relative">
        <div className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full glass-button flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight size={24} className="rotate-180 text-white" />
          </button>
        </div>
        
        <div ref={scrollRef} className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto scrollbar-hide snap-x py-4 -my-4 pl-1 pr-12">
          {shows.slice(0, 12).map((show, index) => (
            <div key={\`\${show.id}-\${index}\`} className="w-[140px] sm:w-[160px] md:w-[190px] lg:w-[220px] xl:w-[240px] flex-shrink-0 snap-start">
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
        
        <div className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full glass-button flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

`;
  code = code.substring(0, startIndex) + newContent + code.substring(endIndex);
  fs.writeFileSync('src/components/Movies.tsx', code);
  console.log('Fixed Movies.tsx');
}
