const fs = require('fs');

let movies = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

// CategoryRow: Add content-visibility
movies = movies.replace(
  '<div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-4" ref={containerRef}>',
  '<div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-4" ref={containerRef} style={{ contentVisibility: "auto", containIntrinsicSize: "0 300px" }}>'
);
movies = movies.replace(
  '<div className="relative group px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16" ref={containerRef}>',
  '<div className="relative group px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16" ref={containerRef} style={{ contentVisibility: "auto", containIntrinsicSize: "0 300px" }}>'
);

// PlatformRow: Add content-visibility
// Need to replace the exact strings for PlatformRow too, but they are probably identical.
// Wait, replace() only replaces the first occurrence, which is perfect since PlatformRow has identical ones if we use replaceAll.

movies = movies.replaceAll(
  '<div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-4" ref={containerRef}>',
  '<div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 space-y-4" ref={containerRef} style={{ contentVisibility: "auto", containIntrinsicSize: "0 300px" }}>'
);
movies = movies.replaceAll(
  '<div className="relative group px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16" ref={containerRef}>',
  '<div className="relative group px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16" ref={containerRef} style={{ contentVisibility: "auto", containIntrinsicSize: "0 300px" }}>'
);

fs.writeFileSync('src/components/Movies.tsx', movies);
console.log('content-visibility added to rows.');
