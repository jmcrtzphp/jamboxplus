const fs = require('fs');
let content = fs.readFileSync('src/components/Movies.tsx', 'utf8');

// Replace w360 with w240 in MovieCard
content = content.replace(/const poster = show.imageSet\?\.verticalPoster\?\.w360 \|\| show.imageSet\?\.poster/, "const poster = show.imageSet?.verticalPoster?.w240 || show.imageSet?.verticalPoster?.w360 || show.imageSet?.poster");

// And for HeroBanner, we might want w720 instead of 1080 for low data mode? Or just let Hero use 720
content = content.replace(/const bgImage = activeShow\?.imageSet\?\.horizontalPoster\?\.w1080 \|\| activeShow\?.imageSet\?\.poster;/, "const bgImage = activeShow?.imageSet?.horizontalPoster?.w720 || activeShow?.imageSet?.horizontalPoster?.w1080 || activeShow?.imageSet?.poster;");

fs.writeFileSync('src/components/Movies.tsx', content);
console.log("Updated Movies.tsx to use smaller images");
