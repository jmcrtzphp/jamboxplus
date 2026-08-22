const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

code = code.replace(
`function PlatformPage({ platformId, type, country, onBack, onSelectMovie, isFavorite, toggleFavorite }: any) {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const p = PLATFORMS[platformId];`,
`function PlatformPage({ platformId, type, country, onBack, onSelectMovie, isFavorite, toggleFavorite }: any) {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const isNowShowing = platformId === 'now-showing';
  const p = isNowShowing ? { displayName: 'Now Showing', color: 'from-[#000000] to-[#1A1A1A]', type: 'subscription' } : PLATFORMS[platformId];`
);

code = code.replace(
`    fetchFilters({ 
      country, 
      show_type: type, 
      catalogs: p.providerId, 
      order_by: 'popularity_1week',
      with_watch_monetization_types: 'flatrate',
      cursor: reset ? undefined : nextCursor
    }).then(res => {`,
`    fetchFilters(isNowShowing ? {
      country,
      show_type: type,
      order_by: 'popularity.desc',
      in_theaters: true,
      cursor: reset ? undefined : nextCursor
    } : { 
      country, 
      show_type: type, 
      catalogs: p.providerId, 
      order_by: 'popularity.desc',
      with_watch_monetization_types: 'flatrate',
      cursor: reset ? undefined : nextCursor
    }).then(res => {`
);

fs.writeFileSync('src/components/Movies.tsx', code);
