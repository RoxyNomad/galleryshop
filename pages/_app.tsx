import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/utils/supabaseClient"; // Importiere dein Supabase-Client!
import { AppProps } from "next/app";
import { NextPage } from "next";
import { Layout } from "./layout";
import styles from "@/styles/global.module.scss";

type CustomAppProps = AppProps & {
  Component: NextPage & { disableHeader?: boolean };
};

export default function MyApp({ Component, pageProps }: CustomAppProps) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Layout disableHeader={Component.disableHeader}>
        {/* Hintergrund */}
        <div className={styles.background} />

        {/* Seiteninhalt */}
        <Component {...pageProps} />
      </Layout>
    </SessionContextProvider>
  );
}
