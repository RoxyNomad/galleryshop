import { useState, useEffect } from 'react';
import styles from '@/styles/photographyFullscreen.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/utils/supabaseClient';

const PhotographyFullscreen = () => {
  interface Picture {
    id: string;
    name: string;
    image_url: string;
  }

  const [pictures, setPictures] = useState<Picture[]>([]); // Bilder aus der DB
  const [currentIndex, setCurrentIndex] = useState(0); // Aktuelles Bild

  // 🔹 Bilder aus Supabase laden
  useEffect(() => {
    const fetchPictures = async () => {
      const { data, error } = await supabase
        .from('artworks') // 📌 Deine Tabelle mit Bildern
        .select('id, name, image_url');

      if (error) {
        console.error('Fehler beim Laden der Bilder:', error);
        return;
      }

      setPictures(data);
    };

    fetchPictures();
  }, []);

  // 🔹 Funktion für "Next"-Button
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pictures.length);
  };

  // 🔹 Funktion für "Prev"-Button
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
        <button className={styles.prevButton} onClick={prevImage} disabled={pictures.length === 0}>
          Prev
        </button>
        <div className={styles.pictureContainer}>
          <div className={styles.top} />
          <div className={styles.left} />
          <div className={styles.middle}>
            {/* 🔹 Falls keine Bilder geladen wurden, Platzhalter anzeigen */}
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
        <button className={styles.nextButton} onClick={nextImage} disabled={pictures.length === 0}>
          Next
        </button>
      </section>
    </div>
  );
};

export default PhotographyFullscreen;
