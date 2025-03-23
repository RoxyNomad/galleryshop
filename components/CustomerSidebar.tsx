import styles from '@/styles/customer/shop.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logoutUser } from "@/services/authServices";

const CustomerSidebar = () => {
  const router = useRouter(); // Next.js Router für Navigation

  const handleLogout = async () => {
    await logoutUser(); // Benutzer ausloggen
    router.push('/'); // Nach dem Logout zur Startseite navigieren
  };

  return (
    <div>
      <div className={styles.sidebar}>
        <Link href="/customer/shop" className={styles.sidebarLink1}>Zum Shop</Link>
        <Link href="/customer/messages" className={styles.sidebarLink2}>Nachrichten</Link>
        <Link href="/customer/myOrders" className={styles.sidebarLink3}>Meine Bestellungen</Link>
        <Link href="/customer/settings" className={styles.sidebarLink4}>Einstellungen</Link>
        <button className={styles.sidebarButton} onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default CustomerSidebar;
