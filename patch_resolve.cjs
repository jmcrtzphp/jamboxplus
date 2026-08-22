const fs = require('fs');
let code = fs.readFileSync('src/lib/tmdb.ts', 'utf8');

// We'll add the provider resolution logic to the frontend tmdb module.
const injectStr = `
let resolvedProviderIds: Record<string, number> | null = null;

function normalizeProviderName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function resolveProviderIds() {
  if (resolvedProviderIds) return resolvedProviderIds;
  
  try {
    const data = await tmdbRequest<any>('/watch/providers/movie', { watch_region: 'US', language: 'en-US' });
    const providers = data.results || [];
    
    const findProvider = (names: string[]) => {
      const found = providers.find((p: any) => {
        const normalized = normalizeProviderName(p.provider_name);
        return names.some(n => normalized.includes(normalizeProviderName(n)));
      });
      return found ? found.provider_id : null;
    };
    
    resolvedProviderIds = {
      netflix: findProvider(["Netflix"]),
      'disney-plus': findProvider(["Disney Plus", "Disney+"]),
      'prime-video': findProvider(["Amazon Prime Video", "Prime Video"]),
      'apple-tv': findProvider(["Apple TV Plus", "Apple TV+", "Apple TV"]),
      'hbo-max': findProvider(["HBO Max", "Max"])
    };
    
    console.info("[TMDB] Netflix provider ID:", resolvedProviderIds.netflix);
    console.info("[TMDB] Disney+ provider ID:", resolvedProviderIds['disney-plus']);
    console.info("[TMDB] Prime Video provider ID:", resolvedProviderIds['prime-video']);
    console.info("[TMDB] Apple TV provider ID:", resolvedProviderIds['apple-tv']);
    console.info("[TMDB] HBO Max provider ID:", resolvedProviderIds['hbo-max']);
    
    Object.entries(resolvedProviderIds).forEach(([key, val]) => {
      if (!val) console.error("[TMDB] Provider not found:", key);
    });
    
    return resolvedProviderIds;
  } catch (error) {
    console.error("[TMDB] Failed to resolve providers:", error);
    return null;
  }
}

// Kickoff resolution on load
resolveProviderIds();
`;

code = code.replace(/export async function fetchFilters/, injectStr + '\nexport async function fetchFilters');

// Ensure that fetchFilters uses resolvedProviderIds if passing catalogs as string
code = code.replace(
`  const endpoint = params.show_type === 'all' ? '/discover' : (params.show_type === 'series' ? '/tv-shows' : '/movies');
  const data = await tmdbRequest<any>(endpoint, params);`,
`  const endpoint = params.show_type === 'all' ? '/discover' : (params.show_type === 'series' ? '/tv-shows' : '/movies');
  
  // Resolve string IDs to numeric TMDB IDs if necessary
  if (params.catalogs && typeof params.catalogs === 'string' && isNaN(Number(params.catalogs))) {
    const ids = await resolveProviderIds();
    if (ids && ids[params.catalogs]) {
      params.catalogs = ids[params.catalogs];
    }
  }

  const data = await tmdbRequest<any>(endpoint, params);`
);

fs.writeFileSync('src/lib/tmdb.ts', code);
