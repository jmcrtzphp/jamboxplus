import React, { useEffect, useRef } from 'react';
import { liquidGlass, LiquidGlassOptions } from '../../lib/liquidGlass';

export type GlassIntensity = 'subtle' | 'medium' | 'strong';

export interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: GlassIntensity;
  enableRefraction?: boolean;
  refractionOptions?: LiquidGlassOptions;
  specular?: boolean;
  edgeGlare?: boolean;
  radius?: number | string;
  className?: string;
  children?: React.ReactNode;
}

export function GlassContainer({
  intensity = 'medium',
  enableRefraction = true,
  refractionOptions,
  specular = true,
  edgeGlare = false,
  radius,
  className = '',
  children,
  style,
  ...props
}: GlassContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableRefraction || !containerRef.current) return;

    const scaleForIntensity: Record<GlassIntensity, number> = {
      subtle: -16,
      medium: -28,
      strong: -42
    };

    const blurForIntensity: Record<GlassIntensity, number> = {
      subtle: 12,
      medium: 18,
      strong: 28
    };

    const numericRadius = typeof radius === 'number' ? radius : null;

    const instance = liquidGlass(containerRef.current, {
      scale: refractionOptions?.scale ?? scaleForIntensity[intensity],
      chroma: refractionOptions?.chroma ?? 4,
      border: refractionOptions?.border ?? 0.08,
      mapBlur: refractionOptions?.mapBlur ?? 10,
      blur: refractionOptions?.blur ?? blurForIntensity[intensity],
      saturate: refractionOptions?.saturate ?? 1.4,
      radius: numericRadius,
      ...refractionOptions,
    });

    return () => {
      try {
        instance?.destroy?.();
      } catch (_) {}
    };
  }, [intensity, enableRefraction, radius, refractionOptions]);

  const intensityClass = {
    subtle: 'glass-subtle',
    medium: 'glass-medium',
    strong: 'glass-strong'
  }[intensity];

  const specularClass = specular ? 'glass-specular' : '';
  const glareClass = edgeGlare ? 'glass-edge-glare' : '';

  const dynamicStyle = {
    ...(radius !== undefined ? { borderRadius: typeof radius === 'number' ? `${radius}px` : radius } : {}),
    ...style
  };

  return (
    <div
      ref={containerRef}
      className={`${intensityClass} ${specularClass} ${glareClass} ${className}`}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </div>
  );
}
