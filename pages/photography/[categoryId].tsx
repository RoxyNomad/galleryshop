import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Artwork } from '@/services/types'; // Import Artwork type
import styles from '@/styles/photography.module.scss';
import Image from 'next/image';
import { fetchArtworksByCategory } from '@/utils/data';
import { useSort } from '@/hooks/useSort';
import SelectionBar from '@/components/SelectionBarPhotography';

const CategoryPage = () => {
  const router = useRouter();
  const { categoryId } = router.query;

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const { pictures, handleSortChange, selectedOption, sortOptions } = useSort(artworks);
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    if (!categoryId) return;

    const loadArtworks = async () => {
      const fetchedArtworks = await fetchArtworksByCategory(categoryId as string);
      setArtworks(fetchedArtworks);
    };

    loadArtworks();
  }, [categoryId]);

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
            <p className={styles.noResults}>Keine Bilder in dieser Kategorie</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
