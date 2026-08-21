const fs = require('fs');

// 1. FloatingNav.tsx
let nav = fs.readFileSync('src/components/FloatingNav.tsx', 'utf-8');
nav = nav.replace(
  "{ id: 'paramount', label: 'Paramount+', icon: () => <span className=\"font-bold text-xs bg-[#0064FF] text-white px-1.5 py-0.5 rounded\">P+</span>, mobileIcon: () => <span className=\"font-bold text-[10px] bg-[#0064FF] text-white px-1 py-0.5 rounded\">P+</span> },\n    ",
  ""
);
nav = nav.replace(
  "                  { id: 'paramount', label: 'P+', icon: () => <span className=\"font-bold text-[10px] bg-[#0064FF] text-white px-1 py-0.5 rounded\">P+</span>, mobileIcon: () => <span className=\"font-bold text-[10px] bg-[#0064FF] text-white px-1 py-0.5 rounded\">P+</span> },\n",
  ""
);
fs.writeFileSync('src/components/FloatingNav.tsx', nav);
console.log("FloatingNav updated");

// 2. Footer.tsx
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf-8');
footer = footer.replace(
  "\n              Streaming availability data provided by JustWatch.",
  ""
);
fs.writeFileSync('src/components/Footer.tsx', footer);
console.log("Footer updated");

