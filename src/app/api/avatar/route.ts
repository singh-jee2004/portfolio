import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const side = searchParams.get('side');

  const publicDir = path.join(process.cwd(), 'public');

  // Automatically sync front/back files across all extension aliases
  try {
    const syncFiles = (baseNames: string[]) => {
      const existing = baseNames.find((name) => fs.existsSync(path.join(publicDir, name)));
      if (existing) {
        const srcBuffer = fs.readFileSync(path.join(publicDir, existing));
        baseNames.forEach((target) => {
          const targetPath = path.join(publicDir, target);
          if (!fs.existsSync(targetPath)) {
            fs.writeFileSync(targetPath, srcBuffer);
          }
        });
      }
    };

    syncFiles(['front.jpg.png', 'front.jpg', 'front.png', 'avatar-3d.png']);
    syncFiles(['back.jpg.png', 'back.jpg', 'back.png', 'avatar-3d-back.png']);
  } catch (e) {
    console.error('Avatar sync error:', e);
  }

  const filename = side === 'back' ? 'back.jpg.png' : 'front.jpg.png';
  const filePath = path.join(publicDir, filename);

  if (fs.existsSync(filePath)) {
    const buffer = fs.readFileSync(filePath);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  return NextResponse.json({ error: 'Avatar not found' }, { status: 404 });
}
