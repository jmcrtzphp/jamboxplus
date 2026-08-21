const fs = require('fs');

function removeParamount(file) {
  let code = fs.readFileSync(file, 'utf-8');
  
  // Remove from PLATFORMS object
  code = code.replace(/,\s*paramount:\s*\{\s*id:\s*'paramount',\s*displayName:\s*'Paramount\+',\s*providerId:\s*'531',\s*color:\s*'#0064FF',\s*logoPath:\s*'https:\/\/upload.wikimedia.org\/wikipedia\/commons\/a\/a5\/Paramount_Plus.svg'\s*\}/, '');
  
  // Remove from resolvePlatform check
  code = code.replace(/\|\|\s*\(key\s*===\s*'paramount'\s*&&\s*name\.includes\('paramount'\)\)/, '');
  
  fs.writeFileSync(file, code);
  console.log('Removed Paramount from', file);
}

removeParamount('src/lib/platforms.tsx');
