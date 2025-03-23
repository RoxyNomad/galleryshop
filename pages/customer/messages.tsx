import { NextPage } from "next";
import Sidebar from "@/components/CustomerSidebar";
import Chat from "@/components/Chat";
import styles from '@/styles/customer/shop.module.scss'

const CustomerMessages: NextPage & { disableHeader?: boolean } = () => {
	return (
		<div className={styles.shopContainer}>
			<Sidebar />
			<Chat />
		</div>
	);
};

CustomerMessages.disableHeader = true;

export default CustomerMessages;

