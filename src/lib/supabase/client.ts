import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const validUrl = (url && (url.startsWith('http://') || url.startsWith('https://')))
    ? url
    : 'https://placeholder-project.supabase.co'

  const validKey = key || 'placeholder-anon-key'

  return createSupabaseClient(validUrl, validKey)
}

