const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf-8');
if (!app.includes('import { Logo')) {
  app = app.replace("import React,", "import React,\n");
  app = app.replace("import { Play,", "import { Logo, JamBoxText } from './components/Logo';\nimport { Play,");
}
app = app.replace(
  /JAMBOX<span className="text-amber-500">\+<\/span>/,
  '<JamBoxText className="text-5xl" />'
);
app = app.replace(
  /<div className="w-20 h-20 bg-amber-500\/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">[\s\S]*?<\/div>/,
  '<Logo className="w-24 h-24 group-hover:scale-110 transition-transform duration-300 drop-shadow-xl" />'
);
fs.writeFileSync('src/App.tsx', app);

let livetv = fs.readFileSync('src/LiveTV.tsx', 'utf-8');
if (!livetv.includes('import { Logo')) {
  livetv = livetv.replace("import React,", "import React,\n");
  livetv = livetv.replace("import { Play,", "import { Logo, JamBoxText } from './components/Logo';\nimport { Play,");
}
livetv = livetv.replace(
  /<div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">[\s\S]*?<\/div>/,
  '<Logo className="w-10 h-10 drop-shadow-xl" />'
);
livetv = livetv.replace(
  /JAMBOX<span className="text-amber-500">\+<\/span>/,
  '<JamBoxText />'
);
fs.writeFileSync('src/LiveTV.tsx', livetv);

let profiles = fs.readFileSync('src/components/profiles/ProfileSelection.tsx', 'utf-8');
if (!profiles.includes('import { Logo')) {
  profiles = profiles.replace("import { Plus,", "import { Logo, JamBoxText } from '../Logo';\nimport { Plus,");
}
profiles = profiles.replace(
  /<div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">[\s\S]*?<\/div>/,
  '<Logo className="w-12 h-12 drop-shadow-xl" />'
);
profiles = profiles.replace(
  /<span className="text-xl font-bold tracking-tight text-white drop-shadow">JAMBOX<span className="text-amber-500">\+<\/span><\/span>/,
  '<JamBoxText className="text-2xl" />'
);
fs.writeFileSync('src/components/profiles/ProfileSelection.tsx', profiles);

