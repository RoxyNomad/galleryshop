import styles from '@/styles/selectionBar.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Artwork } from '../pages/photography/data';

interface SelectionBarProps {
  pictures: Artwork[]; 
  handleSortChange: (option: string) => void; 
  selectedOption: string; 
  sortOptions: string[]; 
}

const SelectionBar: React.FC<SelectionBarProps> = ({
  handleSortChange,
  selectedOption,
  sortOptions,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div>
      <section className={styles.selectionBar}>
        <div className={styles.displaySelection}>
          <button className={styles.displaySelectionButtonStandart}>
            Standardanzeige
          </button>
          <Link href="/novelties/noveltiesFullscreen">
            <button className={styles.displaySelectionButtonFullscreen}>
              Vollbildanzeige
            </button>
          </Link>
        </div>
        <div className={styles.sortSelection}>
          <button className={styles.sortSelectionButton} onClick={toggleSidebar}>
            <Image
              src="/icons/filter-icon.png"
              alt="Filter Icon"
              className={styles.buttonImage}
              width={18}
              height={18}
            />
            Filter
          </button>
          <button className={styles.sortSelectionButton} onClick={toggleDropdown}>
            <Image
              src="/icons/sorting-icon.png"
              alt="Sorting Icon"
              className={styles.buttonImage}
              width={18}
              height={18}
            />
            Sortieren nach
          </button>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {sortOptions.map((option) => (
                <label key={option} className={styles.dropdownItem}>
                  <input
                    type="radio"
                    name="sort"
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

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2>Filter</h2>
          <button className={styles.closeButton} onClick={toggleSidebar}>
            ✖
          </button>
        </div>
        <div className={styles.sidebarContent}>
          <p>Hier können später Filteroptionen hinzugefügt werden.</p>
        </div>
      </aside>

      {isSidebarOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </div>
  );
};

export default SelectionBar;
