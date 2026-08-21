const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingNav.tsx', 'utf-8');

// 1. Remove both bad paramount additions
code = code.replace(
  `    { id: 'paramount', label: 'Paramount+', icon: () => <span className="font-bold text-xs bg-[#0064FF] text-white px-1.5 py-0.5 rounded">P+</span>, mobileIcon: () => <span className="font-bold text-[10px] bg-[#0064FF] text-white px-1 py-0.5 rounded">P+</span> },
    { id: 'paramount', label: 'P+', icon: () => <span className="font-bold text-xs bg-[#0064FF] text-white px-1.5 py-0.5 rounded">P+</span>, mobileIcon: () => <span className="font-bold text-[10px] bg-[#0064FF] text-white px-1 py-0.5 rounded">P+</span> },
                  `,
  ""
);

// 2. Add the correct one to the desktop list
code = code.replace(
  "{ id: 'movies', label: 'Movies', icon: Film, mobileIcon: CustomFilmIcon },",
  "{ id: 'paramount', label: 'Paramount+', icon: () => <span className=\"font-bold text-xs bg-[#0064FF] text-white px-1.5 py-0.5 rounded\">P+</span>, mobileIcon: () => <span className=\"font-bold text-[10px] bg-[#0064FF] text-white px-1 py-0.5 rounded\">P+</span> },\n    { id: 'movies', label: 'Movies', icon: Film, mobileIcon: CustomFilmIcon },"
);

// 3. Add to the mobile list
code = code.replace(
  "                  { id: 'movies', label: 'Movies', icon: Film, mobileIcon: CustomFilmIcon },\n                  { id: 'tv'",
  "                  { id: 'paramount', label: 'P+', icon: () => <span className=\"font-bold text-[10px] bg-[#0064FF] text-white px-1 py-0.5 rounded\">P+</span>, mobileIcon: () => <span className=\"font-bold text-[10px] bg-[#0064FF] text-white px-1 py-0.5 rounded\">P+</span> },\n                  { id: 'movies', label: 'Movies', icon: Film, mobileIcon: CustomFilmIcon },\n                  { id: 'tv'"
);

fs.writeFileSync('src/components/FloatingNav.tsx', code);
