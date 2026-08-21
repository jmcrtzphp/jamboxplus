const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf-8');

html = html.replace(/<title>.*?<\/title>/, '<title>JamBox+ | Watch Movies & TV Shows Streaming</title>');

// Clean up old og and twitter tags
html = html.replace(/<meta property="og:.*?".*?>\n?/g, '');
html = html.replace(/<meta name="twitter:.*?".*?>\n?/g, '');
html = html.replace(/<link rel="canonical".*?>\n?/g, '');

const newMeta = `
    <!-- OpenGraph / Facebook / Discord -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="JamBox+" />
    <meta property="og:title" content="JamBox+ | Watch Movies & TV Shows Streaming" />
    <meta property="og:description" content="Watch movies and TV shows on JamBox+. Discover your next favorite movie or series." />
    <meta property="og:url" content="https://jamboxplusph.dpdns.org/" />
    <meta property="og:image" content="https://jamboxplusph.dpdns.org/preview.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />

    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="JamBox+ | Watch Movies & TV Shows Streaming" />
    <meta name="twitter:description" content="Watch movies and TV shows on JamBox+. Discover your next favorite movie or series." />
    <meta name="twitter:image" content="https://jamboxplusph.dpdns.org/preview.jpg" />

    <link rel="canonical" href="https://jamboxplusph.dpdns.org/" />
`;

html = html.replace('<!-- OpenGraph / Facebook / Discord -->', newMeta);

fs.writeFileSync('index.html', html);
console.log('Fixed index.html meta tags');
