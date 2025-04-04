// src/next-i18next.d.ts
import 'react-i18next'; // Importing the 'react-i18next' module for TypeScript type support

// Define the available keys for the translation files
declare module 'react-i18next' {
  // Extending the DefaultNamespace to include the 'common' namespace for translations
  interface DefaultNamespace {
    // Linking the 'common' namespace to the German translation file located at '@/public/locales/de/common.json'
    common: typeof import('@/public/locales/de/common.json');
  }
}

