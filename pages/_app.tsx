import { useState } from 'react'; // useState importieren
import { AppProps } from 'next/app';
import { Layout } from './layout';
import styles from '@/styles/global.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '@/components/LoginForm'; // LoginForm importieren
import RegisterForm from '@/components/RegisterForm'; // RegisterForm importieren

export default function MyApp({ Component, pageProps }: AppProps) {
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
    <Layout>
      {/* Hintergrund */}
      <div className={styles.background} />

      {/* Navbar */}
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
            <Link href="/neuheiten" className={styles.navLink2}>Neuheiten</Link>
            
            {/* Fotografien mit Dropdown */}
            <div 
              className={styles.navItem} 
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <Link href="/fotografien" className={styles.navLink3}>Fotografien</Link>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link href="/fotografien/landschaft" className={styles.dropdownItem}>Landschaft</Link>
                  <Link href="/fotografien/portraits" className={styles.dropdownItem}>Porträts</Link>
                  <Link href="/fotografien/street" className={styles.dropdownItem}>Street Photography</Link>
                  <Link href="/fotografien" className={styles.dropdownItem}>Alle Fotografien</Link>
                </div>
              )}
            </div>

            <Link href="/kuenstler" className={styles.navLink4}>Künstler</Link>
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

            <button className={styles.navButton} aria-label="Wunschliste">
              <Image src='/icons/heart-icon.png' alt='Wunschliste Icon' className={styles.buttonImage} width={18} height={18} />
            </button>
            <button className={styles.navButton} aria-label="Warenkorb">
              <Image src='/icons/shopping-cart-icon.png' alt='Warenkorb Icon' className={styles.buttonImage} width={18} height={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* Seiteninhalt */}
      <Component {...pageProps} />
    </Layout>
  );
}
