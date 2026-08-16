import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  intensity?: 'subtle' | 'medium' | 'strong';
  enableRefraction?: boolean;
  hoverEffect?: boolean;
  radius?: number;
  className?: string;
  children?: React.ReactNode;
}

export function GlassCard({
  intensity = 'medium',
  enableRefraction = false,
  hoverEffect = true,
  radius = 24,
  className = '',
  children,
  ...props
}: GlassCardProps) {
  const intensityClasses = {
    subtle: 'glass-subtle',
    medium: 'glass-medium',
    strong: 'glass-strong'
  }[intensity];

  const hoverClass = hoverEffect ? 'hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 transition-all duration-300' : '';

  return (
    <motion.div
      style={{ borderRadius: radius }}
      className={`relative overflow-hidden ${intensityClasses} ${hoverClass} ${className}`}
      {...props}
    >
      <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}
