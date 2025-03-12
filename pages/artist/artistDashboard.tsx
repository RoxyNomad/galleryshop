import { NextPage } from 'next';
import Sidebar from '@/components/ArtistSidebar'
import OrdersChart from '@/components/OrdersChart';

const ArtistDashboard: NextPage & { disableHeader?: boolean } = () => {
  return (
		<div>
			<Sidebar />
			<OrdersChart />
		</div>
	)
};

ArtistDashboard.disableHeader = true;

export default ArtistDashboard;
