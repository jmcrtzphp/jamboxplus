import re

with open('src/components/WatchModal.tsx', 'r') as f:
    text = f.read()

old_logic = "const backdrop = show?.imageSet?.horizontalPoster?.w1080 || show?.imageSet?.horizontalPoster?.w720 || poster;"
new_logic = "const backdrop = show?.imageSet?.horizontalPoster?.original || show?.imageSet?.horizontalPoster?.w1080 || show?.imageSet?.horizontalPoster?.w720 || poster;"

if old_logic in text:
    text = text.replace(old_logic, new_logic)
    print("Patched WatchModal")

with open('src/components/WatchModal.tsx', 'w') as f:
    f.write(text)

