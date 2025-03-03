import styles from '@/styles/global.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '@/components/LoginForm'; // LoginForm importieren
import RegisterForm from '@/components/RegisterForm'; // RegisterForm importieren
import { useState } from 'react'; // useState importieren

const Header = () => {
	const [searchTerm, setSearchTerm] = useState<string>(''); // State für den Suchbegriff
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State für das Dropdown-Menü
  const [showLoginForm, setShowLoginForm] = useState(false); // Zustand für das Anzeigen des Formulars
  const [isLogin, setIsLogin] = useState(true); // Zustand für Login oder Registrierung (true = Login)
  const [isHovered, setIsHovered] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    setSearchTerm(event.target.value);
  }; // Funktion, die den Suchbegriff aktualisiert

  const handleLoginClick = () => {
    setShowLoginForm(!showLoginForm); // Toggle Login-Formular Sichtbarkeit
  };

  const handleSwitchForm = () => {
    setIsLogin(!isLogin); // Wechsel zwischen Login und Registrierung
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
            
            {/* Fotografien mit Dropdown */}
            <div 
              className={styles.navItem} 
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <Link href="/photography/photography" className={styles.navLink3}>Fotografien</Link>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link href="/photography/landscape" className={styles.dropdownItem}>Landschaft</Link>
                  <Link href="/photography/portraits" className={styles.dropdownItem}>Porträts</Link>
                  <Link href="/photography/street" className={styles.dropdownItem}>Street Photography</Link>
                  <Link href="/photography/photography" className={styles.dropdownItem}>Alle Fotografien</Link>
                </div>
              )}
            </div>

            <Link href="/artists" className={styles.navLink4}>Künstler</Link>
          </div>

          <div className={styles.navButtons}>
            <button
              className={styles.navButton}
              aria-label="Login"
              onClick={handleLoginClick} // Login-Button klickt das Login-Formular ein/aus
            >
              <Image
                src='/icons/login-icon.png'
                alt='Login Icon'
                className={styles.buttonImage}
                width={18}
                height={18}
              />
            </button>

            {/* Das Formular wird je nach Zustand angezeigt */}
            {showLoginForm && (
              <>
                {/* Overlay Hintergrund für Modal */}
                <div className={styles.modalOverlay} onClick={handleLoginClick} />

                <div className={styles.modal}>
                  {isLogin ? (
                    <LoginForm /> // Login-Formular wird angezeigt
                  ) : (
                    <RegisterForm /> // Registrierungs-Formular wird angezeigt
                  )}
                  <button onClick={handleSwitchForm} className={styles.switchButton}
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

            <button className={styles.navButton} aria-label="whishlist">
              <Image src='/icons/heart-icon.png' alt='wishlist icon' className={styles.buttonImage} width={18} height={18} />
            </button>
            <button className={styles.navButton} aria-label="cart">
              <Image src='/icons/shopping-cart-icon.png' alt='cart icon' className={styles.buttonImage} width={18} height={18} />
            </button>
          </div>
        </nav>
      </header>
		</div>
	)
}

export default Header;