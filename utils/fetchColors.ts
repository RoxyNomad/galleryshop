import { supabase } from './supabaseClient';  // Path to your Supabase client

// Function to fetch unique base colors from the 'artworks' table
const fetchColors = async () => {
  // Fetching the distinct 'base_color' values from the 'artworks' table
  const { data, error } = await supabase
    .from('artworks')
    .select('base_color', { count: 'exact', head: false }) // Select only the unique values
    .not('base_color', 'is', null); // Exclude null values

  // If there is an error, log it and return an empty array
  if (error) {
    console.error('Error fetching colors:', error);
    return [];
  }

  // Returning the colors, if available
  return data.map((item) => item.base_color);
};

export default fetchColors;

