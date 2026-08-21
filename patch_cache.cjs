const fs = require('fs');

let tmdb = fs.readFileSync('src/lib/tmdb.ts', 'utf-8');

if (!tmdb.includes('export const globalShowCache')) {
  tmdb = tmdb.replace('function normalizeShow(data: any): Show {', `export const globalShowCache = new Map<string, Show>();\n\nfunction normalizeShow(data: any): Show {`);
  
  tmdb = tmdb.replace('return {', `const show: Show = {`);
  
  // Replace the return block of normalizeShow with:
  // show object creation, then:
  // if (globalShowCache.has(show.id)) { Object.assign(globalShowCache.get(show.id), show); } else { globalShowCache.set(show.id, show); }
  // return globalShowCache.get(show.id);
  const returnRegex = /const show: Show = {[\s\S]*?videos: data\.videos\n  };/m;
  tmdb = tmdb.replace(returnRegex, (match) => {
    return match + `\n\n  if (globalShowCache.has(show.id)) {\n    const existing = globalShowCache.get(show.id)!;\n    Object.assign(existing, Object.fromEntries(Object.entries(show).filter(([_, v]) => v !== undefined)));\n  } else {\n    globalShowCache.set(show.id, show);\n  }\n  return globalShowCache.get(show.id)!;`;
  });
  
  fs.writeFileSync('src/lib/tmdb.ts', tmdb);
  console.log('Patched tmdb.ts');
}

let watch = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');
if (!watch.includes('globalShowCache')) {
  watch = watch.replace("import { Show, Episode, SeasonDetails, fetchShowDetails, fetchSeasonDetails, fetchRelatedShows } from '../lib/tmdb';", "import { Show, Episode, SeasonDetails, fetchShowDetails, fetchSeasonDetails, fetchRelatedShows, globalShowCache } from '../lib/tmdb';");
  
  watch = watch.replace('const [show, setShow] = useState<Show | null>(null);', 'const [show, setShow] = useState<Show | null>(() => showId ? globalShowCache.get(showId) || null : null);');
  
  watch = watch.replace('const [loading, setLoading] = useState(true);', 'const [loading, setLoading] = useState(() => !showId || !globalShowCache.has(showId));');
  
  fs.writeFileSync('src/components/WatchModal.tsx', watch);
  console.log('Patched WatchModal.tsx');
}

