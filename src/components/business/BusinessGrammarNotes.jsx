import React from 'react';
import { Briefcase } from 'lucide-react';
import Card from '../shared/Card';

const BusinessGrammarNotes = ({ language = 'en' }) => {
  const businessPhrases = [
    {
      category: 'Email Opening',
      phrases: [
        { en: 'I am writing to inquire about...', pt: 'Escrevo para perguntar sobre...', context: 'Formal inquiry' },
        { en: 'Thank you for your email regarding...', pt: 'Obrigado pelo seu email sobre...', context: 'Response' }
      ]
    },
    {
      category: 'Presentations',
      phrases: [
        { en: 'Today, I will be discussing...', pt: 'Hoje, vou discutir...', context: 'Introduction' },
        { en: 'Let me start by giving you an overview...', pt: 'Deixe-me começar dando uma visão geral...', context: 'Beginning' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {businessPhrases.map((section, idx) => (
        <Card key={idx} hover={false}>
          <div className="flex items-center space-x-3 mb-4">
            <Briefcase className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold">{section.category}</h3>
          </div>
          
          <div className="space-y-3">
            {section.phrases.map((phrase, pIdx) => (
              <div key={pIdx} className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-lg mb-2">{phrase[language]}</p>
                <p className="text-sm text-slate-400">Context: {phrase.context}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BusinessGrammarNotes;