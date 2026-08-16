const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

// Replace the HeroBanner definition
const oldBannerStart = 'const HeroBanner = React.memo(function HeroBanner({ country, type, heroMovie, setHeroMovie, onSelect, isFavorite, onToggleFavorite }: any) {';
const oldBannerEndRegex = /<GlassButton \n            variant="secondary" \n            size="md"\n            onClick={\(e\) => onToggleFavorite\(e, heroMovie\.id\)}\n            className="cursor-pointer"\n          >\n            \{isFavorite \? <Check size=\{17\} className="text-green-400" \/> : <Plus size=\{17\} \/>\}\n            \{isFavorite \? 'Saved to Favorites' : 'Add to Favorites'\}\n          <\/GlassButton>\n        <\/div>\n      <\/div>\n    <\/div>\n  \);\n\}\);/g;

// Find start and end to extract it. Or simply use a regex block replacement
