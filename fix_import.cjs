const fs = require('fs');
let code = fs.readFileSync('src/components/ContinueWatchingRow.tsx', 'utf-8');

if (!code.includes('import { LiquidGlass }')) {
  code = code.replace(
    "import { GlassPill } from './liquid-glass';", 
    "import { GlassPill } from './liquid-glass';\nimport { LiquidGlass } from './LiquidGlass';"
  );
  fs.writeFileSync('src/components/ContinueWatchingRow.tsx', code);
  console.log('Fixed import in ContinueWatchingRow.tsx');
}
