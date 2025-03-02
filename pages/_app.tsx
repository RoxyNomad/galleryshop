import type { AppProps } from 'next/app';
import { useState } from 'react'; // useState importieren
import { Layout } from './layout';
import styles from '../styles/global.module.scss';
import Link from 'next/link';
import Image from 'next/image';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [searchTerm, setSearchTerm] = useState<string>(''); // State für den Suchbegriff
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State für das Dropdown-Menü

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    setSearchTerm(event.target.value);
  }; // Funktion, die den Suchbegriff aktualisiert

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
            <Link href="/" className={styles.navLink1}>
              Home
            </Link>
            <Link href="/neuheiten" className={styles.navLink2}>
              Neuheiten
            </Link>
            
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

            <Link href="/kuenstler" className={styles.navLink4}>
              Künstler
            </Link>
          </div>

          <div className={styles.navButtons}>
            <button className={styles.navButton} aria-label="Benutzerprofil">
              <Image src='/icons/login-icon.png' alt='Login Icon' className={styles.buttonImage} width={18} height={18} />
            </button>
            <button className={styles.navButton} aria-label="Wunschliste">
              <Image src='/icons/heart-icon.png' alt='Login Icon' className={styles.buttonImage} width={18} height={18} />
            </button>
            <button className={styles.navButton} aria-label="Warenkorb">
              <Image src='/icons/shopping-cart-icon.png' alt='Login Icon' className={styles.buttonImage} width={18} height={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* Seiteninhalt */}
      <Component {...pageProps} />
    </Layout>
  );
}
