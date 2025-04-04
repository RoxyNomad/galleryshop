import { NextPage } from "next"; // Importing the NextPage type from Next.js
import Sidebar from "@/components/CustomerSidebar"; // Importing the Sidebar component for customers
import Chat from "@/components/Chat"; // Importing the Chat component to handle messaging
import styles from '@/styles/customer/shop.module.scss'; // Importing the styles for the customer shop page

// The main CustomerMessages component
const CustomerMessages: NextPage & { disableHeader?: boolean } = () => {
  return (
    <div className={styles.shopContainer}> {/* Wrapping the page content in a container with specific styles */}
      <Sidebar /> {/* Adding the Sidebar component to the page */}
      <Chat /> {/* Adding the Chat component to the page */}
    </div>
  );
};

// Disabling the header for this page
CustomerMessages.disableHeader = true;

export default CustomerMessages; // Exporting the CustomerMessages component for use in other parts of the app


