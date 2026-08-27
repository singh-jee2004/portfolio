import { createClient } from './supabase/client';

export interface AvatarDBResponse {
  id: string;
  question: string;
  answer: string;
  category: string;
  audio_url?: string;
  created_at?: string;
}

export async function fetchAvatarResponsesFromSupabase(): Promise<AvatarDBResponse[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('avatar_responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }
    return data as AvatarDBResponse[];
  } catch (err) {
    console.warn('Supabase avatar_responses fetch warning:', err);
    return [];
  }
}

export async function addAvatarResponseToSupabase(question: string, answer: string, category = 'general'): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('avatar_responses')
      .insert([{ question, answer, category }]);

    return !error;
  } catch (err) {
    console.warn('Supabase avatar_responses insert error:', err);
    return false;
  }
}
