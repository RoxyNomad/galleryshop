import { NextPage } from 'next';
import Sidebar from '@/components/CustomerSidebar'

const Settings: NextPage & { disableHeader?: boolean } = () => {
	return (
		<div>
			<Sidebar />
		</div>
	)
};

Settings.disableHeader = true;

export default Settings;