import { supabase } from '../../utils/supabaseClient';

interface User {
  id: string;
  email?: string;
  user_type?: string;
}

interface LoginResponse {
  user: User | null;
  error: string | null;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  // Nutzer mit E-Mail & Passwort einloggen
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Login-Fehler:", error.message);
    return { user: null, error: error.message };
  }

  // Nutzer-ID aus Supabase holen
  const userId = data.user?.id;
  if (!userId) return { user: null, error: "Kein Nutzer gefunden" };

  // 🎯 Nutzer-Typ (`user_type`) aus der Datenbank abrufen
  const { data: userData, error: userError } = await supabase
    .from('users') // Dein Users-Table in der DB
    .select('user_type')
    .eq('id', userId)
    .single();

  if (userError) {
    console.error("Fehler beim Laden des Nutzertyps:", userError.message);
    return { user: null, error: "Fehler beim Laden des Nutzertyps" };
  }

  console.log("Erfolgreich eingeloggt:", { ...data.user, user_type: userData.user_type });

  return { user: { ...data.user, user_type: userData.user_type }, error: null };
}
