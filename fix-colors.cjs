const fs = require('fs');

// src/components/liquid-glass/AmbientGlassBackground.tsx
let bg = fs.readFileSync('src/components/liquid-glass/AmbientGlassBackground.tsx', 'utf-8');
bg = bg.replace(/from-amber-600\/30 to-amber-700\/20/g, 'from-amber-600/10 to-amber-800/10');
bg = bg.replace(/from-amber-400\/18 to-amber-600\/18/g, 'from-amber-500/10 to-amber-700/10');
bg = bg.replace(/from-purple-600\/22 via-indigo-600\/18 to-transparent/g, 'from-stone-600/20 via-zinc-600/10 to-transparent');
fs.writeFileSync('src/components/liquid-glass/AmbientGlassBackground.tsx', bg);

// src/lib/genres.ts
let genres = fs.readFileSync('src/lib/genres.ts', 'utf-8');
genres = genres.replace(/from-cyan-700\/80 via-amber-700\/70/g, 'from-zinc-800/80 via-zinc-900/70');
genres = genres.replace(/from-rose-700\/80 via-red-800\/70/g, 'from-stone-800/80 via-stone-900/70');
genres = genres.replace(/from-purple-700\/80 via-fuchsia-800\/70/g, 'from-neutral-800/80 via-neutral-900/70');
genres = genres.replace(/from-emerald-700\/80 via-teal-800\/70/g, 'from-zinc-800/80 via-zinc-900/70');
genres = genres.replace(/from-zinc-800\/80 via-zinc-900\/70/g, 'from-[#1A1A1A]/90 via-[#0A0A0A]/80');
genres = genres.replace(/from-stone-800\/80 via-stone-900\/70/g, 'from-[#1A1A1A]/90 via-[#0A0A0A]/80');
genres = genres.replace(/from-neutral-800\/80 via-neutral-900\/70/g, 'from-[#1A1A1A]/90 via-[#0A0A0A]/80');
genres = genres.replace(/from-indigo-700\/80 via-violet-800\/70/g, 'from-[#1A1A1A]/90 via-[#0A0A0A]/80');
genres = genres.replace(/from-orange-700\/80 via-amber-800\/70/g, 'from-[#1A1A1A]/90 via-[#0A0A0A]/80');
genres = genres.replace(/from-slate-700\/80 via-amber-900\/70/g, 'from-[#1A1A1A]/90 via-[#0A0A0A]/80');
genres = genres.replace(/from-stone-700\/80 via-neutral-800\/70/g, 'from-[#1A1A1A]/90 via-[#0A0A0A]/80');
genres = genres.replace(/from-teal-700\/80 via-cyan-800\/70/g, 'from-[#1A1A1A]/90 via-[#0A0A0A]/80');

genres = genres.replace(/border-cyan-500\/50/g, 'border-amber-500/30');
genres = genres.replace(/border-rose-500\/50/g, 'border-amber-500/30');
genres = genres.replace(/border-purple-500\/50/g, 'border-amber-500/30');
genres = genres.replace(/border-emerald-500\/50/g, 'border-amber-500/30');
genres = genres.replace(/border-indigo-500\/50/g, 'border-amber-500/30');
genres = genres.replace(/border-orange-500\/50/g, 'border-amber-500/30');
genres = genres.replace(/border-amber-500\/50/g, 'border-amber-500/30');
genres = genres.replace(/border-slate-500\/50/g, 'border-amber-500/30');
genres = genres.replace(/border-stone-500\/50/g, 'border-amber-500/30');
genres = genres.replace(/border-teal-500\/50/g, 'border-amber-500/30');

genres = genres.replace(/shadow-cyan-500\/20/g, 'shadow-amber-500/10');
genres = genres.replace(/shadow-rose-500\/20/g, 'shadow-amber-500/10');
genres = genres.replace(/shadow-purple-500\/20/g, 'shadow-amber-500/10');
genres = genres.replace(/shadow-emerald-500\/20/g, 'shadow-amber-500/10');
genres = genres.replace(/shadow-indigo-500\/20/g, 'shadow-amber-500/10');
genres = genres.replace(/shadow-orange-500\/20/g, 'shadow-amber-500/10');
genres = genres.replace(/shadow-slate-500\/20/g, 'shadow-amber-500/10');
genres = genres.replace(/shadow-stone-500\/20/g, 'shadow-amber-500/10');
genres = genres.replace(/shadow-teal-500\/20/g, 'shadow-amber-500/10');
fs.writeFileSync('src/lib/genres.ts', genres);

