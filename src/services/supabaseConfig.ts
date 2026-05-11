const SUPABASE_URL = 'SUBSTITUA_PELA_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'SUBSTITUA_PELA_SUPABASE_ANON_KEY';

function hasPlaceholderValue(value: string) {
  return value.startsWith('SUBSTITUA_PELA_');
}

export const isSupabaseConfigured =
  SUPABASE_URL.trim().length > 0 &&
  SUPABASE_ANON_KEY.trim().length > 0 &&
  !hasPlaceholderValue(SUPABASE_URL) &&
  !hasPlaceholderValue(SUPABASE_ANON_KEY);

export function getSupabaseHeaders() {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };
}

export { SUPABASE_URL, SUPABASE_ANON_KEY };
