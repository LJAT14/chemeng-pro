// src/pages/BusinessEnglish.jsx
import React, { useState } from 'react';
import { Briefcase, Mail, Users, Presentation, Handshake } from 'lucide-react';
import Card from '../components/shared/Card';
import { businessPhrases } from '../data/businessPhrases';

const BusinessEnglish = () => {
  const [language, setLanguage] = useState('en');
  const [selectedCategory, setSelectedCategory] = useState('emails');

  const categories = [
    { id: 'emails', label: 'Email Writing', icon: Mail },
    { id: 'meetings', label: 'Meetings', icon: Users },
    { id: 'presentations', label: 'Presentations', icon: Presentation },
    { id: 'negotiation', label: 'Negotiation', icon: Handshake }
  ];

  const renderEmailPhrases = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4 text-purple-400">Email Openings</h3>
        {businessPhrases.emails.openings.map((section, idx) => (
          <Card key={idx} className="mb-4">
            <h4 className="font-semibold text-lg mb-3">{section.situation}</h4>
            <div className="space-y-2">
              {section.phrases.map((phrase, pIdx) => (
                <div key={pIdx} className="p-3 bg-slate-800 rounded-lg">
                  <p className="text-slate-200">{phrase[language]}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4 text-purple-400">Email Closings</h3>
        {businessPhrases.emails.closings.map((section, idx) => (
          <Card key={idx} className="mb-4">
            <h4 className="font-semibold text-lg mb-3">{section.situation}</h4>
            <div className="space-y-2">
              {section.phrases.map((phrase, pIdx) => (
                <div key={pIdx} className="p-3 bg-slate-800 rounded-lg">
                  <p className="text-slate-200">{phrase[language]}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMeetingPhrases = () => (
    <div className="space-y-6">
      {Object.entries(businessPhrases.meetings).map(([key, phrases]) => (
        <div key={key}>
          <h3 className="text-xl font-bold mb-4 text-purple-400 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {phrases.map((phrase, idx) => (
              <div key={idx} className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <p className="text-slate-200">{phrase[language]}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPresentationPhrases = () => (
    <div className="space-y-6">
      {Object.entries(businessPhrases.presentations).map(([key, phrases]) => (
        <div key={key}>
          <h3 className="text-xl font-bold mb-4 text-purple-400 capitalize">
            {key}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {phrases.map((phrase, idx) => (
              <div key={idx} className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <p className="text-slate-200">{phrase[language]}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderNegotiationPhrases = () => (
    <div className="space-y-6">
      {Object.entries(businessPhrases.negotiation).map(([key, phrases]) => (
        <div key={key}>
          <h3 className="text-xl font-bold mb-4 text-purple-400 capitalize">
            {key}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {phrases.map((phrase, idx) => (
              <div key={idx} className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <p className="text-slate-200">{phrase[language]}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (selectedCategory) {
      case 'emails':
        return renderEmailPhrases();
      case 'meetings':
        return renderMeetingPhrases();
      case 'presentations':
        return renderPresentationPhrases();
      case 'negotiation':
        return renderNegotiationPhrases();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Briefcase className="w-8 h-8 text-green-400" />
          <h1 className="text-4xl font-bold">Business English</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              language === 'en' ? 'bg-green-500' : 'bg-slate-800'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('pt')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              language === 'pt' ? 'bg-green-500' : 'bg-slate-800'
            }`}
          >
            Português
          </button>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <p className="text-blue-400 font-semibold mb-2">💼 Professional Phrases</p>
        <p className="text-slate-300 text-sm">
          Master essential business English phrases for emails, meetings, presentations, and negotiations.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-xl transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <Icon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium text-center">{cat.label}</p>
            </button>
          );
        })}
      </div>

      {renderContent()}
    </div>
  );
};

export default BusinessEnglish;