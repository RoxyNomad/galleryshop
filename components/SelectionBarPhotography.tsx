import styles from '@/styles/selectionBar.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface SelectionBarProps {
  handleSortChange: (option: string) => void;
  selectedOption: string;
  sortOptions: string[];
  handleColorChange: (color: string) => void;  // Funktion zum Farbwechsel
}

const SelectionBar: React.FC<SelectionBarProps> = ({
  handleSortChange,
  selectedOption,
  sortOptions,
  handleColorChange, // Zugriff auf handleColorChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(''); // Zustand für die ausgewählte Farbe

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Farben für das Filter-Dropdown
  const colors = ['Rot', 'Grün', 'Blau', 'Orange', 'Gelb', 'Pink'];

  // Funktion zum Ändern der ausgewählten Farbe
  const handleColorSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const color = event.target.value;
    setSelectedColor(color);
    handleColorChange(color); // Übergibt die ausgewählte Farbe nach oben
  };

  return (
    <div>
      <section className={styles.selectionBar}>
        <div className={styles.displaySelection}>
          <button className={styles.displaySelectionButtonStandart}>
            Standardanzeige
          </button>
          <Link href="/photography/photographyFullscreen">
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
          {/* Dropdown-Menü für Farben */}
          <label htmlFor="colorFilter" className={styles.dropdownLabel}>Farbe auswählen:</label>
          <select
            id="colorFilter"
            value={selectedColor}
            onChange={handleColorSelect}
            className={styles.dropdownSelect}
          >
            <option value="">Alle Farben</option>
            {colors.map((color) => (
              <option
                key={color}
                value={color}
              >
                {color}
              </option>
            ))}
          </select>

        </div>
      </aside>

      {isSidebarOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </div>
  );
};

export default SelectionBar;
