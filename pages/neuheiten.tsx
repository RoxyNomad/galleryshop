import { useState } from 'react';
import styles from '../styles/neuheiten.module.scss';
import Image from 'next/image';
import Link from 'next/link';

const Neuheiten = () => {
  // 🔹 State für Dropdown & ausgewählte Sortierung
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('Beliebtheit');
  
  // 🔹 Dummy-Bilder mit verschiedenen Attributen
  const [pictures, setPictures] = useState([
    { id: 1, name: 'Bild 1', src: '/images/pic1.jpg', date: '2024-02-10', price: 20, popularity: 5 },
    { id: 2, name: 'Bild 2', src: '/images/pic2.jpg', date: '2024-02-08', price: 30, popularity: 7 },
    { id: 3, name: 'Bild 3', src: '/images/pic3.jpg', date: '2024-02-06', price: 25, popularity: 4 },
    { id: 4, name: 'Bild 4', src: '/images/pic4.jpg', date: '2024-02-05', price: 50, popularity: 8 },
    { id: 5, name: 'Bild 5', src: '/images/pic5.jpg', date: '2024-02-02', price: 15, popularity: 3 },
    { id: 6, name: 'Bild 6', src: '/images/pic6.jpg', date: '2024-01-30', price: 40, popularity: 6 },
    { id: 7, name: 'Bild 7', src: '/images/pic7.jpg', date: '2024-01-25', price: 10, popularity: 2 },
    { id: 8, name: 'Bild 8', src: '/images/pic8.jpg', date: '2024-01-20', price: 60, popularity: 9 },
    { id: 9, name: 'Bild 9', src: '/images/pic9.jpg', date: '2024-01-15', price: 35, popularity: 5 },
    { id: 10, name: 'Bild 10', src: '/images/pic10.jpg', date: '2024-01-10', price: 55, popularity: 7 },
    { id: 11, name: 'Bild 11', src: '/images/pic11.jpg', date: '2024-01-05', price: 45, popularity: 8 },
    { id: 12, name: 'Bild 12', src: '/images/pic12.jpg', date: '2024-01-01', price: 20, popularity: 4 },
    { id: 13, name: 'Bild 13', src: '/images/pic13.jpg', date: '2024-02-06', price: 25, popularity: 4 },
    { id: 14, name: 'Bild 14', src: '/images/pic14.jpg', date: '2024-02-05', price: 50, popularity: 8 },
    { id: 15, name: 'Bild 15', src: '/images/pic15.jpg', date: '2024-02-02', price: 15, popularity: 3 },
    { id: 16, name: 'Bild 16', src: '/images/pic16.jpg', date: '2024-01-30', price: 40, popularity: 6 }
  ]);

  // 🔹 Sortier-Optionen
  const sortOptions = ['Beliebtheit', 'Neueste', 'Preis aufsteigend', 'Preis absteigend'];

  // 🔹 Funktion zum Öffnen/Schließen des Dropdowns
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 🔹 Sortier-Funktion
  const handleSortChange = (option: string) => {
    setSelectedOption(option); // Auswahl speichern
    setIsDropdownOpen(false); // Dropdown schließen

    const sortedPictures = [...pictures];

    switch (option) {
      case 'Beliebtheit':
        sortedPictures.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'Neueste':
        sortedPictures.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'Preis aufsteigend':
        sortedPictures.sort((a, b) => a.price - b.price);
        break;
      case 'Preis absteigend':
        sortedPictures.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setPictures(sortedPictures); // Neu sortierte Liste setzen
  };

  return (
    <div>
      {/* 🔹 Auswahlleiste für Anzeige & Sortierung */}
      <section className={styles.selectionBar}>
        <div className={styles.displaySelection}>
          <button className={styles.displaySelectionButtonStandart}>Standardanzeige</button>
          <Link href='/neuheiten-vollbildanzeige'><button className={styles.displaySelectionButtonFullscreen}>Vollbildanzeige</button></Link> 
        </div>
        <div className={styles.sortSelection}>
          <button className={styles.sortSelectionButton}>
            <Image src='/icons/filter-icon.png' alt='Filter Icon' className={styles.buttonImage} width={18} height={18} />
            Filter
          </button>
          {/* 🔹 Sortieren nach Button */}
          <button className={styles.sortSelectionButton} onClick={toggleDropdown}>
            <Image src='/icons/sorting-icon.png' alt='Sorting Icon' className={styles.buttonImage} width={18} height={18} />
            Sortieren nach
          </button>
          {/* 🔹 Dropdown-Menü */}
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {sortOptions.map((option) => (
                <label key={option} className={styles.dropdownItem}>
                  <input
                    type="checkbox"
                    checked={selectedOption === option}
                    onChange={() => handleSortChange(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 🔹 Bilderliste */}
      <section>
        <div className={styles.pictureContainer}>
          {pictures.map((pic) => (
            <div key={pic.id} className={styles.picture}>
              <Image src={pic.src} alt={pic.name} width={200} height={150} />
              <p>{pic.name} - {pic.price}CHF</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Neuheiten;
