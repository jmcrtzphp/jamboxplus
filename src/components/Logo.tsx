import React from 'react';

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background optional, but let's leave it transparent so it fits the nav */}
      
      {/* "JB" Combined Shape */}
      {/* The J's hook at the bottom left */}
      <path d="M 15 65 C 15 75, 30 80, 45 75 L 45 20 L 60 20 C 75 20, 80 35, 70 45 C 80 45, 85 65, 70 75 L 40 75" stroke="#F5F5F5" strokeWidth="12" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      {/* Play button inside B */}
      <polygon points="52,48 62,56 52,64" fill="#F59E0B" />
      {/* + Sign */}
      <path d="M 85 45 L 95 45 M 90 40 L 90 50" stroke="#F59E0B" strokeWidth="6" strokeLinecap="square" />
    </svg>
  );
}

export function JamBoxText({ className = "text-xl" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-widest text-white drop-shadow ${className}`} style={{ fontFamily: 'sans-serif' }}>
      JAMBOX<span className="text-amber-500">+</span>
    </span>
  );
}
