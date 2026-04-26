// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Grab the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Airlock Breach: Missing Supabase Environment Variables.');
}

// 🚀 THE ACTUAL EXPORT THAT WENT MISSING
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
