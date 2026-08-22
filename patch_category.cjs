const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

code = code.replace(
`function CategoryRow({ title, fetcher, onSelect, isFavorite, toggleFavorite, country }: any) {`,
`function CategoryRow({ title, fetcher, onSelect, isFavorite, toggleFavorite, country, onSeeAll }: any) {`
);

code = code.replace(
`      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight drop-shadow">{title}</h3>
      </div>`,
`      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight drop-shadow">{title}</h3>
        </div>
        {onSeeAll && (
          <button 
            onClick={onSeeAll}
            className="text-xs font-bold text-amber-500 hover:text-amber-400 tracking-wider uppercase transition-colors hidden sm:block"
          >
            See All
          </button>
        )}
      </div>`
);

code = code.replace(
`          title="Now Showing" 
          fetcher={cinemasFetcher} 
          onSelect={onSelectMovie} 
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          country={country}
        />`,
`          title="Now Showing" 
          fetcher={cinemasFetcher} 
          onSelect={onSelectMovie} 
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          country={country}
          onSeeAll={() => onSeeAll('now-showing', 'movie')}
        />`
);

fs.writeFileSync('src/components/Movies.tsx', code);
