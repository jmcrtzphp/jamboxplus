import React from 'react';
import { Film } from 'lucide-react';
import { Show } from './tmdb';

export interface PlatformConfig {
  id: string;
  displayName: string;
  providerId: string;
  color: string;
  logoPath: string;
}

export const PLATFORMS: Record<string, PlatformConfig> = {
  netflix: { id: 'netflix', displayName: 'Netflix', providerId: '8', color: '#E50914', logoPath: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' },
  disney: { id: 'disney', displayName: 'Disney+', providerId: '337', color: '#113CCF', logoPath: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
  prime: { id: 'prime', displayName: 'Prime Video', providerId: '9', color: '#00A8E1', logoPath: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Amazon_Prime_Video_logo_%282024%29.svg' },
  apple: { id: 'apple', displayName: 'Apple TV+', providerId: '350', color: '#FFFFFF', logoPath: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg' },
  max: { id: 'max', displayName: 'HBO Max', providerId: '1899', color: '#002BE7', logoPath: '/jbe4gVSfRlbPTdESXhEKpornsfu.jpg' }
};

export interface ResolvedPlatform {
  id: string;
  displayName: string;
  logoUrl?: string;
  color?: string;
  isTheaters?: boolean;
}

export function resolvePlatform(platformId?: string, show?: Show, country: string = 'us'): ResolvedPlatform | null {
  if (platformId === 'theaters') {
    return {
      id: 'theaters',
      displayName: 'In Theaters',
      isTheaters: true
    };
  }

  if (platformId && PLATFORMS[platformId]) {
    const p = PLATFORMS[platformId];
    const src = p.logoPath.startsWith('http') ? p.logoPath : `https://image.tmdb.org/t/p/w200${p.logoPath}`;
    return {
      id: p.id,
      displayName: p.displayName,
      logoUrl: src,
      color: p.color
    };
  }

  // Check show streaming options
  if (show?.streamingOptions) {
    const countryOpts = show.streamingOptions[country.toLowerCase()] || show.streamingOptions['us'] || Object.values(show.streamingOptions)[0];
    if (countryOpts && countryOpts.length > 0) {
      // Look for known platform
      for (const opt of countryOpts) {
        const providerId = String(opt.service?.id || '');
        const name = (opt.service?.name || '').toLowerCase();
        
        for (const key of Object.keys(PLATFORMS)) {
          const p = PLATFORMS[key];
          if (
            p.providerId === providerId || 
            name.includes(key) || 
            (key === 'prime' && (name.includes('amazon') || name.includes('prime'))) || 
            (key === 'disney' && name.includes('disney')) || 
            (key === 'max' && (name.includes('max') || name.includes('hbo'))) ||
            (key === 'apple' && name.includes('apple'))
          ) {
            const src = p.logoPath.startsWith('http') ? p.logoPath : `https://image.tmdb.org/t/p/w200${p.logoPath}`;
            return {
              id: p.id,
              displayName: p.displayName,
              logoUrl: src,
              color: p.color
            };
          }
        }
      }

      // If no recognized global platform, use the first available service
      const firstService = countryOpts[0]?.service;
      if (firstService?.name) {
        return {
          id: String(firstService.id || 'stream'),
          displayName: firstService.name,
          logoUrl: firstService.imageSet?.whiteImage || firstService.imageSet?.lightThemeImage || firstService.imageSet?.darkThemeImage,
          color: '#3B82F6'
        };
      }
    }
  }

  return null;
}

export function StreamingPlatformIcon({ platformId, className = "w-8 h-8 text-xs" }: { platformId: string, className?: string }) {
  const p = PLATFORMS[platformId];
  if (!p) return null;
  
  const src = p.logoPath.startsWith('http') ? p.logoPath : `https://image.tmdb.org/t/p/w200${p.logoPath}`;
  const isSvg = p.logoPath.endsWith('.svg');
  
  return (
    <div className={`flex items-center justify-center rounded-md overflow-hidden bg-black border border-white/10 p-1 shadow-md ${className}`}>
      <img 
        src={src}
        alt={p.displayName}
        className={isSvg ? "w-full h-full object-contain" : "w-full h-full object-cover rounded-sm"}
      />
    </div>
  );
}

export function PlatformBadge({ platform, className = "" }: { platform: ResolvedPlatform | null, className?: string }) {
  if (!platform) return null;

  if (platform.isTheaters) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/90 text-red-300 border border-red-500/30 backdrop-blur-md text-[10px] font-semibold tracking-wide shadow-sm ${className}`}>
        <Film size={10} className="text-red-400" />
        <span>In Theaters</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/90 text-white/95 border border-white/15 backdrop-blur-md text-[10px] font-medium tracking-tight shadow-md max-w-[120px] ${className}`}>
      {platform.logoUrl ? (
        <div className="w-3.5 h-3.5 rounded-sm bg-black flex items-center justify-center overflow-hidden flex-shrink-0 p-0.5">
          <img 
            src={platform.logoUrl} 
            alt="" 
            className="w-full h-full object-contain" 
          />
        </div>
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
      )}
      <span className="truncate">{platform.displayName}</span>
    </span>
  );
}

