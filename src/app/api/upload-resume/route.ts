import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { createAdminClient } from '../../../lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Please upload a valid PDF document (.pdf)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Save locally to public/resume.pdf for immediate download availability
    const publicDir = path.join(process.cwd(), 'public');
    await mkdir(publicDir, { recursive: true });
    const filePath = path.join(publicDir, 'resume.pdf');
    await writeFile(filePath, buffer);

    // 2. Also attempt upload to Supabase Storage if configured
    let supabaseUrl: string | null = null;
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload('resume.pdf', buffer, { contentType: 'application/pdf', upsert: true });

      if (!error && data) {
        const publicUrlData = supabase.storage.from('resumes').getPublicUrl('resume.pdf');
        supabaseUrl = publicUrlData.data.publicUrl;
      }
    } catch {
      // Supabase storage bucket fallback
    }

    return NextResponse.json({
      success: true,
      message: 'Resume updated successfully!',
      url: supabaseUrl || '/resume.pdf',
    });
  } catch (err) {
    console.error('Resume upload error:', err);
    return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 });
  }
}
