const providers = [
  { provider_name: 'Netflix', provider_id: 8 },
  { provider_name: 'Disney Plus', provider_id: 337 },
  { provider_name: 'Amazon Prime Video', provider_id: 9 },
  { provider_name: 'Apple TV Plus', provider_id: 350 },
  { provider_name: 'Max', provider_id: 1899 },
  { provider_name: 'HBO Max', provider_id: 384 }
];

function normalizeProviderName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

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
