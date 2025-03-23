import { supabase } from '@/utils/supabaseClient';

export async function getUser(): Promise<{ id: string; email: string; } | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Fehler beim Abrufen des Benutzers:", error.message);
    return null;
  }

  return data && data.user && data.user.id && data.user.email ? { id: data.user.id, email: data.user.email } : null;
}
