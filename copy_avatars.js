const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const frontSrc = 'C:\\Users\\tusha\\.gemini\\antigravity\\brain\\0fe5c56a-4499-4262-8641-3f7812e7cf2f\\hoodie_3d_avatar_1787767633962.png';
const backSrc = 'C:\\Users\\tusha\\.gemini\\antigravity\\brain\\0fe5c56a-4499-4262-8641-3f7812e7cf2f\\mountain_3d_avatar_1787767661747.png';

if (fs.existsSync(frontSrc)) {
  fs.copyFileSync(frontSrc, path.join(publicDir, 'avatar-3d.png'));
  console.log('Front avatar copied');
}
if (fs.existsSync(backSrc)) {
  fs.copyFileSync(backSrc, path.join(publicDir, 'avatar-3d-back.png'));
  console.log('Back avatar copied');
}
console.log('Done');
