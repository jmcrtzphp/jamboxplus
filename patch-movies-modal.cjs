const fs = require('fs');

let movies = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

movies = movies.replace(
  /\{\/\* Watch & Playback Modal - Liquid Glass with CineSrc Player \*\/\}[\s\S]*?<WatchModal onSelectRelated=\{handleSelectMovie\}[\s\S]*?showId=\{selectedMovieId\}[\s\S]*?country=\{country\}[\s\S]*?onClose=\{handleCloseModal\}[\s\S]*?isFavorite=\{selectedMovieId \? isFavorite\(selectedMovieId\) : false\}[\s\S]*?onToggleFavorite=\{toggleFavorite\}[\s\S]*?\/>/,
  `{/* Watch & Playback Modal - Liquid Glass with CineSrc Player */}
      <AnimatePresence>
        {selectedMovieId && (
          <WatchModal onSelectRelated={handleSelectMovie} 
             showId={selectedMovieId} 
             country={country} 
             onClose={handleCloseModal} 
             isFavorite={isFavorite(selectedMovieId)}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </AnimatePresence>`
);

fs.writeFileSync('src/components/Movies.tsx', movies);

let modal = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');
// if (!showId) return null; -> remove or change
modal = modal.replace(/if \(!showId\) return null;/g, 'if (!showId) return null;'); 
// Wait, if showId is required, leaving it is fine, but it might momentarily become null if it animates out?
// If it's conditionally rendered in Movies, showId will never be null when WatchModal renders!
// BUT AnimatePresence keeps the component mounted during exit animation.
// If Movies.tsx unmounts WatchModal, the props passed to WatchModal during exit will be the LAST props it had (selectedMovieId will be whatever it was before). Wait, `selectedMovieId` becomes null, so `showId={selectedMovieId}` will be null during exit!
// So if (!showId) return null; WILL instantly kill the exit animation.
// To fix this, WatchModal should handle its own presence.

