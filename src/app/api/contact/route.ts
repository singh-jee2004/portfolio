import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '../../../lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://'))) {
      // Log to console as fallback
      console.log('📩 New contact message (Supabase not configured):', { name, email, subject, message });
      return NextResponse.json({ success: true, message: 'Message received (logged locally)' });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from('messages').insert({
      name,
      email,
      subject: subject || null,
      message,
    });

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
