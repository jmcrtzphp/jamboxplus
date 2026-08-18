import re

with open('src/lib/tmdb.ts', 'r') as f:
    text = f.read()

text = text.replace('horizontalPoster?: { w360?: string; w480?: string; w720?: string; w1080?: string; };', 'horizontalPoster?: { w360?: string; w480?: string; w720?: string; w1080?: string; original?: string; };')

with open('src/lib/tmdb.ts', 'w') as f:
    f.write(text)

