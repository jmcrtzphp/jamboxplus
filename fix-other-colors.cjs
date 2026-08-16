const fs = require('fs');

let glass = fs.readFileSync('src/components/liquid-glass/GlassNavbar.tsx', 'utf-8');
glass = glass.replace(/via-cyan-200\/70/g, 'via-amber-200/70');
fs.writeFileSync('src/components/liquid-glass/GlassNavbar.tsx', glass);

let modal = fs.readFileSync('src/components/liquid-glass/GlassModal.tsx', 'utf-8');
modal = modal.replace(/via-cyan-100/g, 'via-amber-100');
fs.writeFileSync('src/components/liquid-glass/GlassModal.tsx', modal);

let ambient = fs.readFileSync('src/components/liquid-glass/AmbientGlassBackground.tsx', 'utf-8');
ambient = ambient.replace(/bg-teal-500\/8/g, 'bg-amber-500/5');
fs.writeFileSync('src/components/liquid-glass/AmbientGlassBackground.tsx', ambient);

let watchmodal = fs.readFileSync('src/components/WatchModal.tsx', 'utf-8');
watchmodal = watchmodal.replace(/via-cyan-100/g, 'via-amber-100');
fs.writeFileSync('src/components/WatchModal.tsx', watchmodal);

let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(/hover:border-purple-500\/50/g, 'hover:border-amber-500/50');
app = app.replace(/hover:shadow-\[0_0_40px_rgba\(168,85,247,0\.3\)\]/g, 'hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]');
app = app.replace(/bg-purple-500\/20/g, 'bg-amber-500/20');
app = app.replace(/text-purple-400/g, 'text-amber-500');
app = app.replace(/group-hover:text-purple-300/g, 'group-hover:text-amber-400');
fs.writeFileSync('src/App.tsx', app);

let settings = fs.readFileSync('src/components/settings/Settings.tsx', 'utf-8');
settings = settings.replace(/text-purple-400/g, 'text-amber-500');
fs.writeFileSync('src/components/settings/Settings.tsx', settings);

