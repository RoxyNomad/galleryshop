import { useState } from 'react';
import styles from '@/styles/fotografien.module.scss';
import Image from 'next/image';
import { picturesData } from './data';
import { useSort } from '@/hooks/useSort';
import Link from 'next/link';

const Landschaft = () => {
  const { selectedOption, sortOptions, pictures, handleSortChange } = useSort(
    picturesData.filter((pic) => pic.category === 'Landschaft')
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      {/* Auswahlleiste */}
      <section className={styles.selectionBar}>
        <div className={styles.displaySelection}>
          <button className={styles.displaySelectionButtonStandart}>Standardanzeige</button>
          <Link href='/fotografien-vollbildanzeige'><button className={styles.displaySelectionButtonFullscreen}>Vollbildanzeige</button></Link> 
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

      {/* Bilderanzeige */}
      <section>
        <div className={styles.pictureContainer}>
          {pictures.map((pic) => (
            <div key={pic.id} className={styles.picture}>
              <Image src={pic.src} alt={pic.name} width={200} height={150} />
              <p>{pic.name} - {pic.price} CHF</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landschaft;
