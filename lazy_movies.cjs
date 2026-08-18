const fs = require('fs');
let content = fs.readFileSync('src/components/Movies.tsx', 'utf8');

// Replace direct imports with lazy imports for modals
content = content.replace(/import \{ PlayerModal \} from '\.\/PlayerModal';\n/g, "import { lazy, Suspense } from 'react';\nconst PlayerModal = lazy(() => import('./PlayerModal').then(module => ({ default: module.PlayerModal })));\n");
content = content.replace(/import \{ ShowDetailsModal \} from '\.\/ShowDetailsModal';\n/g, "const ShowDetailsModal = lazy(() => import('./ShowDetailsModal').then(module => ({ default: module.ShowDetailsModal })));\n");

// Wrap usages in Suspense
content = content.replace(/<PlayerModal/g, '<Suspense fallback={null}><PlayerModal');
content = content.replace(/(\s+onClose=\{\(\) => setPlayingMedia\(null\)\}\n\s+\/>)/g, '$1</Suspense>');

content = content.replace(/<ShowDetailsModal/g, '<Suspense fallback={null}><ShowDetailsModal');
content = content.replace(/(\s+onToggleFavorite=\{toggleFavorite\}\n\s+\/>)/g, '$1</Suspense>');

fs.writeFileSync('src/components/Movies.tsx', content);
console.log("Lazy loaded modals");
