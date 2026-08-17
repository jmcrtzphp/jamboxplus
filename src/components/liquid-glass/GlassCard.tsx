import React, { useRef, useEffect, useState } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { liquidGlass, isLiquidGlassSupported } from '../../lib/liquidGlass';

export interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  intensity?: 'subtle' | 'medium' | 'strong';
  enableRefraction?: boolean;
  hoverEffect?: boolean;
  radius?: number;
  fallbackClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

export function GlassCard({
  intensity = 'medium',
  enableRefraction = false,
  hoverEffect = true,
  radius = 24,
  fallbackClassName = 'GlassFallback',
  className = '',
  children,
  ...props
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState<boolean>(() => isLiquidGlassSupported);

  useEffect(() => {
    setIsSupported(isLiquidGlassSupported);
  }, []);

  const shouldUseFallback = !isSupported && enableRefraction;

  useEffect(() => {
    if (!enableRefraction || !cardRef.current) return;
    const instance = liquidGlass(cardRef.current, {
      scale: -24,
      chroma: 3,
      border: 0.08,
      mapBlur: 8,
      blur: 20,
      fallbackBlur: 12,
      radius
    });
    return () => {
      try {
        instance?.destroy?.();
      } catch (_) {}
    };
  }, [enableRefraction, radius]);

  const intensityClasses = {
    subtle: 'glass-subtle',
    medium: 'glass-medium',
    strong: 'glass-strong'
  }[intensity];

  const hoverClass = hoverEffect ? 'hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 transition-all duration-300' : '';
  const fallbackClass = shouldUseFallback ? `${fallbackClassName} glass-fallback` : '';

  const combinedClasses = [
    intensityClasses,
    fallbackClass,
    hoverClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      ref={cardRef}
      style={{ borderRadius: radius }}
      className={`relative overflow-hidden ${combinedClasses}`}
      {...props}
    >
      <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}
