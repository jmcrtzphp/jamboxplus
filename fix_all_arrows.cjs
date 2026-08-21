const fs = require('fs');

function replaceArrows(file, isLarge) {
  let code = fs.readFileSync(file, 'utf-8');
  
  const size = isLarge ? "w-12 h-12" : "w-8 h-8";
  const iconSize = isLarge ? 24 : 16;
  const leftIcon = isLarge ? `<ChevronRight size={24} className="rotate-180 text-white" />` : `<ChevronLeft size={16} className="text-white" />`;
  const rightIcon = isLarge ? `<ChevronRight size={24} className="text-white" />` : `<ChevronRight size={16} className="text-white" />`;
  
  const leftRegex = /<LiquidGlass[\s\S]*?onClick=\{\(\) => scroll\('left'\)\}[\s\S]*?>[\s\S]*?<\/LiquidGlass>/g;
  code = code.replace(leftRegex, `<button
            onClick={() => scroll('left')}
            className="${size} rounded-full glass-button flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            ${leftIcon}
          </button>`);
          
  const rightRegex = /<LiquidGlass[\s\S]*?onClick=\{\(\) => scroll\('right'\)\}[\s\S]*?>[\s\S]*?<\/LiquidGlass>/g;
  code = code.replace(rightRegex, `<button
            onClick={() => scroll('right')}
            className="${size} rounded-full glass-button flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            ${rightIcon}
          </button>`);
          
  fs.writeFileSync(file, code);
  console.log('Fixed', file);
}

replaceArrows('src/components/Movies.tsx', true);
replaceArrows('src/components/ContinueWatchingRow.tsx', false);
