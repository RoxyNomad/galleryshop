import { useState, useEffect } from 'react';
import { Artwork } from '@/services/types'; // Import Artwork type
import styles from '@/styles/photography.module.scss';
import Image from 'next/image';
import { fetchArtworks } from '@/utils/data'; // Alle Artworks abrufen
import { useSort } from '@/hooks/useSort';
import SelectionBar from '@/components/SelectionBarPhotography';

const Photography = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const { pictures, handleSortChange, selectedOption, sortOptions } = useSort(artworks);
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    const loadArtworks = async () => {
      const fetchedArtworks = await fetchArtworks(); // Alle Artworks abrufen
      setArtworks(fetchedArtworks);
    };

    loadArtworks();
  }, []);

  const filteredPictures = selectedColor
    ? pictures.filter((pic) => pic.base_color.toLowerCase() === selectedColor.toLowerCase())
    : pictures;

  return (
    <div>
      <SelectionBar 
        handleSortChange={handleSortChange}
        selectedOption={selectedOption}
        sortOptions={sortOptions}
        handleColorChange={setSelectedColor} 
      />

      <section>
        <div className={styles.pictureContainer}>
          {filteredPictures.length > 0 ? (
            filteredPictures.map((pic) => (
              <div key={pic.id} className={styles.pictureField}>
                <Image className={styles.picture} src={pic.image_url} alt={pic.name} width={200} height={150} />
                <p className={styles.pictureLabel}>{pic.name} - {pic.price} CHF</p>
              </div>
            ))
          ) : (
            <p className={styles.noResults}>Keine Bilder gefunden</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Photography;