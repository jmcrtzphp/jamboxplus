const fs = require('fs');

let code = fs.readFileSync('src/components/ContinueWatchingRow.tsx', 'utf-8');

if (!code.includes('import { LiquidGlass }')) {
  code = code.replace("import { Play, X, ChevronRight, ChevronLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';", "import { Play, X, ChevronRight, ChevronLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';\nimport { LiquidGlass } from './LiquidGlass';");
}

const oldLeftArrow = /<button\s+onClick=\{\(\) => scroll\('left'\)\}\s+className="p\.1\.5 rounded-full glass-subtle hover:glass-medium text-white transition-all cursor-pointer"\s*>\s*<ChevronLeft size=\{16\} \/>\s*<\/button>/g;

const oldLeftStr = `<button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-full glass-subtle hover:glass-medium text-white transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>`;

const newLeftStr = `<div className="pointer-events-auto">
              <LiquidGlass
                scale={-112}
                chroma={6}
                border={0.07}
                mapBlur={12}
                blur={3}
                saturate={140}
                brightness={1.3}
                radius={999}
                className="w-8 h-8 flex items-center justify-center cursor-pointer"
                onClick={() => scroll('left')}
              >
                <ChevronLeft size={16} className="text-white" />
              </LiquidGlass>
            </div>`;

const oldRightStr = `<button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-full glass-subtle hover:glass-medium text-white transition-all cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>`;

const newRightStr = `<div className="pointer-events-auto">
              <LiquidGlass
                scale={-112}
                chroma={6}
                border={0.07}
                mapBlur={12}
                blur={3}
                saturate={140}
                brightness={1.3}
                radius={999}
                className="w-8 h-8 flex items-center justify-center cursor-pointer"
                onClick={() => scroll('right')}
              >
                <ChevronRight size={16} className="text-white" />
              </LiquidGlass>
            </div>`;

code = code.replace(oldLeftStr, newLeftStr);
code = code.replace(oldRightStr, newRightStr);

fs.writeFileSync('src/components/ContinueWatchingRow.tsx', code);
