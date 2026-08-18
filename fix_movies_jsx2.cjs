const fs = require('fs');
let content = fs.readFileSync('src/components/Movies.tsx', 'utf8');

// Replace all instances of `      /></Suspense>` with `      />` except inside AnimatePresence -> WatchModal.
content = content.replace(/(\s+)onToggleFavorite=\{toggleFavorite\}\n(\s+)\/><\/Suspense>/g, '$1onToggleFavorite={toggleFavorite}\n$2/>');

// Put it back exactly for WatchModal where it belongs:
// Let's find WatchModal and ensure it has closing suspense.
let watchModalBlock = `        {selectedMovieId && (
          <Suspense fallback={null}><WatchModal key={selectedMovieId} onSelectRelated={handleSelectMovie} 
             showId={selectedMovieId} 
             country={country} 
             onClose={handleCloseModal} 
             isFavorite={isFavorite(selectedMovieId)}
            onToggleFavorite={toggleFavorite}
          /></Suspense>
        )}`;
content = content.replace(/\{selectedMovieId && \([\s\S]*?\}\)/, watchModalBlock);

fs.writeFileSync('src/components/Movies.tsx', content);
console.log("Fixed JSX syntax 2");
