import { supabase } from '@/utils/supabaseClient';
import { Artwork } from '@/services/types'; // Importing the Artwork type from the types file

// 🔹 Fetch all artworks from the database
export const fetchArtworks = async (): Promise<Artwork[]> => {
  // Performing the query to select all columns from the 'artworks' table
  const { data, error } = await supabase
    .from('artworks') 
    .select('*'); // Selecting all columns

  // If there is an error, log it and return an empty array
  if (error) {
    console.error('Error fetching artworks:', error.message);
    return [];
  }

  // Return the data as an array of Artwork objects
  return data as Artwork[];
};

// 🔹 Fetch artworks filtered by category
export const fetchArtworksByCategory = async (categoryId: string): Promise<Artwork[]> => {
  // Performing the query to select all columns where the 'category_id' matches the provided categoryId
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('category_id', categoryId); // Filtering by category_id

  // If there is an error, log it and return an empty array
  if (error) {
    console.error(`Error fetching artworks for category ${categoryId}:`, error.message);
    return [];
  }

  // Return the data as an array of Artwork objects
  return data as Artwork[];
};

