import { NextPage } from "next";
import Sidebar from "@/components/ArtistSidebar"; // Sidebar component for navigation
import Chat from "@/components/Chat"; // Chat component for messaging

// ArtistMessages page component
const ArtistMessages: NextPage & { disableHeader?: boolean } = () => {
  return (
    <div>
      {/* Sidebar component for artist navigation */}
      <Sidebar />

      {/* Chat component to handle messaging */}
      <Chat />
    </div>
  );
};

// Disable header for this page
ArtistMessages.disableHeader = true;

export default ArtistMessages;


