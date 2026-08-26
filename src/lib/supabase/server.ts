import { createClient } from '@supabase/supabase-js'

function getSafeUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return (url && (url.startsWith('http://') || url.startsWith('https://')))
    ? url
    : 'https://placeholder-project.supabase.co'
}

// Server-side Supabase client with service role (bypasses RLS)
export function createAdminClient() {
  return createClient(
    getSafeUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
  )
}

// Public server client (respects RLS)
export function createServerClient() {
  return createClient(
    getSafeUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  )
}

