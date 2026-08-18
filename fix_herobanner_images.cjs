const fs = require('fs');
let content = fs.readFileSync('src/components/Movies.tsx', 'utf8');

content = content.replace(/const bg = movie\.imageSet\?\.horizontalPoster\?\.w1080 \|\| movie\.imageSet\?\.poster;/, 
"const bg = movie.imageSet?.horizontalPoster?.w720 || movie.imageSet?.horizontalPoster?.w1080 || movie.imageSet?.poster;");

fs.writeFileSync('src/components/Movies.tsx', content);
console.log("Updated HeroBanner images");
