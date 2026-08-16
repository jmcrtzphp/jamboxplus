const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

const startStr = 'const GenreIcon = React.memo';
const endStr = '});';
const startIdx = code.indexOf(startStr);
// Find the nearest }); after startIdx
const endIdx = code.indexOf(endStr, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `const GenreIcon = React.memo(function GenreIcon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const IconMap: any = { Flame, Compass, Clapperboard, Laugh: Smile, Fingerprint, Camera, Star, Users, Wand2, Landmark, Skull, Music, Search, Heart, Rocket, Zap, Shield, Baby, Newspaper, Tv, Sparkles, Mic };
  const Icon = IconMap[name] || Film;
  return <Icon size={size} className={className} />;
});`;
  code = code.substring(0, startIdx) + replacement + code.substring(endIdx + endStr.length);
  fs.writeFileSync('src/components/Movies.tsx', code);
}
