import { NextPage } from 'next';
import styles from '@/styles/products/cancel.module.scss';

// Define the CancelPage component as a Next.js page
// It also has a custom property `disableHeader` to hide the header
const CancelPage: NextPage & { disableHeader?: boolean } = () => {
  return (
    <div className={styles.container}>
      {/* Display a message when the checkout or payment is canceled */}
      <h1 className={styles.sentence}>
        Ihr Checkout und die Zahlung wurden abgebrochen.<br />
        Falls es zu mehreren Fehlschlägen kommt,<br />
        kontaktieren Sie bitte den Support.
      </h1>
    </div>
  );
};

// Set the `disableHeader` property to true to hide the header on this page
CancelPage.disableHeader = true;

export default CancelPage;
