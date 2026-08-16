const fs = require('fs');
let content = fs.readFileSync('src/components/WatchModal.tsx', 'utf8');

const lastPart = content.split(') : null}');
if (lastPart.length === 2) {
  content = lastPart[0] + '  <Footer />\n        ) : null}' + lastPart[1];
  fs.writeFileSync('src/components/WatchModal.tsx', content);
}
