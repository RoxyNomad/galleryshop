import { NextPage } from 'next';
import styles from '@/styles/artistDashboard.module.scss'
import Link from 'next/link'

const ArtistDashboard: NextPage & { disableHeader?: boolean } = () => {
  return (
		<div>
			<div className={styles.sidebar}>
				<Link href="/artworks" className={styles.sidebarLink1}>Meine Werke</Link>
				<Link href="/orders" className={styles.sidebarLink2}>Bestellungen</Link>
				<Link href="/messages" className={styles.sidebarLink3}>Nachrichten</Link>
				<Link href="/profile" className={styles.sidebarLink4}>Mein Profil</Link>
				<Link href="/settings" className={styles.sidebarLink5}>Einstellungen</Link>
			</div>
		</div>
	)
};

ArtistDashboard.disableHeader = true;

export default ArtistDashboard;
