import re

with open('src/components/Movies.tsx', 'r') as f:
    content = f.read()

content = content.replace("  profileMenu?: React.ReactNode;\n", "")
content = content.replace("export function Movies({ onBack, onNavigate, profileMenu }: MoviesProps) {", "export function Movies({ onBack, onNavigate }: MoviesProps) {")
content = content.replace("        profileMenu={profileMenu}\n", "")

with open('src/components/Movies.tsx', 'w') as f:
    f.write(content)

