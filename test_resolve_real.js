import http from 'http';

function normalizeProviderName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

http.get('http://localhost:3000/api/watch/providers/movie?watch_region=US&language=en-US', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const providers = JSON.parse(data).results || [];
    const findProvider = (names) => {
      const found = providers.find((p) => {
        const normalized = normalizeProviderName(p.provider_name);
        return names.some(n => normalized.includes(normalizeProviderName(n)));
      });
      return found ? found.provider_id : null;
    };
    
    const resolvedProviderIds = {
      netflix: findProvider(["Netflix"]),
      'disney-plus': findProvider(["Disney Plus", "Disney+"]),
      'prime-video': findProvider(["Amazon Prime Video", "Prime Video"]),
      'apple-tv': findProvider(["Apple TV Plus", "Apple TV+", "Apple TV"]),
      'hbo-max': findProvider(["HBO Max", "Max"])
    };
    console.log(resolvedProviderIds);
  });
});
