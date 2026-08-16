import React, { useRef, useEffect } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { liquidGlass, LiquidGlassOptions } from '../../lib/liquidGlass';

export interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  intensity?: 'subtle' | 'medium' | 'strong';
  enableRefraction?: boolean;
  refractionOptions?: LiquidGlassOptions;
  hoverEffect?: boolean;
  radius?: number;
  className?: string;
  children: React.ReactNode;
}

export function GlassCard({
  intensity = 'medium',
  enableRefraction = false, // disabled by default on cards for 60fps scrolling lists, opt-in for featured cards
  refractionOptions,
  hoverEffect = true,
  radius = 24,
  className = '',
  children,
  ...props
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableRefraction || !cardRef.current) return;
    const instance = liquidGlass(cardRef.current, {
      scale: refractionOptions?.scale ?? -22,
      chroma: refractionOptions?.chroma ?? 3,
      border: refractionOptions?.border ?? 0.08,
      mapBlur: refractionOptions?.mapBlur ?? 8,
      blur: refractionOptions?.blur ?? 16,
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

  const hoverClass = hoverEffect ? 'hover:-translate-y-1.5 hover:shadow-2xl hover:border-white/30 transition-all duration-300' : '';

  return (
    <motion.div
      ref={cardRef}
      style={{ borderRadius: `${radius}px` }}
      className={`relative overflow-hidden ${intensityClass} glass-specular ${hoverClass} ${className}`}
      {...props}
    >
      {/* Prismatic Top Edge Glare */}
      <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}
