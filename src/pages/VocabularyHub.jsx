import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import VocabList from '../components/vocabulary/VocabList';
import VocabQuiz from '../components/vocabulary/VocabQuiz';
import TranslationToggle from '../components/vocabulary/TranslationToggle';
import Button from '../components/shared/Button';
import { vocabulary } from '../data/vocabulary';

const VocabularyHub = () => {
  const [language, setLanguage] = useState('en');
  const [mode, setMode] = useState('browse');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-8 h-8 text-blue-400" />
          <h1 className="text-4xl font-bold">Vocabulary Hub</h1>
        </div>
        <div className="flex items-center space-x-3">
          <TranslationToggle language={language} setLanguage={setLanguage} />
          <Button onClick={() => setMode(mode === 'browse' ? 'quiz' : 'browse')} variant="outline">
            {mode === 'browse' ? 'Start Quiz' : 'Browse Terms'}
          </Button>
        </div>
      </div>

      {mode === 'browse' ? (
        <VocabList vocabulary={vocabulary} language={language} />
      ) : (
        <VocabQuiz terms={vocabulary} />
      )}
    </div>
  );
};

export default VocabularyHub;