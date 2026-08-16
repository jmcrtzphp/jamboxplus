const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

const oldBannerStart = 'const HeroBanner = React.memo(function HeroBanner({ country, type, heroMovies, setHeroMovies, onSelect, isFavorite, onToggleFavorite }: any) {';
const oldBannerEndStr = '      </div>\n    </div>\n  );\n});';

const startIdx = code.indexOf(oldBannerStart);
let endIdx = code.indexOf(oldBannerEndStr, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  endIdx += oldBannerEndStr.length;
  const newBanner = `const HeroBanner = React.memo(function HeroBanner({ country, type, heroMovies, setHeroMovies, onSelect, isFavorite, onToggleFavorite }: any) {
  const [loading, setLoading] = useState(heroMovies.length === 0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    if (heroMovies.length === 0) {
      fetchFilters({ country, show_type: type, order_by: 'popularity_1week' }).then(res => {
        if (isMounted && res.shows.length > 0) {
          setHeroMovies(res.shows.slice(0, 5));
        }
      }).finally(() => {
        if (isMounted) setLoading(false);
      });
    }
    return () => { isMounted = false; };
  }, [country, type, heroMovies.length, setHeroMovies]);

  useEffect(() => {
    if (heroMovies.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  if (loading || heroMovies.length === 0) {
    return <div className="h-[70vh] md:h-[80vh] w-full bg-[#14161B] animate-pulse" />;
  }

  const currentMovie = heroMovies[activeIndex];
  const rating = currentMovie.rating ? (currentMovie.rating / 10).toFixed(1) : null;
  const isFav = isFavorite(currentMovie.id);

  return (
    <div className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden gpu-layer group">
      {/* Background Posters with cross-fade */}
      {heroMovies.map((movie: any, idx: number) => {
        const bg = movie.imageSet?.horizontalPoster?.w1080 || movie.imageSet?.poster;
        return (
          <img 
            key={movie.id}
            src={bg} 
            alt={movie.title} 
            decoding="async"
            className={\`absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-90 contrast-105 will-change-transform transition-opacity duration-1000 ease-in-out \${idx === activeIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'}\`}
          />
        );
      })}

      {/* Atmospheric Liquid Glass Depth Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1113] via-[#0F1113]/50 to-black/30 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F1113] via-[#0F1113]/60 to-transparent w-full md:w-3/4 z-0 pointer-events-none" />

      {/* Hero Content Panel */}
      <div className="absolute bottom-20 md:bottom-28 left-4 md:left-12 max-w-2xl z-10 pr-4">
        {rating && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-subtle text-yellow-300 text-xs font-bold mb-3.5 shadow-md">
            <Star size={13} className="fill-yellow-400 text-yellow-400" />
            <span>{rating} Rating</span>
          </div>
        )}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-3 md:mb-4 drop-shadow-lg leading-tight transition-all duration-500">
          {currentMovie.title}
        </h1>
        <p className="text-white/80 text-xs sm:text-sm md:text-base line-clamp-3 mb-6 font-normal drop-shadow leading-relaxed max-w-xl transition-all duration-500">
          {currentMovie.overview}
        </p>

        {/* Hero Interactive Physical Buttons */}
        <div className="flex items-center gap-3">
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
      <div className="absolute bottom-6 md:bottom-12 left-4 md:left-12 flex items-center gap-2 z-20">
        {heroMovies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={\`h-1.5 rounded-full transition-all duration-500 cursor-pointer \${idx === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}\`}
            aria-label={\`Go to slide \${idx + 1}\`}
          />
        ))}
      </div>
    </div>
  );
});`;
  
  code = code.substring(0, startIdx) + newBanner + code.substring(endIdx);
  fs.writeFileSync('src/components/Movies.tsx', code);
  console.log("HeroBanner successfully updated.");
} else {
  console.error("Failed to find HeroBanner bounds.", startIdx, endIdx);
}
