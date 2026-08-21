const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf-8');

const oldScript = `
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').catch(err => {
            console.error('SW registration failed: ', err);
          });
        });
      }
    </script>
`;

const newScript = `
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').then(reg => {
            reg.onupdatefound = () => {
              const installingWorker = reg.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New version available! Force reload.
                    window.location.reload();
                  }
                };
              }
            };
          }).catch(err => console.error('SW failed: ', err));
        });
      }
    </script>
`;

if (code.includes(oldScript.trim())) {
  code = code.replace(oldScript.trim(), newScript.trim());
} else {
  // Regex fallback
  code = code.replace(/<script>\s*if \('serviceWorker' in navigator\).*?<\/script>/s, newScript.trim());
}

fs.writeFileSync('index.html', code);
