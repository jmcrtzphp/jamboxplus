const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingNav.tsx', 'utf8');

code = code.replace(
  /<div className="pointer-events-auto bg-\[rgba\(255,255,255,0\.05\)\] backdrop-blur-\[20px\] border border-\[rgba\(255,255,255,0\.15\)\] rounded-full p-1 shadow-\[0_8px_24px_rgba\(0,0,0,0\.5\)\] z-20 relative">/,
  `<div className="pointer-events-auto z-20 relative">`
);

fs.writeFileSync('src/components/FloatingNav.tsx', code);
