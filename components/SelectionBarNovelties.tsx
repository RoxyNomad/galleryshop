import { useState, useEffect } from 'react';
import { SelectionBarProps } from '@/services/types';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/components/selectionBar.module.scss';
import fetchColors from '@/utils/fetchColors';  // Import the fetchColors function to retrieve colors from the database

const SelectionBar: React.FC<SelectionBarProps> = ({
  handleSortChange,
  handleColorChange,
  selectedOption,
  sortOptions,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // State to control the visibility of the dropdown
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // State to control the visibility of the sidebar
  const [selectedColor, setSelectedColor] = useState<string>(""); // State for the selected color
  const [colors, setColors] = useState<string[]>([]); // State to store the available colors

  // Toggle function to open/close the dropdown
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Toggle function to open/close the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fetch colors from Supabase when the component first mounts
  useEffect(() => {
    const loadColors = async () => {
      const colorsFromDB = await fetchColors();  // Fetch colors from the database
      setColors(colorsFromDB); // Set the fetched colors to the state
    };

    loadColors();  // Call the loadColors function
  }, []); // Empty dependency array ensures this runs only once after the initial render

  // Function to handle color selection
  const handleColorSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const color = event.target.value; // Get the selected color
    setSelectedColor(color);  // Update the selected color state
    handleColorChange(color); // Pass the selected color to the parent component
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
          {/* Dropdown menu for sorting options */}
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {sortOptions.map((option) => (
                <label key={option} className={styles.dropdownItem}>
                  <input
                    type="radio"
                    name="sort"
                    checked={selectedOption === option}
                    onChange={() => handleSortChange(option)} // Handle sorting option change
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sidebar for filter options */}
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
          {/* Dropdown menu for selecting color */}
          <label htmlFor="colorFilter" className={styles.dropdownLabel}>
            Farbe auswählen:
          </label>
          <select
            id="colorFilter"
            value={selectedColor}
            onChange={handleColorSelect}  // Handle color selection
            className={styles.dropdownSelect}
          >
            <option value="">Alle Farben</option>
            {/* Render available colors as options */}
            {colors.length > 0 ? (
              colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))
            ) : (
              <option>Keine Farben verfügbar</option>  // Fallback message if no colors are available
            )}
          </select>
        </div>
      </aside>

      {/* Overlay background when the sidebar is open */}
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default SelectionBar;
