import re

with open('src/components/Movies.tsx', 'r') as f:
    text = f.read()

# Change it to prefer w1080 over original, or just original for the active one?
# Let's prefer w1080 (which maps to w1280) for HeroBanner to keep it fast, but still HD
old_bg_logic = "const bg = movie.imageSet?.horizontalPoster?.original || movie.imageSet?.horizontalPoster?.w1080 || movie.imageSet?.horizontalPoster?.w720 || movie.imageSet?.poster;"
new_bg_logic = "const bg = movie.imageSet?.horizontalPoster?.w1080 || movie.imageSet?.horizontalPoster?.original || movie.imageSet?.horizontalPoster?.w720 || movie.imageSet?.poster;"

if old_bg_logic in text:
    text = text.replace(old_bg_logic, new_bg_logic)
    print("Reverted to prefer w1080 for optimization")

with open('src/components/Movies.tsx', 'w') as f:
    f.write(text)

