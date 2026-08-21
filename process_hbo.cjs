const fs = require('fs');
let svg = fs.readFileSync('public/icons/hbo-max2.svg', 'utf8');
// replace fill="url(#SVGID_1_)" and fill="url(#SVGID_2_)" with fill="#ffffff"
svg = svg.replace(/fill="url\(#SVGID_\d+_\)"/g, 'fill="#ffffff"');
// add black background rect
svg = svg.replace(/<svg(.*?)>/, '<svg$1>\n<rect width="100%" height="100%" fill="#000000"/>');
fs.writeFileSync('public/icons/hbo.svg', svg);
