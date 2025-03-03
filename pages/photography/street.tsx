import { useState, useEffect } from 'react';
import styles from '@/styles/photography.module.scss';
import Image from 'next/image';
import { fetchArtworks, Artwork } from './data';
import { useSort } from '@/hooks/useSort';
import SelectionBar from '@/components/SelectionBarPhotography';

const Street = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  // Fetch die Artworks aus Supabase
  useEffect(() => {
    const loadArtworks = async () => {
      const fetchedArtworks = await fetchArtworks();
      setArtworks(fetchedArtworks);
    };

    loadArtworks();
  }, []); // Der leere Array bedeutet, dass der Effekt nur einmal beim ersten Rendern ausgeführt wird.

  // UUID der "Landschaft"-Kategorie
  const streetCategoryId = '24092ccf-c106-4122-8093-56312d156d08';

  // Filtere die Artworks nach der Kategorie UUID (Landschaft)
  const { selectedOption, sortOptions, pictures, handleSortChange } = useSort(
    artworks.filter((pic) => pic.category_id === streetCategoryId)
  );

  return (
    <div>
      {/* Sortierleiste */}
      <SelectionBar 
        pictures={pictures}
        handleSortChange={handleSortChange} 
        selectedOption={selectedOption}
        sortOptions={sortOptions}
      />

      {/* Bilderanzeige */}
      <section>
        <div className={styles.pictureContainer}>
          {pictures.map((pic) => (
            <div key={pic.id} className={styles.picture}>
              {/* Verwende die Bild-ID, um das Bild aus dem Pfad abzurufen */}
              <Image 
                src={`/path/to/images/${pic.id}.jpg`} 
                alt={pic.name} 
                width={200} 
                height={150} 
              />
              <p>{pic.name} - {pic.price} CHF</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Street;