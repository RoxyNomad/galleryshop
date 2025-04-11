import { supabase } from '@/utils/supabaseClient';  // Import Supabase client

// Function to log in a user with email and password
export const loginUser = async (email: string, password: string) => {
  try {
    // Attempt to sign in the user with the provided email and password
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    // If there is an error during login, return the error message
    if (loginError) {
      return { error: loginError.message };
    }

    // Retrieve the current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user) {
      return { error: 'Benutzer nicht authentifiziert.' };  // User not authenticated
    }

    const userId = sessionData.session.user.id;
    if (!userId) {
      return { error: 'Kein Nutzer gefunden.' };  // No user found
    }

    // Query the 'users' table for user data based on the user ID
    const { data: userData, error: userError, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })  
      .eq('id', userId)
      .limit(1);

    // If there is an error fetching user data, return the error
    if (userError) {
      return { error: `Fehler beim Abrufen der Benutzerdaten: ${userError.message}` };
    }

    // If no user is found with the given ID, return an error
    if (count === 0) {
      return { error: 'Kein Benutzer mit dieser ID gefunden.' };
    }

    // Return user data including user type (e.g. customer or artist)
    return {
      user: {
        id: userId,
        email: data.user?.email,
        user_type: userData[0].user_type || 'customer',  // Default to 'customer' if user_type is not found
      },
    };
  } catch (err) {
    // Return unexpected error if something goes wrong
    return { error: `Ein unerwarteter Fehler ist aufgetreten: ${(err as Error).message}` };
  }
};

// Interface to define the structure of the registration response
interface RegisterResponse {
  user: { id: string; email: string } | null;
  error: string | null;
}

// Function to register a new user
export async function registerUser(
  email: string,
  password: string,
  name: string,
  userType: "customer" | "artist",
  artistName?: string,
  portfolioUrl?: string
): Promise<RegisterResponse> {
  try {
    // Check if a user with the given email already exists
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

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      // Delete any previously created row with this email in case something went wrong before
      await supabase.from("users").delete().eq("email", email);

      const newUser = {
        id: data.user.id,
        name,
        email,
        user_type: userType,
      };

      // Insert into users
      const { error: userInsertError } = await supabase.from("users").insert([newUser]);
      if (userInsertError) {
        return { user: null, error: `Fehler beim Einfügen des Benutzers: ${userInsertError.message}` };
      }

      // If the user is an artist, insert artist-specific data
      if (userType === "artist") {
        const artistData: { id: string; artist_name?: string; portfolio_url?: string } = {
          id: data.user.id,
          artist_name: artistName || undefined,
        };

        if (portfolioUrl) {
          artistData.portfolio_url = portfolioUrl;
        }

        console.log("artistData", artistData); // Debug: check artistData before insert

        const { error: artistError } = await supabase.from("artists").insert([artistData]);

        if (artistError) {
          console.error("Fehler beim Insert in artists:", artistError);
          return { user: null, error: `Fehler beim Einfügen des Künstlers: ${artistError.message}` };
        }
      }

      return { user: { id: data.user.id, email: data.user.email ?? "" }, error: null };
    }

    return { user: null, error: "Unbekannter Fehler bei der Registrierung." };
  } catch (err) {
    return {
      user: null,
      error: `Ein unerwarteter Fehler ist aufgetreten: ${(err as Error).message}`,
    };
  }
}

// Function to log out the user
export async function logoutUser(): Promise<void> {
  await supabase.auth.signOut();  // Sign the user out
}
