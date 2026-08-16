import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Rename JamTV to JamBox+
    content = content.replace("JamTV", "JamBox+")
    
    # Custom text logo replacements
    content = content.replace('Jam<span className="text-blue-400">TV</span>', 'JAMBOX<span className="text-amber-500">+</span>')
    content = content.replace('Jam<span className="text-amber-500">TV</span>', 'JAMBOX<span className="text-amber-500">+</span>')
    content = content.replace('Jam<span className="text-blue-400">Box+</span>', 'JAMBOX<span className="text-amber-500">+</span>')
    
    # Replace blue colors with amber (gold)
    content = content.replace('text-blue-400', 'text-amber-500')
    content = content.replace('text-blue-300', 'text-amber-400')
    content = content.replace('text-blue-500', 'text-amber-500')
    
    content = content.replace('bg-blue-400', 'bg-amber-500')
    content = content.replace('bg-blue-500', 'bg-amber-500')
    content = content.replace('bg-blue-600', 'bg-amber-600')
    content = content.replace('bg-blue-800', 'bg-amber-800')
    content = content.replace('bg-blue-950', 'bg-amber-900')
    
    content = content.replace('border-blue-400', 'border-amber-500')
    content = content.replace('border-blue-500', 'border-amber-500')
    content = content.replace('border-blue-600', 'border-amber-600')
    
    content = content.replace('ring-blue-400', 'ring-amber-500')
    content = content.replace('ring-blue-500', 'ring-amber-500')
    
    content = content.replace('shadow-blue-500', 'shadow-amber-500')
    content = content.replace('from-blue-600', 'from-amber-600')
    content = content.replace('to-blue-600', 'to-amber-600')
    content = content.replace('to-indigo-500', 'to-amber-700')
    content = content.replace('from-cyan-500', 'from-amber-400')
    content = content.replace('from-cyan-700', 'from-amber-600')
    content = content.replace('via-blue-800', 'via-amber-700')
    content = content.replace('via-blue-950', 'via-amber-800')

    # Fix RGB values in arbitrary shadows (blue is 59,130,246) (amber-500 is 245,158,11 for f59e0b)
    # Actually tailwind amber-500 is #f59e0b => rgb(245, 158, 11)
    # Or just replace the exact rgba instances
    content = content.replace('rgba(59,130,246,', 'rgba(245,158,11,')
    content = content.replace('rgba(96,165,250,', 'rgba(251,191,36,') # blue-400 -> amber-400
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css', '.html')):
            process_file(os.path.join(root, file))

process_file('index.html')
process_file('server.ts')

