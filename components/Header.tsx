import styles from '@/styles/global.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient'; // Supabase-Client importieren

interface Category {
  id: number;
  name: string;
}

const Header = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]); // State für Kategorien

  // Funktion zum Laden der Kategorien aus Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('id, name');
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data || []);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleLoginClick = () => {
    setShowLoginForm(!showLoginForm);
  };

  const handleSwitchForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search"
            aria-label="Search"
            className={styles.search}
          />
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink1}>Home</Link>
            <Link href="/novelties/novelties" className={styles.navLink2}>Neuheiten</Link>

            {/* Fotografien mit dynamischem Dropdown */}
            <div 
              className={styles.navItem} 
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <Link href="/photography/photography" className={styles.navLink3}>Fotografien</Link>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {categories.length > 0 ? (
                    categories.map(category => (
                      <Link key={category.id} href={`/photography/${category.id}`} passHref className={styles.dropdownItem}>{category.name}</Link>
                    ))
                  ) : (
                    <p className={styles.dropdownItem}>Keine Kategorien verfügbar</p>
                  )}
                </div>
              )}
            </div>

            <Link href="/artists" className={styles.navLink4}>Künstler</Link>
          </div>

          <div className={styles.navButtons}>
            <button className={styles.navButton} aria-label="Login" onClick={handleLoginClick}>
              <Image
                src='/icons/login-icon.png'
                alt='Login Icon'
                className={styles.buttonImage}
                width={18}
                height={18}
              />
            </button>

            {showLoginForm && (
              <>
                <div className={styles.modalOverlay} onClick={handleLoginClick} />
                <div className={styles.modal}>
                  {isLogin ? <LoginForm /> : <RegisterForm />}
                  <button 
                    onClick={handleSwitchForm} 
                    className={styles.switchButton}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{ 
                      backgroundColor: isHovered ? '#333333' : 'rgba(0, 0, 0, 0)', 
                      color: isHovered ? '#F7E7CE' : '#000000', 
                      border: '0.1vh solid #E6BE8A', 
                      borderRadius: '1vh', 
                      fontSize: '2vh', 
                      fontFamily: 'var(--font-playfair)', 
                      marginTop: '2vh',
                      cursor: 'pointer'
                    }}
                  >
                    {isLogin ? "Noch keinen Account? Registriere dich hier!" : "Schon ein Account? Logge dich hier ein!"}
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

export default Header;
