import React, { useEffect, useRef } from 'react';
import { liquidGlass, LiquidGlassOptions } from '../lib/liquidGlass';

export interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement>, LiquidGlassOptions {
  children?: React.ReactNode;
  className?: string;
}

export function LiquidGlass({ 
  scale, 
  chroma, 
  border, 
  mapBlur, 
  blur, 
  saturate, 
  brightness, 
  radius, 
  fallbackBlur, 
  disabled,
  children, 
  className = '', 
  ...props 
}: LiquidGlassProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        const opts: LiquidGlassOptions = { 
          scale, 
          chroma, 
          border, 
          mapBlur, 
          blur, 
          saturate, 
          brightness, 
          radius, 
          fallbackBlur, 
          disabled 
        };
        // Remove undefined keys
        Object.keys(opts).forEach(key => (opts as any)[key] === undefined && delete (opts as any)[key]);
        
        const glass = liquidGlass(ref.current, opts);
        return () => {
          try {
            glass?.destroy?.();
          } catch (_) {}
        };
      } catch (_) {}
    }
  }, [scale, chroma, border, mapBlur, blur, saturate, brightness, radius, fallbackBlur, disabled]);

  return (
    <div ref={ref} className={`liquid-glass ${className}`} {...props}>
      {children}
    </div>
  );
}
