import { supabase } from '../../utils/supabaseClient';

export async function logoutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout-Fehler:", error.message);
  } else {
    console.log("Erfolgreich ausgeloggt!");
  }
}
