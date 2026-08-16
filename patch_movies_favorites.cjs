const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

const startStr = '<div className="sm:hidden mb-6 relative">';
const endStr = '</div>\n          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-white drop-shadow">Your Favorites</h2>';

const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + '<h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-white drop-shadow">Your Favorites</h2>' + code.substring(endIdx + endStr.length);
  fs.writeFileSync('src/components/Movies.tsx', code);
}
