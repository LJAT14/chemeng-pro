import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import BusinessGrammarNotes from '../components/business/BusinessGrammarNotes';
import EmailTemplates from '../components/business/EmailTemplates';
import PresentationTips from '../components/business/PresentationTips';
import NegotiationPhrases from '../components/business/NegotiationPhrases';
import TranslationToggle from '../components/vocabulary/TranslationToggle';

const BusinessEnglish = () => {
  const [language, setLanguage] = useState('en');
  const [activeSection, setActiveSection] = useState('grammar');

  const sections = [
    { id: 'grammar', label: 'Business Grammar' },
    { id: 'emails', label: 'Email Templates' },
    { id: 'presentations', label: 'Presentations' },
    { id: 'negotiations', label: 'Negotiations' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Briefcase className="w-8 h-8 text-green-400" />
          <h1 className="text-4xl font-bold">Business English</h1>
        </div>
        <TranslationToggle language={language} setLanguage={setLanguage} />
      </div>

      <nav className="flex space-x-2 bg-slate-900/50 rounded-full p-1 border border-slate-800/50">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const buttonClass = isActive 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
            : 'text-slate-400 hover:text-white';
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={'px-6 py-2 rounded-full transition-all duration-300 ' + buttonClass}
            >
              {section.label}
            </button>
          );
        })}
      </nav>

      {activeSection === 'grammar' && <BusinessGrammarNotes language={language} />}
      {activeSection === 'emails' && <EmailTemplates />}
      {activeSection === 'presentations' && <PresentationTips />}
      {activeSection === 'negotiations' && <NegotiationPhrases />}
    </div>
  );
};

export default BusinessEnglish;