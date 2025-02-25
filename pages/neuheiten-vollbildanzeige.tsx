import styles from '../styles/neuheiten-vollbildanzeige.module.scss';
import Link from 'next/link';

const Neuheiten = () => {
  return (
    <div>
      <section className={styles.selectionBar}>
        <div className={styles.displaySelection}>
          <Link href='/neuheiten'><button className={styles.displaySelectionButtonStandart}>Standardanzeige</button></Link> 
          <button className={styles.displaySelectionButtonFullscreen}>Vollbildanzeige</button>
        </div>
      </section>

      <section>
        <div className={styles.pictureContainer}>
          
        </div>
      </section>
    </div>
  );
};

export default Neuheiten;
