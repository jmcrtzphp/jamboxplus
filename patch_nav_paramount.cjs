const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingNav.tsx', 'utf-8');

// Add Paramount tab
code = code.replace(
  "{ id: 'movies', label: 'Movies', icon: Film, mobileIcon: CustomFilmIcon },",
  "{ id: 'paramount', label: 'Paramount+', icon: () => <span className=\"font-bold text-xs bg-[#0064FF] text-white px-1.5 py-0.5 rounded\">P+</span>, mobileIcon: () => <span className=\"font-bold text-[10px] bg-[#0064FF] text-white px-1 py-0.5 rounded\">P+</span> },\n    { id: 'movies', label: 'Movies', icon: Film, mobileIcon: CustomFilmIcon },"
);

code = code.replace(
  "{ id: 'movies', label: 'Movies', icon: Film, mobileIcon: CustomFilmIcon },",
  "{ id: 'paramount', label: 'P+', icon: () => <span className=\"font-bold text-xs bg-[#0064FF] text-white px-1.5 py-0.5 rounded\">P+</span>, mobileIcon: () => <span className=\"font-bold text-[10px] bg-[#0064FF] text-white px-1 py-0.5 rounded\">P+</span> },\n                  { id: 'movies', label: 'Movies', icon: Film, mobileIcon: CustomFilmIcon },"
);

fs.writeFileSync('src/components/FloatingNav.tsx', code);
console.log("Updated FloatingNav.tsx");
