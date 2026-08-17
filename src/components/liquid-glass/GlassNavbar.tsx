import React, { useRef, useEffect, useState } from 'react';
import { liquidGlass, isLiquidGlassSupported } from '../../lib/liquidGlass';

export interface GlassNavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  enableRefraction?: boolean;
  fallbackClassName?: string;
}

export function GlassNavbar({
  children,
  className = '',
  enableRefraction = true,
  fallbackClassName = 'GlassFallback',
  ...props
}: GlassNavbarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState<boolean>(() => isLiquidGlassSupported);

  useEffect(() => {
    setIsSupported(isLiquidGlassSupported);
  }, []);

  const shouldUseFallback = !enableRefraction || !isSupported;

  useEffect(() => {
    if (!enableRefraction || !navRef.current) return;
    const instance = liquidGlass(navRef.current, {
      scale: -26,
      chroma: 4,
      border: 0.08,
      mapBlur: 10,
      blur: 24,
      fallbackBlur: 12,
      saturate: 1.45,
      radius: 9999
    });
    return () => {
      try {
        instance?.destroy?.();
      } catch (_) {}
    };
  }, [enableRefraction]);

  const fallbackClass = shouldUseFallback ? `${fallbackClassName} glass-fallback` : '';

  return (
    <nav
      ref={navRef}
      className={`glass-nav glass-specular ${fallbackClass} relative overflow-hidden flex items-center justify-between p-2 rounded-full ${className}`}
      {...props}
    >
      {/* Top Edge Specular Prismatic Line */}
      <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-200/70 via-white to-transparent pointer-events-none blur-[0.2px]" />
      
      {/* Curved Convex Upper Lens Glow */}
      <div className="absolute inset-x-2 top-0.5 h-1/2 rounded-t-full bg-gradient-to-b from-white/[0.18] to-transparent pointer-events-none" />
      
      {/* Bottom Caustic Reflection */}
      <div className="absolute inset-x-12 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/35 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full flex items-center justify-between">
        {children}
      </div>
    </nav>
  );
}
