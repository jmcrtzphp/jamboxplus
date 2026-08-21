const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf-8');

code = code.replace(
  `        </div>
      ))}
      {/* 2. Platform Catalogue Content Grid */}`,
  `        </div>
      )}
      {/* 2. Platform Catalogue Content Grid */}`
);

// We must also remove ParamountView completely.
const regexParamountView = /function ParamountView\([\s\S]*?\)\s*\{\s*const \[activeTab, setActiveTab\][\s\S]*?\}\s*\}/;
code = code.replace(regexParamountView, "");

fs.writeFileSync('src/components/Movies.tsx', code);
