const fs = require('fs');
let content = fs.readFileSync('src/components/Movies.tsx', 'utf8');

// Replace import { WatchModal } from './WatchModal';
content = content.replace(/import \{ WatchModal \} from '\.\/WatchModal';\n/g, "import { lazy, Suspense } from 'react';\nconst WatchModal = lazy(() => import('./WatchModal').then(module => ({ default: module.WatchModal })));\n");

// Add Suspense around WatchModal
content = content.replace(/<WatchModal\b/g, '<Suspense fallback={null}><WatchModal');
content = content.replace(/(\s+onToggleFavorite=\{toggleFavorite\}\n\s+\/>)/g, '$1</Suspense>');
content = content.replace(/(\s+isFavorite=\{isFavorite\(selectedMovieId\)\}\n\s+\/>)/g, '$1</Suspense>');

fs.writeFileSync('src/components/Movies.tsx', content);
console.log("Lazy loaded WatchModal");
