import { NextPage } from 'next';
import Sidebar from '@/components/ArtistSidebar';
import OrdersChart from '@/components/OrdersChart';

// Define the ArtistDashboard component as a Next.js page
// It also has a custom property 'disableHeader' to control layout behavior
const ArtistDashboard: NextPage & { disableHeader?: boolean } = () => {
  return (
    <div>
      {/* Sidebar component for artist navigation */}
      <Sidebar />
      {/* Chart component for the orders from clients */}
      <OrdersChart />
    </div>
  );
};

// Disable the default header for this page
ArtistDashboard.disableHeader = true;

export default ArtistDashboard;
