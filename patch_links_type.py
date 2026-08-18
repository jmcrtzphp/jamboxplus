import re

with open('src/components/FloatingNav.tsx', 'r') as f:
    text = f.read()

# Update the TypeScript interface to include mobileIcon
text = text.replace('const links: Array<{ id: string, label: string, icon: any, mobileLabel?: string, action?: () => void }> = [', 'const links: Array<{ id: string, label: string, icon: any, mobileIcon?: any, mobileLabel?: string, action?: () => void }> = [')

with open('src/components/FloatingNav.tsx', 'w') as f:
    f.write(text)

