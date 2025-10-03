import { useState } from 'react';

const useTranslation = (defaultLanguage = 'en') => {
  const [language, setLanguage] = useState(defaultLanguage);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
  };

  const t = (translations) => {
    return translations[language] || translations.en;
  };

  return { language, setLanguage, toggleLanguage, t };
};

export default useTranslation;