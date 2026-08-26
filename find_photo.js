const fs = require('fs');
const path = require('path');

const mediaDir = 'C:\\Users\\tusha\\.gemini\\antigravity\\brain\\0fe5c56a-4499-4262-8641-3f7812e7cf2f\\.tempmediaStorage';
const files = fs.readdirSync(mediaDir)
  .filter(f => f.startsWith('media_'))
  .map(f => ({ name: f, stat: fs.statSync(path.join(mediaDir, f)) }))
  .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs)
  .slice(0, 5);

files.forEach(f => {
  console.log(`${f.name} | ${f.stat.size} bytes | ${f.stat.mtime.toISOString()}`);
});
