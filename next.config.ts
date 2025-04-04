import type { NextConfig } from "next"; // Importing the NextConfig type for type safety

// Defining the Next.js configuration object
const nextConfig: NextConfig = {
  images: {
    // Whitelisting the domain from which images can be loaded in the Next.js application
    domains: ['uceuspeazpichiszzqgr.supabase.co'],
  },
};

// Exporting the configuration object as the default export
export default nextConfig;
