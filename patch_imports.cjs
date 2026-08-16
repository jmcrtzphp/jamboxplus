const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');
code = code.replace("Mic } from 'lucide-react';", "Mic, Info } from 'lucide-react';");
fs.writeFileSync('src/components/Movies.tsx', code);
