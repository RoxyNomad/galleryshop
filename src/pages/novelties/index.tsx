import { useState, useEffect } from 'react';
import { fetchArtworks } from '@/src/utils/data';
import { useSort } from '@/src/hooks/useSort';
import { Artwork } from '@/src/services/types';
import Image from 'next/image';
import styles from '@/src/styles/novelties/novelties.module.scss';
import SelectionBar from '@/src/components/shop/SelectionBarNovelties';

const Novelties = () => {
  // State for holding fetched artworks
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  // Custom hook for sorting functionality
  const { pictures, handleSortChange, selectedOption, sortOptions } = useSort(artworks);

  // Fetching artworks from the server when the component is mounted
  useEffect(() => {
    const loadArtworks = async () => {
      const fetchedArtworks = await fetchArtworks();

      // Sort artworks by 'created_at' in descending order and take the first 4
      const sortedArtworks = fetchedArtworks
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4); // Only show 4 most recent artworks

      // Set the fetched and sorted artworks into state
      setArtworks(sortedArtworks);
    };

    loadArtworks(); // Call the loadArtworks function when the component mounts
  }, []);

  return (
    <div>
      {/* Sort selection bar */}
      <SelectionBar
        handleSortChange={handleSortChange} // Function to handle sort option change
        handleColorChange={() => {}} // Function for color change (currently not implemented)
        selectedOption={selectedOption} // The currently selected sorting option
        sortOptions={sortOptions} // The available sort options
        pictures={pictures} // Pass the sorted pictures to the selection bar
      />

      {/* Display of images */}
      <section>
        <div className={styles.pictureContainer}>
          {pictures.map((pic) => (
            <div key={pic.id} className={styles.pictureField}>
              {/* Image display */}
              <Image className={styles.picture} src={`${pic.image_url}`} alt={pic.name} width={200} height={150} />
              {/* Label showing name and price of the artwork */}
              <p className={styles.pictureLabel}>{pic.name} - {pic.price} CHF</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Novelties;
