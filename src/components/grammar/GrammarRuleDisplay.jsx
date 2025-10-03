import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Card from '../shared/Card';

const GrammarRuleDisplay = ({ rule, language = 'en' }) => {
  return (
    <Card hover={false}>
      <h3 className="text-2xl font-bold mb-4">{rule.title[language]}</h3>
      <p className="text-slate-300 mb-6">{rule.explanation[language]}</p>
      
      <h4 className="text-lg font-semibold text-purple-400 mb-3">Rules:</h4>
      <ul className="space-y-2">
        {rule.rules.map((r, idx) => (
          <li key={idx} className="flex items-start space-x-2">
            <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <span className="text-slate-300">{r[language]}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default GrammarRuleDisplay;