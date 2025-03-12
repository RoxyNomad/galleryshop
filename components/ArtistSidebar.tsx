import styles from '@/styles/artistDashboard.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logoutUser } from "@/services/authServices";

const ArtistSidebar = () => {
  const router = useRouter(); // Next.js Router für Navigation

  const handleLogout = async () => {
    await logoutUser(); // Benutzer ausloggen
    router.push('/'); // Nach dem Logout zur Startseite navigieren
  };

  return (
    <div>
      <div className={styles.sidebar}>
        <Link href="/artist/artworks" className={styles.sidebarLink1}>Meine Werke</Link>
        <Link href="/artist/orders" className={styles.sidebarLink2}>Bestellungen</Link>
        <Link href="/artist/messages" className={styles.sidebarLink3}>Nachrichten</Link>
        <Link href="/artist/profile" className={styles.sidebarLink4}>Mein Profil</Link>
        <Link href="/artist/settings" className={styles.sidebarLink5}>Einstellungen</Link>
        <button className={styles.sidebarButton} onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default ArtistSidebar;
