const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf-8');

const adScript = `
    <!-- Ad Container -->
    <div id="container-6b4927729ae510718bff24cb29f41994"></div>
    <script async="async" data-cfasync="false" src="https://watchingprefecture.com/6b4927729ae510718bff24cb29f41994/invoke.js"></script>
`;

// Insert after <div id="root"></div>
code = code.replace('<div id="root"></div>', '<div id="root"></div>\n' + adScript);

fs.writeFileSync('index.html', code);
