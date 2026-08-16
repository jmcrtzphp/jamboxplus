const fs = require('fs');

function addImport(file, statement) {
  let content = fs.readFileSync(file, 'utf-8');
  if (!content.includes(statement)) {
    content = statement + '\n' + content;
    fs.writeFileSync(file, content);
  }
}

addImport('src/App.tsx', "import { Logo, JamBoxText } from './components/Logo';");
addImport('src/LiveTV.tsx', "import { Logo, JamBoxText } from './components/Logo';");
addImport('src/components/auth/Login.tsx', "import { Logo, JamBoxText } from '../Logo';");
addImport('src/components/auth/Register.tsx', "import { Logo, JamBoxText } from '../Logo';");
addImport('src/components/profiles/ProfileSelection.tsx', "import { Logo, JamBoxText } from '../Logo';");

