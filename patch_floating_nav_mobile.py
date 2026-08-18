import re

with open('src/components/FloatingNav.tsx', 'r') as f:
    text = f.read()

custom_icons = """
const CustomFilmIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M9 3L8 8M16 3L15 8M22 8H2M6.8 21H17.2C18.8802 21 19.7202 21 20.362 20.673C20.9265 20.3854 21.3854 19.9265 21.673 19.362C22 18.7202 22 17.8802 22 16.2V7.8C22 6.11984 22 5.27976 21.673 4.63803C21.3854 4.07354 20.9265 3.6146 20.362 3.32698C19.7202 3 18.8802 3 17.2 3H6.8C5.11984 3 4.27976 3 3.63803 3.32698C3.07354 3.6146 2.6146 4.07354 2.32698 4.63803C2 5.27976 2 6.11984 2 7.8V16.2C2 17.8802 2 18.7202 2.32698 19.362C2.6146 19.9265 3.07354 20.3854 3.63803 20.673C4.27976 21 5.11984 21 6.8 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CustomTvIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M17 3L12 7L7 3M6.8 21H17.2C18.8802 21 19.7202 21 20.362 20.673C20.9265 20.3854 21.3854 19.9265 21.673 19.362C22 18.7202 22 17.8802 22 16.2V11.8C22 10.1198 22 9.27976 21.673 8.63803C21.3854 8.07354 20.9265 7.6146 20.362 7.32698C19.7202 7 18.8802 7 17.2 7H6.8C5.11984 7 4.27976 7 3.63803 7.32698C3.07354 7.6146 2.6146 8.07354 2.32698 8.63803C2 9.27976 2 10.1198 2 11.8V16.2C2 17.8802 2 18.7202 2.32698 19.362C2.6146 19.9265 3.07354 20.3854 3.63803 20.673C4.27976 21 5.11984 21 6.8 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CustomBookmarkIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4.5 22V17M4.5 7V2M2 4.5H7M2 19.5H7M13 3L11.2658 7.50886C10.9838 8.24209 10.8428 8.60871 10.6235 8.91709C10.4292 9.1904 10.1904 9.42919 9.91709 9.62353C9.60871 9.84281 9.24209 9.98381 8.50886 10.2658L4 12L8.50886 13.7342C9.24209 14.0162 9.60871 14.1572 9.91709 14.3765C10.1904 14.5708 10.4292 14.8096 10.6235 15.0829C10.8428 15.3913 10.9838 15.7579 11.2658 16.4911L13 21L14.7342 16.4911C15.0162 15.7579 15.1572 15.3913 15.3765 15.0829C15.5708 14.8096 15.8096 14.5708 16.0829 14.3765C16.3913 14.1572 16.7579 14.0162 17.4911 13.7342L22 12L17.4911 10.2658C16.7579 9.98381 16.3913 9.8428 16.0829 9.62353C15.8096 9.42919 15.5708 9.1904 15.3765 8.91709C15.1572 8.60871 15.0162 8.24209 14.7342 7.50886L13 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CustomSearchIcon = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 21L16.65 16.65M11 6C13.7614 6 16 8.23858 16 11M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

"""

# Inject custom icons after imports
text = re.sub(r'(import \{ fetchSearchSuggestions, SearchSuggestion \} from \'../lib/tmdb\';)', r'\1\n\n' + custom_icons, text)

# Find the mobile nav links array and replace it
# From:
# { id: 'movies', label: 'Movies', icon: Film },
# { id: 'tv', label: 'TV Shows', icon: Tv },
# { id: 'favorites', label: `Favorites${favoritesCount > 0 ? ` (${favoritesCount})` : ''}`, icon: Bookmark, mobileLabel: 'Favorites' },
# { id: 'search', label: 'Search', icon: Search }

old_nav_block = """                  { id: 'movies', label: 'Movies', icon: Film },
                  { id: 'tv', label: 'TV Shows', icon: Tv },
                  { id: 'favorites', label: `Favorites${favoritesCount > 0 ? ` (${favoritesCount})` : ''}`, icon: Bookmark, mobileLabel: 'Favorites' },
                  { id: 'search', label: 'Search', icon: Search }"""

new_nav_block = """                  { id: 'movies', label: 'Movies', mobileIcon: CustomFilmIcon, icon: Film },
                  { id: 'tv', label: 'TV Shows', mobileIcon: CustomTvIcon, icon: Tv },
                  { id: 'favorites', label: `Favorites${favoritesCount > 0 ? ` (${favoritesCount})` : ''}`, mobileIcon: CustomBookmarkIcon, icon: Bookmark, mobileLabel: 'Favorites' },
                  { id: 'search', label: 'Search', mobileIcon: CustomSearchIcon, icon: Search }"""

text = text.replace(old_nav_block, new_nav_block)

# Update the rendering of the icon and text in mobile nav
# We need to find:
# <Icon size={19} className="mb-0.5" />
# <span className="text-[10px] font-medium leading-none">{link.mobileLabel || link.label}</span>

old_render = """                      <Icon size={19} className="mb-0.5" />
                      <span className="text-[10px] font-medium leading-none">{link.mobileLabel || link.label}</span>"""

# If there's an alternative where mobileIcon exists, use it and remove text
new_render = """                      {link.mobileIcon ? (
                        <link.mobileIcon size={24} className="mb-0 text-current" />
                      ) : (
                        <>
                          <Icon size={19} className="mb-0.5" />
                          <span className="text-[10px] font-medium leading-none">{link.mobileLabel || link.label}</span>
                        </>
                      )}"""

text = text.replace(old_render, new_render)

# Write it back
with open('src/components/FloatingNav.tsx', 'w') as f:
    f.write(text)

print("FloatingNav updated successfully.")
