import styles from '@/styles/artists/sidebar.module.scss'; // Import the CSS module for styling
import Link from 'next/link'; // Import the Link component from Next.js for client-side navigation
import { useRouter } from 'next/router'; // Import the Next.js router for programmatic navigation
import { logoutUser } from "@/services/authServices"; // Import the logout function from authentication services

// Define the sidebar component for artists
const ArtistSidebar = () => {
  const router = useRouter(); // Initialize the Next.js router for navigation functions

  // Asynchronous function to log out the user
  const handleLogout = async () => {
    await logoutUser(); // Call the logout function to log out the user
    router.push('/'); // Redirect the user to the homepage after logout
  };

  return (
    <div>
      {/* Container for the sidebar */}
      <div className={styles.sidebar}>
        {/* Navigation links to different sections of the artist dashboard */}
        <Link href="/artist/artistDashboard" className={styles.sidebarLink1}>Dashboard</Link>
        <Link href="/artist/artworks" className={styles.sidebarLink2}>Meine Werke</Link>
        <Link href="/artist/orders" className={styles.sidebarLink3}>Bestellungen</Link>
        <Link href="/artist/messages" className={styles.sidebarLink4}>Nachrichten</Link>
        <Link href="/artist/profile" className={styles.sidebarLink5}>Mein Profil</Link>
        {/* Logout button that triggers handleLogout */}
        <button className={styles.sidebarButton} onClick={handleLogout}>Abmelden</button>
      </div>
    </div>
  );
};

export default ArtistSidebar; // Export the component for use in other parts of the application
