const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf-8');

const oldCode = `      let title = "JamBox+ | Watch Movies & TV Shows Streaming";
      let description = "Watch movies and TV shows on JamBox+. Discover your next favorite movie or series.";
      let image = "https://jamboxplusph.dpdns.org/preview.jpg";
      let url = "https://jamboxplusph.dpdns.org" + (req.path === '/' ? '' : req.path);`;

const newCode = `      const baseUrl = (req.headers['x-forwarded-proto'] || req.protocol) + '://' + req.get('host');
      let title = "JamBox+ | Watch Movies & TV Shows Streaming";
      let description = "Watch movies and TV shows on JamBox+. Discover your next favorite movie or series.";
      let image = baseUrl + "/preview.jpg";
      let url = baseUrl + (req.path === '/' ? '' : req.path);`;

if (server.includes(oldCode)) {
  server = server.replace(oldCode, newCode);
  fs.writeFileSync('server.ts', server);
  console.log('Server social metadata patched.');
} else {
  console.log('Could not find code block.');
}
