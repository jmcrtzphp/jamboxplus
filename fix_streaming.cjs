const fs = require('fs');
let code = fs.readFileSync('src/components/StreamingPlatformsRow.tsx', 'utf-8');

// Replace import React
code = code.replace("import React from 'react';", "import React, { useRef } from 'react';\nimport { ChevronLeft, ChevronRight } from 'lucide-react';");

// Remove paramount if present in STREAMING_PLATFORMS_CARDS
// Let's check what STREAMING_PLATFORMS_CARDS looks like:
// { id: 'paramount', title: 'Paramount+', img: 'https://i.imgflip.com/azc2tr.gif' }, - if it was there (it wasn't in the previous `cat`)

// Add scrollRef to StreamingPlatformsRow
code = code.replace("export function StreamingPlatformsRow({ onSelectPlatform }: Props) {", "export function StreamingPlatformsRow({ onSelectPlatform }: Props) {\n  const scrollRef = useRef<HTMLDivElement>(null);\n\n  const scroll = (dir: 'left' | 'right') => {\n    if (scrollRef.current) {\n      const { scrollLeft, clientWidth } = scrollRef.current;\n      const scrollAmount = clientWidth * 0.75;\n      scrollRef.current.scrollTo({\n        left: dir === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,\n        behavior: 'smooth'\n      });\n    }\n  };\n");

// Add arrows wrapper around the flex gap-4 overflow-x-auto container
const containerRegex = /<div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">([\s\S]*?)<\/div>\s*<\/div>\s*\);\s*\}/;
code = code.replace(containerRegex, (match, inner) => {
  return `<div className="relative">
        <div className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
        </div>
        
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth">
${inner}        </div>
        
        <div className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}`;
});

fs.writeFileSync('src/components/StreamingPlatformsRow.tsx', code);
console.log('Patched StreamingPlatformsRow.tsx');
