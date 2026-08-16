import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface GlassButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'standard' | 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassButton({
  variant = 'standard',
  size = 'md',
  children,
  className = '',
  glow = false,
  ...props
}: GlassButtonProps) {
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs font-medium gap-1.5 rounded-full',
    md: 'px-5 py-2.5 text-sm font-semibold gap-2 rounded-full',
    lg: 'px-7 py-3.5 text-base font-bold gap-2.5 rounded-full'
  }[size];

  const variantClasses = {
    standard: 'glass-button text-white',
    primary: 'glass-button-primary text-white',
    secondary: 'glass-button bg-white/5 border-white/10 text-white/80 hover:text-white',
    ghost: 'hover:bg-white/10 text-white/70 hover:text-white border border-transparent hover:border-white/15 rounded-full backdrop-blur-md',
    danger: 'glass-button bg-red-600/60 border-red-400/40 text-white hover:bg-red-600/80 shadow-[0_4px_20px_rgba(239,68,68,0.4)]'
  }[variant];

  const glowClass = glow ? 'shadow-[0_0_24px_rgba(245,158,11,0.5)]' : '';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 450, damping: 26 }}
      className={`inline-flex items-center justify-center relative overflow-hidden transition-colors ${sizeClasses} ${variantClasses} ${glowClass} ${className}`}
      {...props}
    >
      {/* Specular sheen gradient on hover */}
      <span className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none opacity-60 rounded-full" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
