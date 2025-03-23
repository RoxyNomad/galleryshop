import { supabase } from '@/utils/supabaseClient';

// Typ für Artworks
export interface Artwork {
  id: string;
  name: string;
  base_color: string;
  price: number;
  created_at: string;
  artist_id: string;
  category_id: string;
  image_url: string;
}

// 🔹 Alle Artworks abrufen
export const fetchArtworks = async (): Promise<Artwork[]> => {
  const { data, error } = await supabase
    .from('artworks') 
    .select('*'); // Alle Spalten abrufen

  if (error) {
    console.error('Fehler beim Abrufen der Artworks:', error.message);
    return [];
  }

  return data as Artwork[];
};

// 🔹 Artworks nach Kategorie abrufen
export const fetchArtworksByCategory = async (categoryId: string): Promise<Artwork[]> => {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('category_id', categoryId); // Nur Artworks mit dieser Kategorie-ID abrufen

  if (error) {
    console.error(`Fehler beim Abrufen der Artworks für Kategorie ${categoryId}:`, error.message);
    return [];
  }

  return data as Artwork[];
};
