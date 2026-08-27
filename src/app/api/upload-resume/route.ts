import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { createAdminClient } from '../../../lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting Guard (max 5 upload attempts per minute per IP)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous-ip';
    const rateLimit = checkRateLimit(`upload-${ip}`, 5, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many upload attempts. Please wait a minute.' },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 2. Strict File Type & Extension Validation
    const fileNameLower = file.name.toLowerCase();
    const mimeType = file.type;

    if (!fileNameLower.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Please upload a valid PDF document (.pdf)' }, { status: 400 });
    }

    if (mimeType && mimeType !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file MIME type. Only PDF documents are allowed.' }, { status: 400 });
    }

    // 3. File Size Validation (Max 10 MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum allowed limit (10MB).' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Save locally to public/resume.pdf
    const publicDir = path.join(process.cwd(), 'public');
    await mkdir(publicDir, { recursive: true });
    const filePath = path.join(publicDir, 'resume.pdf');
    await writeFile(filePath, buffer);

    // 5. Attempt upload to Supabase Storage if configured
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
