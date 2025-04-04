import { useState, useEffect } from 'react';
import styles from '@/styles/selectionBar.module.scss';
import fetchColors from '@/utils/fetchColors';  // Import the fetchColors function
import Link from 'next/link';
import Image from 'next/image';
import { SelectionBarProps } from '@/services/types';

// Functional component for the selection bar
const SelectionBar: React.FC<SelectionBarProps> = ({
  handleSortChange,
  selectedOption,
  sortOptions,
  handleColorChange,
}) => {
  // State for handling the dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State for handling the sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State for the selected color
  const [selectedColor, setSelectedColor] = useState<string>("");

  // State to store available colors
  const [colors, setColors] = useState<string[]>([]);

  // Toggle the dropdown menu
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Toggle the sidebar visibility
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fetch colors from Supabase when the component mounts
  useEffect(() => {
    const loadColors = async () => {
      const colorsFromDB = await fetchColors();
      setColors(colorsFromDB); // Set the fetched colors
    };

    loadColors();
  }, []);  // Empty dependency array means this runs once when the component is first loaded

  // Handle color selection change
  const handleColorSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const color = event.target.value;
    setSelectedColor(color);  // Update the selected color state
    handleColorChange(color); // Pass the selected color to the parent component
  };

  return (
    <div>
      <section className={styles.selectionBar}>
        <div className={styles.displaySelection}>
          {/* Standard display button */}
          <button className={styles.displaySelectionButtonStandart}>
            Standardanzeige
          </button>
          {/* Fullscreen display button */}
          <Link href="/photography/photographyFullscreen">
            <button className={styles.displaySelectionButtonFullscreen}>
              Vollbildanzeige
            </button>
          </Link>
        </div>
        <div className={styles.sortSelection}>
          {/* Filter button to toggle sidebar */}
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
          {/* Sort button to toggle dropdown */}
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
                    onChange={() => handleSortChange(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sidebar for additional filters */}
      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <h2>Filter</h2>
          {/* Close button to hide the sidebar */}
          <button className={styles.closeButton} onClick={toggleSidebar}>
            ✖
          </button>
        </div>
        <div className={styles.sidebarContent}>
          {/* Dropdown menu for selecting a color */}
          <label htmlFor="colorFilter" className={styles.dropdownLabel}>
            Farbe auswählen:
          </label>
          <select
            id="colorFilter"
            value={selectedColor}
            onChange={handleColorSelect}
            className={styles.dropdownSelect}
          >
            {/* Default option */}
            <option value="">Alle Farben</option>
            {/* Map through the colors and create an option for each one */}
            {colors.length > 0 ? (
              colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))
            ) : (
              <option>Keine Farben verfügbar</option>  // If no colors are available
            )}
          </select>
        </div>
      </aside>

      {/* Overlay to close the sidebar when clicked outside */}
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={toggleSidebar}></div>
      )}
    </div>
  );
};

export default SelectionBar;
