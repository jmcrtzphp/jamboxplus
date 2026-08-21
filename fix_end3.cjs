const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

const targetStr = '}           onSelectMovie={onSelectMovie}';
const index = code.indexOf(targetStr);

if (index > -1) {
  code = code.substring(0, index + 1); // keep the '}'
  fs.writeFileSync('src/components/Movies.tsx', code);
} else {
  console.log("NOT FOUND!");
}
