import { useState, useEffect } from 'react';
import styles from '@/styles/photography.module.scss';
import Image from 'next/image';
import { fetchArtworks } from './data';
import { useSort } from '@/hooks/useSort';
import SelectionBar from '@/components/SelectionBarPhotography';

const Photography = () => {
  interface Artwork {
    id: string;
    name: string;
    base_color: string;
    price: number;
    created_at: string;
    artist_id: string;
    category_id: string;
    image_url: string;
  }

  const [artworks, setArtworks] = useState<Artwork[]>([]); // Daten vom Server
  const { pictures, handleSortChange, selectedOption, sortOptions } = useSort(artworks);
  const [selectedColor, setSelectedColor] = useState<string>(''); // Zustand für die ausgewählte Farbe

  useEffect(() => {
    const loadArtworks = async () => {
      const fetchedArtworks = await fetchArtworks();
      setArtworks(fetchedArtworks);
    };

    loadArtworks();
  }, []);

  // Filtert die Artworks basierend auf der ausgewählten Farbe
  const filteredPictures = selectedColor
    ? pictures.filter((pic) => pic.base_color.toLowerCase() === selectedColor.toLowerCase())
    : pictures;

  // Funktion für die Farbfilterung
  const handleColorChange = (color: string) => {
    setSelectedColor(color); // Setzt die ausgewählte Farbe
  };

  return (
    <div>
      {/* Sortierleiste */}
      <SelectionBar 
        handleSortChange={handleSortChange}
        selectedOption={selectedOption}
        sortOptions={sortOptions}
        handleColorChange={handleColorChange} // Gibt den Handler weiter
      />

      {/* Bilderanzeige */}
      <section>
        <div className={styles.pictureContainer}>
          {filteredPictures.map((pic) => (
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

export default Photography;
