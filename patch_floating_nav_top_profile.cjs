const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingNav.tsx', 'utf8');

const oldMobileProfile = `      <div className="sm:hidden fixed top-4 right-4 z-50 pointer-events-auto flex items-center">
        {profileMenu}
      </div>`;

code = code.replace(oldMobileProfile, "");

fs.writeFileSync('src/components/FloatingNav.tsx', code);
