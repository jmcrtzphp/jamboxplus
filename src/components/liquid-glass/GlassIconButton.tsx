import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface GlassIconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'standard' | 'primary' | 'subtle' | 'danger';
  children: React.ReactNode;
  className?: string;
  tooltip?: string;
}

export function GlassIconButton({
  size = 'md',
  variant = 'standard',
  children,
  className = '',
  tooltip,
  ...props
}: GlassIconButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-full',
    md: 'w-10 h-10 rounded-full',
    lg: 'w-12 h-12 rounded-full'
  }[size];

  const variantClasses = {
    standard: 'glass-button text-white',
    primary: 'glass-button-primary text-white',
    subtle: 'bg-white/5 border border-white/10 hover:bg-white/15 text-white/80 hover:text-white backdrop-blur-md',
    danger: 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white backdrop-blur-md shadow-md'
  }[variant];

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      title={tooltip}
      className={`relative inline-flex items-center justify-center overflow-hidden shrink-0 ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      <span className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-transparent pointer-events-none rounded-full" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
