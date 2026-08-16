const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingNav.tsx', 'utf-8');

// 1. Hide the entire top pill on mobile
code = code.replace(
  /<div className="fixed top-0 left-0 w-full flex justify-center py-5 z-50 pointer-events-none px-4">/,
  '<div className="hidden sm:flex fixed top-0 left-0 w-full justify-center py-5 z-50 pointer-events-none px-4">'
);

// 2. Add mobile floating elements above the Desktop Top Pill
const mobileTopElements = `
      {/* Mobile Top Floating Elements */}
      <div className="sm:hidden fixed top-0 left-0 w-full h-24 bg-gradient-to-b from-black/80 to-transparent z-40 pointer-events-none" />
      <div className="sm:hidden fixed top-4 left-4 z-50 pointer-events-auto cursor-pointer flex items-center gap-2" onClick={onBack}>
        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
          <Play size={16} className="text-white ml-0.5 fill-current" />
        </div>
        <span className="font-bold text-[17px] tracking-tight text-white drop-shadow">
          JAMBOX<span className="text-amber-500">+</span>
        </span>
      </div>
      <div className="sm:hidden fixed top-4 right-4 z-50 pointer-events-auto flex items-center">
        {profileMenu}
      </div>

      <div className="hidden sm:flex fixed top-0 left-0 w-full justify-center py-5 z-50 pointer-events-none px-4">
`;

code = code.replace(
  /<div className="hidden sm:flex fixed top-0 left-0 w-full justify-center py-5 z-50 pointer-events-none px-4">/,
  mobileTopElements
);

fs.writeFileSync('src/components/FloatingNav.tsx', code);
