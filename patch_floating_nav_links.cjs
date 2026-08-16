const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingNav.tsx', 'utf8');

const startStr = 'const mobileLinks = [';
const endStr = '];\\n            return mobileLinks.map((link) => {';

const replacement = `const mobileLinks = [
              { id: 'movies', label: 'Movies', icon: Film },
              { id: 'tv', label: 'TV Shows', icon: Tv },
              { id: 'favorites', label: 'Favorites', icon: Bookmark },
              { id: 'profile', isProfile: true },
              { id: 'search', label: 'Search', icon: Search, action: () => { setIsSearchExpanded(true); setActiveTab('search'); } }
            ];
            return mobileLinks.map((link) => {
              if (link.isProfile) {
                return (
                  <div key="profile" className="flex items-center justify-center w-14 h-14 relative">
                    {profileMenu && React.isValidElement(profileMenu) ? React.cloneElement(profileMenu as React.ReactElement<any>, { variant: 'mobile' }) : null}
                  </div>
                );
              }`;

// Simple regex replace since spacing can be tricky
code = code.replace(/const mobileLinks = \[[\s\S]*?return mobileLinks\.map\(\(link\) => \{/, replacement);

fs.writeFileSync('src/components/FloatingNav.tsx', code);
