import { useState, useEffect } from 'react';
import { Picture } from '@/src/services/types'; // Import the Picture type definition
import { supabase } from '@/src/utils/neonClient'; // Import Supabase client
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/src/styles/photography/photographyFullscreen.module.scss'; // Import SCSS styles

const PhotographyFullscreen = () => {
  const [pictures, setPictures] = useState<Picture[]>([]); // State to store images from the database
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current image index

  // 🔹 Fetch images from Supabase
  useEffect(() => {
    const fetchPictures = async () => {
      const { data, error } = await supabase
        .from('artworks') // 📌 Your table containing images
        .select('id, name, image_url');

      if (error) {
        console.error('Fehler beim Laden der Bilder:', error); // Log error if fetching fails
        return;
      }

      setPictures(data); // Update state with fetched images
    };

    fetchPictures(); // Invoke the function to fetch data
  }, []); // Run effect only once on component mount

  // 🔹 Function to navigate to the next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pictures.length);
  };

  // 🔹 Function to navigate to the previous image
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + pictures.length) % pictures.length);
  };

  return (
    <div>
      <section className={styles.selectionBar}>
        <div className={styles.displaySelection}>
          <Link href='/photography/photography'>
            <button className={styles.displaySelectionButtonStandart}>Standardanzeige</button>
          </Link>
          <button className={styles.displaySelectionButtonFullscreen}>Vollbildanzeige</button>
        </div>
      </section>

      <section className={styles.fullscreenContainer}>
        {/* Previous image button, disabled if no images are loaded */}
        <button className={styles.prevButton} onClick={prevImage} disabled={pictures.length === 0}>
          Prev
        </button>
        <div className={styles.pictureContainer}>
          <div className={styles.top} />
          <div className={styles.left} />
          <div className={styles.middle}>
            {/* 🔹 Display placeholder if no images are loaded */}
            {pictures.length > 0 ? (
              <Image
                src={pictures[currentIndex].image_url}
                alt={pictures[currentIndex].name}
                width={800}
                height={600}
                className={styles.fullscreenImage}
              />
            ) : (
              <p>🚀 Lade Bilder...</p>
            )}
            <p className={styles.imageCaption}>
              {pictures.length > 0 ? pictures[currentIndex].name : 'Keine Bilder verfügbar'}
            </p>
          </div>
          <div className={styles.right} />
          <div className={styles.bottom} />
        </div>
        {/* Next image button, disabled if no images are loaded */}
        <button className={styles.nextButton} onClick={nextImage} disabled={pictures.length === 0}>
          Next
        </button>
      </section>
    </div>
  );
};

export default PhotographyFullscreen;
