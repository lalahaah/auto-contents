import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === undefined) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn('Supabase URL or Anon Key is missing. Using placeholder values for build.');
    }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
