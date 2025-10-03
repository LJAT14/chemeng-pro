import fs from 'fs';

const pages = {
  'src/pages/GrammarHub.jsx': `import React, { useState } from 'react';
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

export default GrammarHub;`,

  'src/pages/VocabularyHub.jsx': `import React, { useState } from 'react';
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

export default VocabularyHub;`,

  'src/pages/InterviewSimulator.jsx': `import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import AIInterviewChat from '../components/interview/AIInterviewChat';
import InterviewScenarios from '../components/interview/InterviewScenarios';
import { interviewQuestions } from '../data/interviewQuestions';

const InterviewSimulator = () => {
  const [selectedScenario, setSelectedScenario] = useState(null);

  const getQuestionsByScenario = (scenario) => {
    return interviewQuestions.filter(q => q.category === scenario);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Briefcase className="w-8 h-8 text-orange-400" />
        <h1 className="text-4xl font-bold">AI Interview Simulator</h1>
      </div>

      {!selectedScenario ? (
        <>
          <p className="text-slate-400 text-lg">Choose an interview scenario to begin practicing</p>
          <InterviewScenarios onSelectScenario={setSelectedScenario} />
        </>
      ) : (
        <div>
          <button onClick={() => setSelectedScenario(null)} className="mb-4 text-purple-400 hover:text-purple-300 transition-colors">
            ← Back to scenarios
          </button>
          <AIInterviewChat questions={getQuestionsByScenario(selectedScenario)} />
        </div>
      )}
    </div>
  );
};

export default InterviewSimulator;`
};

Object.entries(pages).forEach(([path, content]) => {
  fs.writeFileSync(path, content);
  console.log('Restored:', path);
});

console.log('\n✓ Pages restored. Run: npm run dev');