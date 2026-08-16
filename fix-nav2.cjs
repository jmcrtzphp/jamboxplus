const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingNav.tsx', 'utf-8');

// I will just revert the first `{(() => { const mobileLinks = ...` to `{links.map((link) => {`
// And `})()}` to `})}`.

code = code.replace(/\{\(\(\) => \{\s*const mobileLinks = \[\s*\{ id: 'movies'[\s\S]*?return mobileLinks\.map\(\(link\) => \{/, "{links.map((link) => {");
code = code.replace(/<\/button>\s*\);\s*\}\)\(\)\}/, "</button>\n            );\n          })}");

// Now apply only to mobile nav
code = code.replace(/<div className="sm:hidden fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none">[\s\S]*?\{links\.map\(\(link\) => \{/, match => {
  return match.replace("{links.map((link) => {", `
          {(() => {
            const mobileLinks = [
              { id: 'movies', label: 'Movies', icon: Film },
              { id: 'tv', label: 'TV Shows', icon: Tv },
              { id: 'search', label: 'Search', icon: Search, action: () => { setIsSearchExpanded(true); setActiveTab('search'); } },
              { id: 'livetv', label: 'Live TV', action: () => onNavigate?.('livetv'), icon: Radio },
              { id: 'favorites', label: 'Favorites', icon: Bookmark }
            ];
            return mobileLinks.map((link) => {
  `);
});

// also fix the matching parenthesis at the end of mobile nav
code = code.replace(/<\/button>\s*\);\s*\}\)\}\s*<\/div>/, "</button>\n            );\n          })()}\n        </div>");

fs.writeFileSync('src/components/FloatingNav.tsx', code);
