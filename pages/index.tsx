import styles from '@/styles/index.module.scss'  // Import styles from the stylesheet
import Link from 'next/link'  // Import Link component for routing in Next.js

const Index = () => {
  return (
    <div>
      {/* Hero section with a headline and call-to-action button */}
      <section className={styles.heroSection}>
        <div className={styles.headline}>The Art of Elegance</div>  {/* Main headline */}
        
        {/* Call-to-action button that links to the 'Neuheiten' page */}
        <button className={styles.ctaButton}>
          <Link href='/neuheiten' className={styles.ctaLink}>Jetzt Entdecken</Link>  {/* Button link */}
        </button>
      </section>

      {/* Footer section */}
      <footer className={styles.footer}></footer>
    </div>
  );
}

export default Index;
