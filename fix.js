const fs = require('fs');
let content = fs.readFileSync('src/components/WatchModal.tsx', 'utf8');

// The 3 footers:
content = content.replace(/            <Footer \/>\n/g, '');

content = content.replace(
`                )}
              </div>
            </div>
          </div>`,
`                )}
              </div>
            </div>
            
            <Footer />
          </div>`
);
fs.writeFileSync('src/components/WatchModal.tsx', content);
