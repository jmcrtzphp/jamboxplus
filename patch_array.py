import re

with open('src/components/FloatingNav.tsx', 'r') as f:
    text = f.read()

# Pattern for movies
text = re.sub(r"\{\s*id:\s*'movies',\s*label:\s*'Movies',\s*icon:\s*Film\s*\}", r"{ id: 'movies', label: 'Movies', icon: Film, mobileIcon: CustomFilmIcon }", text)

# Pattern for tv
text = re.sub(r"\{\s*id:\s*'tv',\s*label:\s*'TV Shows',\s*icon:\s*Tv\s*\}", r"{ id: 'tv', label: 'TV Shows', icon: Tv, mobileIcon: CustomTvIcon }", text)

# Pattern for favorites
text = re.sub(r"\{\s*id:\s*'favorites',\s*label:\s*`Favorites\$\{favoritesCount > 0 \? ` \(\$\{favoritesCount\}\)` : ''\}`,\s*icon:\s*Bookmark,\s*mobileLabel:\s*'Favorites'\s*\}", r"{ id: 'favorites', label: `Favorites${favoritesCount > 0 ? ` (${favoritesCount})` : ''}`, icon: Bookmark, mobileLabel: 'Favorites', mobileIcon: CustomBookmarkIcon }", text)

# Pattern for search
text = re.sub(r"\{\s*id:\s*'search',\s*label:\s*'Search',\s*icon:\s*Search\s*\}", r"{ id: 'search', label: 'Search', icon: Search, mobileIcon: CustomSearchIcon }", text)

with open('src/components/FloatingNav.tsx', 'w') as f:
    f.write(text)

