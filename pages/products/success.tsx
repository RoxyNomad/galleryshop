import { NextPage } from 'next';
import styles from '@/styles/products/success.module.scss';

// Define the SuccessPage component as a Next.js page
// It also has a custom property `disableHeader` to hide the header
const SuccessPage: NextPage & { disableHeader?: boolean } = () => {
  return (
    <div className={styles.container}>
      {/* Display a message when the payment is successful */}
      <h1 className={styles.sentence}>
        Vielen Dank für deinen Einkauf.<br />
        Deine Zahlung war erfolgreich.
      </h1>
    </div>
  );
};

// Set the `disableHeader` property to true to hide the header on this page
SuccessPage.disableHeader = true;

export default SuccessPage;
