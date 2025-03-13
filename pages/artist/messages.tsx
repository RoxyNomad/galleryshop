import { NextPage } from "next";
import Sidebar from "@/components/ArtistSidebar";
import Chat from "@/components/Chat";

const ArtistMessages: NextPage & { disableHeader?: boolean } = () => {
  return (
    <div>
      <Sidebar />
      <Chat />
    </div>
  );
};

ArtistMessages.disableHeader = true;

export default ArtistMessages;

