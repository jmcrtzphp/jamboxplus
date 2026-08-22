import fs from 'fs';
const logsDir = '/root/.npm/_logs/';
const files = fs.readdirSync(logsDir).filter(f => f.endsWith('.log'));
for (const file of files) {
  const content = fs.readFileSync(logsDir + file, 'utf8');
  if (content.includes('/api/movies called with query')) {
    console.log("Found in file:", file);
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('/api/movies called with query')) {
        console.log(lines[i]);
      }
    }
  }
}
