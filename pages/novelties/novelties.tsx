import { useState, useEffect } from 'react';
import styles from '@/styles/novelties.module.scss';
import Image from 'next/image';
import { fetchArtworks } from '@/utils/data';
import { useSort } from '@/hooks/useSort';
import SelectionBar from '@/components/SelectionBarNovelties';
import { Artwork } from '@/services/types';

const Novelties = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]); // Daten vom Server
  const { pictures, handleSortChange, selectedOption, sortOptions } = useSort(artworks);

  useEffect(() => {
    const loadArtworks = async () => {
      const fetchedArtworks = await fetchArtworks();

      // Sortiere die Artworks nach 'created_at' (absteigend) und nehme nur die ersten 4
      const sortedArtworks = fetchedArtworks
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4);

      setArtworks(sortedArtworks);
    };

    loadArtworks();
  }, []);

  return (
    <div>
      {/* Sortierleiste */}
      <SelectionBar
        handleSortChange={handleSortChange}
        handleColorChange={() => {}}
        selectedOption={selectedOption}
        sortOptions={sortOptions}
        pictures={pictures} // Übergibt die Bilder an die Auswahlleiste
      />

      {/* Bilderanzeige */}
      <section>
        <div className={styles.pictureContainer}>
          {pictures.map((pic) => (
            <div key={pic.id} className={styles.pictureField}>
              <Image className={styles.picture} src={`${pic.image_url}`} alt={pic.name} width={200} height={150} />
              <p className={styles.pictureLabel}>{pic.name} - {pic.price} CHF</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Novelties;
