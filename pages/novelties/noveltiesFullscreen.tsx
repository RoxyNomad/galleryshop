import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Picture } from '@/services/types'; // Ensure this type is correctly defined
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/noveltiesFullscreen.module.scss';

const NoveltiesFullscreen = () => {
  const [pictures, setPictures] = useState<Picture[]>([]); // State to hold pictures fetched from the database
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current image index

  // 🔹 Fetch pictures from Supabase
  useEffect(() => {
    const fetchPictures = async () => {
      const { data, error } = await supabase
        .from('artworks') // 📌 Your table with images
        .select('id, name, image_url');

      if (error) {
        console.error('Error loading images:', error);
        return;
      }

      setPictures(data); // Set the fetched images into state
    };

    fetchPictures(); // Call the function to fetch images
  }, []);

  // 🔹 Function for the "Next" button
  const nextImage = () => {
    // Increase the index, and loop back to 0 when reaching the end of the array
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pictures.length);
  };

  // 🔹 Function for the "Prev" button
  const prevImage = () => {
    // Decrease the index, and loop back to the last image when going before the first one
    setCurrentIndex((prevIndex) => (prevIndex - 1 + pictures.length) % pictures.length);
  };

  return (
    <div>
      {/* Section for display options */}
      <section className={styles.selectionBar}>
        <div className={styles.displaySelection}>
          {/* Link to go back to standard view */}
          <Link href='/novelties/novelties'><button className={styles.displaySelectionButtonStandart}>Standardanzeige</button></Link> 
          {/* Current button for fullscreen display */}
          <button className={styles.displaySelectionButtonFullscreen}>Vollbildanzeige</button>
        </div>
      </section>

      {/* Section for the fullscreen image container */}
      <section className={styles.fullscreenContainer}>
        {/* Button for the previous image */}
        <button className={styles.prevButton} onClick={prevImage} disabled={pictures.length === 0}>
          Vorheriges
        </button>

        {/* Display the selected image */}
        <div className={styles.pictureContainer}>
          <div className={styles.top} />
          <div className={styles.left} />
          <div className={styles.middle}>
            {/* 🔹 Display a placeholder text if no images are loaded */}
            {pictures.length > 0 ? (
              <Image
                src={pictures[currentIndex].image_url} // Display the current image based on index
                alt={pictures[currentIndex].name} // Image description as alt text
                width={800} // Set image width
                height={600} // Set image height
                className={styles.fullscreenImage}
              />
            ) : (
              <p>🚀 Lade Bilder...</p> // Show loading message if no pictures are available
            )}
            {/* Caption below the image showing the name of the artwork */}
            <p className={styles.imageCaption}>
              {pictures.length > 0 ? pictures[currentIndex].name : 'Keine Bilder verfügbar'}
            </p>
          </div>
          <div className={styles.right} />
          <div className={styles.bottom} />
        </div>

        {/* Button for the next image */}
        <button className={styles.nextButton} onClick={nextImage} disabled={pictures.length === 0}>
          Nächstes
        </button>
      </section>
    </div>
  );
};

export default NoveltiesFullscreen;

