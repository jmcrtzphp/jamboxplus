const fs = require('fs');
let login = fs.readFileSync('src/components/auth/Login.tsx', 'utf-8');
login = login.replace(
  /<div className="w-16 h-16 bg-amber-500\/20 rounded-2xl flex items-center justify-center mb-6">[\s\S]*?<\/div>/,
  '<Logo className="w-20 h-20 mb-6 drop-shadow-xl" />'
);
login = login.replace(
  /JAMBOX<span className="text-amber-500">\+<\/span>/,
  '<JamBoxText />'
);
fs.writeFileSync('src/components/auth/Login.tsx', login);

let register = fs.readFileSync('src/components/auth/Register.tsx', 'utf-8');
if (!register.includes('import { Logo }')) {
  register = register.replace("import { useNavigate }", "import { useNavigate }\nimport { Logo, JamBoxText } from '../Logo';");
}
register = register.replace(
  /<div className="w-12 h-12 bg-amber-500\/20 rounded-xl flex items-center justify-center mb-4">[\s\S]*?<\/div>/,
  '<Logo className="w-16 h-16 mb-4 drop-shadow-xl" />'
);
fs.writeFileSync('src/components/auth/Register.tsx', register);
