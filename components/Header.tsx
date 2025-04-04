import styles from '@/styles/global.module.scss'; // Import global styles for the header component
import Link from 'next/link'; // Import Link component from Next.js for client-side navigation
import Image from 'next/image'; // Import Image component from Next.js for optimized images
import LoginForm from '@/components/LoginForm'; // Import the LoginForm component
import RegisterForm from '@/components/RegisterForm'; // Import the RegisterForm component
import { useState, useEffect } from 'react'; // Import React hooks for state and effect handling
import { supabase } from '@/utils/supabaseClient'; // Import the Supabase client for database operations

// Type definition for the category object
interface Category {
  id: number;
  name: string;
}

const Header = () => {
  // State to manage search input, dropdown visibility, form visibility, and categories
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]); // State for storing categories

  // Fetch categories from Supabase when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('id, name');
      if (error) {
        console.error('Error fetching categories:', error); // Log error if categories cannot be fetched
      } else {
        setCategories(data || []); // Set categories state with fetched data or an empty array
      }
    };

    fetchCategories(); // Call the function to fetch categories on component mount
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Handle the change in the search input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Update search term state
  };

  // Toggle the display of the login form when the login button is clicked
  const handleLoginClick = () => {
    setShowLoginForm(!showLoginForm); // Toggle the login form visibility
  };

  // Switch between login and register forms
  const handleSwitchForm = () => {
    setIsLogin(!isLogin); // Toggle between login and register form
  };

  return (
    <div>
      <header className={styles.header}>
        <nav className={styles.nav}>
          {/* Search input for searching through content */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange} // Bind the input change to update the search term
            placeholder="Suche..."
            aria-label="Search"
            className={styles.search} // Apply custom search input styles
          />
          <div className={styles.navLinks}>
            {/* Navigation links */}
            <Link href="/" className={styles.navLink1}>Home</Link>
            <Link href="/novelties/novelties" className={styles.navLink2}>Neuheiten</Link>

            {/* Photography section with dynamic dropdown for categories */}
            <div 
              className={styles.navItem} 
              onMouseEnter={() => setIsDropdownOpen(true)} // Show dropdown on hover
              onMouseLeave={() => setIsDropdownOpen(false)} // Hide dropdown when mouse leaves
            >
              <Link href="/photography/photography" className={styles.navLink3}>Fotografien</Link>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {/* Map over the categories to display them in the dropdown */}
                  {categories.length > 0 ? (
                    categories.map(category => (
                      <Link key={category.id} href={`/photography/${category.id}`} passHref className={styles.dropdownItem}>
                        {category.name}
                      </Link>
                    ))
                  ) : (
                    <p className={styles.dropdownItem}>Keine Kategorie Verfügbar</p> // Show this message if there are no categories
                  )}
                </div>
              )}
            </div>

            <Link href="/artists" className={styles.navLink4}>Künstler</Link>
          </div>

          <div className={styles.navButtons}>
            {/* Button to open the login form */}
            <button className={styles.navButton} aria-label="Login" onClick={handleLoginClick}>
              <Image
                src='/icons/login-icon.png' // Login icon image
                alt='Login Icon'
                className={styles.buttonImage} // Apply custom styles to the button image
                width={18}
                height={18}
              />
            </button>

            {/* Display login or register form based on state */}
            {showLoginForm && (
              <>
                {/* Overlay to close the modal when clicked */}
                <div className={styles.modalOverlay} onClick={handleLoginClick} />
                <div className={styles.modal}>
                  {/* Render either the login or register form */}
                  {isLogin ? <LoginForm /> : <RegisterForm />}
                  {/* Button to switch between login and register forms */}
                  <button 
                    onClick={handleSwitchForm} 
                    className={styles.switchButton}
                    onMouseEnter={() => setIsHovered(true)} // Change button style on hover
                    onMouseLeave={() => setIsHovered(false)}
                    style={{ 
                      backgroundColor: isHovered ? '#333333' : 'rgba(0, 0, 0, 0)', // Change background color on hover
                      color: isHovered ? '#F7E7CE' : '#000000', // Change text color on hover
                      border: '0.1vh solid #E6BE8A', // Border style
                      borderRadius: '1vh', // Border radius
                      fontSize: '2vh', // Font size
                      fontFamily: 'var(--font-playfair)', // Font style
                      marginTop: '2vh',
                      cursor: 'pointer' // Change cursor to pointer on hover
                    }}
                  >
                    {isLogin ? "Kein Konto? Hier Registrieren!" : "Konto vorhanden? Hier Anmelden!"}
                  </button>
                </div>
              </>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header; // Export the Header component for use in other parts of the application
