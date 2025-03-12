import { useState, useEffect } from 'react';
import styles from '@/styles/photography.module.scss';
import Image from 'next/image';
import { fetchArtworks, Artwork } from '@/utils/data';
import { useSort } from '@/hooks/useSort';
import SelectionBar from '@/components/SelectionBarPhotography';

const Portraits = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]); // Für die gefilterten Artworks

  // Fetch die Artworks aus Supabase
  useEffect(() => {
    const loadArtworks = async () => {
      const fetchedArtworks = await fetchArtworks();
      setArtworks(fetchedArtworks);
      setFilteredArtworks(fetchedArtworks); // Initial alle Artworks setzen
    };

    loadArtworks();
  }, []); // Der leere Array bedeutet, dass der Effekt nur einmal beim ersten Rendern ausgeführt wird.

  // UUID der "Landschaft"-Kategorie
  const portraitsCategoryId = '7cd86054-ae1a-4e0e-b255-e85705b13ae7';

  // Filtere die Artworks nach der Kategorie UUID (Landschaft)
  const { selectedOption, sortOptions, pictures, handleSortChange } = useSort(
    filteredArtworks.filter((pic) => pic.category_id === portraitsCategoryId)
  );

  // Funktion zum Handhaben der Farbänderung
  const handleColorChange = (color: string) => {
    if (color === '') {
      // Wenn keine Farbe ausgewählt ist, alle Artworks anzeigen
      setFilteredArtworks(artworks.filter((pic) => pic.category_id === portraitsCategoryId));
    } else {
      // Filtere nach der ausgewählten Farbe
      setFilteredArtworks(
        artworks.filter(
          (pic) => pic.category_id === portraitsCategoryId && pic.base_color.toLowerCase() === color.toLowerCase()
        )
      );
    }
  };

  return (
    <div>
      {/* Sortierleiste */}
      <SelectionBar 
        handleSortChange={handleSortChange} 
        selectedOption={selectedOption}
        sortOptions={sortOptions}
        handleColorChange={handleColorChange} // Übergibt handleColorChange
      />

      <section>
        <div className={styles.pictureContainer}>
          {pictures.map((pic) => (
            <div key={pic.id} className={styles.pictureField}>
              {/* Verwende die Bild-ID, um das Bild aus dem Pfad abzurufen */}
              <Image className={styles.picture} src={`${pic.image_url}`} alt={pic.name} width={200} height={150} />
              <p className={styles.pictureLabel}>{pic.name} - {pic.price} CHF</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Portraits;