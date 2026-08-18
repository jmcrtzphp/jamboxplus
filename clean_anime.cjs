const fs = require('fs');

function cleanMovies() {
  let content = fs.readFileSync('src/components/Movies.tsx', 'utf8');
  
  // Remove import
  content = content.replace(/import \{ AnimeHome.*?from '\.\.\/anime';\n/g, '');
  
  // Update state type (quick hack: just remove ' | 'anime'')
  content = content.replace(/ \| 'anime'/g, '');
  
  // Remove state variables
  content = content.replace(/.*const \[selectedAnimeId.*\n/g, '');
  content = content.replace(/.*const \[playingAnime.*\n/g, '');
  content = content.replace(/.*const \[anime, setAnime\].*\n/g, '');
  
  // Remove activeTab === 'anime' block
  // We can just use a regex that matches from `) : activeTab === 'anime' ? (` to `) : activeTab === 'favorites' ? (`
  content = content.replace(/\) : activeTab === 'anime' \? \([\s\S]*?\) : activeTab === 'favorites' \? \(/, ") : activeTab === 'favorites' ? (");
  
  // Remove startsWith('anime-') blocks in FavoriteItem click handler
  content = content.replace(/if \(id\.startsWith\('anime-'\)\) \{[\s\S]*?\} else \{([\s\S]*?)\}/g, '$1');
  
  // Remove Anime Details Modal & Player block
  content = content.replace(/\{\/\* Anime Details Modal & Player from Favorites \*\/\}[\s\S]*?\{\/\* Floating Navigation \*\/\}/, '{/* Floating Navigation */}');
  // Wait, let's just do it carefully.
  content = content.replace(/\{\/\* Anime Details Modal & Player from Favorites \*\/\}[\s\S]*?<\/AnimatePresence>\s*\{playingAnime && \([\s\S]*?<\/>\s*\)}/g, '');

  fs.writeFileSync('src/components/Movies.tsx', content);
}

function cleanFloatingNav() {
  let content = fs.readFileSync('src/components/FloatingNav.tsx', 'utf8');
  content = content.replace(/\{ id: 'anime', label: 'Anime', icon: Sparkles \},\n/g, '');
  fs.writeFileSync('src/components/FloatingNav.tsx', content);
}

function cleanFooter() {
  let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');
  content = content.replace(/<li><a href="#" className="text-white\/50 hover:text-amber-500 text-sm transition-colors">Anime<\/a><\/li>\n/g, '');
  fs.writeFileSync('src/components/Footer.tsx', content);
}

cleanMovies();
cleanFloatingNav();
cleanFooter();
console.log("Cleaned");
