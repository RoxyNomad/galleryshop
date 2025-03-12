import { supabase } from './supabaseClient';  // Pfad zu deinem Supabase-Client

const fetchColors = async () => {
  // Abrufen der unterschiedlichen base_color-Werte aus der artworks-Tabelle
  const { data, error } = await supabase
    .from('artworks')
    .select('base_color', { count: 'exact', head: false }) // Nur einzigartige Werte abrufen
    .not('base_color', 'is', null); // Null-Werte ausschließen

  if (error) {
    console.error('Error fetching colors:', error);
    return [];
  }

  // Rückgabe der Farben, falls vorhanden
  return data.map((item) => item.base_color);
};

export default fetchColors;
