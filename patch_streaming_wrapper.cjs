const fs = require('fs');
let code = fs.readFileSync('src/components/StreamingPlatformsRow.tsx', 'utf-8');

code = code.replace(
  '<div className="relative w-full pt-4">',
  '<div className="relative group px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto">'
);

code = code.replace(
  '<div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto mb-4 flex items-center justify-between">',
  '<div className="flex items-center justify-between mb-4">'
);

code = code.replace(
  '<div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-[1600px] mx-auto">',
  ''
);

code = code.replace(
  '<div className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar pb-6 snap-x snap-mandatory">',
  '<div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">'
);

// We had two </div> to remove since we removed the wrapping container
// Wait, I will just rewrite it to be perfectly safe.
