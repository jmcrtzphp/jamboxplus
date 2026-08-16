const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingNav.tsx', 'utf-8');

// Hide search button in top nav on mobile
code = code.replace(/<button\n\s*onClick=\{.*?window\.innerWidth < 640[\s\S]*?aria-label="Search"\n\s*>/, 
  match => match.replace('className="w-9 h-9 flex items-center', 'className="hidden sm:flex w-9 h-9 items-center'));

// Modify mobile links in bottom nav
const mobileLinksReplace = `
          {(() => {
            const mobileLinks = [
              { id: 'movies', label: 'Movies', icon: Film },
              { id: 'tv', label: 'TV Shows', icon: Tv },
              { id: 'search', label: 'Search', icon: Search, action: () => { setIsSearchExpanded(true); setActiveTab('search'); } },
              { id: 'livetv', label: 'Live TV', action: () => onNavigate?.('livetv'), icon: Radio },
              { id: 'favorites', label: \`Favorites\`, icon: Bookmark }
            ];
            return mobileLinks.map((link) => {
`;
code = code.replace(/\{links\.map\(\(link\) => \{/, mobileLinksReplace);
code = code.replace(/<\/button>\n\s*\);\n\s*\}\)\}/, "</button>\n            );\n          })()}");

fs.writeFileSync('src/components/FloatingNav.tsx', code);
