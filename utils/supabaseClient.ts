import { createClient } from '@supabase/supabase-js';

// Lade Umgebungsvariablen und prüfe, ob sie gesetzt sind
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase-Umgebungsvariablen sind nicht gesetzt.");
}

// Supabase-Client erstellen
export const supabase = createClient(supabaseUrl, supabaseKey);
