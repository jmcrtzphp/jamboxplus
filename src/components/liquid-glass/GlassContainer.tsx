import React, { useEffect, useRef, useState } from 'react';
import { liquidGlass, LiquidGlassOptions, isLiquidGlassSupported } from '../../lib/liquidGlass';

export type GlassIntensity = 'subtle' | 'medium' | 'strong';

export interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: GlassIntensity;
  enableRefraction?: boolean;
  refractionOptions?: LiquidGlassOptions;
  specular?: boolean;
  edgeGlare?: boolean;
  radius?: number | string;
  fallbackClassName?: string;
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
  fallbackClassName = 'GlassFallback',
  className = '',
  children,
  style,
  ...props
}: GlassContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState<boolean>(() => isLiquidGlassSupported);

  useEffect(() => {
    setIsSupported(isLiquidGlassSupported);
  }, []);

  const shouldUseFallback = !enableRefraction || !isSupported || Boolean(refractionOptions?.disabled);

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
      fallbackBlur: refractionOptions?.fallbackBlur ?? 12,
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

  const fallbackClass = shouldUseFallback ? `${fallbackClassName} glass-fallback` : '';
  const specularClass = specular ? 'glass-specular' : '';
  const glareClass = edgeGlare ? 'glass-edge-glare' : '';

  const dynamicStyle = {
    ...(radius !== undefined ? { borderRadius: typeof radius === 'number' ? `${radius}px` : radius } : {}),
    ...style
  };

  const combinedClasses = [
    intensityClass,
    fallbackClass,
    specularClass,
    glareClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={combinedClasses}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </div>
  );
}
