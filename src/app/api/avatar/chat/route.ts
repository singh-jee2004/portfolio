import { NextResponse } from 'next/server';
import { getAvatarResponse } from '@/lib/ai';
import { fetchAvatarResponsesFromSupabase } from '@/lib/supabase-avatar';

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question string is required' }, { status: 400 });
    }

    const cleanQuestion = question.trim();

    // 1. Check Supabase custom knowledge table first
    const dbResponses = await fetchAvatarResponsesFromSupabase();
    const matchedDb = dbResponses.find(
      (r) => r.question.toLowerCase().includes(cleanQuestion.toLowerCase()) || cleanQuestion.toLowerCase().includes(r.question.toLowerCase())
    );

    if (matchedDb) {
      return NextResponse.json({
        question: cleanQuestion,
        answer: matchedDb.answer,
        source: 'supabase',
      });
    }

    // 2. Query smart portfolio knowledge engine
    const answer = getAvatarResponse(cleanQuestion);

    return NextResponse.json({
      question: cleanQuestion,
      answer,
      source: 'knowledge_engine',
    });
  } catch (error) {
    console.error('Avatar chat API error:', error);
    return NextResponse.json(
      { answer: "I'm Tushar's AI representative! Feel free to ask about his skills, projects, or background." },
      { status: 200 }
    );
  }
}
