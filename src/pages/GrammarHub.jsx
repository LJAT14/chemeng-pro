import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import GrammarNoteCard from '../components/grammar/GrammarNoteCard';
import TranslationToggle from '../components/vocabulary/TranslationToggle';
import { grammarRules } from '../data/grammarRules';

const GrammarHub = () => {
  const [language, setLanguage] = useState('en');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold">Grammar Hub</h1>
        </div>
        <TranslationToggle language={language} setLanguage={setLanguage} />
      </div>

      <div className="grid gap-6">
        {grammarRules.map((rule) => (
          <GrammarNoteCard key={rule.id} note={rule} language={language} />
        ))}
      </div>
    </div>
  );
};

export default GrammarHub;