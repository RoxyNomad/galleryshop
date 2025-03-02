import { supabase } from "../../../utils/supabaseClient";

/**
 * Speichert einen neuen Benutzer in der `users`-Tabelle der Supabase-Datenbank.
 * @param email - Die E-Mail-Adresse des Benutzers.
 * @returns Ein Promise, das entweder Erfolg oder Fehler ausgibt.
 */
export async function saveUserToDatabase(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Benutzer in die Datenbank einfügen
    const { error } = await supabase
      .from("users")
      .insert([{ email }]);

    // Fehlerhandling
    if (error) {
      console.error("Fehler beim Speichern des Benutzers:", error.message);
      return { success: false, error: error.message };
    }

    console.log("✅ Benutzer erfolgreich gespeichert:", email);
    return { success: true };
  } catch (err) {
    // Fehlerhandling für unerwartete Fehler
    console.error("❌ Unerwarteter Fehler beim Speichern des Benutzers:", err);
    return { success: false, error: "Ein unerwarteter Fehler ist aufgetreten." };
  }
}
