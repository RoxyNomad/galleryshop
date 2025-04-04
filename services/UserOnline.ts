import { supabase } from '@/utils/supabaseClient'; // Import Supabase client instance

// Function to get the current authenticated user from Supabase
export async function getUser(): Promise<{ id: string; email: string; } | null> {
  // Attempt to get the user data from Supabase authentication
  const { data, error } = await supabase.auth.getUser();

  // If an error occurs during fetching the user
  if (error) {
    console.error("Fehler beim Abrufen des Benutzers:", error.message);  // Log the error message
    return null;  // Return null if there is an error
  }

  // If the user data exists and contains both the id and email, return them
  return data && data.user && data.user.id && data.user.email
    ? { id: data.user.id, email: data.user.email }  // Return the user data
    : null;  // Return null if user data is incomplete
}
