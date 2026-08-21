const fs = require('fs');
let lines = fs.readFileSync('src/components/Movies.tsx', 'utf-8').split('\n');

const garbageStart = lines.findIndex(l => l.includes('hideHero={true}'));

if (garbageStart > -1) {
  // Let's go up a few lines to where it actually broke.
  // The correct end is:
  //       )}
  //     </div>
  //   );
  // }
  const realEnd = lines.findIndex(l => l.startsWith('}           onSelectMovie={onSelectMovie}'));
  if (realEnd > -1) {
    lines[realEnd] = '}';
    lines = lines.slice(0, realEnd + 1);
    fs.writeFileSync('src/components/Movies.tsx', lines.join('\n'));
    console.log("Fixed!");
  }
}

