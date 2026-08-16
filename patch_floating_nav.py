import re

with open('src/components/FloatingNav.tsx', 'r') as f:
    content = f.read()

# Remove profileMenu from props
content = content.replace("  profileMenu?: React.ReactNode;", "")
content = content.replace("  profileMenu,\n", "")
content = content.replace("  profileMenu\n", "")
content = content.replace(", profileMenu", "")
content = content.replace("profileMenu,", "")
content = content.replace("              {profileMenu}\n", "")

# Remove profile from mobileLinks
old_mobile_links = """            const mobileLinks = [
              { id: 'movies', label: 'Movies', icon: Film },
              { id: 'tv', label: 'TV Shows', icon: Tv },
              { id: 'favorites', label: 'Favorites', icon: Bookmark },
              { id: 'profile', isProfile: true },
              { id: 'search', label: 'Search', icon: Search, action: () => { setIsSearchExpanded(true); setActiveTab('search'); } }
            ];"""
new_mobile_links = """            const mobileLinks = [
              { id: 'movies', label: 'Movies', icon: Film },
              { id: 'tv', label: 'TV Shows', icon: Tv },
              { id: 'favorites', label: 'Favorites', icon: Bookmark },
              { id: 'search', label: 'Search', icon: Search, action: () => { setIsSearchExpanded(true); setActiveTab('search'); } }
            ];"""
content = content.replace(old_mobile_links, new_mobile_links)

old_profile_render = """              if (link.isProfile) {
                return (
                  <div key="profile" className="flex items-center justify-center w-14 h-14 relative">
                    {profileMenu && React.isValidElement(profileMenu) ? React.cloneElement(profileMenu as React.ReactElement<any>, { variant: 'mobile' }) : null}
                  </div>
                );
              }"""
content = content.replace(old_profile_render, "")

with open('src/components/FloatingNav.tsx', 'w') as f:
    f.write(content)

