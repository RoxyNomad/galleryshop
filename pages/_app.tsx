import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/utils/supabaseClient"; // Import your Supabase client
import { AppProps } from "next/app";
import { NextPage } from "next";
import { Layout } from "./layout";
import styles from "@/styles/global.module.scss";

// Define a custom type for the app props, including the optional `disableHeader` property
// This ensures that each page component can specify whether the header should be hidden
type CustomAppProps = AppProps & {
  Component: NextPage & { disableHeader?: boolean };
};

// The main application component that wraps all pages
export default function MyApp({ Component, pageProps }: CustomAppProps) {
  return (
    // Provide Supabase authentication context to the entire app
    <SessionContextProvider supabaseClient={supabase}>
      {/* Wrap the page inside the Layout component, passing the `disableHeader` property */}
      <Layout disableHeader={Component.disableHeader}>
        {/* Background styling */}
        <div className={styles.background} />

        {/* Render the actual page content */}
        <Component {...pageProps} />
      </Layout>
    </SessionContextProvider>
  );
}
