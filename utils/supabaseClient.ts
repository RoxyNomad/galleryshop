import { createClient } from '@supabase/supabase-js';

// Lade Umgebungsvariablen und prüfe, ob sie definiert sind
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase-Umgebungsvariablen sind nicht gesetzt.");
}

// Erstelle den Supabase-Client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Definiere das Login-Response-Interface
interface LoginResponse {
  user?: { id: string; email?: string; user_type?: string };
  error?: string | null;
}

/**
 * Authentifiziert einen Benutzer mit E-Mail und Passwort.
 * Ruft das `user_type`-Feld aus der Datenbank ab.
 */
async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: error.message };
    }

    // Falls der Benutzer existiert, holen wir das user_type-Feld aus der user_metadata
    const user = data.user;
    const userType = user?.user_metadata?.user_type || "customer"; // Standardmäßig "customer"

    return { user: { id: user?.id, email: user?.email, user_type: userType } };
  } catch {
    return { error: "Ein unerwarteter Fehler ist aufgetreten." };
  }
}

// Exportiere Supabase-Client und Login-Funktion
export { loginUser };
