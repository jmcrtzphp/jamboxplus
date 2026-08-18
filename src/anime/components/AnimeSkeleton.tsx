import React from 'react';
import { motion } from 'motion/react';

export const AnimeCardSkeleton = React.memo(function AnimeCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 0.85, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className="aspect-[2/3] w-full bg-white/5 rounded-3xl overflow-hidden relative shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute top-3 left-3 flex gap-1.5">
        <div className="h-5 w-12 bg-white/10 rounded-full" />
      </div>
      <div className="absolute bottom-3.5 left-3.5 right-3.5 flex flex-col gap-2">
        <div className="h-4 w-4/5 bg-white/15 rounded-full" />
        <div className="flex items-center gap-2">
          <div className="h-3 w-1/3 bg-white/10 rounded-full" />
          <div className="h-3 w-1/4 bg-white/10 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
});

export const AnimeRowSkeleton = React.memo(function AnimeRowSkeleton({ title = 'Loading...' }: { title?: string }) {
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-4 my-8">
      <div className="flex items-center justify-between">
        <div className="h-6 w-44 bg-white/10 rounded-full animate-pulse" />
        <div className="h-4 w-16 bg-white/5 rounded-full" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-[140px] sm:w-[160px] md:w-[190px] lg:w-[220px] xl:w-[240px] flex-shrink-0"
          >
            <AnimeCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
});

export const AnimeHeroSkeleton = React.memo(function AnimeHeroSkeleton() {
  return (
    <div className="relative h-[65vh] sm:h-[72vh] md:h-[80vh] w-full bg-[#121418] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1113] via-[#0F1113]/50 to-transparent z-10" />
      <div className="absolute bottom-12 left-4 sm:left-8 md:left-16 max-w-2xl z-20 space-y-4">
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
          <div className="h-6 w-24 bg-white/10 rounded-full animate-pulse" />
        </div>
        <div className="h-10 md:h-14 w-3/4 bg-white/15 rounded-2xl animate-pulse" />
        <div className="h-4 w-full bg-white/10 rounded-full animate-pulse" />
        <div className="h-4 w-2/3 bg-white/10 rounded-full animate-pulse" />
        <div className="flex gap-3 pt-2">
          <div className="h-12 w-36 bg-amber-500/20 rounded-full animate-pulse" />
          <div className="h-12 w-32 bg-white/10 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
});

export const AnimeGridSkeleton = React.memo(function AnimeGridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
});
