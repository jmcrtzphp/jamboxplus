const fs = require('fs');
let code = fs.readFileSync('src/components/FloatingNav.tsx', 'utf-8');

code = code.replace(/export function FloatingNav\(\{[\s\S]*?\}\s*:\s*FloatingNavProps\)\s*\{\n\s*const \[hoveredTab/, 
  match => match.replace('{\n  const [hoveredTab', '{') + "\n  const [hoveredTab");

fs.writeFileSync('src/components/FloatingNav.tsx', code);
