import React, { useEffect, useRef, useState } from 'react';
import { liquidGlass, LiquidGlassOptions, isLiquidGlassSupported } from '../lib/liquidGlass';

export interface GlassProps extends React.HTMLAttributes<HTMLDivElement>, LiquidGlassOptions {
  children?: React.ReactNode;
  className?: string;
  fallbackClassName?: string;
}

export type LiquidGlassProps = GlassProps;

/**
 * Hook to dynamically detect if SVG displacement glass filter is supported in the current environment
 */
export function useGlassSupport() {
  const [supported, setSupported] = useState<boolean>(() => isLiquidGlassSupported);

  useEffect(() => {
    setSupported(isLiquidGlassSupported);
  }, []);

  return supported;
}

/**
 * Glass Component
 * 
 * Automatically detects whether native SVG displacement glass refraction is supported:
 * - If supported & enabled: applies the high-performance optical refraction engine.
 * - If unsupported or disabled: seamlessly applies the premium non-refractive `GlassFallback`
 *   with `backdrop-filter: blur(12px)` and multi-layer depth shadows.
 */
export function Glass({ 
  scale, 
  chroma, 
  border, 
  mapBlur, 
  blur, 
  saturate, 
  brightness, 
  radius, 
  fallbackBlur = 12, 
  disabled = false,
  children, 
  className = '', 
  fallbackClassName = 'GlassFallback',
  style,
  ...props 
}: GlassProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isSupported = useGlassSupport();
  const shouldUseFallback = !isSupported || disabled;

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

  const combinedClassName = [
    'liquid-glass',
    shouldUseFallback ? `${fallbackClassName} glass-fallback` : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={combinedClassName} style={style} {...props}>
      {children}
    </div>
  );
}

// Named alias exports
export const LiquidGlass = Glass;
