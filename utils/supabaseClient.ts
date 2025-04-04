import { createClient } from '@supabase/supabase-js';

// Load environment variables and check if they are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// If the environment variables are not set, throw an error
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables are not set.");
}

// Create the Supabase client using the URL and key from the environment variables
export const supabase = createClient(supabaseUrl, supabaseKey);
