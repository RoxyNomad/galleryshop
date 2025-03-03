import { AppProps } from 'next/app';
import { NextPage } from 'next';
import { Layout } from './layout';
import styles from '@/styles/global.module.scss';

type CustomAppProps = AppProps & {
  Component: NextPage & { disableHeader?: boolean };
};

export default function MyApp({ Component, pageProps }: CustomAppProps) {
  return (
    <Layout disableHeader={Component.disableHeader}>
      {/* Hintergrund */}
      <div className={styles.background} />

      {/* Seiteninhalt */}
      <Component {...pageProps} />
    </Layout>
  );
}
