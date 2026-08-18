import re

with open('src/components/Movies.tsx', 'r') as f:
    text = f.read()

# Replace w720 preferred with w1080 preferred for HeroBanner and Movies header
old_bg_logic = "const bg = movie.imageSet?.horizontalPoster?.w720 || movie.imageSet?.horizontalPoster?.w1080 || movie.imageSet?.poster;"
new_bg_logic = "const bg = movie.imageSet?.horizontalPoster?.w1080 || movie.imageSet?.horizontalPoster?.w720 || movie.imageSet?.poster;"

if old_bg_logic in text:
    text = text.replace(old_bg_logic, new_bg_logic)
    print("Replaced bg logic in HeroBanner")

with open('src/components/Movies.tsx', 'w') as f:
    f.write(text)

