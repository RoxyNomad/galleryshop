import styles from '../styles/index.module.scss'
import Link from 'next/link'

const Index = () => {
	return (
		<div>
			<section className={styles.heroSection}>
				<div className={styles.headline}>The Art of Elegance</div>
				<button className={styles.ctaButton}><Link href='/neuheiten' className={styles.ctaLink} >Jetzt Entdecken</Link></button>
			</section>
			<footer className={styles.footer}></footer>
		</div>
	)
}

export default Index