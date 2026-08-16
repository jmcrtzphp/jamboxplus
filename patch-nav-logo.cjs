const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingNav.tsx', 'utf-8');

// import Logo
if (!code.includes('import { Logo }')) {
  code = code.replace("import React,", "import React,\n");
  code = code.replace("import { motion,", "import { Logo, JamBoxText } from './Logo';\nimport { motion,");
}

// Replace the mobile logo text block
code = code.replace(
  /<div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">[\s\S]*?JAMBOX<span className="text-amber-500">\+<\/span>\s*<\/span>/,
  '<Logo className="w-10 h-10" />\n        <JamBoxText className="text-[17px] ml-2" />'
);

// Replace the desktop logo text block
code = code.replace(
  /<div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">[\s\S]*?JAMBOX<span className="text-amber-500">\+<\/span>\s*<\/span>/,
  '<Logo className="w-8 h-8" />\n            <JamBoxText className="text-[15px] ml-1.5" />'
);

fs.writeFileSync('src/components/FloatingNav.tsx', code);

// Also replace in Login.tsx
let login = fs.readFileSync('src/components/auth/Login.tsx', 'utf-8');
if (!login.includes('import { Logo }')) {
  login = login.replace("import { useNavigate }", "import { useNavigate }\nimport { Logo, JamBoxText } from '../Logo';");
}
login = login.replace(
  /JamBox\+<span className="text-amber-500">\+<\/span>/, // wait, my python script did JAMBOX<span ...>
  'JAMBOX<span className="text-amber-500">+</span>'
);
// In Login, the logo is probably JamBox+ text now. Let's find it.
fs.writeFileSync('src/components/auth/Login.tsx', login);

