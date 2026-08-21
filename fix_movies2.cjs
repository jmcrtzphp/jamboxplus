const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

// Fix Array maps that got converted from ))} to )}
code = code.replace(/      \)\}/g, '      ))}'); // Wait, this will just redo what I did.

