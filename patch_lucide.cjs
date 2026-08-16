const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

// The original import looks like:
// import { Play, Search, Film, Tv, ChevronRight, ChevronLeft, Loader2, Star, X, Check, ExternalLink, Radio, Bookmark, Flame, Sparkles, Laugh, Skull, Wand2, Heart, Users, Shield, Music, Clapperboard, Plus } from 'lucide-react';
// We just need to replace the import to make sure all icons we need are there.
code = code.replace(
  /import \{ Play, Search,.*\} from 'lucide-react';/,
  `import { Play, Search, Film, Tv, ChevronRight, ChevronLeft, Loader2, Star, X, Check, ExternalLink, Radio, Bookmark, Flame, Sparkles, Laugh, Skull, Wand2, Heart, Users, Shield, Music, Clapperboard, Plus, Compass, Smile, Fingerprint, Camera, Landmark, Rocket, Zap, Baby, Newspaper, Mic } from 'lucide-react';`
);

fs.writeFileSync('src/components/Movies.tsx', code);
