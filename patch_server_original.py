import re

with open('server.ts', 'r') as f:
    text = f.read()

# Find where backdropPath1080 is defined
search_block = """  const backdropPath1080 = item.backdrop_path 
    ? (item.backdrop_path.startsWith('http') ? item.backdrop_path : `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`)
    : (item.imageSet?.horizontalPoster?.w1080 || posterPath);"""

replace_block = """  const backdropPathOriginal = item.backdrop_path 
    ? (item.backdrop_path.startsWith('http') ? item.backdrop_path : `https://image.tmdb.org/t/p/original${item.backdrop_path}`)
    : (item.imageSet?.horizontalPoster?.original || posterPath);
  const backdropPath1080 = item.backdrop_path 
    ? (item.backdrop_path.startsWith('http') ? item.backdrop_path : `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`)
    : (item.imageSet?.horizontalPoster?.w1080 || posterPath);"""

text = text.replace(search_block, replace_block)

# Add it to the horizontalPoster object
# From:
#       horizontalPoster: {
#         w360: item.backdrop_path ? (item.backdrop_path.startsWith('http') ? item.backdrop_path : `https://image.tmdb.org/t/p/w300${item.backdrop_path}`) : backdropPath720,
#         w720: backdropPath720,
#         w1080: backdropPath1080
#       }
# To include original: backdropPathOriginal

poster_block = """      horizontalPoster: {
        w360: item.backdrop_path ? (item.backdrop_path.startsWith('http') ? item.backdrop_path : `https://image.tmdb.org/t/p/w300${item.backdrop_path}`) : backdropPath720,
        w720: backdropPath720,
        w1080: backdropPath1080
      }"""

new_poster_block = """      horizontalPoster: {
        w360: item.backdrop_path ? (item.backdrop_path.startsWith('http') ? item.backdrop_path : `https://image.tmdb.org/t/p/w300${item.backdrop_path}`) : backdropPath720,
        w720: backdropPath720,
        w1080: backdropPath1080,
        original: backdropPathOriginal
      }"""

text = text.replace(poster_block, new_poster_block)

with open('server.ts', 'w') as f:
    f.write(text)

print("Server patched with original resolution support")
