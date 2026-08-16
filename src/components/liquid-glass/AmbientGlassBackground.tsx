import React from 'react';

export function AmbientGlassBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 isolate select-none" aria-hidden="true">
      {/* Deep Atmospheric Base Canvas */}
      <div className="absolute inset-0 bg-[#0A0C0F]" />
      
      {/* Soft Ambient Light Blobs - GPU accelerated with CSS translate3d */}
      {/* Top Left: Deep Cobalt / Indigo Glow */}
      <div 
        className="ambient-blob-1 absolute -top-[15%] -left-[10%] w-[580px] h-[580px] rounded-full bg-gradient-to-tr from-amber-600/10 to-amber-800/10 blur-[100px] will-change-transform"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />

      {/* Top Right: Cyan / Azure Horizon Light */}
      <div 
        className="ambient-blob-2 absolute -top-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-amber-500/10 to-amber-700/10 blur-[90px] will-change-transform"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />

      {/* Center-Bottom: Deep Amethyst / Violet Caustic Accent */}
      <div 
        className="ambient-blob-3 absolute -bottom-[20%] right-[15%] w-[620px] h-[620px] rounded-full bg-gradient-to-t from-stone-600/20 via-zinc-600/10 to-transparent blur-[110px] will-change-transform"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />

      {/* Center-Left: Emerald/Teal Depth Pool */}
      <div 
        className="absolute top-[45%] -left-[15%] w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" 
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />

      {/* Ultra Subtle Organic Vignette Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(6,8,11,0.75)_100%)] opacity-80" />
    </div>
  );
}
