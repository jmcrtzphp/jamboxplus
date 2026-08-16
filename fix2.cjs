const fs = require('fs');
let content = fs.readFileSync('src/components/WatchModal.tsx', 'utf8');

content = content.replace('          <Footer />\n        ) : null}', '            <Footer />\n          </div>\n        ) : null}');
fs.writeFileSync('src/components/WatchModal.tsx', content);
