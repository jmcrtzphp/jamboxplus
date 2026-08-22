const fs = require('fs');
let code = fs.readFileSync('src/lib/platforms.tsx', 'utf8');

code = code.replace(
`  netflix: { id: 'netflix', displayName: 'Netflix', providerId: '8', color: '#E50914', logoPath: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Netflix_2016_N_logo.svg' },`,
`  netflix: { id: 'netflix', displayName: 'Netflix', providerId: 'netflix', color: '#E50914', logoPath: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Netflix_2016_N_logo.svg' },`
);

code = code.replace(
`  disney: { id: 'disney', displayName: 'Disney+', providerId: '337', color: '#113CCF', logoPath: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },`,
`  disney: { id: 'disney', displayName: 'Disney+', providerId: 'disney-plus', color: '#113CCF', logoPath: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },`
);

code = code.replace(
`  prime: { id: 'prime', displayName: 'Prime Video', providerId: '9', color: '#00A8E1', logoPath: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/prime-video-alt-dark.svg' },`,
`  prime: { id: 'prime', displayName: 'Prime Video', providerId: 'prime-video', color: '#00A8E1', logoPath: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/prime-video-alt-dark.svg' },`
);

code = code.replace(
`  apple: { id: 'apple', displayName: 'Apple TV+', providerId: '350', color: '#FFFFFF', logoPath: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/apple-tv-plus-light.svg' },`,
`  apple: { id: 'apple', displayName: 'Apple TV+', providerId: 'apple-tv', color: '#FFFFFF', logoPath: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/apple-tv-plus-light.svg' },`
);

code = code.replace(
`  max: { id: 'max', displayName: 'HBO Max', providerId: '1899', color: '#002BE7', logoPath: 'https://cdn.jsdelivr.net/gh/selfhst/icons/svg/hbo-max-light.svg' }`,
`  max: { id: 'max', displayName: 'HBO Max', providerId: 'hbo-max', color: '#002BE7', logoPath: 'https://cdn.jsdelivr.net/gh/selfhst/icons/svg/hbo-max-light.svg' }`
);

fs.writeFileSync('src/lib/platforms.tsx', code);
