import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Try to load updated resume from Supabase site_settings
    try {
      const supabase = createServerClient();
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'resume_pdf')
        .maybeSingle();

      if (data && data.value) {
        const buffer = Buffer.from(data.value, 'base64');
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="Tushar_Singh_Resume.pdf"',
            'Cache-Control': 'public, max-age=60, s-maxage=60',
          },
        });
      }
    } catch {
      // Fallback to static file
    }

    // 2. Fallback to static file in public/resume.pdf
    const filePath = path.join(process.cwd(), 'public', 'resume.pdf');
    const fileBuffer = await readFile(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Tushar_Singh_Resume.pdf"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('Error serving resume:', err);
    return new NextResponse('Resume not found', { status: 404 });
  }
}
