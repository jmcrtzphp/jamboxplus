import React, { useRef, useEffect, useState } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { liquidGlass, LiquidGlassOptions, isLiquidGlassSupported } from '../../lib/liquidGlass';

export interface GlassPanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  intensity?: 'subtle' | 'medium' | 'strong';
  radius?: number;
  enableRefraction?: boolean;
  refractionOptions?: LiquidGlassOptions;
  fallbackClassName?: string;
  children: React.ReactNode;
  className?: string;
}

export function GlassPanel({
  intensity = 'medium',
  radius = 28,
  enableRefraction = true,
  refractionOptions,
  fallbackClassName = 'GlassFallback',
  children,
  className = '',
  ...props
}: GlassPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState<boolean>(() => isLiquidGlassSupported);

  useEffect(() => {
    setIsSupported(isLiquidGlassSupported);
  }, []);

  const shouldUseFallback = !enableRefraction || !isSupported || Boolean(refractionOptions?.disabled);

  useEffect(() => {
    if (!enableRefraction || !panelRef.current) return;
    const instance = liquidGlass(panelRef.current, {
      scale: refractionOptions?.scale ?? -32,
      chroma: refractionOptions?.chroma ?? 4,
      border: refractionOptions?.border ?? 0.07,
      mapBlur: refractionOptions?.mapBlur ?? 10,
      blur: refractionOptions?.blur ?? 24,
      fallbackBlur: refractionOptions?.fallbackBlur ?? 12,
      radius,
      ...refractionOptions
    });
    return () => {
      try {
        instance?.destroy?.();
      } catch (_) {}
    };
  }, [enableRefraction, radius, refractionOptions]);

  const intensityClass = {
    subtle: 'glass-subtle',
    medium: 'glass-medium',
    strong: 'glass-strong'
  }[intensity];

  const fallbackClass = shouldUseFallback ? `${fallbackClassName} glass-fallback` : '';

  const combinedClasses = [
    intensityClass,
    fallbackClass,
    'glass-specular shadow-2xl',
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      ref={panelRef}
      style={{ borderRadius: `${radius}px` }}
      className={`relative overflow-hidden ${combinedClasses}`}
      {...props}
    >
      {/* Top Edge Glare */}
      <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
      {/* Lens Reflection */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-black/[0.2] pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
