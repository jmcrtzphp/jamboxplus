const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingNav.tsx', 'utf8');

code = code.replace(
  /className="w-full relative pointer-events-auto z-10 -mt-4"/,
  `className="w-full relative pointer-events-auto z-10 -mt-[14px]"`
);

// Add more padding to right of input so text doesn't hit the close button
code = code.replace(
  /className="w-full bg-\[rgba\(20,23,29,0\.5\)\] backdrop-blur-\[30px\] border border-\[rgba\(255,255,255,0\.15\)\] rounded-\[24px\] py-4 pl-12 pr-12 text-\[15px\] text-white placeholder-white\/40 outline-none focus:border-amber-500\/50 shadow-\[0_8px_32px_rgba\(0,0,0,0\.4\)\] transition-all"/,
  `className="w-full bg-[rgba(20,23,29,0.5)] backdrop-blur-[30px] border border-[rgba(255,255,255,0.15)] rounded-[24px] py-4 pl-12 pr-[48px] text-[15px] text-white placeholder-white/40 outline-none focus:border-amber-500/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all"`
);

fs.writeFileSync('src/components/FloatingNav.tsx', code);
