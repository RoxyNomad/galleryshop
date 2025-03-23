import { useState, useEffect } from 'react';
import styles from '@/styles/selectionBar.module.scss';
import fetchColors from '@/utils/fetchColors';  // Importiere die fetchColors-Funktion
import Link from 'next/link';
import Image from 'next/image';
import { SelectionBarProps } from '@/services/types';

const SelectionBar: React.FC<SelectionBarProps> = ({
  handleSortChange,
  handleColorChange,
  selectedOption,
  sortOptions,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(""); // Zustand für die ausgewählte Farbe
  const [colors, setColors] = useState<string[]>([]); // Zustand für die Farben

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Hole die Farben von Supabase beim ersten Laden
  useEffect(() => {
    const loadColors = async () => {
      const colorsFromDB = await fetchColors();
      setColors(colorsFromDB); // Setze die Farben
    };

    loadColors();
  }, []);

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
          <Link href="/novelties/noveltiesFullscreen">
            <button className={styles.displaySelectionButtonFullscreen}>
              Vollbildanzeige
            </button>
          </Link>
        </div>
        <div className={styles.sortSelection}>
          <button
            className={styles.sortSelectionButton}
            onClick={toggleSidebar}
          >
            <Image
              src="/icons/filter-icon.png"
              alt="Filter Icon"
              className={styles.buttonImage}
              width={18}
              height={18}
            />
            Filter
          </button>
          <button
            className={styles.sortSelectionButton}
            onClick={toggleDropdown}
          >
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

      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <h2>Filter</h2>
          <button className={styles.closeButton} onClick={toggleSidebar}>
            ✖
          </button>
        </div>
        <div className={styles.sidebarContent}>
          {/* Dropdown-Menü für Farben */}
          <label htmlFor="colorFilter" className={styles.dropdownLabel}>
            Farbe auswählen:
          </label>
          <select
            id="colorFilter"
            value={selectedColor}
            onChange={handleColorSelect}
            className={styles.dropdownSelect}
          >
            <option value="">Alle Farben</option>
            {colors.length > 0 ? (
              colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))
            ) : (
              <option>Keine Farben verfügbar</option>
            )}
          </select>
        </div>
      </aside>

      {isSidebarOpen && (
        <div className={styles.overlay} onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default SelectionBar;
