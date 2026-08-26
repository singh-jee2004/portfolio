const fs = require('fs');
const path = require('path');

const src = path.join('C:', 'Users', 'tusha', '.gemini', 'antigravity', 'brain', '0fe5c56a-4499-4262-8641-3f7812e7cf2f', 'tushar_3d_avatar_1787757675830.png');
const dest = path.join(__dirname, 'public', 'avatar-3d.png');

fs.copyFileSync(src, dest);
console.log('Avatar copied to public/avatar-3d.png');
