const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf-8');

const script = `
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').catch(err => {
            console.error('SW registration failed: ', err);
          });
        });
      }
    </script>
  </body>
`;

code = code.replace('</body>', script);
fs.writeFileSync('index.html', code);
