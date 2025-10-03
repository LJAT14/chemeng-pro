import React from 'react';
import { Languages } from 'lucide-react';

const TranslationToggle = ({ language, setLanguage }) => {
  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
      className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors border border-slate-700"
    >
      <Languages className="w-5 h-5" />
      <span className="font-medium">{language === 'en' ? 'EN' : 'PT-BR'}</span>
    </button>
  );
};

export default TranslationToggle;