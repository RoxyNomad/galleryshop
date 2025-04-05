import { useState, useEffect } from 'react';
import { Artwork } from '@/services/types'; // Import the Artwork type definition
import { fetchArtworks } from '@/utils/data'; // Function to fetch all artworks
import { useSort } from '@/hooks/useSort'; // Custom hook for sorting functionality
import Image from 'next/image';
import styles from '@/styles/photography/photography.module.scss'; // Import SCSS styles
import SelectionBar from '@/components/SelectionBarPhotography'; // Component for sorting and filtering options

const Photography = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]); // State to store fetched artworks
  const { pictures, handleSortChange, selectedOption, sortOptions } = useSort(artworks); // Use sorting logic from custom hook
  const [selectedColor, setSelectedColor] = useState<string>(''); // State to store selected color filter

  useEffect(() => {
    const loadArtworks = async () => {
      const fetchedArtworks = await fetchArtworks(); // Fetch all artworks
      setArtworks(fetchedArtworks); // Update state with fetched artworks
    };

    loadArtworks(); // Trigger data fetching function
  }, []); // Run effect only once on component mount

  // Filter pictures based on the selected color
  const filteredPictures = selectedColor
    ? pictures.filter((pic) => pic.base_color.toLowerCase() === selectedColor.toLowerCase())
    : pictures;

  return (
    <div>
      {/* Selection bar for sorting and filtering options */}
      <SelectionBar 
        handleSortChange={handleSortChange} // Function to handle sorting changes
        selectedOption={selectedOption} // Current selected sorting option
        sortOptions={sortOptions} // Available sorting options
        handleColorChange={setSelectedColor} // Function to handle color selection
        pictures={pictures} // Pass the pictures array as a prop
      />

      <section>
        <div className={styles.pictureContainer}>
          {filteredPictures.length > 0 ? (
            filteredPictures.map((pic) => (
              <div key={pic.id} className={styles.pictureField}>
                <Image 
                  className={styles.picture} 
                  src={pic.image_url} 
                  alt={pic.name} 
                  width={200} 
                  height={150} 
                />
                <p className={styles.pictureLabel}>{pic.name} - {pic.price} CHF</p>
              </div>
            ))
          ) : (
            <p className={styles.noResults}>Keine Bilder gefunden</p> // Message if no pictures are found
          )}
        </div>
      </section>
    </div>
  );
};

export default Photography;
