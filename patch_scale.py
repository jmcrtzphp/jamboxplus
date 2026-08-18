import re

with open('src/components/FloatingNav.tsx', 'r') as f:
    text = f.read()

# Replace button with motion.button
text = text.replace('return (\n                    <button', 'return (\n                    <motion.button\n                      whileTap={{ scale: 0.85 }}')

text = text.replace('</button>\n                  );', '</motion.button>\n                  );')

with open('src/components/FloatingNav.tsx', 'w') as f:
    f.write(text)

