import re

with open('src/components/WatchModal.tsx', 'r') as f:
    text = f.read()

# Replace size="lg" with size="md" for primary button
text = text.replace('variant="primary"\n                      size="lg"', 'variant="primary"\n                      size="md"')
# Replace primary play icon
text = text.replace('<Play className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-white" />', '<Play size={17} className="fill-white" />')

# Replace RotateCcw icon
text = text.replace('<RotateCcw className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />', '<RotateCcw size={17} />')
# Remove text-xs from secondary button
text = text.replace('className="cursor-pointer text-xs"\n                      >', 'className="cursor-pointer"\n                      >')

# Replace Check icon
text = text.replace('<Check className="w-4 h-4 sm:w-[16px] sm:h-[16px] text-green-400" />', '<Check size={17} className="text-green-400" />')
# Replace Plus icon
text = text.replace('<Plus className="w-4 h-4 sm:w-[16px] sm:h-[16px]" />', '<Plus size={17} />')

# Replace text content for Favorites
text = text.replace("{isFavorite ? 'In Favorites' : 'Add to Favorites'}", "{isFavorite ? 'Saved' : 'Favorites'}")


with open('src/components/WatchModal.tsx', 'w') as f:
    f.write(text)

print("Done")
