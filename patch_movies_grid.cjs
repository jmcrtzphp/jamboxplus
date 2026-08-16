const fs = require('fs');
let code = fs.readFileSync('src/components/Movies.tsx', 'utf8');

const defaultGradients = [
  'from-[#1A1A1A]/90 via-[#0A0A0A]/80 to-[#050505]',
];

// Instead of genre.borderGlow:
code = code.replace(/genre\.borderGlow/g, "'hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]'");
// Instead of genre.gradient
code = code.replace(/genre\.gradient/g, "'from-[#1A1A1A]/90 via-[#0A0A0A]/80 to-[#050505]'");
// Instead of genre.backdrop
code = code.replace(/genre\.backdrop/g, "''");

fs.writeFileSync('src/components/Movies.tsx', code);
