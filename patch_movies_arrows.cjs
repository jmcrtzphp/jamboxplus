const fs = require('fs');

let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

// Add import if missing
if (!code.includes('import { LiquidGlass }')) {
  code = code.replace("import { GlassButton, GlassPill, GlassContainer } from './liquid-glass';", "import { GlassButton, GlassPill, GlassContainer } from './liquid-glass';\nimport { LiquidGlass } from './LiquidGlass';");
}

// Replace left arrow (rounded-r-2xl h-24 -> liquid glass circle w-12 h-12)
const oldLeftArrow = /<button\s+onClick=\{\(\) => scroll\('left'\)\}\s+className="absolute -left-4 top-1\/2 -translate-y-1\/2 z-20 w-10 h-24 glass-subtle rounded-r-2xl hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"\s*>\s*<ChevronRight size=\{24\} className="rotate-180 text-white" \/>\s*<\/button>/g;

const newLeftArrow = `
        <div className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <LiquidGlass
            scale={-112}
            chroma={6}
            border={0.07}
            mapBlur={12}
            blur={3}
            saturate={140}
            brightness={1.3}
            radius={999}
            className="w-12 h-12 flex items-center justify-center cursor-pointer pointer-events-auto"
            onClick={() => scroll('left')}
          >
            <ChevronRight size={24} className="rotate-180 text-white" />
          </LiquidGlass>
        </div>
`;

// Replace right arrow
const oldRightArrow = /<button\s+onClick=\{\(\) => scroll\('right'\)\}\s+className="absolute -right-4 top-1\/2 -translate-y-1\/2 z-20 w-10 h-24 glass-subtle rounded-l-2xl hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"\s*>\s*<ChevronRight size=\{24\} className="text-white" \/>\s*<\/button>/g;

const newRightArrow = `
        <div className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <LiquidGlass
            scale={-112}
            chroma={6}
            border={0.07}
            mapBlur={12}
            blur={3}
            saturate={140}
            brightness={1.3}
            radius={999}
            className="w-12 h-12 flex items-center justify-center cursor-pointer pointer-events-auto"
            onClick={() => scroll('right')}
          >
            <ChevronRight size={24} className="text-white" />
          </LiquidGlass>
        </div>
`;

code = code.replace(oldLeftArrow, newLeftArrow.trim());
code = code.replace(oldRightArrow, newRightArrow.trim());

fs.writeFileSync('src/components/Movies.tsx', code);
