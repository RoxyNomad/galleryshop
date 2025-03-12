import { supabase } from '@/utils/supabaseClient';  

export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      return { error: loginError.message };
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user) {
      return { error: 'Benutzer nicht authentifiziert.' };
    }

    const userId = sessionData.session.user.id;
    if (!userId) {
      return { error: 'Kein Nutzer gefunden.' };
    }

    const { data: userData, error: userError, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })  
      .eq('id', userId)
      .limit(1);

    if (userError) {
      return { error: `Fehler beim Abrufen der Benutzerdaten: ${userError.message}` };
    }

    if (count === 0) {
      return { error: 'Kein Benutzer mit dieser ID gefunden.' };
    }

    return {
      user: {
        id: userId,
        email: data.user?.email,
        user_type: userData[0].user_type || 'customer',
      },
    };
  } catch (err) {
    return { error: `Ein unerwarteter Fehler ist aufgetreten: ${(err as Error).message}` };
  }
};

interface RegisterResponse {
  user: { id: string; email: string } | null;
  error: string | null;
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  userType: "customer" | "artist",
  artistName?: string,
  portfolioUrl?: string
): Promise<RegisterResponse> {
  try {
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUserError && existingUserError.code !== "PGRST116") {  
      return { user: null, error: "Fehler bei der E-Mail-Überprüfung." };
    }

    if (existingUser) {
      return { user: null, error: "Ein Benutzer mit dieser E-Mail existiert bereits." };
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      await supabase.from("users").delete().eq("email", email);

      const newUser = {
        id: data.user.id,
        name,
        email,
        user_type: userType,
      };

      await supabase.from("users").insert([newUser]);

      if (userType === "artist") {
        const artistData: { id: string; artist_name?: string; portfolio_url?: string } = {
          id: data.user.id,
          artist_name: artistName || undefined,
        };
        
        if (portfolioUrl) {
          artistData.portfolio_url = portfolioUrl;
        }
        
        await supabase.from("artists").insert([artistData]);
      }

      return { user: { id: data.user.id, email: data.user.email ?? "" }, error: null };
    }

    return { user: null, error: "Unbekannter Fehler bei der Registrierung." };
  } catch {
    return { user: null, error: "Ein unerwarteter Fehler ist aufgetreten." };
  }
}

export async function logoutUser(): Promise<void> {
  await supabase.auth.signOut();
}
