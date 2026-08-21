const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Netflix N
const netflixSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="#000000"/>
  <path d="M296.2 813.1V210.9h112.5l209.6 374V210.9h109.5v602.2H615.3L405.7 439v374.1H296.2z" fill="#E50914"/>
</svg>`;
fs.writeFileSync(path.join(dir, 'netflix.svg'), netflixSVG);

// Apple TV
const appleSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#000000" rx="0" />
  <g transform="translate(15, 40) scale(1.5)">
    <path fill="#ffffff" d="M9.436,2.742A3.857,3.857,0,0,0,10.316,0a3.769,3.769,0,0,0-2.51,1.311,3.622,3.622,0,0,0-.9,2.631,3.138,3.138,0,0,0,2.53-1.2m.82,1.381c-1.4-.081-2.58.8-3.25.8s-1.69-.756-2.79-.736a4.117,4.117,0,0,0-3.5,2.147c-1.5,2.6-.4,6.473,1.06,8.59.71,1.006,1.56,2.205,2.69,2.166s1.48-.7,2.77-.7,1.67.7,2.79.675,1.9-1.008,2.6-2.1a9.317,9.317,0,0,0,1.17-2.42,3.814,3.814,0,0,1-2.27-3.468,3.9,3.9,0,0,1,1.83-3.256,3.991,3.991,0,0,0-3.1-1.7m8.93-2.016V4.96h2.28V6.845h-2.28V13.6c0,1.008.45,1.522,1.45,1.522a7.482,7.482,0,0,0,.82-.06v1.9a7.823,7.823,0,0,1-1.35.1c-2.36,0-3.27-.917-3.27-3.216V6.89h-1.79V5h1.74V2.107Zm10.25,14.853h-2.5L22.736,5h2.49l2.95,9.608h.06L31.186,5h2.44Zm10.98,0h-2.16v-4.9h-4.64V9.9h4.63V5h2.16V9.9h4.64v2.158h-4.63Z"/>
  </g>
</svg>`;
fs.writeFileSync(path.join(dir, 'apple.svg'), appleSVG);

// Prime Video (Using text and simplified smile curve for perfection)
const primeSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#000000"/>
  <path fill="#ffffff" d="M30 45 c0 -8 5 -12 14 -12 c7 0 11 3 13 8 h-6 c-1 -2 -3 -3 -6 -3 c-4 0 -7 2 -7 6 c0 4 3 6 7 6 c3 0 5 -1 6 -3 h6 c-2 5 -6 8 -13 8 c-9 0 -14 -4 -14 -12 z" />
  <text x="50" y="46" fill="#ffffff" font-family="Arial, sans-serif" font-weight="bold" font-size="22" text-anchor="middle">prime</text>
  <text x="50" y="68" fill="#ffffff" font-family="Arial, sans-serif" font-weight="bold" font-size="22" text-anchor="middle">video</text>
  <path d="M 22 75 Q 50 90 78 75 Q 60 85 22 75 Z" fill="#ffffff" />
  <path d="M 75 72 L 78 75 L 72 78 Z" fill="#ffffff" />
</svg>`;
// Actually, Prime Video SVG is online, let me download it and modify instead.
