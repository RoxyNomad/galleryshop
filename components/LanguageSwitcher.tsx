// components/LanguageSwitcher.tsx
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang); // Sprache ändern
  };

  return (
    <div>
      <button onClick={() => handleLanguageChange('de')}>Deutsch</button>
      <button onClick={() => handleLanguageChange('en')}>English</button>
			<button onClick={() => handleLanguageChange('fr')}>Französisch</button>
			<button onClick={() => handleLanguageChange('it')}>Italienisch</button>
    </div>
  );
};

export default LanguageSwitcher;
