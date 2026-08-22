const fs = require('fs');
let code = fs.readFileSync('src/lib/platforms.tsx', 'utf8');

code = code.replace(
`  netflix: { id: 'netflix', displayName: 'Netflix', providerId: 8, color: 'from-[#E50914] to-[#B81D24]', type: 'subscription' },`,
`  netflix: { id: 'netflix', displayName: 'Netflix', providerId: 'netflix', color: 'from-[#E50914] to-[#B81D24]', type: 'subscription' },`
);

code = code.replace(
`  prime: { id: 'prime', displayName: 'Prime Video', providerId: 119, color: 'from-[#00A8E1] to-[#007EA8]', type: 'subscription' },`,
`  prime: { id: 'prime', displayName: 'Prime Video', providerId: 'prime-video', color: 'from-[#00A8E1] to-[#007EA8]', type: 'subscription' },`
);

code = code.replace(
`  disney: { id: 'disney', displayName: 'Disney+', providerId: 337, color: 'from-[#113CCF] to-[#0B278A]', type: 'subscription' },`,
`  disney: { id: 'disney', displayName: 'Disney+', providerId: 'disney-plus', color: 'from-[#113CCF] to-[#0B278A]', type: 'subscription' },`
);

code = code.replace(
`  hbo: { id: 'hbo', displayName: 'HBO Max', providerId: 384, color: 'from-[#5822B4] to-[#3C167A]', type: 'subscription' },`,
`  hbo: { id: 'hbo', displayName: 'HBO Max', providerId: 'hbo-max', color: 'from-[#5822B4] to-[#3C167A]', type: 'subscription' },`
);

code = code.replace(
`  apple: { id: 'apple', displayName: 'Apple TV+', providerId: 350, color: 'from-[#434343] to-[#1C1C1C]', type: 'subscription' },`,
`  apple: { id: 'apple', displayName: 'Apple TV+', providerId: 'apple-tv', color: 'from-[#434343] to-[#1C1C1C]', type: 'subscription' },`
);

fs.writeFileSync('src/lib/platforms.tsx', code);
