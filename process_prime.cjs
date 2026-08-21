const fs = require('fs');
let svg = fs.readFileSync('public/icons/prime.svg', 'utf8');
svg = svg.replace(/<svg(.*?)>/, '<svg$1>\n<rect width="100%" height="100%" fill="#000000"/>');
fs.writeFileSync('public/icons/prime.svg', svg);
