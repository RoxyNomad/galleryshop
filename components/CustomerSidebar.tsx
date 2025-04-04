import styles from '@/styles/customer/sidebar.module.scss'; // Import the styles for the sidebar component
import Link from 'next/link'; // Import Next.js Link component for client-side navigation
import { useRouter } from 'next/router'; // Import Next.js router for programmatic navigation
import { logoutUser } from "@/services/authServices"; // Import the logout function from authentication services

const CustomerSidebar = () => {
  const router = useRouter(); // Initialize the Next.js router for navigation functions

  // Asynchronous function to handle logging out the user
  const handleLogout = async () => {
    await logoutUser(); // Call the logout function to log out the user
    router.push('/'); // Redirect the user to the homepage after logging out
  };

  return (
    <div>
      {/* Sidebar container */}
      <div className={styles.sidebar}>
        {/* Navigation links to different sections of the customer dashboard */}
        <Link href="/customer/shop" className={styles.sidebarLink1}>Zum Shop</Link>
        <Link href="/customer/messages" className={styles.sidebarLink2}>Nachrichten</Link>
        <Link href="/customer/myOrders" className={styles.sidebarLink3}>Meine Bestellungen</Link>
        <Link href="/customer/settings" className={styles.sidebarLink4}>Einstellungen</Link>
        {/* Logout button that triggers handleLogout function */}
        <button className={styles.sidebarButton} onClick={handleLogout}>Abmelden</button>
      </div>
    </div>
  );
};

export default CustomerSidebar; // Export the component for use in other parts of the application
