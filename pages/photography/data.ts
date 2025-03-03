import { supabase } from '@/utils/supabaseClient';

// Typ für das Artwork
export interface Artwork {
  id: string;
  name: string;
  base_color: string;
  price: number;
  created_at: string;
  artist_id: string;
  category_id: string;
}

// Funktion zum Abrufen der Artworks aus Supabase
export const fetchArtworks = async (): Promise<Artwork[]> => {
  const { data, error } = await supabase
    .from('artworks') // Tabelle in Supabase
    .select('*'); // Alle Spalten abrufen

  if (error) {
    console.error('Fehler beim Abrufen der Artworks:', error.message);
    return [];
  }

  return data as Artwork[];
};
