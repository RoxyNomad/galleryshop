import { useState } from 'react';
import styles from '../styles/neuheiten-vollbildanzeige.module.scss';
import Link from 'next/link';
import Image from 'next/image';

// Dummy-Bilder (sollten idealerweise aus einem globalen Zustand oder einer API kommen)
const pictures = [
  { id: 1, name: '1', src: '/images/pic1.jpg' },
    { id: 2, name: '2', src: '/images/pic2.jpg' },
    { id: 3, name: '3', src: '/images/pic3.jpg' },
    { id: 4, name: '4', src: '/images/pic4.jpg' },
    { id: 5, name: '5', src: '/images/pic5.jpg' },
    { id: 6, name: '6', src: '/images/pic6.jpg' },
    { id: 7, name: '7', src: '/images/pic7.jpg' },
    { id: 8, name: '8', src: '/images/pic8.jpg' },
    { id: 9, name: '9', src: '/images/pic9.jpg' },
    { id: 10, name: '10', src: '/images/pic10.jpg' },
    { id: 11, name: '11', src: '/images/pic11.jpg' },
    { id: 12, name: '12', src: '/images/pic12.jpg' },
    { id: 13, name: '13', src: '/images/pic13.jpg' },
    { id: 14, name: '14', src: '/images/pic14.jpg' },
    { id: 15, name: '15', src: '/images/pic15.jpg' },
    { id: 16, name: '16', src: '/images/pic16.jpg' }
];

const Neuheiten = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Index des aktuellen Bildes

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
          <Link href='/neuheiten'><button className={styles.displaySelectionButtonStandart}>Standardanzeige</button></Link> 
          <button className={styles.displaySelectionButtonFullscreen}>Vollbildanzeige</button>
        </div>
      </section>

      <section className={styles.fullscreenContainer}>
        <button className={styles.prevButton} onClick={prevImage}>Prev</button>
        <div className={styles.pictureContainer}>
          <div className={styles.top} />
          <div className={styles.left} />
          <div className={styles.middle}>
            {/* 🔹 Aktuelles Bild in der Mitte anzeigen */}
            <Image 
              src={pictures[currentIndex].src} 
              alt={pictures[currentIndex].name} 
              width={800} 
              height={600} 
              className={styles.fullscreenImage}
            />
            <p className={styles.imageCaption}>{pictures[currentIndex].name}</p>
          </div>
          <div className={styles.right} />
          <div className={styles.bottom} />
        </div>
        <button className={styles.nextButton} onClick={nextImage}>Next</button>
      </section>
    </div>
  );
};

export default Neuheiten;
