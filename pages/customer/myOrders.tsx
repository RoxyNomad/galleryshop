import { NextPage } from 'next';
import Sidebar from '@/components/CustomerSidebar'

const MyOrders: NextPage & { disableHeader?: boolean } = () => {
	return (
		<div>
			<Sidebar />
		</div>
	)
};

MyOrders.disableHeader = true;

export default MyOrders;