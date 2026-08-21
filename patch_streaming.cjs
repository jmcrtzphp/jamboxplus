const fs = require('fs');
let code = fs.readFileSync('src/components/StreamingPlatformsRow.tsx', 'utf-8');

code = code.replace(
  "{ id: 'prime', title: 'Prime Video', img: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg', isLogo: true, color: '#00A8E1' },",
  "{ id: 'prime', title: 'Prime Video', img: 'https://media.tenor.com/jRIcyhRf9YYAAAAM/amazon-prime-video.gif' },"
);

code = code.replace(
  "style={platform.color ? { backgroundColor: platform.color } : {}}",
  ""
);

code = code.replace(
  "className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-out group-hover/card:scale-105 ${platform.isLogo ? 'object-contain p-8 md:p-12' : 'object-cover'}`}",
  "className=\"absolute inset-0 w-full h-full object-cover scale-[1.15] transition-transform duration-500 ease-out group-hover/card:scale-125\""
);

fs.writeFileSync('src/components/StreamingPlatformsRow.tsx', code);
