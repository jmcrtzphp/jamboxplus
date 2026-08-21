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
  netflix: { id: 'netflix', displayName: 'Netflix', providerId: '8', color: '#E50914', logoPath: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Netflix_2016_N_logo.svg' },
  disney: { id: 'disney', displayName: 'Disney+', providerId: '337', color: '#113CCF', logoPath: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
  prime: { id: 'prime', displayName: 'Prime Video', providerId: '9', color: '#00A8E1', logoPath: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/prime-video-alt-dark.svg' },
  apple: { id: 'apple', displayName: 'Apple TV+', providerId: '350', color: '#FFFFFF', logoPath: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/apple-tv-plus-light.svg' },
  max: { id: 'max', displayName: 'HBO Max', providerId: '1899', color: '#002BE7', logoPath: 'https://cdn.jsdelivr.net/gh/selfhst/icons/svg/hbo-max-light.svg' },
  paramount: { id: 'paramount', displayName: 'Paramount+', providerId: '531', color: '#0064FF', logoPath: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount_Plus.svg' }
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
            (key === 'apple' && name.includes('apple')) ||
            (key === 'paramount' && name.includes('paramount'))
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
    <div className={`flex items-center justify-center rounded-xl overflow-hidden bg-black border border-white/10 shadow-md ${className}`}>
      <img 
        src={src}
        alt={p.displayName}
        className="w-full h-full object-contain p-1.5"
      />
    </div>
  );
}

export function PlatformBadge({ platform, className = "" }: { platform: ResolvedPlatform | null, className?: string }) {
  if (!platform) return null;

  if (platform.isTheaters) {
    return (
      <div className={`flex items-center justify-center w-6 h-6 flex-shrink-0 drop-shadow-md bg-black/40 rounded-full backdrop-blur-md ${className}`} title="In Theaters">
        <Film size={12} className="text-white/90" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center w-7 h-7 flex-shrink-0 drop-shadow-lg ${className}`} title={platform.displayName}>
      {platform.logoUrl ? (
        <img 
          src={platform.logoUrl} 
          alt={platform.displayName}
          className="w-full h-full object-contain brightness-0 invert opacity-95 filter" 
        />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-white/80 flex-shrink-0" />
      )}
    </div>
  );
}

