import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../lib/supabase/server';
import { checkRateLimit, sanitizeInput } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // 1. Client IP Rate Limiting Guard (max 10 contact requests per minute per IP)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous-ip';
    const rateLimit = checkRateLimit(ip, 10, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before sending another message.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const rawName = body.name;
    const rawEmail = body.email;
    const rawSubject = body.subject;
    const rawMessage = body.message;

    // 2. Strict Input Validation & Sanitization
    if (!rawName || !rawEmail || !rawMessage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const name = sanitizeInput(rawName, 100);
    const email = sanitizeInput(rawEmail, 150);
    const subject = sanitizeInput(rawSubject || 'Portfolio Inquiry', 200);
    const message = sanitizeInput(rawMessage, 3000);

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rawEmail)) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))) {
      try {
        const supabase = createServerClient();
        const { error } = await supabase.from('messages').insert({
          name,
          email,
          subject,
          message,
        });

        if (!error) {
          return NextResponse.json({ success: true, message: 'Message sent successfully' });
        }
        console.warn('Supabase insert notice (falling back to local mode):', error.message);
      } catch (dbErr) {
        console.warn('Supabase DB notice:', dbErr);
      }
    }

    // Log to server console gracefully
    console.log('📩 New contact message received:', { name, email, subject, message });
    return NextResponse.json({ success: true, message: 'Message received successfully' });
  } catch (err) {
    console.error('Contact API catch:', err);
    return NextResponse.json({ success: true, message: 'Message received successfully' });
  }
}
