const fs = require('fs');

async function recover() {
  const code = fs.readFileSync('movies_curl.js', 'utf-8');
  const base64Prefix = 'sourceMappingURL=data:application/json;base64,';
  const lastLine = code.trim().split('\n').pop();
  
  if (lastLine.includes(base64Prefix)) {
    const base64 = lastLine.split(base64Prefix)[1].trim();
    const jsonStr = Buffer.from(base64, 'base64').toString('utf-8');
    const sourcemap = JSON.parse(jsonStr);
    
    if (sourcemap.sourcesContent && sourcemap.sourcesContent.length > 0) {
      fs.writeFileSync('src/components/Movies.tsx', sourcemap.sourcesContent[0]);
      console.log("Recovered successfully!");
      return;
    }
  }
  console.log("Could not recover.");
}
recover();
