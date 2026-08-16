import React from 'react';

export interface GlassPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'subtle' | 'accent' | 'active' | 'live';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export function GlassPill({
  children,
  variant = 'subtle',
  size = 'sm',
  className = '',
  ...props
}: GlassPillProps) {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-3 py-1 text-xs gap-1.5',
    md: 'px-4 py-1.5 text-sm gap-2'
  }[size];

  const variantClasses = {
    subtle: 'bg-white/8 text-white/80 border-white/15 backdrop-blur-md',
    accent: 'bg-amber-500/20 text-amber-400 border-amber-500/30 backdrop-blur-md shadow-[0_0_12px_rgba(245,158,11,0.25)]',
    active: 'refractive-glass-pill text-white font-semibold shadow-lg',
    live: 'bg-red-500/20 text-red-300 border-red-500/40 backdrop-blur-md shadow-[0_0_14px_rgba(239,68,68,0.3)]'
  }[variant];

  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full border relative overflow-hidden select-none whitespace-nowrap ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      <span className="absolute inset-x-1 top-0 h-[1px] bg-white/60 pointer-events-none rounded-full" />
      <span className="relative z-10 flex items-center gap-1">{children}</span>
    </span>
  );
}
