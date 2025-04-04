import { dirname } from "path"; // Importing the 'dirname' function from the 'path' module
import { fileURLToPath } from "url"; // Importing the 'fileURLToPath' function from the 'url' module
import { FlatCompat } from "@eslint/eslintrc"; // Importing FlatCompat from ESLint for configuration compatibility

// Get the current file name from the import meta URL and convert it to a file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current file
const __dirname = dirname(__filename);

// Initialize the ESLint configuration compatibility with the base directory set to the current directory
const compat = new FlatCompat({
  baseDirectory: __dirname, // Setting the base directory to the current directory
});

// Extending ESLint configurations for Next.js core web vitals and TypeScript support
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"), // Including necessary configurations for Next.js and TypeScript
];

// Exporting the ESLint configuration for use in the project
export default eslintConfig;
