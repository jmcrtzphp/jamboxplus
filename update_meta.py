import re

with open('index.html', 'r') as f:
    html = f.read()

# The block to replace
og_block_regex = r"<!-- OpenGraph / Facebook -->.*?<!-- JSON-LD"

new_block = """<!-- OpenGraph / Facebook -->
    <meta property="og:site_name" content="JAMBOX+" />
    <meta property="og:title" content="JAMBOX+ | Unlimited Entertainment, Anytime, Anywhere" />
    <meta property="og:description" content="Watch the latest movies, TV shows, and live TV in stunning quality. No ads. No limits." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://ais-pre-5b7itsyteagj336kjod3ty-538900046161.asia-southeast1.run.app/" />
    <meta property="og:image" content="https://ais-pre-5b7itsyteagj336kjod3ty-538900046161.asia-southeast1.run.app/images/preview.jpg" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="JAMBOX+ | Unlimited Entertainment, Anytime, Anywhere" />
    <meta name="twitter:description" content="Watch the latest movies, TV shows, and live TV in stunning quality. No ads. No limits." />
    <meta name="twitter:image" content="https://ais-pre-5b7itsyteagj336kjod3ty-538900046161.asia-southeast1.run.app/images/preview.jpg" />

    <!-- JSON-LD"""

updated_html = re.sub(og_block_regex, new_block, html, flags=re.DOTALL)

with open('index.html', 'w') as f:
    f.write(updated_html)

print("Meta tags updated successfully.")
