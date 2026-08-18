import re

with open('src/components/Movies.tsx', 'r') as f:
    text = f.read()

# Replace the w240 preference
old_poster_logic = "const poster = show.imageSet?.verticalPoster?.w240 || show.imageSet?.verticalPoster?.w360 || show.imageSet?.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60';"
new_poster_logic = "const poster = show.imageSet?.verticalPoster?.w480 || show.imageSet?.verticalPoster?.w360 || show.imageSet?.verticalPoster?.w240 || show.imageSet?.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60';"

if old_poster_logic in text:
    text = text.replace(old_poster_logic, new_poster_logic)
    print("Replaced poster logic in MovieCard")

with open('src/components/Movies.tsx', 'w') as f:
    f.write(text)

