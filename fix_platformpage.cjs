const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

// Modify PlatformPage to accept 'now-showing'
code = code.replace(
`  const p = PLATFORMS[platformId];`,
`  const isNowShowing = platformId === 'now-showing';
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
    })`,
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
    })`
);

fs.writeFileSync('src/components/Movies.tsx', code);
