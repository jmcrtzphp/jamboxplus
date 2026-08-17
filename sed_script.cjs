const fs = require('fs');
let content = fs.readFileSync('src/components/Movies.tsx', 'utf8');

const skeletonCode = `
const SkeletonCard = React.memo(function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className="aspect-[2/3] w-full bg-white/5 rounded-3xl overflow-hidden relative shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2">
        <div className="h-4 w-3/4 bg-white/10 rounded-full" />
        <div className="h-3 w-1/2 bg-white/10 rounded-full" />
      </div>
    </motion.div>
  );
});
`;

content = content.replace('const MovieCard = React.memo(', skeletonCode + '\nconst MovieCard = React.memo(');

// 1. FavoriteItem
content = content.replace(
  /<div className="aspect-\[2\/3\] bg-white\/5 rounded-3xl animate-pulse" \/>/g,
  '<SkeletonCard />'
);

// 2. HeroBanner loading state
content = content.replace(
  /<div key={i} className="w-\[180px\] h-\[270px\] bg-white\/5 rounded-3xl flex-shrink-0 animate-pulse" \/>/g,
  '<div key={i} className="w-[180px] flex-shrink-0"><SkeletonCard /></div>'
);

// 3. PlatformCatalogueView loading
const platformGrid = `
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
`;
content = content.replace(
  /<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">\s*\{Array\.from\(\{ length: 12 \}\)\.map\(\(_, i\) => \(\s*<div key=\{i\} className="aspect-\[2\/3\] bg-white\/5 animate-pulse rounded-3xl" \/>\s*\)\)\}\s*<\/div>/g,
  platformGrid.trim()
);

// 4. GenreCatalogueView loading
const loader2Generic = /<div className="flex flex-col items-center justify-center py-24 gap-3">\s*<Loader2 className="w-8 h-8 animate-spin text-amber-500" \/>\s*<p className="text-sm text-white\/50">Loading.*?<\/p>\s*<\/div>/g;
content = content.replace(loader2Generic, `
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 content-auto">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
`.trim());

// 5. Search loading
const loaderSearch = /<div className="flex flex-col items-center justify-center py-24 gap-3">\s*<Loader2 className="w-8 h-8 animate-spin text-amber-500" \/>\s*<p className="text-sm text-white\/50">Searching movies & series for.*?<\/p>\s*<\/div>/g;
content = content.replace(loaderSearch, `
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 content-auto">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
`.trim());

fs.writeFileSync('src/components/Movies.tsx', content);
