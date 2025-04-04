import type { Config } from "tailwindcss"; // Importing the Config type from Tailwind CSS for type safety

export default {
  // Defining the content sources where Tailwind CSS should look for class names to purge
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",  // Scanning all JavaScript, TypeScript, JSX, TSX, and MDX files in the 'pages' directory
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Scanning all files in the 'components' directory
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Scanning all files in the 'app' directory
  ],

  // Extending the default theme to add custom configurations
  theme: {
    extend: {
      // Custom colors that can be used in the Tailwind classes
      colors: {
        background: "var(--background)", // Custom 'background' color using a CSS variable
        foreground: "var(--foreground)", // Custom 'foreground' color using a CSS variable
      },
      
      // Custom font families using CSS variables for flexibility
      fontFamily: {
        cinzel: 'var(--font-Cinzel)', // Custom font for 'Cinzel'
        playfairDisplay: 'var(--font-PlayfairDisplay)', // Custom font for 'PlayfairDisplay'
      },
    },
  },

  // Adding any Tailwind CSS plugins, if necessary (currently none are added)
  plugins: [],
} satisfies Config; // Ensuring the configuration satisfies the Tailwind CSS Config type
