const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

// replace GENRE_CATEGORIES with GENRE_LIST
code = code.replace(/GENRE_CATEGORIES/g, 'GENRE_LIST');

// Handle duplicates: remove my newly added import line and just combine them.
const myImportLine = "import { ArrowLeft, Film, Compass, Clapperboard, Smile, Fingerprint, Camera, Star, Users, Wand2, Landmark, Skull, Music, Search, Heart, Rocket, Zap, Shield, Baby, Newspaper, Tv, Sparkles, Mic } from 'lucide-react';";
code = code.replace(myImportLine, "");

fs.writeFileSync('src/components/Movies.tsx', code);
