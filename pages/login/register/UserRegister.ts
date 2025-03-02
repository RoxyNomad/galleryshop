import { createClient } from "@supabase/supabase-js";

// Supabase-Client initialisieren
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface für die Rückgabe der Registrierung
interface RegisterResponse {
  user: { id: string; email: string } | null;
  error: string | null;
}

/**
 * Registriert einen neuen Benutzer mit E-Mail und Passwort.
 * @param email - Die E-Mail-Adresse des Benutzers.
 * @param password - Das Passwort des Benutzers.
 * @returns Ein Objekt mit Benutzerdaten oder einer Fehlermeldung.
 */
export async function registerUser(
  email: string,
  password: string
): Promise<RegisterResponse> {
  try {
    // Supabase-Anfrage zur Registrierung
    const { data, error } = await supabase.auth.signUp({ email, password });

    // Fehlerhandling
    if (error) {
      console.error("Registrierungsfehler:", error.message);
      return { user: null, error: error.message };
    }

    // Benutzer erfolgreich registriert
    if (data.user) {
      console.log("Benutzer registriert:", data.user);
      return { user: { id: data.user.id, email: data.user.email ?? "" }, error: null };
    }

    // Falls kein Benutzer zurückgegeben wurde
    return { user: null, error: "Unbekannter Fehler bei der Registrierung." };
  } catch (err) {
    // Fehlerhandling für unerwartete Fehler
    console.error("Unerwarteter Fehler bei der Registrierung:", err);
    return { user: null, error: "Ein unerwarteter Fehler ist aufgetreten." };
  }
}
