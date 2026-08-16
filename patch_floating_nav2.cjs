const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingNav.tsx', 'utf8');

// 1. Remove the old mobile profile menu from top
const oldMobileProfile = `      <div className="sm:hidden fixed top-4 right-4 z-50 pointer-events-auto flex items-center">\n        {profileMenu}\n      </div>`;
code = code.replace(oldMobileProfile, "");

// 2. Update the mobileLinks mapping
const oldMobileLinks = `{(() => {
            const mobileLinks = [
              { id: 'movies', label: 'Movies', icon: Film },
              { id: 'tv', label: 'TV Shows', icon: Tv },
              { id: 'search', label: 'Search', icon: Search, action: () => { setIsSearchExpanded(true); setActiveTab('search'); } },
              { id: 'favorites', label: 'Favorites', icon: Bookmark }
            ];
            return mobileLinks.map((link) => {
              const isActive = activeTab === link.id;
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => {
                  if (link.action) {
                    link.action();
                  } else {
                    setActiveTab(link.id);
                  }
                }}
                className="relative flex flex-col items-center justify-center w-14 h-14 rounded-full text-white/70 hover:text-white transition-colors duration-200 outline-none"
                style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.7)' }}
              >
                <div 
                   className={\`absolute inset-0 bg-amber-500 rounded-full transition-opacity duration-[260ms] ease-out \${isActive ? 'opacity-15' : 'opacity-0'}\`} 
                  style={{ zIndex: -1 }}
                />
                <Icon size={20} className="mb-1" />
                <span className="text-[10px] font-medium leading-none">{(link as any).mobileLabel || link.label}</span>
              </button>
            );
          }); })()}`;

const newMobileLinks = `{(() => {
            const mobileLinks = [
              { id: 'movies', label: 'Movies', icon: Film },
              { id: 'tv', label: 'TV Shows', icon: Tv },
              { id: 'favorites', label: 'Favorites', icon: Bookmark },
              { id: 'profile', isProfile: true },
              { id: 'search', label: 'Search', icon: Search, action: () => { setIsSearchExpanded(true); setActiveTab('search'); } }
            ];
            return mobileLinks.map((link) => {
              if (link.isProfile) {
                return (
                  <div key="profile" className="flex items-center justify-center w-14 h-14">
                    {profileMenu && React.isValidElement(profileMenu) ? React.cloneElement(profileMenu as React.ReactElement<any>, { variant: 'mobile' }) : null}
                  </div>
                );
              }
            
              const isActive = activeTab === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    if (link.action) {
                      link.action();
                    } else {
                      setActiveTab(link.id);
                    }
                  }}
                  className="relative flex flex-col items-center justify-center w-14 h-14 rounded-full text-white/70 hover:text-white transition-colors duration-200 outline-none"
                  style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.7)' }}
                >
                  <div 
                     className={\`absolute inset-0 bg-amber-500 rounded-full transition-opacity duration-[260ms] ease-out \${isActive ? 'opacity-15' : 'opacity-0'}\`} 
                    style={{ zIndex: -1 }}
                  />
                  <Icon size={20} className="mb-1" />
                  <span className="text-[10px] font-medium leading-none">{(link as any).mobileLabel || link.label}</span>
                </button>
              );
            });
          })()}`;

code = code.replace(oldMobileLinks, newMobileLinks);
fs.writeFileSync('src/components/FloatingNav.tsx', code);
