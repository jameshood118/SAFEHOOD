// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types'; // <-- The blueprints

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// The "Efficiency Trap" check: Fail loudly if the keys are missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'SAFEHOOD CRITICAL: Missing Supabase environment variables. The Airlock cannot initialize.'
  );
}

// Initialize the Sovereign connection with full Epistemic type safety
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
