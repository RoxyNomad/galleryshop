import type { AppProps } from 'next/app';
import styles from '../styles/global.module.scss';
import Link from 'next/link';
import { useState } from 'react'; // useState importieren

export default function MyApp({ Component, pageProps }: AppProps) {
  // State für den Suchbegriff
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Funktion, die den Wert des Eingabefeldes aktualisiert
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      {/* Hintergrund */}
      <div className={styles.background} />

      {/* Navbar */}
      <header className={styles.header}>
        <nav className={styles.nav}>
          <input 
            type="text" 
            value={searchTerm} 
            onChange={handleInputChange} 
            placeholder="&#x1F50D; Search" 
            aria-label="Search" 
            className={styles.search} 
          />
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLinkFirst}>
              Home
            </Link>
            <Link href="/neuheiten" className={styles.navLink}>
              Neuheiten
            </Link>
            <Link href="/fotografien" className={styles.navLink}>
              Fotografien
            </Link>
            <Link href="/künstler" className={styles.navLink}>
              Künstler
            </Link>
            <Link href="/art-finder" className={styles.navLinkLast}>
              Art Finder
            </Link>
          </div>

          <div className={styles.navButtons}>
            <button className={styles.navButton} aria-label="Benutzerprofil">&#x1F464;</button>
            <button className={styles.navButton} aria-label="Wunschliste">&#x2661;</button>
            <button className={styles.navButton} aria-label="Warenkorb">&#x1F6D2;</button>
          </div>
        </nav>
      </header>

      {/* Seiteninhalt */}
      <Component {...pageProps} />
    </div>
  );
}
